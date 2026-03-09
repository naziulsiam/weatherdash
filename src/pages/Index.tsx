import { WeatherProvider } from '@/context/WeatherContext';
import Dashboard from '@/components/weather/Dashboard';

const Index = () => {
  return (
    <WeatherProvider>
      <Dashboard />
    </WeatherProvider>
  );
};

export default Index;
