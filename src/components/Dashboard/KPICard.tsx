import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  variacao?: number;
  icon: LucideIcon;
  iconColor: string;
  subtitle?: string;
}

export const KPICard = ({
  title,
  value,
  variacao,
  icon: Icon,
  iconColor,
  subtitle,
}: KPICardProps) => {
  const isPositive = variacao !== undefined && variacao >= 0;

  return (
    <div className="card card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {variacao !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {variacao.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            vs. mês anterior
          </span>
        </div>
      )}
    </div>
  );
};
