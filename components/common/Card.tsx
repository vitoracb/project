import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle,
  TouchableOpacity
} from 'react-native';
import Colors from '../../constants/Colors';
import Spacing, { BorderRadius } from '../../constants/Spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: number;
  padding?: number;
  margin?: number;
}

export default function Card({ 
  children, 
  style, 
  onPress,
  elevation = 1,
  padding = Spacing.m,
  margin = 0
}: CardProps) {
  const cardStyles = [
    styles.card,
    { padding, margin },
    getShadow(elevation),
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyles} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const getShadow = (elevation: number): ViewStyle => {
  return {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1 + (elevation * 0.03),
    shadowRadius: 1 + (elevation * 0.5),
    elevation: elevation,
  };
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.m,
    overflow: 'hidden',
  },
});