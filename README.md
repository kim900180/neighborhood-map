# Neighborhood Map Project
This app allows users to view predefined restaurants and cafes near E. Green st. of University of Illinois at Urbana Champaign campus. 

## How to Use
**1. By direct clicking on markers** <br/>
User can directly click on the blue markers shown on the map to view the information. 

**2. By clicking on the items in navigation bar** <br/>
First to view the items in the navigation bar, user must open it by clicking on the 'hamburger' icon which will show list of registered restaurants and cafes. By clicking on any item, the user can view information on each list. To close the navigation bar, user must click the 'hamburger' menu again.

**3. By filtering** <br/>
The user can also filter items through filter. Once the user opens the navigation bar, user can type the name of the restaurants or cafes. The map will filter out all the unmatching entries allowing the user to view only the ones he or she searched for.

## Tools
The neighborhood map is built utilizing the following code, libraries and API <br/>
1. HTML <br/>
2. CSS <br/>
3. JavaScript <br/>
4. jQuery 3.3.1<br/>
5. Bootstrap 4.1.1 <br/>
6. KnockoutJS 3.4.2<br/>
7. Google Maps API <br/>
8. FourSquare API <br/>

## Files 
Following are short explanations of files <br/>
1. `index.html` <br/>
`index.html` is a file that contains codes for structuring and data-binding of the app using KnockoutJS. It also calls the necessary links, libraries, Google Maps API. 

2. `styles.css` <br/>
`styles.css` is a file that containes codes for styling the website. However, it does not contain styling of Google Maps which is included in the `app.js`. 

3. markers.js <br/>
`markers.js` contains data of restaurants and cafes near the area.

4. `app.js` <br/>
`app.js` contains code for necessary functions and ViewModel for running the app. The Google Map styles is also a part of this file. 

5. `knockout-3.4.2.js` <br/>
`knockout-3.4.2.js` is a knockout library used for this app which is downloaded directly from the [knockout website](http://knockoutjs.com/) and was unedited.

## Reference
[https://getbootstrap.com/](https://getbootstrap.com/)<br/>
[http://knockoutjs.com/](http://knockoutjs.com/)<br/>
[https://developers.google.com/maps/documentation/](https://developers.google.com/maps/documentation/)<br/>
[https://developer.foursquare.com/](https://developer.foursquare.com/)