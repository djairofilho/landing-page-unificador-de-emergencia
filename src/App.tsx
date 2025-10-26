import './App.css'

function App() {
  const handleCall = () => {
    window.location.href = 'tel:123'
  }

  return (
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
  )
}

export default App
