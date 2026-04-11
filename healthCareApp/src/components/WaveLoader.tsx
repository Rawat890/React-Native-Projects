import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { COLORS } from '../utils/colors';

export interface WaveLoaderProps {
  loading?: boolean;
  size?: number;
  color?: string;
  secondaryColor?: string;
  ringColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  circleStyle?: StyleProp<ViewStyle>;
  speed?: number;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));


interface WaveStripProps {
  progress: Animated.SharedValue<number>;
  fillProgress: Animated.SharedValue<number>;
  waveColor: string;
  innerSize: number;
  amplitude: number;
  heightOffset?: number;
  fillRange?: [number, number];
  tileWidth: number;
}

const WaveStrip: React.FC<WaveStripProps> = ({
  progress,
  fillProgress,
  waveColor,
  innerSize,
  amplitude,
  heightOffset = 0,
  fillRange = [0.38, 0.54],
  tileWidth,
}) => {
  const bumpWidth = innerSize * 0.8;
  const numBumps = 8;

  const rowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.value % 1,
          [0, 1],
          [0, -tileWidth],
        ),
      },
    ],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    height: interpolate(
      fillProgress.value,
      [0, 1],
      [innerSize * fillRange[0], innerSize * fillRange[1]],
    ),
  }));

  return (
    <Animated.View
      style={[

        styles.animatedView,

        rowStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: bumpWidth * (numBumps + 4),
            backgroundColor: waveColor,
            marginBottom: heightOffset,
          },
          fillStyle,
        ]}
      />

      {Array.from({ length: numBumps }).map((_, i) => (
        <View
          key={i}
          style={{
            width: bumpWidth,
            height: amplitude,
            borderTopLeftRadius: bumpWidth / 2,
            borderTopRightRadius: bumpWidth / 2,
            backgroundColor: waveColor,
            marginBottom: heightOffset,
            transform: [{ scaleY: i % 2 === 0 ? 1 : 0.72 }],
          }}
        />
      ))}
    </Animated.View>
  );
};

const WaveLoader: React.FC<WaveLoaderProps> = ({
  loading = true,
  size = 72,
  color = COLORS.ringColor,
  secondaryColor = COLORS.secondary2,
  ringColor = COLORS.ringColor,
  backgroundColor = COLORS.white,
  style,
  circleStyle,
  speed = 1,
}) => {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0.5);
  const fillProgress = useSharedValue(0);

  const baseDuration = clamp(1600 / speed, 400, 4_000);

  useEffect(() => {
    if (!loading) {
      cancelAnimation(progress1);
      cancelAnimation(progress2);
      cancelAnimation(fillProgress);
      return;
    }
    progress1.value = withRepeat(
      withTiming(1, { duration: baseDuration, easing: Easing.linear }),
      -1,
      false,
    );

    progress2.value = withRepeat(
      withTiming(1.5, {
        duration: baseDuration * 1.3,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    fillProgress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: baseDuration * 2,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: baseDuration * 2,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress1);
      cancelAnimation(progress2);
      cancelAnimation(fillProgress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, baseDuration]);

  const radius = size / 2;
  const ringThickness = Math.max(1.5, size * 0.028);
  const innerSize = size - ringThickness * 2;
  const innerRadius = innerSize / 2;
  const bumpWidth = innerSize * 0.8;
  const tileWidth = bumpWidth * 8;

  if (!loading) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor: ringColor,
            borderWidth: ringThickness,
            backgroundColor,
          },
          circleStyle,
        ]}
      >
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerRadius,
            overflow: 'hidden',
            backgroundColor,
          }}
        >
          <WaveStrip
            progress={progress2}
            fillProgress={fillProgress}
            waveColor={secondaryColor}
            innerSize={innerSize}
            amplitude={innerSize * 0.15}
            fillRange={[0.36, 0.52]}
            tileWidth={tileWidth}
          />

          <WaveStrip
            progress={progress1}
            fillProgress={fillProgress}
            waveColor={color}
            innerSize={innerSize}
            amplitude={innerSize * 0.12}
            heightOffset={innerSize * 0.03}
            fillRange={[0.38, 0.54]}
            tileWidth={tileWidth}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedView: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  }
});

export default WaveLoader;