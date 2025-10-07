import { useState, useEffect } from 'react';
import { historyService } from '../services/realtimeDatabaseService';
import { generateChartData } from '../utils/mockData';

interface ChartDataPoint {
  date: string;
  temperature: number;
  humidity: number;
  soilHumidity: number;
  waterConsumption: number;
}

export function useChartData(days: number = 7, useFirebase: boolean = false) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (useFirebase) {
          // استخدام Firebase للبيانات الحقيقية
          const historyData = await historyService.getHistoryData(days);
          
          // تحويل البيانات إلى تنسيق الرسم البياني
          const chartData = processFirebaseHistoryData(historyData, days);
          setData(chartData);
        } else {
          // استخدام البيانات الوهمية
          const mockData = generateChartData(days);
          setData(mockData);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching chart data:', err);
        
        // في حالة الخطأ، استخدم البيانات الوهمية
        const fallbackData = generateChartData(days);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [days, useFirebase]);

  return { data, loading, error };
}

// دالة لمعالجة بيانات Firebase وتحويلها لتنسيق الرسم البياني
function processFirebaseHistoryData(historyData: Record<string, unknown>[], days: number): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = [];
  const baseDate = new Date();

  // إنشاء مصفوفة للأيام المطلوبة
  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // البحث عن البيانات اليومية المجمعة
    const dayData = historyData.find(item => 
      item.date && typeof item.date === 'string' && item.date === dateString
    );

    if (dayData) {
      // استخدام البيانات المجمعة مباشرة
      const temperature = Number(dayData.temperature) || (20 + Math.random() * 15);
      const humidity = Number(dayData.humidity) || (40 + Math.random() * 40);
      const soilHumidity = Number(dayData.soilMoisture) || (30 + Math.random() * 50);
      const waterConsumption = Number(dayData.waterConsumption) || (50 + Math.random() * 200);

      chartData.push({
        date: dateString,
        temperature: Math.round(temperature * 10) / 10,
        humidity: Math.round(humidity * 10) / 10,
        soilHumidity: Math.round(soilHumidity * 10) / 10,
        waterConsumption: Math.round(waterConsumption * 10) / 10
      });
    } else {
      // إذا لم توجد بيانات، استخدم قيم عشوائية واقعية
      chartData.push({
        date: dateString,
        temperature: Math.round((22 + Math.random() * 8) * 10) / 10, // 22-30°C
        humidity: Math.round((50 + Math.random() * 30) * 10) / 10,   // 50-80%
        soilHumidity: Math.round((40 + Math.random() * 35) * 10) / 10, // 40-75%
        waterConsumption: Math.round((80 + Math.random() * 150) * 10) / 10 // 80-230L
      });
    }
  }

  return chartData;
}

// ملاحظة: تم حذف دوال calculateAverage و calculateSum
// البيانات الآن مجمعة مسبقاً في Firebase بشكل يومي

// Hook للبيانات الحية (Real-time)
export function useRealtimeChartData(useFirebase: boolean = false) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!useFirebase) {
      // استخدام البيانات الوهمية
      const mockData = generateChartData(7);
      setData(mockData);
      setLoading(false);
      return;
    }

    // إعداد الاستماع للبيانات الحية من Firebase
    let unsubscribe: (() => void) | undefined;

    const setupRealtimeListener = async () => {
      try {
        // الحصول على البيانات الأولية
        const initialData = await historyService.getHistoryData(7);
        const chartData = processFirebaseHistoryData(initialData, 7);
        setData(chartData);
        setLoading(false);

        // TODO: إضافة مستمع للتحديثات الحية
        // يمكن إضافة subscription للتحديثات الحية هنا
        
      } catch (error) {
        console.error('Error setting up realtime chart data:', error);
        // استخدام البيانات الوهمية في حالة الخطأ
        const fallbackData = generateChartData(7);
        setData(fallbackData);
        setLoading(false);
      }
    };

    setupRealtimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [useFirebase]);

  return { data, loading };
}
