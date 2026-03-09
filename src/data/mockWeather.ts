export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

export interface HourlyData {
  time: string;
  temp: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface DailyData {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  precipitation: number;
  humidity: number;
  wind: number;
}

export interface WeatherAlert {
  id: string;
  severity: 'advisory' | 'watch' | 'warning';
  title: string;
  description: string;
}

export interface MetricSparkline {
  values: number[];
}

export interface WeatherData {
  location: string;
  country: string;
  timezone: string;
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
  hourly: HourlyData[];
  daily: DailyData[];
  alerts: WeatherAlert[];
  sparklines: {
    wind: MetricSparkline;
    humidity: MetricSparkline;
    pressure: MetricSparkline;
    uv: MetricSparkline;
    visibility: MetricSparkline;
    temp: MetricSparkline;
  };
}

const generateSparkline = (base: number, variance: number, count = 12): MetricSparkline => ({
  values: Array.from({ length: count }, () => base + (Math.random() - 0.5) * variance * 2),
});

const generateHourly = (baseTemp: number, condition: WeatherCondition): HourlyData[] => {
  const hours: HourlyData[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const h = new Date(now.getTime() + i * 3600000);
    const variation = Math.sin((i / 24) * Math.PI * 2) * 5;
    hours.push({
      time: h.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: Math.round(baseTemp + variation + (Math.random() * 3 - 1.5)),
      condition: i > 6 && i < 20 ? condition : 'cloudy',
      precipitation: condition === 'rainy' || condition === 'stormy' ? Math.round(Math.random() * 80 + 20) : Math.round(Math.random() * 15),
    });
  }
  return hours;
};

const generateDaily = (baseTemp: number, condition: WeatherCondition): DailyData[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const conditions: WeatherCondition[] = [condition, 'cloudy', condition, 'sunny', condition];
  return days.map((day, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      high: Math.round(baseTemp + 3 + Math.random() * 5),
      low: Math.round(baseTemp - 5 - Math.random() * 5),
      condition: conditions[i],
      precipitation: conditions[i] === 'rainy' || conditions[i] === 'stormy' ? Math.round(Math.random() * 70 + 20) : Math.round(Math.random() * 20),
      humidity: Math.round(40 + Math.random() * 40),
      wind: Math.round(5 + Math.random() * 20),
    };
  });
};

export const PRESET_CITIES = [
  { name: 'Miami', country: 'US', timezone: 'America/New_York' },
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'JP', timezone: 'Asia/Tokyo' },
  { name: 'Dubai', country: 'AE', timezone: 'Asia/Dubai' },
  { name: 'Reykjavik', country: 'IS', timezone: 'Atlantic/Reykjavik' },
];

