# 📊 Dashboard Comercial

Dashboard comercial moderno e completo desenvolvido com **React**, **TypeScript**, **Tailwind CSS** e **Recharts**.

![Dashboard Preview](https://img.shields.io/badge/Status-Pronto-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Funcionalidades

### 📈 Indicadores (KPIs)
- **Vendas do Mês** - Valor total, variação percentual e quantidade de vendas
- **Ticket Médio** - Valor médio por venda com comparativo
- **Meta Mensal** - Percentual atingido da meta com visualização do progresso
- **Inadimplência** - Valor total inadimplente, quantidade de clientes e percentual
- **Vendas do Dia** - Acompanhamento diário com variação
- **Comissões Pendentes** - Valor total a pagar e quantidade de vendedores
- **Clientes Ativos** - Total de clientes ativos e novos no mês
- **Clientes Inativos** - Total de inativos e média de dias sem comprar

### 📊 Gráficos Interativos
- **Vendas por Período** - Gráfico de área com valor e quantidade de vendas
- **Vendas por Categoria** - Gráfico de pizza com distribuição percentual
- **Comissões por Vendedor** - Gráfico de barras comparativo

### 👥 Gestão de Vendedores
- Ranking de vendedores por performance
- Análise de meta atingida com indicadores visuais
- Comissões calculadas por vendedor
- Ticket médio e quantidade de vendas

### 🏢 Gestão de Clientes
- **Clientes Inativos** - Identificação de clientes sem comprar há mais tempo
  - Dias desde a última compra
  - Histórico de compras e ticket médio
  - Ações rápidas (contato, ver histórico)

- **Inadimplência** - Controle completo de clientes inadimplentes
  - Valor total inadimplente
  - Títulos vencidos com juros e multas
  - Classificação de risco (baixo, médio, alto)
  - Ações de cobrança e negociação

### 📦 Pedidos e Notas Fiscais
- **Pedidos Recentes**
  - Status do pedido (pendente, aprovado, faturado, etc.)
  - Formas de pagamento e condições
  - Data de entrega prevista

- **Notas Fiscais**
  - NF-e com série e número
  - Status de autorização (emitida, autorizada, etc.)
  - Valores de impostos e CFOP
  - Chave de acesso completa

### 🎨 Personalização
- **Tema Claro/Escuro** - Alternância instantânea entre temas
- **Filtros de Data** - Presets rápidos (hoje, 7 dias, 30 dias, 3 meses, 1 ano)
- **Customização de Widgets** - Mostrar/ocultar widgets conforme necessidade
- **Filtros Persistentes** - Configurações salvas no localStorage

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dashboard-comercial.git

# Entre na pasta
cd dashboard-comercial

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O dashboard estará disponível em `http://localhost:3000`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

## 🛠️ Tecnologias Utilizadas

- **React 18.2** - Framework JavaScript
- **TypeScript 5.2** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos responsivos
- **Zustand** - Gerenciamento de estado leve
- **Lucide React** - Ícones modernos
- **date-fns** - Manipulação de datas

## 📋 Estrutura de Pastas

```
src/
├── components/
│   ├── Layout/           # Layout principal, Header, Sidebar
│   ├── Dashboard/        # Componentes do dashboard (KPICard)
│   ├── Charts/           # Gráficos (Vendas, Categorias, Comissões)
│   ├── Tables/           # Tabelas (Vendedores, Clientes, Inadimplência)
│   └── Filters/          # Filtros e personalização
├── data/                 # Dados mockados para demonstração
├── pages/                # Páginas da aplicação
├── store/                # Gerenciamento de estado (Zustand)
├── types/                # Definições TypeScript
├── utils/                # Utilitários (formatação, etc.)
├── App.tsx               # Componente principal
├── main.tsx              # Entry point
└── index.css             # Estilos globais
```

## 📡 Integração com API/Backend

### Estrutura de Dados Necessária

O dashboard espera receber os dados no formato especificado em `src/types/index.ts`. Veja a documentação completa em [API_INTEGRATION.md](./API_INTEGRATION.md).

### Exemplo de Requisição

```typescript
// Em src/store/useDashboardStore.ts, substitua os dados mockados por:

const response = await fetch('/api/dashboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(get().filtros)
});

const data: DashboardData = await response.json();
set({ data, loading: false });
```

## 📊 Campos de Dados Necessários

### Cliente
```typescript
{
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  dataUltimaCompra: string;      // ISO 8601
  valorTotalCompras: number;
  quantidadeCompras: number;
  status: 'ativo' | 'inativo' | 'inadimplente';
  saldoDevedor: number;
  diasSemComprar: number;
  categoriаCliente: 'A' | 'B' | 'C' | 'D';
}
```

### Vendedor
```typescript
{
  id: string;
  nome: string;
  email: string;
  meta_mensal: number;
  percentualComissao: number;    // Ex: 5 para 5%
  status: 'ativo' | 'inativo';
}
```

### Pedido
```typescript
{
  id: string;
  numero: string;
  clienteId: string;
  vendedorId: string;
  data: string;                  // ISO 8601
  valor: number;
  desconto: number;
  valorFinal: number;
  status: 'pendente' | 'aprovado' | 'faturado' | 'cancelado';
  formaPagamento: string;
  condicaoPagamento: string;
}
```

### Nota Fiscal
```typescript
{
  id: string;
  numero: string;
  serie: string;
  pedidoId: string;
  clienteId: string;
  dataEmissao: string;           // ISO 8601
  valor: number;
  valorImposto: number;
  valorFinal: number;
  chaveAcesso: string;
  status: 'emitida' | 'autorizada' | 'cancelada';
  cfop: string;
}
```

### Título Financeiro (Inadimplência)
```typescript
{
  id: string;
  clienteId: string;
  dataVencimento: string;        // ISO 8601
  valor: number;
  saldo: number;
  juros: number;
  multa: number;
  status: 'aberto' | 'vencido' | 'pago';
  diasAtraso: number;
}
```

Veja todos os tipos em: `src/types/index.ts`

## 🎨 Personalização

### Cores do Tema

Edite o arquivo `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Personalize aqui
      }
    }
  }
}
```

### Adicionar Novos Widgets

1. Crie o componente em `src/components/`
2. Adicione-o em `src/pages/Dashboard.tsx`
3. Registre em `src/store/useDashboardStore.ts` no array `widgets`

## 📝 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # Linter (ESLint)
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através de [seu-email@exemplo.com](mailto:seu-email@exemplo.com)

---

**Desenvolvido com ❤️ usando React, TypeScript e Tailwind CSS**
