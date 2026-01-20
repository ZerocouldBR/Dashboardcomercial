import axios from 'axios';
import type {
  Restaurante,
  Localizacao,
  FiltrosBuscaRestaurante,
  RegiaoProspeccao,
  RotaProspeccao
} from '../types';
import { googlePlacesService } from './googlePlacesService';
import { cnpjService } from './cnpjService';

/**
 * Serviço de Busca e Gestão de Restaurantes
 *
 * Integrado com:
 * - Google Places API: busca de estabelecimentos reais com avaliações
 * - ReceitaWS/BrasilAPI: consulta de CNPJ e dados cadastrais
 * - Nominatim (OpenStreetMap): geocoding gratuito
 */

class RestauranteService {
  private restaurantes: Restaurante[] = [];
  private regioes: RegiaoProspeccao[] = [];
  private rotas: RotaProspeccao[] = [];

  constructor() {
    // Inicializa com dados de exemplo
    this.carregarDadosMock();
  }

  /**
   * Busca endereço e retorna coordenadas (Geocoding)
   */
  async buscarCoordenadas(endereco: string): Promise<Localizacao | null> {
    try {
      // Usando Nominatim (OpenStreetMap) - API gratuita
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: endereco,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'Dashboard-Comercial/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon)
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      return null;
    }
  }

