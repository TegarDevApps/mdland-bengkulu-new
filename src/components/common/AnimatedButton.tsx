import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY, SPACING } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: string[];
  fullWidth?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
  gradientColors,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.9, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 24 },
    lg: { paddingVertical: 14, paddingHorizontal: 24 },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.accent },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
    ghost: { backgroundColor: 'transparent' },
    gradient: {},
  };

  const textColorMap: Record<string, string> = {
    primary: COLORS.white,
    secondary: COLORS.white,
    outline: COLORS.primary,
    ghost: COLORS.primary,
    gradient: COLORS.white,
  };

  const content = (
    <Animated.View
      style={[
        styles.inner,
        sizeStyles[size],
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      {icon && <Animated.View style={{ marginRight: 8 }}>{icon}</Animated.View>}
      <Text
        style={[
          size === 'sm' ? TYPOGRAPHY.buttonSm : TYPOGRAPHY.button,
          { color: textColorMap[variant] },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Animated.View>
  );

  if (variant === 'gradient') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[animatedStyle, fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={gradientColors || COLORS.gradientOcean as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, sizeStyles[size], disabled && styles.disabled]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        fullWidth && { width: '100%' },
        variant === 'primary' && SHADOWS.glow,
        variant === 'secondary' && SHADOWS.sunset,
        style,
      ]}
    >
      {icon && <Animated.View style={{ marginRight: 8 }}>{icon}</Animated.View>}
      <Text
        style={[
          size === 'sm' ? TYPOGRAPHY.buttonSm : TYPOGRAPHY.button,
          { color: textColorMap[variant] },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AnimatedButton;
