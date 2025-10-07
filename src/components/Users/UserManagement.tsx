import React, { useState } from 'react';
import { 
  Users as UsersIcon,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Eye,
  Search,
  Activity,
  Clock,
  Calendar,
  Mail,
  Phone,
  Award,
  TrendingUp,
  X,
  Save
} from 'lucide-react';
import { User, ActivityLog } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { userService } from '../../services/realtimeDatabaseService';

interface UserManagementProps {
  users: User[];
  activityLogs: ActivityLog[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: () => void;
  onToggleUserStatus: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  activityLogs,
  onEditUser,
  onDeleteUser,
  onAddUser,
  onToggleUserStatus
}) => {
  const { t } = useLanguage();
  const { user: currentUser, useFirebase } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'viewer' as 'admin' | 'operator' | 'viewer',
    password: '',
    confirmPassword: ''
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-red-600" />;
      case 'operator':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'operator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    const date = new Date(lastLogin);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'En ligne';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${Math.floor(diffHours / 24)} jour(s)`;
  };

  const getUserActivityCount = (userId: string) => {
    return activityLogs.filter(log => log.userId === userId).length;
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleSaveNewUser = async () => {
    if (newUser.username && newUser.email && newUser.fullName && newUser.password) {
      if (newUser.password !== newUser.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      
      try {
        if (useFirebase) {
          // Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            newUser.email,
            newUser.password
          );
          
          // Create user profile in Realtime Database with Auth UID as key
          const userProfile: Partial<User> = {
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
            isActive: true,
            permissions: newUser.role === 'admin' ? ['all'] : 
                        newUser.role === 'operator' ? ['view_dashboard', 'control_irrigation', 'view_sensors', 'manage_schedules'] :
                        ['view_dashboard', 'view_sensors', 'view_history'],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          // Use the Firebase Auth UID as the database key
          await userService.createWithId(userCredential.user.uid, userProfile);
          
          alert(`✅ Utilisateur créé avec succès dans Firebase!\n\nEmail: ${newUser.email}\nPassword: ${newUser.password}\n\nL'utilisateur peut maintenant se connecter.`);
        } else {
          // Mock mode - just call the parent handler
          onAddUser();
          alert('Utilisateur ajouté avec succès! (Mode démo)');
        }
        
        // Réinitialiser le formulaire
        setNewUser({
          username: '',
          email: '',
          fullName: '',
          role: 'viewer',
          password: '',
          confirmPassword: ''
        });
        setShowAddUserModal(false);
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        console.error('Error creating user:', error);
        
        let errorMessage = 'Erreur lors de la création de l\'utilisateur';
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = 'Cet email est déjà utilisé';
        } else if (err.code === 'auth/weak-password') {
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = 'Email invalide';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`❌ ${errorMessage}`);
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('userManagement')}</h1>
            <p className="text-gray-600">Gestion des utilisateurs et permissions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {users.filter(u => u.isActive).length} Actifs
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {users.filter(u => {
                const lastLogin = new Date(u.lastLogin);
                const today = new Date();
                const diffHours = (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
                return diffHours < 24;
              }).length} Connectés aujourd'hui
            </span>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nouvel Utilisateur</span>
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Utilisateurs</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <div className="flex items-center space-x-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">+2 ce mois</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">Administrateurs</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter(u => u.role === 'admin').length}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            <Shield className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-600">Accès complet</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Opérateurs</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter(u => u.role === 'operator').length}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            <Activity className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-blue-600">Contrôle équipements</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-600">Utilisateurs Actifs</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter(u => u.isActive).length}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            <Clock className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-600">
              {Math.round((users.filter(u => u.isActive).length / users.length) * 100)}% du total
            </span>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="operator">Opérateur</option>
            <option value="viewer">Observateur</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Utilisateur</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Rôle</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Statut</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Dernière connexion</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Activité</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-700 font-medium">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {t(user.role)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        user.isActive ? 'text-emerald-700' : 'text-gray-500'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {formatLastLogin(user.lastLogin)}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {getUserActivityCount(user.id)} actions
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        disabled={user.id === currentUser?.id}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          user.isActive 
                            ? 'text-orange-600 hover:bg-orange-50' 
                            : 'text-emerald-600 hover:bg-emerald-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {user.isActive ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun utilisateur ne correspond aux critères de recherche'
                : 'Aucun utilisateur configuré'
              }
            </p>
            {(!searchTerm && roleFilter === 'all' && statusFilter === 'all') && (
              <button
                onClick={handleAddUser}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                Ajouter un utilisateur
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nouvel Utilisateur</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Jean Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="jdupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="jean.dupont@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'operator' | 'viewer' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="viewer">Observateur</option>
                  <option value="operator">Opérateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveNewUser}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Créer</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-emerald-100">
                    {selectedUser.avatar ? (
                      <img 
                        src={selectedUser.avatar} 
                        alt={selectedUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-700 font-bold text-xl">
                        {selectedUser.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                    <p className="text-gray-600">@{selectedUser.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleIcon(selectedUser.role)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(selectedUser.role)}`}>
                        {t(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informations de Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <p className="font-medium">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informations du Compte</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Créé le</p>
                      <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Dernière connexion</p>
                      <p className="font-medium">{formatLastLogin(selectedUser.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Permissions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {permission === 'all' ? 'Toutes les permissions' : permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Activity Summary */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Résumé d'Activité</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Actions Totales</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{getUserActivityCount(selectedUser.id)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Cette Semaine</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.floor(getUserActivityCount(selectedUser.id) * 0.3)}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Score</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      {Math.min(100, Math.floor(getUserActivityCount(selectedUser.id) * 2.5))}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Activité Récente</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {activityLogs
                    .filter(log => log.userId === selectedUser.id)
                    .slice(0, 5)
                    .map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          <p className="text-xs text-gray-600">{log.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;