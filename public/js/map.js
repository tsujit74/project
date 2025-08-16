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


  document.addEventListener("DOMContentLoaded", async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userCoords = [position.coords.longitude, position.coords.latitude]; // User's Location
        const listingCoords = listing.position.coordinates; // Listing Location
  
        // Add User Marker
        new tt.Marker({ color: "blue" })
          .setLngLat(userCoords)
          .setPopup(
            new tt.Popup({ offset: 25 }).setHTML(
              `<div style="background-color: #fff; color: #333; padding: 5px; border-radius: 5px; border: 1px solid #ddd;"><h5>Your Location</h5></div>`
            )
          )
          .addTo(map);
  
        // Fetch Distance & Time
        const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${userCoords[1]},${userCoords[0]}:${listingCoords[1]},${listingCoords[0]}/json?key=${mapToken}&travelMode=car`;
  
        try {
          const response = await fetch(routeUrl);
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            let travelTimeInSeconds = data.routes[0].summary.travelTimeInSeconds;
            let distanceInMeters = data.routes[0].summary.lengthInMeters;
  
            // Convert distance to KM
            const distance = (distanceInMeters / 1000).toFixed(2);
  
            // Convert seconds to hours & minutes
            let hours = Math.floor(travelTimeInSeconds / 3600);
            let minutes = Math.floor((travelTimeInSeconds % 3600) / 60);
  
            let travelTimeFormatted = "";
            if (hours > 0) {
              travelTimeFormatted += `${hours} hr `;
            }
            if (minutes > 0) {
              travelTimeFormatted += `${minutes} min`;
            }
  
            // Update UI
            document.getElementById("distance-time").innerHTML = `🚗 Distance: ${distance} km | ⏳ Estimated Time: ${travelTimeFormatted}`;
          } else {
            document.getElementById("distance-time").innerHTML = "Could not fetch route details.";
          }
        } catch (error) {
          console.error("Error fetching route:", error);
          document.getElementById("distance-time").innerHTML = "Error fetching distance.";
        }
      }, () => {
        document.getElementById("distance-time").innerHTML = "Location access denied.";
      });
    } else {
      document.getElementById("distance-time").innerHTML = "Geolocation not supported.";
    }
  });
  
  

  document.addEventListener("DOMContentLoaded", async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userCoords = [position.coords.longitude, position.coords.latitude]; // User's Location
        const listingCoords = listing.position.coordinates; // Listing Location
  
        // Initialize the Map
        let map = tt.map({
          key: mapToken,
          container: "map",
          center: listingCoords,
          zoom: 10, // Adjust zoom level to fit both locations
          dragPan: true,
        });
  
        map.addControl(new tt.FullscreenControl());
        map.addControl(new tt.NavigationControl());
  
        // Add Listing Marker (Red)
        new tt.Marker({ color: "red" })
          .setLngLat(listingCoords)
          .setPopup(
            new tt.Popup({ offset: 25 }).setHTML(
              `<div style="background-color: #fff; color: #333; padding: 5px; border-radius: 5px; border: 1px solid #ddd;"><h5>${listing.location}</h5><p>Exact Location Provided after booking!</p></div>`
            )
          )
          .addTo(map);
  
        // Add User Marker (Green)
        new tt.Marker({ color: "green" })
          .setLngLat(userCoords)
          .setPopup(
            new tt.Popup({ offset: 25 }).setHTML(
              `<div style="background-color: #fff; color: #333; padding: 5px; border-radius: 5px; border: 1px solid #ddd;"><h5>Your Location</h5></div>`
            )
          )
          .addTo(map);
  
        console.log("Listing Coordinates:", listingCoords);
        console.log("User Coordinates:", userCoords);
  
        // Fit map to show both markers
        const bounds = new tt.LngLatBounds();
        bounds.extend(userCoords);
        bounds.extend(listingCoords);
        map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
      }, () => {
        console.error("Geolocation access denied.");
      });
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  });
  
