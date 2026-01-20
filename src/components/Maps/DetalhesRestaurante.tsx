import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  DollarSign,
  Building,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Shield,
  Image as ImageIcon
} from 'lucide-react';
import type { Restaurante } from '../../types';
import { restauranteService } from '../../services/restauranteService';
import { cnpjService } from '../../services/cnpjService';

interface DetalhesRestauranteProps {
  restaurante: Restaurante;
  onClose: () => void;
  onAtualizar?: (restaurante: Restaurante) => void;
}

const DetalhesRestaurante: React.FC<DetalhesRestauranteProps> = ({
  restaurante: restauranteInicial,
  onClose,
  onAtualizar
}) => {
  const [restaurante, setRestaurante] = useState(restauranteInicial);
  const [abaAtiva, setAbaAtiva] = useState<'geral' | 'avalia\u00e7\u00f5es' | 'cnpj' | 'cr\u00e9dito'>('geral');
  const [carregando, setCarregando] = useState(false);
  const [cnpjInput, setCnpjInput] = useState('');

  const consultarCNPJ = async () => {
    if (!cnpjInput) {
      alert('Digite um CNPJ');
      return;
    }

    setCarregando(true);
    try {
      const restauranteAtualizado = await restauranteService.consultarCNPJ(restaurante, cnpjInput);
      setRestaurante(restauranteAtualizado);
      if (onAtualizar) onAtualizar(restauranteAtualizado);
      alert('CNPJ consultado com sucesso!');
    } catch (error: any) {
      alert('Erro ao consultar CNPJ: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const relatorioCredito = restaurante.cnpj
    ? cnpjService.gerarRelatorioCreditoSimplificado(restaurante)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{restaurante.nome}</h2>
              <p className="text-sm text-gray-600 mt-1">{restaurante.tipoEstabelecimento}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setAbaAtiva('geral')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                abaAtiva === 'geral'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Geral
            </button>
            {restaurante.avaliacaoGoogle && (
              <button
                onClick={() => setAbaAtiva('avalia\u00e7\u00f5es')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  abaAtiva === 'avalia\u00e7\u00f5es'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Avalia\u00e7\u00f5es
              </button>
            )}
            <button
              onClick={() => setAbaAtiva('cnpj')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                abaAtiva === 'cnpj'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              CNPJ
            </button>
            {restaurante.cnpj && (
              <button
                onClick={() => setAbaAtiva('cr\u00e9dito')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  abaAtiva === 'cr\u00e9dito'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cr\u00e9dito
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Aba Geral */}
          {abaAtiva === 'geral' && (
            <div className="space-y-6">
              {/* Score e Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Score de Prospec\u00e7\u00e3o</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {restaurante.scoreProspeccao || 'N/A'}/100
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Potencial</div>
                  <div className="text-2xl font-bold text-green-600 capitalize">
                    {restaurante.potencial.replace('_', ' ')}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="text-2xl font-bold text-purple-600 capitalize">
                    {restaurante.status}
                  </div>
                </div>
              </div>

              {/* Motivos para abordagem */}
              {restaurante.motivosAbordagem && restaurante.motivosAbordagem.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Motivos para Priorizar
                  </h3>
                  <ul className="space-y-1">
                    {restaurante.motivosAbordagem.map((motivo, idx) => (
                      <li key={idx} className="text-sm text-yellow-800">
                        • {motivo}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fotos */}
              {restaurante.fotos && restaurante.fotos.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Fotos
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {restaurante.fotos.slice(0, 6).map((foto, idx) => (
                      <img
                        key={idx}
                        src={foto}
                        alt={`${restaurante.nome} ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Informações de contato */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Contato</h3>
                {restaurante.telefone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${restaurante.telefone}`} className="text-blue-600 hover:underline">
                      {restaurante.telefone}
                    </a>
                  </div>
                )}
                {restaurante.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${restaurante.email}`} className="text-blue-600 hover:underline">
                      {restaurante.email}
                    </a>
                  </div>
                )}
                {restaurante.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a
                      href={restaurante.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span>{restaurante.endereco}, {restaurante.cidade}/{restaurante.estado}</span>
                </div>
                {restaurante.horarioFuncionamento && (
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-xs">{restaurante.horarioFuncionamento}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aba Avaliações */}
          {abaAtiva === 'avalia\u00e7\u00f5es' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Avalia\u00e7\u00e3o Google</div>
                  <div className="text-3xl font-bold text-yellow-600 flex items-center gap-2">
                    <Star className="w-8 h-8 fill-current" />
                    {restaurante.avaliacaoGoogle?.toFixed(1)}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total de Avalia\u00e7\u00f5es</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {restaurante.totalAvaliacoes?.toLocaleString()}
                  </div>
                </div>
              </div>
              {restaurante.nivelPreco && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">N\u00edvel de pre\u00e7o:</span>
                  <span className="text-green-600">
                    {'$'.repeat(restaurante.nivelPreco)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Aba CNPJ */}
          {abaAtiva === 'cnpj' && (
            <div className="space-y-6">
              {!restaurante.cnpj ? (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Consultar CNPJ</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={cnpjInput}
                      onChange={(e) => setCnpjInput(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button
                      onClick={consultarCNPJ}
                      disabled={carregando}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {carregando ? 'Consultando...' : 'Consultar'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">CNPJ</div>
                      <div className="font-medium">{restaurante.cnpj}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Raz\u00e3o Social</div>
                      <div className="font-medium">{restaurante.razaoSocial}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Nome Fantasia</div>
                      <div className="font-medium">{restaurante.nomeFantasia || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Situa\u00e7\u00e3o Cadastral</div>
                      <div className={`font-medium ${restaurante.situacaoCadastral === 'ATIVA' ? 'text-green-600' : 'text-red-600'}`}>
                        {restaurante.situacaoCadastral}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Data de Abertura</div>
                      <div className="font-medium">{restaurante.dataAbertura}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Capital Social</div>
                      <div className="font-medium">
                        {restaurante.capitalSocial?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                    </div>
                  </div>

                  {restaurante.atividadePrincipal && (
                    <div>
                      <div className="text-sm text-gray-600">Atividade Principal</div>
                      <div className="font-medium">{restaurante.atividadePrincipal}</div>
                    </div>
                  )}

                  {restaurante.socios && restaurante.socios.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        S\u00f3cios e Administradores
                      </h3>
                      <div className="space-y-2">
                        {restaurante.socios.map((socio, idx) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2">
                            <div className="font-medium">{socio.nome}</div>
                            <div className="text-sm text-gray-600">{socio.qualificacao}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Aba Crédito */}
          {abaAtiva === 'cr\u00e9dito' && relatorioCredito && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  An\u00e1lise de Cr\u00e9dito Simplificada
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {relatorioCredito.score}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Classifica\u00e7\u00e3o</div>
                    <div className="text-xl font-bold text-purple-600">
                      {relatorioCredito.classificacao}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <div className="font-medium text-gray-900">Recomenda\u00e7\u00e3o:</div>
                  <div className="text-gray-700">{relatorioCredito.recomendacao}</div>
                </div>
              </div>

              {relatorioCredito.oportunidades.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">Oportunidades</h4>
                  <ul className="space-y-1">
                    {relatorioCredito.oportunidades.map((op, idx) => (
                      <li key={idx} className="text-sm text-green-800">
                        ✓ {op}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatorioCredito.riscos.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-900 mb-2">Riscos</h4>
                  <ul className="space-y-1">
                    {relatorioCredito.riscos.map((risco, idx) => (
                      <li key={idx} className="text-sm text-red-800">
                        ⚠ {risco}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesRestaurante;
