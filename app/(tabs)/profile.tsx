import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { User, Mail, Settings, LogOut, Key, Bell, ShieldCheck, CircleHelp as HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';

import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Tem certeza que deseja sair?');
      if (confirmed) {
        await logout();
        router.replace('/');
      }
    } else {
      Alert.alert(
        'Sair',
        'Tem certeza que deseja sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Sim', 
            onPress: async () => {
              await logout();
              router.replace('/');
            } 
          }
        ]
      );
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não encontrado. Por favor, faça login novamente.</Text>
        <Button title="Voltar para Login" onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={Colors.white} />
            </View>
          )}
          
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>Alterar foto</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role === 'ADMIN' ? 'Administrador' : 'Membro'}</Text>
        
        <View style={styles.userContact}>
          <Mail size={16} color={Colors.text.secondary} />
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <User size={20} color={Colors.primary.main} />
            <Text style={styles.optionText}>Editar Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}>
            <Key size={20} color={Colors.primary.main} />
            <Text style={styles.optionText}>Alterar Senha</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}>
            <Bell size={20} color={Colors.primary.main} />
            <Text style={styles.optionText}>Notificações</Text>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <Settings size={20} color={Colors.secondary.main} />
            <Text style={styles.optionText}>Configurações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}>
            <ShieldCheck size={20} color={Colors.secondary.main} />
            <Text style={styles.optionText}>Privacidade e Segurança</Text>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <Card style={styles.optionCard}>
          <TouchableOpacity style={styles.option}>
            <HelpCircle size={20} color={Colors.accent.main} />
            <Text style={styles.optionText}>Ajuda e Suporte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}>
            <User size={20} color={Colors.accent.main} />
            <Text style={styles.optionText}>Sobre</Text>
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Sair"
          variant="outlined"
          onPress={handleLogout}
          icon={<LogOut size={18} color={Colors.error.main} />}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
        
        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    backgroundColor: Colors.primary.main,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey[400],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  editAvatarButton: {
    marginTop: Spacing.s,
  },
  editAvatarText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.white,
  },
  userName: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.primary.light,
    marginBottom: Spacing.s,
  },
  userContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
  section: {
    padding: Spacing.l,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: Spacing.s,
  },
  optionCard: {
    padding: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  optionText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: Spacing.m,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  logoutButton: {
    borderColor: Colors.error.main,
    marginBottom: Spacing.m,
  },
  logoutButtonText: {
    color: Colors.error.main,
  },
  versionText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.error.main,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.m,
    padding: Spacing.l,
  },
});