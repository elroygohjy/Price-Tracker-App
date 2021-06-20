import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Button} from "react-native-elements"
import {signOut} from '../../api/auth'
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';
import Icon from "react-native-vector-icons/FontAwesome"
import firebase from 'firebase'
import List from '../../List.js'
import { NavigationContainer } from '@react-navigation/native';

export default ({navigation}) => {
    const handleLogout = () => {
        signOut(() => navigation.replace('Login'), 
        (error) => console.error(error))
    }

    const getList = List()
    const id = []

    const list = getList.map(function(dict){
        if (!id.includes(dict.id)) {
            id.push(dict.id)
            return (
                <Text key={dict.id}>{dict.name}</Text>
            );
        }
    });

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.addItem} 
                onPress={() => navigation.toggleDrawer()}>
                    <Icon
                        name="bars"
                        color="#133480"
                        size={20}
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity style={styles.addItem} 
                onPress={() => navigation.navigate('Add Item')}>
                    <Icon
                        name="plus"
                        color="#133480"
                        size={20}
                    />
                </TouchableOpacity>
            )
          });
      }, []);

    let [loaded] = useFonts({
        ProximaNova: require('../assets/fonts/ProximaNova.otf'),
    });
      
    if (!loaded) {
        return <AppLoading />;
    }

    return (
        <View style={styles.container}>
            {list}
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            paddingHorizontal: '30%',
            flex: 1,
            justifyContent: 'center',
        },
        button: {
            backgroundColor: "#133480",
            width: '100%',
            borderRadius: 20,
        },
        buttonText: {
            fontFamily: 'ProximaNova'
        },
        addItem: {
            padding: 20
        }
    })
