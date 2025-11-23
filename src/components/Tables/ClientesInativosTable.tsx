import { UserX, Calendar, DollarSign } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ClientesInativosTable = () => {
  const { data } = useDashboardStore();

  const getRiscoColor = (dias: number) => {
    if (dias > 180) return 'text-red-600 dark:text-red-400';
    if (dias > 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Clientes Inativos
        </h3>
        <UserX className="w-5 h-5 text-orange-500" />
      </div>

      <div className="space-y-3">
        {data.clientesInativos.map((item) => (
          <div
            key={item.cliente.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.cliente.nome}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.cliente.cpfCnpj}
                </p>
              </div>
              <span className={`badge badge-warning`}>
                Categoria {item.cliente.categoriаCliente}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-3 h-3" />
                  Última compra
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(item.cliente.dataUltimaCompra)}
                </p>
                <p className={`text-xs font-semibold ${getRiscoColor(item.diasSemComprar)}`}>
                  {item.diasSemComprar} dias atrás
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <DollarSign className="w-3 h-3" />
                  Total compras
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.cliente.valorTotalCompras)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.cliente.quantidadeCompras} pedidos
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Ticket médio
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.valorMedioCompra)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.frequenciaCompra.toFixed(1)}x/mês
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="btn btn-primary text-xs flex-1">
                Entrar em contato
              </button>
              <button className="btn btn-secondary text-xs flex-1">
                Ver histórico
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
