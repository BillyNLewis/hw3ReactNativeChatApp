import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../firebase';
import { TextInput } from 'react-native-web';
import CustomListItem from '../components/CustomListItem';

const SearchScreen = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState([]);

  //search for users
  const searchUser = () => {
    console.log('click');
    db.collection('users')
      .where('displayName', '==', input)
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            // //note:doc.data() is the obj inside of an doc
            data: doc.data(),
          }))
        )
      );
  };
  //retrieve users from users collection
  useEffect(() => {
    console.log('search');
    const unsubscribe = db.collection('users').onSnapshot((snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          //note: doc.data() is the obj inside of an doc
          data: doc.data(),
        }))
      )
    );
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Search',
      headerBackTitle: 'Home',
    });
  }, [navigation]);
  const checkInput = () => {
    if (!input.trim()) {
      alert('Please enter a user name');
      return;
    } else {
      searchUser();
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollContainer}>
        <View>
          <Input
            placeholder="Search user"
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={searchUser}
          />
          <View style={styles.container}>
            <Button
              style={styles.button}
              buttonStyle={{ backgroundColor: '#3cb3ab' }}
              onPress={checkInput}
              title="Search"
            />
          </View>

          {users.length !== 0 ? (
            users.map(({ id, data: { displayName, photoURL } }) =>
              id !== auth.currentUser.uid ? (
                <CustomListItem
                  key={id}
                  id={id}
                  displayName={displayName}
                  photoURL={photoURL}
                  navigation={navigation}
                />
              ) : null
            )
          ) : (
            <Text
              style={{
                color: '#3cb3ab',
                margin: 10,
                fontWeight: '800',
                fontSize: 20,
              }}
            >
              User not found
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
  },
  button: {
    width: 300,
    marginTop: 10,
  },
  container: {
    alignItems: 'center',
    marginBottom: 15,
  },
});
