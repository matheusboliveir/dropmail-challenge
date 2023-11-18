# DropMail.me Challenge

Desafio proposto pela Teddy Open Finance em conjunto com Coodesh

### Desafio

Criar uma solução para maior segurança e simplicidade ao lidar com o compartilhamento de endereços de e-mail online. Ao enfrentar a necessidade comum de registrar-se em serviços, a aplicação oferece a funcionalidade de criar e utilizar endereços de e-mail temporários, preservando a privacidade do usuário e reduzindo riscos como spam e publicidade invasiva.

### Processo de desenvolvimento

1. **Documentação DropMail.me:** Comecei o desenvolvimento lendo a documentação da API, cheguei a conclusão de utilizar os endpoints HTTP já que não existe diferença entre eles e os endpoints WebSocket ainda.
2. **CORS**: Durante os testes dos endpoints tive problemas de CORS que resolvi o problema utilizando o servidor proxy CORS-Anywhere durante o desenvolvimento.
3. **Estilização**: Criei o estilo utilizando somente com Bootstrap.
4. **Services**: Criei os services core do projeto: email.service - criação de sessão e listagem de InBox utilizando o Apollo, session.service - gerencia a sessão no localstorage.
5. **Auto Reload**: Utilizando a propriedade pollInterval do Apollo criei o auto reload de 15 em 15 segundos.
6. **Mobile**: Utilizei o utilitário BreakpointObserver para definir quando mostrar o mobile, para a listagem de email no mobile achei mais apropriado usar os Accordions do Angular material.
7. **Notificação**: A partir da Notifications API criei o service de notificação e defini quando a guia não estava focada pelo HostListener window:focus e window:blur.
8. **Deploy**: Fiz o deploy sem problemas pela Vercel, porem ainda tinha o problema do servidor de proxy então fiz um fork do CORS-Anywhere removi a necessidade de pedir permissão e subi a aplicação pelo Railway.
9. **DockerFile**: Criei um DockerFile simples de build com nginx.

## Tecnologias Utilizadas

![Typescript ](https://img.shields.io/badge/v5.1.6--0af?logo=Typescript&logoColor=ffffff) Typescript - Linguagem de programação
![Angular](https://img.shields.io/badge/v16.2.12--F44336?logo=Angular&logoColor=ffffff) Angular - Framework base do projeto
![Bootstrap ](https://img.shields.io/badge/v5.3.2--653592?logo=Bootstrap&logoColor=ffffff) Bootstrap - Utilizado em praticamente toda estilização do projeto
![Angular Material](https://img.shields.io/badge/v16.2.12--ff0?logo=angular&logoColor=ffffff) Angular Material - Utilitários e Componentes utilizados para criar o mobile
![GraphQL ](https://img.shields.io/badge/v16--E10098?logo=graphql&logoColor=ffffff) GraphQL - Linguagem de consulta utilizada para comunicação com a API
![Apollo Angular](https://img.shields.io/badge/v5.0.2--F44336?logo=graphql&logoColor=ffffff) Apollo Angular - Utilizado para gerenciar as comunicações GraphQL com a API

## Instalação

1. Primeiro instale o Angular CLI globalmente - Versão recomendada: 16.2.12:

```bash
  npm install -g @angular/cli@16
```

Caso não queira usar a versão recomendada remover @16.

2. Na pasta do projeto instale as dependências com:

```bash
  npm install
```

3. Após terminar de instalar execute o projeto com:

```bash
  ng serve -o
```

"-o" Não obrigatório, ele só faz abrir o navegador após compilar o projeto

> This is a challenge by Coodesh
