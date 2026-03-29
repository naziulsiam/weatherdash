import { WeatherProvider } from '@/context/WeatherContext';
import { ThemeProvider } from '@/components/theme-provider';
import Dashboard from '@/components/weather/Dashboard';

const Index = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="weather-theme" attribute="class">
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default Index;
