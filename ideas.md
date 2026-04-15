<!-- Copyright (c) Jonas Immanuel Frey. All rights reserved. -->

# Ideas

## IP-based background video selection

Instead of picking a random hero video, use the visitor's IP address to determine their
approximate location and show the video of the closest mountain.

**Mountains and coordinates:**
- Matterhorn: 46.0207°N, 7.6585°E
- Stockhorn: 46.6943°N, 7.5385°E
- Creux du Van: 46.9340°N, 6.7270°E

**Implementation:**
Use a free IP geolocation API (e.g. `ipapi.co/json/`) to get lat/lon, then calculate
haversine distance to each mountain and swap the `<video>` source to the closest one.
Falls back to a default if the API call fails.

```js
var mountains = [
  { name: 'matterhorn',   lat: 46.0207, lon: 7.6585 },
  { name: 'stockhorn',    lat: 46.6943, lon: 7.5385 },
  { name: 'creux_du_van', lat: 46.9340, lon: 6.7270 }
];

function haversine(lat1, lon1, lat2, lon2) {
  var toRad = Math.PI / 180;
  var dLat = (lat2 - lat1) * toRad;
  var dLon = (lon2 - lon1) * toRad;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function setClosestVideo(lat, lon) {
  var closest = mountains[0];
  var minDist = Infinity;
  for (var i = 0; i < mountains.length; i++) {
    var d = haversine(lat, lon, mountains[i].lat, mountains[i].lon);
    if (d < minDist) { minDist = d; closest = mountains[i]; }
  }
  var video = document.getElementById('hero-video');
  var source = document.getElementById('hero-source');
  source.src = '/' + closest.name + '.mp4';
  video.load();
}

fetch('https://ipapi.co/json/')
  .then(function (r) { return r.json(); })
  .then(function (data) {
    if (data.latitude && data.longitude) {
      setClosestVideo(data.latitude, data.longitude);
    }
  })
  .catch(function () { /* keep default */ });
```
