// ============================================
// TIPOS PARA DASHBOARD COMERCIAL
// ============================================

/**
 * Cliente - Dados completos do cliente
 */
export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataUltimaCompra: string; // ISO 8601 format
  valorTotalCompras: number;
  quantidadeCompras: number;
  status: 'ativo' | 'inativo' | 'inadimplente';
  limitCredito: number;
  saldoDevedor: number;
  diasSemComprar: number; // Calculado: dias desde última compra
  categoriаCliente: 'A' | 'B' | 'C' | 'D'; // Classificação ABC
}

/**
 * Vendedor - Dados do vendedor/representante
 */
export interface Vendedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto?: string;
  dataAdmissao: string;
  status: 'ativo' | 'inativo' | 'ferias';
  meta_mensal: number;
  percentualComissao: number; // Ex: 5 para 5%
  regiao?: string;
  supervisor?: string;
}

/**
 * Pedido - Pedido de venda
 */
export interface Pedido {
  id: string;
  numero: string;
  clienteId: string;
  vendedorId: string;
  data: string; // ISO 8601
  dataEntregaPrevista?: string;
  dataEntregaRealizada?: string;
  valor: number;
  desconto: number;
  valorFinal: number;
  status: 'pendente' | 'aprovado' | 'faturado' | 'cancelado' | 'entregue';
  formaPagamento: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia';
  condicaoPagamento: string; // Ex: "30/60/90 dias", "À vista"
  observacoes?: string;
  itens: ItemPedido[];
}

/**
 * Item do Pedido
 */
export interface ItemPedido {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  valorTotal: number;
  unidade: string; // Ex: "UN", "CX", "KG"
}

/**
 * Nota Fiscal
 */
export interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  pedidoId: string;
  clienteId: string;
  vendedorId: string;
  dataEmissao: string;
  dataSaida?: string;
  valor: number;
  valorImposto: number;
  valorFinal: number;
  chaveAcesso: string;
  status: 'emitida' | 'cancelada' | 'denegada' | 'autorizada';
  tipo: 'venda' | 'devolucao' | 'complementar';
  cfop: string;
  naturezaOperacao: string;
}

/**
 * Comissão - Comissões dos vendedores
 */
export interface Comissao {
  id: string;
  vendedorId: string;
  pedidoId?: string;
  notaFiscalId?: string;
  mesReferencia: string; // formato: "2024-01"
  valorBase: number; // Valor sobre o qual a comissão é calculada
  percentual: number;
  valorComissao: number;
  valorPago: number;
  dataPagamento?: string;
  status: 'pendente' | 'aprovada' | 'paga' | 'cancelada';
  observacoes?: string;
}

/**
 * Título Financeiro - Contas a receber/inadimplência
 */
export interface TituloFinanceiro {
  id: string;
  numero: string;
  clienteId: string;
  pedidoId?: string;
  notaFiscalId?: string;
  dataEmissao: string;
  dataVencimento: string;
  dataPagamento?: string;
  valor: number;
  valorPago: number;
  saldo: number;
  juros: number;
  multa: number;
  desconto: number;
  status: 'aberto' | 'vencido' | 'pago' | 'cancelado' | 'negociacao';
  diasAtraso: number; // Calculado
  formaPagamento?: string;
  observacoes?: string;
}

/**
 * Produto - Informações do produto (para análises)
 */
export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  marca?: string;
  unidade: string;
  precoVenda: number;
  precoCusto: number;
  estoque: number;
  ativo: boolean;
}

/**
 * KPIs - Indicadores chave de performance
 */
export interface KPIs {
  vendasMes: {
    valor: number;
    variacao: number; // Percentual em relação ao mês anterior
    quantidade: number;
  };
  vendasDia: {
    valor: number;
    variacao: number;
  };
  ticketMedio: {
    valor: number;
    variacao: number;
  };
  comissoesPendentes: {
    valor: number;
    quantidade: number;
  };
  inadimplencia: {
    valor: number;
    quantidade: number;
    percentual: number; // % em relação ao total a receber
  };
  metaMensal: {
    valor: number;
    realizado: number;
    percentual: number; // % da meta atingida
  };
  clientesAtivos: {
    total: number;
    novos: number; // Novos no mês
  };
  clientesInativos: {
    total: number;
    diasSemComprar: number; // Média de dias
  };
}

