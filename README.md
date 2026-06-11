# Cyber Portfolio | Portfólio Pessoal Dinâmico

Este é o repositório do meu portfólio pessoal dinâmico, desenvolvido em **Node.js** e **Express**, com um design cyberpunk premium, suporte a *glassmorphism*, micro-animações, e um painel integrado para carregar novos projetos.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/RKRomao/portfolio.git
   cd portfolio
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor local:**
   ```bash
   node app.js
   ```

4. **Aceda no seu navegador:**
   Abra [http://localhost:3000](http://localhost:3000). A página principal e o painel de upload estarão disponíveis.

---

## 📁 Estrutura de Arquivos

A estrutura do projeto está organizada da seguinte forma:

```text
portfolio/
├── data/
│   └── projects.json       # Base de dados em ficheiro JSON dos projetos
├── public/                 # Ficheiros estáticos servidos ao cliente
│   ├── css/
│   │   └── style.css       # Folha de estilos Cyberpunk (com glassmorphism)
│   ├── js/
│   │   ├── main.js         # JavaScript principal e Scroll Spy
│   │   ├── navigation.js   # Lógica do menu responsivo
│   │   └── parallax.js     # Efeito parallax de formas flutuantes
│   └── uploads/            # Pasta onde são guardadas as imagens enviadas
├── views/                  # Templates de visualização (EJS)
│   ├── includes/           # Componentes parciais (header, footer, hero, etc.)
│   ├── about.ejs           # Página "Sobre Mim" com timeline
│   ├── contact.ejs         # Formulário de contacto
│   ├── index.ejs           # Página inicial com grid de projetos e skills
│   ├── layout.ejs          # Base/Casca HTML global (EJS-Mate)
│   ├── project.ejs         # Detalhes de um projeto específico
│   └── upload.ejs          # Formulário de carregamento com Live Preview
├── app.js                  # Ponto de entrada do servidor Node.js/Express
├── package.json            # Manifesto do projeto e dependências
└── README.md               # Este ficheiro
```

---

## 🛠 Tecnologias Utilizadas

- **Backend**: Node.js & Express.js
- **Templates**: EJS & EJS-Mate (para layouts integrados DRY)
- **Upload de Ficheiros**: Express File Upload & UUID
- **Design & Estilo**: CSS3 Puro, variáveis CSS, gradientes neon, micro-animações e *backdrop-filter* (glassmorphism)
- **Iconografia**: Font Awesome 6
- **Tipografia**: Google Fonts (fontes *Orbitron* e *Roboto*)

---

## ☁️ Alojamento e Deploy

Por ser uma aplicação dinâmica que executa código no lado do servidor, **não funcionará diretamente no GitHub Pages** (que serve apenas ficheiros estáticos).

Recomenda-se o deploy gratuito em serviços como:

### 1. Render (Recomendado)
- Crie um serviço Web no [Render](https://render.com/).
- Conecte este repositório.
- Defina o **Build Command** como `npm install`.
- Defina o **Start Command** como `node app.js`.

### 2. Vercel
- Pode ser implementado através de rotas serverless configurando um ficheiro `vercel.json` na raiz do projeto.

---

Desenvolvido por [Ricardo Köenig Romão](https://github.com/RKRomao)
