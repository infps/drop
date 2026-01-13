/**
 * Theme colors for DROP user app
 * Centralized color constants for consistent branding
 */

import { Platform } from 'react-native';

// Brand Colors
export const BRAND_COLORS = {
  primary: '#FF6B6B',      // Main brand red
  primaryDark: '#E85555',  // Darker red for pressed states
  primaryLight: '#FFE5E5', // Light red for backgrounds

  success: '#4CAF50',      // Green for success states
  warning: '#FFB800',      // Amber for warnings/ratings
  error: '#FF4444',        // Red for errors
  info: '#007AFF',         // Blue for info

  // Neutrals
  black: '#11181C',
  white: '#FFFFFF',
  gray900: '#11181C',
  gray700: '#333333',
  gray500: '#687076',
  gray400: '#8E8E93',
  gray300: '#C0C0C0',
  gray200: '#E0E0E0',
  gray100: '#F0F0F0',
  gray50: '#F5F5F5',
} as const;

const tintColorLight = BRAND_COLORS.primary;
const tintColorDark = BRAND_COLORS.white;

export const Colors = {
  light: {
    text: BRAND_COLORS.gray900,
    textSecondary: BRAND_COLORS.gray500,
    background: BRAND_COLORS.white,
    backgroundSecondary: BRAND_COLORS.gray50,
    tint: tintColorLight,
    icon: BRAND_COLORS.gray500,
    tabIconDefault: BRAND_COLORS.gray500,
    tabIconSelected: tintColorLight,
    border: BRAND_COLORS.gray100,

    // Button colors
    buttonPrimary: BRAND_COLORS.primary,
    buttonPrimaryText: BRAND_COLORS.white,
    buttonSecondary: BRAND_COLORS.gray100,
    buttonSecondaryText: BRAND_COLORS.gray900,
    buttonDisabled: BRAND_COLORS.gray300,
    buttonDisabledText: BRAND_COLORS.gray500,

    // Status colors
    success: BRAND_COLORS.success,
    warning: BRAND_COLORS.warning,
    error: BRAND_COLORS.error,
    info: BRAND_COLORS.info,

    // Card/Shadow
    cardBackground: BRAND_COLORS.white,
    shadowColor: '#000000',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    backgroundSecondary: '#1F2122',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2A2A2A',

    buttonPrimary: BRAND_COLORS.primary,
    buttonPrimaryText: BRAND_COLORS.white,
    buttonSecondary: '#2A2A2A',
    buttonSecondaryText: '#ECEDEE',
    buttonDisabled: '#3A3A3A',
    buttonDisabledText: '#666666',

    success: BRAND_COLORS.success,
    warning: BRAND_COLORS.warning,
    error: BRAND_COLORS.error,
    info: BRAND_COLORS.info,

    cardBackground: '#1F2122',
    shadowColor: '#000000',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
