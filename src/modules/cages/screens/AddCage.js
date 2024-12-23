import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {addCage, getCages} from '../../../services/Api';

const AddCage = ({navigation}) => {
  const [name, setName] = useState('');
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const cages = await getCages();
        if (cages.length === 0) {
          setNextId(1);
        } else {
          const lastCage = cages[cages.length - 1];
          setNextId(String(Number(lastCage.id) + 1));
        }
      } catch (error) {
        console.error('Error al obtener las jaulas:', error);
      }
    };
    fetchNextId();
  }, []);

  const handleAddCage = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    if (nextId === null) {
      Alert.alert('Error', 'No se pudo obtener el ID');
      return;
    }

    const cage = {id: nextId, name: name, inUse: 'N'};

    await addCage(cage);

    Alert.alert('Éxito', 'Jaula agregada');

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la jaula"
        value={name}
        onChangeText={setName}
      />
      <Button title="Guardar" onPress={handleAddCage} />
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

export default AddCage;
