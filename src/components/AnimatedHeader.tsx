import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface AnimatedHeaderProps {
  title: string;
  scrollY: SharedValue<number>;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  headerImage?: string;
  collapseHeight?: number;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  scrollY,
  onBack,
  rightAction,
  collapseHeight = 120,
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = 56 + insets.top;

  const animatedContainer = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollY.value,
      [0, collapseHeight],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      backgroundColor: `rgba(255, 255, 255, ${backgroundColor})`,
      borderBottomWidth: backgroundColor > 0.9 ? 1 : 0,
      borderBottomColor: COLORS.gray100,
    };
  });

  const animatedTitle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [collapseHeight - 30, collapseHeight],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [collapseHeight - 30, collapseHeight],
      [10, 0],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <Animated.View
      style={[
        styles.header,
        { height: headerHeight, paddingTop: insets.top },
        animatedContainer,
      ]}
    >
      {onBack && (
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.gray800} />
        </Pressable>
      )}
      <Animated.Text style={[styles.title, animatedTitle]} numberOfLines={1}>
        {title}
      </Animated.Text>
      <View style={styles.rightAction}>
        {rightAction}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    ...TYPOGRAPHY.h4,
    color: COLORS.gray800,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  rightAction: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default AnimatedHeader;
