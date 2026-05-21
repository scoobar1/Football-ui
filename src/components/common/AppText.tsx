import { Fonts } from '@/constants/theme';
import React from 'react';
import {
    Text as RNText,
    TextInput as RNTextInput,
    StyleProp,
    StyleSheet,
    TextStyle,
    type TextInputProps as RNTextInputProps,
    type TextProps as RNTextProps,
} from 'react-native';

type WeightKey = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

type WeightMap = Record<WeightKey, string>;

const WEIGHT_TO_FAMILY: WeightMap = {
  '100': Fonts.sans.light,
  '200': Fonts.sans.light,
  '300': Fonts.sans.light,
  '400': Fonts.sans.regular,
  '500': Fonts.sans.medium,
  '600': Fonts.sans.semibold,
  '700': Fonts.sans.bold,
  '800': Fonts.sans.extrabold,
  '900': Fonts.sans.black,
};

const normalizeWeight = (weight?: TextStyle['fontWeight']): WeightKey => {
  if (!weight) return '400';
  if (typeof weight === 'number') return String(weight) as WeightKey;
  if (weight === 'normal') return '400';
  if (weight === 'bold') return '700';
  return weight as WeightKey;
};

const resolveFontStyle = (style?: StyleProp<TextStyle>): TextStyle => {
  const flattened = StyleSheet.flatten(style) || {};
  const explicitFamily = flattened.fontFamily;
  const weightKey = normalizeWeight(flattened.fontWeight);
  const resolvedFamily = explicitFamily ?? WEIGHT_TO_FAMILY[weightKey] ?? Fonts.sans.regular;
  const { fontWeight, fontFamily, ...rest } = flattened;
  return { ...rest, fontFamily: resolvedFamily };
};

type RNTextRef = React.ElementRef<typeof RNText>;
type RNTextInputRef = React.ElementRef<typeof RNTextInput>;

export type TextProps = RNTextProps;
export type TextInputProps = RNTextInputProps;
export type TextInputRef = RNTextInputRef;

export const Text = React.forwardRef<RNTextRef, RNTextProps>(({ style, ...rest }, ref) => (
  <RNText ref={ref} style={resolveFontStyle(style)} {...rest} />
));

Text.displayName = 'AppText';

export const TextInput = React.forwardRef<RNTextInputRef, RNTextInputProps>(({ style, ...rest }, ref) => (
  <RNTextInput ref={ref} style={resolveFontStyle(style)} {...rest} />
));

TextInput.displayName = 'AppTextInput';
