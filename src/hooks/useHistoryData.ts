import { useState, useEffect, useCallback } from 'react';
import { historyService } from '../services/realtimeDatabaseService';

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

interface HistoryFilters {
  timeRange: '7d' | '30d' | '90d' | '1y';
  metric: 'all' | 'water' | 'sensors' | 'equipment';
  startDate?: string;
  endDate?: string;
}

export function useHistoryData(filters: HistoryFilters, useFirebase: boolean = false): {
  data: HistoryData[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const [data, setData] = useState<HistoryData[]>([]);
  const [rawData, setRawData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (useFirebase) {
        // استخدام Firebase للبيانات الحقيقية
        const days = getDaysFromRange(filters.timeRange);
        const firebaseData = await historyService.getHistoryData(days);
        
        // معالجة البيانات وتحويلها للتنسيق المطلوب
        const processedData = processFirebaseHistoryData(firebaseData, days);
        
        // حفظ البيانات الخام
        setRawData(processedData);
        
        // تطبيق الفلاتر
        const filteredData = applyFilters(processedData, filters);
        setData(filteredData);
      } else {
        // استخدام البيانات الوهمية
        const days = getDaysFromRange(filters.timeRange);
        const mockData = generateMockHistoryData(days);
        
        // حفظ البيانات الخام
        setRawData(mockData);
        
        const filteredData = applyFilters(mockData, filters);
        setData(filteredData);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching history data:', err);
      
      // في حالة الخطأ، استخدم البيانات الوهمية
      const days = getDaysFromRange(filters.timeRange);
      const fallbackData = generateMockHistoryData(days);
      setRawData(fallbackData);
      const filteredData = applyFilters(fallbackData, filters);
      setData(filteredData);
    } finally {
      setLoading(false);
    }
  }, [filters, useFirebase]);

  // التحميل الأولي فقط - مرة واحدة
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (isMounted) {
        await fetchHistoryData();
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // نريد التحميل مرة واحدة فقط، وليس عند تغيير fetchHistoryData

  // تطبيق الفلاتر عند تغييرها على البيانات الموجودة
  useEffect(() => {
    if (rawData.length > 0) {
      const filteredData = applyFilters(rawData, filters);
      setData(filteredData);
    }
  }, [filters, rawData]);

  // دالة التحديث اليدوي - فقط عند الضغط على الزر
  const refresh = useCallback(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  return { data, loading, error, refresh };
}

// تحويل نطاق الوقت إلى عدد أيام
function getDaysFromRange(timeRange: string): number {
  switch (timeRange) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 365;
    default: return 30;
  }
}

// معالجة بيانات Firebase
function processFirebaseHistoryData(firebaseData: Record<string, unknown>[], days: number): HistoryData[] {
  const historyData: HistoryData[] = [];
  const baseDate = new Date();

  // إنشاء مصفوفة للأيام المطلوبة
  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // البحث عن البيانات لهذا اليوم
    const dayData = firebaseData.find(item => 
      item.date && typeof item.date === 'string' && item.date === dateString
    );

    if (dayData) {
      // استخدام البيانات المجمعة اليومية مباشرة
      const temperature = Number(dayData.temperature) || (18 + Math.random() * 12);
      const humidity = Number(dayData.humidity) || (45 + Math.random() * 35);
      const soilHumidity = Number(dayData.soilMoisture) || (35 + Math.random() * 45);
      const waterConsumption = Number(dayData.waterConsumption) || (80 + Math.random() * 150);
      const pumpHours = Number(dayData.pumpHours) || (2 + Math.random() * 8);
      const alertCount = Number(dayData.alerts) || 0;

      historyData.push({
        date: dateString,
        temperature: Math.round(temperature * 10) / 10,
        humidity: Math.round(humidity * 10) / 10,
        soilHumidity: Math.round(soilHumidity * 10) / 10,
        waterConsumption: Math.round(waterConsumption * 10) / 10,
        pumpHours: Math.round(pumpHours * 10) / 10,
        alerts: alertCount,
        irrigationCycles: Number(dayData.irrigationCycles) || 0,
        zones: Array.isArray(dayData.zones) ? dayData.zones as string[] : []
      });
    } else {
      // إذا لم توجد بيانات، استخدم قيم عشوائية
      historyData.push({
        date: dateString,
        temperature: Math.round((18 + Math.random() * 12) * 10) / 10,
        humidity: Math.round((45 + Math.random() * 35) * 10) / 10,
        soilHumidity: Math.round((35 + Math.random() * 45) * 10) / 10,
        waterConsumption: Math.round((80 + Math.random() * 150) * 10) / 10,
        pumpHours: Math.round((2 + Math.random() * 8) * 10) / 10,
        alerts: Math.floor(Math.random() * 5),
        irrigationCycles: Math.floor(Math.random() * 5) + 1,
        zones: ['zone-1', 'zone-2', 'zone-3'].slice(0, Math.floor(Math.random() * 3) + 1)
      });
    }
  }

  return historyData;
}

