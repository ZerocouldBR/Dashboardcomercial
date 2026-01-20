# Integração com APIs Externas

## 🔑 Configuração de API Keys

### 1. Google Places API

**Obter chave:**
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou selecione um existente
3. Ative as APIs:
   - Places API
   - Geocoding API
4. Vá em "Credenciais" → "Criar Credenciais" → "Chave de API"
5. Copie a chave gerada

**Adicionar no projeto:**
```env
VITE_GOOGLE_PLACES_API_KEY=AIzaSy...
```

**Plano Gratuito:**
- $200 USD/mês de crédito
- Até ~40.000 pesquisas/mês grátis
- Consulte: https://developers.google.com/maps/billing/gmp-billing

**Custos após free tier:**
- Nearby Search: $32/1000 requisições
- Text Search: $32/1000 requisições
- Place Details: $17/1000 requisições
- Photos: $7/1000 requisições

### 2. OpenAI API (GPT-4)

**Obter chave:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma conta
3. Gere uma nova API Key
4. Adicione créditos (mínimo $5)

**Adicionar no projeto:**
```env
VITE_OPENAI_API_KEY=sk-...
```

**Custos:**
- GPT-4: $0.03/1K tokens (input), $0.06/1K tokens (output)
- GPT-3.5-Turbo: $0.001/1K tokens
- 1 análise ~ $0.05-0.15

### 3. Consulta de CNPJ (Gratuito)

**APIs disponíveis:**

#### ReceitaWS (Principal)
- URL: https://www.receitaws.com.br
- Grátis: 3 consultas/minuto
- Limitações: Rate limit, ocasionalmente instável
- Não requer API Key

#### BrasilAPI (Fallback)
- URL: https://brasilapi.com.br
- Open source e gratuito
- Mais estável que ReceitaWS
- Não requer API Key

**Para produção (pago):**
- Serasa Experian: https://serasa.com.br
- BigData Corp: https://bigdatacorp.com.br
- Consulta CNPJ: https://consultacnpj.com

---

## 🚀 Funcionalidades por API

### Google Places API

**O que faz:**
- ✅ Busca restaurantes reais próximos
- ✅ Retorna avaliações (1-5 estrelas)
- ✅ Total de avaliações
- ✅ Nível de preço ($ a $$$$)
- ✅ Fotos do estabelecimento
- ✅ Telefone, site, horários
- ✅ Localização precisa (lat/long)

**Endpoints usados:**
1. `nearbysearch` - Busca por proximidade
2. `textsearch` - Busca por texto/nome
3. `details` - Detalhes completos
4. `photo` - URLs de fotos

**Exemplo de uso:**
```typescript
import { googlePlacesService } from './services/googlePlacesService';

// Buscar restaurantes próximos
const restaurantes = await googlePlacesService.buscarRestaurantesProximos(
  { latitude: -23.5505, longitude: -46.6333 },
  5000 // 5km
);

// Buscar por nome
const resultados = await googlePlacesService.buscarRestaurantesPorTexto(
  'Pizzaria Vila Madalena',
  { latitude: -23.5505, longitude: -46.6333 },
  2000
);
```

### API de CNPJ

**O que faz:**
- ✅ Razão Social e Nome Fantasia
- ✅ Situação Cadastral (Ativa/Inativa)
- ✅ Data de abertura
- ✅ Capital Social
- ✅ Atividade Principal (CNAE)
- ✅ Quadro de Sócios e Administradores (QSA)
- ✅ Endereço completo
- ✅ Telefone e email

**Exemplo de uso:**
```typescript
import { cnpjService } from './services/cnpjService';

// Consultar CNPJ
const dados = await cnpjService.consultarCNPJReceitaWS('00.000.000/0000-00');

// Enriquecer restaurante
const restauranteAtualizado = await cnpjService.enriquecerComCNPJ(
  restaurante,
  '00.000.000/0000-00'
);

// Gerar relatório de crédito
const relatorio = cnpjService.gerarRelatorioCreditoSimplificado(restaurante);
```

### OpenAI API

**O que faz:**
- ✅ Analisa potencial de localização
- ✅ Prioriza prospectos automaticamente
- ✅ Gera scores de 0-100
- ✅ Sugere melhores regiões
- ✅ Cria scripts de abordagem
- ✅ Analisa competição

