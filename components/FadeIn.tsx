import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface FadeInProps {
  children: ReactNode;
  // false のときは最初から見せる（画面を開いた直後など、切り替えではないとき）
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// 中身が入れ替わるときに、ぱっと変えずにふわっと出す
export const FadeIn: React.FC<FadeInProps> = ({ children, enabled = true, style }) => {
  const opacity = useRef(new Animated.Value(enabled ? 0 : 1)).current;

  useEffect(() => {
    if (!enabled) return;
    Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }).start();
  }, []);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};
