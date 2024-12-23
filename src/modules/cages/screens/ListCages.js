import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {getCages} from '../../../services/Api';
import {useFocusEffect} from '@react-navigation/native';

const ListCages = ({navigation}) => {
  const [cages, setCages] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCages, setFilteredCages] = useState([]);

  const fetchCages = async () => {
    try {
      const data = await getCages();
      setCages(data);
      setFilteredCages(data);
    } catch (error) {
      console.error('Error al obtener las jaulas:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de jaulas.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCages();
    }, []),
  );

  const handleSearch = text => {
    setSearch(text);
    const filtered = cages.filter(cage =>
      cage.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCages(filtered);
  };

  const handleItemPress = cage => {
    navigation.navigate('CageDetail', {cage});
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Agregar"
          onPress={() => navigation.navigate('AddCage')}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre"
        placeholderTextColor="#000"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredCages}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.listItem}>
            <Text onPress={() => handleItemPress(item)}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default ListCages;
