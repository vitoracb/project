import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import Spacing from '../../constants/Spacing';
import { FontFamily } from '../../constants/Typography';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const isPassword = secureTextEntry !== undefined;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        isFocused && styles.inputFocused,
        error && styles.inputError
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            inputStyle
          ]}
          placeholderTextColor={Colors.text.hint}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />
        
        {isPassword ? (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={Colors.text.secondary} />
            ) : (
              <Eye size={20} color={Colors.text.secondary} />
            )}
          </TouchableOpacity>
        ) : rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          error && styles.errorText
        ]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.m,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.main,
    borderRadius: Spacing.xs,
    backgroundColor: Colors.background.paper,
  },
  inputFocused: {
    borderColor: Colors.primary.main,
  },
  inputError: {
    borderColor: Colors.error.main,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIconContainer: {
    paddingLeft: Spacing.m,
  },
  rightIconContainer: {
    paddingRight: Spacing.m,
  },
  helperText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  errorText: {
    color: Colors.error.main,
  },
});