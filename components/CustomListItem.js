import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { db } from '../firebase';

//list item for HomeScreen
const CustomListItem = ({ navigation, id, displayName, photoURL }) => {
  const [chatMessages, setChatMessages] = useState('');

  //Direct user to userProfile screen
  const enterChat = (id, displayName, photoURL) => {
    navigation.navigate('UserProfile', {
      id: id,
      displayName: displayName,
      photoURL: photoURL,
    });
  };
  return (
    <ListItem
      key={id}
      onPress={() => enterChat(id, displayName, photoURL)}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri: photoURL
            ? photoURL
            : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
        }}
      />

      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: '800' }}>
          {displayName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
