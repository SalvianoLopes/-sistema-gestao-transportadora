# DOSSIÊ COMPLETO — MURICI IPIRANGA
## Plataforma de Gestão Operacional — Transportadora

> Gerado em: 2026-05-12  
> Fonte: leitura REAL do repositório, banco Supabase e configurações do Vercel.

---

## 1. IDENTIFICAÇÃO DO PROJETO

| Campo | Valor |
|---|---|
| **Nome** | Murici Ipiranga — Plataforma de Gestão Operacional |
| **Empresa** | MURICI LOGÍSTICA / MURICI TRANSPORTES |
| **URL Produção** | https://murici-ipiranga.vercel.app/ |
| **Vercel Project ID** | `prj_qiIMnKXbQeUqioLfXZYeI8fbhjLj` |
| **Vercel Internal Name** | project-xytnq |
| **Vercel Team** | salvianolopes-projects (`team_ofkNeB2W5ahbTto2ccudPzqs`) |
| **Supabase Project** | murici-ipiranga (`pneakxdlbyuysjorhjdu`) |
| **Supabase Região** | `sa-east-1` (São Paulo) |
| **Supabase Status** | ACTIVE_HEALTHY |
| **GitHub Repo** | `git@github.com:SalvianoLopes/-sistema-gestao-transportadora.git` |
| **Desenvolvedor** | Salviano Lopes — lopes.salviano@gmail.com |
| **Criado em** | 2026-04-18 (Supabase) / 2026-04-25 (Vercel primeiro deploy) |
| **Último Deploy** | 2026-05-07 |
| **Segmento** | Transporte e distribuição |
| **Usuários** | Supervisores operacionais, coordenadores, motoristas, ADM |

---

## 2. STACK TÉCNICA COMPLETA

| Tecnologia | Versão | Uso |
|---|---|---|
| **React** | 18.2.0 (CDN) | Interface SPA — sem build |
| **ReactDOM** | 18.2.0 (CDN) | Renderização |
| **jsPDF** | 2.5.1 (CDN) | Geração de relatórios PDF |
| **jsPDF-autotable** | 3.5.28 (CDN) | Tabelas nos PDFs |
| **SheetJS (XLSX)** | 0.18.5 (CDN) | Export e import de planilhas Excel |
| **Inter** | Google Fonts | Tipografia principal |
| **JetBrains Mono** | Google Fonts | Dados numéricos, matrículas |
| **Supabase REST API** | Fetch nativo | Banco de dados (sem SDK externo) |
| **Vercel** | Static (outputDirectory: ".") | Hospedagem / CDN |
| **Node.js** | 24.x (Vercel) | Runtime do servidor |
| **Framework** | Nenhum (null) | Arquivo único index.html |

> **Arquitetura:** Single-file SPA. Todo o JS está inline no `index.html`. Não há build process, package.json, node_modules, bundler ou transpiler. React via CDN. Supabase via fetch nativo com headers anon key.

---

## 3. ESTRUTURA DE PASTAS

```
murici-ipiranga/
├── index.html          ← Aplicação completa (SPA single-file, ~2600 linhas)
├── vercel.json         ← Config deploy (outputDirectory: ".", framework: null)
├── .gitignore          ← .DS_Store, *.log, .env, .vercel
├── README.md           ← Documentação do portfólio (versão pública)
└── .vercel/
    ├── project.json    ← projectId, orgId, projectName
    └── README.txt      ← Instrução Vercel CLI
```

> Sem `src/`, `public/`, `components/`, `node_modules/`. Projeto 100% single-file.

---

## 4. ROTAS E PÁGINAS

O sistema usa **roteamento client-side por estado React** (sem React Router). A página inicial (default) é `liberacoes`.

| Chave (state) | Label no Nav | Componente | Descrição |
|---|---|---|---|
| `dashboard` | Dashboard | `Dashboard` | KPIs mensais, produtividade dos motoristas |
| `liberacoes` | Liberações Diárias | `Liberacoes` | Visão do dia — ondas, veículos, filtros (**padrão ao abrir**) |
| `entrada` | Entrada do Dia | `EntradaDia` | CRUD completo + importação de planilha Excel |
| `descarga` | Descarga FEMSA | `Descarga` | Registro de descargas, reembolso de paletes |
| `frota` | Frota | `Frota` | Cadastro de veículos, manutenção |
| `equipe` | Equipe | `Equipe` | Cadastro de colaboradores |
| `recargas` | Recargas | `Recargas` | Timeline 1ª saída + recargas, fechamento por período |
| `ranking` | 🏆 Ranking | `Ranking` | Score de incentivos por colaborador |
| `despesas` | 💰 Despesas | `Despesas` | Gastos operacionais e reembolsos |

