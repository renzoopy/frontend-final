import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {
  getProviders,
  updateProvider,
  deleteProvider,
} from '../../../services/Api';

const ProviderDetail = ({route, navigation}) => {
  const {provider} = route.params;

  const [name, setName] = useState(provider.name);

  const handleUpdateProvider = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    const updatedProvider = {id: Number(provider.id), name};
    try {
      await updateProvider(updatedProvider);
      Alert.alert('Éxito', 'Proveedor actualizado');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el proveedor:', error);
      Alert.alert('Error', 'No se pudo actualizar el proveedor.');
    }
  };

  const handleDeleteProvider = async () => {
    try {
      await deleteProvider(provider.id);
      Alert.alert('Éxito', 'Proveedor eliminado');
      navigation.goBack();
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
      Alert.alert('Error', 'No se pudo eliminar el proveedor.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre del proveedor"
      />
      <Button title="Guardar cambios" onPress={handleUpdateProvider} />
      <Button
        title="Eliminar proveedor"
        color="red"
        onPress={handleDeleteProvider}
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

export default ProviderDetail;
