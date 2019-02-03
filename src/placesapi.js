const api = process.env.FQ_API_URL || 'https://api.foursquare.com/v2'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const CLIENT_ID = '11Z0QQEL3YIG5D2YWMU3BEUJXCZPT222HMXS2KJOCU2AJRWJ'
const CLIENT_SECRET = 'POMU3SMQBYU1HYR1YYX4KJWR4ZCCTE1YRLYNRHCH3PTMVSSQ'

// const headers = {
//   'Accept': 'application/json',
//   'Authorization': token
// }
//
// let url = api + 'll=' + placeLoc.lat+','+placeLoc.lng+'&query='+place.name+'&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20190201'
// fetch(url).then(function(response) {
//   debugger
//   console.log(JSON.stringify(response))
//   return ;
// })
// .then(function(myJson) {
//   console.log(JSON.stringify(myJson));
// });

export const searchVenues = (location,query) =>
  fetch(`${api}/venues/search?ll=${location.lat()},${location.lng()}&query=${query}&radius=250&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190201`)
  .then( res => res.json() )
  .catch( err => console.error(err) )

export const getVenuePhotoById = (id) =>
    fetch(`${api}/venues/${id}/photos?&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190201`)
    .then( res => res.json() )
    .catch( err => console.error(err) )
