import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { scale } from 'react-native-size-matters';

interface InputWithLabelProps {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  placeholder,
  onChangeText,
  secureTextEntry,
  value,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<boolean>(!!secureTextEntry);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#4caf50']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={[styles.inputContainer, { borderColor }]}>

        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry ? hidePassword : false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={styles.input}
        />

        {secureTextEntry ? (
          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            <Text style={styles.toggle}>
              {hidePassword ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        ) : (
          rightIcon && (
            <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
              {rightIcon}
            </Pressable>
          )
        )}
      </Animated.View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: scale(20)
  },

  label: {
    fontSize: scale(14),
    marginBottom: scale(6),
    fontWeight: '500'
  },

  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },

  input: {
    flex: 1,
    height: 45
  },

  leftIcon: {
    marginRight: 8
  },

  rightIcon: {
    marginLeft: 8
  },

  toggle: {
    color: '#4CAF50',
    fontWeight: '600'
  },

  error: {
    marginTop: 5,
    color: 'red',
    fontSize: 12
  }
});

export default InputWithLabel;