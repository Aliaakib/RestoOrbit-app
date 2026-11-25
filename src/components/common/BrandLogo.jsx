import { Image, StyleSheet } from 'react-native';
import { BRAND_LOGOS } from '@/assets/logos';

const VARIANT_DIMENSIONS = {
  horizontal: { width: 176, height: 42 },
  horizontalInverse: { width: 176, height: 42 },
  stacked: { width: 150, height: 112 },
  icon: { width: 38, height: 38 },
  iconInverse: { width: 38, height: 38 },
  appIcon: { width: 52, height: 52 },
};

/**
 * Renders the official RestoOrbit brand logo from Logos/PNG assets.
 */
export function BrandLogo({ variant = 'horizontal', style, width, height }) {
  const source = BRAND_LOGOS[variant] || BRAND_LOGOS.horizontal;
  const defaults = VARIANT_DIMENSIONS[variant] || VARIANT_DIMENSIONS.horizontal;

  return (
    <Image
      source={source}
      accessibilityLabel="RestoOrbit logo"
      resizeMode="contain"
      style={[
        styles.base,
        {
          width: width ?? defaults.width,
          height: height ?? defaults.height,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
  },
});