export const weatherScenarios: Record<string, WeatherData> = {
  'Miami': {
    location: 'Miami',
    country: 'US',
    timezone: 'America/New_York',
    current: {
      temp: 88,
      feelsLike: 95,
      condition: 'stormy',
      description: 'Severe thunderstorms with heavy rain',
      humidity: 89,
      windSpeed: 28,
      windDirection: 'SE',
      uvIndex: 3,
      visibility: 3,
      pressure: 998,
      dewPoint: 78,
    },
    hourly: generateHourly(88, 'stormy'),
    daily: generateDaily(88, 'stormy'),
    alerts: [
      { id: 'a1', severity: 'warning', title: 'Severe Thunderstorm Warning', description: 'Damaging winds up to 60mph and large hail possible. Seek shelter immediately.' },
      { id: 'a2', severity: 'watch', title: 'Flash Flood Watch', description: 'Heavy rainfall may lead to flash flooding in low-lying areas.' },
    ],
    sparklines: {
      wind: generateSparkline(28, 10),
      humidity: generateSparkline(89, 5),
      pressure: generateSparkline(998, 3),
      uv: generateSparkline(3, 2),
      visibility: generateSparkline(3, 1.5),
      temp: generateSparkline(88, 4),
    },
  },
  'Tokyo': {
    location: 'Tokyo',
    country: 'JP',
    timezone: 'Asia/Tokyo',
    current: {
      temp: 68,
      feelsLike: 66,
      condition: 'cloudy',
      description: 'Partly cloudy with cherry blossom breeze',
      humidity: 62,
      windSpeed: 9,
      windDirection: 'E',
      uvIndex: 4,
      visibility: 9,
      pressure: 1014,
      dewPoint: 54,
    },
    hourly: generateHourly(68, 'cloudy'),
    daily: generateDaily(68, 'cloudy'),
    alerts: [],
    sparklines: {
      wind: generateSparkline(9, 4),
      humidity: generateSparkline(62, 8),
      pressure: generateSparkline(1014, 2),
      uv: generateSparkline(4, 2),
      visibility: generateSparkline(9, 1),
      temp: generateSparkline(68, 5),
    },
  },
  'Dubai': {
    location: 'Dubai',
    country: 'AE',
    timezone: 'Asia/Dubai',
    current: {
      temp: 112,
      feelsLike: 120,
      condition: 'sunny',
      description: 'Blazing sun, extreme heat advisory',
      humidity: 18,
      windSpeed: 12,
      windDirection: 'NW',
      uvIndex: 11,
      visibility: 10,
      pressure: 1003,
      dewPoint: 62,
    },
    hourly: generateHourly(112, 'sunny'),
    daily: generateDaily(112, 'sunny'),
    alerts: [
      { id: 'a3', severity: 'warning', title: 'Extreme Heat Warning', description: 'Dangerously high temperatures. Avoid outdoor exposure between 10AM-4PM.' },
    ],
    sparklines: {
      wind: generateSparkline(12, 5),
      humidity: generateSparkline(18, 6),
      pressure: generateSparkline(1003, 2),
      uv: generateSparkline(11, 1),
      visibility: generateSparkline(10, 0.5),
      temp: generateSparkline(112, 6),
    },
  },
  'London': {
    location: 'London',
    country: 'UK',
    timezone: 'Europe/London',
    current: {
      temp: 52,
      feelsLike: 48,
      condition: 'rainy',
      description: 'Persistent drizzle with grey overcast',
      humidity: 88,
      windSpeed: 16,
      windDirection: 'SW',
      uvIndex: 1,
      visibility: 5,
      pressure: 1006,
      dewPoint: 49,
    },
    hourly: generateHourly(52, 'rainy'),
    daily: generateDaily(52, 'rainy'),
    alerts: [
      { id: 'a4', severity: 'advisory', title: 'Rain Advisory', description: 'Continuous light rain through the evening. Roads may be slippery.' },
    ],
    sparklines: {
      wind: generateSparkline(16, 6),
      humidity: generateSparkline(88, 4),
      pressure: generateSparkline(1006, 3),
      uv: generateSparkline(1, 1),
      visibility: generateSparkline(5, 2),
      temp: generateSparkline(52, 3),
    },
  },
  'Reykjavik': {
    location: 'Reykjavik',
    country: 'IS',
    timezone: 'Atlantic/Reykjavik',
    current: {
      temp: 30,
      feelsLike: 22,
      condition: 'snowy',
      description: 'Heavy snowfall with arctic winds',
      humidity: 78,
      windSpeed: 24,
      windDirection: 'N',
      uvIndex: 0,
      visibility: 2,
      pressure: 1022,
      dewPoint: 26,
    },
    hourly: generateHourly(30, 'snowy'),
    daily: generateDaily(30, 'snowy'),
    alerts: [
      { id: 'a5', severity: 'watch', title: 'Blizzard Watch', description: 'Heavy snow and high winds may cause whiteout conditions.' },
    ],
    sparklines: {
      wind: generateSparkline(24, 8),
      humidity: generateSparkline(78, 6),
      pressure: generateSparkline(1022, 2),
      uv: generateSparkline(0, 0.5),
      visibility: generateSparkline(2, 1),
      temp: generateSparkline(30, 4),
    },
  },
};
