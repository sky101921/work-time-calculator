let map, directionsService, directionsRenderer;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 24.917884, lng: 121.21663 },
        zoom: 12,
    });
    directionsRenderer.setMap(map);

    calculateRoutes();
}

function calculateRoutes() {
    const home = { lat: 24.879789464860007, lng: 121.2658900463753 };
    const office = { lat: 24.955979616671335, lng: 121.16736966965546 };

    // 住家到公司
    directionsService.route(
        {
            origin: home,
            destination: office,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(),
            },
        },
        (response, status) => {
            if (status === "OK") {
                const route = response.routes[0].legs[0];
                document.getElementById("homeToOfficeTime").innerText = `住家到公司即時車程：${route.duration_in_traffic?.text || route.duration.text}`;
            } else {
                document.getElementById("homeToOfficeTime").innerText = "無法取得住家到公司路徑資訊";
            }
        }
    );

    // 公司到住家
    directionsService.route(
        {
            origin: office,
            destination: home,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(),
            },
        },
        (response, status) => {
            if (status === "OK") {
                const route = response.routes[0].legs[0];
                document.getElementById("officeToHomeTime").innerText = `公司到住家即時車程：${route.duration_in_traffic?.text || route.duration.text}`;
            } else {
                document.getElementById("officeToHomeTime").innerText = "無法取得公司到住家路徑資訊";
            }
        }
    );
}
