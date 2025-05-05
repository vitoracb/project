import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import Colors from '../constants/Colors';
import LoginForm from '../components/auth/LoginForm';
import { FontFamily } from '../constants/Typography';

export default function AuthScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg' }}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay} />
        <View style={styles.logoContent}>
          <Text style={styles.logoText}>Floresta Sagrada</Text>
          <Text style={styles.logoSubtitle}>Conecte-se com a natureza</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <LoginForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  logoContainer: {
    flex: 2,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoContent: {
    alignItems: 'center',
  },
  logoText: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  logoSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
  },
  formContainer: {
    flex: 3,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
});