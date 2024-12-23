import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ReceptionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esta es la pantalla principal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReceptionScreen;
