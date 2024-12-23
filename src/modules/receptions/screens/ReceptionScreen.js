// src/screens/ReceptionScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  getCages,
  updateCage,
  getReservations,
  updateReservation,
} from '../../../services/Api';
import moment from 'moment';

const ReceptionScreen = ({navigation}) => {
  const [reservations, setReservations] = useState([]);
  const [cages, setCages] = useState([]);

  useEffect(() => {
    // Cargar reservas y jaulas
    loadReservations();
    loadCages();
  }, []);

  const loadReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  const loadCages = async () => {
    const data = await getCages();
    setCages(data);
  };

  const startReception = reservation => {
    const availableCage = cages.find(cage => cage.inUse === 'N');
    if (!availableCage) {
      Alert.alert('Error', 'No hay jaulas disponibles');
      return;
    }

    // Actualizar el turno con la hora de inicio de recepción
    const updatedReservation = {
      ...reservation,
      startTimeReception: moment().format('HH:mm'),
    };
    updateReservation(updatedReservation);

    // Marcar la jaula como en uso
    const updatedCage = {...availableCage, inUse: 'S'};
    updateCage(updatedCage);

    loadReservations();
    loadCages();
  };

  const finishReception = reservation => {
    // Actualizar el turno con la hora de fin de recepción
    const updatedReservation = {
      ...reservation,
      endTimeReception: moment().format('HH:mm'),
    };
    updateReservation(updatedReservation);

    // Liberar la jaula
    const cageToFree = cages.find(cage => cage.id === reservation.cage);
    const updatedCage = {...cageToFree, inUse: 'N'};
    updateCage(updatedCage);

    loadReservations();
    loadCages();
  };

  const getState = reservation => {
    if (reservation.startTimeReception && reservation.endTimeReception) {
      return 'Completado';
    }
    if (reservation.startTimeReception) {
      return 'En Recepción';
    }
    return 'Pendiente';
  };

  const renderReservationItem = ({item}) => {
    const state = getState(item);

    return (
      <TouchableOpacity
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
        onPress={() => {
          console.log('Navigating to ReceptionDetail', {
            reservation: item,
            cages,
          });
          navigation.navigate('ReceptionDetail', {reservation: item, cages});
        }}>
        <Text>Inicio Agendamiento: {item.startTimeScheduled}</Text>
        <Text>Fin Agendamiento: {item.endTimeScheduled}</Text>
        <Text>Proveedor: {item.provider}</Text>
        <Text>Estado: {state}</Text>
        <Text>Jaula: {item.cage}</Text>
        <Text>Inicio Recepción: {item.startTimeReception || '-'}</Text>
        <Text>Fin Recepción: {item.endTimeReception || '-'}</Text>

        {state === 'Pendiente' && (
          <Button
            title="Iniciar Recepción"
            onPress={() => startReception(item)}
          />
        )}

        {state === 'En Recepción' && (
          <Button
            title="Finalizar Recepción"
            onPress={() => finishReception(item)}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={reservations}
      renderItem={renderReservationItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ReceptionScreen;
