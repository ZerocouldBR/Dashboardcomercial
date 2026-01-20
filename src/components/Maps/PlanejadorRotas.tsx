import React, { useState, useEffect } from 'react';
import { Route, MapPin, Clock, Navigation, CheckCircle, XCircle } from 'lucide-react';
import type { Restaurante, RotaProspeccao, Localizacao } from '../../types';
import { restauranteService } from '../../services/restauranteService';

interface PlanejadorRotasProps {
  restaurantes: Restaurante[];
  onRotaCriada?: (rota: RotaProspeccao) => void;
}

const PlanejadorRotas: React.FC<PlanejadorRotasProps> = ({
  restaurantes,
  onRotaCriada
}) => {
  const [restaurantesSelecionados, setRestaurantesSelecionados] = useState<string[]>([]);
  const [pontoPartida, setPontoPartida] = useState<Localizacao | null>(null);
  const [nomeRota, setNomeRota] = useState('');
  const [vendedorId, setVendedorId] = useState('');
  const [dataRota, setDataRota] = useState(new Date().toISOString().split('T')[0]);
  const [rotaOtimizada, setRotaOtimizada] = useState<Restaurante[]>([]);
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [duracaoEstimada, setDuracaoEstimada] = useState(0);

  const toggleRestaurante = (id: string) => {
    setRestaurantesSelecionados((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const otimizarRota = () => {
    if (restaurantesSelecionados.length === 0) {
      alert('Selecione pelo menos um restaurante');
      return;
    }

    const restaurantesParaRota = restaurantes.filter((r) =>
      restaurantesSelecionados.includes(r.id)
    );

    const inicio = pontoPartida || restaurantesParaRota[0].localizacao;
    const rotaOtimizadaResult = restauranteService.otimizarRota(
      restaurantesParaRota,
      inicio
    );

    setRotaOtimizada(rotaOtimizadaResult);

    // Calcular distância total
    let distTotal = 0;
    let pontoAtual = inicio;

    for (const restaurante of rotaOtimizadaResult) {
      distTotal += restauranteService.calcularDistancia(
        pontoAtual,
        restaurante.localizacao
      );
      pontoAtual = restaurante.localizacao;
    }

    setDistanciaTotal(distTotal);

    // Estimar duração (considerando 30 min por visita + tempo de deslocamento a 40 km/h)
    const tempoDeslocamento = (distTotal / 40) * 60; // minutos
    const tempoVisitas = rotaOtimizadaResult.length * 30; // 30 min por visita
    setDuracaoEstimada(tempoDeslocamento + tempoVisitas);
  };

  const criarRota = () => {
    if (!nomeRota || !vendedorId || rotaOtimizada.length === 0) {
      alert('Preencha todos os campos e otimize a rota primeiro');
      return;
    }

    const rota: Omit<RotaProspeccao, 'id'> = {
      nome: nomeRota,
      vendedorId,
      data: new Date(dataRota).toISOString(),
      status: 'planejada',
      pontos: rotaOtimizada.map((r, index) => ({
        restauranteId: r.id,
        ordem: index + 1,
        visitado: false
      })),
      distanciaTotal,
      duracaoEstimada,
      pontoPartida: pontoPartida || rotaOtimizada[0].localizacao,
      pontoChegada: rotaOtimizada[rotaOtimizada.length - 1].localizacao,
      rotaOtimizada: rotaOtimizada.map((r) => r.localizacao)
    };

    restauranteService.criarRota(rota).then((rotaCriada) => {
      if (onRotaCriada) {
        onRotaCriada(rotaCriada);
      }
      alert('Rota criada com sucesso!');
      limparFormulario();
    });
  };

  const limparFormulario = () => {
    setRestaurantesSelecionados([]);
    setRotaOtimizada([]);
    setNomeRota('');
    setVendedorId('');
    setDataRota(new Date().toISOString().split('T')[0]);
    setPontoPartida(null);
    setDistanciaTotal(0);
    setDuracaoEstimada(0);
  };

  const usarLocalizacaoAtual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPontoPartida({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          alert('Localização atual definida como ponto de partida');
        },
        (error) => {
          alert('Erro ao obter localização: ' + error.message);
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo navegador');
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Route className="w-6 h-6" />
          Planejar Rota de Prospecção
        </h2>

        <div className="space-y-4">
          {/* Nome e vendedor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Rota *
              </label>
              <input
                type="text"
                value={nomeRota}
                onChange={(e) => setNomeRota(e.target.value)}
                placeholder="Ex: Prospecção Centro - Segunda"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendedor Responsável *
              </label>
              <input
                type="text"
                value={vendedorId}
                onChange={(e) => setVendedorId(e.target.value)}
                placeholder="Nome do vendedor"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data e ponto de partida */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                value={dataRota}
                onChange={(e) => setDataRota(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ponto de Partida
              </label>
              <button
                onClick={usarLocalizacaoAtual}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {pontoPartida ? 'Localização definida' : 'Usar localização atual'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seleção de restaurantes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Selecionar Restaurantes ({restaurantesSelecionados.length})
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {restaurantes.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              Nenhum restaurante disponível. Use os filtros para buscar restaurantes.
            </p>
          ) : (
            restaurantes.map((restaurante) => (
              <label
                key={restaurante.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  restaurantesSelecionados.includes(restaurante.id)
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={restaurantesSelecionados.includes(restaurante.id)}
                  onChange={() => toggleRestaurante(restaurante.id)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{restaurante.nome}</div>
                  <div className="text-sm text-gray-600">
                    {restaurante.endereco} - {restaurante.cidade}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">{restaurante.tipoEstabelecimento}</div>
                  {restaurante.distanciaFilial !== undefined && (
                    <div className="text-xs text-gray-600">
                      {restaurante.distanciaFilial.toFixed(2)} km
                    </div>
                  )}
                </div>
              </label>
            ))
          )}
        </div>

        <button
          onClick={otimizarRota}
          disabled={restaurantesSelecionados.length === 0}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Otimizar Rota
        </button>
      </div>

      {/* Rota otimizada */}
      {rotaOtimizada.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Rota Otimizada</h3>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">
                {rotaOtimizada.length}
              </div>
              <div className="text-sm text-gray-600">Paradas</div>
            </div>
            <div className="text-center">
              <Navigation className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">
                {distanciaTotal.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600">Distância</div>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(duracaoEstimada)} min
              </div>
              <div className="text-sm text-gray-600">Duração estimada</div>
            </div>
          </div>

          {/* Sequência de visitas */}
          <div className="space-y-2">
            {pontoPartida && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-300 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  ➤
                </div>
                <div>
                  <div className="font-medium text-gray-900">Ponto de Partida</div>
                  <div className="text-sm text-gray-600">
                    {pontoPartida.latitude.toFixed(4)}, {pontoPartida.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            )}

            {rotaOtimizada.map((restaurante, index) => (
              <div
                key={restaurante.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{restaurante.nome}</div>
                  <div className="text-sm text-gray-600">
                    {restaurante.endereco} - {restaurante.cidade}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {restaurante.tipoEstabelecimento}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={limparFormulario}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={criarRota}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar Rota
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanejadorRotas;
