import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import socket from '../socket';

export const Chat = ({users, messages, userName, roomId, onAddMessage}) => {
  const [messageValue, setMessageValue] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const messageRef = useRef(null);

  const onSendMessage = () => {
    if (messageValue.trim() !== '') {
      socket.emit('ROOM:NEW_MESSAGE', {
        roomId,
        userName,
        text: messageValue,
      });
      onAddMessage({
        userName,
        text: messageValue,
      });
      setMessageValue('');
    }
  };

  useEffect(() => {
    messageRef.current.scrollToEnd({animated: true});
  }, [messages]);

  const toggleUserList = () => {
    setShowUsers(!showUsers);
  };

  return (
    <View style={styles.chat}>
      <View style={styles.up}>
        <TouchableOpacity
          style={[
            styles.chatUsers,
            showUsers ? {maxHeight: `${users.length * 6}%`} : {maxHeight: 40},
          ]}
          onPress={toggleUserList}>
          <Text style={styles.boldText}>В сети {users.length}:</Text>
          {showUsers && (
            <ScrollView style={styles.userList}>
              {users.map((name, index) => (
                <Text key={index}>{name}</Text>
              ))}
            </ScrollView>
          )}
        </TouchableOpacity>
        <View style={styles.chatMessages}>
          <ScrollView ref={messageRef} style={styles.messages}>
            {messages.map((message, index) => (
              <View
                style={[
                  styles.messageView,
                  message.userName === userName ? styles.myMessageView : null,
                ]}
                key={index}>
                <View
                  style={[
                    styles.message,
                    message.userName === userName ? styles.myMessage : null,
                  ]}
                  key={index}>
                  {message.userName !== userName ? (
                    <Text style={styles.otherUserName}>{message.userName}</Text>
                  ) : null}
                  <Text
                    style={[
                      styles.messageText,
                      message.userName === userName
                        ? styles.myMessageText
                        : styles.otherMessageText,
                    ]}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.form}>
        <TextInput
          value={messageValue}
          onChangeText={text => setMessageValue(text)}
          style={styles.textInput}
          multiline
        />
        <Button
          onPress={onSendMessage}
          title="✈️"
          color="#ffa31a"
          accessibilityLabel="Send"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    flexDirection: 'column',
    margin: '10%',
    marginTop: '3%',
  },
  up: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
  },
  chatUsers: {
    width: '20vw',
    backgroundColor: '#ffa31a',
    padding: '1%',
    borderRadius: 15,
    alignItems: 'center',
    color: '#1b1b1b',
    overflow: 'hidden',
    flex: 1,
  },
  boldText: {
    fontSize: 24,
  },
  userList: {
    color: '#292929',
    fontSize: 20,
  },
  chatMessages: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    flex: 3,
  },
  messages: {
    width: '100%',
    flexGrow: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    display: 'flex',
    height: 'max-content',
    padding: '1%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    backgroundColor: '#808080',
    margin: '1%',
    borderRadius: 5,
  },
  myMessage: {
    flexDirection: 'row',
    textAlign: 'right',
  },
  messageView: {
    display: 'flex',
    flexDirection: 'row',
  },
  myMessageView: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    height: '10vh',
    width: '80%',
    borderRadius: 15,
    backgroundColor: '#808080',
    padding: '1%',
    fontSize: 20,
    marginLeft: 10,
  },
  otherUserName: {
    color: '#ffa31a',
    marginLeft: 10,
    fontWeight: '500',
  },
  messageText: {
    flexWrap: 'wrap',
    maxWidth: '90%',
  },
  otherMessageText: {
    color: '#1b1b1b',
  },
  myMessageText: {
    color: '#ffffff',
  },
});

export default Chat;
