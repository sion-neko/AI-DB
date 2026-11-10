import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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
      {/* 元からある案内文字は日本語だとカーソルより下にずれるので、自前で重ねる */}
      <View style={styles.field}>
        {value === '' && (
          <Text style={[styles.placeholder, { color: colors.textSecondary }]} numberOfLines={1} pointerEvents="none">
            {placeholder}
          </Text>
        )}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoFocus
          accessibilityLabel={placeholder}
        />
      </View>
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
  field: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 16,
  },
  input: {
    height: 44,
    fontSize: 16,
    paddingVertical: 0,
  },
});
