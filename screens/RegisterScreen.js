import React, { useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import { auth, db } from '../firebase';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Login',
    });
  }, [navigation]);

  //Register a new user into the db
  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageUrl !== ''
              ? imageUrl
              : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
        });
      })
      .then(() => {
        addUser();
      })
      .catch((error) => alert(error.message));
  };

  //Add user to users collection
  const addUser =  () => {
    db.collection('users')
      .doc(auth.currentUser.uid)
      .set({
        email: auth.currentUser.email,
        id: auth.currentUser.uid,
        displayName: name,
        rating: [],
        photoURL:
          imageUrl !== ''
            ? imageUrl
            : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
      })
      .catch((error) => alert(error));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Signal Account
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Image URL (jpg or png)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        />
      </View>

      <Button
        buttonStyle={{ backgroundColor: '#3cb3ab' }}
        containerStyle={styles.button}
        raised
        title="Register"
        onPress={register}
      />

      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
