import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';
import { fonts } from '../utils/fonts';

interface InputWithLabelProps {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry: boolean;
  error?: string;
  icon?: ImageSourcePropType;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  placeholder,
  onChangeText,
  secureTextEntry,
  value,
  error,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<boolean>(secureTextEntry);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.black, COLORS.green],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fieldset, { borderColor }]}>
        <View style={styles.outerWrapper}>
          <Animated.Text style={[styles.label, { color: borderColor }]}>
            {label}
          </Animated.Text>
        </View>

        <View style={styles.inputRow}>
          {icon && (
            <View style={styles.iconWrapper}>
              <Image
                source={icon}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          )}

          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            style={styles.input}
            placeholderTextColor={COLORS.lightGrey}
          />

          {secureTextEntry && (
            <Pressable onPress={() => setHidePassword(!hidePassword)}>
              <Text style={styles.toggle}>
                {/* {hidePassword ? 'Show' : 'Hide'} */}
              </Text>
            </Pressable>
          )}
        </View>
      </Animated.View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: scale(20),
    paddingTop: scale(10),
  },
  fieldset: {
    borderWidth: 1,
    borderRadius: scale(12),
    paddingHorizontal: scale(12),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    position: 'relative',
  },
  outerWrapper: {
    position: 'absolute',
    top: -scale(11),
    left: scale(14),
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(4),
  },
  label: {
    fontSize: scale(13),
    fontWeight: '600',
    color: COLORS.black
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: scale(44),
  },
  iconWrapper: {
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: scale(20),
    height: scale(20),
  },
  input: {
    flex: 1,
    height: scale(44),
    fontSize: scale(14),
    color: COLORS.black,
    fontFamily: fonts.balooBold,
  },
  toggle: {
    color: COLORS.green,
    fontWeight: '600',
    fontSize: scale(13),
  },
  error: {
    marginTop: scale(5),
    color: COLORS.red,
    fontSize: scale(12),
  },
});

export default InputWithLabel;