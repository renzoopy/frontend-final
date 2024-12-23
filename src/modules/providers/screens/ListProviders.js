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
import {getProviders} from '../../../services/Api';
import {useFocusEffect} from '@react-navigation/native';

const ListProviders = ({navigation}) => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);

  const fetchProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data);
      setFilteredProviders(data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de proveedores.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProviders();
    }, []),
  );

  const handleSearch = text => {
    setSearch(text);
    const filtered = providers.filter(provider =>
      provider.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredProviders(filtered);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Agregar"
          onPress={() => navigation.navigate('AddProvider')}
        />
      ),
    });
  }, [navigation]);

  const handleItemPress = provider => {
    navigation.navigate('ProviderDetail', {provider});
  };

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
        data={filteredProviders}
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

export default ListProviders;
