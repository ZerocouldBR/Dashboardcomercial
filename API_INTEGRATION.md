# 📡 Guia de Integração com API

Este documento descreve **todos os campos necessários** para alimentar o Dashboard Comercial com dados do seu backend/API.

## 📋 Índice

- [Estrutura de Resposta](#estrutura-de-resposta)
- [Campos Obrigatórios por Entidade](#campos-obrigatórios-por-entidade)
  - [Cliente](#cliente)
  - [Vendedor](#vendedor)
  - [Pedido](#pedido)
  - [Nota Fiscal](#nota-fiscal)
  - [Comissão](#comissão)
  - [Título Financeiro](#título-financeiro)
  - [Produto](#produto)
- [KPIs e Agregações](#kpis-e-agregações)
- [Endpoint da API](#endpoint-da-api)
- [Exemplos de Implementação](#exemplos-de-implementação)

---

## Estrutura de Resposta

O Dashboard espera receber uma resposta JSON no seguinte formato:

```typescript
interface DashboardData {
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
```

---

## Campos Obrigatórios por Entidade

### Cliente

**Campos obrigatórios:**

```typescript
{
  // Identificação
  id: string;                    // ID único do cliente
  nome: string;                  // Nome/Razão Social
  cpfCnpj: string;              // CPF ou CNPJ
  email: string;                 // E-mail de contato
  telefone: string;              // Telefone de contato

  // Endereço
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;        // Opcional
    bairro: string;
    cidade: string;
    estado: string;              // UF (Ex: "SP", "RJ")
    cep: string;
  };

  // Dados de compra
  dataUltimaCompra: string;      // ISO 8601 (Ex: "2024-11-22T10:30:00")
  valorTotalCompras: number;     // Valor total de todas as compras
  quantidadeCompras: number;     // Quantidade total de pedidos

  // Status e financeiro
  status: 'ativo' | 'inativo' | 'inadimplente';
  limitCredito: number;          // Limite de crédito do cliente
  saldoDevedor: number;          // Valor atual devido
  diasSemComprar: number;        // Dias desde a última compra (calculado)

  // Classificação
  categoriаCliente: 'A' | 'B' | 'C' | 'D';  // Curva ABC
}
```

**Como calcular `diasSemComprar`:**
```javascript
const hoje = new Date();
const ultimaCompra = new Date(cliente.dataUltimaCompra);
const diffTime = Math.abs(hoje - ultimaCompra);
const diasSemComprar = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
```

**Como classificar `categoriаCliente` (Curva ABC):**
- **A**: Top 20% dos clientes que representam 80% do faturamento
- **B**: Próximos 30% dos clientes
- **C**: Próximos 40% dos clientes
- **D**: Últimos 10% dos clientes

---

### Vendedor

**Campos obrigatórios:**

```typescript
{
  // Identificação
  id: string;                    // ID único do vendedor
  nome: string;                  // Nome completo
  email: string;                 // E-mail corporativo
  telefone: string;              // Telefone de contato
  foto?: string;                 // URL da foto (opcional)

  // Dados funcionais
  dataAdmissao: string;          // ISO 8601
  status: 'ativo' | 'inativo' | 'ferias';

  // Metas e comissões
  meta_mensal: number;           // Meta em valor (R$)
  percentualComissao: number;    // Ex: 5 (para 5%)

  // Organização
  regiao?: string;               // Região de atuação (opcional)
  supervisor?: string;           // ID do supervisor (opcional)
}
```

---

### Pedido

**Campos obrigatórios:**

```typescript
{
  // Identificação
  id: string;                    // ID único do pedido
  numero: string;                // Número do pedido (Ex: "PED-2024-001234")
  clienteId: string;             // FK para Cliente
  vendedorId: string;            // FK para Vendedor

  // Datas
  data: string;                  // Data do pedido (ISO 8601)
  dataEntregaPrevista?: string;  // Data prevista de entrega (opcional)
  dataEntregaRealizada?: string; // Data real de entrega (opcional)

  // Valores
  valor: number;                 // Valor bruto
  desconto: number;              // Valor de desconto
  valorFinal: number;            // Valor final (valor - desconto)

  // Status e pagamento
  status: 'pendente' | 'aprovado' | 'faturado' | 'cancelado' | 'entregue';
  formaPagamento: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia';
  condicaoPagamento: string;     // Ex: "30/60/90 dias", "À vista"

  // Observações
  observacoes?: string;          // Opcional

  // Itens do pedido
  itens: ItemPedido[];           // Array de itens
}
```

**Item do Pedido:**

```typescript
{
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  valorTotal: number;            // (valorUnitario * quantidade) - desconto
  unidade: string;               // Ex: "UN", "CX", "KG"
}
```

---

### Nota Fiscal

**Campos obrigatórios:**

```typescript
{
  // Identificação
  id: string;                    // ID único da NF-e
  numero: string;                // Número da nota
  serie: string;                 // Série da nota
  pedidoId: string;              // FK para Pedido

  // Relacionamentos
  clienteId: string;             // FK para Cliente
  vendedorId: string;            // FK para Vendedor

  // Datas
  dataEmissao: string;           // Data de emissão (ISO 8601)
  dataSaida?: string;            // Data de saída (opcional)

  // Valores
  valor: number;                 // Valor dos produtos
  valorImposto: number;          // Valor total de impostos
  valorFinal: number;            // Valor total da nota

  // Dados fiscais
  chaveAcesso: string;           // Chave de acesso de 44 dígitos
  status: 'emitida' | 'cancelada' | 'denegada' | 'autorizada';
  tipo: 'venda' | 'devolucao' | 'complementar';
  cfop: string;                  // Código Fiscal de Operações (Ex: "5102")
  naturezaOperacao: string;      // Ex: "Venda de mercadoria"
}
```

---

### Comissão

**Campos obrigatórios:**

```typescript
{
  // Identificação
  id: string;
  vendedorId: string;            // FK para Vendedor
  pedidoId?: string;             // FK para Pedido (opcional)
  notaFiscalId?: string;         // FK para Nota Fiscal (opcional)

  // Período
  mesReferencia: string;         // Formato: "2024-11" (ano-mês)

  // Cálculo
  valorBase: number;             // Valor sobre o qual a comissão é calculada
  percentual: number;            // Percentual aplicado
  valorComissao: number;         // Valor da comissão (valorBase * percentual / 100)

  // Pagamento
  valorPago: number;             // Valor já pago
  dataPagamento?: string;        // Data do pagamento (ISO 8601, opcional)
  status: 'pendente' | 'aprovada' | 'paga' | 'cancelada';

  // Observações
  observacoes?: string;          // Opcional
}
```

**Como calcular comissão:**
```javascript
const valorComissao = (valorBase * percentual) / 100;
```

---

### Título Financeiro

**Campos obrigatórios para controle de inadimplência:**

```typescript
{
  // Identificação
  id: string;
  numero: string;                // Número do boleto/título
  clienteId: string;             // FK para Cliente
  pedidoId?: string;             // FK para Pedido (opcional)
  notaFiscalId?: string;         // FK para Nota Fiscal (opcional)

  // Datas
  dataEmissao: string;           // ISO 8601
  dataVencimento: string;        // ISO 8601
  dataPagamento?: string;        // ISO 8601 (opcional)

  // Valores
  valor: number;                 // Valor original
  valorPago: number;             // Valor já pago
  saldo: number;                 // Valor restante (valor - valorPago)
  juros: number;                 // Valor de juros
  multa: number;                 // Valor de multa
  desconto: number;              // Valor de desconto concedido

  // Status
  status: 'aberto' | 'vencido' | 'pago' | 'cancelado' | 'negociacao';
  diasAtraso: number;            // Dias em atraso (calculado)

  // Pagamento
  formaPagamento?: string;       // Forma de pagamento (opcional)
  observacoes?: string;          // Opcional
}
```

**Como calcular `diasAtraso`:**
```javascript
const hoje = new Date();
const vencimento = new Date(titulo.dataVencimento);

if (titulo.status === 'pago' || hoje <= vencimento) {
  diasAtraso = 0;
} else {
  const diffTime = Math.abs(hoje - vencimento);
  diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

---

### Produto

**Campos obrigatórios (para análises):**

```typescript
{
  id: string;
  codigo: string;                // Código interno/SKU
  nome: string;
  descricao?: string;            // Opcional
  categoria: string;             // Categoria do produto
  marca?: string;                // Opcional
  unidade: string;               // Ex: "UN", "CX", "KG"
  precoVenda: number;
  precoCusto: number;
  estoque: number;
  ativo: boolean;
}
```

---

## KPIs e Agregações

O Dashboard precisa receber os seguintes KPIs **pré-calculados** pela API:

```typescript
interface KPIs {
  // Vendas do Mês
  vendasMes: {
    valor: number;               // Soma de valorFinal dos pedidos do mês
    variacao: number;            // % comparado ao mês anterior
    quantidade: number;          // Quantidade de pedidos
  };

  // Vendas do Dia
  vendasDia: {
    valor: number;               // Soma de valorFinal dos pedidos do dia
    variacao: number;            // % comparado ao dia anterior
  };

  // Ticket Médio
  ticketMedio: {
    valor: number;               // valorTotal / quantidadePedidos
    variacao: number;            // % comparado ao mês anterior
  };

  // Comissões Pendentes
  comissoesPendentes: {
    valor: number;               // Soma de valorComissao com status 'pendente'
    quantidade: number;          // Quantidade de vendedores com comissão pendente
  };

  // Inadimplência
  inadimplencia: {
    valor: number;               // Soma de saldo de títulos vencidos
    quantidade: number;          // Quantidade de clientes inadimplentes
    percentual: number;          // % em relação ao total a receber
  };

  // Meta Mensal
  metaMensal: {
    valor: number;               // Meta total do mês (soma das metas dos vendedores)
    realizado: number;           // Valor realizado no mês
    percentual: number;          // (realizado / valor) * 100
  };

  // Clientes Ativos
  clientesAtivos: {
    total: number;               // Clientes com status 'ativo'
    novos: number;               // Clientes com primeira compra no mês
  };

  // Clientes Inativos
  clientesInativos: {
    total: number;               // Clientes com status 'inativo'
    diasSemComprar: number;      // Média de diasSemComprar
  };
}
```

### Como calcular Variação Percentual

```javascript
const variacaoPercentual = ((valorAtual - valorAnterior) / valorAnterior) * 100;
```

Exemplo:
- Vendas mês atual: R$ 1.547.890
- Vendas mês anterior: R$ 1.375.234
- Variação: ((1547890 - 1375234) / 1375234) * 100 = **12.5%**

---

## Endpoint da API

### Requisição

**POST** `/api/dashboard`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "dataInicio": "2024-11-01",
  "dataFim": "2024-11-30",
  "vendedorId": "v1",           // Opcional - filtrar por vendedor
  "clienteId": "c1",             // Opcional - filtrar por cliente
  "status": ["aprovado", "faturado"],  // Opcional - filtrar por status
  "categoriaCliente": ["A", "B"]       // Opcional - filtrar por categoria
}
```

### Resposta

**200 OK**

```json
{
  "kpis": { ... },
  "vendasPorPeriodo": [ ... ],
  "vendasPorCategoria": [ ... ],
  "rankingVendedores": [ ... ],
  "topClientes": [ ... ],
  "clientesInativos": [ ... ],
  "clientesInadimplentes": [ ... ],
  "comissoesPorVendedor": [ ... ],
  "pedidosRecentes": [ ... ],
  "notasFiscaisRecentes": [ ... ],
  "titulosVencidos": [ ... ]
}
```

---

## Exemplos de Implementação

### Exemplo em Node.js/Express

```javascript
// routes/dashboard.js
const express = require('express');
const router = express.Router();

router.post('/dashboard', async (req, res) => {
  const { dataInicio, dataFim, vendedorId, clienteId } = req.body;

  try {
    // 1. Buscar dados do banco
    const pedidos = await Pedido.find({
      data: { $gte: dataInicio, $lte: dataFim },
      ...(vendedorId && { vendedorId }),
      ...(clienteId && { clienteId })
    });

    const clientes = await Cliente.find();
    const vendedores = await Vendedor.find();
    const notas = await NotaFiscal.find({ dataEmissao: { $gte: dataInicio, $lte: dataFim } });
    const titulos = await Titulo.find({ status: 'vencido' });

    // 2. Calcular KPIs
    const kpis = calcularKPIs(pedidos, clientes, titulos);

    // 3. Agrupar vendas por período
    const vendasPorPeriodo = agruparVendasPorPeriodo(pedidos);

    // 4. Agrupar vendas por categoria
    const vendasPorCategoria = agruparVendasPorCategoria(pedidos);

    // 5. Calcular ranking de vendedores
    const rankingVendedores = calcularRankingVendedores(vendedores, pedidos);

    // 6. Identificar clientes inativos
    const clientesInativos = identificarClientesInativos(clientes);

    // 7. Identificar inadimplentes
    const clientesInadimplentes = identificarInadimplentes(clientes, titulos);

    // 8. Montar resposta
    const dashboard = {
      kpis,
      vendasPorPeriodo,
      vendasPorCategoria,
      rankingVendedores,
      topClientes: clientes.slice(0, 10),
      clientesInativos,
      clientesInadimplentes,
      comissoesPorVendedor: calcularComissoes(vendedores, pedidos),
      pedidosRecentes: pedidos.slice(0, 10),
      notasFiscaisRecentes: notas.slice(0, 10),
      titulosVencidos: titulos
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Exemplo em Python/Django

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Pedido, Cliente, Vendedor, NotaFiscal, Titulo
import json

@csrf_exempt
def dashboard_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data_inicio = data.get('dataInicio')
        data_fim = data.get('dataFim')

        # Buscar dados
        pedidos = Pedido.objects.filter(
            data__gte=data_inicio,
            data__lte=data_fim
        )

        clientes = Cliente.objects.all()
        vendedores = Vendedor.objects.all()

        # Calcular KPIs
        kpis = calcular_kpis(pedidos, clientes)

        # Montar resposta
        dashboard = {
            'kpis': kpis,
            'vendasPorPeriodo': agrupar_vendas_por_periodo(pedidos),
            'rankingVendedores': calcular_ranking_vendedores(vendedores, pedidos),
            # ... outros dados
        }

        return JsonResponse(dashboard)
```

### Exemplo em PHP/Laravel

```php
// routes/api.php
Route::post('/dashboard', [DashboardController::class, 'getData']);

// DashboardController.php
class DashboardController extends Controller
{
    public function getData(Request $request)
    {
        $dataInicio = $request->input('dataInicio');
        $dataFim = $request->input('dataFim');

        // Buscar dados
        $pedidos = Pedido::whereBetween('data', [$dataInicio, $dataFim])->get();
        $clientes = Cliente::all();
        $vendedores = Vendedor::all();

        // Calcular KPIs
        $kpis = $this->calcularKPIs($pedidos, $clientes);

        // Montar resposta
        $dashboard = [
            'kpis' => $kpis,
            'vendasPorPeriodo' => $this->agruparVendasPorPeriodo($pedidos),
            'rankingVendedores' => $this->calcularRankingVendedores($vendedores, $pedidos),
            // ... outros dados
        ];

        return response()->json($dashboard);
    }
}
```

---

## Campos Opcionais vs Obrigatórios

### ✅ Campos Obrigatórios

Estes campos **DEVEM** estar presentes para o Dashboard funcionar corretamente:

- Todos os IDs (`id`, `clienteId`, `vendedorId`, etc.)
- Valores monetários (`valor`, `desconto`, `valorFinal`, etc.)
- Datas principais (`data`, `dataEmissao`, `dataVencimento`)
- Status de entidades (`status`)
- Campos de identificação (`nome`, `cpfCnpj`, `numero`)

### ⚠️ Campos Opcionais

Estes campos podem ser omitidos ou retornar `null`:

- `complemento` em endereços
- `foto` de vendedores
- `observacoes` em pedidos e comissões
- `dataPagamento` quando ainda não pago
- `dataEntregaRealizada` quando ainda não entregue
- `regiao` e `supervisor` de vendedores

---

## Validações Recomendadas

### No Backend

```javascript
// Validar formato de data (ISO 8601)
const isValidDate = (dateString) => {
  return !isNaN(Date.parse(dateString));
};

// Validar CPF/CNPJ
const isValidCpfCnpj = (value) => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 11 || cleaned.length === 14;
};

// Validar valores monetários
const isValidMoney = (value) => {
  return typeof value === 'number' && value >= 0;
};

// Validar status
const validStatuses = ['pendente', 'aprovado', 'faturado', 'cancelado'];
const isValidStatus = (status) => {
  return validStatuses.includes(status);
};
```

---

## Considerações de Performance

### Índices de Banco de Dados

Crie índices nas seguintes colunas para melhor performance:

```sql
-- Pedidos
CREATE INDEX idx_pedidos_data ON pedidos(data);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_vendedor ON pedidos(vendedor_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);

-- Clientes
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_ultima_compra ON clientes(data_ultima_compra);

-- Títulos
CREATE INDEX idx_titulos_vencimento ON titulos(data_vencimento);
CREATE INDEX idx_titulos_status ON titulos(status);
CREATE INDEX idx_titulos_cliente ON titulos(cliente_id);
```

### Cache

Considere implementar cache para reduzir consultas ao banco:

```javascript
// Usando Redis
const redis = require('redis');
const client = redis.createClient();

const CACHE_TTL = 300; // 5 minutos

async function getDashboardData(filtros) {
  const cacheKey = `dashboard:${JSON.stringify(filtros)}`;

  // Tentar buscar do cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Buscar do banco
  const data = await buscarDadosDoBanco(filtros);

  // Salvar no cache
  await client.setex(cacheKey, CACHE_TTL, JSON.stringify(data));

  return data;
}
```

---

## Troubleshooting

### Problema: Dados não aparecem no Dashboard

**Verificar:**
1. Formato das datas (deve ser ISO 8601: `"2024-11-22T10:30:00"`)
2. Tipos de dados (números devem ser `number`, não `string`)
3. IDs estão corretos e relacionamentos existem
4. Status são válidos conforme enum definido

### Problema: Gráficos não renderizam

**Verificar:**
1. Array `vendasPorPeriodo` tem dados
2. Valores são números válidos (não `NaN` ou `null`)
3. Propriedades `data` e `valor` estão presentes

### Problema: Percentuais incorretos

**Verificar:**
1. Cálculo de variação: `((atual - anterior) / anterior) * 100`
2. Meta atingida: `(realizado / meta) * 100`
3. Divisão por zero (se anterior = 0, retornar 0)

---

## Checklist de Implementação

- [ ] Endpoint `/api/dashboard` criado
- [ ] Autenticação/autorização implementada
- [ ] Filtros por data funcionando
- [ ] KPIs calculados corretamente
- [ ] Agregações por período implementadas
- [ ] Ranking de vendedores ordenado
- [ ] Clientes inativos identificados (diasSemComprar > 90)
- [ ] Inadimplência calculada corretamente
- [ ] Validações de dados implementadas
- [ ] Índices de banco criados
- [ ] Cache implementado (opcional)
- [ ] Testes unitários criados
- [ ] Documentação atualizada

---

## Suporte

Para dúvidas sobre a integração:

1. Consulte o arquivo `src/types/index.ts` para tipos completos
2. Veja exemplos em `src/data/mockData.ts`
3. Teste com dados mockados antes de integrar API real

---

**Última atualização:** 23/11/2024