---

## 5. BANCO DE DADOS COMPLETO

**Host:** `db.pneakxdlbyuysjorhjdu.supabase.co`  
**Engine:** PostgreSQL 17 (`17.6.1.104`)  
**RLS:** Habilitado em todas as tabelas

---

### 5.1 — `equipe` (72 registros)

| Coluna | Tipo | Obrigatório | Padrão / Restrição |
|---|---|---|---|
| `id` | uuid | PK | `gen_random_uuid()` |
| `nome` | text | ✅ | — |
| `funcao` | text | ✅ | `MOTORISTA`, `AJUDANTE`, `COORDENADOR`, `ADM` |
| `matricula` | text | — | — |
| `cpf` | text | — | — |
| `data_admissao` | date | — | — |
| `status` | text | ✅ | `ATIVO`(padrão), `DESLIGADO`, `AFASTADO`, `JUSTA_CAUSA`, `FERIAS`, `SERVICO_INTERNO`, `RESTRITO` |
| `venc_exame_periodico` | date | — | — |
| `venc_exame_toxicologico` | date | — | — |
| `obs` | text | — | — |
| `turno` | text | — | `06:00`, `06:30` |
| `created_at` | timestamptz | — | `now()` |
| `updated_at` | timestamptz | — | `now()` |

**Foreign Key:** Referenciada por `frota.motorista_fixo_id`

---

### 5.2 — `frota` (12 registros)

| Coluna | Tipo | Obrigatório | Padrão / Restrição |
|---|---|---|---|
| `id` | uuid | PK | `gen_random_uuid()` |
| `placa` | text | ✅ | UNIQUE |
| `modelo` | text | — | — |
| `tipo` | text | ✅ | `VAN`, `VUC` |
| `status` | text | ✅ | `ATIVO`(padrão), `MANUTENCAO`, `AGUARDANDO_PECA`, `LIBERADO` |
| `motorista_fixo_id` | uuid | — | FK → equipe.id |
| `km_atual` | integer | — | — |
| `obs` | text | — | — |
| `created_at` | timestamptz | — | `now()` |
| `updated_at` | timestamptz | — | `now()` |

**Foreign Keys:** Referenciada por `manutencao.frota_id`

---

### 5.3 — `manutencao` (8 registros)

| Coluna | Tipo | Obrigatório | Padrão / Restrição |
|---|---|---|---|
| `id` | uuid | PK | `gen_random_uuid()` |
| `frota_id` | uuid | ✅ | FK → frota.id |
| `placa` | text | ✅ | — |
| `status` | text | ✅ | `MANUTENCAO`, `AGUARDANDO_PECA`, `LIBERADO` |
| `data_entrada` | date | ✅ | — |
| `data_retorno` | date | — | — |
| `previsao_retorno` | date | — | — |
| `km_entrada` | integer | — | — |
| `km_saida` | integer | — | — |
| `oficina` | text | — | — |
| `problema` | text | — | — |
| `servicos_realizados` | text | — | — |
| `pendencias` | text | — | — |
| `obs` | text | — | — |
| `created_at` | timestamptz | — | `now()` |

---

### 5.4 — `entrada_diaria` (287 registros) ← TABELA PRINCIPAL

| Coluna | Tipo | Obrigatório | Padrão / Restrição |
|---|---|---|---|
| `id` | uuid | PK | `gen_random_uuid()` |
| `data` | date | ✅ | — |
| `onda` | text | — | Ex: `1ª ONDA 06:00 às 06:30` |
| `placa` | text | — | — |
| `tipo_veiculo` | text | — | `VAN` ou `VUC` |
| `num_transporte` | bigint | — | — |
| `rota` | text | — | — |
| `motorista_nome` | text | — | — |
| `motorista_matricula` | text | — | — |
| `ajudante1_nome` | text | — | — |
| `ajudante1_matricula` | text | — | — |
| `ajudante2_nome` | text | — | — |
| `ajudante2_matricula` | text | — | — |
| `qtd_caixas` | integer | — | `0` |
| `num_clientes` | integer | — | `0` |
| `cubos` | numeric | — | `0` (m³) |
| `km` | numeric | — | `0` |
| `tipo_saida` | text | — | — |
| `total_venda` | numeric | — | `0` |
| `cte` | text | — | — |
| `status_operacional` | text | — | `'1ª Saída'`(padrão), `'Recarga'` |
| `valor_motorista` | numeric | — | `0` (R$ recarga) |
| `valor_ajudante1` | numeric | — | `0` |
| `valor_ajudante2` | numeric | — | `0` |
| `horario_saida` | time | — | — (desde 21/04/2026) |
| `horario_chegada` | time | — | — |
| `tempo_trabalhado_min` | integer | — | Calculado: chegada - saída |
| `venda_total_dia` | numeric | — | — |
| `observacoes` | text | — | — |
| `foto_url` | text | — | — |
| `num_pe` | text | — | — (Processo Específico) |
| `motivo_pe` | text | — | `Assinatura Pendente`, `Troca de Produto`, `Avaria / Reentrega` |
| `created_at` | timestamptz | — | `now()` |

