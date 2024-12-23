import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {addProvider, getProviders} from '../../../services/Api';

const AddProvider = ({navigation}) => {
  const [name, setName] = useState('');
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const providers = await getProviders();
        if (providers.length === 0) {
          setNextId(1);
        } else {
          const lastProvider = providers[providers.length - 1];
          setNextId(String(Number(lastProvider.id) + 1));
        }
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };
    fetchNextId();
  }, []);

  const handleAddProvider = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    if (nextId === null) {
      Alert.alert('Error', 'No se pudo obtener el ID');
      return;
    }

    const provider = {id: nextId, name};

    await addProvider(provider);

    Alert.alert('Éxito', 'Proveedor agregado');

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del proveedor"
        value={name}
        onChangeText={setName}
      />
      <Button title="Guardar" onPress={handleAddProvider} />
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

export default AddProvider;
