# Localizador de Restaurantes - Documentação

## 📍 Visão Geral

O **Localizador de Restaurantes** é uma funcionalidade avançada do Dashboard Comercial que permite à equipe de vendas:

- 🗺️ **Visualizar restaurantes em mapa interativo**
- 🔍 **Buscar e filtrar estabelecimentos por localização**
- 🤖 **Analisar potencial de prospecção com IA (OpenAI GPT)**
- 📍 **Gerenciar regiões de prospecção (réguas)**
- 🚗 **Planejar rotas otimizadas de visitas**
- 📊 **Acompanhar status e histórico de contatos**

---

## 🚀 Como Usar

### 1. Acessando o Localizador

No menu lateral do Dashboard, clique em **"Localizador"** (ícone de mapa).

### 2. Buscando Restaurantes

1. **Digite a localização** (cidade, bairro ou endereço) no campo de busca
2. **Selecione o raio** de busca (1 a 50 km)
3. Clique em **"Buscar"**
4. Os resultados aparecerão no mapa e na lista lateral

#### Filtros Avançados

Clique no ícone de **filtro** para acessar opções avançadas:

- **Tipo de Estabelecimento**: restaurante, pizzaria, hamburgueria, lanchonete, etc.
- **Status**: prospecto, contatado, em negociação, cliente, recusado
- **Potencial**: baixo, médio, alto, muito alto
- **Localização Específica**: cidade, estado, bairro

### 3. Visualizações

#### 🗺️ Mapa

- **Marcadores Coloridos** por status:
  - 🔵 Azul: Contatado
  - 🟢 Verde: Cliente
  - 🟡 Amarelo: Em Negociação
  - ⚫ Cinza: Prospecto
  - 🔴 Vermelho: Recusado

- **Clique em um marcador** para ver detalhes do restaurante
- **Zoom e navegação** com mouse/touch
- **Legenda** no canto superior direito

#### 📋 Lista

- Visualização em lista com todos os detalhes
- Clique em um item para centralizar no mapa
- Informações completas: endereço, telefone, horário, distância

#### 📍 Regiões

Gerencie áreas de prospecção (réguas):

**Criar Nova Região:**
1. Clique em "Nova Região"
2. Preencha:
   - Nome (ex: "Centro SP")
   - Tipo: Circular ou Administrativa
   - Coordenadas/Cidade
   - Raio (para circular)
   - Cor e prioridade
3. Salvar

**Tipos de Região:**
- **Circular**: Define centro + raio em metros
- **Administrativa**: Define por cidade/bairro

**Benefícios:**
- Organize territorialmente
- Acompanhe métricas (prospectos, conversão)
- Atribua vendedores responsáveis
- Visualize no mapa com cores

#### 🚗 Rotas

Planeje visitas otimizadas:

**Criar Rota:**
1. Acesse a aba "Rotas"
2. Preencha dados básicos:
   - Nome da rota
   - Vendedor responsável
   - Data
3. Selecione restaurantes na lista (checkbox)
4. Clique em "Otimizar Rota"
5. Revise a sequência otimizada
6. Clique em "Criar Rota"

**A rota otimizada mostra:**
- ✅ Sequência de visitas (algoritmo nearest neighbor)
- 📏 Distância total em km
- ⏱️ Duração estimada (deslocamento + 30min por visita)
- 📍 Pontos no mapa com linha de rota

---

## 🤖 Análise com Inteligência Artificial

### Configuração

Para usar a análise com IA, configure a API do OpenAI:

1. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_OPENAI_API_KEY=sk-sua-chave-aqui
```

2. Obtenha sua chave em: https://platform.openai.com/api-keys

### Funcionalidades de IA

#### 🎯 Priorização de Prospectos

Clique em **"Analisar com IA"** para:

- Receber ranking de priorização automático
- Análise de potencial de cada restaurante (0-100)
- Motivos e recomendações personalizadas
- Insights sobre melhor abordagem

#### 🧠 Análises Disponíveis

O sistema pode fornecer:

1. **Análise de Localização**: Potencial da região
2. **Análise de Restaurante**: Score individual
3. **Análise de Competição**: Densidade e oportunidades
4. **Sugestões de Regiões**: Onde prospectar
5. **Scripts de Abordagem**: Textos personalizados

---

## 📊 Gestão de Prospectos

### Status do Restaurante

Cada restaurante possui um status no funil:

1. **Prospecto** (inicial): Identificado, não contatado
2. **Contatado**: Primeira abordagem realizada
3. **Em Negociação**: Demonstrando interesse
4. **Cliente**: Convertido
5. **Recusado**: Sem interesse no momento

### Classificação de Potencial

- **Baixo**: Menor volume/faturamento esperado
- **Médio**: Potencial moderado
- **Alto**: Grande volume de compras
- **Muito Alto**: Excelente oportunidade

### Informações Rastreadas

- 📅 Data de prospecção
- 📞 Último contato
- 🔔 Próximo follow-up
- 👤 Vendedor responsável
- 📝 Observações
- 💰 Estimativa de faturamento
- 👥 Número de funcionários

---

## 🗺️ Sobre os Mapas

### Tecnologia

- **Leaflet**: Biblioteca de mapas interativos
- **OpenStreetMap**: Mapas gratuitos e atualizados
- **Nominatim**: Geocoding (coordenadas ↔ endereços)

### Funcionalidades do Mapa

- ✅ Zoom e pan (arrastar)
- ✅ Marcadores customizados por tipo/status
- ✅ Popups informativos ao clicar
- ✅ Círculos de região
- ✅ Linhas de rota
- ✅ Legenda interativa
- ✅ Responsivo (mobile-friendly)

### Geocoding

O sistema converte automaticamente:
- **Endereços → Coordenadas** para plotar no mapa
- **Coordenadas → Endereços** ao clicar no mapa

---

## 📐 Cálculo de Distâncias

Usa a **Fórmula de Haversine** para calcular distâncias precisas entre dois pontos geográficos.

**Precisão**: ~99.5% para distâncias até 100 km

---

## 🔄 Otimização de Rotas

**Algoritmo**: Nearest Neighbor (vizinho mais próximo)

**Como funciona:**
1. Começa no ponto de partida
2. Visita o restaurante mais próximo não visitado
3. Repete até visitar todos
4. Calcula distância total e duração

**Estimativas:**
- Velocidade média: 40 km/h (trânsito urbano)
- Tempo por visita: 30 minutos
- Inclui tempo de deslocamento + visitas

---

## 💾 Armazenamento de Dados

### Local Storage

Os dados são salvos localmente no navegador:

- ✅ Restaurantes cadastrados
- ✅ Regiões criadas
- ✅ Rotas planejadas
- ✅ Filtros e preferências

**Chave**: `restaurantes-data`

### Dados Mock

Para desenvolvimento, o sistema inclui 5 restaurantes de exemplo em São Paulo.

---

## 🔌 Integração com APIs Externas

### APIs Utilizadas

1. **OpenStreetMap Nominatim**
   - Geocoding gratuito
   - URL: `https://nominatim.openstreetmap.org`
   - Limite: ~1 req/segundo

2. **OpenAI GPT-4**
   - Análises inteligentes
   - Requer API Key (paga)
   - Modelo: `gpt-4`

### Possíveis Integrações Futuras

- Google Places API (busca de estabelecimentos)
- Google Maps Directions API (rotas avançadas)
- WhatsApp Business API (envio de mensagens)
- CRM (integração com sistema existente)

---

## 🎨 Personalização

### Cores das Regiões

Ao criar uma região, escolha uma cor para destacá-la no mapa.

**Sugestão de cores:**
- 🔵 Azul: Região de alta prioridade
- 🟢 Verde: Região ativa/produtiva
- 🟡 Amarelo: Região em análise
- 🔴 Vermelho: Região com desafios

### Ícones dos Marcadores

Cada tipo de estabelecimento tem emoji próprio:
- 🍕 Pizzaria
- 🍔 Hamburgueria
- 🍽️ Restaurante
- 🥩 Churrascaria
- 🥪 Lanchonete
- 🍺 Bar
- ☕ Cafeteria
- 🥖 Padaria

---

## ⚙️ Arquitetura Técnica

### Estrutura de Arquivos

```
src/
├── components/
│   └── Maps/
│       ├── MapaRestaurantes.tsx       # Componente principal do mapa
│       ├── FiltrosRestaurantes.tsx    # Busca e filtros
│       ├── ListaRestaurantes.tsx      # Visualização em lista
│       ├── GerenciadorRegioes.tsx     # CRUD de regiões
│       └── PlanejadorRotas.tsx        # Criação de rotas
├── pages/
│   └── LocalizadorRestaurantes.tsx    # Página principal
├── services/
│   ├── openaiService.ts               # Integração OpenAI
│   └── restauranteService.ts          # Lógica de negócio
└── types/
    └── index.ts                       # Tipos TypeScript
```

### Tipos TypeScript

