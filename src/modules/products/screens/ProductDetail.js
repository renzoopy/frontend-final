import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {updateProduct, deleteProduct} from '../../../services/Api';

const ProductDetail = ({route, navigation}) => {
  const {product} = route.params;

  const [name, setName] = useState(product.name);

  const handleUpdateProduct = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    const updatedProduct = {id: product.id, name};

    try {
      await updateProduct(updatedProduct);
      Alert.alert('Éxito', 'Producto actualizado');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(product.id);
      Alert.alert('Éxito', 'Producto eliminado');
      navigation.goBack();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Alert.alert('Error', 'No se pudo eliminar el producto.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre del producto"
      />
      <Button title="Guardar cambios" onPress={handleUpdateProduct} />
      <Button
        title="Eliminar producto"
        color="red"
        onPress={handleDeleteProduct}
      />
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

export default ProductDetail;