/**
 * Dados de Série Temporal - Para gráficos
 */
export interface DadosSeriesTemporal {
  data: string;
  valor: number;
  quantidade?: number;
  categoria?: string;
}

/**
 * Ranking de Vendedor
 */
export interface RankingVendedor {
  vendedor: Vendedor;
  valorVendas: number;
  quantidadeVendas: number;
  ticketMedio: number;
  comissaoTotal: number;
  metaAtingida: number; // Percentual
  posicao: number;
}

/**
 * Análise de Cliente
 */
export interface AnaliseCliente {
  cliente: Cliente;
  diasSemComprar: number;
  valorMedioCompra: number;
  frequenciaCompra: number; // Compras por mês
  ultimoPedido?: Pedido;
  titulosEmAberto: number;
  valorInadimplente: number;
  risco: 'baixo' | 'medio' | 'alto';
}

/**
 * Filtros da Dashboard
 */
export interface FiltrosDashboard {
  dataInicio: string;
  dataFim: string;
  vendedorId?: string;
  clienteId?: string;
  status?: string[];
  categoriaCliente?: ('A' | 'B' | 'C' | 'D')[];
  formaPagamento?: string[];
}

/**
 * Configuração de Personalização
 */
export interface ConfiguracaoDashboard {
  tema: 'light' | 'dark';
  widgets: {
    id: string;
    tipo: string;
    visivel: boolean;
    posicao: number;
    tamanho: 'small' | 'medium' | 'large';
  }[];
  filtrosDefault: FiltrosDashboard;
  notificacoes: {
    inadimplencia: boolean;
    metasVendedor: boolean;
    clientesInativos: boolean;
  };
}

/**
 * Resposta da API - Dados completos para Dashboard
 */
export interface DashboardData {
  kpis: KPIs;
  vendasPorPeriodo: DadosSeriesTemporal[];
  vendasPorCategoria: { categoria: string; valor: number; percentual: number }[];
  rankingVendedores: RankingVendedor[];
  topClientes: AnaliseCliente[];
  clientesInativos: AnaliseCliente[];
  clientesInadimplentes: AnaliseCliente[];
  comissoesPorVendedor: { vendedorId: string; vendedorNome: string; valor: number }[];
  pedidosRecentes: Pedido[];
  notasFiscaisRecentes: NotaFiscal[];
  titulosVencidos: TituloFinanceiro[];
}

// ============================================
// TIPOS PARA LOCALIZAÇÃO DE RESTAURANTES
// ============================================

/**
 * Localização Geográfica - Coordenadas
 */
export interface Localizacao {
  latitude: number;
  longitude: number;
}

/**
 * Restaurante - Dados do restaurante para prospecção
 */
export interface Restaurante {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  localizacao: Localizacao;
  telefone?: string;
  email?: string;
  tipoEstabelecimento: string; // Ex: 'restaurante', 'lanchonete', 'pizzaria', 'bar'
  categoria?: string; // Ex: 'italiana', 'japonesa', 'brasileira'
  status: 'prospecto' | 'contatado' | 'negociacao' | 'cliente' | 'recusado';
  potencial: 'baixo' | 'medio' | 'alto' | 'muito_alto';
  observacoes?: string;
  dataProspeccao: string;
  vendedorResponsavel?: string;
  ultimoContato?: string;
  proximoFollowUp?: string;
  fonte: 'busca_automatica' | 'indicacao' | 'pesquisa_manual' | 'analise_gpt';
  // Dados complementares
  horarioFuncionamento?: string;
  website?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
  };
  // Dados de análise
  estimativaFaturamento?: number;
  numeroFuncionarios?: number;
  tempoMercado?: number; // em anos
  distanciaFilial?: number; // em km
  // Dados do Google Places
  googlePlaceId?: string;
  avaliacaoGoogle?: number; // 1-5
  totalAvaliacoes?: number;
  nivelPreco?: number; // 1-4 ($ a $$$$)
  fotos?: string[]; // URLs das fotos
  // Dados de CNPJ
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  dataAbertura?: string;
  situacaoCadastral?: string;
  atividadePrincipal?: string;
  capitalSocial?: number;
  // Dados do proprietário/sócios
  socios?: {
    nome: string;
    cpf?: string;
    qualificacao: string; // Ex: "Administrador", "Sócio"
    dataEntrada?: string;
  }[];
  // Dados para abordagem
  scoreProspeccao?: number; // 0-100 calculado automaticamente
  motivosAbordagem?: string[]; // Razões para priorizar este cliente
}

