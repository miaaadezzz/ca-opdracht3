import './styles/reset.css';
import './styles/style.css';
// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// API Key for OpenWeatherMap
const apiKey = import.meta.env.VITE_OWM_API_KEY;
const url = 'https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&units=metric&appid=${apiKey}';


// List of cities and their countries
const cities = [
  { name: 'Tokyo', country: 'JP' },
  { name: 'Cairo', country: 'EG' },
  { name: 'Sydney', country: 'AU' },
  { name: 'New York', country: 'US' },
  { name: 'Rio de Janeiro', country: 'BR' },
];

// init Swiper:
const swiper = new Swiper('.swiper', {
  // configure Swiper to use modules
  modules: [Navigation, Pagination],
  
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// Function to fetch weather data for each city
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.main.temp; // 🌡️ Temperature in Celsius
  } catch (error) {
    console.error(`Error fetching weather data for ${city.name}:`, error);
    return 'N/A'; // Return 'N/A' if there's an error
  }
}

// Loop through the cities and update the temperature in the slider
cities.forEach((city, index) => {
  const cityElement = document.querySelectorAll('.swiper-slide')[index];
  const tempElement = cityElement.querySelector('.temperature');
  
  // Fetch the weather and update the temperature
  getWeather(city).then(temp => {
    tempElement.textContent = `🌡️ ${temp}°C`; // Update temperature in the slider
  });
});
