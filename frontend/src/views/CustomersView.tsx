import React, { useState, useEffect } from "react";
// Importamos getCustomerById para la nueva funcionalidad
import { getAllCustomers, getCustomerById } from "../api";
// Usamos 'type' import para consistencia, como tienes configurado en tu proyecto
import { type CustomerDTO } from "../types/interfaces";

const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // --- FUNCIÓN CENTRAL: Cargar la lista (o un solo cliente) ---
  const fetchCustomers = async (idToSearch?: number) => {
    setLoading(true);
    setError(null);
    setCustomers([]); // Limpiamos la lista mientras carga

    try {
      let data: CustomerDTO[] = [];

      if (idToSearch) {
        // Si se proporciona un ID, llama a la función de búsqueda por ID
        const customer = await getCustomerById(idToSearch);
        data = [customer]; // Colocamos el cliente encontrado en un array
      } else {
        // Si no se proporciona ID (o se limpia la búsqueda), llama a todos
        data = await getAllCustomers();
      }

      setCustomers(data);
    } catch (err) {
      // ✨ Usamos 'err' sin tipado explícito para que TypeScript lo trate como 'unknown'

      // ✅ CORRECCIÓN CLAVE: Verificamos si el error es de tipo 'Error' para acceder a 'message'
      let errorMessage =
        "Error al cargar la lista de clientes. Asegúrate de que el backend esté corriendo.";

      // Si el error es una instancia de Error (como la que lanzamos con 'throw new Error(...)'),
      // usamos su mensaje específico.
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("Error al cargar clientes:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJADOR DEL SUBMIT DEL FORMULARIO DE BÚSQUEDA ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      // Si el campo está vacío al buscar, recarga todos los clientes
      fetchCustomers();
      return;
    }

    const id = parseInt(trimmedSearch);
    if (isNaN(id) || id <= 0) {
      setError("El ID de búsqueda debe ser un número entero positivo.");
      setCustomers([]);
      return;
    }

    // Ejecuta la búsqueda por ID
    fetchCustomers(id);
  };

  // Carga inicial de TODOS los clientes al montar el componente
  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div>
      <h2>Consultar Clientes y Saldos</h2>

      {/* Interfaz de Búsqueda (Tarjeta) */}
      <div
        className="card-base"
        style={{ marginBottom: "20px", padding: "20px" }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Buscar cliente por ID o dejar vacío para ver todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              flexGrow: 1,
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Buscando..." : "Buscar ID"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm(""); // Limpia el input
              fetchCustomers(); // Vuelve a cargar todos
            }}
            className="btn-secondary"
            disabled={loading}
          >
            Ver Todos
          </button>
        </form>
      </div>

      {/* Mensajes de Estado */}
      {loading && <p>Cargando clientes...</p>}
      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
      )}

      {/* Tarjeta con Resultados */}
      <div className="card-base card-table-container">
        {/* Condición para mostrar la tabla solo si hay datos Y no hay error */}
        {customers.length > 0 && !loading && (
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>N° Cuenta</th>
                <th style={{ textAlign: "right" }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.accountNumber}</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      color: customer.balance >= 0 ? "#28a745" : "#dc3545",
                    }}
                  >
                    ${customer.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Mensaje de no resultados (solo si no estamos cargando y la lista está vacía) */}
        {!loading && !error && customers.length === 0 && searchTerm && (
          <p>No se encontraron clientes con el ID especificado.</p>
        )}
        {!loading && !error && customers.length === 0 && !searchTerm && (
          <p>No hay clientes registrados en el sistema.</p>
        )}
      </div>
    </div>
  );
};

export default CustomersView;
