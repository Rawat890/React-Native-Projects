import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle
} from "react-native";
import { COLORS } from "../utils/colors";
import { scale } from "react-native-size-matters";

interface ButtonWithLabelProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const ButtonWithLabel: React.FC<ButtonWithLabelProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  backgroundColor = COLORS.green,
  textColor = COLORS.white,
  containerStyle,
  textStyle
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          { backgroundColor },
          (disabled || loading) && styles.disabled,
          containerStyle
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text
            style={[
              styles.text,
              { color: textColor },
              textStyle
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ButtonWithLabel;

const styles = StyleSheet.create({
  button: {
    height: scale(48),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(10)
  },

  text: {
    fontSize: scale(16),
    fontWeight: "600"
  },

  disabled: {
    opacity: 0.6
  }
});