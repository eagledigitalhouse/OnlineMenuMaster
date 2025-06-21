# Deploy na Netlify - Guia Completo 🚀

## 📋 Pré-requisitos

1. ✅ Conta no [Netlify](https://netlify.com)
2. ✅ Repositório Git (GitHub, GitLab, etc.)
3. ✅ Código commitado e publicado no repositório

## 🔧 Configurações Já Preparadas

Este projeto já está configurado com:

- ✅ `netlify.toml` - Configurações de build e deploy
- ✅ `_redirects` - Redirecionamentos para SPA (Single Page Application)
- ✅ `build:client` script - Build apenas do frontend
- ✅ Headers de segurança e cache otimizados

## 🚀 Passos para Deploy

### 1. Prepare o Repositório

```bash
# Certifique-se de que todas as alterações estão commitadas
git add .
git commit -m "Preparação para deploy Netlify"
git push origin main
```

### 2. Configure o Site na Netlify

1. **Login no Netlify** e clique em "New site from Git"
2. **Conecte seu repositório** (GitHub/GitLab/Bitbucket)
3. **Selecione o repositório** do seu projeto
4. **Configure o build:**
   - **Base directory:** `menu`
   - **Build command:** `npm run build:client`
   - **Publish directory:** `dist/public`

### 3. Configurações Importantes

#### ⚙️ Build Settings
- **Node.js version:** 18.x (será configurado automaticamente)
- **Package manager:** npm
- **Build timeout:** 15 minutes (padrão é suficiente)

#### 🔗 Domain & DNS
Após o deploy, você pode:
- Usar o domínio gerado automaticamente (ex: `app-name.netlify.app`)
- Configurar domínio customizado nas configurações do site

## 🎯 Funcionalidades Configuradas

### ✅ Single Page Application (SPA)
- Todas as rotas (`/`, `/welcome`, `/programacao`, etc.) funcionarão corretamente
- Redirecionamentos configurados no `_redirects`

### ✅ Otimizações de Performance
- Cache de 1 ano para assets estáticos
- Headers de segurança configurados
- Compressão automática

### ✅ Rotas Funcionais
- `/` - Página inicial (cardápio)
- `/welcome` - Página de boas-vindas
- `/programacao` - Programação do evento
- `/favorites` - Favoritos
- `/admin` - Área administrativa

## ⚠️ Importante: Backend/API

**ATENÇÃO:** Este projeto possui um backend Express.js que NÃO será deployado no Netlify (apenas o frontend).

### Opções para o Backend:

#### 📱 **Opção 1: Netlify Functions (Recomendado)**
- Converter as rotas da API para Netlify Functions
- Mantém tudo no mesmo domínio

#### 🚀 **Opção 2: Deploy Separado**
- Deploy do backend no Heroku, Railway, Render, etc.
- Configurar CORS para permitir requisições do frontend

#### 🔧 **Opção 3: Desenvolvimento Local**
- Manter backend rodando localmente para testes
- Frontend na Netlify conectando ao localhost (apenas para desenvolvimento)

## 🛠️ Scripts Disponíveis

```bash
# Build apenas do frontend (usado pela Netlify)
npm run build:client

# Build completo (frontend + backend)
npm run build

# Desenvolvimento local
npm run dev

# Type checking
npm run check
```

## 🔍 Verificações Pós-Deploy

Após o deploy, verifique:

1. ✅ **Navegação entre páginas** funciona corretamente
2. ✅ **Assets (imagens, CSS)** carregam sem erro
3. ✅ **Rotas dinâmicas** redirecionam corretamente
4. ⚠️ **Funcionalidades que dependem da API** (administração, dados dinâmicos)

## 🚨 Troubleshooting

### Erro 404 nas rotas
- Verifique se o arquivo `_redirects` está na pasta `client/public/`
- Confirme que o `netlify.toml` está na raiz do projeto

### Build falha
- Verifique se o script `build:client` existe no `package.json`
- Confirme que o **base directory** está configurado como `menu`

### Assets não carregam
- Verifique se as imagens estão em `client/public/assets/`
- Confirme que os caminhos nas URLs começam com `/assets/`

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs de build na interface da Netlify
2. Console do navegador para erros de JavaScript
3. Network tab para requisições que falham

---

**✨ Pronto!** Seu projeto FENUI está configurado para deploy na Netlify com todas as otimizações necessárias. 