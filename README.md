# 💵 Refund App API

## Objetivo do Projeto

Este projeto foi desenvolvido com o propósito principal de estudo e aprimoramento de habilidades específicas no backend. O foco central não foi construir uma aplicação totalmente pronta para produção, mas sim dominar ferramentas e conceitos arquiteturais essenciais no fluxo de desenvolvimento. Os principais aprendizados aplicados incluem a configuração de linters e ferramentas de formatação, integração de hooks de pré-commit para automação da qualidade de código, implementação de paginação no banco de dados e o gerenciamento robusto de uploads de arquivos.

## Considerações

A estrutura atual reflete o foco no aprendizado contínuo e no domínio das tecnologias propostas. A lógica de negócio foi mantida junto aos controladores e o banco de dados utilizado é o SQLite, decisões arquiteturais tomadas para priorizar a agilidade na prototipação e focar no domínio do ecossistema e das automações de linting.

Para escalar esta API para um ambiente de produção real, as seguintes melhorias técnicas e de infraestrutura seriam os próximos passos fundamentais, demonstrando uma visão clara do ciclo de vida de um software em nível de mercado:

### Processo de Build e Execução

- **Configurações de Build:** Implementação de um processo de transpilação do código TypeScript para JavaScript (utilizando `tsc` ou bundlers como `tsup`), gerando arquivos otimizados em um diretório de saída (`dist` ou `build`).
- **Scripts de Produção:** Criação de scripts definitivos no `package.json`, como `npm run build` para a etapa de compilação e `npm start` para rodar a aplicação diretamente dos arquivos transpilados (ex: `node dist/server.js`).

### Infraestrutura e Deploy

- **Containerização:** Uso de Docker para empacotar a aplicação, gerenciador de pacotes e o ambiente de execução em uma imagem. Isso garante paridade total entre os ambientes de desenvolvimento, homologação e produção.

### Automação e Qualidade

- **Testes Automatizados:** Implementação de testes unitários, de integração e ponta a ponta (E2E) utilizando ferramentas do ecossistema. A cobertura de testes é o pilar central para garantir a confiabilidade do sistema e prevenir regressões a cada nova feature ou refatoração.

### Refatoração e Persistência de Dados

- **Bancos de Dados para Produção:** Migração definitiva do ambiente SQLite para um Sistema Gerenciador de Banco de Dados Relacional (SGBDR) preparado para alta concorrência e volume de dados, como o PostgreSQL.
- **Refatoração de Arquitetura:** Com a evolução do projeto, torna-se indispensável extrair a lógica de negócios presente nos controladores para uma camada dedicada de Serviços (Services). Essa separação de responsabilidades facilita a manutenção, permite a injeção de dependências e torna a base de código amplamente testável.

## 💻 Tecnologias e Ferramentas

- Node.js com Express
- TypeScript
- Prisma ORM
- SQLite (Prototipação)
- Multer (Processamento de uploads)
- JSON Web Tokens (JWT) para autenticação
- ESLint e Prettier para padronização de código
- Husky e lint-staged para automação de verificações no pré-commit

## 📄 Documentação de Rotas e Fluxo da Aplicação

### Cadastro e Autenticação

O fluxo inicial exige que o usuário crie uma conta e se autentique para acessar os recursos da API.

- **POST /users**: O cliente envia `name`, `email` e `password` em formato JSON para registrar um novo perfil.
- **POST /sessions**: O cliente envia `email` e `password`. Em caso de sucesso, a API retorna um token Bearer, que o usuário deverá incluir no cabeçalho (`Authorization`) das próximas requisições.

### Processamento de Arquivos

Tratamento para o envio de documentos comprobatórios das despesas.

- **POST /uploads**: O cliente envia o documento via formulário (`multipart/form-data`) através do campo `file`. A API processa com o Multer, salva no disco e retorna o nome único do arquivo (`filename`).
- **GET /uploads/:filename**: Rota para acessar o arquivo salvo, permitindo a visualização do comprovante no lado do cliente.

### Gerenciamento de Reembolsos

Com o token Bearer e o arquivo salvo, o usuário interage com o fluxo principal de despesas.

- **POST /refunds**: Criação da solicitação de reembolso. O cliente envia um JSON contendo `name` (descrição), `category`, `amount` e o `filename` recebido previamente na rota de upload.
- **GET /refunds**: Listagem dos pedidos. O cliente pode enviar parâmetros na URL para filtrar resultados (`name`) e navegar pelos dados de forma paginada e otimizada enviando as chaves `page` e `perPage`.
- **GET /refunds/:id**: Retorna os detalhes de um pedido de reembolso específico através de seu identificador na URL.

## ⚙️ Configuração e Execução

### Instalação de Dependências

Clone este repositório, acesse a pasta raiz pelo seu terminal e baixe os pacotes necessários executando o comando:

```
npm install
```

### Configuração do Banco de Dados

Com os pacotes instalados, você precisa gerar o cliente do Prisma e criar as tabelas no banco de dados SQLite. Execute os dois comandos abaixo em sequência:

```
npx prisma generate
npx prisma migrate dev
```

### Visualização do Banco de Dados

Para visualizar e gerenciar as tabelas e registros salvos através de uma interface gráfica no seu navegador, inicie o painel do Prisma com o comando:

```
npx prisma studio
```

### Inicialização do Servidor

Para colocar a API no ar e começar a receber requisições no ambiente de desenvolvimento local, utilize o comando:

```
npm run dev
```