---

### 5.5 — `recargas` (0 registros) — tabela legacy/não usada ativamente

| Coluna | Tipo | Padrão / Restrição |
|---|---|---|
| `id` | uuid | `gen_random_uuid()` |
| `semana_inicio` | date | — |
| `semana_fim` | date | — |
| `colaborador_nome` | text | — |
| `funcao` | text | — |
| `placa` | text | — |
| `tipo_veiculo` | text | — |
| `num_recargas` | integer | `0` |
| `valor_total` | numeric | `0` |
| `status_pagamento` | text | `PENDENTE`, `PAGO` |
| `data_pagamento` | date | — |
| `usar_valores_automaticos` | boolean | `true` = valores padrão VAN/VUC |
| `valor_motorista_recarga` | numeric | `0` |
| `valor_ajudante1_recarga` | numeric | `0` |
| `valor_ajudante2_recarga` | numeric | `0` |
| `total_recarga` | numeric | `0` |

---

### 5.6 — `descarga_ref` (3.242 registros) — catálogo de clientes FEMSA

| Coluna | Tipo | Padrão / Restrição |
|---|---|---|
| `id` | uuid | `gen_random_uuid()` |
| `matricula` | text | UNIQUE — chave de busca |
| `canal` | text | Ex: DISTRIBUIDOR DE BEBIDAS |
| `razao_social` | text | — |
| `territorio` | text | Ex: TERRIT. SPM |
| `gerencia` | text | Ex: GV AS SPM |
| `valor_pallet` | numeric | `0` (R$ por palete) |
| `ativo` | boolean | `true` |
| `created_at` | timestamptz | `now()` |

**Foreign Key:** Referenciada por `descarga_lancamento.matricula_cliente`

---

### 5.7 — `descarga_lancamento` (6 registros)

| Coluna | Tipo | Padrão / Restrição |
|---|---|---|
| `id` | uuid | `gen_random_uuid()` |
| `data` | date | — |
| `placa` | text | — |
| `motorista_nome` | text | — |
| `num_transporte` | bigint | — |
| `rota` | text | — |
| `pesquisa_nome` | text | — |
| `matricula_cliente` | text | FK → descarga_ref.matricula |
| `razao_social` | text | — |
| `canal` | text | — |
| `qtd_paletes` | integer | `1` |
| `valor_pallet` | numeric | `0` |
| `valor_total` | numeric | **GERADA**: `qtd_paletes * valor_pallet` |
| `reembolsavel` | boolean | `false` |
| `territorio` | text | — |
| `gerencia` | text | — |
| `obs` | text | — |
| `status_reembolso` | text | `PENDENTE`, `REEMBOLSADO` |
| `data_reembolso` | date | — |
| `created_at` | timestamptz | `now()` |

---

### 5.8 — `vendas_diarias` (30 registros)

| Coluna | Tipo | Restrição |
|---|---|---|
| `id` | uuid | PK |
| `data` | date | UNIQUE |
| `venda_total` | numeric | `0` |
| `obs` | text | — |
| `updated_at` | timestamptz | `now()` |

---

### 5.9 — `despesas` (12 registros)

| Coluna | Tipo | Padrão |
|---|---|---|
| `id` | uuid | PK |
| `data` | date | — |
| `num_transporte` | text | — |
| `rota` | text | — |
| `motorista_nome` | text | — |
| `categoria` | text | `Produto Danificado`, `Falta de Produto`, `Transporte / Uber`, `Locomoção / Mecânico`, `Outros` |
| `descricao` | text | — |
| `valor` | numeric | — |
| `num_nf` | text | — |
| `foto_url` | text | — |
| `status` | text | `PENDENTE`, `REEMBOLSADO` |
| `created_at` | timestamptz | `now()` |

---

### 5.10 — `pagamentos_recarga` (33 registros)

| Coluna | Tipo | Padrão |
|---|---|---|
| `id` | uuid | PK |
| `colaborador_nome` | text | — |
| `periodo_ini` | date | — |
| `periodo_fim` | date | — |
| `status` | text | `PENDENTE` |
| `data_pagamento` | timestamptz | — |
| `created_at` | timestamptz | `now()` |

