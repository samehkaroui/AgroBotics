import React, { useState } from 'react';
import { Calendar, Clock, Plus, Play, Pause, Trash2, Edit } from 'lucide-react';
import { ScheduleItem, ZoneData } from '../types';

interface ProgrammingProps {
  zones: ZoneData[];
  schedules: ScheduleItem[];
  onAddSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
  onToggleSchedule: (scheduleId: string) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

const Programming: React.FC<ProgrammingProps> = ({
  zones,
  schedules,
  onAddSchedule,
  onToggleSchedule,
  onDeleteSchedule
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    zoneId: '',
    startTime: '',
    duration: 30,
    days: [] as string[],
    active: true
  });

  const daysOfWeek = [
    'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchedule.zoneId && newSchedule.startTime && newSchedule.days.length > 0) {
      onAddSchedule(newSchedule);
      setNewSchedule({
        zoneId: '',
        startTime: '',
        duration: 30,
        days: [],
        active: true
      });
      setShowAddForm(false);
    }
  };

  const toggleDay = (day: string) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : `Zone ${zoneId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programmation</h1>
          <p className="text-gray-600">Gérez les horaires d'irrigation automatique</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Planning</span>
        </button>
      </div>

      {/* Add Schedule Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Nouveau Planning</h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Zone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone
                </label>
                <select
                  value={newSchedule.zoneId}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, zoneId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Sélectionner une zone</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={newSchedule.startTime}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={newSchedule.duration}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jours de la semaine
              </label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      newSchedule.days.includes(day)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Créer le Planning
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedules List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Plannings Actifs</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {schedules.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun planning configuré</p>
              <p className="text-sm">Créez votre premier planning d'irrigation</p>
            </div>
          ) : (
            schedules.map(schedule => (
              <div key={schedule.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {schedule.zoneName || getZoneName(schedule.zoneId || schedule.zone || '')}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (schedule.active || schedule.isActive)
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(schedule.active || schedule.isActive) ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.startTime} ({schedule.duration} min)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{schedule.days ? schedule.days.join(', ') : (schedule.frequency || 'Daily')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleSchedule(schedule.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        (schedule.active || schedule.isActive)
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {(schedule.active || schedule.isActive) ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Programming;