import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface ChartData {
  date: string;
  temperature: number;
  humidity: number;
  soilHumidity: number;
  waterConsumption: number;
}

interface ChartsProps {
  data: ChartData[];
}

const Charts: React.FC<ChartsProps> = ({ data }) => {
  const [activeChart, setActiveChart] = useState<'temperature' | 'humidity' | 'consumption'>('temperature');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const getChartData = () => {
    switch (activeChart) {
      case 'temperature':
        return data.map(d => ({ date: d.date, value: d.temperature, unit: '°C' }));
      case 'humidity':
        return data.map(d => ({ date: d.date, value: d.humidity, unit: '%' }));
      case 'consumption':
        return data.map(d => ({ date: d.date, value: d.waterConsumption, unit: 'L' }));
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Graphiques de Tendance</h3>
        </div>
        
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4">
          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {[
              { id: 'temperature', label: 'Temp.', fullLabel: 'Température', icon: TrendingUp },
              { id: 'humidity', label: 'Hum.', fullLabel: 'Humidité', icon: Calendar },
              { id: 'consumption', label: 'Cons.', fullLabel: 'Consommation', icon: BarChart3 },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveChart(item.id as 'temperature' | 'humidity' | 'consumption')}
                className={`flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeChart === item.id
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="sm:hidden">{item.label}</span>
                <span className="hidden sm:inline">{item.fullLabel}</span>
              </button>
            ))}
          </div>
          
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 hover:border-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="7d">7j</option>
            <option value="30d">30j</option>
            <option value="90d">90j</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 sm:h-64">
        <div className="absolute inset-0 flex items-end justify-between space-x-0.5 sm:space-x-1">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
            >
              {/* Bar */}
              <div
                className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-400 cursor-pointer relative"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '2px'
                }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xxs sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {item.value}{item.unit}
                </div>
              </div>
              
              {/* Date Label */}
              <div className="mt-1 sm:mt-2 text-xxs sm:text-xs text-gray-500 transform rotate-45 origin-bottom-left">
                {new Date(item.date).toLocaleDateString('fr-FR', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-emerald-600">
            {Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length * 10) / 10}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Moyenne</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">
            {Math.max(...chartData.map(d => d.value))}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Maximum</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-orange-600">
            {Math.min(...chartData.map(d => d.value))}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Minimum</div>
        </div>
      </div>
    </div>
  );
};

export default Charts;