---

### 5.11 — `processos_especificos` (0 registros)

| Coluna | Tipo |
|---|---|
| `id` | uuid |
| `data` | date (default: CURRENT_DATE) |
| `motorista_nome` | text |
| `matricula` | text |
| `cod_cliente` | text |
| `nome_cliente` | text |
| `razao_social` | text |
| `nf_cliente` | text |
| `num_pe` | text |
| `horario_saida` | time |
| `horario_chegada` | time |
| `observacoes` | text |
| `created_at` | timestamptz |

---

### 5.12 — `escala_rascunho` (24 registros)

| Coluna | Tipo |
|---|---|
| `id` | uuid |
| `data` | date |
| `placa` | text |
| `tipo` | text |
| `motorista` | text |
| `mat_mot` | text |
| `aj1` | text |
| `mat_aj1` | text |
| `aj2` | text |
| `mat_aj2` | text |
| `num_transp` | text |
| `rota` | text |
| `created_at` | timestamptz |

---

## 6. VARIÁVEIS DE AMBIENTE

> O projeto **não usa variáveis de ambiente via Vercel/dotenv**. As credenciais estão hardcoded diretamente no `index.html`.

| Variável | Valor |
|---|---|
| `SURL` | `https://pneakxdlbyuysjorhjdu.supabase.co` |
| `SKEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon key — role: anon) |
| `vercel.json buildCommand` | `null` |
| `vercel.json outputDirectory` | `.` |
| `vercel.json framework` | `null` |

---

## 7. REGRAS DE NEGÓCIO

### 7.1 — Ondas de Saída

| Onda | Tipo Veículo | Horário Base |
|---|---|---|
| 1ª ONDA | VAN | 06:00 às 06:30 |
| 2ª ONDA | VUC | 06:30 às 07:00 |
| 3ª ONDA | — | 08:00 |

- Cada veículo sai em uma onda com equipe (motorista + até 2 ajudantes)
- O `tipo_veiculo` é derivado automaticamente a partir da `frota` via placa
- Registros com onda contendo `"2"` ou `"VUC"` → `2ª ONDA`; contendo `"3"` → `3ª ONDA`; demais → `1ª ONDA`

### 7.2 — Status Operacional

| Status | Descrição |
|---|---|
| `1ª Saída` | Saída normal da base |
| `Recarga` | Retorno para recarregar e sair novamente |
| `PE` | Processo Específico — requer Nº PE e Motivo |

### 7.3 — Valores de Recarga (calculados automaticamente)

| Tipo Veículo | Motorista | Ajudante 1 | Ajudante 2 |
|---|---|---|---|
| **VAN** | R$ 50,00 | R$ 50,00 | R$ 50,00 |
| **VUC** | R$ 70,00 | R$ 60,00 | R$ 60,00 |

- Os valores são inseridos automaticamente na `entrada_diaria` no momento do lançamento
- Ajudante só recebe se o campo `ajudante_nome` estiver preenchido

### 7.4 — Pontualidade no Ranking

| Veículo | Meta de Saída | Penalidade |
|---|---|---|
| VAN | 06:30 (390 min) | -5 pontos/minuto de atraso |
| VUC | 07:00 (420 min) | -5 pontos/minuto de atraso |

### 7.5 — Fórmula do Score de Ranking

```
Score = (Pontualidade × 0.35)
      + (min(saídas,30)/30 × 100 × 0.25)
      + (min(recargas,10)/10 × 100 × 0.15)
      + (min(caixasAjustadas,15000)/15000 × 100 × 0.15)
      + (min(eficiência,200)/200 × 100 × 0.10)
