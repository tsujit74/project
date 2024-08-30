// Create a canvas element
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

let map = tt.map({
  key: mapToken,
  container: "map",
  center: listing.position.coordinates,
  zoom: 5,
  dragPan: true,
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

console.log(listing.position.coordinates);

const marker = new tt.Marker({color:"red"})
  .setLngLat(listing.position.coordinates) // listing position coordinatess
  .setPopup(new tt.Popup({offset: 25})
  .setHTML(`<div style="background-color: #fff; color: #333; padding: 5px; border-radius: 5px; border: 1px solid #ddd;"><h5>${listing.location}</h5><p>Exact Location Provided after booking!</p></div>`))
  .addTo(map);

