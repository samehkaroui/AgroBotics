# 🌱 AgroBotics - Smart Irrigation System

## 🚀 Overview

AgroBotics is a comprehensive smart irrigation management system that combines IoT technology, real-time monitoring, and intelligent automation to optimize agricultural water usage.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Monitoring**: Live sensor data from soil moisture, temperature, and humidity sensors
- **Smart Irrigation Control**: Automated pump and valve control based on sensor readings
- **Zone Management**: Multi-zone irrigation with individual scheduling and control
- **Equipment Management**: Complete CRUD operations for pumps, valves, and sensors
- **User Management**: Role-based access control with Firebase Authentication
- **Historical Data**: Comprehensive logging and analytics with export functionality

### 🌐 Multi-language Support
- **French** (Français)
- **Arabic** (العربية) with RTL support
- **English**

### 📱 Responsive Design
- Mobile-first design
- Tablet and desktop optimized
- Modern UI with Tailwind CSS

## 🔥 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend & Database
- **Firebase Firestore** for real-time database
- **Firebase Authentication** for user management
- **Firebase Hosting** for deployment

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **PostCSS** with Autoprefixer

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd agrobotics-irrigation-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
```bash
# Copy environment template
cp .env.example .env

# Add your Firebase configuration
# Edit .env with your Firebase project credentials
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Copy configuration to `.env` file

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 📊 System Architecture

### Data Flow
```
Sensors → ESP32/Arduino → Firebase → React App → User Interface
```

### Database Structure
- **users**: User profiles and permissions
- **zones**: Irrigation zones configuration
- **pumps**: Pump equipment data
- **valves**: Valve equipment data  
- **sensors**: Sensor configurations
- **schedules**: Irrigation schedules
- **alerts**: System notifications
- **history**: Historical data logs

## 🎮 Usage

### Default Login Credentials
- **Admin**: `admin@agrobotics.com` / `password`
- **Operator**: `operator@agrobotics.com` / `password`
- **Viewer**: `viewer@agrobotics.com` / `password`

### Key Functions

#### Dashboard
- Real-time zone monitoring
- System status overview
- Alert notifications
- Quick controls

#### Equipment Management
- Pump control and monitoring
- Valve operations
- Sensor calibration
- Maintenance scheduling

#### User Management
- Create/edit users
- Role assignment
- Permission management
- Activity tracking

#### Scheduling
- Automated irrigation programs
- Weather-based adjustments
- Zone-specific schedules
- Manual overrides

## 🔒 Security

### Authentication
- Firebase Authentication
- Role-based access control
- Session management
- Secure password policies

### Database Security
- Firestore security rules
- User permission validation
- Data encryption in transit
- Audit logging

## 📱 Hardware Integration

### Supported Hardware
- **ESP32/ESP8266** microcontrollers
- **Soil moisture sensors**
- **Temperature/Humidity sensors** (DHT22, SHT30)
- **Water pumps** with relay control
- **Solenoid valves**
- **Flow meters**
- **pH sensors**

### Communication Protocols
- **WiFi** for ESP32 connectivity
- **HTTP/HTTPS** API calls
- **WebSocket** for real-time updates
- **MQTT** (optional)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Firebase Deployment
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy to Firebase Hosting
firebase deploy
```

## 📈 Performance

### Metrics
- **Load Time**: < 3 seconds
- **Real-time Latency**: < 2 seconds  
- **Firestore Operations**: ~50-100 reads/day
- **Cost**: Free tier sufficient for small farms

### Optimization
- Code splitting with Vite
- Lazy loading of components
- Efficient Firebase queries
- Image optimization
- Caching strategies

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 📚 Documentation

### API Documentation
- Firebase Firestore API
- Custom service layer
- Component documentation
- Hook usage examples

### User Guides
- [User Manual](./docs/USER_MANUAL.md)
- [Admin Guide](./docs/ADMIN_GUIDE.md)
- [Hardware Setup](./docs/HARDWARE_SETUP.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- Check the [FAQ](./docs/FAQ.md)
- Review [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
- Open an issue on GitHub
- Contact support team

### Community
- [Discord Server](https://discord.gg/agrobotics)
- [Forum](https://forum.agrobotics.com)
- [Documentation](https://docs.agrobotics.com)

## 🎯 Roadmap

### Version 2.1 (Current)
- ✅ Multi-language support
- ✅ Real-time synchronization
- ✅ User management
- ✅ Equipment control

### Version 2.2 (Planned)
- [ ] Weather API integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] AI-powered recommendations

### Version 3.0 (Future)
- [ ] Machine learning optimization
- [ ] Satellite imagery integration
- [ ] Drone monitoring support
- [ ] Advanced reporting

## 📞 Contact

- **Website**: https://agrobotics.com
- **Email**: support@agrobotics.com
- **Phone**: +1 (555) 123-4567
- **Address**: 123 AgriTech Street, Farm Valley, CA 90210

---

**Built with ❤️ for sustainable agriculture**

© 2025 AgroBotics - Smart Irrigation Systems
