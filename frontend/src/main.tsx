import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; 

// 1. Obtener el elemento y asignarlo a una variable.
const container = document.getElementById('root');

// 2. Usar una verificación condicional 'if' para asegurar que 'container' no es null.
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
    // Esto asegura que la aplicación no falle silenciosamente si el HTML está mal.
    console.error('No se encontró el elemento con id="root" en el HTML.');
}