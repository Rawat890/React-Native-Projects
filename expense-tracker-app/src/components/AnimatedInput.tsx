import React, { useRef, useState } from 'react';
import { Animated, ImageSourcePropType, Pressable, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../utils/colors';
import { fonts } from '../utils/fonts';

interface AnimatedInputProps {
  label: string;
  value: string;
  placeholder?: string;
  leftIcon?: ImageSourcePropType;
  inputContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  textStyle?: TextStyle;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string,
  placeholderColor?: string
  keyboardType?: string
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label, placeholder, leftIcon, onChangeText, secureTextEntry, inputContainerStyle, labelStyle, textStyle, error, value, placeholderColor, keyboardType
}) => {

  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);

  const borderAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsInputFocused(true);
    Animated.timing(borderAnimation, {
      toValue: 1,
      useNativeDriver: false,
      duration: 200
    }).start();
  }

  const handleBlur = () => {
    setIsInputFocused(false);
    Animated.timing(borderAnimation, {
      toValue: 0,
      useNativeDriver: false,
      duration: 200
    }).start();
  }

  const borderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.black, COLORS.green]
  })

  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.fieldset, { borderColor }, inputContainerStyle]}>
        <View style={styles.outerWrapper}>
          <Animated.Text style={[{ color: borderColor }, labelStyle]}>
            {label}
          </Animated.Text>
        </View>
        <TextInput
          value={value}
          secureTextEntry={secureTextEntry && !hide}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={placeholderColor}
          onChangeText={onChangeText}
          style={textStyle}
          keyboardType={keyboardType}
        />
        {
          secureTextEntry && (
            <Pressable onPress={() => setHide((prev) => !prev)}>
              <Text style={styles.toggle}>
                {hide ? 'Show' : 'Hide'}
              </Text>
            </Pressable>
          )
        }
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

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
  leftIcon: {},
});

export default AnimatedInput