import { LayoutAnimation } from 'react-native';

// 画面の切り替わりが終わるのを待つ時間。戻ってから一覧を変えるときなどに使う
export const SCREEN_SETTLE_MS = 450;

// 一覧の行が増えたり消えたりするとき、ぱっと変わらずにゆっくり詰まるようにする
export const easeListChange = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(280, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
  );
};
