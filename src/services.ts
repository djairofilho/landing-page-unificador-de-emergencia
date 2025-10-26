import type { ClassificationResponse, DashboardStats } from './types';

// URL base do backend (ajuste conforme necessário)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Classifica um texto de emergência
 */
export async function classifyEmergency(text: string): Promise<ClassificationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao classificar emergência:', error);
    throw error;
  }
}

/**
 * Obtém as estatísticas do painel
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    // Retorna dados padrão em caso de erro
    return {
      total_calls: 0,
      calls_by_category: {
        policia: 0,
        samu: 0,
        bombeiros: 0,
        trote: 0,
        indefinido: 0,
        'policia-analogia': 0,
      },
      average_confidence: 0,
      last_calls: [],
    };
  }
}

/**
 * Obtém o histórico de chamadas
 */
export async function getCallHistory(limit: number = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return [];
  }
}
