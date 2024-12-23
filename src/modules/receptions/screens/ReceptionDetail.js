import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {
  getCages,
  updateCage,
  updateReservation,
  getProductById,
} from '../../../services/Api';
import moment from 'moment';

const ReceptionDetail = ({route, navigation}) => {
  const {reservation, cages} = route.params;
  const [cageList, setCageList] = useState(cages);
  const [productsWithNames, setProductsWithNames] = useState([]);

  useEffect(() => {
    const fetchProductNames = async () => {
      const productDetails = await Promise.all(
        reservation.products.map(async product => {
          const productData = await getProductById(product.id);
          return {
            name: productData.name,
            quantity: product.quantity,
          };
        }),
      );
      setProductsWithNames(productDetails);
    };

    fetchProductNames();
  }, [reservation.products]);

  const finishReception = () => {
    const updatedReservation = {
      ...reservation,
      endTimeReception: moment().format('HH:mm'),
    };
    updateReservation(updatedReservation);

    const cageToFree = cageList.find(cage => cage.id === reservation.cage);
    const updatedCage = {...cageToFree, inUse: 'N'};
    updateCage(updatedCage);

    navigation.goBack();
  };

  const getState = () => {
    if (reservation.startTimeReception && reservation.endTimeReception) {
      return 'Completado';
    }
    if (reservation.startTimeReception) {
      return 'En Recepción';
    }
    return 'Pendiente';
  };

  const getStateColor = () => {
    const state = getState();
    switch (state) {
      case 'Completado':
        return styles.completed;
      case 'En Recepción':
        return styles.inProgress;
      default:
        return styles.pending;
    }
  };

  const InfoRow = ({label, value, style}) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={[styles.infoText, style]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <InfoRow
        label="Inicio Agendamiento"
        value={reservation.startTimeScheduled}
      />
      <InfoRow label="Fin Agendamiento" value={reservation.endTimeScheduled} />
      <InfoRow label="Proveedor" value={reservation.provider} />
      <InfoRow label="Estado" value={getState()} style={getStateColor()} />
      <InfoRow label="Jaula" value={reservation.cage} />
      <InfoRow
        label="Inicio Recepción"
        value={reservation.startTimeReception}
      />
      <InfoRow label="Fin Recepción" value={reservation.endTimeReception} />

      <Text style={styles.productsTitle}>Productos:</Text>
      {productsWithNames.length > 0 ? (
        productsWithNames.map((product, index) => (
          <Text key={index} style={styles.productText}>
            {product.name} - Cantidad: {product.quantity}
          </Text>
        ))
      ) : (
        <Text>Cargando productos...</Text>
      )}

      {getState() === 'En Recepción' && (
        <Button title="Finalizar Recepción" onPress={finishReception} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    width: 160, // Asegura un ancho fijo para alinear los valores
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  productsTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  productText: {
    fontSize: 16,
    marginVertical: 5,
  },
  pending: {
    color: 'gray',
  },
  inProgress: {
    color: 'yellow',
  },
  completed: {
    color: 'green',
  },
});

export default ReceptionDetail;
