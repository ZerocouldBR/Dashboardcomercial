import axios from 'axios';
import type { Restaurante } from '../types';

/**
 * Serviço de Consulta de CNPJ
 *
 * APIs gratuitas disponíveis:
 * 1. ReceitaWS: https://receitaws.com.br (Gratuita, limitada)
 * 2. BrasilAPI: https://brasilapi.com.br (Gratuita, open source)
 * 3. Consulta CNP: https://www.consultacnpj.com (Gratuita com limitações)
 *
 * Para produção, considere APIs pagas:
 * - Serasa Experian
 * - BigData Corp
 * - Brasil

 API Premium
 */

interface CNPJReceitaWS {
  cnpj: string;
  nome: string; // Razão Social
  fantasia: string; // Nome Fantasia
  abertura: string; // Data de abertura
  situacao: string; // Situação cadastral
  tipo: string;
  porte: string;
  natureza_juridica: string;
  atividade_principal: {
    code: string;
    text: string;
  }[];
  atividades_secundarias: {
    code: string;
    text: string;
  }[];
  qsa: {
    nome: string;
    qual: string;
    pais_origem?: string;
    nome_rep_legal?: string;
    qual_rep_legal?: string;
  }[];
  logradouro: string;
  numero: string;
  complemento: string;
  municipio: string;
  bairro: string;
  uf: string;
  cep: string;
  email: string;
  telefone: string;
  efr: string;
  motivo_situacao: string;
  situacao_especial: string;
  data_situacao_especial: string;
  capital_social: string;
  ultima_atualizacao: string;
  status: string;
  billing?: {
    free: boolean;
    database: boolean;
  };
}

class CNPJService {
  private receitawsUrl = 'https://www.receitaws.com.br/v1/cnpj';
  private brasilApiUrl = 'https://brasilapi.com.br/api/cnpj/v1';

  /**
   * Formata CNPJ removendo caracteres especiais
   */
  private formatarCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  /**
   * Valida formato de CNPJ
   */
  validarCNPJ(cnpj: string): boolean {
    const cnpjLimpo = this.formatarCNPJ(cnpj);
    return cnpjLimpo.length === 14;
  }

  /**
   * Consulta CNPJ na ReceitaWS
   */
  async consultarCNPJReceitaWS(cnpj: string): Promise<Partial<Restaurante> | null> {
    const cnpjLimpo = this.formatarCNPJ(cnpj);

    if (!this.validarCNPJ(cnpjLimpo)) {
      throw new Error('CNPJ inválido');
    }

    try {
      const response = await axios.get<CNPJReceitaWS>(`${this.receitawsUrl}/${cnpjLimpo}`);

      const data = response.data;

      if (data.status === 'ERROR') {
        throw new Error('CNPJ não encontrado ou erro na consulta');
      }

      // Converter QSA (Quadro de Sócios e Administradores)
      const socios = data.qsa?.map(socio => ({
        nome: socio.nome,
        qualificacao: socio.qual,
        dataEntrada: undefined // ReceitaWS não retorna data de entrada
      })) || [];

      // Calcular potencial baseado em dados do CNPJ
      let potencial: 'baixo' | 'medio' | 'alto' | 'muito_alto' = 'medio';
      const capitalSocial = parseFloat(data.capital_social?.replace(/\D/g, '') || '0') / 100;

      if (capitalSocial > 500000) potencial = 'muito_alto';
      else if (capitalSocial > 100000) potencial = 'alto';
      else if (capitalSocial > 50000) potencial = 'medio';
      else potencial = 'baixo';

      // Motivos para abordagem
      const motivosAbordagem: string[] = [];
      if (data.situacao === 'ATIVA') {
        motivosAbordagem.push('Empresa em situação regular');
      }
      if (capitalSocial > 100000) {
        motivosAbordagem.push(`Capital social elevado: R$ ${this.formatarMoeda(capitalSocial)}`);
      }
      if (data.porte === 'DEMAIS') {
        motivosAbordagem.push('Empresa de médio/grande porte');
      }

      return {
        cnpj: this.formatarCNPJComMascara(cnpjLimpo),
        razaoSocial: data.nome,
        nomeFantasia: data.fantasia,
        dataAbertura: data.abertura,
        situacaoCadastral: data.situacao,
        atividadePrincipal: data.atividade_principal?.[0]?.text,
        capitalSocial,
        socios,
        potencial,
        motivosAbordagem,
        telefone: data.telefone,
        email: data.email,
        endereco: `${data.logradouro}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`,
        cidade: data.municipio,
        estado: data.uf,
        cep: data.cep
      };
    } catch (error: any) {
      console.error('Erro ao consultar CNPJ na ReceitaWS:', error);

      // Tentar API alternativa (BrasilAPI)
      try {
        return await this.consultarCNPJBrasilAPI(cnpjLimpo);
      } catch (error2) {
        console.error('Erro ao consultar em APIs alternativas');
        return null;
      }
    }
  }

