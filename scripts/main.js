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
var claims = L.layerGroup().addTo(map);
var zones = L.layerGroup().addTo(map);


var claimsIcon = L.icon({
    iconUrl: 'assets/claim.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
});


//=========== CLAIMS
$.getJSON("data/Claims.json", function(data) {

    for (i in data.data) {
        var jsonClaims = JSON.parse(data.data[i].geoclaim);

        L.geoJSON(jsonClaims, {

            /* pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: claimsIcon });
            },
 */
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#a900e6",
                    color: "#fff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                var popupContent = "<p>Claim " +
                    feature.geometry.type + "</p>";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);


            },

        }).addTo(claims);

    }



});


//=========== ZONES

function style(feature) {
    return {
        fillColor: riskColour(feature.properties.Risk_Zones),
        weight: 0.5,
        opacity: 1,
        color: "white",
        dashArray: "0",
        fillOpacity: 0.6
    };
}

function riskColour(i) {
    return i == "Very Low" ? "#38a800" :
        i == "Low" ? "#8bd100" :
        i == "Moderate" ? "#ffff00" :
        i == "High" ? "#ff8000" :
        i == "Very High" ? "#ff0000" :
        "#c77f7f";
}

$.getJSON("data/Zones.json", function(data) {

    for (i in data.data) {
        var jsonZones = JSON.parse(data.data[i].geozones);


        L.geoJSON(jsonZones, {
            onEachFeature: function onEachFeature(feature, layer) {

                // console.log(feature);

                var popupContent = "<p>NAME: " +
                    feature.properties.BU_NAAM + "</p><p>RISK ZONE:" + feature.properties.Risk_Zones + "</p>";

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
    "Claims": claims,
    "Risk Zones": zones,
}

var layerControl = L.control.layers(null, overlays, { collapsed: false }).addTo(map);

// set legend position on control
var legend = L.control({ position: "bottomright" });


legend.onAdd = function(map) {
    var legendBox = L.DomUtil.create("div", "info legend"),
        categories = [
            "Very Low",
            "Low",
            "Moderate",
            "High",
            "Very High"
        ],

        labels = [
            "1. Very Low",
            "2. Low",
            "3. Moderate",
            "4. High",
            "5. Very High"
        ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
        legendBox.innerHTML +=
            `<i style="background: ${riskColour(categories[i])} "></i> ${labels[i]} <br>`;
    }

    return legendBox;
};

legend.addTo(map);