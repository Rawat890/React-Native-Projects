import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';

interface InputWithIconProps extends TextInputProps {
  label?: string;
  validate?: (value: string) => string;
  maxLength?: number;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  validate,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleBlur = () => {
    setIsFocused(false);
    if (validate && value !== undefined) {
      const validationError = validate(value.toString());
      setError(validationError);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setError('');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.inputFocused, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          maxLength={maxLength}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      {maxLength && value && (
        <Text style={styles.charCount}>{value.length}/{maxLength}</Text>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scale(10),
  },
  label: {
    position: 'absolute',
    left: scale(10),
    top: scale(8),
    marginBottom:10,
    fontSize: scale(10),
    color: 'gray',
    zIndex: 1,
  },
  labelFocused: {
    color: '#6200ee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    paddingVertical: scale(12),
  },
  inputFocused: {
    borderColor: '#6200ee',
  },
  inputError: {
    borderColor: 'red',
  },
  input: {
    flex: 1,
    fontSize: scale(12),
    color: COLORS.black,
    marginTop: scale(8),
  },
  charCount: {
    textAlign: 'right',
    fontSize: scale(12),
    marginTop: 4,
  },
  error: {
    color: 'red',
    fontSize: scale(12),
    marginTop: 4,
  },
});

export default InputWithIcon;
