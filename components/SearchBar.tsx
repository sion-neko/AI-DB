import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA' }]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <Text style={[styles.clearText, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
  },
});
