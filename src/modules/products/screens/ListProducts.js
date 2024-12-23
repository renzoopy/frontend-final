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
import {getProducts} from '../../../services/Api';
import {useFocusEffect} from '@react-navigation/native';

const ListProducts = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de productos.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, []),
  );

  const handleSearch = text => {
    setSearch(text);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Agregar"
          onPress={() => navigation.navigate('AddProduct')}
        />
      ),
    });
  }, [navigation]);

  const handleItemPress = product => {
    navigation.navigate('ProductDetail', {product});
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
        data={filteredProducts}
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

export default ListProducts;