**Exemplo de uso:**
```typescript
import { openaiService } from './services/openaiService';

// Analisar restaurante
const analise = await openaiService.analisarRestaurante(restaurante);

// Priorizar lista
const { ranking, resumo } = await openaiService.priorizarProspectos(restaurantes);

// Sugerir regiões
const { regioes, estrategia } = await openaiService.sugerirRegioes('São Paulo', 'SP');
```

---

## 📊 Dados Retornados

### Restaurante Completo

```typescript
{
  // Dados básicos
  id: string,
  nome: string,
  endereco: string,
  cidade: string,
  estado: string,
  localizacao: { latitude: number, longitude: number },

  // Dados Google
  googlePlaceId: string,
  avaliacaoGoogle: number, // 1-5
  totalAvaliacoes: number,
  nivelPreco: number, // 1-4
  fotos: string[], // URLs

  // Dados CNPJ
  cnpj: string,
  razaoSocial: string,
  nomeFantasia: string,
  situacaoCadastral: string,
  capitalSocial: number,
  socios: [
    {
      nome: string,
      qualificacao: string,
      cpf?: string
    }
  ],

  // Inteligência
  scoreProspeccao: number, // 0-100
  potencial: 'baixo' | 'medio' | 'alto' | 'muito_alto',
  motivosAbordagem: string[]
}
```

---

## ⚙️ Configuração Avançada

### Restringir domínios (Google Places)

Para produção, restrinja sua API Key:

1. No Google Cloud Console
2. Selecione a API Key
3. "Restrições de aplicativos" → "Referenciadores HTTP"
4. Adicione: `seu-dominio.com.br/*`

### Gerenciar custos

**Limite de gastos:**
1. Cloud Console → Faturamento
2. Configure alertas de orçamento
3. Defina limites máximos

**Otimizações:**
- Cache de resultados (24h)
- Debounce em buscas (500ms)
- Use `fields` para limitar dados retornados
- Prefira Nearby Search (mais barato) que Text Search

### Rate Limiting

**ReceitaWS:**
- 3 requisições/minuto
- Implementar retry com backoff

**Google Places:**
- 100 requisições/segundo (padrão)
- Aumentar se necessário

**OpenAI:**
- 3.500 requisições/minuto (Tier 1)
- 90.000 tokens/minuto

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca comite API Keys**
   - Use `.env` (git ignorado)
   - Rotacione keys periodicamente

2. **Use variáveis de ambiente**
   ```bash
   # .env
   VITE_GOOGLE_PLACES_API_KEY=xxx
   VITE_OPENAI_API_KEY=xxx
   ```

3. **Validação no backend** (recomendado)
   - Para produção, proxeie chamadas pelo seu backend
   - Evite expor keys no frontend

4. **Monitore uso**
   - Configure alertas de custo
   - Revise logs regularmente

---

## 🐛 Troubleshooting

### Google Places não retorna resultados

**Problema:** API retorna status `ZERO_RESULTS`

**Soluções:**
1. Verifique se as APIs estão ativadas
2. Confirme se há créditos disponíveis
3. Teste com coordenadas conhecidas
4. Verifique restrições de domínio

### Erro 403 - CNPJ

**Problema:** Rate limit excedido

**Soluções:**
1. Aguarde 1 minuto
2. Tente API alternativa (BrasilAPI)
3. Implemente cache local
4. Considere API paga para produção

### OpenAI timeout

**Problema:** Requisição demora muito

**Soluções:**
1. Reduza `max_tokens`
2. Use modelo mais rápido (GPT-3.5)
3. Implemente timeout de 30s
4. Cache respostas similares

---

## 📈 Monitoramento

### Métricas importantes

1. **Custos por API**
   - Google Places: $/dia
   - OpenAI: $/análise
   - Total mensal

2. **Taxa de sucesso**
   - % requisições bem-sucedidas
   - Erros por tipo

3. **Performance**
   - Tempo médio de resposta
   - Cache hit rate

### Ferramentas

- Google Cloud Monitoring
- OpenAI Usage Dashboard
- Logs customizados no app

---

## 🆘 Suporte

### Google Places
- Documentação: https://developers.google.com/maps/documentation/places
- Suporte: https://developers.google.com/maps/support

### OpenAI
- Documentação: https://platform.openai.com/docs
- Status: https://status.openai.com
- Suporte: help.openai.com

### APIs de CNPJ
- ReceitaWS: https://receitaws.com.br
- BrasilAPI: https://github.com/BrasilAPI/BrasilAPI

---

**Versão:** 1.0.0
**Última atualização:** Janeiro 2026
