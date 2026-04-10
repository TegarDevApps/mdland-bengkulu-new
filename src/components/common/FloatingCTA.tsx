import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingCTAProps {
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
  gradient?: boolean;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({
  icon = 'add',
  onPress,
  style,
  size = 56,
  gradient = true,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, style]}
    >
      {gradient ? (
        <LinearGradient
          colors={COLORS.gradientOcean as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <Ionicons name={icon} size={24} color={COLORS.white} />
        </LinearGradient>
      ) : (
        <Animated.View
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: COLORS.primary,
            },
          ]}
        >
          <Ionicons name={icon} size={24} color={COLORS.white} />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 100,
    ...SHADOWS.large,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingCTA;
