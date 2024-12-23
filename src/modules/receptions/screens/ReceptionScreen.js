// src/screens/ReceptionScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  getCages,
  updateCage,
  getReservations,
  updateReservation,
} from '../../../services/Api';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';

const ReceptionScreen = ({navigation}) => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [cages, setCages] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    // Cargar reservas y jaulas
    loadReservations();
    loadCages();
  }, []);

  useEffect(() => {
    // Filtrar reservas cuando se seleccione una fecha
    if (selectedDate) {
      const filtered = reservations.filter(reservation =>
        moment(reservation.date, 'DD/MM/YYYY').isSame(
          moment(selectedDate, 'YYYY-MM-DD'),
          'day',
        ),
      );
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(reservations);
    }
  }, [selectedDate, reservations]);

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

    const updatedReservation = {
      ...reservation,
      startTimeReception: moment().format('HH:mm'),
    };
    updateReservation(updatedReservation);

    const updatedCage = {...availableCage, inUse: 'S'};
    updateCage(updatedCage);

    loadReservations();
    loadCages();
  };

  const finishReception = reservation => {
    const updatedReservation = {
      ...reservation,
      endTimeReception: moment().format('HH:mm'),
    };
    updateReservation(updatedReservation);

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

  const openCalendar = () => setIsCalendarVisible(true);
  const closeCalendar = () => setIsCalendarVisible(false);

  const handleDateChange = day => {
    setSelectedDate(day.dateString);
    closeCalendar();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 5,
            }}
            onPress={() => setIsCalendarVisible(true)}>
            <Text style={{color: '#007AFF'}}>
              {selectedDate
                ? moment(selectedDate).format('DD/MM/YYYY')
                : 'Filtrar'}
            </Text>
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity
              style={{
                marginLeft: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: '#f8d7da',
                borderRadius: 5,
              }}
              onPress={() => {
                setSelectedDate('');
                setFilteredReservations(reservations); // Mostrar todas las reservas
              }}>
              <Text style={{color: '#721c24'}}>Borrar</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, selectedDate, reservations]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={filteredReservations}
        renderItem={renderReservationItem}
        keyExtractor={item => item.id}
      />

      {isCalendarVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isCalendarVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 20,
                width: '90%',
                elevation: 5,
              }}>
              <Calendar
                onDayPress={handleDateChange}
                markedDates={{
                  [selectedDate]: {selected: true, selectedColor: 'blue'},
                }}
              />
              <TouchableOpacity
                style={{marginTop: 10, alignItems: 'center'}}
                onPress={closeCalendar}>
                <Text style={{color: 'blue', fontWeight: 'bold'}}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ReceptionScreen;
