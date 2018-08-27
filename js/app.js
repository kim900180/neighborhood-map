// Global Variables
var map, largeInfowindow, bounds;

// Draw Map
function initMap() {
    // Map Styles
    var styles = [
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ];
    
    // Request Map, Infowindow, Bounds and set U of I to the center
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.110445, lng: -88.230956},
        zoom: 16,
        styles: styles,
        mapTypeControl: false
    });
    
    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
        
    ko.applyBindings(new ViewModel());
}

// Error Handling
function googleMapsError() {
    alert('Something went wrong with Google Maps');
}

// Create Markers with title, position, type, and street(Foursquare)
var locationMarker = function(data) {
    var self = this;

    this.title = data.title;
    this.position = data.location;
    this.type = data.type;
    this.street = '';
    
    this.visible = ko.observable(true);
    
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    
    // Foursquare Request and Data Acquisition
    var clientID = 'CESL4EPRUKUX1JLLS5PVCOTBB2YKXIZTLLOMUXXDCLVLDLQI';
    var clientSecret = 'YBEFXG03X2HWVD0110BMGBQB5CD5D4BPFOB23UQ1EDCUKBFA';
    var url = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180627' + '&limit=1';
    
    $.getJSON(url).done(function(data) {
        var response = data.response.venues[0];
        self.street = response.location.formattedAddress[0];
    }).fail(function() {
        alert('Something went wrong with foursquare');
    });
    
    // Define Marker Attributes
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        type: this.type,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP
    });
    
    // Bounds
    self.filterMarkers = ko.computed(function() {
        if(self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });
    
    // Click Events
    this.marker.addListener('click', function() {
        populateInfoWindow(this, self.street, largeInfowindow);
        toggleBounce(this);
        map.panTo(this.getPosition());
    });
    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
        toggleBounce(this);
    });
    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });
}

// Style Marker Icon
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
  }
}

// Information Window
function populateInfoWindow(marker, street, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;        
        
        // Marker property cleared if the infow window is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        
        // Street View Function
        var getStreetView = function(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent('<h4>' + marker.title + '</h4><p>' + street + '</p><span id="type">' + marker.type + '</span><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 20
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<h4>' + marker.title + '</h4><p>' + street + '</p><div>No Street View Found</div>');
            }
        };
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}

// View Model
function ViewModel() {
    var self = this;
    
    this.markers = ko.observableArray([]);

    // Push markers to array
    locations.forEach(function(location) {
        self.markers.push(new locationMarker(location));
    });
    
    // Filter Markers by Type
//    this.filters = ko.observableArray(filters);
//    this.filter = ko.observable('');
//    this.items = ko.observableArray(this.items);
//    this.filteredItems = ko.computed(function() {
//        var filter = self.filter();
//        if (!filter || filter == "None") {
//            return self.items();
//        } else {
//            return ko.utils.arrayFilter(self.items(), function(i) {
//                return i.type == filter;
//            });
//        }
//    });
//    
    // Filter Markers with Search
    this.searchItem = ko.observable('');
    
    // locations viewed on map
    this.list = ko.computed(function() {
        var searchFilter = self.searchItem().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.markers(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(searchFilter);
                location.visible(result);
				return result;
			});
        }
        self.markers().forEach(function(location) {
            location.visible(true);
        });
        return self.markers();
    }, self);
}