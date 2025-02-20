function createMap(min_year, max_year) {
    // Delete Map
    let map_container = d3.select("#map_container");
    map_container.html(""); // empties it
    map_container.append("div").attr("id", "map"); // recreate it
  
    // Step 1: CREATE THE BASE LAYERS
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Assemble the API query URL with date range.
    let url = `/api/v1.0/map_data/${min_year}/${max_year}`;
    console.log("API URL:", url);
  
    d3.json(url).then(function (data) {
      // Step 2: CREATE THE DATA/OVERLAY LAYERS
      console.log("Data received:", data);
  
      // Initialize the Cluster Group
      let heatArray = [];
      let markers = L.markerClusterGroup();
  
      // Loop and create marker
      for (let i = 0; i < data.length; i++){
        let row = data[i];
        console.log("Row data:", row);
        
        let rec_lat = row.rec_lat;
        let rec_long = row.rec_long;
        
        if (rec_lat !== undefined && rec_long !== undefined) {
          // Heatmap point
          heatArray.push([rec_lat, rec_long]);
          
          // Create marker and add to cluster group
          let marker = L.marker([rec_lat, rec_long]).bindPopup(`<h1>${row.avg_mass}</h1>`);
          markers.addLayer(marker);
        } else {
          console.warn("Invalid coordinates for row:", row);
        }
      }
  
      // Create Heatmap Layer
      let heatLayer = L.heatLayer(heatArray, {
        radius: 25,
        blur: 10
      });
  
      // Step 3: CREATE THE LAYER CONTROL
      let baseMaps = {
        Street: street,
        Topography: topo
      };
  
      let overlayMaps = {
        HeatMap: heatLayer,
        Meteorites: markers
      };
  
      // Step 4: INITIALIZE THE MAP
      let myMap = L.map("map", {
        center: [0, -10],
        zoom: 2,
        layers: [street, markers, heatLayer] // Add heatLayer to the default layers
      });
  
      // Step 5: Add the Layer Control, Legend, Annotations as needed
      L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    }).catch(function (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please try again later.");
    });
  }
  
  function init() {
    // Get the date range from input fields
    let min_year = d3.select("#min-year").property("value");
    let max_year = d3.select("#max-year").property("value");
    createMap(min_year, max_year);
  }
  
  // Event Listener
  d3.select("#filter-btn").on("click", function () {
    init();
  });
  
  // on page load
  init();