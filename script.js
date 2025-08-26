const grantAccessBtn = document.querySelector("#grantAccessBtn");
const searchCityInput = document.querySelector("#searchCityInput");
const searchBtn = document.querySelector("#searchBtn");
const cityFlag = document.querySelector("#cityFlag");
const cityName = document.querySelector("#cityName");
const weatherDesc = document.querySelector("#weatherDesc");
const temp = document.querySelector("#temp");
const cloudValue = document.querySelector("#cloudValue");
const humadityValue = document.querySelector("#humadityValue");
const windSpeedValue = document.querySelector("#windSpeedValue");
const searchWeathBtn = document.querySelector("#searchWeathBtn");
const currentWeathBtn = document.querySelector("#currentWeathBtn");
const loading = document.querySelector(".loadingTab");
const weatherInformationTab = document.querySelector(".weatherInformationTab");
const grantAccessTab = document.querySelector(".grantAccessTab");
const searchWeatherTab = document.querySelector(".searchWeatherTab");


const API_key = 'a173a9475981faa920d7213a714f3194';
const position = JSON.parse(sessionStorage.getItem("position"))
let latitude = null;
let longitude = null;
if (position) {
    latitude = position.latitude;
    longitude = position.longitude;
    grantAccessTab.classList.remove("active");
    loading.classList.add("active");
    getCurrentWeatherData();

}
else {
    grantAccessTab.classList.add("active");
}

function setCurrentPostion(position) {
    latitude = position.latitude;
    longitude = position.longitude;
    const positionData = {
        latitude,
        longitude
    }
    sessionStorage.setItem("position", JSON.stringify(positionData));
    getCurrentWeatherData();
}
function getCurrentLocation() {
    // console.log(navigator.geolocation)
    if (navigator.geolocation) {
        //aage badenge
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPostion({ latitude, longitude })
            grantAccessTab.classList.remove("active");
            loading.classList.add("active");

            // console.log(latitude,longitude)
        })
    }
    else {
        console.log("could not support geolocation")
    }
}
function getImportantInfo(data) {
    const newInfo = {};
    newInfo.cityName = data.name;
    newInfo.description = data.weather[0].description;
    newInfo.windSpeed = data.wind.speed;
    newInfo.humidity = data.main.humidity;
    newInfo.temp = data.main.temp;
    newInfo.clouds = data.clouds.all;
    newInfo.countryCode = data.sys.country;
    newInfo.countryFlag = `https://flagsapi.com/${newInfo.countryCode}/flat/64.png`
    weatherInformationTab.classList.add("active")
    displayWeatherInfo(newInfo)
    console.log("newInfo : ", newInfo);
}
async function getCurrentWeatherData() {
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`);
        const data = await response.json();
        console.log(data);
        // loading.classList.remove("active");  
        weatherInformationTab.classList.add("active");
        getImportantInfo(data);

    } catch (error) {
        console.log("something went wrong while fetching the current weather data")
    } finally {
        loading.classList.remove("active");
    }
}
function displayWeatherInfo(weatherInfo) {
    cityName.innerText = weatherInfo.cityName;
    cityFlag.src = weatherInfo.countryFlag;
    temp.innerText = weatherInfo.temp + "°C";
    humadityValue.innerText = weatherInfo.humidity + "%";
    windSpeedValue.innerText = weatherInfo.windSpeed + "m/s";
    cloudValue.innerText = weatherInfo.clouds + "%";
    weatherDesc.innerText = weatherInfo.description;
}
async function getCityWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`);
        const data = await response.json();
        console.log("city data :", data);
        if (data.cod == '404') {
            throw (new Error("city not found"));
        }
        // loading.classList.remove("active");
        getImportantInfo(data);

    } catch (error) {
        console.log("something went wrong while fetching the city data", error)
    } finally {
        loading.classList.remove("active");
    }
}
grantAccessBtn.addEventListener("click", getCurrentLocation);
currentWeathBtn.addEventListener("click", () => {
    getCurrentLocation();
    weatherInformationTab.classList.add("active");
    searchWeatherTab.classList.remove("active");
})
searchWeathBtn.addEventListener("click", () => {
    weatherInformationTab.classList.remove("active");
    searchWeatherTab.classList.add("active");
})

searchBtn.addEventListener("click", () => {
    const cityName = searchCityInput.value;
    if (cityName.trim().length == 0) {
        alert("please enter a valid city name")
    }
    else {
        //   console.log(cityName);
        loading.classList.add('active');
        getCityWeatherData(cityName);
    }
})

// getCityWeatherData("d");
// getCurrentLocation();