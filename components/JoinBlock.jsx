import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from 'axios';

export const JoinBlock = ({onLogin}) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onEnter = async () => {
    if (!roomId || !userName) {
      Alert.alert('Ошибка', 'Введите номер комнаты и свое имя');
      return;
    }
    const obj = {
      roomId,
      userName,
    };
    setIsLoading(true);
    try {
      await axios.post('https://chat-back-4n4o.onrender.com/rooms', obj);
      // await axios.post('http://localhost:9999/rooms', obj);
      onLogin(obj);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при входе в комнату');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.joinBlock}>
      <TextInput
        style={styles.input}
        placeholder="Room ID"
        onChangeText={text => setRoomId(text)}
        value={roomId}
      />
      <TextInput
        style={styles.input}
        placeholder="Имя"
        onChangeText={text => setUserName(text)}
        value={userName}
      />
      <Button
        disabled={isLoading}
        title={isLoading ? 'ВХОД...' : 'ВОЙТИ'}
        onPress={onEnter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  joinBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '30%',
    fontSize: 36,
    textAlign: 'center',
    margin: '0.5%',
    borderRadius: 15,
    backgroundColor: '#ffa31a',
    color: 'black',
    fontWeight: '600',
  },
});
