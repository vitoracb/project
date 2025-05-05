import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const buttonStyles: ViewStyle[] = [styles.button];

    // Add variant-specific styles
    switch (variant) {
      case 'primary':
        buttonStyles.push(styles.primary);
        break;
      case 'secondary':
        buttonStyles.push(styles.secondary);
        break;
      case 'outlined':
        buttonStyles.push(styles.outlined);
        break;
      case 'text':
        buttonStyles.push(styles.text);
        break;
    }

    // Add size-specific styles
    switch (size) {
      case 'small':
        buttonStyles.push(styles.small);
        break;
      case 'medium':
        buttonStyles.push(styles.medium);
        break;
      case 'large':
        buttonStyles.push(styles.large);
        break;
    }

    // Add disabled styles if needed
    if (disabled || loading) {
      buttonStyles.push(styles.disabled);
    }

    // Add fullWidth styles if needed
    if (fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    return Object.assign({}, ...buttonStyles);
  };

  const getTextStyle = (): TextStyle => {
    const textStyles: TextStyle[] = [styles.buttonText];

    // Add variant-specific text styles
    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryText);
        break;
      case 'outlined':
        textStyles.push(styles.outlinedText);
        break;
      case 'text':
        textStyles.push(styles.textOnlyText);
        break;
    }

    // Add size-specific text styles
    switch (size) {
      case 'small':
        textStyles.push(styles.smallText);
        break;
      case 'medium':
        textStyles.push(styles.mediumText);
        break;
      case 'large':
        textStyles.push(styles.largeText);
        break;
    }

    // Add disabled text styles if needed
    if (disabled) {
      textStyles.push(styles.disabledText);
    }

    return Object.assign({}, ...textStyles);
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outlined' || variant === 'text' ? Colors.primary.main : Colors.white} 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyle(), icon && styles.textWithIcon, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.primary.main,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: Colors.secondary.main,
    borderWidth: 0,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  text: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  small: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
  },
  medium: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
  },
  large: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
  },
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontFamily: FontFamily.medium,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  outlinedText: {
    color: Colors.primary.main,
  },
  textOnlyText: {
    color: Colors.primary.main,
  },
  smallText: {
    fontSize: 12,
    lineHeight: 18,
  },
  mediumText: {
    fontSize: 14,
    lineHeight: 21,
  },
  largeText: {
    fontSize: 16,
    lineHeight: 24,
  },
  disabledText: {
    color: Colors.text.disabled,
  },
  textWithIcon: {
    marginLeft: Spacing.s,
  },
});