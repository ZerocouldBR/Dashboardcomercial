import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Circle, Map } from 'lucide-react';
import type { RegiaoProspeccao } from '../../types';

interface GerenciadorRegioesProps {
  regioes: RegiaoProspeccao[];
  onAdicionarRegiao: (regiao: Omit<RegiaoProspeccao, 'id'>) => void;
  onEditarRegiao: (id: string, dados: Partial<RegiaoProspeccao>) => void;
  onRemoverRegiao: (id: string) => void;
  onSelecionarRegiao?: (regiao: RegiaoProspeccao) => void;
}

const GerenciadorRegioes: React.FC<GerenciadorRegioesProps> = ({
  regioes,
  onAdicionarRegiao,
  onEditarRegiao,
  onRemoverRegiao,
  onSelecionarRegiao
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [regiaoEditando, setRegiaoEditando] = useState<RegiaoProspeccao | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'circular' as 'circular' | 'poligonal' | 'administrativa',
    latitude: '',
    longitude: '',
    raio: '5000',
    cidade: '',
    estado: '',
    cor: '#3b82f6',
    vendedorResponsavel: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novaRegiao: Omit<RegiaoProspeccao, 'id'> = {
      nome: formData.nome,
      descricao: formData.descricao || undefined,
      tipo: formData.tipo,
      cor: formData.cor,
      vendedorResponsavel: formData.vendedorResponsavel || undefined,
      status: 'ativa',
      dataCriacao: new Date().toISOString(),
      totalProspectos: 0,
      totalContatados: 0,
      taxaConversao: 0,
      prioridade: formData.prioridade
    };

    if (formData.tipo === 'circular') {
      novaRegiao.centro = {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };
      novaRegiao.raio = parseInt(formData.raio);
    } else if (formData.tipo === 'administrativa') {
      novaRegiao.cidade = formData.cidade;
      novaRegiao.estado = formData.estado;
    }

    if (regiaoEditando) {
      onEditarRegiao(regiaoEditando.id, novaRegiao);
    } else {
      onAdicionarRegiao(novaRegiao);
    }

    fecharModal();
  };

  const abrirModal = (regiao?: RegiaoProspeccao) => {
    if (regiao) {
      setRegiaoEditando(regiao);
      setFormData({
        nome: regiao.nome,
        descricao: regiao.descricao || '',
        tipo: regiao.tipo,
        latitude: regiao.centro?.latitude.toString() || '',
        longitude: regiao.centro?.longitude.toString() || '',
        raio: regiao.raio?.toString() || '5000',
        cidade: regiao.cidade || '',
        estado: regiao.estado || '',
        cor: regiao.cor,
        vendedorResponsavel: regiao.vendedorResponsavel || '',
        prioridade: regiao.prioridade
      });
    } else {
      setRegiaoEditando(null);
      setFormData({
        nome: '',
        descricao: '',
        tipo: 'circular',
        latitude: '',
        longitude: '',
        raio: '5000',
        cidade: '',
        estado: '',
        cor: '#3b82f6',
        vendedorResponsavel: '',
        prioridade: 'media'
      });
    }
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setRegiaoEditando(null);
  };

  const getStatusColor = (status: string) => {
    const cores = {
      ativa: 'bg-green-100 text-green-800',
      pausada: 'bg-yellow-100 text-yellow-800',
      concluida: 'bg-gray-100 text-gray-800'
    };
    return cores[status as keyof typeof cores] || cores.ativa;
  };

  const getPrioridadeColor = (prioridade: string) => {
    const cores = {
      baixa: 'bg-gray-100 text-gray-700',
      media: 'bg-blue-100 text-blue-700',
      alta: 'bg-red-100 text-red-700'
    };
    return cores[prioridade as keyof typeof cores] || cores.media;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'circular':
        return <Circle className="w-4 h-4" />;
      case 'poligonal':
        return <MapPin className="w-4 h-4" />;
      case 'administrativa':
        return <Map className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Regiões de Prospecção</h2>
        <button
          onClick={() => abrirModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Região
        </button>
      </div>

      {/* Lista de regiões */}
      <div className="space-y-3">
        {regioes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma região cadastrada
            </h3>
            <p className="text-gray-600 mb-4">
              Crie regiões para organizar sua prospecção de forma estratégica.
            </p>
            <button
              onClick={() => abrirModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Primeira Região
            </button>
          </div>
        ) : (
          regioes.map((regiao) => (
            <div
              key={regiao.id}
              onClick={() => onSelecionarRegiao && onSelecionarRegiao(regiao)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: regiao.cor }}
                  >
                    {getTipoIcon(regiao.tipo)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{regiao.nome}</h3>
                    {regiao.descricao && (
                      <p className="text-sm text-gray-600 mt-1">{regiao.descricao}</p>
                    )}

                    {/* Informações da região */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(regiao.status)}`}>
                        {regiao.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadeColor(regiao.prioridade)}`}>
                        {regiao.prioridade}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {regiao.tipo}
                      </span>
                    </div>

                    {/* Estatísticas */}
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-gray-600">Prospectos</div>
                        <div className="font-bold text-gray-900">{regiao.totalProspectos}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Contatados</div>
                        <div className="font-bold text-gray-900">{regiao.totalContatados}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Conversão</div>
                        <div className="font-bold text-gray-900">{regiao.taxaConversao}%</div>
                      </div>
                    </div>

                    {/* Detalhes adicionais */}
                    {regiao.tipo === 'circular' && regiao.raio && (
                      <div className="mt-2 text-xs text-gray-600">
                        Raio: {(regiao.raio / 1000).toFixed(1)} km
                      </div>
                    )}
                    {regiao.tipo === 'administrativa' && (
                      <div className="mt-2 text-xs text-gray-600">
                        {regiao.cidade}/{regiao.estado}
                      </div>
                    )}
                    {regiao.vendedorResponsavel && (
                      <div className="mt-2 text-xs text-gray-600">
                        Responsável: {regiao.vendedorResponsavel}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModal(regiao);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Deseja realmente remover a região "${regiao.nome}"?`)) {
                        onRemoverRegiao(regiao.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de criação/edição */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {regiaoEditando ? 'Editar Região' : 'Nova Região'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Região *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Centro de São Paulo"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descrição da região e estratégia..."
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Região *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="circular">Circular (Centro + Raio)</option>
                    <option value="administrativa">Administrativa (Cidade/Bairro)</option>
                  </select>
                </div>

                {/* Campos específicos por tipo */}
                {formData.tipo === 'circular' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude *
                        </label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={formData.latitude}
                          onChange={(e) =>
                            setFormData({ ...formData, latitude: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="-23.5505"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude *
                        </label>
                        <input
                          type="number"
                          step="any"
                          required
                          value={formData.longitude}
                          onChange={(e) =>
                            setFormData({ ...formData, longitude: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="-46.6333"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Raio (metros) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.raio}
                        onChange={(e) => setFormData({ ...formData, raio: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="5000"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {(parseInt(formData.raio) / 1000).toFixed(1)} km
                      </p>
                    </div>
                  </>
                )}

                {formData.tipo === 'administrativa' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.estado}
                        onChange={(e) =>
                          setFormData({ ...formData, estado: e.target.value.toUpperCase() })
                        }
                        maxLength={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        placeholder="SP"
                      />
                    </div>
                  </div>
                )}

                {/* Configurações */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade
                    </label>
                    <select
                      value={formData.prioridade}
                      onChange={(e) =>
                        setFormData({ ...formData, prioridade: e.target.value as any })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                    <input
                      type="color"
                      value={formData.cor}
                      onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                      className="w-full h-10 px-1 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Vendedor responsável */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendedor Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.vendedorResponsavel}
                    onChange={(e) =>
                      setFormData({ ...formData, vendedorResponsavel: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do vendedor"
                  />
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {regiaoEditando ? 'Salvar Alterações' : 'Criar Região'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciadorRegioes;