/**
 * Região de Prospecção - Délimitação geográfica para busca
 */
export interface RegiaoProspeccao {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'circular' | 'poligonal' | 'administrativa'; // circular (raio), poligonal (pontos), administrativa (bairro/cidade)
  // Para região circular
  centro?: Localizacao;
  raio?: number; // em metros
  // Para região poligonal
  pontos?: Localizacao[];
  // Para região administrativa
  cidade?: string;
  estado?: string;
  bairros?: string[];
  // Metadados
  cor: string; // Cor no mapa
  vendedorResponsavel?: string;
  status: 'ativa' | 'pausada' | 'concluida';
  dataCriacao: string;
  totalProspectos: number;
  totalContatados: number;
  taxaConversao: number; // percentual
  prioridade: 'baixa' | 'media' | 'alta';
}

/**
 * Rota de Prospecção - Caminho otimizado entre restaurantes
 */
export interface RotaProspeccao {
  id: string;
  nome: string;
  descricao?: string;
  vendedorId: string;
  data: string;
  status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada';
  pontos: {
    restauranteId: string;
    ordem: number;
    horaChegadaPrevista?: string;
    horaChegadaReal?: string;
    duracao?: number; // em minutos
    visitado: boolean;
    resultado?: 'sucesso' | 'nao_atendeu' | 'remarcado' | 'nao_interessado';
    observacoes?: string;
  }[];
  distanciaTotal: number; // em km
  duracaoEstimada: number; // em minutos
  pontoPartida: Localizacao;
  pontoChegada: Localizacao;
  rotaOtimizada: Localizacao[]; // Array de pontos da rota
}

/**
 * Análise de Prospecção - Resultado da análise com IA
 */
export interface AnaliseProspeccao {
  id: string;
  restauranteId: string;
  dataAnalise: string;
  tipoAnalise: 'localizacao' | 'potencial' | 'competicao' | 'recomendacao';
  prompt: string;
  resposta: string;
  pontuacao?: number; // 0-100
  insights: string[];
  recomendacoes: string[];
  concorrentes?: {
    nome: string;
    distancia: number;
    tipo: string;
  }[];
  fatoresPositivos: string[];
  fatoresNegativos: string[];
  proximosPassos: string[];
}

/**
 * Filtros de Busca de Restaurantes
 */
export interface FiltrosBuscaRestaurante {
  localizacao?: Localizacao;
  raio?: number; // em km
  cidade?: string;
  estado?: string;
  bairro?: string;
  tipoEstabelecimento?: string[];
  categoria?: string[];
  status?: ('prospecto' | 'contatado' | 'negociacao' | 'cliente' | 'recusado')[];
  potencial?: ('baixo' | 'medio' | 'alto' | 'muito_alto')[];
  vendedorResponsavel?: string;
  regiao?: string;
  dataProspeccaoInicio?: string;
  dataProspeccaoFim?: string;
}

/**
 * Resultado de Busca com IA
 */
export interface ResultadoBuscaIA {
  query: string;
  localizacao: Localizacao;
  raio: number;
  restaurantesEncontrados: Restaurante[];
  analiseGeral: string;
  recomendacoes: string[];
  melhorRegiao: {
    nome: string;
    motivo: string;
    potencialScore: number;
  };
  estatisticas: {
    totalEncontrados: number;
    porTipo: { tipo: string; quantidade: number }[];
    distribuicaoPotencial: { potencial: string; quantidade: number }[];
  };
}
