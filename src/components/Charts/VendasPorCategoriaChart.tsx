import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm text-primary-600 dark:text-primary-400">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {payload[0].payload.percentual.toFixed(1)}% do total
        </p>
      </div>
    );
  }
  return null;
};

export const VendasPorCategoriaChart = () => {
  const { data } = useDashboardStore();

  const chartData = data.vendasPorCategoria.map((item) => ({
    name: item.categoria,
    value: item.valor,
    percentual: item.percentual,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Vendas por Categoria
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentual }) => `${percentual.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Lista de categorias */}
      <div className="mt-4 space-y-2">
        {data.vendasPorCategoria.map((item, index) => (
          <div key={item.categoria} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.categoria}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(item.valor)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
