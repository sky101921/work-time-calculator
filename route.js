// 初始化地圖變數
let map, directionsService, directionsRenderer, distanceMatrixService;

// GPS 座標
const home = { lat: 24.879789464860007, lng: 121.2658900463753 };
const office = { lat: 24.955979616671335, lng: 121.16736966965546 };

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: home,
        zoom: 13,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    distanceMatrixService = new google.maps.DistanceMatrixService();

    directionsRenderer.setMap(map);
}

// 計算路線並顯示開車時間
function calculateRouteAndTime(origin, destination) {
    // 設定路線請求
    const routeRequest = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(), // 用於獲取即時交通資料
        },
    };

    // 顯示路線
    directionsService.route(routeRequest, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('無法計算路線: ' + status);
        }
    });

    // 計算開車時間並顯示即時交通狀況
    const matrixRequest = {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(), // 使用當前時間以取得即時交通資料
        },
        trafficModel: 'best_guess', // 你可以選擇 'best_guess', 'pessimistic', 'optimistic'
    };

    distanceMatrixService.getDistanceMatrix(
        matrixRequest,
        (response, status) => {
            if (status === 'OK') {
                const duration =
                    response.rows[0].elements[0].duration_in_traffic.text;
                document.getElementById(
                    'travelTime'
                ).textContent = `即時開車時間：${duration}`;
            } else {
                document.getElementById('travelTime').textContent =
                    '無法取得即時開車時間';
            }
        }
    );
}

// 綁定按鈕事件
document.getElementById('toCompany').addEventListener('click', () => {
    calculateRouteAndTime(home, office);
});

document.getElementById('toHome').addEventListener('click', () => {
    calculateRouteAndTime(office, home);
});

// 初始化地圖
window.onload = initMap;
