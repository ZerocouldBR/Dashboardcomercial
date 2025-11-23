import { useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Target,
  AlertCircle,
} from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import { formatCurrency, formatNumber } from '../utils/formatters';

// Components
import { KPICard } from '../components/Dashboard/KPICard';
import { VendasPorPeriodoChart } from '../components/Charts/VendasPorPeriodoChart';
import { VendasPorCategoriaChart } from '../components/Charts/VendasPorCategoriaChart';
import { ComissoesChart } from '../components/Charts/ComissoesChart';
import { RankingVendedoresTable } from '../components/Tables/RankingVendedoresTable';
import { ClientesInativosTable } from '../components/Tables/ClientesInativosTable';
import { InadimplenciaTable } from '../components/Tables/InadimplenciaTable';
import { PedidosNotasTable } from '../components/Tables/PedidosNotasTable';
import { DateRangeFilter } from '../components/Filters/DateRangeFilter';
import { WidgetCustomizer } from '../components/Filters/WidgetCustomizer';

export const Dashboard = () => {
  const { data, config, loadData, loading } = useDashboardStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isWidgetVisible = (widgetId: string) => {
    return config.widgets.find((w) => w.id === widgetId)?.visivel ?? true;
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filtros e Personalização */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DateRangeFilter />
        <WidgetCustomizer />
      </div>

      {/* KPIs */}
      {isWidgetVisible('kpis') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Vendas do Mês"
            value={formatCurrency(data.kpis.vendasMes.valor)}
            variacao={data.kpis.vendasMes.variacao}
            icon={DollarSign}
            iconColor="bg-gradient-to-br from-green-500 to-green-700"
            subtitle={`${formatNumber(data.kpis.vendasMes.quantidade)} vendas`}
          />
          <KPICard
            title="Ticket Médio"
            value={formatCurrency(data.kpis.ticketMedio.valor)}
            variacao={data.kpis.ticketMedio.variacao}
            icon={ShoppingCart}
            iconColor="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <KPICard
            title="Meta Mensal"
            value={`${data.kpis.metaMensal.percentual.toFixed(1)}%`}
            variacao={data.kpis.metaMensal.percentual - 100}
            icon={Target}
            iconColor="bg-gradient-to-br from-purple-500 to-purple-700"
            subtitle={`${formatCurrency(data.kpis.metaMensal.realizado)} de ${formatCurrency(
              data.kpis.metaMensal.valor
            )}`}
          />
          <KPICard
            title="Inadimplência"
            value={formatCurrency(data.kpis.inadimplencia.valor)}
            icon={AlertCircle}
            iconColor="bg-gradient-to-br from-red-500 to-red-700"
            subtitle={`${data.kpis.inadimplencia.quantidade} clientes (${data.kpis.inadimplencia.percentual.toFixed(
              2
            )}%)`}
          />
        </div>
      )}

      {/* Linha adicional de KPIs */}
      {isWidgetVisible('kpis') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Vendas Hoje"
            value={formatCurrency(data.kpis.vendasDia.valor)}
            variacao={data.kpis.vendasDia.variacao}
            icon={TrendingUp}
            iconColor="bg-gradient-to-br from-cyan-500 to-cyan-700"
          />
          <KPICard
            title="Comissões Pendentes"
            value={formatCurrency(data.kpis.comissoesPendentes.valor)}
            icon={DollarSign}
            iconColor="bg-gradient-to-br from-yellow-500 to-yellow-700"
            subtitle={`${data.kpis.comissoesPendentes.quantidade} vendedores`}
          />
          <KPICard
            title="Clientes Ativos"
            value={formatNumber(data.kpis.clientesAtivos.total)}
            icon={Users}
            iconColor="bg-gradient-to-br from-green-500 to-green-700"
            subtitle={`${data.kpis.clientesAtivos.novos} novos este mês`}
          />
          <KPICard
            title="Clientes Inativos"
            value={formatNumber(data.kpis.clientesInativos.total)}
            icon={AlertCircle}
            iconColor="bg-gradient-to-br from-orange-500 to-orange-700"
            subtitle={`${data.kpis.clientesInativos.diasSemComprar} dias sem comprar (média)`}
          />
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isWidgetVisible('vendas-periodo') && (
          <div className="lg:col-span-2">
            <VendasPorPeriodoChart />
          </div>
        )}
        {isWidgetVisible('vendas-categoria') && <VendasPorCategoriaChart />}
      </div>

      {/* Comissões e Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isWidgetVisible('comissoes') && <ComissoesChart />}
        {isWidgetVisible('ranking-vendedores') && <RankingVendedoresTable />}
      </div>

      {/* Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isWidgetVisible('clientes-inativos') && <ClientesInativosTable />}
        {isWidgetVisible('inadimplencia') && <InadimplenciaTable />}
      </div>

      {/* Pedidos e Notas Fiscais */}
      {isWidgetVisible('pedidos-recentes') && <PedidosNotasTable />}
    </div>
  );
};
