import { AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

export const InadimplenciaTable = () => {
  const { data } = useDashboardStore();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Inadimplência
        </h3>
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>

      <div className="space-y-3">
        {data.clientesInadimplentes.map((item) => (
          <div
            key={item.cliente.id}
            className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.cliente.nome}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.cliente.cpfCnpj}
                </p>
              </div>
              <span className="badge badge-danger">
                {item.risco.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <DollarSign className="w-3 h-3" />
                  Valor inadimplente
                </div>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(item.valorInadimplente)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <Clock className="w-3 h-3" />
                  Última compra
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(item.cliente.dataUltimaCompra)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.diasSemComprar} dias atrás
                </p>
              </div>
            </div>

            {/* Títulos vencidos */}
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Títulos em aberto
              </h5>
              {data.titulosVencidos
                .filter((titulo) => titulo.clienteId === item.cliente.id)
                .map((titulo) => (
                  <div
                    key={titulo.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {titulo.numero}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Vencido há {titulo.diasAtraso} dias
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(titulo.saldo)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        + {formatCurrency(titulo.juros + titulo.multa)} (juros/multa)
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button className="btn btn-primary text-xs flex-1">
                Cobrar
              </button>
              <button className="btn btn-secondary text-xs flex-1">
                Negociar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
