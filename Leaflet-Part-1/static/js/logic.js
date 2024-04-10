

//create Leaflet Map
let usaMap = L.map("map",{
    center:[39.7392,-104.9847],
    zoom:5
})
// add open street map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(usaMap)


// function to set marker color determined by earthquake depth
function setColors(mag){
    if (mag <= 10) {
        return "#ffffb2"
    } else if (mag <= 30){
        return "#fed976"}
    else if (mag <= 50){
        return "#feb24c"}
    else if (mag <= 70){
        return "#fd8d3c"}
    else if (mag <= 90){
        return "#f03b20"}
    else if (mag >= 90){
        return "#bd0026"}
}

// create popup HTML using earthquake data
function createPopup(data) {
    return "<h3>" + data.feature.properties.place + "</h3>" + "<p><b>Magnitude: </b>" +
    data.feature.properties.mag + "</p>" + "<p><b>Depth: </b>" +
    data.feature.geometry.coordinates[2]
}

// access earthquake data from USGS.gov
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(
    function(response){

        // add earthquake data to map
        L.geoJSON(response.features, {
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng,{
                    // radius corresponds to earthquake magnitude
                    radius:feature.properties.mag * 4,
                    // color determined by passing the earthquake depth to setColors()
                    color:setColors(feature.geometry.coordinates[2])
                    })
            }
        }).bindPopup(function(layer){return createPopup(layer)}).addTo(usaMap)

    }
 )

//creating legend
var legend = L.control({position:'bottomright'})

legend.onAdd = function(map) {
     let div = L.DomUtil.create('div','info legend')
     let grades = [-10, 10,30,50,70,90]
     let legendItems = []

     // creates HTML for each item on legend
     function createLegendItem(grade,index) {
     if (grades[index - 1]) {
             if (grades[index + 1]) {
                return "<i style=\"background-color:" + setColors([grade]) + "\"></i>"+ grades[index-1] + "—" + grade
             } else {
                return "<i style=\"background-color:" + setColors([grade + 1]) + "\"></i>"+ grade + "+"
             }
     } else {return}
     }
     // add each item to legendItems array
     grades.forEach((grade,index)=>{legendItems.push(createLegendItem(grade,index))})

     // add legend to div
     div.innerHTML += legendItems.join("<br/>")
     return div;
}

legend.addTo(usaMap);