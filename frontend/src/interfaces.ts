// Modelo para la respuesta de GET /api/customers y POST /api/customers
export interface CustomerDTO {
  id: number;
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: number; // Usamos number para Double
}

// Modelo para la respuesta de Transacciones
// Usamos string para las fechas de la API que llegan como ISO-8601
export interface TransactionDTO {
  id: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  transactionDate?: string; // Opcional, ya que se genera en el backend
}

// Modelo para el formulario de transferencia (lo que el usuario envía)
export interface TransferRequest {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
}