  /**
   * Consulta CNPJ na BrasilAPI (alternativa)
   */
  async consultarCNPJBrasilAPI(cnpj: string): Promise<Partial<Restaurante> | null> {
    const cnpjLimpo = this.formatarCNPJ(cnpj);

    try {
      const response = await axios.get(`${this.brasilApiUrl}/${cnpjLimpo}`);
      const data = response.data;

      const socios = data.qsa?.map((socio: any) => ({
        nome: socio.nome_socio,
        qualificacao: socio.qualificacao_socio,
        cpf: socio.cpf_representante_legal,
        dataEntrada: socio.data_entrada_sociedade
      })) || [];

      const capitalSocial = data.capital_social || 0;

      return {
        cnpj: this.formatarCNPJComMascara(cnpjLimpo),
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        dataAbertura: data.data_inicio_atividade,
        situacaoCadastral: data.descricao_situacao_cadastral,
        atividadePrincipal: data.cnae_fiscal_descricao,
        capitalSocial,
        socios,
        email: data.ddd_telefone_1 ? `contato@${data.razao_social.toLowerCase().replace(/\s/g, '')}.com.br` : undefined
      };
    } catch (error) {
      console.error('Erro ao consultar CNPJ na BrasilAPI:', error);
      return null;
    }
  }

  /**
   * Busca CNPJ por nome da empresa
   */
  async buscarCNPJPorNome(nome: string): Promise<string[]> {
    // Esta funcionalidade requer API paga ou scraping
    // Por enquanto, retorna array vazio
    console.warn('Busca por nome requer API paga. Consulte Serasa ou BigData Corp');
    return [];
  }

  /**
   * Enriquece um restaurante com dados de CNPJ
   */
  async enriquecerComCNPJ(restaurante: Restaurante, cnpj: string): Promise<Restaurante> {
    try {
      const dadosCNPJ = await this.consultarCNPJReceitaWS(cnpj);

      if (dadosCNPJ) {
        return {
          ...restaurante,
          ...dadosCNPJ,
          // Manter dados originais se não vieram do CNPJ
          nome: restaurante.nome, // Manter nome original
          localizacao: restaurante.localizacao, // Manter localização
          // Atualizar score se os dados do CNPJ indicarem maior potencial
          scoreProspeccao: Math.max(
            restaurante.scoreProspeccao || 0,
            this.calcularScorePorCNPJ(dadosCNPJ)
          )
        };
      }

      return restaurante;
    } catch (error) {
      console.error('Erro ao enriquecer com CNPJ:', error);
      return restaurante;
    }
  }

  /**
   * Calcula score de prospecção baseado em dados do CNPJ
   */
  private calcularScorePorCNPJ(dados: Partial<Restaurante>): number {
    let score = 40; // Base

    // Capital social
    if (dados.capitalSocial) {
      if (dados.capitalSocial > 500000) score += 30;
      else if (dados.capitalSocial > 100000) score += 20;
      else if (dados.capitalSocial > 50000) score += 10;
    }

    // Situação cadastral
    if (dados.situacaoCadastral === 'ATIVA') {
      score += 20;
    } else {
      score -= 20;
    }

    // Tempo de mercado
    if (dados.dataAbertura) {
      const anos = this.calcularAnosAtividade(dados.dataAbertura);
      if (anos > 10) score += 10;
      else if (anos > 5) score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calcula anos de atividade da empresa
   */
  private calcularAnosAtividade(dataAbertura: string): number {
    try {
      // Formato: DD/MM/YYYY
      const partes = dataAbertura.split('/');
      const data = new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
      const agora = new Date();
      const diff = agora.getTime() - data.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    } catch (error) {
      return 0;
    }
  }

  /**
   * Formata CNPJ com máscara
   */
  private formatarCNPJComMascara(cnpj: string): string {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  /**
   * Formata valor monetário
   */
  private formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /**
   * Gera relatório de crédito simplificado (simulado)
   */
  gerarRelatorioCreditoSimplificado(restaurante: Restaurante): {
    score: number;
    classificacao: string;
    recomendacao: string;
    riscos: string[];
    oportunidades: string[];
  } {
    let score = 50;
    const riscos: string[] = [];
    const oportunidades: string[] = [];

    // Análise de capital social
    if (restaurante.capitalSocial) {
      if (restaurante.capitalSocial > 100000) {
        score += 20;
        oportunidades.push('Capital social robusto indica capacidade de investimento');
      } else if (restaurante.capitalSocial < 10000) {
        score -= 10;
        riscos.push('Capital social baixo pode indicar capacidade limitada de compra');
      }
    }

    // Análise de situação cadastral
    if (restaurante.situacaoCadastral !== 'ATIVA') {
      score -= 30;
      riscos.push('Situação cadastral irregular - RISCO ALTO');
    } else {
      score += 10;
    }

    // Análise de avaliações Google
    if (restaurante.avaliacaoGoogle) {
      if (restaurante.avaliacaoGoogle >= 4.0) {
        score += 15;
        oportunidades.push('Excelente reputação online');
      } else if (restaurante.avaliacaoGoogle < 3.0) {
        riscos.push('Avaliações baixas podem indicar problemas operacionais');
      }
    }

    // Classificação
    let classificacao = 'C - Risco Médio';
    if (score >= 80) classificacao = 'A - Excelente';
    else if (score >= 60) classificacao = 'B - Bom';
    else if (score < 40) classificacao = 'D - Alto Risco';

    // Recomendação
    let recomendacao = 'Prosseguir com cautela';
    if (score >= 70) recomendacao = 'Cliente prioritário - prosseguir com confiança';
    else if (score < 40) recomendacao = 'Não recomendado - alto risco';

    return {
      score,
      classificacao,
      recomendacao,
      riscos,
      oportunidades
    };
  }
}

// Singleton
export const cnpjService = new CNPJService();
