import React, { useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { Platform } from 'react-native-web';
import { ScrollView } from 'react-native';
import { Keyboard } from 'react-native';
import { db, auth } from '../firebase';
import * as firebase from 'firebase';

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  //Generate a unique hash number from a string
  const hashCode = (s) => {
    return s.split('').reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  };
  //Get chatUid
  const userId = auth.currentUser.uid;
  const peerId = route.params.id;
  const hashUserId = hashCode(userId);
  const hashPeerId = hashCode(peerId);

  const chatUid = hashUserId <= hashPeerId ? userId + peerId : peerId + userId;

  //render header
  useLayoutEffect(() => {
    console.log('chatscreen')
    navigation.setOptions({
      // title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -25,
          }}
        >
          {/* Avatar is set to last person who spoke  */}
          <Avatar
            rounded
            source={{
              uri: route.params.photoURL,
            }}
          />
          <Text
            style={{
              color: 'white',
              marginLeft: 10,
              fontWeight: '700',
              fontSize: 17,
            }}
          >
            {route.params.displayName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, messages]);

  //send message to messages collection
  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection('chats').doc(chatUid).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    db.collection('chats').doc(chatUid).set({
      lastMessage: {
        message: input,
        idFrom: userId,
        idTo: peerId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      },
      users: [userId, peerId]
    });

    setInput('');
  };

  //Grab messages before compo renders
  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('chats')
      // .doc(route.params.id)//params.id = id of chat
      .doc(chatUid)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {/* ScrollView holds messages */}
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {/* destructure message and get id and data */}
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      rounded
                      size={25}
                      position="absolute"
                      //Mobile
                      bottom={-12}
                      right={-5}
                      //Web
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        right: -5,
                      }}
                      source={{ uri: data.photoURL }}
                    />
                    <Text style={styles.receiverText}> {data.message} </Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      rounded
                      size={25}
                      position="absolute"
                      //Mobile
                      bottom={-7}
                      left={-5}
                      //Web
                      containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        right: -5,
                      }}
                      source={{ uri: data.photoURL }}
                    />
                    <Text style={styles.senderText}> {data.message} </Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Enter Message"
                style={styles.textInput}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#3cb3ab" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    padding: 9,
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-end',
    borderRadius: 14,
    marginRight: 15,
    marginBottom: 7,
    maxWidth: '70%',
    position: 'relative',
  },
  sender: {
    padding: 10,
    backgroundColor: '#2B68E6',
    alignSelf: 'flex-start',
    borderRadius: 14,
    marginLeft: 15,
    marginBottom: 7,
    maxWidth: '70%',
    position: 'relative',
  },
  receiverText: {
    color: 'black',
    fontWeight: '500',
  },
  senderText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 10,
  },
  senderName: {
    left: 10,
    paddingRight: 5,
    fontSize: 10,
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    borderWidth: 1,
    padding: 10,
    paddingLeft: 15,
    color: 'grey',
    borderRadius: 30,
  },
});
