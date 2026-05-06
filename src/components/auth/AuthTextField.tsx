import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Platform,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import {
  TEXT_MUTED,
  TEXT_PRIMARY,
} from '../../../constants/tokens';
import { AUTH_BORDER, AUTH_SURFACE_INPUT } from './AuthTokens';

type Props = TextInputProps & {
  icon: LucideIcon;
  secureToggle?: boolean;
  containerStyle?: ViewStyle;
};

export function AuthTextField({
  icon: Icon,
  secureToggle,
  containerStyle,
  secureTextEntry,
  ...rest
}: Props) {
  const [hide, setHide] = useState(true);
  const isSecure = !!(secureToggle && (secureTextEntry ?? true));

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Icon color={TEXT_MUTED} size={20} strokeWidth={2} />
      <TextInput
        {...rest}
        placeholderTextColor="rgba(255,255,255,0.35)"
        cursorColor={TEXT_PRIMARY}
        style={styles.input}
        secureTextEntry={isSecure ? hide : secureTextEntry}
      />
      {secureToggle ? (
        <Pressable hitSlop={10} onPress={() => setHide((h) => !h)}>
          {hide ? (
            <Eye color={TEXT_MUTED} size={20} strokeWidth={2} />
          ) : (
            <EyeOff color={TEXT_MUTED} size={20} strokeWidth={2} />
          )}
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: AUTH_SURFACE_INPUT,
    borderWidth: 1,
    borderColor: AUTH_BORDER,
    paddingHorizontal: 14,
    minHeight: 54,
    gap: 10,
  },
  input: {
    flex: 1,
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    textAlign: 'left',
  },
  spacer: { width: 20 },
});
