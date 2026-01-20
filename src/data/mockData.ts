import { DashboardData } from '../types';

/**
 * Dados de exemplo para demonstração da Dashboard
 * Em produção, estes dados virão da sua API/Backend
 */
export const mockDashboardData: DashboardData = {
  kpis: {
    vendasMes: {
      valor: 1547890.50,
      variacao: 12.5,
      quantidade: 342
    },
    vendasDia: {
      valor: 45230.00,
      variacao: -5.2
    },
    ticketMedio: {
      valor: 4525.85,
      variacao: 8.3
    },
    comissoesPendentes: {
      valor: 54367.20,
      quantidade: 28
    },
    inadimplencia: {
      valor: 87650.00,
      quantidade: 45,
      percentual: 5.67
    },
    metaMensal: {
      valor: 1800000.00,
      realizado: 1547890.50,
      percentual: 85.99
    },
    clientesAtivos: {
      total: 856,
      novos: 23
    },
    clientesInativos: {
      total: 124,
      diasSemComprar: 67
    }
  },

  vendasPorPeriodo: [
    { data: '2024-01', valor: 1234567, quantidade: 289 },
    { data: '2024-02', valor: 1456890, quantidade: 312 },
    { data: '2024-03', valor: 1678234, quantidade: 345 },
    { data: '2024-04', valor: 1345678, quantidade: 298 },
    { data: '2024-05', valor: 1567890, quantidade: 334 },
    { data: '2024-06', valor: 1789012, quantidade: 367 },
    { data: '2024-07', valor: 1890123, quantidade: 389 },
    { data: '2024-08', valor: 1678901, quantidade: 356 },
    { data: '2024-09', valor: 1456789, quantidade: 321 },
    { data: '2024-10', valor: 1567891, quantidade: 338 },
    { data: '2024-11', valor: 1547890.50, quantidade: 342 },
  ],

  vendasPorCategoria: [
    { categoria: 'Eletrônicos', valor: 456780, percentual: 29.5 },
    { categoria: 'Móveis', valor: 387650, percentual: 25.0 },
    { categoria: 'Eletrodomésticos', valor: 310560, percentual: 20.1 },
    { categoria: 'Decoração', valor: 232450, percentual: 15.0 },
    { categoria: 'Outros', valor: 160450, percentual: 10.4 },
  ],

  rankingVendedores: [
    {
      vendedor: {
        id: 'v1',
        nome: 'Carlos Silva',
        email: 'carlos@empresa.com',
        telefone: '(11) 98765-4321',
        dataAdmissao: '2020-01-15',
        status: 'ativo',
        meta_mensal: 250000,
        percentualComissao: 5,
        regiao: 'São Paulo'
      },
      valorVendas: 387650,
      quantidadeVendas: 89,
      ticketMedio: 4356.74,
      comissaoTotal: 19382.50,
      metaAtingida: 155.06,
      posicao: 1
    },
    {
      vendedor: {
        id: 'v2',
        nome: 'Ana Paula Costa',
        email: 'ana@empresa.com',
        telefone: '(11) 98765-1234',
        dataAdmissao: '2019-06-10',
        status: 'ativo',
        meta_mensal: 220000,
        percentualComissao: 5.5,
        regiao: 'Rio de Janeiro'
      },
      valorVendas: 342890,
      quantidadeVendas: 76,
      ticketMedio: 4511.71,
      comissaoTotal: 18858.95,
      metaAtingida: 155.86,
      posicao: 2
    },
    {
      vendedor: {
        id: 'v3',
        nome: 'Roberto Santos',
        email: 'roberto@empresa.com',
        telefone: '(11) 98765-5678',
        dataAdmissao: '2021-03-22',
        status: 'ativo',
        meta_mensal: 200000,
        percentualComissao: 4.5,
        regiao: 'Minas Gerais'
      },
      valorVendas: 298450,
      quantidadeVendas: 67,
      ticketMedio: 4454.48,
      comissaoTotal: 13430.25,
      metaAtingida: 149.23,
      posicao: 3
    },
    {
      vendedor: {
        id: 'v4',
        nome: 'Mariana Oliveira',
        email: 'mariana@empresa.com',
        telefone: '(11) 98765-9012',
        dataAdmissao: '2020-08-05',
        status: 'ativo',
        meta_mensal: 180000,
        percentualComissao: 5,
        regiao: 'São Paulo'
      },
      valorVendas: 265780,
      quantidadeVendas: 58,
      ticketMedio: 4582.41,
      comissaoTotal: 13289.00,
      metaAtingida: 147.66,
      posicao: 4
    },
    {
      vendedor: {
        id: 'v5',
        nome: 'Fernando Lima',
        email: 'fernando@empresa.com',
        telefone: '(11) 98765-3456',
        dataAdmissao: '2022-01-10',
        status: 'ativo',
        meta_mensal: 150000,
        percentualComissao: 4,
        regiao: 'Paraná'
      },
      valorVendas: 198670,
      quantidadeVendas: 45,
      ticketMedio: 4414.89,
      comissaoTotal: 7946.80,
      metaAtingida: 132.45,
      posicao: 5
    }
  ],

  topClientes: [
    {
      cliente: {
        id: 'c1',
        nome: 'Tech Solutions Ltda',
        cpfCnpj: '12.345.678/0001-90',
        email: 'contato@techsolutions.com',
        telefone: '(11) 3456-7890',
        endereco: {
          rua: 'Av. Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100'
        },
        dataUltimaCompra: '2024-11-20',
        valorTotalCompras: 456780,
        quantidadeCompras: 23,
        status: 'ativo',
        limitCredito: 500000,
        saldoDevedor: 45000,
        diasSemComprar: 3,
        categoriаCliente: 'A'
      },
      diasSemComprar: 3,
      valorMedioCompra: 19860.87,
      frequenciaCompra: 2.1,
      titulosEmAberto: 0,
      valorInadimplente: 0,
      risco: 'baixo'
    },
    {
      cliente: {
        id: 'c2',
        nome: 'Comercial Andrade S.A.',
        cpfCnpj: '23.456.789/0001-01',
        email: 'financeiro@andrade.com',
        telefone: '(11) 3456-1234',
        endereco: {
          rua: 'Rua Augusta',
          numero: '500',
          bairro: 'Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01305-000'
        },
        dataUltimaCompra: '2024-11-18',
        valorTotalCompras: 387650,
        quantidadeCompras: 19,
        status: 'ativo',
        limitCredito: 400000,
        saldoDevedor: 32000,
        diasSemComprar: 5,
        categoriаCliente: 'A'
      },
      diasSemComprar: 5,
      valorMedioCompra: 20402.63,
      frequenciaCompra: 1.7,
      titulosEmAberto: 0,
      valorInadimplente: 0,
      risco: 'baixo'
    },
    {
      cliente: {
        id: 'c3',
        nome: 'Distribuidora Master',
        cpfCnpj: '34.567.890/0001-12',
        email: 'compras@master.com',
        telefone: '(21) 3456-5678',
        endereco: {
          rua: 'Av. Rio Branco',
          numero: '200',
          bairro: 'Centro',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
          cep: '20040-001'
        },
        dataUltimaCompra: '2024-11-22',
        valorTotalCompras: 298450,
        quantidadeCompras: 16,
        status: 'ativo',
        limitCredito: 350000,
        saldoDevedor: 28000,
        diasSemComprar: 1,
        categoriаCliente: 'A'
      },
      diasSemComprar: 1,
      valorMedioCompra: 18653.13,
      frequenciaCompra: 1.5,
      titulosEmAberto: 0,
      valorInadimplente: 0,
      risco: 'baixo'
    }
  ],

  clientesInativos: [
    {
      cliente: {
        id: 'c10',
        nome: 'Comércio Silva & Cia',
        cpfCnpj: '45.678.901/0001-23',
        email: 'silva@comercio.com',
        telefone: '(11) 3456-9012',
        endereco: {
          rua: 'Rua das Flores',
          numero: '123',
          bairro: 'Jardim Paulista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        dataUltimaCompra: '2024-06-15',
        valorTotalCompras: 145890,
        quantidadeCompras: 8,
        status: 'inativo',
        limitCredito: 150000,
        saldoDevedor: 0,
        diasSemComprar: 159,
        categoriаCliente: 'B'
      },
      diasSemComprar: 159,
      valorMedioCompra: 18236.25,
      frequenciaCompra: 0.7,
      titulosEmAberto: 0,
      valorInadimplente: 0,
      risco: 'medio'
    },
    {
      cliente: {
        id: 'c11',
        nome: 'Loja Esperança',
        cpfCnpj: '56.789.012/0001-34',
        email: 'contato@esperanca.com',
        telefone: '(11) 3456-2345',
        endereco: {
          rua: 'Av. Ipiranga',
          numero: '456',
          bairro: 'República',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-000'
        },
        dataUltimaCompra: '2024-05-20',
        valorTotalCompras: 98760,
        quantidadeCompras: 6,
        status: 'inativo',
        limitCredito: 100000,
        saldoDevedor: 0,
        diasSemComprar: 185,
        categoriаCliente: 'C'
      },
      diasSemComprar: 185,
      valorMedioCompra: 16460.00,
      frequenciaCompra: 0.5,
      titulosEmAberto: 0,
      valorInadimplente: 0,
      risco: 'medio'
    }
  ],

  clientesInadimplentes: [
    {
      cliente: {
        id: 'c20',
        nome: 'Empresa Beta Ltda',
        cpfCnpj: '67.890.123/0001-45',
        email: 'beta@empresa.com',
        telefone: '(11) 3456-6789',
        endereco: {
          rua: 'Rua Vergueiro',
          numero: '789',
          bairro: 'Vila Mariana',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '04101-000'
        },
        dataUltimaCompra: '2024-09-10',
        valorTotalCompras: 234560,
        quantidadeCompras: 12,
        status: 'inadimplente',
        limitCredito: 200000,
        saldoDevedor: 45000,
        diasSemComprar: 74,
        categoriаCliente: 'B'
      },
      diasSemComprar: 74,
      valorMedioCompra: 19546.67,
      frequenciaCompra: 1.1,
      titulosEmAberto: 0,
      valorInadimplente: 45000,
      risco: 'alto'
    },
    {
      cliente: {
        id: 'c21',
        nome: 'Comércio Gama S.A.',
        cpfCnpj: '78.901.234/0001-56',
        email: 'gama@comercio.com',
        telefone: '(11) 3456-7891',
        endereco: {
          rua: 'Rua da Consolação',
          numero: '321',
          bairro: 'Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01301-000'
        },
        dataUltimaCompra: '2024-08-25',
        valorTotalCompras: 176890,
        quantidadeCompras: 9,
        status: 'inadimplente',
        limitCredito: 150000,
        saldoDevedor: 32650,
        diasSemComprar: 90,
        categoriаCliente: 'C'
      },
      diasSemComprar: 90,
      valorMedioCompra: 19654.44,
      frequenciaCompra: 0.9,
      titulosEmAberto: 0,
      valorInadimplente: 32650,
      risco: 'alto'
    }
  ],

  comissoesPorVendedor: [
    { vendedorId: 'v1', vendedorNome: 'Carlos Silva', valor: 19382.50 },
    { vendedorId: 'v2', vendedorNome: 'Ana Paula Costa', valor: 18858.95 },
    { vendedorId: 'v3', vendedorNome: 'Roberto Santos', valor: 13430.25 },
    { vendedorId: 'v4', vendedorNome: 'Mariana Oliveira', valor: 13289.00 },
    { vendedorId: 'v5', vendedorNome: 'Fernando Lima', valor: 7946.80 },
  ],

  pedidosRecentes: [
    {
      id: 'p1',
      numero: 'PED-2024-001234',
      clienteId: 'c1',
      vendedorId: 'v1',
      data: '2024-11-22T10:30:00',
      dataEntregaPrevista: '2024-11-25T00:00:00',
      valor: 45230.00,
      desconto: 1000.00,
      valorFinal: 44230.00,
      status: 'aprovado',
      formaPagamento: 'boleto',
      condicaoPagamento: '30/60 dias',
      itens: []
    },
    {
      id: 'p2',
      numero: 'PED-2024-001235',
      clienteId: 'c2',
      vendedorId: 'v2',
      data: '2024-11-22T14:15:00',
      dataEntregaPrevista: '2024-11-26T00:00:00',
      valor: 28750.00,
      desconto: 500.00,
      valorFinal: 28250.00,
      status: 'faturado',
      formaPagamento: 'pix',
      condicaoPagamento: 'À vista',
      itens: []
    }
  ],

  notasFiscaisRecentes: [
    {
      id: 'nf1',
      numero: '123456',
      serie: '1',
      pedidoId: 'p2',
      clienteId: 'c2',
      vendedorId: 'v2',
      dataEmissao: '2024-11-22T15:00:00',
      dataSaida: '2024-11-22T16:00:00',
      valor: 28250.00,
      valorImposto: 3816.00,
      valorFinal: 28250.00,
      chaveAcesso: '35241112345678000190550010001234561234567890',
      status: 'autorizada',
      tipo: 'venda',
      cfop: '5102',
      naturezaOperacao: 'Venda de mercadoria'
    }
  ],

  titulosVencidos: [
    {
      id: 't1',
      numero: 'BOL-001234',
      clienteId: 'c20',
      pedidoId: 'p100',
      notaFiscalId: 'nf100',
      dataEmissao: '2024-09-10',
      dataVencimento: '2024-10-10',
      valor: 25000.00,
      valorPago: 0,
      saldo: 25000.00,
      juros: 750.00,
      multa: 500.00,
      desconto: 0,
      status: 'vencido',
      diasAtraso: 43
    },
    {
      id: 't2',
      numero: 'BOL-001567',
      clienteId: 'c21',
      pedidoId: 'p102',
      notaFiscalId: 'nf102',
      dataEmissao: '2024-09-15',
      dataVencimento: '2024-10-15',
      valor: 32650.00,
      valorPago: 0,
      saldo: 32650.00,
      juros: 979.50,
      multa: 653.00,
      desconto: 0,
      status: 'vencido',
      diasAtraso: 38
    }
  ]
};
