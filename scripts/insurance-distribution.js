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
var applicants = L.layerGroup().addTo(map);
var claims = L.layerGroup().addTo(map);
var customer = L.layerGroup().addTo(map);
var zones = L.layerGroup().addTo(map);

var claimsIcon = L.icon({
    iconUrl: 'assets/claim.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
});


//=========== APPLICANTS
$.getJSON("data/Applicant.json", function(data) {

    for (i in data.data) {
        var jsonApplicant = JSON.parse(data.data[i].geoinsurance);

        L.geoJSON(jsonApplicant, {

            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "#3477eb",
                    color: "#fff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                var popupContent = "<p>NAME: <b>" +
                    feature.properties.Name +
                    "</b></p><p>DRIVER'S LICENSE: <b>" +
                    feature.properties.Drivers_Li +
                    "</b></p><p>PLATE NUMBER: <b>" +
                    feature.properties.Plate_Numb +
                    "</b></p>";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);


            },

        }).addTo(applicants);

    }



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
                    radius: 6,
                    fillColor: "#a900e6",
                    color: "#fff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                var popupContent = "<p>POLICY ID: <b>" +
                    feature.properties.Policy_ID +
                    "</b></p><p>CLAIM EVENT: <b>" +
                    feature.properties.Claim_Even +
                    "</b></p><p>BENEFICIARY: <b>" +
                    feature.properties.Beneficiar +
                    "</b></p><p>AMOUNT CLAIMED: <b>&euro;" +
                    feature.properties.Amount_Cla +
                    "</b></p>";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);



            },

        }).addTo(claims);

    }



});

//=========== CUSTOMERS
$.getJSON("data/Customer.json", function(data) {

    for (i in data.data) {
        var jsonCustomer = JSON.parse(data.data[i].geoinsurance);

        L.geoJSON(jsonCustomer, {

            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "#732600",
                    color: "#fff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function(feature, layer) {
                var popupContent = "<p>NAME: <b>" +
                    feature.properties.Customer_N +
                    "</b></p><p>POLICY ID: <b>" +
                    feature.properties.Policy_ID +
                    "</b></p><p>PREMIUM: <b>&euro;" +
                    feature.properties.Premuim +
                    "</b></p><p>INSURED AMOUNT: <b>&euro;" +
                    feature.properties.Insured_Am +
                    "</b></p>";;

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);

                // console.log(feature.properties);

            },

        }).addTo(customer);

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
    "Applicants": applicants,
    "Claims": claims,
    "Customers": customer,
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