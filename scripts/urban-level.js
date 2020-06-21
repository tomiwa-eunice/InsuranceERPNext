// var map = L.map('mapid').setView([39.74739, -105], 13);
var map = L.map('mapid').setView([52.2152, 6.889], 12);

// default leaflet with mapbox tile map load
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    zoom: 12,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    attribution: '',

}).addTo(map);

// group layers
var zones = L.layerGroup().addTo(map);



//=========== ZONES

function style(feature) {
    return {
        fillColor: riskColour((feature.properties.Urbaniza_1)),
        weight: 0.5,
        opacity: 1,
        color: "gray",
        dashArray: "0",
        fillOpacity: 0.8
    };
}

function riskColour(i) {
    return i == 3 ? "#dcf5e9" :
        i == 2 ? "#76a882" :
        i == 1 ? "#226633" :
        "#c77f7f";
}

$.getJSON("data/Zones.json", function(data) {

    for (i in data.data) {
        var jsonZones = JSON.parse(data.data[i].geozones);


        L.geoJSON(jsonZones, {
            onEachFeature: function onEachFeature(feature, layer) {


                var popupContent = "<p>ZONE: <b>" +
                    feature.properties.BU_NAAM +
                    "</b></p><p>POPULATION(2016): <b>" +
                    feature.properties.AANT_INW +
                    "</b></p><p>CLAIM INCIDENCE: <b>" +
                    feature.properties.Claim_Even +
                    "</b></p><p>DRIVABLE AGE(15-24)%: <b>" +
                    feature.properties.P_15_24_JR +
                    "</b></p><p>DRIVABLE AGE(25-44)%: <b>" +
                    feature.properties.P_25_44_JR +
                    "</b></p><p>DRIVABLE AGE(45-64)%: <b>" +
                    feature.properties.P_45_64_JR +
                    "</b></p><p>DRIVABLE AGE(65-E0)%: <b>" +
                    feature.properties.P_65_EO_JR +
                    "</b></p><p>RISK CATEGORY: <b>" +
                    feature.properties.Risk_Zones +
                    "</b></p>";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }


                layer.bindPopup(popupContent);
            },
            style: style

        }).addTo(zones);


    }


});



// Legend layers control
var overlays = {
    "Urbanization Distribution": zones,
}

var layerControl = L.control.layers(null, overlays, { collapsed: false }).addTo(map);

// set legend position on control
var legend = L.control({ position: "bottomright" });


legend.onAdd = function(map) {
    var legendBox = L.DomUtil.create("div", "info legend"),
        categories = [
            3,
            2,
            1,
        ],

        labels = [
            "Low",
            "Medium",
            "High"
        ];

    title = ['<strong>URBANIZATION LEVEL</strong>'];


    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
        title.push(
            `<i style="background: ${riskColour(categories[i])} "></i> ${labels[i]}`);
    }

    legendBox.innerHTML = title.join('<br>');

    return legendBox;
};

legend.addTo(map);