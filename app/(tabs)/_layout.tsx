import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { Chrome as Home, Calendar, DollarSign, FileText, MessageSquare, User } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: Colors.background.paper, borderTopColor: Colors.border.light, borderTopWidth: 1, height: Platform.OS === 'ios' ? 88 : 60 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const rawLabel =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const label = typeof rawLabel === 'string' ? rawLabel : options.title ?? route.name;
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        // Ícones
        let icon = null;
        if (route.name === 'index') icon = <Home size={24} color={isFocused ? Colors.primary.main : Colors.grey[600]} />;
        if (route.name === 'activities') icon = <Calendar size={24} color={isFocused ? Colors.primary.main : Colors.grey[600]} />;
        if (route.name === 'finances') icon = <DollarSign size={24} color={isFocused ? Colors.primary.main : Colors.grey[600]} />;
        if (route.name === 'documents') icon = <FileText size={24} color={isFocused ? Colors.primary.main : Colors.grey[600]} />;
        if (route.name === 'comments') icon = <MessageSquare size={24} color={isFocused ? Colors.primary.main : Colors.grey[600]} />;
        if (!icon) return null; // Oculta tabs sem ícone (ex: profile)
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 2, paddingBottom: 0 }}
          >
            {icon}
            <Text style={{ color: isFocused ? Colors.primary.main : Colors.grey[600], fontSize: 12, fontWeight: '500', marginTop: 0 }} numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary.main,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: 'Atividades',
        }}
      />
      <Tabs.Screen
        name="finances"
        options={{
          title: 'Finanças',
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documentos',
        }}
      />
      <Tabs.Screen
        name="comments"
        options={{
          title: 'Comentários',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}