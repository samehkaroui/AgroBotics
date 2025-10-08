import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  Mail,
  Settings
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  icon: React.ComponentType<{ className?: string }>;
  lastGenerated?: string;
}

const Reports: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'daily-summary',
      name: 'Rapport Journalier',
      description: 'Résumé quotidien des activités d\'irrigation',
      type: 'daily',
      icon: Calendar,
      lastGenerated: '2025-01-15T08:00:00Z'
    },
    {
      id: 'weekly-analysis',
      name: 'Analyse Hebdomadaire',
      description: 'Analyse des tendances et performances sur 7 jours',
      type: 'weekly',
      icon: TrendingUp,
      lastGenerated: '2025-01-14T18:00:00Z'
    },
    {
      id: 'monthly-report',
      name: 'Rapport Mensuel',
      description: 'Bilan complet mensuel avec recommandations',
      type: 'monthly',
      icon: FileText,
      lastGenerated: '2025-01-01T00:00:00Z'
    },
    {
      id: 'alerts-summary',
      name: 'Résumé des Alertes',
      description: 'Compilation des alertes et incidents',
      type: 'custom',
      icon: AlertTriangle,
      lastGenerated: '2025-01-15T12:00:00Z'
    },
    {
      id: 'maintenance-report',
      name: 'Rapport de Maintenance',
      description: 'État des équipements et planification maintenance',
      type: 'custom',
      icon: Settings,
      lastGenerated: '2025-01-10T10:00:00Z'
    },
    {
      id: 'efficiency-analysis',
      name: 'Analyse d\'Efficacité',
      description: 'Optimisation consommation eau et énergie',
      type: 'custom',
      icon: CheckCircle,
      lastGenerated: '2025-01-12T14:00:00Z'
    }
  ];

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true);
    setSelectedTemplate(templateId);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock PDF generation
    const template = reportTemplates.find(t => t.id === templateId);
    const blob = new Blob([`Rapport: ${template?.name}\nPériode: ${dateRange.start} - ${dateRange.end}\n\nContenu du rapport...`], 
      { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateId}-${dateRange.start}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setIsGenerating(false);
    setSelectedTemplate('');
  };

  const formatLastGenerated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Il y a moins d\'1h';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${Math.floor(diffHours / 24)} jour(s)`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-sm sm:text-base text-gray-600">Génération et gestion des rapports système</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border-none outline-none text-xs sm:text-sm min-w-0"
            />
            <span className="text-gray-400 text-xs sm:text-sm">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border-none outline-none text-xs sm:text-sm min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Rapports Générés</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">247</p>
          <p className="text-xxs sm:text-xs text-gray-500">Ce mois</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Téléchargements</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">1,234</p>
          <p className="text-xxs sm:text-xs text-gray-500">Total</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Programmés</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">12</p>
          <p className="text-xxs sm:text-xs text-gray-500">Actifs</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Envoyés</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">89</p>
          <p className="text-xxs sm:text-xs text-gray-500">Cette semaine</p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          const isGeneratingThis = isGenerating && selectedTemplate === template.id;
          
          return (
            <div
              key={template.id}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{template.name}</h3>
                  <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xxs sm:text-xs font-medium ${
                    template.type === 'daily' ? 'bg-blue-100 text-blue-800' :
                    template.type === 'weekly' ? 'bg-green-100 text-green-800' :
                    template.type === 'monthly' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {template.type === 'daily' ? 'Quotidien' :
                     template.type === 'weekly' ? 'Hebdomadaire' :
                     template.type === 'monthly' ? 'Mensuel' : 'Personnalisé'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{template.description}</p>

              {/* Last Generated */}
              {template.lastGenerated && (
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">Dernier: {formatLastGenerated(template.lastGenerated)}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-1.5 sm:space-x-2">
                <button
                  onClick={() => handleGenerateReport(template.id)}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingThis ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">Génération...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Générer</span>
                    </>
                  )}
                </button>
                
                <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                <button className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Rapports Programmés</h3>
            <button className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Nouveau Planning</span>
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {[
            { name: 'Rapport Journalier', frequency: 'Tous les jours à 08:00', status: 'active', nextRun: '2025-01-16T08:00:00Z' },
            { name: 'Analyse Hebdomadaire', frequency: 'Tous les lundis à 09:00', status: 'active', nextRun: '2025-01-20T09:00:00Z' },
            { name: 'Bilan Mensuel', frequency: 'Le 1er de chaque mois', status: 'paused', nextRun: '2025-02-01T00:00:00Z' }
          ].map((schedule, index) => (
            <div key={index} className="p-4 sm:p-6">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{schedule.name}</h4>
                    <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xxs sm:text-xs font-medium flex-shrink-0 ${
                      schedule.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.status === 'active' ? 'Actif' : 'Suspendu'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{schedule.frequency}</p>
                  <p className="text-xxs sm:text-xs text-gray-500">
                    Prochaine exécution: {new Date(schedule.nextRun).toLocaleString('fr-FR')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                  <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    schedule.status === 'active'
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}>
                    {schedule.status === 'active' ? 'Suspendre' : 'Activer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;