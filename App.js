import React, {useEffect, useReducer, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {JoinBlock} from './components/JoinBlock';
import reducer from './reducer';
import socket from './socket';
import {Chat} from './components/Chat';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const [appAddress, setAppAddress] = useState(null);

  useEffect(() => {
    const fetchAppAddress = async () => {
      const appVersion = DeviceInfo.getVersion();
      const deviceType = DeviceInfo.getDeviceType();

      const address = `https://example.com/${encodeURIComponent(
        appVersion,
      )}/${encodeURIComponent(deviceType)}`;
      setAppAddress(address);
    };

    fetchAppAddress();
  }, [appAddress]);

  const setUsers = users => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const onLogin = async obj => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
    const {data} = await axios.get(
      `https://chat-back-4n4o.onrender.com/rooms/${obj.roomId}`,
      // `http://localhost:9999/rooms/${obj.roomId}`
    );
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const addMessage = message => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  return (
    <View style={styles.container}>
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
  },
});

export default App;
