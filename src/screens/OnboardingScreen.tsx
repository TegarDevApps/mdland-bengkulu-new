import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  FadeIn,
  FadeInUp,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../constants/theme';
import { ONBOARDING_DATA } from '../data/mockData';
import AnimatedButton from '../components/common/AnimatedButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.slide}>
      <ImageBackground source={item.image} style={styles.image}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AnimatedFlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item: any) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <OnboardingDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {currentIndex < ONBOARDING_DATA.length - 1 ? (
            <>
              <Pressable onPress={onComplete}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
              <AnimatedButton
                title="Next"
                onPress={handleNext}
                variant="gradient"
                size="md"
              />
            </>
          ) : (
            <AnimatedButton
              title="Get Started"
              onPress={onComplete}
              variant="gradient"
              size="lg"
              fullWidth
            />
          )}
        </View>
      </View>
    </View>
  );
};

const OnboardingDot: React.FC<{
  index: number;
  scrollX: SharedValue<number>;
}> = ({ index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [8, 28, 8],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  slide: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  image: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'flex-end', paddingBottom: 180 },
  textContainer: { paddingHorizontal: SPACING.xxl },
  title: {
    ...TYPOGRAPHY.hero,
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray300,
    lineHeight: 26,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: 50,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.xxl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.gray400,
  },
});

export default OnboardingScreen;
