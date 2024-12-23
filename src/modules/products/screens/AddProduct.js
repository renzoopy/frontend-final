import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {addProduct, getProducts} from '../../../services/Api';

const AddProduct = ({navigation}) => {
  const [name, setName] = useState('');
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const products = await getProducts();
        if (products.length === 0) {
          setNextId('1');
        } else {
          const lastProduct = products[products.length - 1];
          setNextId(String(Number(lastProduct.id) + 1));
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchNextId();
  }, []);

  const handleAddProduct = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    if (nextId === null) {
      Alert.alert('Error', 'No se pudo obtener el ID');
      return;
    }

    const product = {id: nextId, name};

    await addProduct(product);

    Alert.alert('Éxito', 'Producto agregado');

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={name}
        onChangeText={setName}
      />
      <Button title="Guardar" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default AddProduct;
