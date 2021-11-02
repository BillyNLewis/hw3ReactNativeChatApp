import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import CustomListItem from '../components/CustomListItem';

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [peerIds, setPeerIds] = useState([]);
  const [users, setUsers] = useState([]);
  //Sign out user
  const signOutUer = () => {
    auth.signOut().then(() => {
      navigation.replace('Login');
    });
  };
  //retrieve chats that current user has interacted with
  useEffect(() => {
      console.log('ue');
    const unsubscribe = db
      .collection('chats')
    //   .orderBy('lastMessage.timestamp', 'desc')
      .where('users', 'array-contains', auth.currentUser.uid)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            // //note:doc.data() is the obj inside of an doc
            data: doc.data(),
          }))
        )
      );
    getUsers();
    return unsubscribe;
  }, []);
//wait for chats to be updated 
  useEffect(() => {
    console.log('bruh');
    getPeerIds();
 }, [chats])
 
  //get peerIds from the chats that current user has interacted with
  const getPeerIds = () => {
    console.log('getPeerIds');
    let peerIdsArr = [];
    chats.map((chat) => {
      chat.data.users.map((user) => {
        let peerId = null;
        //note: users represents userId
        user !== auth.currentUser.uid ? (peerId = user) : null;
        peerId !== null ? peerIdsArr.push(peerId) : null;
      });
    });
    setPeerIds(peerIdsArr);
  };

  //get users from users collection using peerId
  const getUsers = () => {
    console.log('getUsers');
    db.collection('users').onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          //note:doc.data() is the obj inside of an doc
          data: doc.data(),
        }))
      )
    );
  };
  //create header for home screen
  useLayoutEffect(() => {
    navigation.setOptions({
      title: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: 'white',
              marginRight: 10,
              fontWeight: '700',
              fontSize: 17,
            }}
          >
            Hello {auth.currentUser.displayName}
          </Text>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser
                ? auth.currentUser.photoURL
                : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            }}
          />
        </View>
      ),
      headerStyle: { backgroundColor: '#3cb3ab' },
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={{ marginLeft: 15, flexDirection: 'row' }}>
          <TouchableOpacity onPress={signOutUer} activeOpacity={0.5}>
            <SimpleLineIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: 70,
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.5}
          >
            <FontAwesome name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
      <Text
            style={{
              color: '#3cb3ab',
              margin: 10,
              fontWeight: '800',
              fontSize: 20,
            }}
          >
            List of started conversations
          </Text>
    
        {users.map(({ id, data: { displayName, photoURL } }) =>
          peerIds.includes(id) ? (
            <CustomListItem
              key={id}
              id={id}
              displayName={displayName}
              photoURL={photoURL}
              navigation={navigation}   
            />
          ) : null
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
