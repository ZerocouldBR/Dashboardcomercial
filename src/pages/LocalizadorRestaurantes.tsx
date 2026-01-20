import React, { useState, useEffect } from 'react';
import {
  MapPin,
  List,
  Map as MapIcon,
  Navigation,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import MapaRestaurantes from '../components/Maps/MapaRestaurantes';
import FiltrosRestaurantes from '../components/Maps/FiltrosRestaurantes';
import ListaRestaurantes from '../components/Maps/ListaRestaurantes';
import GerenciadorRegioes from '../components/Maps/GerenciadorRegioes';
import PlanejadorRotas from '../components/Maps/PlanejadorRotas';
import { restauranteService } from '../services/restauranteService';
import { openaiService } from '../services/openaiService';
import type {
  Restaurante,
  FiltrosBuscaRestaurante,
  RegiaoProspeccao,
  Localizacao
} from '../types';

type VisualizacaoAtiva = 'mapa' | 'lista' | 'regioes' | 'rotas' | 'analise';

const LocalizadorRestaurantes: React.FC = () => {
  const [visualizacao, setVisualizacao] = useState<VisualizacaoAtiva>('mapa');
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [restaurantesFiltrados, setRestaurantesFiltrados] = useState<Restaurante[]>([]);
  const [regioes, setRegioes] = useState<RegiaoProspeccao[]>([]);
  const [filtros, setFiltros] = useState<FiltrosBuscaRestaurante>({
    raio: 5
  });
  const [centroMapa, setCentroMapa] = useState<Localizacao>({
    latitude: -23.5505,
    longitude: -46.6333
  });
  const [restauranteSelecionado, setRestauranteSelecionado] = useState<string | undefined>();
  const [carregando, setCarregando] = useState(false);
  const [menuLateralAberto, setMenuLateralAberto] = useState(true);
  const [analisandoIA, setAnalisandoIA] = useState(false);
  const [resultadoAnalise, setResultadoAnalise] = useState<string>('');

  // Carrega dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const todosRestaurantes = restauranteService.getTodosRestaurantes();
    setRestaurantes(todosRestaurantes);
    setRestaurantesFiltrados(todosRestaurantes);

    const todasRegioes = restauranteService.getTodasRegioes();
    setRegioes(todasRegioes);
  };

  const buscarRestaurantes = async () => {
    setCarregando(true);
    try {
      // Se houver cidade no filtro, busca coordenadas
      if (filtros.cidade && !filtros.localizacao) {
        const coords = await restauranteService.buscarCoordenadas(
          `${filtros.cidade}${filtros.estado ? ', ' + filtros.estado : ''}`
        );
        if (coords) {
          setCentroMapa(coords);
          filtros.localizacao = coords;
        }
      }

      const resultados = await restauranteService.buscarRestaurantes(filtros);
      setRestaurantesFiltrados(resultados);
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
      alert('Erro ao buscar restaurantes. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleRestauranteClick = (restaurante: Restaurante) => {
    setRestauranteSelecionado(restaurante.id);
    setCentroMapa(restaurante.localizacao);
  };

  const handleAdicionarRegiao = async (regiao: Omit<RegiaoProspeccao, 'id'>) => {
    const novaRegiao = await restauranteService.adicionarRegiao(regiao);
    setRegioes([...regioes, novaRegiao]);
  };

  const handleEditarRegiao = async (id: string, dados: Partial<RegiaoProspeccao>) => {
    await restauranteService.atualizarRegiao(id, dados);
    carregarDados();
  };

  const handleRemoverRegiao = (id: string) => {
    setRegioes(regioes.filter((r) => r.id !== id));
  };

  const handleSelecionarRegiao = (regiao: RegiaoProspeccao) => {
    if (regiao.centro) {
      setCentroMapa(regiao.centro);
    }
    setVisualizacao('mapa');
  };

  const analisarComIA = async () => {
    if (!openaiService.isConfigured()) {
      alert(
        'Configure a chave da API do OpenAI no arquivo .env:\nVITE_OPENAI_API_KEY=sua-chave-aqui'
      );
      return;
    }

    if (restaurantesFiltrados.length === 0) {
      alert('Nenhum restaurante para analisar. Faça uma busca primeiro.');
      return;
    }

    setAnalisandoIA(true);
    setResultadoAnalise('');

    try {
      const resultado = await openaiService.priorizarProspectos(
        restaurantesFiltrados.slice(0, 10)
      );

      let textoResultado = `**Análise Geral:**\n${resultado.resumo}\n\n**Ranking de Prioridades:**\n\n`;

      resultado.ranking.forEach((item, index) => {
        textoResultado += `${index + 1}. **${item.restaurante.nome}**\n`;
        textoResultado += `   Pontuação: ${item.pontuacao}/100\n`;
        textoResultado += `   Motivo: ${item.motivo}\n\n`;
      });

      setResultadoAnalise(textoResultado);
      setVisualizacao('analise');
    } catch (error: any) {
      console.error('Erro na análise IA:', error);
      alert('Erro ao analisar com IA: ' + error.message);
    } finally {
      setAnalisandoIA(false);
    }
  };

  const handleMapClick = async (localizacao: Localizacao) => {
    // Ao clicar no mapa, pode adicionar um novo restaurante ou região
    console.log('Clicou no mapa:', localizacao);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          menuLateralAberto ? 'w-96' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Cabeçalho */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-7 h-7 text-blue-600" />
              Localizador de Restaurantes
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Encontre e prospecte novos clientes com inteligência artificial
            </p>
          </div>

          {/* Navegação */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setVisualizacao('mapa')}
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                visualizacao === 'mapa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Mapa</span>
            </button>
            <button
              onClick={() => setVisualizacao('lista')}
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                visualizacao === 'lista'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Lista</span>
            </button>
            <button
              onClick={() => setVisualizacao('regioes')}
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                visualizacao === 'regioes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Regiões</span>
            </button>
            <button
              onClick={() => setVisualizacao('rotas')}
              className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                visualizacao === 'rotas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-sm font-medium">Rotas</span>
            </button>
          </div>

          {/* Análise com IA */}
          <button
            onClick={analisarComIA}
            disabled={analisandoIA || restaurantesFiltrados.length === 0}
            className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            {analisandoIA ? 'Analisando...' : 'Analisar com IA'}
          </button>

          {/* Conteúdo do menu */}
          <div className="space-y-4">
            {(visualizacao === 'mapa' || visualizacao === 'lista') && (
              <>
                <FiltrosRestaurantes
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  onBuscar={buscarRestaurantes}
                  totalResultados={restaurantesFiltrados.length}
                />
                {visualizacao === 'lista' && (
                  <ListaRestaurantes
                    restaurantes={restaurantesFiltrados}
                    onRestauranteClick={handleRestauranteClick}
                    restauranteSelecionado={restauranteSelecionado}
                  />
                )}
              </>
            )}

            {visualizacao === 'regioes' && (
              <GerenciadorRegioes
                regioes={regioes}
                onAdicionarRegiao={handleAdicionarRegiao}
                onEditarRegiao={handleEditarRegiao}
                onRemoverRegiao={handleRemoverRegiao}
                onSelecionarRegiao={handleSelecionarRegiao}
              />
            )}

            {visualizacao === 'rotas' && (
              <PlanejadorRotas
                restaurantes={restaurantesFiltrados}
                onRotaCriada={() => {
                  alert('Rota criada! Verifique o mapa para visualizar.');
                  setVisualizacao('mapa');
                }}
              />
            )}

            {visualizacao === 'analise' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Análise com IA
                </h3>
                <div className="prose prose-sm max-w-none">
                  {resultadoAnalise.split('\n').map((linha, index) => {
                    if (linha.startsWith('**') && linha.endsWith('**')) {
                      return (
                        <h4 key={index} className="font-bold text-gray-900 mt-3 mb-1">
                          {linha.replace(/\*\*/g, '')}
                        </h4>
                      );
                    }
                    return (
                      <p key={index} className="text-gray-700 mb-1">
                        {linha}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão toggle menu */}
      <button
        onClick={() => setMenuLateralAberto(!menuLateralAberto)}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-r-lg p-2 hover:bg-gray-50 transition-colors z-10"
        style={{ marginLeft: menuLateralAberto ? '384px' : '0' }}
      >
        {menuLateralAberto ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Área do mapa */}
      <div className="flex-1 p-6">
        {carregando ? (
          <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        ) : (
          <MapaRestaurantes
            restaurantes={restaurantesFiltrados}
            centro={centroMapa}
            zoom={13}
            altura="100%"
            regioes={regioes}
            onRestauranteClick={handleRestauranteClick}
            onMapClick={handleMapClick}
            mostrarControles={true}
          />
        )}
      </div>
    </div>
  );
};

export default LocalizadorRestaurantes;
