import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {label && formatMonthYear(label)}
        </p>
        <p className="text-sm text-primary-600 dark:text-primary-400">
          Valor: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Vendas: {payload[1]?.value || 0}
        </p>
      </div>
    );
  }
  return null;
};

export const VendasPorPeriodoChart = () => {
  const { data } = useDashboardStore();

  const chartData = data.vendasPorPeriodo.map((item) => ({
    mes: item.data,
    mesFormatado: formatMonthYear(item.data),
    valor: item.valor,
    quantidade: item.quantidade || 0,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Vendas por Período
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="mesFormatado"
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
          <Legend />
          <Area
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValor)"
            name="Valor (R$)"
          />
          <Line
            type="monotone"
            dataKey="quantidade"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            name="Quantidade"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
