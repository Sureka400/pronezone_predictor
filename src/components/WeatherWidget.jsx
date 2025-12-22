import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';
import GlassCard from './GlassCard';

const WeatherWidget = ({ lat, lng, className = '' }) => {
  const { weather, loading, error } = useWeather(lat, lng);

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'clear': Sun,
      'clouds': Cloud,
      'rain': CloudRain,
      'snow': CloudSnow,
      'drizzle': CloudRain,
      'thunderstorm': CloudRain,
      'mist': Cloud,
      'fog': Cloud
    };
    
    return iconMap[condition?.toLowerCase()] || Cloud;
  };

  if (loading) {
    return (
      <GlassCard className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-3 bg-white/20 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className={`p-4 ${className}`}>
        <div className="text-center text-white/70">
          <Cloud className="mx-auto mb-2" size={24} />
          <p className="text-sm">Weather unavailable</p>
        </div>
      </GlassCard>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.current.condition.main);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-medium text-sm mb-1">
              {weather.location.name}
            </h3>
            <p className="text-white/70 text-xs capitalize">
              {weather.current.condition.description}
            </p>
          </div>
          <WeatherIcon className="text-accent-cyan" size={24} />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-white">
            {Math.round(weather.current.temperature)}°
          </div>
          <div className="text-right text-xs text-white/70">
            <div>Feels like {Math.round(weather.current.feelsLike)}°</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/70">
            <Wind size={12} />
            <span>{Math.round(weather.current.windSpeed)} m/s</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <Droplets size={12} />
            <span>{weather.current.humidity}%</span>
          </div>
        </div>

        {weather.cached && (
          <div className="mt-2 text-xs text-white/50">
            Cached data
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default WeatherWidget;