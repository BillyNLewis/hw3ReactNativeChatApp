import React, { useLayoutEffect, useState, useEffect, useReducer } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Picker } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';

export default function UserProfileScreen({ navigation, route }) {
  const { id, displayName, photoURL } = route.params;
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rating, setRating] = useState('1');
  const [ratingArr, setRatingArr] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'User Profile',
      headerBackTitle: 'Back',
    });
  }, [navigation]);
  //Grab ratings for a user before compo renders
  useLayoutEffect(() => {
    db.collection('users')
      .doc(id)
      .get()
      .then((doc) => {
        setRatingArr(doc.data().rating);
      });
  }, []);

  //listen for changes in ratingArray
  useEffect(() => {
    average();
  }, [ratingArr]);

  //calculate user average ratings
  const average = () => {
    if (ratingArr.length !== 0) {
      console.log('ratingArr');
      let aveRateNum = ratingArr.reduce((a, b) => a + b) / ratingArr.length;
      aveRateNum = Math.round(aveRateNum * 10) / 10;
      setAverageRating(aveRateNum);
    }
  };
  //Add rating to user profile
  const sendRating = () => {
    const ratingNum = Number(rating);
    ratingArr.push(ratingNum);
    db.collection('users')
      .doc(route.params.id)
      .update({
        rating: ratingArr,
      })
      .then(() => {
        forceUpdate();
        average();
        alert('Your rating has been added');
      })
      .catch((error) => alert(error));
  };
  //Direct user to chat screen
  const enterChat = (id, displayName, photoURL) => {
    navigation.navigate('Chat', {
      id: id,
      displayName: displayName,
      photoURL: photoURL,
    });
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text h3 style={{ marginBottom: 10, marginTop: 20 }}>
        {route.params.displayName}
      </Text>
      <Text h4 style={{ marginBottom: 10 }}>
        Average Rating: {averageRating}
      </Text>
      <Text h4 style={{ marginBottom: 10 }}>
        {ratingArr.length} reviews
      </Text>
      <Avatar
        rounded
        source={{ uri: route.params.photoURL }}
        style={{ width: 200, height: 200 }}
      />
      <View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Rate conversation: 1 - 5</Text>
        </View>
      </View>
      <View
        style={{
          width: 300,
          marginLeft: 20,
          marginRight: 20,
          borderColor: 'black',
          borderBottomWidth: 1,
          borderRadius: 10,
          alignSelf: 'center',
        }}
      >
        <Picker selectedValue={rating} onValueChange={(num) => setRating(num)}>
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
        </Picker>
      </View>

      <Button
        buttonStyle={{ backgroundColor: '#3cb3ab' }}
        containerStyle={styles.button}
        raised
        title="Submit rating"
        onPress={sendRating}
      />
      <Button
        buttonStyle={{ backgroundColor: '#3cb3ab' }}
        containerStyle={styles.button}
        raised
        title="Chat"
        onPress={() => enterChat(id, displayName, photoURL)}
      />

      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 10,
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
