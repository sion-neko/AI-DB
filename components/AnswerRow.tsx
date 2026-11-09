import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Conversation } from '../types';

interface AnswerRowProps {
  conversation: Conversation;
  folderName?: string;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onLongPress: () => void;
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
  onLongPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.row,
        { backgroundColor: colors.surface },
        isFirst && styles.first,
        isLast && styles.last,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.6}
    >
      {!isFirst && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {conversation.question}
        </Text>
        {folderName ? (
          <Text style={[styles.folder, { color: colors.textSecondary }]} numberOfLines={1}>
            {folderName}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(conversation.updatedAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  first: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  last: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
