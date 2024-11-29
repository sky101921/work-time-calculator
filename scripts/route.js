let map, directionsService, directionsRenderer, trafficLayer;

// GPS 座標
const home = { lat: 24.879789464860007, lng: 121.2658900463753 };
const office = { lat: 24.955979616671335, lng: 121.16736966965546 };

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: home,
        zoom: 13,
    });

    // 初始化 Directions Service 和 Renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // 初始化交通層並將其加到地圖中
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);  // 啟用交通層
}

// 計算路線並顯示即時開車時間
function calculateRouteAndTime(origin, destination) {
    // 設定路線請求
    const routeRequest = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(),  // 使用當前時間以取得即時交通資料
        }
    };

    // 顯示路線
    directionsService.route(routeRequest, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            // 取得並顯示即時開車時間
            const duration = result.routes[0].legs[0].duration_in_traffic.text;

            // 更新顯示的行車時間
            document.getElementById('travelTime').textContent = `即時開車時間：${duration}`;
        } else {
            document.getElementById('travelTime').textContent = '無法計算路線，請稍後再試';
        }
    });
}

// 綁定按鈕事件
document.getElementById('toCompany').addEventListener('click', () => {
    calculateRouteAndTime(home, office);
});

document.getElementById('toHome').addEventListener('click', () => {
    calculateRouteAndTime(office, home);
});

// 初始化地圖
window.onload = function () {
    initMap();
    // 保證頁面初始化後再顯示提示
    document.getElementById('travelTime').textContent = '開車時間將顯示於此';
};