// إنشاء بيانات وهمية
function generateMockHistoryData(days: number): HistoryData[] {
  const data: HistoryData[] = [];
  const baseDate = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      temperature: Math.round((18 + Math.random() * 12) * 10) / 10,
      humidity: Math.round((45 + Math.random() * 35) * 10) / 10,
      soilHumidity: Math.round((35 + Math.random() * 45) * 10) / 10,
      waterConsumption: Math.round((80 + Math.random() * 150) * 10) / 10,
      pumpHours: Math.round((2 + Math.random() * 8) * 10) / 10,
      alerts: Math.floor(Math.random() * 5)
    });
  }
  
  return data;
}

// تطبيق الفلاتر
function applyFilters(data: HistoryData[], filters: HistoryFilters): HistoryData[] {
  let filteredData = [...data];

  // فلتر حسب التاريخ المخصص
  if (filters.startDate && filters.endDate) {
    filteredData = filteredData.filter(item => 
      item.date >= filters.startDate! && item.date <= filters.endDate!
    );
  }

  // فلتر حسب نوع البيانات
  if (filters.metric !== 'all') {
    // يمكن إضافة فلترة إضافية حسب نوع البيانات
    // مثلاً إخفاء بعض الأعمدة أو التركيز على مقاييس معينة
  }

  return filteredData;
}

// ملاحظة: تم حذف دوال calculateAverage و calculateSum لأنها لم تعد مستخدمة
// البيانات الآن مجمعة مسبقاً في Firebase

// Hook للتصدير (Export)
export function useHistoryExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (data: HistoryData[], filename: string = 'history-data.csv') => {
    setIsExporting(true);
    
    try {
      // تحويل البيانات إلى CSV
      const headers = ['Date', 'Temperature (°C)', 'Humidity (%)', 'Soil Humidity (%)', 'Water Consumption (L)', 'Pump Hours', 'Alerts'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.date,
          row.temperature,
          row.humidity,
          row.soilHumidity,
          row.waterConsumption,
          row.pumpHours,
          row.alerts
        ].join(','))
      ].join('\n');

      // إنشاء وتنزيل الملف
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async (data: HistoryData[], filename: string = 'history-data.json') => {
    setIsExporting(true);
    
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToCSV, exportToJSON, isExporting };
}

// Hook للإحصائيات المتقدمة
export function useHistoryStats(data: HistoryData[]) {
  const [stats, setStats] = useState<{
    temperature: { avg: number; min: number; max: number; trend: 'up' | 'down' | 'stable' };
    humidity: { avg: number; min: number; max: number; trend: 'up' | 'down' | 'stable' };
    waterConsumption: { total: number; avg: number; trend: 'up' | 'down' | 'stable' };
    pumpHours: { total: number; avg: number; trend: 'up' | 'down' | 'stable' };
    totalAlerts: number;
  } | null>(null);

  useEffect(() => {
    if (data.length === 0) {
      setStats(null);
      return;
    }

    // حساب الإحصائيات
    const temperatures = data.map(d => d.temperature);
    const humidities = data.map(d => d.humidity);
    const waterConsumption = data.map(d => d.waterConsumption);
    const pumpHours = data.map(d => d.pumpHours);

    const calculatedStats = {
      temperature: {
        avg: Math.round((temperatures.reduce((a, b) => a + b, 0) / temperatures.length) * 10) / 10,
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
        trend: calculateTrend(temperatures)
      },
      humidity: {
        avg: Math.round((humidities.reduce((a, b) => a + b, 0) / humidities.length) * 10) / 10,
        min: Math.min(...humidities),
        max: Math.max(...humidities),
        trend: calculateTrend(humidities)
      },
      waterConsumption: {
        total: Math.round(waterConsumption.reduce((a, b) => a + b, 0) * 10) / 10,
        avg: Math.round((waterConsumption.reduce((a, b) => a + b, 0) / waterConsumption.length) * 10) / 10,
        trend: calculateTrend(waterConsumption)
      },
      pumpHours: {
        total: Math.round(pumpHours.reduce((a, b) => a + b, 0) * 10) / 10,
        avg: Math.round((pumpHours.reduce((a, b) => a + b, 0) / pumpHours.length) * 10) / 10,
        trend: calculateTrend(pumpHours)
      },
      totalAlerts: data.reduce((sum, d) => sum + d.alerts, 0)
    };

    setStats(calculatedStats);
  }, [data]);

  return stats;
}

// حساب الاتجاه (صاعد/هابط)
function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  const threshold = firstAvg * 0.05; // 5% threshold
  
  if (difference > threshold) return 'up';
  if (difference < -threshold) return 'down';
  return 'stable';
}
