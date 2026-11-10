import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SwipeToDelete } from './SwipeToDelete';
import { Conversation } from '../types';
import { LIST_RADIUS } from '../utils/layout';
import { previewOf } from '../utils/preview';

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
        {/* 半透明にすると裏の削除ボタンが透けるので、押した感じは背景色で出す */}
        <Pressable
          style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.pressed : colors.surface }]}
          onPress={onPress}
        >
          {!isFirst && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
          {/* 上から: 題 / 本文の書き出し（2行まで） / 日付（全回答・検索のときはフォルダ名も） */}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {conversation.question || '題なし'}
          </Text>
          <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={2}>
            {previewOf(conversation.answer) || '本文なし'}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(conversation.updatedAt)}</Text>
            {folderName ? (
              <>
                <Feather name="folder" size={13} color={colors.textSecondary} style={styles.folderIcon} />
                <Text style={[styles.metaText, styles.folder, { color: colors.textSecondary }]} numberOfLines={1}>
                  {folderName}
                </Text>
              </>
            ) : null}
          </View>
        </Pressable>
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
    borderTopLeftRadius: LIST_RADIUS,
    borderTopRightRadius: LIST_RADIUS,
  },
  last: {
    borderBottomLeftRadius: LIST_RADIUS,
    borderBottomRightRadius: LIST_RADIUS,
  },
  row: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  separator: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  preview: {
    fontSize: 15,
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
  },
  folderIcon: {
    marginLeft: 12,
    marginRight: 4,
  },
  folder: {
    flex: 1,
  },
});
