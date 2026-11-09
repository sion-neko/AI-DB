import React, { RefObject, useRef } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface NoteFieldsProps {
  title: string;
  body: string;
  onChangeTitle: (text: string) => void;
  onChangeBody: (text: string) => void;
  titleRef: RefObject<TextInput | null>;
  bodyRef: RefObject<TextInput | null>;
  autoFocusTitle?: boolean;
  bodySelection?: { start: number; end: number };
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
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
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
    </View>
  );
};

export const noteStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 33,
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
