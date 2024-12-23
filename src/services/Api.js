import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.19:3000', // URL del JSON server
});

//------------------------------------------------------------------ PROVEEDORES
// Obtener todos los proveedores
export const getProviders = async () => {
  const response = await api.get('/providers');
  return response.data;
};

// Obtener un proveedor por ID
export const getProviderById = async id => {
  const response = await api.get(`/providers/${id}`);
  return response.data;
};

// Agregar un nuevo proveedor
export const addProvider = async provider => {
  const response = await api.post('/providers', provider);
  return response.data;
};

// Actualizar un proveedor existente
export const updateProvider = async provider => {
  const response = await api.put(`/providers/${provider.id}`, provider);
  return response.data;
};

// Eliminar un proveedor
export const deleteProvider = async id => {
  const response = await api.delete(`/providers/${id}`);
  return response.data;
};

export default api;

//------------------------------------------------------------------ PRODUCTOS
// Para obtener la lista de productos
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Para obtener un producto por ID
export const getProductById = async id => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Agregar un nuevo producto
export const addProduct = async product => {
  const response = await api.post('/products', product);
  return response.data;
};

// Actualizar un producto existente
export const updateProduct = async product => {
  const response = await api.put(`/products/${product.id}`, product);
  return response.data;
};

// Eliminar un producto
export const deleteProduct = async id => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

//------------------------------------------------------------------ JAULAS
// Obtener lista de jaulas
export const getCages = async () => {
  const response = await api.get('/cages');
  return response.data;
};

// Obtener jaula por ID
export const getCageById = async id => {
  const response = await api.get(`/cages/${id}`);
  return response.data;
};

// Agregar una jaula
export const addCage = async cage => {
  const response = await api.post('/cages', cage);
  return response.data;
};

// Actualizar una jaula existente
export const updateCage = async cage => {
  const response = await api.put(`/cages/${cage.id}`, cage);
  return response.data;
};

// Eliminar una jaula
export const deleteCage = async id => {
  const response = await api.delete(`/cages/${id}`);
  return response.data;
};

//------------------------------------------------------------------ RESERVAS
// Para obtener la lista de turnos
export const getReservations = async () => {
  const response = await api.get('/reservations');
  return response.data;
};

// Para obtener un turno por ID
export const getReservationById = async id => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

// Agregar un nuevo turno
export const addReservation = async reservation => {
  const response = await api.post('/reservations', reservation);
  return response.data;
};

// Actualizar un turno existente
export const updateReservation = async reservation => {
  const response = await api.put(
    `/reservations/${reservation.id}`,
    reservation,
  );
  return response.data;
};

// Eliminar un turno
export const deleteReservation = async id => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};
