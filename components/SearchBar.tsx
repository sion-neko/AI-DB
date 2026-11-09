import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// @ts-ignore
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = '検索',
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.fieldBackground }]}>
      <Feather name="search" size={17} color={colors.textSecondary} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        autoFocus
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Feather name="x-circle" size={17} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 44,
  },
});
