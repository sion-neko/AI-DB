import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../hooks/useTheme';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const { colors, isDark } = useTheme();

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
      backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
      color: isDark ? '#FF6B6B' : '#D63384',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: 'monospace',
    },
    fence: {
      backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
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
      backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
      borderLeftColor: colors.primary,
      borderLeftWidth: 4,
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
      backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
      padding: 8,
    },
    td: {
      padding: 8,
      borderColor: colors.border,
    },
  });

  return <Markdown style={markdownStyles}>{content}</Markdown>;
};