```

- **Fator VAN:** motoristas de VAN recebem multiplicador `2.1×` em caixas e cubos para equalizar com VUC (VUC carrega mais por saída)
- **Eficiência:** média de caixas/hora por saída
- Score máximo: 100 pontos

### 7.6 — Venda Total do Dia

- Registrada manualmente na tabela `vendas_diarias` (uma linha por data)
- Recargas têm `venda_total_dia` individual (campo próprio no lançamento)
- Venda exibida = `vendas_diarias.venda_total` + soma das `entrada_diaria.venda_total_dia` onde `status_operacional = 'Recarga'`

### 7.7 — Descarga FEMSA / Reembolso de Paletes

- Cliente identificado por **matrícula FEMSA** (busca no catálogo `descarga_ref` — 3.242 clientes)
- `valor_total` é coluna **gerada** (PostgreSQL): `qtd_paletes × valor_pallet`
- `reembolsavel = true` quando `matricula_cliente` está preenchida
- Status: `PENDENTE` → `REEMBOLSADO` (com `data_reembolso`)

### 7.8 — Importação de Planilha (Entrada do Dia)

- Aceita `.xlsx` e `.xls`
- Detecção automática do cabeçalho (procura linha com "DATA" e "MOTORISTA" nas 5 primeiras linhas)
- Ignora linhas "TOTAL", "—", e linhas vazias
- Status `Recarga` detectado se o campo contém "recarga" (case insensitive)
- Onda detectada por: conteúdo de "VUC" → 2ª onda; "3" → 3ª onda; demais → 1ª onda

### 7.9 — Manutenção de Frota

- Ao registrar manutenção, o status da frota muda para `MANUTENCAO`
- KM de entrada é **obrigatório**
- "Liberar" veículo muda o status de volta para `ATIVO`
- Status possíveis: `MANUTENCAO` → `AGUARDANDO_PECA` → `LIBERADO` → `ATIVO`

---

## 8. COMPONENTES PRINCIPAIS

| Componente | Localização | Responsabilidade |
|---|---|---|
| `App` | `index.html:2569` | Root — topbar, nav, roteamento por estado |
| `Dashboard` | `index.html:189` | KPIs mensais, produtividade top motoristas |
| `Liberacoes` | `index.html:238` | Visão do dia, filtros onda/motorista, exports PDF/Excel |
| `EntradaDia` | `index.html:379` | CRUD entrada_diaria, importação planilha, venda do dia |
| `Frota` | `index.html:1036` | CRUD frota, modal de manutenção, liberação |
| `Equipe` | `index.html:1066` | CRUD equipe, filtros, vencimentos de exames |
| `Recargas` | `index.html:1134` | Timeline 1ª saída + recargas, fechamento, PDF por colaborador |
| `Descarga` | `index.html:1582` | Descargas FEMSA, reembolso paletes, catálogo clientes |
| `Ranking` | `index.html:2161` | Score de incentivos, top 3, tabela completa |
| `Despesas` | `index.html:2406` | Gastos operacionais, status reembolso |
| `Bs` | `index.html:182` | Badge de status (mapeia status → classe CSS + label) |
| `Ob` | `index.html:186` | Badge de onda (1ª/2ª/3ª) |
| `Ldg` | `index.html:179` | Spinner de carregamento |
| `Emp` | `index.html:180` | Estado vazio (sem dados) |

### Utilitários globais

| Função | Assinatura | Descrição |
|---|---|---|
| `fmt` | `(n, d=0)` | Formata número pt-BR com decimais |
| `R` | `(n)` | Formata moeda `R$ X.XXX,XX` |
| `iso` | `()` | Data atual no formato `YYYY-MM-DD` |
| `fd` | `(d)` | Converte `YYYY-MM-DD` → `DD/MM/YYYY` |
| `dstr` | `()` | Data por extenso pt-BR (ex: "seg., 12 mai. 2026") |
| `toast` | `(msg, t='ok')` | Notificação temporária (3.2s) — verde ou vermelho |
| `db.get` | `(table, filters, opts)` | SELECT com filtros, order, ilike, limit |
| `db.post` | `(table, data)` | INSERT |
| `db.patch` | `(table, id, data)` | UPDATE por id |
| `db.patchWhere` | `(table, col, val, data)` | UPDATE por coluna genérica |

---

## 9. PADRÕES DE CÓDIGO

### 9.1 — Padrão React sem JSX

Todo o código usa `createElement` (alias `h`) ao invés de JSX:

```js
const {createElement:h, useState, useEffect, useMemo} = React;

