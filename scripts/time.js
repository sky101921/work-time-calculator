let map, directionsService, directionsRenderer, trafficLayer;

// GPS 座標
const home = { lat: 24.879789464860007, lng: 121.2658900463753 };
const office = { lat: 24.955979616671335, lng: 121.16736966965546 };

// 初始化地圖
function initMap() {
    // 初始化 Directions Service 和 Renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
}

// 計算路線並顯示即時開車時間
function calculateRouteAndTime() {
    var origin = home;
    var destination = office;
    // 設定路線請求
    const routeRequest = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(), // 使用當前時間以取得即時交通資料
        },
    };

    directionsService.route(routeRequest, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);

            // 取得並顯示即時開車時間
            const duration = result.routes[0].legs[0].duration_in_traffic.text;
            return duration;
        } else {
            return '';
        }
    });
}

function calculateOffTime() {
    const startTime = document.getElementById('startTime').value;
    const resultElement = document.getElementById('resultOff');
    const resultElementStart = document.getElementById('resultStart');
    resultElementStart.textContent = '';
    if (/^\d{4}$/.test(startTime)) {
        const hours = parseInt(startTime.slice(0, 2), 10);
        const minutes = parseInt(startTime.slice(2, 4), 10);

        if (!isNaN(hours) && !isNaN(minutes) && hours < 24 && minutes < 60) {
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0);

            const workDuration = 8.5 * 60 * 60 * 1000; // 8.5小時的毫秒數
            const offTime = new Date(startDate.getTime() + workDuration);

            const formattedOffTime =
                offTime.getHours().toString().padStart(2, '0') +
                ':' +
                offTime.getMinutes().toString().padStart(2, '0');
            resultElement.textContent = '下班時間是:' + formattedOffTime;
        } else {
            resultElement.textContent =
                '輸入的時間不正確，請確認格式為 HHMM 並且時間有效';
        }
    } else {
        resultElement.textContent = '輸入格式錯誤，請使用 HHMM 格式';
    }
}

function calculateStartTime() {
    const offTime = document.getElementById('offTime').value;
    const resultElement = document.getElementById('resultStart');
    const resultElementOff = document.getElementById('resultOff');
    resultElementOff.textContent = '';
    if (/^\d{4}$/.test(offTime)) {
        const hours = parseInt(offTime.slice(0, 2), 10);
        const minutes = parseInt(offTime.slice(2, 4), 10);

        if (!isNaN(hours) && !isNaN(minutes) && hours < 24 && minutes < 60) {
            const endDate = new Date();
            endDate.setHours(hours, minutes, 0);
            var goTimeStr = calculateRouteAndTime();
            console.log(goTimeStr);
            let goTime = 30;
            var errMsg = '';
            if (goTimeStr) {
                goTime = parseInt(goTime);
            } else {
                errMsg = '(API異常)';
            }

            const workDuration = 8.5 * 60 * 60 * 1000; // 8.5小時的毫秒數
            const workDuration1 = workDuration + goTime * 60 * 1000;
            const startTime = new Date(endDate.getTime() - workDuration);
            const wakeupTime = new Date(endDate.getTime() - workDuration1);
            const formattedStartTime =
                startTime.getHours().toString().padStart(2, '0') +
                ':' +
                startTime.getMinutes().toString().padStart(2, '0');
            const formattedWakeupTime =
                wakeupTime.getHours().toString().padStart(2, '0') +
                ':' +
                wakeupTime.getMinutes().toString().padStart(2, '0');
            resultElement.innerHTML =
                '上班時間是:' +
                formattedStartTime +
                '<br><span style="color:green;">出門時間是:' +
                formattedWakeupTime +
                errMsg +
                '</span>';
        } else {
            resultElement.textContent =
                '輸入的時間不正確，請確認格式為 HHMM 並且時間有效';
        }
    } else {
        resultElement.textContent = '輸入格式錯誤，請使用 HHMM 格式';
    }
}
// 初始化地圖
window.onload = function () {
    initMap();
};
