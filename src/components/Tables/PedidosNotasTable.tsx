import { Package, FileText, Calendar, User } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters';
import { useState } from 'react';

type TabType = 'pedidos' | 'notas';

export const PedidosNotasTable = () => {
  const { data } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<TabType>('pedidos');

  return (
    <div className="card">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'pedidos'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400 font-semibold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          Pedidos Recentes
        </button>
        <button
          onClick={() => setActiveTab('notas')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'notas'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400 font-semibold'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Notas Fiscais
        </button>
      </div>

      {/* Conteúdo */}
      {activeTab === 'pedidos' && (
        <div className="space-y-3">
          {data.pedidosRecentes.map((pedido) => (
            <div
              key={pedido.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {pedido.numero}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(pedido.data)}
                    </span>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(pedido.status).badge}`}>
                  {pedido.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(pedido.valorFinal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Desconto</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(pedido.desconto)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pagamento</p>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {pedido.formaPagamento.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Condição</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {pedido.condicaoPagamento}
                  </p>
                </div>
              </div>

              {pedido.dataEntregaPrevista && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Entrega prevista: {formatDateTime(pedido.dataEntregaPrevista)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notas' && (
        <div className="space-y-3">
          {data.notasFiscaisRecentes.map((nota) => (
            <div
              key={nota.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    NF-e {nota.numero} - Série {nota.serie}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(nota.dataEmissao)}
                    </span>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(nota.status).badge}`}>
                  {nota.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(nota.valorFinal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Impostos</p>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(nota.valorImposto)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CFOP</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {nota.cfop}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="mb-1">
                  <span className="font-medium">Natureza:</span> {nota.naturezaOperacao}
                </p>
                <p className="font-mono text-[10px]">
                  <span className="font-medium">Chave:</span> {nota.chaveAcesso}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
