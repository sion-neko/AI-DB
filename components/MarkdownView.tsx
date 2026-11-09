import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../hooks/useTheme';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const { colors } = useTheme();

  const markdownStyles = StyleSheet.create({
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 14,
      marginBottom: 6,
    },
    heading3: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 4,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
    },
    code_inline: {
      backgroundColor: colors.fieldBackground,
      color: colors.codeText,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: 'monospace',
    },
    fence: {
      backgroundColor: colors.fieldBackground,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
    },
    code_block: {
      color: colors.text,
      fontSize: 14,
      fontFamily: 'monospace',
    },
    blockquote: {
      backgroundColor: 'transparent',
      borderLeftColor: colors.border,
      borderLeftWidth: 3,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    list_item: {
      marginVertical: 4,
    },
    link: {
      color: colors.primary,
    },
    hr: {
      backgroundColor: colors.border,
      height: 1,
      marginVertical: 16,
    },
    table: {
      borderColor: colors.border,
    },
    th: {
      backgroundColor: colors.fieldBackground,
      padding: 8,
    },
    td: {
      padding: 8,
      borderColor: colors.border,
    },
  });

  return <Markdown style={markdownStyles}>{content}</Markdown>;
};
