# Bolão Copa do Mundo 2026 — Instruções completas

## Pré-requisitos

- Node.js 18+ instalado
- Conta gratuita no [Supabase](https://supabase.com)

---

## 1. Configurar o Supabase

### 1.1 Criar projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em **New Project**
3. Escolha um nome (ex: `bolao-copa-2026`), senha e região
4. Aguarde o projeto criar (cerca de 1 minuto)

### 1.2 Executar o schema

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**
3. Cole o conteúdo do arquivo `supabase/schema.sql` e execute (clique em **Run**)
4. Aguarde executar sem erros

### 1.3 Importar os jogos da Copa 2026

1. Crie outra query no SQL Editor
2. Cole o conteúdo do arquivo `supabase/matches_copa2026.sql` e execute
3. Isso vai inserir as 48 seleções e os 104 jogos cadastrados

### 1.4 Pegar as chaves de API

1. No menu lateral, vá em **Settings → API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (a chave pública)

---

## 2. Configurar o projeto

1. Na pasta `bolao-copa-2026`, copie o arquivo de exemplo:

```bash
copy .env.example .env
```

2. Edite o arquivo `.env` com suas chaves:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

---

## 3. Instalar e rodar

```bash
cd bolao-copa-2026
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## 4. Criar o primeiro usuário administrador

1. Acesse `http://localhost:5173/cadastro` e crie sua conta
2. Vá ao Supabase → SQL Editor e execute:

```sql
update public.profiles
set role = 'admin'
where email = 'seu-email@exemplo.com';
```

3. Recarregue a página — o menu **Administração** vai aparecer

---

## 5. Como usar o sistema

### Fluxo do administrador

1. **Cadastrar seleções** → Admin → Seleções
2. **Cadastrar jogadores** → Admin → Jogadores (para palpites de goleadores)
3. **Criar jogos** → Admin → Jogos (ou use o SQL `matches_copa2026.sql`)
4. **Lançar resultados** → Admin → Resultados
   - Selecione o jogo
   - Informe o placar
   - Marque os goleadores
   - Clique em **Salvar resultado** (calcula os pontos automaticamente)

### Fluxo do participante

1. Cria uma conta em `/cadastro`
2. Acessa os jogos disponíveis em `/jogos`
3. Faz palpites antes do horário de início
4. Acompanha pontuação em `/meus-palpites`
5. Vê o ranking em `/ranking`

---

## 6. Sistema de pontuação

| Acerto               | Pontos |
|----------------------|--------|
| Placar exato         | +10    |
| Vencedor/empate certo| +5     |
| Goleador acertado    | +1 cada|

- Palpites ficam bloqueados automaticamente no horário do jogo
- Gols de pênaltis **não contam** para pontuação de goleadores
- O ranking atualiza automaticamente após salvar resultados

---

## 7. Estrutura do projeto

```
bolao-copa-2026/
├── src/
│   ├── components/
│   │   ├── admin/         # Componentes da área administrativa
│   │   ├── ui/            # Botões, Cards, Inputs, etc.
│   │   ├── Layout.tsx     # Menu e estrutura geral
│   │   ├── MatchCard.tsx  # Card de jogo
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Autenticação global
│   ├── hooks/             # React Query hooks
│   ├── lib/
│   │   ├── supabase.ts    # Cliente Supabase
│   │   └── utils.ts       # Funções utilitárias
│   ├── pages/             # Páginas da aplicação
│   └── types/             # Tipos TypeScript
├── supabase/
│   ├── schema.sql         # Schema completo + RLS
│   └── matches_copa2026.sql # Jogos e seleções
└── .env.example
```

---

## 8. Publicar em produção (Vercel)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Conecte ao repositório GitHub (crie um repo e suba o código com `git`)
3. No Vercel, configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

Alternativamente, build local e upload manual:
```bash
npm run build
# Copie a pasta dist/ para seu servidor
```

---

## 9. Sugestões de melhorias futuras

- **Grupos e bolões privados** — criar múltiplos bolões com convite
- **Push notifications** — notificar usuário antes do jogo começar
- **Palpite de campeão** — palpitar quem ganha o torneio inteiro
- **Relatório PDF** — exportar ranking em PDF
- **PWA** — transformar em app instalável
- **Histórico de odds** — mostrar quem é favorito em cada jogo
- **Modo mata-mata automático** — preencher confrontos automaticamente com os classificados
- **Gamificação** — conquistas e badges por desempenho
- **Chat** — sala de comentários por partida
- **Multilíngue** — EN/ES além do PT-BR

---

## 10. Segurança (RLS resumido)

| Operação                        | Regra                                  |
|---------------------------------|----------------------------------------|
| Ver palpites antes do jogo      | Apenas o próprio usuário ou admin      |
| Ver palpites após início        | Todos os usuários autenticados         |
| Fazer palpite                   | Apenas antes do horário do jogo        |
| Editar palpite                  | Apenas antes do horário do jogo        |
| Lançar resultado                | Apenas admin                           |
| Cadastrar times/jogadores/jogos | Apenas admin                           |
| Ver ranking                     | Todos os usuários autenticados         |
