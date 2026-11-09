import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { SwipeToDelete } from './SwipeToDelete';
import { Conversation } from '../types';

interface AnswerRowProps {
  conversation: Conversation;
  folderName?: string;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onDelete: (close: () => void) => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

export const AnswerRow: React.FC<AnswerRowProps> = ({
  conversation,
  folderName,
  isFirst,
  isLast,
  onPress,
  onDelete,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.clip, isFirst && styles.first, isLast && styles.last]}>
      <SwipeToDelete onDelete={onDelete}>
        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.surface }]}
          onPress={onPress}
          activeOpacity={0.6}
        >
          {!isFirst && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
          <View style={styles.text}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {conversation.question || '題なし'}
            </Text>
            {folderName ? (
              <Text style={[styles.folder, { color: colors.textSecondary }]} numberOfLines={1}>
                {folderName}
              </Text>
            ) : null}
          </View>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(conversation.updatedAt)}</Text>
        </TouchableOpacity>
      </SwipeToDelete>
    </View>
  );
};

const styles = StyleSheet.create({
  clip: {
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  first: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  last: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  folder: {
    fontSize: 12,
  },
  date: {
    fontSize: 13,
  },
});
