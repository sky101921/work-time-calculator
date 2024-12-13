let map, directionsService, directionsRenderer, trafficLayer;

// GPS 座標
let home = { lat: 24.879789464860007, lng: 121.2658900463753 };
// 定義對應的值
const locations = {
    t1: { lat: 24.88019431968695, lng: 121.2649536799218 }, // Jade 的座標
    t2: { lat: 24.992107820919873, lng: 121.3369626860762 }, // Archie 的座標
};

const office = { lat: 24.955979616671335, lng: 121.16736966965546 };
// 取得所有 radio 按鈕
const inputs = document.querySelectorAll('input[name="food"]');

// 為每個 input 添加 change 事件
inputs.forEach((input) => {
    input.addEventListener('change', (event) => {
        // 更新 home 為選中的座標
        home = locations[event.target.id];
        // console.log(`選擇了：${event.target.id}，home 更新為：`, home);

        // 檢查哪個按鈕是 active
        if (document.getElementById('toCompany').classList.contains('active')) {
            // console.log('現在是前往公司');
            calculateRouteAndTime(home, office); // 更新到公司路線
        } else if (
            document.getElementById('toHome').classList.contains('active')
        ) {
            // console.log('現在是回家');
            calculateRouteAndTime(office, home); // 更新回家路線
        }
    });
});

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
    trafficLayer.setMap(map); // 啟用交通層
}

// 計算路線並顯示即時開車時間
function calculateRouteAndTime(origin, destination) {
    // 設定路線請求
    const routeRequest = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(), // 使用當前時間以取得即時交通資料
        },
    };

    // 顯示路線
    directionsService.route(routeRequest, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            // 取得並顯示即時開車時間
            const duration = result.routes[0].legs[0].duration_in_traffic.text;

            // 更新顯示的行車時間
            document.getElementById(
                'travelTime'
            ).textContent = `即時開車時間：${duration}`;
        } else {
            document.getElementById('travelTime').textContent =
                '無法計算路線，請稍後再試';
        }
    });
}

// 綁定按鈕事件
document.getElementById('toCompany').addEventListener('click', () => {
    document.getElementById('toCompany').classList.add('active');
    document.getElementById('toHome').classList.remove('active');
    calculateRouteAndTime(home, office);
});

document.getElementById('toHome').addEventListener('click', () => {
    document.getElementById('toHome').classList.add('active');
    document.getElementById('toCompany').classList.remove('active');
    calculateRouteAndTime(office, home);
});

// 初始化地圖
window.onload = function () {
    initMap();
    // 保證頁面初始化後再顯示提示
    document.getElementById('travelTime').textContent = '開車時間將顯示於此';

    // 取得當前小時
    const currentHour = new Date().getHours();

    // 根據時間觸發對應按鈕的點擊事件
    if (currentHour <= 12) {
        document.getElementById('toCompany').click(); // 上午 12 點前觸發 "toCompany"
    } else {
        document.getElementById('toHome').click(); // 中午 12 點後觸發 "toHome"
    }
};