- `Restaurante`: Dados do estabelecimento
- `Localizacao`: Coordenadas geográficas
- `RegiaoProspeccao`: Régua/área de prospecção
- `RotaProspeccao`: Rota de visitas
- `AnaliseProspeccao`: Resultado da IA
- `FiltrosBuscaRestaurante`: Parâmetros de busca

### Serviços

#### `restauranteService`

- `buscarCoordenadas()`: Geocoding de endereço
- `buscarRestaurantes()`: Busca com filtros
- `calcularDistancia()`: Haversine
- `otimizarRota()`: Algoritmo de otimização
- CRUD de restaurantes/regiões/rotas

#### `openaiService`

- `analisarLocalizacao()`: Análise de região
- `analisarRestaurante()`: Score de potencial
- `priorizarProspectos()`: Ranking automático
- `sugerirRegioes()`: Onde prospectar
- `gerarScriptAbordagem()`: Texto de vendas
- `analisarCompetição()`: Análise de mercado

---

## 🐛 Troubleshooting

### Mapa não carrega

**Problema**: Tela branca ou erro de console

**Soluções:**
1. Verifique conexão com internet (usa CDN do Leaflet)
2. Limpe cache do navegador
3. Verifique console para erros de CORS

### Geocoding falha

**Problema**: "Erro ao buscar coordenadas"

**Soluções:**
1. Verifique se o endereço está correto
2. Use formato: "Cidade, Estado" (ex: "São Paulo, SP")
3. Nominatim tem limite de taxa (aguarde 1 segundo)

### IA não funciona

**Problema**: "API não configurada" ou erro 401

**Soluções:**
1. Configure `VITE_OPENAI_API_KEY` no `.env`
2. Reinicie o servidor de desenvolvimento (`npm run dev`)
3. Verifique se a chave é válida em https://platform.openai.com
4. Confirme saldo de créditos na conta OpenAI

### Dados não persistem

**Problema**: Restaurantes somem ao recarregar

**Soluções:**
1. Verifique se localStorage está habilitado
2. Veja limite de storage do navegador (5-10 MB)
3. Abra DevTools → Application → Local Storage

---

## 📈 Métricas e Relatórios

### Por Região

- Total de prospectos identificados
- Quantidade de contatos realizados
- Taxa de conversão (%)
- Status da prospecção

### Por Vendedor

- Rotas criadas
- Visitas realizadas
- Conversões alcançadas
- Eficiência (km/visita)

### Geral

- Total de restaurantes no sistema
- Distribuição por status
- Distribuição por potencial
- Cobertura geográfica

---

## 🔐 Segurança e Privacidade

### Dados Locais

- Armazenados apenas no navegador do usuário
- Não são enviados para servidor externo
- Exceto chamadas à OpenAI (quando configurada)

### APIs Externas

- **OpenStreetMap**: Política de uso justo (1 req/seg)
- **OpenAI**: Dados processados conforme política da OpenAI

### Recomendações

- ✅ Use HTTPS em produção
- ✅ Não compartilhe API Keys publicamente
- ✅ Configure variáveis de ambiente corretamente
- ✅ Implemente autenticação se necessário

---

## 🚀 Próximos Passos e Melhorias

### Curto Prazo

- [ ] Adicionar mais restaurantes de exemplo
- [ ] Melhorar UX mobile
- [ ] Exportar relatórios (PDF/Excel)
- [ ] Integração com WhatsApp

### Médio Prazo

- [ ] Sistema de notificações (follow-ups)
- [ ] Dashboard de métricas dedicado
- [ ] Importação em massa (CSV)
- [ ] Integração com Google Places
- [ ] Histórico de interações

### Longo Prazo

- [ ] App mobile nativo
- [ ] Integração com CRM existente
- [ ] Machine Learning para previsões
- [ ] Análise de sentimento (redes sociais)
- [ ] Gamificação para vendedores

---

## 📞 Suporte

### Documentação Técnica

- [React](https://react.dev)
- [Leaflet](https://leafletjs.com)
- [OpenAI API](https://platform.openai.com/docs)
- [OpenStreetMap](https://wiki.openstreetmap.org)

### Contato

Para dúvidas ou suporte:
- Consulte a documentação principal do Dashboard
- Verifique issues no GitHub do projeto
- Entre em contato com o time de desenvolvimento

---

## 📄 Licença

Este módulo faz parte do Dashboard Comercial e segue a mesma licença do projeto principal.

---

**Versão**: 1.0.0
**Última atualização**: Janeiro 2026
**Desenvolvido por**: [Seu Nome/Empresa]
