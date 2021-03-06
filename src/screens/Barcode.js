import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, 
  ActivityIndicator, BackHandler, TouchableOpacity } from 'react-native';
import Icon1 from "react-native-vector-icons/FontAwesome"
import { BarCodeScanner } from 'expo-barcode-scanner';
import { navigationRef } from '../navigators/RootNavigation';
import firebase from '../../api/authkey'
import "firebase/functions";

export default ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(loading)
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
      navigation.setOptions({
          headerTitle: "Scanner",
          headerLeft: () => (
              <TouchableOpacity style={styles.icon}
              onPress={() => {navigation.navigate('Add Item')}}>
                  <Icon1
                      name="arrow-left"
                      color="#133480"
                      size={20}
                  />
              </TouchableOpacity>
          )
        });
  }, []);

  useEffect(() => {
    const backAction = () => {
        navigation.reset({routes: [{ name: 'Add Item' }]})
        return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log('test')
    setScanned(true);
    setLoading(true)
    // console.log(data)
    const URL = 
      await firebase.functions().httpsCallable('barcodeToURL')({barcode: data})
      .then((doc) => {
        if (doc["data"]["success"]) {
          navigation.navigate('Add Item Barcode', {test: doc["data"]["success"]})
        } else {
          navigation.reset({routes: [{ name: 'Barcode' }]})
        }
      })
      .catch(
        (error) => {
          console.log(error)
          navigation.reset({routes: [{ name: 'Barcode' }]})
        })

    // URL["data"]["success"] && URL["data"]["success"].includes("ebay")
    // alert('Bar code with type ${type} and data ${data} has been scanned!')
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (loading === true) {
    navigation.setOptions({
      headerTitle: "Scanner",
      headerLeft: () => (
          <TouchableOpacity style={styles.icon}
          onPress={() => {}}>
              <Icon1
                  name="arrow-left"
                  color="#133480"
                  size={20}
              />
          </TouchableOpacity>
      )
    });
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    
    return (
      <View>
          <Text style={styles.validate}>Validating input URL...</Text>
          <Text style={styles.message}>If the URL is invalid, you will be redirected to the scanner.
           This may take up to 5 seconds.</Text>     
        <ActivityIndicator size="large" color="#0000ff" style={{paddingTop: 12}} animating={loading}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  )}

  // {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}

  const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        },
        validate: {
          fontFamily: 'ProximaNovaBold',
          fontSize: 20,
          textAlign: 'center',
          padding: 20
        },
        message: {
          fontFamily: 'ProximaNova',
          fontSize: 15,
          textAlign: 'center',
          padding: 10
        },
        text: {
          flexDirection: 'column'
        },
        icon: {
          padding: 20
        }
    })