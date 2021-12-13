import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { theme } from "./colors";

/*
 * 1) onPress : 디바이스에서 눌렸을 경우를 설정해준다.
 * 2) onSubmitEditing : 디바이스 내의 키보드에서 완료 버튼을 눌렀을 경우 submit 을 해준다.
 * 3) onChangeText : TextInput 내에서 텍스트가 변경되었을 경우를 설정해준다.
 * 4) returnKeyType : 디바이스 내의 키보드에서 submit 할 버튼의 종류를 설정한다. (안드로이드 기준 '완료', IOS 기준 'return' 혹은 'send' 등)
 * 5) Object.assign(target, source1, source2) : source1, source2 를 병합하여 빈 객체인 target 으로 리턴한다.
 *    @param target — The target object to copy to.
 *    @param source1 — The first source object from which to copy properties.
 *    @param source2 — The second source object from which to copy properties
 */

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true); 
  const onChangeText = (payload) => setText(payload);
  const addTodo = () => {
    if(text === "") {
      return ;
    }
    const newToDos = Object.assign(
      {},
      toDos,
      {[Date.now()]: {text, work:working}}
    );
    setToDos(newToDos);
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
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
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18
  }
});
