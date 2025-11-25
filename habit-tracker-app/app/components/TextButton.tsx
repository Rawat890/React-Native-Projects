import {
  View,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  Animated,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import React, { ReactNode, useRef } from "react";
import { COLORS } from "../utils/colors";
import { scale } from "react-native-size-matters";

interface TextButtonProps {
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
}

const TextButton: React.FC<TextButtonProps> = ({
  title = "Button",
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  backgroundColor = COLORS.primary,
  rippleColor,
}) => {
  const animatedScale = useRef(new Animated.Value(1)).current;

  const animationIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.96,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const animationOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      android_ripple={{
        color: rippleColor || COLORS.white,
        borderless: false,
      }}
      onPress={onPress}
      onPressIn={animationIn}
      onPressOut={animationOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: animatedScale }],
            backgroundColor: disabled ? COLORS.disabled : backgroundColor,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

            {title && (
              <Text
                style={[
                  styles.text,
                  // If user provides a color → use it
                  { color: textStyle?.color ?? (disabled ? COLORS.gray500 : COLORS.white) },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            )}

            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default TextButton;

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
