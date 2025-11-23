import { Moon, Sun, Bell, Settings, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const Header = () => {
  const { config, setTema, refreshData, loading } = useDashboardStore();

  const toggleTema = () => {
    setTema(config.tema === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard Comercial
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visão completa das vendas e performance
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {/* Botão Atualizar */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="btn btn-secondary flex items-center gap-2"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Atualizar</span>
            </button>

            {/* Notificações */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Tema */}
            <button
              onClick={toggleTema}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={config.tema === 'light' ? 'Modo escuro' : 'Modo claro'}
            >
              {config.tema === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Configurações */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
