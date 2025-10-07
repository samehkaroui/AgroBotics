import React, { useState } from 'react';
import { AlertCircle, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithEmail, isLoading, useFirebase } = useAuth();
  const { t } = useLanguage();

  // Check if input looks like an email
  const isEmail = (input: string) => input.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    let success = false;

    if (useFirebase) {
      // Firebase mode - try email login
      if (isEmail(username)) {
        success = await loginWithEmail(username, password);
      } else {
        // Convert username to email format
        const email = `${username}@irrigationsystem.com`;
        success = await loginWithEmail(email, password);
      }
      
      if (!success) {
        setError('Email ou mot de passe incorrect. Assurez-vous que l\'utilisateur existe dans Firebase Authentication.');
      }
    } else {
      // Mock mode - use username login
      success = await login(username, password);
      if (!success) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <img 
              src="/logo.jpg" 
              alt="AgroBotics Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AgroBotics</h1>
          <p className="text-gray-600 mt-2">Système d'irrigation intelligent</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{t('login')}</h2>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                useFirebase 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {useFirebase ? '🔥 Firebase' : '💾 Demo'}
              </div>
            </div>
            <p className="text-gray-600">
              {useFirebase 
                ? 'Connectez-vous avec votre email Firebase' 
                : 'Connectez-vous à votre compte'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {useFirebase ? 'Email ou Username' : t('username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder={useFirebase ? "admin@irrigationsystem.com ou admin" : "Entrez votre nom d'utilisateur"}
                  disabled={isLoading}
                />
              </div>
              {useFirebase && (
                <p className="mt-1 text-xs text-gray-500">
                  💡 Utilisez 'admin', 'operator', ou 'viewer' (converti automatiquement en email)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Entrez votre mot de passe"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </div>
              ) : (
                t('login')
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              {useFirebase ? 'Comptes Firebase (créez-les dans Firebase Auth) :' : 'Comptes de démonstration :'}
            </p>
            
            {useFirebase ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-900 mb-2">📝 Pour utiliser Firebase:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800">
                    <li>Créez les utilisateurs dans Firebase Authentication</li>
                    <li>Email: admin@irrigationsystem.com</li>
                    <li>Password: password</li>
                    <li>Ou utilisez simplement: admin / password</li>
                  </ol>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" 
                     onClick={() => { setUsername('admin'); setPassword('password'); }}>
                  <span><strong>Admin:</strong> admin / password</span>
                  <span className="text-blue-600">Cliquer</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                     onClick={() => { setUsername('operator'); setPassword('password'); }}>
                  <span><strong>Opérateur:</strong> operator / password</span>
                  <span className="text-blue-600">Cliquer</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100" 
                     onClick={() => { setUsername('admin'); setPassword('password'); }}>
                  <span><strong>Admin:</strong> admin / password</span>
                  <span className="text-blue-600">Cliquer pour remplir</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                     onClick={() => { setUsername('operator'); setPassword('password'); }}>
                  <span><strong>Opérateur:</strong> operator / password</span>
                  <span className="text-blue-600">Cliquer pour remplir</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                     onClick={() => { setUsername('viewer'); setPassword('password'); }}>
                  <span><strong>Observateur:</strong> viewer / password</span>
                  <span className="text-blue-600">Cliquer pour remplir</span>
                </div>
              </div>
            )}
            
            {/* Quick Test Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { 
                  setUsername('admin'); 
                  setPassword('password'); 
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                  }, 100);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                🚀 Connexion rapide Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © 2025 AgroBotics - Système d'irrigation intelligent
        </div>
      </div>
    </div>
  );
};

export default Login;