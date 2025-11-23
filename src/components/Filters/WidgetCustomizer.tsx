import { Eye, EyeOff, Layout } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useState } from 'react';

export const WidgetCustomizer = () => {
  const { config, toggleWidget } = useDashboardStore();
  const [isOpen, setIsOpen] = useState(false);

  const widgetLabels: Record<string, string> = {
    kpis: 'Indicadores (KPIs)',
    'vendas-periodo': 'Vendas por Período',
    'vendas-categoria': 'Vendas por Categoria',
    'ranking-vendedores': 'Ranking de Vendedores',
    comissoes: 'Comissões',
    'clientes-inativos': 'Clientes Inativos',
    inadimplencia: 'Inadimplência',
    'pedidos-recentes': 'Pedidos e Notas Fiscais',
  };

  return (
    <div className="card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Personalizar Widgets
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isOpen ? 'Fechar' : 'Abrir'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-2">
          {config.widgets.map((widget) => (
            <div
              key={widget.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <span className="text-sm text-gray-900 dark:text-white">
                {widgetLabels[widget.id] || widget.id}
              </span>
              <button
                onClick={() => toggleWidget(widget.id)}
                className={`p-2 rounded-lg transition-colors ${
                  widget.visivel
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                }`}
              >
                {widget.visivel ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
