import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { theme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Fontisto, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [checkToDo, setCheckToDo] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const updateCheck = false;

  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem("@curLocation", "false");
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem("@curLocation", "true");
  }; 
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const curLocation = await AsyncStorage.getItem("@curLocation");
      if(JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) === null) {
        return;
      }
      setToDos(JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)));
      setWorking(curLocation === "true" ? true : false);
    } catch(e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadToDos();
  }, []);
  const addTodo = async () => {
    if(text === "") {
      return ;
    }
    // 하단의 Object.assign 은 const newToDos = [...toDos, [Date.now()]:{text, work:working}] 과 같음.
    const newToDos = Object.assign(
      {},
      toDos,
      {[Date.now()]: {text, working, checkToDo, updateCheck}}
    );
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = async (key) => {
    if(Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?");
      if(ok) {
        const newToDos = {...toDos};
        delete newToDos[key];
        
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("Delete To Do", "Are you sure?", [
        {
          text: "Accept",
          style: "destructive",
          onPress: () => {
            const newToDos = {...toDos};
            delete newToDos[key];
            
            setToDos(newToDos);
            saveToDos(newToDos);
          }
        },
        { text: "Cancel", style: "cancel"}
      ]);
    }
  };
  const changeCheck = async (key) => {
    const newToDos = {...toDos};
    const checkValue = newToDos[key].checkToDo;
    newToDos[key].checkToDo = !checkValue;

    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const changeTextInput = (idx) => {
    const newToDos = {...toDos};
    const beforeCheck = newToDos[idx].updateCheck;
    if(beforeCheck) {
      setUpdateCheck(newToDos);
    } else {
      setUpdateCheck(newToDos);
      newToDos[idx].updateCheck = true;
    }
    setUpdateText(newToDos[idx].text);

    setToDos(newToDos);
  };
  const updateToDo = async (key) => {
    const newToDos = {...toDos};
    if(updateText === "") {
      setUpdateCheck(newToDos);
      setToDos(newToDos);
      return;
    }

    newToDos[key].text = updateText;
    setUpdateCheck(newToDos);

    setToDos(newToDos);
    await saveToDos(newToDos);
    setUpdateText("");
  };
  const onChangeUpdateText = (payload) => setUpdateText(payload);
  const setUpdateCheck = (newToDos) => {
    Object.keys(newToDos).map((key) => newToDos[key].updateCheck = false);
  };
  const onBlur = (key) => {
    const newToDos = {...toDos};
    newToDos[key].updateCheck = false;

    setToDos(newToDos);
  }

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
        placeholder={working ? "What do you have to do?" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? (<View style={styles.toDo}key={key}>

            <TouchableOpacity onPress={() => changeCheck(key)}>
              {toDos[key].checkToDo ? (
                <MaterialCommunityIcons name="checkbox-marked" size={18} color="white" />) : (
                <MaterialCommunityIcons name="checkbox-blank-outline" size={18} color="white" />
              )}
            </TouchableOpacity>

            {toDos[key].updateCheck ? (<TextInput
              onSubmitEditing={() => updateToDo(key)}
              onChangeText={onChangeUpdateText}
              onBlur={() => onBlur(key)}
              value={updateText}
              placeholder={toDos[key].text}
              style={styles.updateText} />) : (
              <Text style={toDos[key].checkToDo ? {...styles.toDoText, textDecorationLine: "line-through", color: "gray"} : styles.toDoText}>{toDos[key].text}</Text>
            )}
            
            <TouchableOpacity onPress={() => changeTextInput(key)}>
              <FontAwesome name="pencil" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <Fontisto name="trash" size={18} color="white" />
            </TouchableOpacity>
          </View>
          ) : null
        ))}
      </ScrollView>
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
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    width: 250
  },
  updateText: {
    backgroundColor: "white",
    width: 250
  }
});