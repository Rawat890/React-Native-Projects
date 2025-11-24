import { View, Text, GestureResponderEvent, ViewStyle, TextStyle, Animated, Pressable, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import React, { ReactNode, useRef } from 'react'
import { COLORS } from '../utils/colors';
import { scale } from 'react-native-size-matters'
interface TextButtonprops {
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  rippleColor?: string;
  fontSize?:number;
}

const TextButton: React.FC<TextButtonprops> = ({
  title = "Button",
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  backgroundColor,
  rippleColor,
}) => {

  const scale = useRef(new Animated.Value(1)).current;

  const animationIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      speed: 20,
      useNativeDriver: true
    }).start();
  }

  const animationOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 20,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        android_ripple={{ color: rippleColor, borderless: false }}
        onPress={onPress}
        onPressIn={animationIn}
        onPressOut={animationOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          style,
          {
            backgroundColor: disabled ? COLORS.disabled : backgroundColor
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
            {title && <Text style={[styles.text, textStyle]}>{title}</Text>}
            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

export default TextButton

const styles = StyleSheet.create({
  button: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  text: {
    color: COLORS.white,
    fontSize: scale(14),
    fontWeight: "600",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: scale(6),
  },
});
