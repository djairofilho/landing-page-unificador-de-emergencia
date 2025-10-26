import { useState } from 'react';
import './App.css'
import { Dashboard } from './Dashboard';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:123'
  }

  return (
    <div className="app-container">
      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${!showDashboard ? 'active' : ''}`}
          onClick={() => setShowDashboard(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Página Inicial
        </button>
        <button 
          className={`toggle-btn ${showDashboard ? 'active' : ''}`}
          onClick={() => setShowDashboard(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Painel
        </button>
      </div>

      {/* Content */}
      {!showDashboard ? (
        <div className="landing-page">
          <div className="content">
            <div className="icon">🚨</div>
            <h1>UNIFICADOR DE EMERGÊNCIAS</h1>
            <h2 className="number">190 • 192 • 193</h2>
            <p className="description">
              Um único número que conecta você diretamente ao serviço de emergência correto:
            </p>
            <ul className="services">
              <li><strong>193</strong> - Corpo de Bombeiros</li>
              <li><strong>192</strong> - SAMU</li>
              <li><strong>190</strong> - Polícia Militar</li>
            </ul>
            <p className="subtitle">
              Clique abaixo para ser direcionado automaticamente
            </p>
            <button 
              className="help-button" 
              onClick={handleCall}
              aria-label="Ligar para o UNIFICADOR 193"
            >
              Solicitar Ajuda
            </button>
            <p className="footer">
              Atendimento 24 horas • Livre e gratuito
            </p>
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default App