// Exemplo:
h('div', {className:'card'},
  h('span', {className:'ct'}, 'Título')
)
```

### 9.2 — Padrão de fetch Supabase

```js
const db = {
  async get(table, filters={}, opts={}) { /* fetch GET */ },
  async post(table, data) { /* fetch POST */ },
  async patch(table, id, data) { /* fetch PATCH por id */ },
  async patchWhere(table, col, val, data) { /* fetch PATCH por coluna */ }
};
```

- Headers sempre incluem `apikey`, `Authorization: Bearer`, `Content-Type: application/json`
- INSERT usa `Prefer: return=minimal`
- Errors propagados como `throw new Error(await r.text())`

### 9.3 — Padrão de componente de lista

```js
function Modulo() {
  const [rows, setRows] = useState([]);
  const [ld, setLd] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [F, setF] = useState({...emptyForm});

  useEffect(() => { load() }, [deps]);

  async function load() { setLd(true); try { ... } catch(e) {} setLd(false); }
  async function salvar() { setSaving(true); try { ... } catch(e) { toast(...,'err') } setSaving(false); }

  return h('div', null,
    // header, filtros, KPIs, tabela, modal
  )
}
```

### 9.4 — Design System (CSS Variables)

```css
:root {
  --bg:   #06080f;   /* fundo global */
  --sur:  #0d1017;   /* superfície card */
  --s2:   #141824;   /* superfície nível 2 */
  --s3:   #1a2030;   /* superfície nível 3 */
  --red:  #e8195a;   /* vermelho primário */
  --red2: #ff2d6e;   /* vermelho hover */
  --grn:  #00d68f;   /* verde sucesso */
  --yel:  #f5a623;   /* amarelo atenção */
  --blu:  #4d9fff;   /* azul informação */
  --t1:   #f0f2ff;   /* texto primário */
  --t2:   #9ba3c0;   /* texto secundário */
  --t3:   #4a5270;   /* texto terciário */
  --r:    10px;      /* border-radius cards */
  --rs:   7px;       /* border-radius pequeno */
}
```

### 9.5 — Badges (classe `Bs`)

| Status | Classe CSS | Label |
|---|---|---|
| ATIVO | `.bg` (verde) | ● Ativo |
| MANUTENCAO | `.by` (amarelo) | 🔧 Manut. |
| PE | `.bb` (azul) | 📋 PE |
| AGUARDANDO_PECA | `.br` (vermelho) | ⏳ Aguard. |
| LIBERADO | `.bb` | ✓ Lib. |
| DESLIGADO | `.bk` (cinza) | ✕ Deslig. |
| JUSTA_CAUSA | `.br` | ⚠ J.Causa |
| AFASTADO | `.by` | ~ Afastado |
| 1ª Saída | `.bg` | 1ª Saída |
| Recarga | `.br` | ⟳ Recarga |
| MOTORISTA | `.bb` | Motorista |
| AJUDANTE | `.bg` | Ajudante |
| VAN | `.bb` | VAN |
| VUC | `.bg` | VUC |

### 9.6 — Inputs

- Todos os `input`, `select`, `textarea` usam fundo **branco** (`#ffffff`), texto preto (`#111827`)
- Focus: borda `var(--red)` + box-shadow `var(--rbg)`
- Datas: `type="date"`, horários: `type="time"` com font JetBrains Mono

---

## 10. HISTÓRICO DOS ÚLTIMOS COMMITS (repositório local)

> Nota: O projeto real é deployado via Vercel CLI (sem conexão git). O repositório GitHub tem apenas 2 commits (versão portfólio/demo).

| Hash | Data | Mensagem |
|---|---|---|
| `d963886` | 2026-05-01 | config: add vercel.json for static site deployment |
| `985a9e8` | 2026-05-01 | feat: Plataforma de Gestão Operacional — Transportadora (versão demo portfólio) |

### Histórico de Deployments Vercel (últimos 10)

| Deploy ID | Data | Estado |
|---|---|---|
| `dpl_4Tx1kQECwq2t3gxb1jKfieKocePz` | 2026-05-07 | ✅ READY (produção atual) |
| `dpl_2a7AibwCvFHs4qv6HKC9jGyPTmic` | 2026-05-07 | ✅ READY |
| `dpl_Drn5iiSBJtekNLxTfdfTum3KkRK4` | 2026-05-07 | ✅ READY |
| `dpl_13RuUR1T4n4oqkRqDaUGjTbxQKEi` | 2026-05-06 | ✅ READY |
| `dpl_4gn8JJapV21X7i1WSU8rW79489ev` | 2026-04-30 | ✅ READY |
| `dpl_23QTzW5GPhFovHee579Z4J47dhSz` | 2026-04-30 | ✅ READY |
| `dpl_7MGrD2SAbXBwaXRoX1AMvJtLuPoQ` | 2026-04-30 | ✅ READY |
| `dpl_42j1CL1UsqiUxdGwgQZZMeBCGNaC` | 2026-04-30 | ✅ READY |
| `dpl_Amy7m58mxRU1QVrv7CVR3iAoxycy` | 2026-04-30 | ✅ READY |
| `dpl_5iSCoFgjmwqyWS6HdKGYbhEP6XsN` | 2026-04-30 | ✅ READY |

> Total: 20+ deployments entre 2026-04-25 e 2026-05-07

---

## 11. PENDÊNCIAS / TODOs

