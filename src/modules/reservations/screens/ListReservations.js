import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Button, StyleSheet, Alert} from 'react-native';
import {
  getReservations,
  getProviderById,
  getCageById,
} from '../../../services/Api';
import {useFocusEffect} from '@react-navigation/native';

const ListReservations = ({navigation}) => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      const reservationsWithDetails = await Promise.all(
        data.map(async reservation => {
          const provider = await getProviderById(reservation.provider);
          const cage = await getCageById(reservation.cage);

          return {
            ...reservation,
            providerName: provider.name,
            cageName: cage.name,
          };
        }),
      );
      setReservations(reservationsWithDetails);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de reservas.');
    }
  };

  // useEffect(() => {
  //   fetchReservations();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, []),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Agregar"
          onPress={() => navigation.navigate('AddReservation')}
        />
      ),
    });
  }, [navigation]);

  const handleItemPress = reservation => {
    navigation.navigate('ReservationDetail', {reservation});
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.listItem}>
            <Text style={styles.listText} onPress={() => handleItemPress(item)}>
              <Text style={styles.boldText}>Proveedor: </Text>
              {item.providerName} -<Text style={styles.boldText}> Jaula: </Text>
              {item.cageName}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listText: {
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default ListReservations;
