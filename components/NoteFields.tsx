import React, { RefObject, useRef } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FadeIn } from './FadeIn';

export type TextInputHandle = React.ComponentRef<typeof TextInput>;

interface NoteFieldsProps {
  title: string;
  body: string;
  onChangeTitle: (text: string) => void;
  onChangeBody: (text: string) => void;
  titleRef: RefObject<TextInputHandle | null>;
  bodyRef: RefObject<TextInputHandle | null>;
  autoFocusTitle?: boolean;
  bodySelection?: { start: number; end: number };
  // 題の下に出す日付。読む表示と同じ位置に置き、切り替えで本文の位置が動かないようにする
  dateLabel?: string;
  // 読む表示から切り替わったときに、本文をふわっと出す
  fadeBody?: boolean;
}

// 題と本文を1枚のメモに見せる。題で改行すると本文へ、本文の先頭で消すと題へ戻る
export const NoteFields: React.FC<NoteFieldsProps> = ({
  title,
  body,
  onChangeTitle,
  onChangeBody,
  titleRef,
  bodyRef,
  autoFocusTitle,
  bodySelection,
  dateLabel,
  fadeBody = false,
}) => {
  const { colors } = useTheme();
  const cursorAtStart = useRef(false);

  return (
    <View>
      <TextInput
        ref={titleRef}
        style={[styles.title, { color: colors.text }]}
        value={title}
        onChangeText={onChangeTitle}
        placeholder="題"
        placeholderTextColor={colors.textSecondary}
        multiline
        scrollEnabled={false}
        submitBehavior="submit"
        returnKeyType="next"
        onSubmitEditing={() => bodyRef.current?.focus()}
        autoFocus={autoFocusTitle}
      />
      {dateLabel ? <Text style={[noteStyles.date, { color: colors.textSecondary }]}>{dateLabel}</Text> : null}
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
      <FadeIn enabled={fadeBody}>
      <TextInput
        ref={bodyRef}
        style={[styles.body, { color: colors.text }]}
        value={body}
        onChangeText={onChangeBody}
        placeholder="回答を貼り付け"
        placeholderTextColor={colors.textSecondary}
        multiline
        scrollEnabled={false}
        textAlignVertical="top"
        selection={bodySelection}
        onSelectionChange={(e) => {
          const { start, end } = e.nativeEvent.selection;
          cursorAtStart.current = start === 0 && end === 0;
        }}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Backspace' && cursorAtStart.current) {
            titleRef.current?.focus();
          }
        }}
      />
      </FadeIn>
    </View>
  );
};

export const noteStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 33,
  },
  date: {
    fontSize: 13,
    marginTop: 8,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginTop: 14,
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  title: {
    ...noteStyles.title,
    padding: 0,
  },
  rule: noteStyles.rule,
  body: {
    fontSize: 16,
    lineHeight: 25,
    padding: 0,
    minHeight: 240,
  },
});
