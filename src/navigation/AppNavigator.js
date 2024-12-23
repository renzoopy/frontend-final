import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ListProviders from '../modules/providers/screens/ListProviders';
import AddProvider from '../modules/providers/screens/AddProvider';
import ProviderDetail from '../modules/providers/screens/ProviderDetail';
import ReceptionScreen from '../modules/receptions/screens/ReceptionScreen';
import ListProducts from '../modules/products/screens/ListProducts';
import AddProduct from '../modules/products/screens/AddProduct';
import ProductDetail from '../modules/products/screens/ProductDetail';
import ListCages from '../modules/cages/screens/ListCages';
import AddCage from '../modules/cages/screens/AddCage';
import CageDetail from '../modules/cages/screens/CageDetail';
import ListReservations from '../modules/reservations/screens/ListReservations';
import AddReservation from '../modules/reservations/screens/AddReservation';
import ReservationDetail from '../modules/reservations/screens/ReservationDetail';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Recepción">
        <Drawer.Screen name="Recepción" component={ReceptionScreen} />
        <Drawer.Screen name="Proveedores" component={ProvidersStack} />
        <Drawer.Screen name="Productos" component={ProductsStack} />
        <Drawer.Screen name="Jaulas" component={CagesStack} />
        <Drawer.Screen name="Reservas" component={ReservationsStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// Navegación para los productos
const ProductsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListProducts"
        component={ListProducts}
        options={{title: 'Productos'}}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{title: 'Agregar Producto'}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{title: 'Detalles del Producto'}}
      />
    </Stack.Navigator>
  );
};

// Navegación para los proveedores
const ProvidersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListProviders"
        component={ListProviders}
        options={{title: 'Proveedores'}}
      />
      <Stack.Screen
        name="AddProvider"
        component={AddProvider}
        options={{title: 'Agregar Proveedor'}}
      />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderDetail}
        options={{title: 'Detalles del Proveedor'}}
      />
    </Stack.Navigator>
  );
};

// Navegación para las jaulas
const CagesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListCages"
        component={ListCages}
        options={{title: 'Jaulas'}}
      />
      <Stack.Screen
        name="AddCage"
        component={AddCage}
        options={{title: 'Agregar Jaula'}}
      />
      <Stack.Screen
        name="CageDetail"
        component={CageDetail}
        options={{title: 'Detalles de la Jaula'}}
      />
    </Stack.Navigator>
  );
};

// Navegación para las reservas
const ReservationsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListReservations"
        component={ListReservations}
        options={{title: 'Reservas'}}
      />
      <Stack.Screen
        name="AddReservation"
        component={AddReservation}
        options={{title: 'Agregar Reserva'}}
      />
      <Stack.Screen
        name="ReservationDetail"
        component={ReservationDetail}
        options={{title: 'Detalles de la Reserva'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
