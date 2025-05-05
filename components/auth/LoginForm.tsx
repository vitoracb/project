import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';

import Input from '../common/Input';
import Button from '../common/Button';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>
              Faça login para acessar o sistema de gerenciamento da fazenda
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={Colors.text.secondary} />}
              autoComplete="email"
            />

            <Input
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={Colors.text.secondary} />}
            />

            <TouchableWithoutFeedback onPress={() => console.log('Esqueceu a senha')}>
              <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            </TouchableWithoutFeedback>

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />
          </View>

          <View style={styles.hints}>
            <View style={styles.hintContainer}>
              <Text style={styles.hintTitle}>Usuário de teste (Admin):</Text>
              <Text style={styles.hintText}>admin@fazenda.com / admin123</Text>
            </View>
            <View style={styles.hintContainer}>
              <Text style={styles.hintTitle}>Usuário de teste (Membro):</Text>
              <Text style={styles.hintText}>membro1@fazenda.com / membro123</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.text.primary,
    marginBottom: Spacing.s,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.primary.main,
    textAlign: 'right',
    marginTop: Spacing.s,
    marginBottom: Spacing.xl,
  },
  loginButton: {
    marginTop: Spacing.m,
  },
  errorContainer: {
    backgroundColor: Colors.error.light,
    padding: Spacing.m,
    borderRadius: Spacing.xs,
    marginBottom: Spacing.m,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.error.dark,
  },
  hints: {
    marginTop: Spacing.xl,
    padding: Spacing.m,
    backgroundColor: Colors.grey[100],
    borderRadius: Spacing.s,
  },
  hintContainer: {
    marginBottom: Spacing.m,
  },
  hintTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  hintText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});