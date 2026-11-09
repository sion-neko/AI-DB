import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface FolderNameModalProps {
  visible: boolean;
  title: string;
  submitLabel: string;
  initialName?: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

export const FolderNameModal: React.FC<FolderNameModalProps> = ({
  visible,
  title,
  submitLabel,
  initialName = '',
  onCancel,
  onSubmit,
}) => {
  const { colors } = useTheme();
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (visible) setName(initialName);
  }, [visible, initialName]);

  const trimmed = name.trim();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.fieldBackground, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="フォルダ名"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.fieldBackground }]} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: colors.text }]}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary, opacity: trimmed ? 1 : 0.5 }]}
              onPress={() => onSubmit(trimmed)}
              disabled={!trimmed}
            >
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
