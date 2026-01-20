import axios from 'axios';
import type { Restaurante, Localizacao } from '../types';

/**
 * Serviço de Integração com Google Places API
 *
 * IMPORTANTE: Configure a variável de ambiente VITE_GOOGLE_PLACES_API_KEY
 * no arquivo .env na raiz do projeto:
 *
 * VITE_GOOGLE_PLACES_API_KEY=sua-chave-aqui
 *
 * Obtenha sua chave em: https://console.cloud.google.com/
 * Ative as APIs: Places API, Geocoding API
 */

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  business_status?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
  };
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }[];
}

class GooglePlacesService {
  private apiKey: string | undefined;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = (import.meta as any).env?.VITE_GOOGLE_PLACES_API_KEY;
  }

  /**
   * Verifica se a API está configurada
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Busca restaurantes próximos usando Google Places Nearby Search
   */
  async buscarRestaurantesProximos(
    localizacao: Localizacao,
    raioMetros: number = 5000,
    tipo: string = 'restaurant'
  ): Promise<Partial<Restaurante>[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API não configurada. Adicione VITE_GOOGLE_PLACES_API_KEY no .env');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, {
        params: {
          location: `${localizacao.latitude},${localizacao.longitude}`,
          radius: raioMetros,
          type: tipo,
          key: this.apiKey,
          language: 'pt-BR'
        }
      });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      const resultados = response.data.results || [];

      return resultados.map((place: GooglePlace) => this.converterGooglePlaceParaRestaurante(place));
    } catch (error: any) {
      console.error('Erro ao buscar no Google Places:', error);
      throw new Error(`Erro na busca: ${error.message}`);
    }
  }

  /**
   * Busca restaurantes por texto (query search)
   */
  async buscarRestaurantesPorTexto(
    query: string,
    localizacao?: Localizacao,
    raioMetros?: number
  ): Promise<Partial<Restaurante>[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API não configurada');
    }

    try {
      const params: any = {
        query: query + ' restaurante',
        key: this.apiKey,
        language: 'pt-BR'
      };

      if (localizacao && raioMetros) {
        params.location = `${localizacao.latitude},${localizacao.longitude}`;
        params.radius = raioMetros;
      }

      const response = await axios.get(`${this.baseUrl}/textsearch/json`, { params });

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      const resultados = response.data.results || [];

      return resultados.map((place: GooglePlace) => this.converterGooglePlaceParaRestaurante(place));
    } catch (error: any) {
      console.error('Erro ao buscar por texto no Google Places:', error);
      throw new Error(`Erro na busca: ${error.message}`);
    }
  }

  /**
   * Obtém detalhes completos de um restaurante
   */
  async obterDetalhesRestaurante(placeId: string): Promise<Partial<Restaurante>> {
    if (!this.apiKey) {
      throw new Error('Google Places API não configurada');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry,rating,user_ratings_total,price_level,formatted_phone_number,website,opening_hours,photos,reviews,business_status,types',
          key: this.apiKey,
          language: 'pt-BR'
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      return this.converterGooglePlaceParaRestaurante(response.data.result);
    } catch (error: any) {
      console.error('Erro ao obter detalhes no Google Places:', error);
      throw new Error(`Erro ao obter detalhes: ${error.message}`);
    }
  }

  /**
   * Obtém URL de uma foto do Google Places
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.apiKey) return '';
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Converte um resultado do Google Places para o formato Restaurante
   */
  private converterGooglePlaceParaRestaurante(place: GooglePlace): Partial<Restaurante> {
    // Extrair cidade e estado do endereço
    const enderecoPartes = place.formatted_address.split(',');
    const cidade = enderecoPartes[enderecoPartes.length - 2]?.trim() || '';
    const estadoCompleto = enderecoPartes[enderecoPartes.length - 1]?.trim() || '';

    // Extrair sigla do estado (ex: "São Paulo - SP" -> "SP")
    const estadoMatch = estadoCompleto.match(/([A-Z]{2})/);
    const estado = estadoMatch ? estadoMatch[1] : '';

    // Determinar tipo de estabelecimento
    let tipoEstabelecimento = 'restaurante';
    if (place.types.includes('cafe')) tipoEstabelecimento = 'cafeteria';
    else if (place.types.includes('bar')) tipoEstabelecimento = 'bar';
    else if (place.types.includes('bakery')) tipoEstabelecimento = 'padaria';

    // Montar URLs das fotos
    const fotos = place.photos?.slice(0, 5).map(photo =>
      this.getPhotoUrl(photo.photo_reference, 800)
    ) || [];

    // Calcular score de prospecção baseado em avaliações
    let scoreProspeccao = 50; // Base
    if (place.rating) {
      scoreProspeccao += (place.rating / 5) * 30; // Até +30 pela nota
    }
    if (place.user_ratings_total) {
      // Mais avaliações = mais movimento
      const bonusAvaliacoes = Math.min((place.user_ratings_total / 100) * 20, 20);
      scoreProspeccao += bonusAvaliacoes;
    }

    // Motivos para abordagem
    const motivosAbordagem: string[] = [];
    if (place.rating && place.rating >= 4.0) {
      motivosAbordagem.push(`Excelente avaliação (${place.rating.toFixed(1)}⭐)`);
    }
    if (place.user_ratings_total && place.user_ratings_total > 50) {
      motivosAbordagem.push(`Alto volume de clientes (${place.user_ratings_total} avaliações)`);
    }
    if (place.price_level && place.price_level >= 3) {
      motivosAbordagem.push('Estabelecimento premium');
    }
    if (place.website) {
      motivosAbordagem.push('Presença digital estabelecida');
    }

    const restaurante: Partial<Restaurante> = {
      nome: place.name,
      endereco: place.formatted_address.split(',')[0], // Primeira parte do endereço
      cidade,
      estado,
      localizacao: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      },
      telefone: place.formatted_phone_number,
      tipoEstabelecimento,
      status: 'prospecto',
      potencial: this.determinarPotencial(scoreProspeccao),
      dataProspeccao: new Date().toISOString(),
      fonte: 'busca_automatica',
      website: place.website,
      horarioFuncionamento: place.opening_hours?.weekday_text.join('; '),
      googlePlaceId: place.place_id,
      avaliacaoGoogle: place.rating,
      totalAvaliacoes: place.user_ratings_total,
      nivelPreco: place.price_level,
      fotos,
      scoreProspeccao: Math.round(scoreProspeccao),
      motivosAbordagem
    };

    return restaurante;
  }

  /**
   * Determina o potencial baseado no score
   */
  private determinarPotencial(score: number): 'baixo' | 'medio' | 'alto' | 'muito_alto' {
    if (score >= 80) return 'muito_alto';
    if (score >= 60) return 'alto';
    if (score >= 40) return 'medio';
    return 'baixo';
  }

  /**
   * Enriquece um restaurante existente com dados do Google
   */
  async enriquecerRestaurante(restaurante: Restaurante): Promise<Restaurante> {
    if (!this.apiKey) return restaurante;

    try {
      // Buscar por nome e localização
      const resultados = await this.buscarRestaurantesPorTexto(
        restaurante.nome,
        restaurante.localizacao,
        500 // Raio de 500m
      );

      if (resultados.length > 0) {
        const dadosGoogle = resultados[0];

        // Mesclar dados
        return {
          ...restaurante,
          googlePlaceId: dadosGoogle.googlePlaceId,
          avaliacaoGoogle: dadosGoogle.avaliacaoGoogle,
          totalAvaliacoes: dadosGoogle.totalAvaliacoes,
          nivelPreco: dadosGoogle.nivelPreco,
          fotos: dadosGoogle.fotos,
          website: dadosGoogle.website || restaurante.website,
          telefone: dadosGoogle.telefone || restaurante.telefone,
          scoreProspeccao: dadosGoogle.scoreProspeccao,
          motivosAbordagem: dadosGoogle.motivosAbordagem
        };
      }

      return restaurante;
    } catch (error) {
      console.error('Erro ao enriquecer restaurante:', error);
      return restaurante;
    }
  }
}

// Singleton
export const googlePlacesService = new GooglePlacesService();
