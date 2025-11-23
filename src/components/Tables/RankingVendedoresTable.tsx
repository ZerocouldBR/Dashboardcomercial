import { Trophy, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency } from '../../utils/formatters';

export const RankingVendedoresTable = () => {
  const { data } = useDashboardStore();

  const getMedalColor = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-600';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Ranking de Vendedores
        </h3>
        <Trophy className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                #
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Vendedor
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Vendas
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Ticket Médio
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Comissão
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Meta
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rankingVendedores.map((item) => (
              <tr
                key={item.vendedor.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-3 px-2">
                  <Trophy className={`w-5 h-5 ${getMedalColor(item.posicao)}`} />
                </td>
                <td className="py-3 px-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.vendedor.nome}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.quantidadeVendas} vendas
                    </p>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.valorVendas)}
                  </p>
                </td>
                <td className="py-3 px-2 text-right">
                  <p className="text-gray-700 dark:text-gray-300">
                    {formatCurrency(item.ticketMedio)}
                  </p>
                </td>
                <td className="py-3 px-2 text-right">
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(item.comissaoTotal)}
                  </p>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span
                      className={`font-semibold ${
                        item.metaAtingida >= 100
                          ? 'text-green-600 dark:text-green-400'
                          : item.metaAtingida >= 80
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {item.metaAtingida.toFixed(0)}%
                    </span>
                    {item.metaAtingida >= 100 && (
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  {/* Barra de progresso */}
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        item.metaAtingida >= 100
                          ? 'bg-green-500'
                          : item.metaAtingida >= 80
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(item.metaAtingida, 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