  /**
   * Busca endereço a partir de coordenadas (Reverse Geocoding)
   */
  async buscarEnderecoPorCoordenadas(localizacao: Localizacao): Promise<string | null> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: localizacao.latitude,
          lon: localizacao.longitude,
          format: 'json'
        },
        headers: {
          'User-Agent': 'Dashboard-Comercial/1.0'
        }
      });

      if (response.data && response.data.display_name) {
        return response.data.display_name;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      return null;
    }
  }

  /**
   * Calcula distância entre dois pontos (em km) usando fórmula de Haversine
   */
  calcularDistancia(ponto1: Localizacao, ponto2: Localizacao): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(ponto2.latitude - ponto1.latitude);
    const dLon = this.toRad(ponto2.longitude - ponto1.longitude);
    const lat1 = this.toRad(ponto1.latitude);
    const lat2 = this.toRad(ponto2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    return Math.round(distancia * 100) / 100; // Arredonda para 2 casas decimais
  }

  private toRad(valor: number): number {
    return (valor * Math.PI) / 180;
  }

  /**
   * Busca restaurantes próximos a uma localização
   */
  async buscarRestaurantesProximos(
    localizacao: Localizacao,
    raioKm: number = 5
  ): Promise<Restaurante[]> {
    // Filtra restaurantes dentro do raio
    return this.restaurantes.filter((restaurante) => {
      const distancia = this.calcularDistancia(localizacao, restaurante.localizacao);
      return distancia <= raioKm;
    });
  }

  /**
   * Busca restaurantes com filtros avançados
   */
  async buscarRestaurantes(filtros: FiltrosBuscaRestaurante): Promise<Restaurante[]> {
    let resultado = [...this.restaurantes];

    // Filtro por localização e raio
    if (filtros.localizacao && filtros.raio) {
      resultado = resultado.filter((r) => {
        const distancia = this.calcularDistancia(filtros.localizacao!, r.localizacao);
        r.distanciaFilial = distancia;
        return distancia <= filtros.raio!;
      });
    }

    // Filtro por cidade
    if (filtros.cidade) {
      resultado = resultado.filter(
        (r) => r.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
      );
    }

    // Filtro por estado
    if (filtros.estado) {
      resultado = resultado.filter(
        (r) => r.estado.toLowerCase() === filtros.estado!.toLowerCase()
      );
    }

    // Filtro por bairro
    if (filtros.bairro) {
      resultado = resultado.filter(
        (r) => r.endereco.toLowerCase().includes(filtros.bairro!.toLowerCase())
      );
    }

    // Filtro por tipo de estabelecimento
    if (filtros.tipoEstabelecimento && filtros.tipoEstabelecimento.length > 0) {
      resultado = resultado.filter(
        (r) => filtros.tipoEstabelecimento!.includes(r.tipoEstabelecimento)
      );
    }

    // Filtro por categoria
    if (filtros.categoria && filtros.categoria.length > 0 && filtros.categoria[0]) {
      resultado = resultado.filter(
        (r) => r.categoria && filtros.categoria!.includes(r.categoria)
      );
    }

    // Filtro por status
    if (filtros.status && filtros.status.length > 0) {
      resultado = resultado.filter((r) => filtros.status!.includes(r.status));
    }

    // Filtro por potencial
    if (filtros.potencial && filtros.potencial.length > 0) {
      resultado = resultado.filter((r) => filtros.potencial!.includes(r.potencial));
    }

    // Filtro por vendedor responsável
    if (filtros.vendedorResponsavel) {
      resultado = resultado.filter(
        (r) => r.vendedorResponsavel === filtros.vendedorResponsavel
      );
    }

    return resultado;
  }

  /**
   * Adiciona um novo restaurante
   */
  async adicionarRestaurante(restaurante: Omit<Restaurante, 'id'>): Promise<Restaurante> {
    const novoRestaurante: Restaurante = {
      ...restaurante,
      id: `rest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.restaurantes.push(novoRestaurante);
    this.salvarNoLocalStorage();

    return novoRestaurante;
  }

  /**
   * Atualiza um restaurante existente
   */
  async atualizarRestaurante(id: string, dados: Partial<Restaurante>): Promise<Restaurante | null> {
    const index = this.restaurantes.findIndex((r) => r.id === id);

    if (index === -1) {
      return null;
    }

    this.restaurantes[index] = {
      ...this.restaurantes[index],
      ...dados
    };

    this.salvarNoLocalStorage();
    return this.restaurantes[index];
  }

  /**
   * Remove um restaurante
   */
  async removerRestaurante(id: string): Promise<boolean> {
    const index = this.restaurantes.findIndex((r) => r.id === id);

    if (index === -1) {
      return false;
    }

    this.restaurantes.splice(index, 1);
    this.salvarNoLocalStorage();

    return true;
  }

  /**
   * Obtém um restaurante por ID
   */
  getRestaurantePorId(id: string): Restaurante | null {
    return this.restaurantes.find((r) => r.id === id) || null;
  }

  /**
   * Obtém todos os restaurantes
   */
  getTodosRestaurantes(): Restaurante[] {
    return [...this.restaurantes];
  }

  /**
   * Gestão de Regiões de Prospecção
   */
  async adicionarRegiao(regiao: Omit<RegiaoProspeccao, 'id'>): Promise<RegiaoProspeccao> {
    const novaRegiao: RegiaoProspeccao = {
      ...regiao,
      id: `reg-${Date.now()}`
    };

    this.regioes.push(novaRegiao);
    this.salvarNoLocalStorage();

    return novaRegiao;
  }

  getTodasRegioes(): RegiaoProspeccao[] {
    return [...this.regioes];
  }

  async atualizarRegiao(id: string, dados: Partial<RegiaoProspeccao>): Promise<RegiaoProspeccao | null> {
    const index = this.regioes.findIndex((r) => r.id === id);

    if (index === -1) {
      return null;
    }

    this.regioes[index] = {
      ...this.regioes[index],
      ...dados
    };

    this.salvarNoLocalStorage();
    return this.regioes[index];
  }

  /**
   * Gestão de Rotas
   */
  async criarRota(rota: Omit<RotaProspeccao, 'id'>): Promise<RotaProspeccao> {
    const novaRota: RotaProspeccao = {
      ...rota,
      id: `rota-${Date.now()}`
    };

    this.rotas.push(novaRota);
    this.salvarNoLocalStorage();

    return novaRota;
  }

  getTodasRotas(): RotaProspeccao[] {
    return [...this.rotas];
  }

  getRotasPorVendedor(vendedorId: string): RotaProspeccao[] {
    return this.rotas.filter((r) => r.vendedorId === vendedorId);
  }

  /**
   * Otimiza uma rota usando algoritmo simples (nearest neighbor)
   */
  otimizarRota(pontos: Restaurante[], pontoPartida: Localizacao): Restaurante[] {
    if (pontos.length === 0) return [];

    const naoVisitados = [...pontos];
    const rota: Restaurante[] = [];
    let atual = pontoPartida;

    while (naoVisitados.length > 0) {
      // Encontra o ponto mais próximo
      let indiceMaisProximo = 0;
      let menorDistancia = this.calcularDistancia(atual, naoVisitados[0].localizacao);

      for (let i = 1; i < naoVisitados.length; i++) {
        const distancia = this.calcularDistancia(atual, naoVisitados[i].localizacao);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          indiceMaisProximo = i;
        }
      }

      // Adiciona à rota e remove dos não visitados
      const proximo = naoVisitados.splice(indiceMaisProximo, 1)[0];
      rota.push(proximo);
      atual = proximo.localizacao;
    }

    return rota;
  }

  /**
   * Persistência no LocalStorage
   */
  private salvarNoLocalStorage(): void {
    try {
      localStorage.setItem('restaurantes-data', JSON.stringify({
        restaurantes: this.restaurantes,
        regioes: this.regioes,
        rotas: this.rotas
      }));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  private carregarDoLocalStorage(): void {
    try {
      const data = localStorage.getItem('restaurantes-data');
      if (data) {
        const parsed = JSON.parse(data);
        this.restaurantes = parsed.restaurantes || [];
        this.regioes = parsed.regioes || [];
        this.rotas = parsed.rotas || [];
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
  }

  /**
   * Dados Mock para desenvolvimento
   */
  private carregarDadosMock(): void {
    // Primeiro tenta carregar do localStorage
    this.carregarDoLocalStorage();

    // Se não houver dados, carrega os mocks
    if (this.restaurantes.length === 0) {
      this.restaurantes = [
        {
          id: 'rest-1',
          nome: 'Pizzaria Bella Napoli',
          endereco: 'Rua das Flores, 123 - Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          localizacao: { latitude: -23.5505, longitude: -46.6333 },
          telefone: '(11) 3456-7890',
          email: 'contato@bellanapoli.com.br',
          tipoEstabelecimento: 'pizzaria',
          categoria: 'italiana',
          status: 'prospecto',
          potencial: 'alto',
          dataProspeccao: new Date().toISOString(),
          fonte: 'busca_automatica',
          horarioFuncionamento: '18:00 - 23:00'
        },
        {
          id: 'rest-2',
          nome: 'Sushi Master',
          endereco: 'Av. Paulista, 1000 - Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          localizacao: { latitude: -23.5629, longitude: -46.6544 },
          telefone: '(11) 3456-7891',
          tipoEstabelecimento: 'restaurante',
          categoria: 'japonesa',
          status: 'prospecto',
          potencial: 'muito_alto',
          dataProspeccao: new Date().toISOString(),
          fonte: 'busca_automatica',
          horarioFuncionamento: '11:30 - 14:30, 18:00 - 23:00'
        },
        {
          id: 'rest-3',
          nome: 'Burger House',
          endereco: 'Rua Augusta, 500 - Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01305-000',
          localizacao: { latitude: -23.5558, longitude: -46.6614 },
          telefone: '(11) 3456-7892',
          tipoEstabelecimento: 'hamburgueria',
          status: 'contatado',
          potencial: 'medio',
          dataProspeccao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          ultimoContato: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fonte: 'indicacao',
          observacoes: 'Interessado em produtos orgânicos'
        },
        {
          id: 'rest-4',
          nome: 'Cantina do Nonno',
          endereco: 'Rua Bela Cintra, 300 - Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
          localizacao: { latitude: -23.5590, longitude: -46.6598 },
          telefone: '(11) 3456-7893',
          tipoEstabelecimento: 'restaurante',
          categoria: 'italiana',
          status: 'cliente',
          potencial: 'alto',
          dataProspeccao: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          fonte: 'pesquisa_manual',
          ultimoContato: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'rest-5',
          nome: 'Churrascaria Gaúcha',
          endereco: 'Av. Rebouças, 2000 - Pinheiros',
          cidade: 'São Paulo',
          estado: 'SP',
          localizacao: { latitude: -23.5650, longitude: -46.6720 },
          telefone: '(11) 3456-7894',
          tipoEstabelecimento: 'churrascaria',
          categoria: 'brasileira',
          status: 'prospecto',
          potencial: 'muito_alto',
          dataProspeccao: new Date().toISOString(),
          fonte: 'busca_automatica',
          estimativaFaturamento: 150000,
          numeroFuncionarios: 25
        }
      ];

      this.salvarNoLocalStorage();
    }
  }

  /**
   * Busca restaurantes usando Google Places API
   */
  async buscarRestaurantesGoogle(
    localizacao: Localizacao,
    raioKm: number = 5,
    tipo: string = 'restaurant'
  ): Promise<Restaurante[]> {
    if (!googlePlacesService.isConfigured()) {
      console.warn('Google Places API não configurada. Use dados locais ou configure a API.');
      return this.buscarRestaurantesProximos(localizacao, raioKm);
    }

    try {
      const resultados = await googlePlacesService.buscarRestaurantesProximos(
        localizacao,
        raioKm * 1000, // Converter km para metros
        tipo
      );

      // Converter para Restaurante completo e adicionar IDs
      const restaurantes: Restaurante[] = resultados.map(r => ({
        id: `google-${r.googlePlaceId || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nome: r.nome!,
        endereco: r.endereco!,
        cidade: r.cidade!,
        estado: r.estado!,
        localizacao: r.localizacao!,
        tipoEstabelecimento: r.tipoEstabelecimento!,
        status: r.status!,
        potencial: r.potencial!,
        dataProspeccao: r.dataProspeccao!,
        fonte: 'busca_automatica',
        ...r
      }));

      // Salvar automaticamente os restaurantes encontrados
      for (const rest of restaurantes) {
        // Verificar se já existe pelo googlePlaceId
        const existe = this.restaurantes.find(r => r.googlePlaceId === rest.googlePlaceId);
        if (!existe) {
          this.restaurantes.push(rest);
        }
      }

      this.salvarNoLocalStorage();

      return restaurantes;
    } catch (error) {
      console.error('Erro ao buscar no Google Places:', error);
      // Fallback para busca local
      return this.buscarRestaurantesProximos(localizacao, raioKm);
    }
  }

  /**
   * Busca restaurantes por texto usando Google
   */
  async buscarRestaurantesPorTextoGoogle(
    query: string,
    localizacao?: Localizacao,
    raioKm?: number
  ): Promise<Restaurante[]> {
    if (!googlePlacesService.isConfigured()) {
      console.warn('Google Places API não configurada');
      return [];
    }

    try {
      const resultados = await googlePlacesService.buscarRestaurantesPorTexto(
        query,
        localizacao,
        raioKm ? raioKm * 1000 : undefined
      );

      const restaurantes: Restaurante[] = resultados.map(r => ({
        id: `google-${r.googlePlaceId || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nome: r.nome!,
        endereco: r.endereco!,
        cidade: r.cidade!,
        estado: r.estado!,
        localizacao: r.localizacao!,
        tipoEstabelecimento: r.tipoEstabelecimento!,
        status: r.status!,
        potencial: r.potencial!,
        dataProspeccao: r.dataProspeccao!,
        fonte: 'busca_automatica',
        ...r
      }));

      return restaurantes;
    } catch (error) {
      console.error('Erro ao buscar por texto no Google Places:', error);
      return [];
    }
  }

  /**
   * Enriquece um restaurante com dados do Google Places
   */
  async enriquecerComGoogle(restaurante: Restaurante): Promise<Restaurante> {
    if (!googlePlacesService.isConfigured()) {
      return restaurante;
    }

    try {
      return await googlePlacesService.enriquecerRestaurante(restaurante);
    } catch (error) {
      console.error('Erro ao enriquecer com Google:', error);
      return restaurante;
    }
  }

  /**
   * Consulta dados de CNPJ e enriquece o restaurante
   */
  async consultarCNPJ(restaurante: Restaurante, cnpj: string): Promise<Restaurante> {
    try {
      return await cnpjService.enriquecerComCNPJ(restaurante, cnpj);
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      return restaurante;
    }
  }

  /**
   * Enriquece completamente um restaurante (Google + CNPJ)
   */
  async enriquecerCompleto(
    restaurante: Restaurante,
    cnpj?: string
  ): Promise<Restaurante> {
    let restauranteEnriquecido = restaurante;

    // Enriquecer com Google
    if (googlePlacesService.isConfigured()) {
      restauranteEnriquecido = await this.enriquecerComGoogle(restauranteEnriquecido);
    }

    // Enriquecer com CNPJ se fornecido
    if (cnpj) {
      restauranteEnriquecido = await this.consultarCNPJ(restauranteEnriquecido, cnpj);
    }

    // Atualizar no armazenamento
    await this.atualizarRestaurante(restauranteEnriquecido.id, restauranteEnriquecido);

    return restauranteEnriquecido;
  }

  /**
   * Gera relatório de crédito para um restaurante
   */
  gerarRelatorioCredito(restaurante: Restaurante) {
    return cnpjService.gerarRelatorioCreditoSimplificado(restaurante);
  }

  /**
   * Busca unificada: tenta Google primeiro, depois local
   */
  async buscarUnificado(
    localizacao: Localizacao,
    raioKm: number = 5,
    filtros?: FiltrosBuscaRestaurante
  ): Promise<Restaurante[]> {
    let restaurantes: Restaurante[] = [];

    // Tentar Google Places primeiro
    if (googlePlacesService.isConfigured()) {
      try {
        restaurantes = await this.buscarRestaurantesGoogle(localizacao, raioKm);
      } catch (error) {
        console.warn('Falha ao buscar no Google, usando dados locais');
      }
    }

    // Complementar com dados locais
    const locais = await this.buscarRestaurantes({
      localizacao,
      raio: raioKm,
      ...filtros
    });

    // Mesclar resultados evitando duplicatas
    for (const local of locais) {
      const jaExiste = restaurantes.some(
        r => r.googlePlaceId && r.googlePlaceId === local.googlePlaceId
      );
      if (!jaExiste) {
        restaurantes.push(local);
      }
    }

    return restaurantes;
  }
}

// Singleton
export const restauranteService = new RestauranteService();
