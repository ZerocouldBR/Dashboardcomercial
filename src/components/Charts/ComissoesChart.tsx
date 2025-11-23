import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency } from '../../utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Comissão: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const ComissoesChart = () => {
  const { data } = useDashboardStore();

  const chartData = data.comissoesPorVendedor.map((item) => ({
    vendedor: item.vendedorNome.split(' ')[0], // Primeiro nome
    valor: item.valor,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Comissões por Vendedor
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="vendedor"
            className="text-xs"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis
            className="text-xs"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
