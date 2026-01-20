import React from 'react';
import { MapPin, Phone, Mail, Clock, TrendingUp, Calendar, User } from 'lucide-react';
import type { Restaurante } from '../../types';

interface ListaRestaurantesProps {
  restaurantes: Restaurante[];
  onRestauranteClick?: (restaurante: Restaurante) => void;
  restauranteSelecionado?: string;
}

const ListaRestaurantes: React.FC<ListaRestaurantesProps> = ({
  restaurantes,
  onRestauranteClick,
  restauranteSelecionado
}) => {
  const getStatusColor = (status: string) => {
    const cores = {
      prospecto: 'bg-gray-100 text-gray-800 border-gray-300',
      contatado: 'bg-blue-100 text-blue-800 border-blue-300',
      negociacao: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      cliente: 'bg-green-100 text-green-800 border-green-300',
      recusado: 'bg-red-100 text-red-800 border-red-300'
    };
    return cores[status as keyof typeof cores] || cores.prospecto;
  };

  const getPotencialColor = (potencial: string) => {
    const cores = {
      baixo: 'bg-gray-100 text-gray-700',
      medio: 'bg-blue-100 text-blue-700',
      alto: 'bg-yellow-100 text-yellow-700',
      muito_alto: 'bg-green-100 text-green-700'
    };
    return cores[potencial as keyof typeof cores] || cores.baixo;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      prospecto: 'Prospecto',
      contatado: 'Contatado',
      negociacao: 'Em Negociação',
      cliente: 'Cliente',
      recusado: 'Recusado'
    };
    return labels[status] || status;
  };

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      restaurante: '🍽️',
      pizzaria: '🍕',
      hamburgueria: '🍔',
      lanchonete: '🥪',
      churrascaria: '🥩',
      bar: '🍺',
      cafeteria: '☕',
      padaria: '🥖'
    };
    return icons[tipo] || '🍽️';
  };

  if (restaurantes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum restaurante encontrado
        </h3>
        <p className="text-gray-600">
          Tente ajustar os filtros ou ampliar o raio de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {restaurantes.map((restaurante) => (
        <div
          key={restaurante.id}
          onClick={() => onRestauranteClick && onRestauranteClick(restaurante)}
          className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
            restauranteSelecionado === restaurante.id
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : ''
          }`}
        >
          {/* Cabeçalho */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-3xl">{getTipoIcon(restaurante.tipoEstabelecimento)}</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{restaurante.nome}</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {restaurante.tipoEstabelecimento}
                  {restaurante.categoria && ` • ${restaurante.categoria}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(restaurante.status)}`}
              >
                {getStatusLabel(restaurante.status)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPotencialColor(restaurante.potencial)}`}
              >
                {restaurante.potencial.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Informações principais */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                {restaurante.endereco}
                <br />
                {restaurante.cidade}/{restaurante.estado}
              </span>
            </div>

            {restaurante.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`tel:${restaurante.telefone}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {restaurante.telefone}
                </a>
              </div>
            )}

            {restaurante.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${restaurante.email}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {restaurante.email}
                </a>
              </div>
            )}

            {restaurante.horarioFuncionamento && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{restaurante.horarioFuncionamento}</span>
              </div>
            )}

            {restaurante.distanciaFilial !== undefined && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">
                  Distância: <strong>{restaurante.distanciaFilial.toFixed(2)} km</strong>
                </span>
              </div>
            )}
          </div>

          {/* Informações de contato */}
          {(restaurante.ultimoContato || restaurante.proximoFollowUp || restaurante.vendedorResponsavel) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {restaurante.ultimoContato && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Último contato:{' '}
                      {new Date(restaurante.ultimoContato).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {restaurante.proximoFollowUp && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-500" />
                    <span className="text-orange-600">
                      Follow-up:{' '}
                      {new Date(restaurante.proximoFollowUp).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {restaurante.vendedorResponsavel && (
                  <div className="flex items-center gap-1 col-span-2">
                    <User className="w-3 h-3" />
                    <span>Responsável: {restaurante.vendedorResponsavel}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observações */}
          {restaurante.observacoes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 italic">
                <strong>Obs:</strong> {restaurante.observacoes}
              </p>
            </div>
          )}

          {/* Estimativas (se houver) */}
          {(restaurante.estimativaFaturamento || restaurante.numeroFuncionarios) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex gap-4 text-xs">
                {restaurante.estimativaFaturamento && (
                  <div>
                    <span className="text-gray-600">Faturamento estimado:</span>
                    <span className="font-medium text-gray-900 ml-1">
                      R$ {restaurante.estimativaFaturamento.toLocaleString('pt-BR')}
                    </span>
                  </div>
                )}
                {restaurante.numeroFuncionarios && (
                  <div>
                    <span className="text-gray-600">Funcionários:</span>
                    <span className="font-medium text-gray-900 ml-1">
                      {restaurante.numeroFuncionarios}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaRestaurantes;
