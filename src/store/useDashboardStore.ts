import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardData, FiltrosDashboard, ConfiguracaoDashboard } from '../types';
import { mockDashboardData } from '../data/mockData';

interface DashboardStore {
  // Dados
  data: DashboardData;
  loading: boolean;
  error: string | null;

  // Filtros
  filtros: FiltrosDashboard;
  setFiltros: (filtros: Partial<FiltrosDashboard>) => void;
  resetFiltros: () => void;

  // Configurações
  config: ConfiguracaoDashboard;
  setTema: (tema: 'light' | 'dark') => void;
  toggleWidget: (widgetId: string) => void;
  reorderWidgets: (widgets: ConfiguracaoDashboard['widgets']) => void;

  // Ações
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const dataInicio = new Date();
dataInicio.setDate(1); // Primeiro dia do mês
const dataFim = new Date();

const filtrosDefault: FiltrosDashboard = {
  dataInicio: dataInicio.toISOString().split('T')[0],
  dataFim: dataFim.toISOString().split('T')[0],
};

const configDefault: ConfiguracaoDashboard = {
  tema: 'light',
  widgets: [
    { id: 'kpis', tipo: 'kpis', visivel: true, posicao: 0, tamanho: 'large' },
    { id: 'vendas-periodo', tipo: 'chart', visivel: true, posicao: 1, tamanho: 'large' },
    { id: 'vendas-categoria', tipo: 'chart', visivel: true, posicao: 2, tamanho: 'medium' },
    { id: 'ranking-vendedores', tipo: 'table', visivel: true, posicao: 3, tamanho: 'medium' },
    { id: 'comissoes', tipo: 'chart', visivel: true, posicao: 4, tamanho: 'medium' },
    { id: 'clientes-inativos', tipo: 'table', visivel: true, posicao: 5, tamanho: 'medium' },
    { id: 'inadimplencia', tipo: 'table', visivel: true, posicao: 6, tamanho: 'medium' },
    { id: 'pedidos-recentes', tipo: 'table', visivel: true, posicao: 7, tamanho: 'small' },
  ],
  filtrosDefault,
  notificacoes: {
    inadimplencia: true,
    metasVendedor: true,
    clientesInativos: true,
  },
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      data: mockDashboardData,
      loading: false,
      error: null,
      filtros: filtrosDefault,
      config: configDefault,

      // Filtros
      setFiltros: (novosFiltros) => {
        set((state) => ({
          filtros: { ...state.filtros, ...novosFiltros },
        }));
        // Recarregar dados com novos filtros
        get().loadData();
      },

      resetFiltros: () => {
        set({ filtros: filtrosDefault });
        get().loadData();
      },

      // Configurações
      setTema: (tema) => {
        set((state) => ({
          config: { ...state.config, tema },
        }));

        // Aplicar tema ao documento
        if (tema === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleWidget: (widgetId) => {
        set((state) => ({
          config: {
            ...state.config,
            widgets: state.config.widgets.map((w) =>
              w.id === widgetId ? { ...w, visivel: !w.visivel } : w
            ),
          },
        }));
      },

      reorderWidgets: (widgets) => {
        set((state) => ({
          config: { ...state.config, widgets },
        }));
      },

      // Carregar dados
      loadData: async () => {
        set({ loading: true, error: null });

        try {
          // Simular chamada API
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Em produção, substituir por:
          // const response = await fetch('/api/dashboard', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(get().filtros)
          // });
          // const data = await response.json();

          set({ data: mockDashboardData, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro ao carregar dados',
            loading: false
          });
        }
      },

      refreshData: async () => {
        await get().loadData();
      },
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        config: state.config,
        filtros: state.filtros
      }),
    }
  )
);
