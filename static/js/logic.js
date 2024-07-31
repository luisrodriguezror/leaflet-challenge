// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  // Create the map with our layers.
  let map = L.map("map", {
    center: [0, 0], 
    zoom: 2, 
    layers: [streetmap]
  });
  
  // Add our "streetmap" tile layer to the map.
  streetmap.addTo(map);
  
  // marker size based on earthquake magnitude
  function getRadius(magnitude) {
    return magnitude * 30000;
  }
  
  // color based on earthquake depth
  function getColor(depth) {
    return depth > 300 ? '#D02900' :  
           depth > 200 ? '#D07800' :  
           depth > 100 ? '#D0A100' :  
           depth > 50  ? '#D0C300' :  
           depth > 10  ? '#B4D000' :  
                         '#23D000';  
  }
  
  // Create a legend for the map
  let legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 50, 100, 200, 300];
    let labels = [];
  
    // Add a title to the legend
    div.innerHTML += '<strong>Depth (km)</strong><br>';
  
    // Loop through depth ranges and generate color legend
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        (depths[i] + 1) + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }
  
    return div;
  };
  
  legend.addTo(map);
  
  // Perform an API call 
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  
    // Loop through the features (earthquakes) in the GeoJSON data
    for (let i = 0; i < data.features.length; i++) {
      let earthquake = data.features[i];
  
      // Get magnitude, depth, and coordinates of the earthquake
      let magnitude = earthquake.properties.mag;
      let depth = earthquake.geometry.coordinates[2];
      let coords = earthquake.geometry.coordinates;
      let lat = coords[1];
      let lon = coords[0];
  
      // Create a new marker with a circle as the shape
      L.circle([lat, lon], {
        color: getColor(depth),
        fillColor: getColor(depth),
        fillOpacity: 0.8,
        radius: getRadius(magnitude)
      }).addTo(map)
      .bindPopup(`Location: ${earthquake.properties.place}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);
    }
  });
  