| # | Item | Status |
|---|---|---|
| 1 | `processos_especificos` — tabela criada, 0 registros, sem módulo de UI | Pendente |
| 2 | `escala_rascunho` — 24 registros sem tela dedicada para visualização | Pendente |
| 3 | `pagamentos_recarga` — 33 registros, tabela sem UI de gestão | Pendente |
| 4 | `recargas` — tabela original com 0 registros; recargas passaram a ser lançadas em `entrada_diaria` | Legacy |
| 5 | Credenciais Supabase hardcoded no HTML (anon key exposta) | Observação de segurança |
| 6 | Sem autenticação de usuário (acesso livre à URL) | NÃO IMPLEMENTADO |
| 7 | `db.del` referenciada em `Despesas.excluir()` mas não implementada no objeto `db` | Bug potencial |
| 8 | Controle de turno (`06:00`/`06:30`) no cadastro de equipe sem impacto na UI atual | Pendente |
| 9 | Campo `foto_url` em `entrada_diaria` e `despesas` sem upload implementado | Pendente |
| 10 | Seletor de mês no Dashboard limitado a: Mar/Abr/Mai 2026 (hardcoded) | Limitação |

---

## 12. ESPECIFICAÇÕES EXCEL — FORMATOS E LARGURAS

### 12.1 — Excel Horários (Liberações Diárias)

**Arquivo:** `Horarios_YYYY-MM-DD.xlsx`  
**Aba:** `Horários`  
**Larguras:** NÃO definidas (colunas automáticas)

| # | Coluna | Tipo |
|---|---|---|
| 1 | Data | `DD/MM/YYYY` |
| 2 | Placa | texto |
| 3 | Tipo | VAN/VUC |
| 4 | Onda | texto |
| 5 | Motorista | texto |
| 6 | Ajudante 1 | texto |
| 7 | Ajudante 2 | texto |
| 8 | Rota | texto |
| 9 | Tipo Saída | texto |
| 10 | Saída | `HH:MM` |
| 11 | Chegada | `HH:MM` |
| 12 | Tempo na Rua | `Xh YYm` |
| 13 | Caixas | inteiro |
| 14 | Clientes | inteiro |
| 15 | KM | inteiro |

---

### 12.2 — Excel Entrada do Dia

**Arquivo:** `Entrada_YYYY-MM-DD.xlsx`  
**Aba:** `Entrada do Dia`  

| # | Coluna | Largura (wch) |
|---|---|---|
| 1 | Onda | 18 |
| 2 | Placa | 10 |
| 3 | Tipo | 6 |
| 4 | Nº Transporte | 12 |
| 5 | Rota | 10 |
| 6 | Motorista | 30 |
| 7 | Ajudante 1 | 30 |
| 8 | Ajudante 2 | 30 |
| 9 | Caixas | 8 |
| 10 | Clientes | 8 |
| 11 | KM | 10 |
| 12 | Cubagem m³ | 6 |
| 13 | Venda R$ | 10 |
| 14 | CTE | 12 |
| 15 | Horário Saída | 14 |
| 16 | Horário Chegada | 12 |

---

### 12.3 — Excel Relatório do Dia (Módulo Recargas)

**Arquivo:** `Relatorio_Dia_YYYY-MM-DD.xlsx`  
**Aba:** `Dia DD/MM/YYYY`  
**Inclui linha de TOTAIS ao final**

| # | Coluna | Largura (wch) |
|---|---|---|
| 1 | Onda | 18 |
| 2 | Placa | 10 |
| 3 | Tipo | 6 |
| 4 | Nº Transporte | 12 |
| 5 | Rota | 10 |
| 6 | Motorista | 30 |
| 7 | Ajudante 1 | 30 |
| 8 | Ajudante 2 | 30 |
| 9 | Caixas | 8 |
| 10 | Clientes | 8 |
| 11 | Cubagem m³ | 10 |
| 12 | KM | 6 |
| 13 | Hor. Saída | 10 |
| 14 | Hor. Chegada | 12 |
| 15 | Tempo Trabalhado | 14 |
| 16 | Status | 12 |

---

### 12.4 — Excel Timeline Recargas

**Arquivo:** `Recargas_Timeline_YYYY-MM-DD_YYYY-MM-DD.xlsx`  
**Abas:** `Timeline Recargas` + `Resumo Pagamento`

**Aba Timeline Recargas:**

| # | Coluna | Largura (wch) |
|---|---|---|
| 1 | `` (tipo linha: `1ª SAÍDA` / `⟳ RECARGA`) | 10 |
| 2 | Colaborador | 32 |
| 3 | Função | 10 |
| 4 | Data | 12 |
| 5 | Nº Transp | 12 |
| 6 | Placa | 10 |
| 7 | Rota | 10 |
| 8 | Caixas | 8 |
| 9 | Clientes | 8 |
| 10 | Cubagem | 10 |
| 11 | KM | 6 |
| 12 | Hor. Saída | 10 |
| 13 | Hor. Chegada | 12 |
| 14 | Tempo | 10 |
| 15 | Valor Recarga | 14 |

