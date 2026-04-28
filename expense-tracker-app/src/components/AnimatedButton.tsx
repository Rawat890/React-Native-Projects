import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { COLORS } from '../utils/colors';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  inputContainerStyle: ViewStyle;
  titleStyle: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  loaderColor?: string;
}
const AnimatedButton: React.FC<AnimatedButtonProps> = ({ title, onPress, inputContainerStyle, titleStyle, disabled, loading, loaderColor = COLORS.white }) => {

  const animationStyle = useRef(new Animated.Value(1)).current;
  const pressIn = () => {
    Animated.spring(animationStyle, {
      toValue: 0.94,
      useNativeDriver: true
    }).start();
  }

  const pressOut = () => {
    Animated.spring(animationStyle, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale: animationStyle }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        style={[styles.button, inputContainerStyle]}>
        {
          loading ? (
            <ActivityIndicator color={loaderColor} />
          ) : (
            <Text style={[titleStyle, styles.title]}>{title}</Text>
          )
        }
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  title: {
  },
  button: {
  },
})
export default AnimatedButton