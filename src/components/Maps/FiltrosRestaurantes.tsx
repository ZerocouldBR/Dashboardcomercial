import React, { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import type { FiltrosBuscaRestaurante } from '../../types';

interface FiltrosRestaurantesProps {
  filtros: FiltrosBuscaRestaurante;
  onFiltrosChange: (filtros: FiltrosBuscaRestaurante) => void;
  onBuscar: () => void;
  totalResultados?: number;
}

const FiltrosRestaurantes: React.FC<FiltrosRestaurantesProps> = ({
  filtros,
  onFiltrosChange,
  onBuscar,
  totalResultados
}) => {
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [enderecoBusca, setEnderecoBusca] = useState('');

  const handleChange = (campo: keyof FiltrosBuscaRestaurante, valor: any) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    });
  };

  const handleTipoToggle = (tipo: string) => {
    const tipos = filtros.tipoEstabelecimento || [];
    const novostipos = tipos.includes(tipo)
      ? tipos.filter((t) => t !== tipo)
      : [...tipos, tipo];
    handleChange('tipoEstabelecimento', novostipos);
  };

  const handleStatusToggle = (status: string) => {
    const statusList = filtros.status || [];
    const novosStatus = statusList.includes(status as any)
      ? statusList.filter((s) => s !== status)
      : [...statusList, status as any];
    handleChange('status', novosStatus);
  };

  const handlePotencialToggle = (potencial: string) => {
    const potencialList = filtros.potencial || [];
    const novosPotencial = potencialList.includes(potencial as any)
      ? potencialList.filter((p) => p !== potencial)
      : [...potencialList, potencial as any];
    handleChange('potencial', novosPotencial);
  };

  const limparFiltros = () => {
    onFiltrosChange({
      raio: 5
    });
    setEnderecoBusca('');
  };

  const contarFiltrosAtivos = () => {
    let count = 0;
    if (filtros.cidade) count++;
    if (filtros.estado) count++;
    if (filtros.bairro) count++;
    if (filtros.tipoEstabelecimento && filtros.tipoEstabelecimento.length > 0) count++;
    if (filtros.status && filtros.status.length > 0) count++;
    if (filtros.potencial && filtros.potencial.length > 0) count++;
    if (filtros.vendedorResponsavel) count++;
    return count;
  };

  const tiposDisponiveis = [
    'restaurante',
    'pizzaria',
    'hamburgueria',
    'lanchonete',
    'churrascaria',
    'bar',
    'cafeteria',
    'padaria'
  ];

  const statusDisponiveis = [
    { value: 'prospecto', label: 'Prospecto' },
    { value: 'contatado', label: 'Contatado' },
    { value: 'negociacao', label: 'Em Negociação' },
    { value: 'cliente', label: 'Cliente' },
    { value: 'recusado', label: 'Recusado' }
  ];

  const potenciaisDisponiveis = [
    { value: 'baixo', label: 'Baixo' },
    { value: 'medio', label: 'Médio' },
    { value: 'alto', label: 'Alto' },
    { value: 'muito_alto', label: 'Muito Alto' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Busca principal */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Digite cidade, bairro ou endereço..."
            value={enderecoBusca}
            onChange={(e) => setEnderecoBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleChange('cidade', enderecoBusca);
                onBuscar();
              }
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="w-32">
          <select
            value={filtros.raio || 5}
            onChange={(e) => handleChange('raio', Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 km</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        <button
          onClick={() => {
            if (enderecoBusca) {
              handleChange('cidade', enderecoBusca);
            }
            onBuscar();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Buscar
        </button>

        <button
          onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          {contarFiltrosAtivos() > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {contarFiltrosAtivos()}
            </span>
          )}
        </button>
      </div>

      {/* Resultados */}
      {totalResultados !== undefined && (
        <div className="text-sm text-gray-600 mb-4">
          {totalResultados} restaurante{totalResultados !== 1 ? 's' : ''} encontrado
          {totalResultados !== 1 ? 's' : ''}
        </div>
      )}

      {/* Filtros avançados */}
      {mostrarFiltrosAvancados && (
        <div className="border-t pt-4 space-y-4">
          {/* Tipo de estabelecimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Estabelecimento
            </label>
            <div className="flex flex-wrap gap-2">
              {tiposDisponiveis.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => handleTipoToggle(tipo)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtros.tipoEstabelecimento?.includes(tipo)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusDisponiveis.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusToggle(status.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtros.status?.includes(status.value as any)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Potencial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Potencial</label>
            <div className="flex flex-wrap gap-2">
              {potenciaisDisponiveis.map((potencial) => (
                <button
                  key={potencial.value}
                  onClick={() => handlePotencialToggle(potencial.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtros.potencial?.includes(potencial.value as any)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {potencial.label}
                </button>
              ))}
            </div>
          </div>

          {/* Localização específica */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                value={filtros.cidade || ''}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                value={filtros.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value)}
                placeholder="Ex: SP"
                maxLength={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                value={filtros.bairro || ''}
                onChange={(e) => handleChange('bairro', e.target.value)}
                placeholder="Ex: Centro"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-between pt-3 border-t">
            <button
              onClick={limparFiltros}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpar Filtros
            </button>
            <button
              onClick={onBuscar}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltrosRestaurantes;