**Aba Resumo Pagamento:**  
Colunas: `Colaborador`, `Recargas`, `Total R$`

---

### 12.5 — Excel Descarga FEMSA

**Arquivo:** `Descarga_FEMSA_YYYY-MM-DD.xlsx`  
**Aba:** `Descarga FEMSA`

| # | Coluna | Largura (wch) |
|---|---|---|
| 1 | Data | 12 |
| 2 | Placa | 10 |
| 3 | Motorista | 30 |
| 4 | Nº Transporte | 14 |
| 5 | Rota | 10 |
| 6 | Matrícula Cliente | 16 |
| 7 | Razão Social / Cliente | 40 |
| 8 | Canal | 20 |
| 9 | Território | 22 |
| 10 | Gerência | 25 |
| 11 | Qtd Paletes | 12 |
| 12 | Valor por Pallet (R$) | 18 |
| 13 | Total (R$) | 14 |
| 14 | Observações | 30 |

---

### 12.6 — Excel Despesas

**Arquivo:** `Despesas_YYYY-MM-DD_YYYY-MM-DD.xlsx`  
**Aba:** `Despesas`  
**Larguras:** automáticas (não definidas)

| # | Coluna |
|---|---|
| 1 | Data |
| 2 | Motorista |
| 3 | Nº Transporte |
| 4 | Rota |
| 5 | Categoria |
| 6 | Descrição |
| 7 | Valor R$ |
| 8 | Nº NF |
| 9 | Status |

---

## 13. ESPECIFICAÇÕES PDF

### Padrão geral de todos os PDFs

| Propriedade | Valor |
|---|---|
| Orientação | Landscape (A4 = 297×210mm) |
| Biblioteca | jsPDF 2.5.1 + autoTable 3.5.28 |
| Cabeçalho — fundo | `rgb(232, 25, 90)` → `#e8195a` |
| Cabeçalho — texto | `rgb(255, 255, 255)` |
| Empresa | `MURICI TRANSPORTES` / `MURICI LOGISTICA` |
| Subtítulo | `Unidade Central` |
| Resumo — fundo | `rgb(255, 240, 244)` → rosa claro |
| Tabela — cabeçalho | `fillColor:[232,25,90]`, `textColor:255`, `fontStyle:'bold'` |
| Tabela — linhas alternadas | `fillColor:[255,248,250]` → rosa quase branco |
| Fonte tabela | 7–8pt |
| Cell padding | 2mm |
| Rodapé | "Plataforma de Gestão Operacional — Transportadora" + "Página X de Y" |
| Rodapé — cor | `rgb(170,170,170)`, 7pt |

### PDF de Recargas (especificação adicional)

| Propriedade | Valor |
|---|---|
| Logo "M" | caixa branca 12×12mm no canto esquerdo, texto `M` em vermelho |
| Cabeçalho empresa | `MURICI LOGISTICA` 13pt bold |
| Bloco de resumo | fundo `rgb(245,245,250)`, borda `rgb(220,220,230)` 0.3pt |
| Fundo colaborador par | `rgb(235,240,255)` |
| Fundo colaborador ímpar | `rgb(240,245,235)` |
| Header colunas por colaborador | fundo `rgb(50,55,70)`, texto branco, 6.5pt |
| Linhas pares | `rgb(252,253,255)` |
| Linha total | linha vermelha 0.4pt separadora |
| Rodapé | fundo `rgb(245,245,248)` |
| Cor motorista | `rgb(40,80,200)` azul |
| Cor ajudante | `rgb(20,20,40)` escuro |
| Cor valores | `rgb(0,140,70)` verde |

---

## 14. CONFIRMAÇÃO

> **Dossiê gerado a partir de leitura REAL do repositório, Supabase e configs do Vercel.**

- Repositório lido: `C:\Users\Desktop\portfolio\murici-ipiranga\index.html` (2.585 linhas)
- Supabase consultado: projeto `pneakxdlbyuysjorhjdu` — 12 tabelas mapeadas com schemas completos
- Vercel consultado: projeto `prj_qiIMnKXbQeUqioLfXZYeI8fbhjLj` — 20 deployments listados
- Data de geração: 2026-05-12

---

*Desenvolvido por Salviano Lopes — lopes.salviano@gmail.com*
