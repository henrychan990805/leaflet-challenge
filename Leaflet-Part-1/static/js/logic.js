let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function color(depth) {
        if (depth<10) {
            return 'rgb(0,300,0)'
        }else if (depth<30) {
            return 'rgb(100,250,0)'
        }else if (depth<50) {
            return 'rgb(200,200,0)'
        }else if (depth<70) {
            return 'rgb(300,150,0)'
        }else if (depth<90) {
            return 'rgb(400,100,0)'
        } else {
            return 'rgb(500,50,0)' 
        }

    }

    let earthquakes = L.geoJSON(earthquakeData, {
       'pointToLayer': function(geoJsonPoint, latlng){
                         var circleMarker=L.circle(latlng, {
                           radius: (geoJsonPoint['properties']['mag']**2)*5000,
                           color: color(geoJsonPoint.geometry.coordinates[2]),
                           fillOpacity: 0.85
                         });
                         circleMarker.bindPopup(`<h3>${geoJsonPoint.properties.place}</h3><hr><p>mag:${geoJsonPoint.properties.mag}</p><hr><p>depth:${geoJsonPoint.geometry.coordinates[2]}</p>`);
                         return circleMarker
                        
        }
      });
   
    createMap(earthquakes);
}

function createMap(earthquakes) {

    let Map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [Map, earthquakes]
    });

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<div><span class="color-box" style="background: rgb(0,300,0);"></span>depth less than 10 </div>';
        div.innerHTML += '<div><span class="color-box" style="background: rgb(100,250,0);"></span>depth between 10-30 </div>';
        div.innerHTML += '<div><span class="color-box" style="background: rgb(200,200,0);"></span>depth between 30-50</div>';
        div.innerHTML += '<div><span class="color-box" style="background: rgb(300,150,0);"></span>depth between 50-70</div>';
        div.innerHTML += '<div><span class="color-box" style="background: rgb(400,100,0);"></span>depth between 70-90</div>';
        div.innerHTML += '<div><span class="color-box" style="background: rgb(500,50,0);"></span>depth more than 90</div>';
        return div;
    };
    legend.addTo(myMap);
  }
