import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Folder } from '../types';

interface FolderCardProps {
  folder: Folder;
  conversationCount: number;
  onPress: () => void;
  onLongPress: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  conversationCount,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📁</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {folder.name}
        </Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {conversationCount}件の会話
        </Text>
      </View>
      <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  count: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
