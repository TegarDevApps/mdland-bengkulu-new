import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onFilterPress?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations, villas...',
  value,
  onChangeText,
  onFocus,
  onFilterPress,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(0);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: borderColor.value === 1
      ? COLORS.primary
      : COLORS.gray200,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(1, { duration: 200 });
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(0, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.container, animatedBorder]}>
      <Ionicons
        name="search"
        size={20}
        color={isFocused ? COLORS.primary : COLORS.gray400}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
        </Pressable>
      )}
      {onFilterPress && (
        <Pressable onPress={onFilterPress} style={styles.filterButton}>
          <Ionicons name="options" size={20} color={COLORS.primary} />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.lg,
    height: 52,
    ...SHADOWS.small,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray800,
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  filterButton: {
    marginLeft: SPACING.sm,
    padding: 6,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.sm,
  },
});

export default SearchBar;
