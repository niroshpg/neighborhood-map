//
// import ko from 'knockout';
// //import app from './index';
//
// let map;
// let infowindow;
// export const pyrmontLoc = {
//   lat: -33.8665433,
//   lng: 151.1956316
// }
//
//
// //const restaurantsStore = window.localStorage;
//
// function initMap() {
// debugger
//   var infowindow = new google.maps.InfoWindow();
//   let pyrmont = new google.maps.LatLng(pyrmontLoc.lat,pyrmontLoc.lng);
//   if(!map){
//     map = new google.maps.Map(document.getElementById('map'), {
//       center: pyrmont,
//       zoom: 15
//     });
//   }
//
//   return map
// }
//
// function createMarker(place) {
//   var placeLoc = place.geometry.location;
//   var marker = new google.maps.Marker({
//    map: map,
//    position: place.geometry.location
//   });
//
//   google.maps.event.addListener(marker, 'click', function() {
//    infowindow.setContent(place.name);
//    infowindow.open(map, this);
//   });
// }
//
// window.initMap = initMap;
//
// export function search (query,callback){
//   debugger
//   let pyrmont = new google.maps.LatLng(pyrmontLoc.lat,pyrmontLoc.lng);
//     var request = {
//      location: pyrmont,
//      radius: '500',
//      query: query
//     };
//     let service = new google.maps.places.PlacesService(map);
//
//     service.textSearch(request, callback);
//  }
//
//        // service.nearbySearch({
//        //   location: pyrmont,
//        //   radius: 10000,
//        //   type: ['restaurant']
//        // }, callback);
//    // let restaurants = []
//   // service.textSearch(request, callback);
//   //  function callback(results, status) {
//   //
//   //   if (status === google.maps.places.PlacesServiceStatus.OK) {
//   //     for (var i = 0; i < results.length; i++) {
//   //       createMarker(results[i]);
//   //       restaurants.push(results[i])
//   //     }
//   //     restaurantsStore.setItem('availableRestaurnts', JSON.stringify(restaurants));
//   //     app.notifySubscribers(true, "dataAvalaible");
//   //   }
//   // }
//
//
//   //  }
//   //}
