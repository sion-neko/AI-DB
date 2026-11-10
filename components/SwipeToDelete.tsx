import React, { ReactNode, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface SwipeToDeleteProps {
  children: ReactNode;
  // 確認ダイアログでやめたときに閉じられるよう、閉じる関数を渡す
  onDelete: (close: () => void) => void;
}

export const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({ children, onDelete }) => {
  const { isDark } = useTheme();
  const ref = useRef<SwipeableMethods>(null);
  const [open, setOpen] = useState(false);

  return (
    <Swipeable
      ref={ref}
      friction={2}
      rightThreshold={36}
      // 少し動かしただけでは開かない。縦スクロールやタップと取り違えないため
      dragOffsetFromRight={-16}
      overshootRight={false}
      onSwipeableWillOpen={() => setOpen(true)}
      onSwipeableWillClose={() => setOpen(false)}
      renderRightActions={() => (
        <TouchableOpacity
          style={[styles.action, { backgroundColor: isDark ? '#E5484D' : '#E5383B' }]}
          onPress={() => onDelete(() => ref.current?.close())}
          accessibilityLabel="削除"
        >
          <Feather name="trash-2" size={21} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    >
      <View>
        {children}
        {/* 開いている間に行を押したら、中へ進まずに閉じるだけにする */}
        {open && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => ref.current?.close()}
            accessibilityLabel="削除ボタンを閉じる"
          />
        )}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  action: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
