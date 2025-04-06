import "./styles/reset.css";
import "./styles/style.css";
// core version + navigation, pagination modules:
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { initEarth } from "./earth";


// API Key for OpenWeatherMap
const apiKey = import.meta.env.VITE_OWM_API_KEY;

// List of cities and their countries
const cities = [
  { name: "Tokyo", country: "JP" },
  { name: "Cairo", country: "EG" },
  { name: "Sydney", country: "AU" },
  { name: "New York", country: "US" },
  { name: "Rio de Janeiro", country: "BR" },
];

// init Swiper:
new Swiper(".swiper", {
  // configure Swiper to use modules
  modules: [Navigation, Pagination],

  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Function to fetch weather data for each city
export async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return Math.round(data.main.temp);
  } catch (error) {
    console.error(`Error fetching weather data for ${city.name}:`, error);
    return "N/A"; // Return 'N/A' if there's an error
  }
}

// Loop through the cities and update the temperature in the slider
cities.forEach((city, index) => {
  const cityElement = document.querySelectorAll(".swiper-slide")[index];
  const tempElement = cityElement.querySelector(".temperature");

  // Fetch the weather and update the temperature
  getWeather(city).then((temp) => {
    tempElement.textContent = `🌡️ ${temp}°C`; // Update temperature in the slider
    tempElement.style.color = "#851961"; // Set text color to #851961
  });
});

// Voeg coördinaten toe voor de steden
const citiesWithCoords = [
  { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
];

initEarth(".earth-container", citiesWithCoords);


