import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface PopoverMenuItem {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  destructive?: boolean;
  onPress: () => void;
}

interface PopoverMenuProps {
  visible: boolean;
  items: PopoverMenuItem[];
  onClose: () => void;
}

// 右上のボタンのすぐ下に開く小さなメニュー。
// 画面の中に重ねるだけで別の窓は開かないので、続けて入力欄や確認を出してもぶつからない
export const PopoverMenu: React.FC<PopoverMenuProps> = ({ visible, items, onClose }) => {
  const { colors, isDark } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  // 選んだ項目は、メニューが閉じきってから実行する（閉じる動きと次の表示を重ねない）
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: 150,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setMounted(false);
      const run = pending.current;
      pending.current = null;
      run?.();
    });
  }, [visible]);

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="メニューを閉じる" />
      <Animated.View
        style={[
          styles.menu,
          {
            backgroundColor: isDark ? colors.fieldBackground : colors.surface,
            borderColor: colors.border,
            opacity: progress,
            // ボタンのある右上を起点に、少し小さい状態から開く
            transformOrigin: 'top right',
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
          },
        ]}
      >
        {items.map((item, index) => {
          const color = item.destructive ? colors.danger : colors.text;
          return (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.item,
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
                pressed && { backgroundColor: colors.pressed },
              ]}
              onPress={() => {
                pending.current = item.onPress;
                onClose();
              }}
            >
              <Text style={[styles.label, { color }]}>{item.label}</Text>
              <Feather name={item.icon} size={18} color={color} />
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 4,
    right: 12,
    width: 220,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
  },
});
