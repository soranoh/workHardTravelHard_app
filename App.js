import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable } from 'react-native';
import { theme } from "./colors";

/*
 * 1) TouchableOpacity : 이벤트를 listen 할 준비가 되어있는 View
 *    touchable + opacity => 클릭하면 잠시 투명해진다.
 * 2) TouchableHighlight : 요소를 클릭할 경우 배경색이 바뀌게 해준다.
 *    underlayColor 로 설정할 수 있다.
 * 3) TouchableWithoutFeedback : 화면의 가장 위에서 일어나는 탭 이벤트를 listen 하는 Touchable 컴포넌트이다.
 *    그래픽이나 다른 UI 반응을 보여주지는 않는다.
 * 4) Pressable : 이번에 새로나온거
 */

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback>
          <Text style={styles.btnText}>Travel</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 38,
    fontWeight: "600",
  }
});
