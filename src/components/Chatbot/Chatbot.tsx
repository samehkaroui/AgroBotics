import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Lightbulb,
  Droplets,
  Thermometer,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface ChatbotProps {
  sensors?: any[];
  zones?: any[];
  alerts?: any[];
}

const Chatbot: React.FC<ChatbotProps> = ({ sensors = [], zones = [], alerts = [] }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '🌱 Bonjour ! Je suis votre assistant agricole intelligent. Je peux vous aider avec l\'irrigation, les cultures, et l\'analyse de vos données. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
      suggestions: [
        'Analyser mes capteurs',
        'Conseils d\'irrigation',
        'Problèmes de culture',
        'Optimiser ma consommation'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Base de connaissances agricole
  const knowledgeBase = {
    irrigation: {
      keywords: ['irrigation', 'arrosage', 'eau', 'humidité', 'sec', 'mouillé'],
      responses: [
        'Pour une irrigation optimale, maintenez l\'humidité du sol entre 60-80% selon la culture.',
        'Arrosez tôt le matin (6h-8h) pour réduire l\'évaporation et les maladies fongiques.',
        'Surveillez les capteurs d\'humidité : en dessous de 30% = irrigation urgente.',
        'Adaptez la fréquence selon la saison : plus fréquent en été, moins en hiver.'
      ]
    },
    temperature: {
      keywords: ['température', 'chaud', 'froid', 'climat', 'chaleur'],
      responses: [
        'Température optimale pour la plupart des légumes : 18-25°C le jour, 15-18°C la nuit.',
        'Au-dessus de 30°C : augmentez l\'irrigation et créez de l\'ombre si possible.',
        'En dessous de 10°C : protégez vos cultures avec des voiles d\'hivernage.',
        'Utilisez la ventilation pour réguler la température dans les serres.'
      ]
    },
    nutrients: {
      keywords: ['npk', 'azote', 'phosphore', 'potassium', 'nutriment', 'engrais'],
      responses: [
        'NPK équilibré pour croissance : N(azote) pour feuilles, P(phosphore) pour racines, K(potassium) pour fruits.',
        'Signes de carence en azote : feuilles jaunes, croissance lente.',
        'Excès d\'azote : feuillage dense mais peu de fruits.',
        'Testez le pH du sol : optimal entre 6.0-7.0 pour la plupart des cultures.'
      ]
    },
    diseases: {
      keywords: ['maladie', 'champignon', 'parasite', 'insecte', 'problème', 'feuille'],
      responses: [
        'Prévention : évitez l\'arrosage sur les feuilles, assurez une bonne circulation d\'air.',
        'Mildiou : réduisez l\'humidité, traitez avec du cuivre biologique.',
        'Pucerons : utilisez des coccinelles ou du savon noir dilué.',
        'Rotation des cultures pour éviter l\'épuisement du sol et les maladies.'
      ]
    },
    optimization: {
      keywords: ['optimiser', 'économie', 'rendement', 'productivité', 'efficacité'],
      responses: [
        'Programmez l\'irrigation selon les besoins réels mesurés par vos capteurs.',
        'Utilisez le paillage pour réduire l\'évaporation de 50%.',
        'Groupez les plantes par besoins en eau similaires.',
        'Collectez l\'eau de pluie pour réduire les coûts.'
      ]
    }
  };

  const analyzeSystemData = () => {
    const analysis = [];
    
    // Analyse des capteurs
    if (sensors.length > 0) {
      const tempSensor = sensors.find(s => s.name === 'airTemp');
      const humiditySensor = sensors.find(s => s.name === 'airHumidity');
      const soilSensors = sensors.filter(s => s.name.includes('soil') || s.name.includes('humidité'));
      
      if (tempSensor && tempSensor.value > 30) {
        analysis.push('🌡️ Température élevée détectée (' + tempSensor.value + '°C). Augmentez l\'irrigation et créez de l\'ombre.');
      }
      
      if (humiditySensor && humiditySensor.value < 40) {
        analysis.push('💧 Humidité de l\'air faible (' + humiditySensor.value + '%). Vaporisez légèrement les allées.');
      }
    }
    
    // Analyse des zones
    if (zones.length > 0) {
      zones.forEach(zone => {
        if (zone.soilHumidity < 30) {
          analysis.push('🚨 ' + zone.name + ' : Humidité du sol critique (' + zone.soilHumidity + '%). Irrigation urgente recommandée.');
        } else if (zone.soilHumidity > 85) {
          analysis.push('⚠️ ' + zone.name + ' : Sol très humide (' + zone.soilHumidity + '%). Risque de pourriture des racines.');
        }
      });
    }
    
    // Analyse des alertes
    if (alerts.length > 0) {
      const criticalAlerts = alerts.filter(a => a.type === 'error' && !a.read);
      if (criticalAlerts.length > 0) {
        analysis.push('🔴 ' + criticalAlerts.length + ' alerte(s) critique(s) nécessitent votre attention immédiate.');
      }
    }
    
    return analysis.length > 0 ? analysis : ['✅ Tous vos paramètres sont dans les normes optimales !'];
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Commandes spéciales
    if (message.includes('analyser') || message.includes('analyse') || message.includes('capteur')) {
      const analysis = analyzeSystemData();
      return '📊 **Analyse de votre système :**\n\n' + analysis.join('\n\n');
    }
    
    if (message.includes('météo') || message.includes('temps')) {
      return '🌤️ **Prévisions agricoles :**\n\nTemps ensoleillé prévu. Idéal pour :\n• Traitements phytosanitaires le matin\n• Récolte des légumes-feuilles\n• Aération des serres\n\nPensez à augmenter l\'irrigation de 20%.';
    }
    
    if (message.includes('planning') || message.includes('programme')) {
      return '📅 **Suggestions de planning :**\n\n**Cette semaine :**\n• Lundi : Contrôle des capteurs\n• Mercredi : Fertilisation zones A et B\n• Vendredi : Taille et entretien\n• Dimanche : Analyse des données\n\n**Irrigation automatique :** Activée selon vos seuils.';
    }
    
    // Recherche dans la base de connaissances
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
        return '💡 **Conseil ' + category + ' :**\n\n' + randomResponse + '\n\n*Basé sur vos données actuelles et les meilleures pratiques agricoles.*';
      }
    }
    
    // Réponses génériques intelligentes
    const genericResponses = [
      '🌱 Je comprends votre question. Pouvez-vous me donner plus de détails sur votre situation spécifique ?',
      '🤔 Intéressant ! Pour vous donner le meilleur conseil, dites-moi quel type de culture vous avez et dans quelle région ?',
      '📚 Cette question touche plusieurs aspects de l\'agriculture. Voulez-vous que je vous explique les bases ou que j\'aille directement aux solutions pratiques ?',
      '🎯 Excellente question ! Laissez-moi analyser vos données actuelles pour vous donner une réponse personnalisée.'
    ];
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulation de délai de réponse
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(inputMessage),
        timestamp: new Date(),
        suggestions: [
          'Analyser mes données',
          'Conseils saisonniers',
          'Problèmes courants',
          'Optimisation'
        ]
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Assistant Agricole</h3>
                  <p className="text-xs text-emerald-100">En ligne • IA Spécialisée</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs hover:bg-emerald-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question agricole..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                <Lightbulb className="w-3 h-3 mr-1" />
                Conseils basés sur vos données réelles
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;