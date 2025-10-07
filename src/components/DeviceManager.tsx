import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { pumpService, valveService, sensorService } from '../services/realtimeDatabaseService';

interface DeviceManagerProps {
  onClose: () => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pump' | 'valve' | 'sensor'>('pump');
  const [formData, setFormData] = useState({
    name: '',
    status: 'stopped',
    flowRate: 100,
    power: 1500,
    location: '',
    openingPercentage: 0,
    zone: '',
    type: 'electric',
    sensorType: 'soil_moisture',
    unit: '%'
  });

  const handleAddPump = async () => {
    try {
      await pumpService.create({
        name: formData.name,
        status: formData.status as 'running' | 'stopped',
        flowRate: formData.flowRate,
        power: formData.power,
        location: formData.location,
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        pressure: 0,
        totalHours: 0,
        model: 'Standard'
      });
      alert('✅ تم إضافة المضخة بنجاح!');
      resetForm();
    } catch (error) {
      alert('❌ خطأ في إضافة المضخة');
      console.error(error);
    }
  };

  const handleAddValve = async () => {
    try {
      await valveService.create({
        name: formData.name,
        status: formData.status as 'open' | 'closed',
        openingPercentage: formData.openingPercentage,
        zoneId: formData.zone,
        type: formData.type as 'solenoid' | 'motorized' | 'manual',
        lastOperation: new Date().toISOString(),
        operationCount: 0,
        location: formData.location
      });
      alert('✅ تم إضافة الصمام بنجاح!');
      resetForm();
    } catch (error) {
      alert('❌ خطأ في إضافة الصمام');
      console.error(error);
    }
  };

  const handleAddSensor = async () => {
    try {
      await sensorService.create({
        name: formData.name,
        type: formData.sensorType as 'temperature' | 'humidity' | 'soil_moisture' | 'npk' | 'ph' | 'light',
        location: formData.location,
        status: 'active',
        batteryLevel: 100,
        lastCalibration: new Date().toISOString(),
        nextCalibration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        minValue: 0,
        maxValue: 100,
        alertThresholds: {
          min: 20,
          max: 80
        },
        model: 'Standard',
        serialNumber: `SN-${Date.now()}`
      });
      alert('✅ تم إضافة الحساس بنجاح!');
      resetForm();
    } catch (error) {
      alert('❌ خطأ في إضافة الحساس');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      status: 'stopped',
      flowRate: 100,
      power: 1500,
      location: '',
      openingPercentage: 0,
      zone: '',
      type: 'solenoid',
      sensorType: 'soil_moisture',
      unit: '%'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'pump') handleAddPump();
    else if (activeTab === 'valve') handleAddValve();
    else if (activeTab === 'sensor') handleAddSensor();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">إدارة الأجهزة</h2>
            <p className="text-gray-600 text-sm mt-1">إضافة وتعديل الأجهزة في Firebase</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('pump')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'pump'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            المضخات
          </button>
          <button
            onClick={() => setActiveTab('valve')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'valve'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            الصمامات
          </button>
          <button
            onClick={() => setActiveTab('sensor')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'sensor'
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            الحساسات
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Pump Form */}
          {activeTab === 'pump' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المضخة *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="مثال: مضخة الحديقة الرئيسية"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معدل التدفق (L/min)
                  </label>
                  <input
                    type="number"
                    value={formData.flowRate}
                    onChange={(e) => setFormData({ ...formData, flowRate: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القدرة (W)
                  </label>
                  <input
                    type="number"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="مثال: الحديقة الشمالية"
                />
              </div>
            </>
          )}

          {/* Valve Form */}
          {activeTab === 'valve' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الصمام *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="مثال: صمام المنطقة الشرقية"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة
                  </label>
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="zone-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    النوع
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="solenoid">سولينويد</option>
                    <option value="motorized">محرك</option>
                    <option value="manual">يدوي</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Sensor Form */}
          {activeTab === 'sensor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الحساس *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="مثال: حساس رطوبة التربة 1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الحساس
                  </label>
                  <select
                    value={formData.sensorType}
                    onChange={(e) => setFormData({ ...formData, sensorType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="soil_moisture">رطوبة التربة</option>
                    <option value="temperature">درجة الحرارة</option>
                    <option value="humidity">الرطوبة</option>
                    <option value="npk">NPK</option>
                    <option value="ph">الحموضة (pH)</option>
                    <option value="light">الإضاءة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوحدة
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="%, °C, bar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="مثال: المنطقة الشرقية"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة</span>
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>ملاحظة:</strong> سيتم حفظ الجهاز في Firebase Realtime Database تلقائياً.
            يمكنك أيضاً التعديل مباشرة من Firebase Console.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceManager;
