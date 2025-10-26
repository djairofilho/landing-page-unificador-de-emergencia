import { useState, useEffect } from 'react';
import type { DashboardStats, EmergencyCategory } from './types';
import { getDashboardStats } from './services';
import './Dashboard.css';

interface CategoryColor {
  [key: string]: string;
}

const CATEGORY_COLORS: CategoryColor = {
  policia: '#FF6B6B',
  samu: '#4ECDC4',
  bombeiros: '#FFE66D',
  trote: '#95E1D3',
  indefinido: '#B19CD9',
  'policia-analogia': '#FF8C42',
};

const CATEGORY_LABELS: CategoryColor = {
  policia: 'Polícia',
  samu: 'SAMU',
  bombeiros: 'Bombeiros',
  trote: 'Trote',
  indefinido: 'Indefinido',
  'policia-analogia': 'Chamada Disfarçada',
};

const CATEGORY_ICONS: CategoryColor = {
  policia: '👮',
  samu: '🏥',
  bombeiros: '🔥',
  trote: '📞',
  indefinido: '❔',
  'policia-analogia': '🔒',
};

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    // Atualiza a cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
    } catch (err) {
      setError('Erro ao carregar dados do painel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <p className="error-message">⚠️ {error}</p>
          <button onClick={loadStats} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div className="header-title">
            <h2>Painel de Classificação</h2>
            {lastUpdate && <span className="last-update">Atualizado às {lastUpdate}</span>}
          </div>
        </div>
        <div className="header-info">
          <span className={`status-badge ${loading ? 'updating' : 'online'}`}>
            <span className="status-indicator"></span>
            {loading ? 'Atualizando' : 'Online'}
          </span>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="stats-grid">
        <StatCard
          icon="phone"
          label="Total de Chamadas"
          value={stats?.total_calls || 0}
          color="#8E44AD"
        />
        <StatCard
          icon="alert"
          label="Trotes Detectados"
          value={stats?.calls_by_category.trote || 0}
          color="#E74C3C"
        />
        <StatCard
          icon="shield"
          label="Chamadas Disfarçadas"
          value={stats?.calls_by_category['policia-analogia'] || 0}
          color="#F39C12"
        />
        <StatCard
          icon="flame"
          label="Emergências Críticas"
          value={stats?.calls_by_urgency?.crítica || 0}
          color="#DC3545"
        />
      </div>

      {/* Breakdown por Categoria */}
      <div className="categories-section">
        <h3>Chamadas por Categoria</h3>
        <div className="categories-grid">
          {(Object.keys(CATEGORY_LABELS) as EmergencyCategory[]).map((category) => (
            <CategoryCard
              key={category}
              category={category}
              count={stats?.calls_by_category[category] || 0}
              total={stats?.total_calls || 1}
              color={CATEGORY_COLORS[category]}
              label={CATEGORY_LABELS[category]}
              icon={CATEGORY_ICONS[category]}
            />
          ))}
        </div>
      </div>

      {/* Breakdown por Região de São Paulo */}
      {stats?.calls_by_region && Object.keys(stats.calls_by_region).length > 0 && (
        <div className="regions-section">
          <h3>Distribuição por Região de São Paulo</h3>
          <div className="regions-grid">
            {Object.entries(stats.calls_by_region)
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => (
                <RegionCard
                  key={region}
                  region={region}
                  count={count}
                  total={stats.total_calls}
                />
              ))}
          </div>
        </div>
      )}

      {/* Breakdown por Gravidade */}
      {stats?.calls_by_urgency && Object.keys(stats.calls_by_urgency).length > 0 && (
        <div className="urgency-section">
          <h3>Níveis de Gravidade das Emergências</h3>
          <div className="urgency-grid">
            {(['crítica', 'alta', 'média', 'baixa'] as const).map((level) => {
              const count = stats.calls_by_urgency?.[level] || 0;
              if (count === 0) return null;
              return (
                <UrgencyCard
                  key={level}
                  level={level}
                  count={count}
                  total={stats.total_calls}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Botão de Atualização */}
      <div className="dashboard-footer">
        <button
          onClick={loadStats}
          disabled={loading}
          className="refresh-button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>
    </div>
  );
}

// Mapeamento de ícones SVG
const IconMap: Record<string, React.ReactElement> = {
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

// Componente para Card de Estatística
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ color }}>
        {IconMap[icon]}
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

// Componente para Card de Categoria
function CategoryCard({
  category,
  count,
  total,
  color,
  label,
  icon,
}: {
  category: EmergencyCategory;
  count: number;
  total: number;
  color: string;
  label: string;
  icon: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="category-card">
      <div className="category-header">
        <div className="category-name">
          <span className="category-icon">{icon}</span>
          <span className="category-label">{label}</span>
        </div>
        <span className="category-count">{count}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
      <span className="category-percentage">{Math.round(percentage)}%</span>
    </div>
  );
}

// Cores por região
const REGION_COLORS: Record<string, string> = {
  'Zona Norte': '#3498DB',
  'Zona Sul': '#2ECC71',
  'Zona Leste': '#E74C3C',
  'Zona Oeste': '#F39C12',
  'Centro': '#9B59B6',
};

// Componente para Card de Região
function RegionCard({
  region,
  count,
  total,
}: {
  region: string;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const color = REGION_COLORS[region] || '#95A5A6';

  return (
    <div className="region-card">
      <div className="region-header">
        <span className="region-label">{region}</span>
        <span className="region-count">{count}</span>
      </div>
      <div className="region-bar-container">
        <div
          className="region-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        >
          <span className="region-bar-label">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
}

// Cores e ícones por nível de urgência
const URGENCY_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  crítica: { color: '#DC3545', icon: '🔴', label: 'Crítica' },
  alta: { color: '#FD7E14', icon: '🟠', label: 'Alta' },
  média: { color: '#FFC107', icon: '🟡', label: 'Média' },
  baixa: { color: '#28A745', icon: '🟢', label: 'Baixa' },
};

// Componente para Card de Urgência
function UrgencyCard({
  level,
  count,
  total,
}: {
  level: string;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const config = URGENCY_CONFIG[level] || { color: '#6C757D', icon: '⚪', label: level };

  return (
    <div className="urgency-card" style={{ borderLeftColor: config.color }}>
      <div className="urgency-header">
        <div className="urgency-info">
          <span className="urgency-icon">{config.icon}</span>
          <div className="urgency-text">
            <span className="urgency-label">{config.label}</span>
            <span className="urgency-count">{count} chamadas</span>
          </div>
        </div>
      </div>
      <div className="urgency-bar-container">
        <div
          className="urgency-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: config.color,
          }}
        ></div>
      </div>
      <span className="urgency-percentage">{Math.round(percentage)}%</span>
    </div>
  );
}
