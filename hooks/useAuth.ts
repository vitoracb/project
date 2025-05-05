import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, UserRole } from '../types';
import { Platform } from 'react-native';

// Mock user data (replace with actual API implementation)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@fazenda.com',
    name: 'Administrador',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    role: UserRole.ADMIN,
    passwordHash: 'admin123', // In a real app, this would be securely hashed
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'membro1@fazenda.com',
    name: 'João Silva',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    role: UserRole.MEMBER,
    passwordHash: 'membro123', // In a real app, this would be securely hashed
    createdAt: new Date().toISOString(),
  },
];

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  // Load user data from storage on mount
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        let userJson;
        
        if (Platform.OS === 'web') {
          userJson = localStorage.getItem('user');
        } else {
          userJson = await SecureStore.getItemAsync('user');
        }
        
        if (userJson) {
          const user = JSON.parse(userJson);
          setState({
            isLoading: false,
            isAuthenticated: true,
            user,
            error: null,
          });
        } else {
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: null,
          });
        }
      } catch (error) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: 'Falha ao carregar dados do usuário.',
        });
      }
    }

    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      // Simulate API call - in a real app, this would be a server request
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.passwordHash === password
      );

      if (!user) {
        throw new Error('Credenciais inválidas.');
      }

      // Remove password hash before storing
      const { passwordHash, ...userWithoutPassword } = user;
      const userToStore = userWithoutPassword as User;

      // Store user in secure storage
      const userJson = JSON.stringify(userToStore);
      
      if (Platform.OS === 'web') {
        localStorage.setItem('user', userJson);
      } else {
        await SecureStore.setItemAsync('user', userJson);
      }

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: userToStore,
        error: null,
      });

      return userToStore;
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login.',
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setState({ ...state, isLoading: true });
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('user');
      } else {
        await SecureStore.deleteItemAsync('user');
      }

      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Erro ao fazer logout.',
      });
    }
  };

  return {
    ...state,
    login,
    logout,
  };
}