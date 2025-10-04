import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import CustomersView from "./views/CustomersView";
import TransferView from "./views/TransferView";
import HistoryView from "./views/HistoryView";
import CreateCustomerView from "./views/CreateCustomerView";
import "./App.css";

// ✨ Importamos iconos de React Icons (usaremos Feather Icons: Fi)
import {
  FiUsers,
  FiPlusCircle,
  FiRepeat,
  FiClock,
  FiHome,
} from "react-icons/fi";

// Componente Wrapper para usar useLocation
const AppContent = () => {
  const location = useLocation();

  // Función para determinar si el enlace es el activo
  const getLinkClass = (path: string) => {
    // Verifica si la ruta actual comienza con la ruta del enlace
    return location.pathname === path ||
      (path === "/clientes" && location.pathname === "/")
      ? "active-link"
      : "";
  };

  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          width: "320px",
          padding: "20px",
          flexShrink: 0,
        }}
      >
        <div className="sidebar-card">
          <h3>Banco ArquiSoft</h3>
          <hr className="sidebar-separator" />
          <ul>
            {/* 1. Consultar Clientes */}
            <li>
              <Link to="/clientes" className={getLinkClass("/clientes")}>
                <FiUsers style={{ marginRight: "10px" }} />
                Consultar Clientes
              </Link>
            </li>

            {/* 2. Crear Cliente */}
            <li>
              <Link
                to="/crear-cliente"
                className={getLinkClass("/crear-cliente")}
              >
                <FiPlusCircle style={{ marginRight: "10px" }} />
                Crear Cliente
              </Link>
            </li>

            {/* 3. Realizar Transferencia */}
            <li>
              <Link to="/transferir" className={getLinkClass("/transferir")}>
                <FiRepeat style={{ marginRight: "10px" }} />
                Realizar Transferencia
              </Link>
            </li>

            {/* 4. Histórico Transacciones */}
            <li>
              <Link to="/historial" className={getLinkClass("/historial")}>
                <FiClock style={{ marginRight: "10px" }} />
                Histórico Transacciones
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main style={{ flexGrow: 1, padding: "30px" }}>
        <Routes>
          <Route path="/" element={<CustomersView />} />
          <Route path="/clientes" element={<CustomersView />} />
          <Route path="/crear-cliente" element={<CreateCustomerView />} />
          <Route path="/transferir" element={<TransferView />} />
          <Route path="/historial" element={<HistoryView />} />
          <Route path="/historial/:accountNumber" element={<HistoryView />} />
        </Routes>
      </main>
    </div>
  );
};

// El componente principal App ahora solo contiene el Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
