import './style.css';
import ko from 'knockout';
import * as VenuesAPI from './placesapi.js'
const shouter =  new ko.subscribable();
export default shouter;

let map;
let vm;
let infowindow;
let markers=[];

export const pyrmontLoc = {
  lat: -33.8665433,
  lng: 151.1956316
}

const MaxListItems = 12;


const api_url = 'https://api.foursquare.com/v2/venues/search'

const restaurantsStore = window.localStorage;

function Restaurant(name) {
    var self = this;
    self.name = name;
}

function RestaurantViewModel() {
    var self = this;

    self.restaurants = ko.observableArray([]);

    self.filterInput = ko.observable();

    self.cardSelected = function(){
      let marker = markers.filter( m => m.id == this.id)[0];
      google.maps.event.trigger(marker, 'click');
    }

    self.dataAvalaible = shouter.subscribe( function(newValue) {

      let rest = JSON.parse(restaurantsStore.getItem('availableRestaurnts'));

      if(rest.length > 0 ){
        rest.map( r => self.restaurants.push(new Restaurant(r.name)))
        self.restaurants.notifySubscribers();
      }
      return newValue;
    },self,"dataAvalaible");



    if(!( self.restaurants &&  self.restaurants.length > 0 )/*&& self.availableRestaurnts*/){

      let restaurants = []
      loadGoogleMaps(initMap)

       /*self.availableRestaurnts.map( r => self.restaurants.push( new Restaurant(r.name)))
       */
    }

    self.selectedRestaurants = ko.computed(() =>{
      return self.restaurants().filter(
          (restaurant)=>{
            if(!self.filterInput() || restaurant.name.toLowerCase().indexOf(self.filterInput().toLowerCase()) !== -1)
              return restaurant;
            }
          );
    },self);

    self.selectedRestaurants.subscribe(()=>{
      renderMarkers()
    })

    self.removeRestaurant = () => {
      self.restaurants.remove(this);
    }
    self.addRestaurant = (restaurant) => {
      self.restaurants.add(restaurant);
    }
}

const renderMarkers = () =>{
  clearMarkers();
  markers.forEach((marker)=>{
    let ar = vm.selectedRestaurants
    let selected = ar._latestValue.filter( r => r.id == marker.id).length > 0
    if(selected){
        marker.setMap(map);
    }
  })

}

const clearMarkers = () =>{
  markers.map((marker)=>{
    marker.setMap(null);
  })
}

function initMap() {
  let pyrmont = new google.maps.LatLng(pyrmontLoc.lat,pyrmontLoc.lng);
  if(!map){
    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });
  }
  search('restaurant',(results, status)=>{
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length && i < MaxListItems; i++) {
         let restaurant = new Restaurant(results[i].name)
         restaurant.id = results[i].id
         vm.restaurants.push( restaurant)
         createMarker(results[i]);
      }
    }
  })
  return map
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
   id: place.id,
   position: place.geometry.location
  });

 const infowindow = new google.maps.InfoWindow();
 let venueData;
 google.maps.event.addListener(marker, 'click', function(){

     infowindow.setContent(place.name);

      VenuesAPI.searchVenues(marker.position,place.name)
        .then((data) => {
          if(data.response && data.response.venues && data.response.venues.length >0){
            venueData = data.response.venues[0]
            return VenuesAPI.getVenuePhotoById(venueData.id)
          }
          console.log("Data: " + JSON.stringify(data))
        })
        .then( (pdata)=>{
            infowindow.setContent(`
              <h3>${place.name}</h3>
              <h4>${venueData.location.address}</h4>
              <img src="${pdata.response.photos.items[0].prefix}200x200${pdata.response.photos.items[0].suffix}"></img>`);

          })
        .catch((err)=>{
          if(err){
             infowindow.setContent("<p>Error loading details.</p>")
          }
        })
        infowindow.open(map, this);
        marker.setAnimation(google.maps.Animation.BOUNCE)
        doAnimation(marker);
  }
  );

  const  doAnimation = (marker)=> {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
 }

 google.maps.event.addListener(map, 'click', function() {
   infowindow.close();
 });

  markers.push(marker);
}

window.initMap = initMap;

/**
 Fetch initial places from Google Places API
*/
function search (query,callback){

  let pyrmont = new google.maps.LatLng(pyrmontLoc.lat,pyrmontLoc.lng);
    var request = {
     location: pyrmont,
     radius: '500',
     query: query
    };
    let service = new google.maps.places.PlacesService(map);

    service.textSearch(request, callback);
 }

/**
  Load google map from js
*/
const loadGoogleMaps = (callback) => {

  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAlLeSh9FL2SzbaF7L7-9SiTgvuSYPlLIs&libraries=places&libraries=places';
    script.id = 'googleMaps';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }
  if (existingScript && callback) callback();
};

vm = new RestaurantViewModel()

ko.applyBindings(vm);
