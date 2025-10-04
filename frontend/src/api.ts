import axios from 'axios';
import type { CustomerDTO, TransactionDTO, TransferRequest } from './interfaces';


const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- CLIENTES ---

export const getAllCustomers = async (): Promise<CustomerDTO[]> => {
  const response = await api.get<CustomerDTO[]>('/customers');
  return response.data;
};

export const getCustomerById = async (id: number): Promise<CustomerDTO> => {
  const response = await api.get<CustomerDTO>(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (customerData: Omit<CustomerDTO, 'id'>): Promise<CustomerDTO> => {
  // Omit<CustomerDTO, 'id'> asegura que no enviamos el ID, ya que el backend lo genera.
  const response = await api.post<CustomerDTO>('/customers', customerData);
  return response.data;
};

// --- TRANSACCIONES ---

export const performTransfer = async (request: TransferRequest): Promise<TransactionDTO> => {
  const response = await api.post<TransactionDTO>('/transactions', request);
  return response.data;
};

export const getAccountHistory = async (accountNumber: string): Promise<TransactionDTO[]> => {
  const response = await api.get<TransactionDTO[]>(`/transactions/${accountNumber}`);
  return response.data;
};

// Puedes añadir aquí createCustomer, getCustomerById, etc.