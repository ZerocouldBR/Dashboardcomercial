import { Calendar, RotateCcw } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const DateRangeFilter = () => {
  const { filtros, setFiltros, resetFiltros } = useDashboardStore();

  const handleDateChange = (field: 'dataInicio' | 'dataFim', value: string) => {
    setFiltros({ [field]: value });
  };

  const setPreset = (preset: 'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano') => {
    const hoje = new Date();
    let dataInicio = new Date();
    const dataFim = hoje.toISOString().split('T')[0];

    switch (preset) {
      case 'hoje':
        dataInicio = hoje;
        break;
      case 'semana':
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'mes':
        dataInicio.setMonth(hoje.getMonth() - 1);
        break;
      case 'trimestre':
        dataInicio.setMonth(hoje.getMonth() - 3);
        break;
      case 'ano':
        dataInicio.setFullYear(hoje.getFullYear() - 1);
        break;
    }

    setFiltros({
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim,
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Período
          </h3>
        </div>
        <button
          onClick={resetFiltros}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Resetar filtros"
        >
          <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setPreset('hoje')}
          className="btn btn-secondary text-xs"
        >
          Hoje
        </button>
        <button
          onClick={() => setPreset('semana')}
          className="btn btn-secondary text-xs"
        >
          7 dias
        </button>
        <button
          onClick={() => setPreset('mes')}
          className="btn btn-secondary text-xs"
        >
          30 dias
        </button>
        <button
          onClick={() => setPreset('trimestre')}
          className="btn btn-secondary text-xs"
        >
          3 meses
        </button>
        <button
          onClick={() => setPreset('ano')}
          className="btn btn-secondary text-xs"
        >
          1 ano
        </button>
      </div>

      {/* Data Início e Fim */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Início
          </label>
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => handleDateChange('dataInicio', e.target.value)}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Fim
          </label>
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => handleDateChange('dataFim', e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>
    </div>
  );
};
