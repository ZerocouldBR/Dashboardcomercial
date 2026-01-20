import OpenAI from 'openai';
import type {
  Restaurante,
  Localizacao,
  AnaliseProspeccao,
  RegiaoProspeccao
} from '../types';

/**
 * Serviço de Integração com OpenAI
 *
 * IMPORTANTE: Configure a variável de ambiente VITE_OPENAI_API_KEY
 * no arquivo .env na raiz do projeto:
 *
 * VITE_OPENAI_API_KEY=sk-your-api-key-here
 */

class OpenAIService {
  private client: OpenAI | null = null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;

    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true // Para uso no navegador
      });
    }
  }

  /**
   * Verifica se a API está configurada
   */
  isConfigured(): boolean {
    return !!this.client;
  }

  /**
   * Analisa uma localização e retorna insights sobre potencial de prospecção
   */
  async analisarLocalizacao(
    localizacao: Localizacao,
    cidade: string,
    bairro?: string
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API não configurada. Adicione VITE_OPENAI_API_KEY no .env');
    }

    const prompt = `
Analise a seguinte localização para prospecção de restaurantes:
- Cidade: ${cidade}
${bairro ? `- Bairro: ${bairro}` : ''}
- Coordenadas: ${localizacao.latitude}, ${localizacao.longitude}

Forneça uma análise detalhada sobre:
1. Características da região
2. Potencial para prospecção de restaurantes
3. Perfil típico de estabelecimentos na área
4. Recomendações de abordagem comercial
5. Melhor horário para visitas

Seja objetivo e prático, focando em insights acionáveis para uma equipe comercial.
    `;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de mercado e prospecção comercial para o setor de alimentação.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0]?.message?.content || 'Análise não disponível';
  }

  /**
   * Analisa o potencial de um restaurante específico
   */
  async analisarRestaurante(restaurante: Restaurante): Promise<AnaliseProspeccao> {
    if (!this.client) {
      throw new Error('OpenAI API não configurada. Adicione VITE_OPENAI_API_KEY no .env');
    }

    const prompt = `
Analise o potencial comercial do seguinte restaurante:
- Nome: ${restaurante.nome}
- Tipo: ${restaurante.tipoEstabelecimento}
${restaurante.categoria ? `- Categoria: ${restaurante.categoria}` : ''}
- Endereço: ${restaurante.endereco}, ${restaurante.cidade}/${restaurante.estado}
${restaurante.horarioFuncionamento ? `- Horário: ${restaurante.horarioFuncionamento}` : ''}

Forneça:
1. Pontuação de potencial (0-100)
2. 3-5 insights principais
3. Fatores positivos (2-4 itens)
4. Fatores negativos ou desafios (2-3 itens)
5. Recomendações de abordagem (2-3 itens)
6. Próximos passos sugeridos (2-3 ações)

Formato JSON:
{
  "pontuacao": number,
  "insights": string[],
  "fatoresPositivos": string[],
  "fatoresNegativos": string[],
  "recomendacoes": string[],
  "proximosPassos": string[]
}
    `;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em vendas B2B para o setor de alimentação. Retorne sempre em formato JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const resposta = completion.choices[0]?.message?.content || '{}';
    const analiseJson = JSON.parse(resposta);

    const analise: AnaliseProspeccao = {
      id: `analise-${Date.now()}`,
      restauranteId: restaurante.id,
      dataAnalise: new Date().toISOString(),
      tipoAnalise: 'potencial',
      prompt,
      resposta,
      pontuacao: analiseJson.pontuacao || 50,
      insights: analiseJson.insights || [],
      recomendacoes: analiseJson.recomendacoes || [],
      fatoresPositivos: analiseJson.fatoresPositivos || [],
      fatoresNegativos: analiseJson.fatoresNegativos || [],
      proximosPassos: analiseJson.proximosPassos || []
    };

    return analise;
  }

  /**
   * Analisa múltiplos restaurantes e prioriza por potencial
   */
  async priorizarProspectos(restaurantes: Restaurante[]): Promise<{
    ranking: Array<{ restaurante: Restaurante; pontuacao: number; motivo: string }>;
    resumo: string;
  }> {
    if (!this.client) {
      throw new Error('OpenAI API não configurada. Adicione VITE_OPENAI_API_KEY no .env');
    }

    const listaRestaurantes = restaurantes.map((r, idx) =>
      `${idx + 1}. ${r.nome} - ${r.tipoEstabelecimento} - ${r.endereco}`
    ).join('\n');

    const prompt = `
Analise e priorize os seguintes restaurantes para prospecção comercial:

${listaRestaurantes}

Considere:
- Tipo de estabelecimento
- Localização
- Potencial de volume de compras
- Facilidade de acesso

Retorne em JSON:
{
  "ranking": [
    {"indice": number, "pontuacao": number, "motivo": "texto curto"}
  ],
  "resumo": "análise geral em 2-3 frases"
}

Ordene do maior para o menor potencial.
    `;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em priorização de leads comerciais B2B. Retorne sempre JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const resposta = completion.choices[0]?.message?.content || '{}';
    const resultado = JSON.parse(resposta);

    const ranking = (resultado.ranking || []).map((item: any) => ({
      restaurante: restaurantes[item.indice - 1],
      pontuacao: item.pontuacao,
      motivo: item.motivo
    })).filter((item: any) => item.restaurante);

    return {
      ranking,
      resumo: resultado.resumo || 'Análise não disponível'
    };
  }

  /**
   * Sugere regiões para prospecção com base em dados históricos
   */
  async sugerirRegioes(
    cidade: string,
    estado: string,
    clientesAtuais?: Array<{ endereco: string; tipoEstabelecimento: string }>
  ): Promise<{
    regioes: Array<{ nome: string; motivo: string; prioridade: 'baixa' | 'media' | 'alta' }>;
    estrategia: string;
  }> {
    if (!this.client) {
      throw new Error('OpenAI API não configurada. Adicione VITE_OPENAI_API_KEY no .env');
    }

    let prompt = `
Sugira regiões para prospecção de restaurantes em:
- Cidade: ${cidade}
- Estado: ${estado}

`;

    if (clientesAtuais && clientesAtuais.length > 0) {
      prompt += `\nClientes atuais:\n`;
      prompt += clientesAtuais.map(c =>
        `- ${c.endereco} (${c.tipoEstabelecimento})`
      ).join('\n');
    }

    prompt += `\n
Retorne em JSON:
{
  "regioes": [
    {
      "nome": "nome do bairro/região",
      "motivo": "razão para prospectar aqui",
      "prioridade": "baixa|media|alta"
    }
  ],
  "estrategia": "estratégia geral de prospecção em 2-3 frases"
}

Sugira 5-7 regiões diferentes.
    `;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em expansão comercial e análise geográfica de mercado. Retorne sempre JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const resposta = completion.choices[0]?.message?.content || '{}';
    const resultado = JSON.parse(resposta);

    return {
      regioes: resultado.regioes || [],
      estrategia: resultado.estrategia || 'Estratégia não disponível'
    };
  }

  /**
   * Gera script de abordagem personalizado para um restaurante
   */
  async gerarScriptAbordagem(restaurante: Restaurante): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API não configurada. Adicione VITE_OPENAI_API_KEY no .env');
    }

    const prompt = `
Crie um script de abordagem comercial para:
- Restaurante: ${restaurante.nome}
- Tipo: ${restaurante.tipoEstabelecimento}
- Localização: ${restaurante.cidade}

O script deve incluir:
1. Abertura (apresentação)
2. Descoberta de necessidades (perguntas chave)
3. Apresentação de valor
4. Tratamento de objeções comuns
5. Fechamento e próximos passos

Seja natural e consultivo, não agressivo. Foque em entender as necessidades do cliente.
    `;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em vendas consultivas B2B com foco em relacionamento.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    return completion.choices[0]?.message?.content || 'Script não disponível';
  }

  /**
   * Analisa competição em uma região
   */
  async analisarCompetição(regiao: RegiaoProspeccao, restaurantes: Restaurante[]): Promise<{
    densidade: 'baixa' | 'media' | 'alta';
    concorrentes: Array<{ tipo: string; quantidade: number }>;
    oportunidades: string[];
    ameacas: string[];
    recomendacao: string;
  }> {
    if (!this.client) {
      throw new Error('OpenAI API não configurada. Adicione VITE_OPENAI_API_KEY no .env');
    }

    const distribuicao = restaurantes.reduce((acc, r) => {
      acc[r.tipoEstabelecimento] = (acc[r.tipoEstabelecimento] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `
Analise a competição na região:
- Nome: ${regiao.nome}
- Total de estabelecimentos: ${restaurantes.length}
- Distribuição:
${Object.entries(distribuicao).map(([tipo, qtd]) => `  • ${tipo}: ${qtd}`).join('\n')}

Retorne em JSON:
{
  "densidade": "baixa|media|alta",
  "concorrentes": [{"tipo": "string", "quantidade": number}],
  "oportunidades": ["texto"],
  "ameacas": ["texto"],
  "recomendacao": "texto"
}
    `;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista de mercado especializado em análise competitiva. Retorne sempre JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const resposta = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(resposta);
  }
}

// Singleton
export const openaiService = new OpenAIService();
