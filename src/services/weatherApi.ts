/* eslint-disable @typescript-eslint/no-explicit-any */
import { WeatherCondition } from '@/data/mockWeather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Map OpenWeather condition codes to our app's conditions
// Map OpenWeather condition codes to our app's conditions
const mapCondition = (code: number, icon: string = '01d'): WeatherCondition => {
  const isNight = icon.endsWith('n');

  // Thunderstorm
  if (code >= 200 && code < 300) return 'stormy';
  // Drizzle / Rain
  if (code >= 300 && code < 600) return 'rainy';
  // Snow
  if (code >= 600 && code < 700) return 'snowy';
  // Atmosphere (fog, mist, etc.)
  if (code >= 700 && code < 800) return 'cloudy';
  // Clear
  if (code === 800) return isNight ? 'clear-night' : 'sunny';
  // Clouds
  if (code > 800) return 'cloudy';

  return isNight ? 'clear-night' : 'sunny';
};

// Get weather description from code
const getDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    200: 'Thunderstorm with light rain',
    201: 'Thunderstorm with rain',
    202: 'Thunderstorm with heavy rain',
    300: 'Light drizzle',
    301: 'Drizzle',
    500: 'Light rain',
    501: 'Moderate rain',
    502: 'Heavy rain',
    600: 'Light snow',
    601: 'Snow',
    602: 'Heavy snow',
    701: 'Mist',
    741: 'Fog',
    800: 'Clear sky',
    801: 'Few clouds',
    802: 'Scattered clouds',
    803: 'Broken clouds',
    804: 'Overcast clouds',
  };
  return descriptions[code] || 'Clear sky';
};

// Convert wind degrees to direction
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export interface WeatherApiResponse {
  location: string;
  country: string;
  timezone: number;
  current: {
    temp: number;
    feelsLike: number;
    condition: WeatherCondition;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    visibility: number;
    pressure: number;
    dewPoint: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: WeatherCondition;
    precipitation: number;
  }>;
  daily: Array<{
    day: string;
    date: string;
    high: number;
    low: number;
    condition: WeatherCondition;
    precipitation: number;
    humidity: number;
    wind: number;
  }>;
}

const fetchWeatherData = async (query: string): Promise<WeatherApiResponse> => {
  if (!API_KEY) {
    throw new Error('OpenWeather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file');
  }

  // Current weather
  const currentRes = await fetch(
    `${BASE_URL}/weather?${query}&appid=${API_KEY}&units=imperial`
  );

  if (!currentRes.ok) {
    if (currentRes.status === 404) throw new Error('Location not found');
    if (currentRes.status === 401) throw new Error('Invalid API key');
    throw new Error('Failed to fetch weather data');
  }

  const currentData = await currentRes.json();

  // 5-day forecast (includes 3-hour intervals)
  const forecastRes = await fetch(
    `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=imperial`
  );

  if (!forecastRes.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const forecastData = await forecastRes.json();

  // Process hourly forecast (next 24 hours, using 3-hour intervals)
  const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    }),
    temp: Math.round(item.main.temp),
    condition: mapCondition(item.weather[0].id, item.weather[0].icon),
    precipitation: Math.round((item.pop || 0) * 100), // Probability of precipitation
  }));

  // Process daily forecast (aggregate by day)
  const dailyMap = new Map();
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        day: dayKey,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temps: [],
        conditions: [],
        precipitation: Math.round((item.pop || 0) * 100),
        humidity: item.main.humidity,
        wind: item.wind.speed,
      });
    }

    const day = dailyMap.get(dayKey);
    day.temps.push(item.main.temp);
    day.conditions.push(item.weather[0].id);
  });

  // Calculate daily highs/lows and most common condition
  const daily = Array.from(dailyMap.values()).slice(0, 5).map((day: any) => {
    // Find most common condition
    const conditionCounts = day.conditions.reduce((acc: any, id: number) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const sortedConditions = Object.entries(conditionCounts)
      .sort((a: any, b: any) => b[1] - a[1]);

    const mostCommonCondition = sortedConditions.length > 0 ? sortedConditions[0][0] : 800;

    return {
      day: day.day,
      date: day.date,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      condition: mapCondition(Number(mostCommonCondition), '01d'), // Daily usually shows day version
      precipitation: day.precipitation,
      humidity: day.humidity,
      wind: Math.round(day.wind),
    };
  });

  // Estimate UV index (OpenWeather free doesn't include UV, so we estimate based on time/weather)
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;
  const cloudCover = currentData.clouds?.all || 0;
  let uvIndex = 0;
  if (isDaytime) {
    const baseUv = 5 + Math.sin((hour - 6) / 12 * Math.PI) * 6;
    uvIndex = Math.round(baseUv * (1 - cloudCover / 100));
  }

  // Estimate dew point using approximation formula
  const temp = currentData.main.temp;
  const humidity = currentData.main.humidity;
  const dewPoint = Math.round(temp - ((100 - humidity) / 5));

  return {
    location: currentData.name,
    country: currentData.sys.country,
    timezone: currentData.timezone,
    current: {
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      condition: mapCondition(currentData.weather[0].id, currentData.weather[0].icon),
      description: getDescription(currentData.weather[0].id),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed),
      windDirection: getWindDirection(currentData.wind.deg),
      uvIndex,
      visibility: Math.round((currentData.visibility || 10000) / 1609.34), // Convert meters to miles
      pressure: currentData.main.pressure,
      dewPoint,
    },
    hourly,
    daily,
  };
};

// Fetch current weather by city name
export const fetchWeatherByCity = async (city: string): Promise<WeatherApiResponse> => {
  return fetchWeatherData(`q=${encodeURIComponent(city)}`);
};

// Fetch weather by coordinates (for geolocation)
export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherApiResponse> => {
  return fetchWeatherData(`lat=${lat}&lon=${lon}`);
};

export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Search cities using OpenWeather Geocoding API
export const searchCities = async (query: string): Promise<CitySearchResult[]> => {
  if (!API_KEY) {
    return [];
  }

  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to search cities');
    }

    const data = await response.json();

    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('City search error:', error);
    return [];
  }
};
