import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {getCages, updateCage, deleteCage} from '../../../services/Api';

const CageDetail = ({route, navigation}) => {
  const {cage} = route.params;

  const [name, setName] = useState(cage.name);
  const [status, setStatus] = useState(cage.inUse);

  const handleUpdateCage = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    const updatedCage = {id: cage.id, name: name, inUse: status};
    try {
      await updateCage(updatedCage);
      Alert.alert('Éxito', 'Jaula actualizada');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar la jaula:', error);
      Alert.alert('Error', 'No se pudo actualizar la jaula.');
    }
  };

  const handleDeleteCage = async () => {
    try {
      await deleteCage(cage.id);
      Alert.alert('Éxito', 'Jaula eliminada');
      navigation.goBack();
    } catch (error) {
      console.error('Error al eliminar la jaula:', error);
      Alert.alert('Error', 'No se pudo eliminar la jaula.');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === 'S' ? 'N' : 'S';
    const updatedCage = {
      id: cage.id,
      name: cage.name,
      inUse: newStatus,
    };
    try {
      await updateCage(updatedCage);
      setStatus(newStatus);
    } catch (error) {
      console.error('Error al actualizar el estado de la jaula:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la jaula.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre de la jaula"
      />
      <Button title="Guardar cambios" onPress={handleUpdateCage} />
      <Button
        title={`Estado: ${status === 'S' ? 'En uso' : 'Disponible'}`}
        onPress={handleToggleStatus}
      />
      <Button title="Eliminar jaula" color="red" onPress={handleDeleteCage} />
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

export default CageDetail;
