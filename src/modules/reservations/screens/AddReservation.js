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
  getReservations,
  addReservation,
  getProviders,
  getCages,
  getProducts,
} from '../../../services/Api';

const AddReservation = ({navigation}) => {
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
        const providers = await getProviders();
        const cages = await getCages();
        const products = await getProducts();

        setAvailableProviders(providers);
        setAvailableCages(cages);
        setAvailableProducts(products);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos.');
      }
    };

    fetchData();
  }, []);

  const handleAddReservation = async () => {
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
      const reservations = await getReservations();
      const newId =
        reservations.length > 0
          ? Math.max(...reservations.map(res => res.id)) + 1
          : 1;

      const newReservation = {
        id: String(newId),
        date,
        startTimeScheduled,
        endTimeScheduled,
        provider,
        cage,
        products,
      };

      await addReservation(newReservation);
      Alert.alert('Éxito', 'Reserva agregada correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding reservation:', error);
      Alert.alert('Error', 'No se pudo agregar la reserva.');
    }
  };

  const handleAddProduct = () => {
    setProducts([...products, {id: '', quantity: ''}]);
  };

  const handleProductChange = (index, productId) => {
    const isDuplicate = products.some(
      (p, i) => p.id === productId && i !== index,
    );
    if (isDuplicate) {
      Alert.alert('Error', 'Este producto ya está seleccionado.');
      return;
    }

    const updatedProducts = [...products];
    updatedProducts[index].id = productId;
    setProducts(updatedProducts);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = quantity;
    setProducts(updatedProducts);
  };

  const getAvailableProductOptions = index => {
    const selectedProductIds = products
      .filter((_, i) => i !== index)
      .map(p => p.id);

    return availableProducts.filter(
      product => !selectedProductIds.includes(product.id),
    );
  };

  const showStartTimePicker = () => setStartTimeModalVisible(true);
  const hideStartTimePicker = () => setStartTimeModalVisible(false);
  const handleStartTimeConfirm = date => {
    setStartTimeScheduled(moment(date).format('HH:mm'));
    hideStartTimePicker();
  };

  const showEndTimePicker = () => setEndTimeModalVisible(true);
  const hideEndTimePicker = () => setEndTimeModalVisible(false);
  const handleEndTimeConfirm = date => {
    setEndTimeScheduled(moment(date).format('HH:mm'));
    hideEndTimePicker();
  };

  const openCalendar = () => setIsCalendarVisible(true);
  const closeCalendar = () => setIsCalendarVisible(false);

  const handleDateChange = day => {
    const formattedDate = moment(day.dateString, 'YYYY-MM-DD').format(
      'DD/MM/YYYY',
    );
    setDate(formattedDate);
    closeCalendar();
  };

  const hasAvailableProducts = () => {
    const selectedProductIds = products.map(p => p.id);
    return availableProducts.some(
      product => !selectedProductIds.includes(product.id),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.dateButton} onPress={openCalendar}>
        <Text style={styles.dateText}>
          {date ? `${date}` : 'Seleccionar Fecha'}
        </Text>
      </TouchableOpacity>

      {isCalendarVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isCalendarVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.calendarWrapper}>
              <Calendar
                onDayPress={handleDateChange}
                markedDates={{
                  [date]: {selected: true, selectedColor: 'blue'},
                }}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCalendar}>
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Picker
        selectedValue={provider}
        style={styles.picker}
        onValueChange={setProvider}>
        <Picker.Item label="Seleccionar Proveedor" value="" />
        {availableProviders.map(provider => (
          <Picker.Item
            key={provider.id}
            label={provider.name}
            value={provider.id}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={cage}
        style={styles.picker}
        onValueChange={setCage}>
        <Picker.Item label="Seleccionar Jaula" value="" />
        {availableCages.map(cage => (
          <Picker.Item key={cage.id} label={cage.name} value={cage.id} />
        ))}
      </Picker>

      <View style={styles.timeContainer}>
        <View style={styles.timeColumn}>
          <Text>Inicio</Text>
          <Button title={startTimeScheduled} onPress={showStartTimePicker} />
        </View>
        <View style={styles.timeColumn}>
          <Text>Fin</Text>
          <Button title={endTimeScheduled} onPress={showEndTimePicker} />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isStartTimeModalVisible}
        mode="time"
        date={new Date()}
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />
      <DateTimePickerModal
        isVisible={isEndTimeModalVisible}
        mode="time"
        date={new Date()}
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      {products.map((product, index) => (
        <View key={index} style={styles.productRow}>
          <Picker
            selectedValue={product.id}
            style={styles.productPicker}
            onValueChange={value => handleProductChange(index, value)}>
            <Picker.Item label="Seleccionar Producto" value="" />
            {getAvailableProductOptions(index).map(productOption => (
              <Picker.Item
                key={productOption.id}
                label={productOption.name}
                value={productOption.id}
              />
            ))}
          </Picker>
          <TextInput
            style={styles.quantityInput}
            placeholder="Cantidad"
            placeholderTextColor="#000"
            keyboardType="numeric"
            value={product.quantity.toString()}
            onChangeText={text => handleQuantityChange(index, text)}
          />
        </View>
      ))}

      <Button
        title="Agregar producto"
        onPress={handleAddProduct}
        disabled={!hasAvailableProducts()}
      />
      <Button title="Guardar Reserva" onPress={handleAddReservation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  dateButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {color: '#000'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  closeButton: {marginTop: 10, alignItems: 'center'},
  closeText: {color: 'blue', fontWeight: 'bold'},
  picker: {height: 50, marginBottom: 10, color: '#000'},
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeColumn: {flex: 1, marginHorizontal: 5},
  productRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  productPicker: {flex: 2, height: 50, marginRight: 10, color: '#000'},
  quantityInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default AddReservation;
