// 初始化地圖變數
let map, directionsService, directionsRenderer;

// 住家與公司的 GPS 座標
const home = { lat: 24.879789464860007, lng: 121.2658900463753 };
const office = { lat: 24.955979616671335, lng: 121.16736966965546 };

// 初始化地圖
function initMap() {
    // 創建地圖實例
    map = new google.maps.Map(document.getElementById('map'), {
        center: home, // 預設居中在住家
        zoom: 13,
    });

    // 初始化方向服務與渲染器
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

// 設定路線規劃
function calculateRoute(origin, destination) {
    const request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING', // 行駛模式：開車
    };

    // 透過 DirectionsService 計算路線
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result); // 顯示路線
        } else {
            alert('無法計算路線: ' + status);
        }
    });
}

// 事件綁定：按鈕點擊顯示對應路線
document.getElementById('toCompany').addEventListener('click', () => {
    calculateRoute(home, office); // 從住家到公司
});

document.getElementById('toHome').addEventListener('click', () => {
    calculateRoute(office, home); // 從公司到住家
});

// 初始化地圖
window.onload = initMap;
