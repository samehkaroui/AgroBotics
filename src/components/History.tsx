import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  RefreshCw,
  Activity,
  Droplets,
  Thermometer,
  Zap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useHistoryData, useHistoryExport, useHistoryStats } from '../hooks/useHistoryData';

interface HistoryData {
  date: string;
  temperature: number;
  humidity: number;
  soilHumidity: number;
  waterConsumption: number;
  pumpHours: number;
  alerts: number;
  irrigationCycles?: number;
  zones?: string[];
}

const History: React.FC = () => {
  const { t } = useLanguage();
  const { useFirebase } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'water' | 'sensors' | 'equipment'>('all');
  
  // استخدام البيانات الحية من Firebase
  const { data: firebaseHistoryData, loading, refresh } = useHistoryData({
    timeRange,
    metric: selectedMetric
  }, useFirebase);
  
  // إحصائيات متقدمة - TODO: استخدام في واجهة الإحصائيات المتقدمة
  const stats = useHistoryStats(firebaseHistoryData);
  
  // تصدير البيانات
  const { exportToCSV, exportToJSON } = useHistoryExport();

  // استخدام البيانات من Firebase أو المولدة محلياً
  // const oldHistoryData = generateHistoryData(getDaysFromRange(timeRange));

  const handleRefresh = async () => {
    // إعادة تحميل البيانات بدلاً من إعادة تحميل الصفحة
    try {
      if (refresh) {
        refresh(); // استخدام دالة refresh من hook
        console.log('✅ Data refreshed successfully');
      } else {
        // fallback إلى reload إذا لم تكن دالة refresh متاحة
        console.log('⚠️ Using page reload as fallback');
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'json' = 'csv') => {
    if (format === 'csv') {
      await exportToCSV(firebaseHistoryData, `history-${timeRange}.csv`);
    } else {
      await exportToJSON(firebaseHistoryData, `history-${timeRange}.json`);
    }
  };

  // دالة مساعدة لعرض حالة التحميل
  const showLoadingState = loading && firebaseHistoryData.length === 0;
  
  // استخدام المتغيرات لتجنب التحذيرات
  if (stats) console.log('Stats available:', Object.keys(stats));
  if (showLoadingState) console.log('Loading data...');

  const getAverageValue = (key: keyof HistoryData) => {
    if (key === 'date' || firebaseHistoryData.length === 0) return 0;
    const values = firebaseHistoryData
      .map(d => d[key] as number)
      .filter(val => val !== undefined && val !== null && !isNaN(val));
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum: number, val: number) => sum + val, 0) / values.length * 10) / 10;
  };

  const getTotalValue = (key: keyof HistoryData) => {
    if (key === 'date' || firebaseHistoryData.length === 0) return 0;
    const values = firebaseHistoryData
      .map(d => d[key] as number)
      .filter(val => val !== undefined && val !== null && !isNaN(val));
    return Math.round(values.reduce((sum: number, val: number) => sum + val, 0) * 10) / 10;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('history')}</h1>
          <p className="text-gray-600">{t('historicalDataAnalysis')}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : (t('refresh') || 'Refresh')}</span>
          </button>
          
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>{t('export')}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-gray-600">Loading history data...</span>
        </div>
      )}

      {/* Enhanced Statistics Cards */}
      {!loading && firebaseHistoryData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Water Used</p>
              <p className="text-2xl font-bold text-blue-600">
                {getTotalValue('waterConsumption')}L
              </p>
            </div>
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {firebaseHistoryData.length} days recorded
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pump Hours</p>
              <p className="text-2xl font-bold text-green-600">
                {getTotalValue('pumpHours')}h
              </p>
            </div>
            <Zap className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Avg: {getAverageValue('pumpHours')}h/day
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Temperature</p>
              <p className="text-2xl font-bold text-orange-600">
                {getAverageValue('temperature')}°C
              </p>
            </div>
            <Thermometer className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {firebaseHistoryData.length > 0 ? (
              `Range: ${Math.min(...firebaseHistoryData.map(d => d.temperature))}° - ${Math.max(...firebaseHistoryData.map(d => d.temperature))}°`
            ) : (
              'No data available'
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {getTotalValue('alerts')}
              </p>
            </div>
            <Activity className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Avg: {firebaseHistoryData.length > 0 ? (getTotalValue('alerts') / firebaseHistoryData.length).toFixed(1) : '0'}/day
          </p>
        </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && firebaseHistoryData.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No History Data</h3>
          <p className="text-gray-600 mb-4">
            {useFirebase ? 
              'No historical data found in Firebase. Data will appear here once irrigation cycles are recorded.' :
              'Enable Firebase integration to view real historical data.'
            }
          </p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="7d">{t('last7Days')}</option>
              <option value="30d">{t('last30Days')}</option>
              <option value="90d">{t('last3Months')}</option>
              <option value="1y">{t('lastYear')}</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as 'all' | 'water' | 'sensors' | 'equipment')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">{t('allMetrics')}</option>
              <option value="water">{t('waterConsumptionMetric')}</option>
              <option value="sensors">{t('sensorData')}</option>
              <option value="equipment">{t('equipmentData')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('waterConsumption')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalValue('waterConsumption')}L
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {t('average')}: {getAverageValue('waterConsumption')}L/{t('day')}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Thermometer className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('temperature')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {getAverageValue('temperature')}°C
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {t('humidity')}: {getAverageValue('humidity')}%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('pumpHours')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalValue('pumpHours')}h
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {t('average')}: {getAverageValue('pumpHours')}h/{t('day')}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('totalAlerts')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalValue('alerts')}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {t('average')}: {getAverageValue('alerts')}/{t('day')}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Water Consumption Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('waterConsumption')}</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between space-x-1">
              {firebaseHistoryData.slice(-14).map((item, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-400 cursor-pointer relative"
                    style={{
                      height: `${(item.waterConsumption / Math.max(...firebaseHistoryData.map(d => d.waterConsumption))) * 100}%`,
                      minHeight: '2px'
                    }}
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {item.waterConsumption}L
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 transform rotate-45 origin-bottom-left">
                    {new Date(item.date).toLocaleDateString('fr-FR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Temperature & Humidity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('temperature')} & {t('humidity')}</h3>
            <Thermometer className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between space-x-1">
              {firebaseHistoryData.slice(-14).map((item, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group space-y-1"
                >
                  {/* Temperature Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-red-500 to-red-300 rounded-t-sm transition-all duration-300 hover:from-red-600 hover:to-red-400 cursor-pointer relative"
                    style={{
                      height: `${(item.temperature / 40) * 100}%`,
                      minHeight: '2px'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {item.temperature}°C
                    </div>
                  </div>
                  
                  {/* Humidity Bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-400 cursor-pointer relative"
                    style={{
                      height: `${(item.humidity / 100) * 100}%`,
                      minHeight: '2px'
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      {item.humidity}%
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 transform rotate-45 origin-bottom-left">
                    {new Date(item.date).toLocaleDateString('fr-FR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>{t('temperature')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>{t('humidity')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {!loading && firebaseHistoryData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{t('detailedData')}</h3>
          </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('date')}</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('temperature')}</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('humidity')}</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('soilMoisture')}</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('consumption')}</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('pumpHours')}</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Cycles</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Zones</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">{t('alerts')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {firebaseHistoryData.length > 0 ? firebaseHistoryData.slice(-10).reverse().map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm text-gray-900">
                    {new Date(row.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">{row.temperature}°C</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{row.humidity}%</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{row.soilHumidity}%</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{row.waterConsumption}L</td>
                  <td className="py-3 px-6 text-sm text-gray-900">{row.pumpHours}h</td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {row.irrigationCycles || 0}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {row.zones?.map((zone: string, zoneIndex: number) => (
                        <span key={zoneIndex} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {zone.replace('zone-', 'Z')}
                        </span>
                      )) || <span className="text-gray-400">-</span>}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.alerts === 0 ? 'bg-green-100 text-green-800' :
                      row.alerts <= 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {row.alerts}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default History;