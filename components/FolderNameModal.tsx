import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface FolderNameModalProps {
  visible: boolean;
  title: string;
  submitLabel: string;
  initialName?: string;
  // 開いたときに文字を全部選んだ状態にする（名前の変更で、そのまま打ち直せるように）
  selectAll?: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

// 開くたびに中身を作り直す。入力欄は最初から今の名前を持った状態で現れるので、
// 開いた後に文字が差し替わって全選択が外れる、ということが起きない
export const FolderNameModal: React.FC<FolderNameModalProps> = (props) => (
  <Modal visible={props.visible} transparent animationType="fade" onRequestClose={props.onCancel}>
    <Card {...props} />
  </Modal>
);

const Card: React.FC<FolderNameModalProps> = ({
  title,
  submitLabel,
  initialName = '',
  selectAll = false,
  onCancel,
  onSubmit,
}) => {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const [name, setName] = useState(initialName);

  // 全選択は、入力欄の「フォーカス時に全選択」の設定だけだと iPhone で効かないことがある。
  // 開いた直後は選択範囲を「先頭から末尾まで」に指定しておき、打ち始めるか少し経ったら手を離す
  // （離さないと、カーソルを動かしたくても全選択に戻されてしまう）
  const [selection, setSelection] = useState(
    selectAll && initialName ? { start: 0, end: initialName.length } : undefined
  );
  useEffect(() => {
    if (!selection) return;
    const timer = setTimeout(() => setSelection(undefined), 700);
    return () => clearTimeout(timer);
  }, []);

  const trimmed = name.trim();

  // 先にキーボードを下げてから閉じる。開いたまま閉じると、閉じた後にキーボードが一瞬戻ってちらつく
  const cancel = () => {
    Keyboard.dismiss();
    onCancel();
  };
  const submit = () => {
    Keyboard.dismiss();
    onSubmit(trimmed);
  };

  return (
    <>
      {/* キーボードに合わせて位置を動かさない。出入りのたびにカードが上下して落ち着かないので、
          最初からキーボードに隠れない高さに固定する */}
      <View style={[styles.overlay, { paddingTop: Math.round(height * 0.2) }]}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {/* 入力欄に元からある薄い案内文字は、日本語だとカーソルより下にずれて表示される。
              そのため案内文字は自前で重ね、枠の上下中央に置く */}
          <View style={[styles.field, { backgroundColor: colors.fieldBackground }]}>
            {name === '' && (
              <Text style={[styles.placeholder, { color: colors.textSecondary }]} pointerEvents="none">
                フォルダ名
              </Text>
            )}
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={name}
              onChangeText={(text) => {
                setSelection(undefined);
                setName(text);
              }}
              selection={selection}
              autoFocus
              selectTextOnFocus={selectAll}
              returnKeyType="done"
              onSubmitEditing={() => trimmed && submit()}
              accessibilityLabel="フォルダ名"
            />
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.fieldBackground }]} onPress={cancel}>
              <Text style={[styles.buttonText, { color: colors.text }]}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary, opacity: trimmed ? 1 : 0.5 }]}
              onPress={submit}
              disabled={!trimmed}
            >
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  field: {
    height: 48,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    left: 14,
    right: 14,
    fontSize: 17,
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    paddingVertical: 0,
    fontSize: 17,
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
