import React, { ReactNode, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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
  const ref = useRef<React.ElementRef<typeof Swipeable>>(null);

  return (
    <Swipeable
      ref={ref}
      friction={2}
      rightThreshold={36}
      overshootRight={false}
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
      {children}
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
