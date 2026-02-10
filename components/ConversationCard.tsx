import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Conversation } from '../types';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onLongPress: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncate = (text: string, maxLength: number): string => {
    const cleaned = text.replace(/\n/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.question, { color: colors.text }]} numberOfLines={2}>
          {truncate(conversation.question, 100)}
        </Text>
      </View>
      <Text style={[styles.answer, { color: colors.textSecondary }]} numberOfLines={2}>
        {truncate(conversation.answer, 120)}
      </Text>
      <Text style={[styles.date, { color: colors.textSecondary }]}>
        {formatDate(conversation.updatedAt)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  header: {
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
});
