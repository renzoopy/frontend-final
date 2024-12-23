import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {
  getReservationById,
  updateReservation,
  getProviders,
  getCages,
  getProducts,
} from '../../../services/Api';

const ReservationDetail = ({route, navigation}) => {
  const reservationId = route.params.reservation.id;

  const [date, setDate] = useState('');
  const [startTimeScheduled, setStartTimeScheduled] = useState('----');
  const [endTimeScheduled, setEndTimeScheduled] = useState('----');
  const [provider, setProvider] = useState('');
  const [cage, setCage] = useState('');
  const [products, setProducts] = useState([]);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [availableCages, setAvailableCages] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isStartTimeModalVisible, setStartTimeModalVisible] = useState(false);
  const [isEndTimeModalVisible, setEndTimeModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservation = await getReservationById(reservationId);
        const providers = await getProviders();
        const cages = await getCages();
        const products = await getProducts();

        setDate(reservation.date);
        setStartTimeScheduled(reservation.startTimeScheduled);
        setEndTimeScheduled(reservation.endTimeScheduled);
        setProvider(reservation.provider);
        setCage(reservation.cage);
        setProducts(reservation.products);

        setAvailableProviders(providers);
        setAvailableCages(cages);
        setAvailableProducts(products);

        const selectedProducts = products.filter(product =>
          reservation.products.some(p => p.id === product.id),
        );
        setAvailableProducts(selectedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos.');
      }
    };

    fetchData();
  }, [reservationId]);

  const handleUpdateReservation = async () => {
    if (!date || !provider || !cage) {
      Alert.alert('Error', 'Faltan datos obligatorios.');
      return;
    }

    if (
      products.some(
        product => !product.id || !product.quantity || product.quantity <= 0,
      )
    ) {
      Alert.alert(
        'Error',
        'Todos los productos deben tener una cantidad válida.',
      );
      return;
    }

    try {
      const updatedReservation = {
        id: reservationId,
        date,
        startTimeScheduled,
        endTimeScheduled,
        provider,
        cage,
        products,
      };

      await updateReservation(updatedReservation);
      Alert.alert('Éxito', 'Reserva actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating reservation:', error);
      Alert.alert('Error', 'No se pudo actualizar la reserva.');
    }
  };

  const handleProductQuantityChange = (id, quantity) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? {...product, quantity} : product,
      ),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setIsCalendarVisible(true)}>
        <Text style={styles.dateText}>{date || 'Seleccionar Fecha'}</Text>
      </TouchableOpacity>
      <Modal visible={isCalendarVisible} transparent animationType="slide">
        <Calendar
          onDayPress={day => {
            setDate(day.dateString);
            setIsCalendarVisible(false);
          }}
          markedDates={{[date]: {selected: true}}}
        />
      </Modal>

      <Text style={styles.label}>Hora de Inicio</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setStartTimeModalVisible(true)}>
        <Text>{startTimeScheduled}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartTimeModalVisible}
        mode="time"
        onConfirm={time => {
          setStartTimeScheduled(moment(time).format('HH:mm'));
          setStartTimeModalVisible(false);
        }}
        onCancel={() => setStartTimeModalVisible(false)}
      />

      <Text style={styles.label}>Hora de Fin</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setEndTimeModalVisible(true)}>
        <Text>{endTimeScheduled}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndTimeModalVisible}
        mode="time"
        onConfirm={time => {
          setEndTimeScheduled(moment(time).format('HH:mm'));
          setEndTimeModalVisible(false);
        }}
        onCancel={() => setEndTimeModalVisible(false)}
      />

      <Text style={styles.label}>Proveedor</Text>
      <Picker
        style={styles.picker}
        selectedValue={provider}
        onValueChange={value => setProvider(value)}>
        {availableProviders.map(item => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Jaula</Text>
      <Picker
        style={styles.picker}
        selectedValue={cage}
        onValueChange={value => setCage(value)}>
        {availableCages.map(item => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Productos</Text>
      {availableProducts.map(product => (
        <View key={product.id} style={styles.productContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <TextInput
            style={styles.productQuantityInput}
            keyboardType="numeric"
            value={
              products.find(p => p.id === product.id)?.quantity?.toString() ||
              ''
            }
            onChangeText={text =>
              handleProductQuantityChange(product.id, parseInt(text, 10) || 0)
            }
          />
        </View>
      ))}

      <Button title="Guardar Cambios" onPress={handleUpdateReservation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '700',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 8,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  productName: {
    flex: 1,
    fontSize: 16,
  },
  productQuantityInput: {
    width: 60,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  picker: {height: 50, marginBottom: 10, color: '#000'},
});

export default ReservationDetail;
