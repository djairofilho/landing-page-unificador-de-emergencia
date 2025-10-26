// Tipos de emergência
export type EmergencyCategory = 'policia' | 'samu' | 'bombeiros' | 'trote' | 'indefinido' | 'policia-analogia';

// Níveis de urgência
export type UrgencyLevel = 'baixa' | 'média' | 'alta' | 'crítica';

// Dados de uma chamada classificada
export interface ClassifiedCall {
  id: string;
  timestamp: string;
  transcript: string;
  category: EmergencyCategory;
  confidence: number;
  urgency_level?: UrgencyLevel;
  reasoning: string;
}

// Resposta de classificação do backend
export interface ClassificationResponse {
  category: EmergencyCategory;
  confidence: number;
  reasoning: string;
}

// Resposta de urgência do backend
export interface UrgencyResponse {
  urgency_level: UrgencyLevel;
  confidence: number;
  reasoning: string;
}

// Estatísticas do painel
export interface DashboardStats {
  total_calls: number;
  calls_by_category: Record<EmergencyCategory, number>;
  calls_by_region?: Record<string, number>;
  calls_by_urgency?: Record<UrgencyLevel, number>;
  average_confidence: number;
  last_calls: ClassifiedCall[];
}

// Estado do painel
export interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}
