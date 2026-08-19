# Property Connect Hub

MVP — Plataforma Web para Imobiliária

1. Objetivo do projeto

Quero desenvolver um MVP de uma plataforma web para uma imobiliária.

O sistema terá dois ambientes principais:

Área pública, destinada aos clientes da imobiliária, onde poderão visualizar, pesquisar e filtrar imóveis.

Área administrativa, destinada aos funcionários da imobiliária, onde poderão cadastrar, editar, publicar, despublicar e excluir imóveis, além de fazer upload das imagens.

O objetivo principal do MVP é:

Permitir que a imobiliária cadastre seus imóveis e que potenciais clientes encontrem esses imóveis facilmente e entrem em contato com a imobiliária.

Não implemente funcionalidades que não sejam necessárias para esse objetivo inicial.

2. Stack obrigatória

Utilize as seguintes tecnologias:

Linguagem

TypeScript

Evite JavaScript puro sempre que possível.

Utilize tipagem forte.

Evite any.

Crie interfaces/types quando necessário.

Frontend

Next.js

React

App Router

Tailwind CSS

Componentização reutilizável

Layout totalmente responsivo

Backend

Utilizar as funcionalidades server-side do próprio Next.js.

Server Components quando fizer sentido

Server Actions ou Route Handlers quando apropriado

Separação clara entre lógica de apresentação e lógica de negócio

Banco de dados

PostgreSQL

ORM

Prisma

Autenticação

Utilizar uma solução segura de autenticação para a área administrativa.

A área administrativa deve exigir autenticação.

Imagens

Estruturar o sistema para armazenamento de imagens de imóveis.

A implementação pode utilizar inicialmente uma solução compatível com o ambiente de desenvolvimento, mas a arquitetura deve permitir posteriormente utilizar armazenamento externo, como S3 ou serviço equivalente.

3. Regras gerais de desenvolvimento

Antes de começar a implementar:

Analise os requisitos.

Crie uma arquitetura inicial.

Defina os modelos do banco.

Defina as principais rotas.

Defina os componentes reutilizáveis.

Só então comece a implementação.

Não tente implementar todo o sistema de uma única vez.

Divida o desenvolvimento em etapas.

Ao terminar cada etapa:

verifique erros de TypeScript;

verifique erros de lint;

verifique problemas de build;

valide os fluxos implementados;

corrija problemas antes de continuar.

Não remova funcionalidades existentes para corrigir um problema sem explicar a razão.

Não altere a stack definida neste documento sem necessidade.

Não instale dependências desnecessárias.

4. Público-alvo

O sistema terá dois tipos principais de usuários:

Cliente

Não precisa necessariamente criar uma conta.

Pode:

acessar o site;

visualizar imóveis;

pesquisar imóveis;

utilizar filtros;

abrir a página de detalhes;

visualizar fotos;

visualizar informações do imóvel;

entrar em contato com a imobiliária pelo WhatsApp;

entrar em contato por e-mail.

Administrador

Usuário autenticado responsável por administrar os imóveis.

Pode:

acessar o painel administrativo;

cadastrar imóveis;

editar imóveis;

excluir imóveis;

publicar imóveis;

despublicar imóveis;

cadastrar fotos;

excluir fotos;

definir foto principal;

visualizar imóveis cadastrados.

5. Área pública

Página inicial

Criar uma homepage profissional para a imobiliária.

A página deve conter:

Header

Logo/nome da imobiliária

Link para início

Link para imóveis

Link para contato

Botão para acessar imóveis

Hero

Uma seção visual destacando a busca por imóveis.

Exemplo:

"Encontre o imóvel ideal para você"

Adicionar mecanismo de busca.

Filtros principais:

finalidade;

tipo de imóvel;

cidade;

faixa de preço.

Botão:

"Buscar imóveis"

Imóveis em destaque

Mostrar alguns imóveis publicados.

Cada card deve apresentar:

imagem principal;

título;

tipo;

cidade;

bairro;

preço;

finalidade;

informações resumidas;

botão "Ver imóvel".

Call to Action

Criar uma seção incentivando o visitante a entrar em contato com a imobiliária.

Footer

Informações básicas:

nome da imobiliária;

telefone;

WhatsApp;

e-mail;

endereço, caso cadastrado;

links importantes.

6. Página de listagem de imóveis

Criar uma página:

/imoveis

Essa página exibirá os imóveis publicados.

Criar sistema de filtros.

Filtros obrigatórios

Finalidade

Venda

Aluguel

Tipo

Casa

Apartamento

Terreno

Lote

Fazenda

Chácara

Sala comercial

Galpão

A arquitetura deve permitir adicionar novos tipos posteriormente.

Localização

Cidade

Bairro

Preço

Preço mínimo

Preço máximo

Características

Quando aplicável:

quartos;

banheiros;

suítes;

vagas;

área mínima;

área máxima.

7. Comportamento dos filtros

Os filtros devem funcionar em conjunto.

Exemplo:

O usuário pode selecionar:

Finalidade:
Venda

Tipo:
Casa

Cidade:
Alto Paraíso

Preço máximo:
R$ 800.000

O sistema deve retornar apenas os imóveis que correspondam aos filtros.

Os filtros devem ser refletidos na URL sempre que fizer sentido.

Exemplo:

/imoveis?tipo=casa&finalidade=venda&cidade=alto-paraiso

Isso permite compartilhar uma pesquisa específica.

Também deve existir uma opção para limpar os filtros.

8. Cards dos imóveis

Criar um componente reutilizável:

PropertyCard

O card deve conter:

imagem;

título;

tipo;

finalidade;

cidade;

bairro;

preço;

área;

quartos;

banheiros;

botão para visualizar.

Caso alguma informação não seja aplicável ao imóvel, não exibir um campo vazio desnecessariamente.

Exemplo:

Um lote não precisa mostrar quartos.

9. Página de detalhes do imóvel

Criar uma rota:

/imoveis/[id]

Essa página deve apresentar todas as informações relevantes do imóvel.

Galeria

Mostrar:

foto principal;

demais fotos;

navegação entre imagens;

visualização responsiva.

Informações

Mostrar:

título;

preço;

finalidade;

tipo;

cidade;

bairro;

endereço, se definido para exibição pública;

área do terreno;

área construída;

quartos;

banheiros;

suítes;

vagas;

descrição;

características.

Código do imóvel

Cada imóvel deve possuir um identificador/código público.

Exemplo:

Código do imóvel: IMV-00123

10. Contato pelo WhatsApp

Na página de detalhes do imóvel, criar um botão:

"Tenho interesse"

Esse botão deve abrir o WhatsApp da imobiliária.

A mensagem deve ser pré-preenchida.

Exemplo:

"Olá! Tenho interesse no imóvel IMV-00123. Gostaria de receber mais informações."

O número do WhatsApp não deve ficar espalhado pelo código.

Utilizar variável de ambiente ou configuração centralizada.

11. Contato por e-mail

Também deve existir opção de contato por e-mail.

Criar um formulário:

Nome

E-mail

Telefone

Mensagem

A mensagem deve identificar automaticamente o imóvel pelo qual o cliente demonstrou interesse.

Exemplo:

"Interesse no imóvel IMV-00123"

Validar os campos.

Criar tratamento de erros e mensagens de sucesso.

Não permitir envio de formulário inválido.

12. Área administrativa

Criar uma área separada:

/admin

A área administrativa deve exigir autenticação.

Usuários não autenticados devem ser redirecionados para:

/admin/login

13. Login administrativo

Criar página:

/admin/login

Campos:

e-mail;

senha.

Adicionar:

validação;

mensagens de erro;

proteção contra acesso não autorizado;

logout.

Não criar cadastro público de administradores no MVP.

Administradores devem ser criados de maneira controlada.

14. Dashboard administrativo

Após login:

/admin/dashboard

Mostrar informações resumidas:

quantidade total de imóveis;

imóveis publicados;

imóveis não publicados;

imóveis à venda;

imóveis para aluguel.

Também mostrar os imóveis adicionados recentemente.

Criar navegação para:

Dashboard

Imóveis

Novo imóvel

Configurações

Sair

15. Gerenciamento de imóveis

Criar:

/admin/imoveis

Mostrar tabela/listagem administrativa.

Cada imóvel deve apresentar:

imagem;

título;

tipo;

finalidade;

cidade;

preço;

status;

data de criação;

ações.

Ações:

visualizar;

editar;

publicar/despublicar;

excluir.

16. Cadastro de imóvel

Criar:

/admin/imoveis/novo

O formulário deve permitir cadastrar:

Informações principais

título;

descrição;

tipo;

finalidade;

preço;

status.

Localização

cidade;

bairro;

endereço;

CEP.

Características

área do terreno;

área construída;

quartos;

banheiros;

suítes;

vagas.

Todos os campos devem possuir validação adequada.

Campos que não fazem sentido para determinado tipo de imóvel podem ser opcionais.

Exemplo:

Terreno:

quartos não são obrigatórios;

banheiros não são obrigatórios.

17. Upload de imagens

No cadastro e edição do imóvel deve existir uma área para upload de imagens.

Permitir:

múltiplas imagens;

visualizar preview;

remover imagens;

definir imagem principal.

A imagem principal será utilizada nos cards e na listagem.

Validar:

formato;

tamanho;

quantidade máxima, se definida.

Não confiar apenas na validação do frontend.

18. Edição de imóvel

Criar:

/admin/imoveis/[id]/editar

Permitir editar todos os dados cadastrados.

Também permitir:

adicionar novas imagens;

excluir imagens;

alterar imagem principal;

publicar;

despublicar.

19. Exclusão

Ao excluir um imóvel, pedir confirmação.

Exemplo:

"Tem certeza que deseja excluir este imóvel?"

Evitar exclusão acidental.

Também tratar corretamente as imagens associadas.

20. Status do imóvel

O imóvel deve possuir status.

Inicialmente:

Rascunho

Publicado

Vendido

Alugado

Indisponível

Somente imóveis com status apropriado para exibição pública devem aparecer na área pública.

O administrador deve conseguir alterar o status.

21. Modelo de dados

Criar inicialmente os modelos necessários para:

User

Representar usuários administrativos.

Campos esperados:

id;

name;

email;

password/hash;

createdAt;

updatedAt.

Property

Representar imóveis.

Campos esperados:

id;

publicCode;

title;

description;

propertyType;

transactionType;

status;

price;

city;

neighborhood;

address;

zipCode;

landArea;

builtArea;

bedrooms;

bathrooms;

suites;

parkingSpaces;

createdAt;

updatedAt.

PropertyImage

Representar imagens dos imóveis.

Campos esperados:

id;

propertyId;

url/path;

isPrimary;

createdAt.

Criar relacionamento:

Property 1:N PropertyImage

22. Enums

Utilizar enums/tipos bem definidos para valores controlados.

Exemplo:

PropertyType

HOUSE

APARTMENT

LAND

LOT

FARM

FARMHOUSE

COMMERCIAL_ROOM

WAREHOUSE

TransactionType

SALE

RENT

PropertyStatus

DRAFT

PUBLISHED

SOLD

RENTED

UNAVAILABLE

Não utilizar strings espalhadas pelo sistema quando um enum/tipo puder ser utilizado.

23. Banco de dados

Utilizar PostgreSQL com Prisma.

Criar:

schema Prisma;

migrations;

seed inicial.

Criar alguns imóveis fictícios no seed para facilitar o desenvolvimento e testes.

Os dados do seed devem deixar claro que são dados de desenvolvimento.

24. Design

O site deve possuir aparência profissional de uma imobiliária moderna.

Priorizar:

simplicidade;

confiança;

boa hierarquia visual;

fotos grandes;

boa tipografia;

espaçamento adequado;

cards limpos;

navegação intuitiva.

Não criar um design excessivamente complexo.

O site deve parecer um produto real, não um template genérico de programação.

25. Responsividade

O sistema deve funcionar corretamente em:

desktop;

notebook;

tablet;

celular.

Priorizar experiência mobile.

No celular:

menu responsivo;

filtros adaptados;

cards em uma coluna;

galeria adaptada;

botões de contato fáceis de utilizar.

26. SEO

Como a área pública será um catálogo de imóveis, implementar boas práticas básicas de SEO.

Criar:

metadata;

title;

description;

URLs amigáveis;

páginas de imóveis indexáveis quando apropriado;

Open Graph básico.

Exemplo:

/imoveis/casa-alto-paraiso-3-quartos

Evitar URLs desnecessariamente complexas quando possível.

27. Segurança

Aplicar boas práticas básicas.

Principalmente:

proteger rotas administrativas;

validar dados no servidor;

validar upload de arquivos;

não expor credenciais;

utilizar variáveis de ambiente;

não armazenar senhas em texto puro;

proteger operações administrativas;

impedir usuários não autenticados de acessar APIs administrativas.

Nunca colocar secrets diretamente no código.

Criar .env.example sem valores secretos reais.

28. Estrutura de projeto

Organizar o projeto de forma profissional.

Separar claramente:

componentes;

páginas;

funcionalidades;

acesso ao banco;

validações;

autenticação;

serviços;

tipos;

utilitários.

Evitar colocar toda a lógica em uma única página ou componente.

Criar componentes reutilizáveis, por exemplo:

Header

Footer

PropertyCard

PropertyGallery

PropertyFilters

PropertyForm

PropertyFeatures

ContactButton

AdminSidebar

ConfirmDialog

ImageUploader

29. Tratamento de erros

Implementar estados para:

carregamento;

sucesso;

erro;

nenhum resultado;

imóvel inexistente;

acesso não autorizado.

Exemplo:

Se nenhum imóvel corresponder ao filtro:

"Não encontramos imóveis com esses critérios."

Não deixar páginas quebradas ou telas vazias sem explicação.

30. Variáveis de ambiente

Criar .env.example.

Nunca colocar informações reais no Git.

Exemplos de variáveis:

DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=
EMAIL_FROM=
EMAIL_TO=
STORAGE_URL=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=


Utilizar apenas as variáveis realmente necessárias para a implementação escolhida.

31. Git

Organizar o projeto utilizando Git.

Criar commits pequenos e objetivos.

Exemplos:

feat: create property database schema
feat: create public property listing
feat: add property filters
feat: create admin authentication
feat: create property management
feat: add property image upload
feat: add WhatsApp contact
fix: validate property form


Não realizar commits contendo:

.env;

secrets;

credenciais;

arquivos desnecessários.

32. Ordem de implementação

Implementar o MVP nesta ordem:

Fase 1 — Fundação

criar projeto;

configurar TypeScript;

configurar Next.js;

configurar Tailwind;

configurar Prisma;

configurar PostgreSQL;

criar estrutura inicial;

configurar lint;

configurar environment variables.

Fase 2 — Banco

criar User;

criar Property;

criar PropertyImage;

criar enums;

criar relacionamentos;

criar migrations;

criar seed.

Fase 3 — Área pública

Header;

Footer;

Homepage;

listagem de imóveis;

PropertyCard;

página de detalhes;

galeria.

Fase 4 — Busca

filtros;

busca;

ordenação;

parâmetros na URL;

paginação, caso necessária.

Fase 5 — Administração

login;

proteção das rotas;

dashboard;

listagem administrativa;

cadastro;

edição;

exclusão;

publicação/despublicação.

Fase 6 — Imagens

upload;

preview;

exclusão;

imagem principal.

Fase 7 — Contato

WhatsApp;

formulário de e-mail;

mensagens pré-preenchidas;

validação.

Fase 8 — Polimento

responsividade;

loading states;

error states;

SEO;

acessibilidade;

validação;

segurança;

revisão visual.

33. O que NÃO implementar agora

Não implementar no MVP:

cadastro de clientes;

favoritos;

chat interno;

sistema de financiamento;

pagamentos;

CRM;

avaliações;

notificações complexas;

aplicativo mobile;

inteligência artificial;

recomendação automática de imóveis;

integração com portais imobiliários;

múltiplos níveis complexos de permissão;

sistema completo de corretores.

Essas funcionalidades podem ser adicionadas posteriormente.

34. Critério de sucesso do MVP

Considerarei o MVP funcional quando o seguinte fluxo funcionar completamente:

Administrador

Acessa /admin/login.

Faz login.

Acessa o dashboard.

Cadastra um imóvel.

Preenche informações.

Faz upload das fotos.

Define uma foto principal.

Publica o imóvel.

Cliente

Acessa a homepage.

Entra em "Imóveis".

Utiliza os filtros.

Encontra o imóvel.

Abre os detalhes.

Visualiza as fotos.

Visualiza todas as informações.

Clica em WhatsApp.

Recebe uma mensagem pré-preenchida com o código do imóvel.

Esse fluxo deve ser tratado como o principal fluxo do produto.

35. Regra importante para a implementação

Não invente funcionalidades fora deste escopo sem necessidade.

Se existir uma decisão técnica que não esteja definida neste documento, escolha a solução mais simples, segura e adequada ao MVP.

Se houver duas soluções possíveis, prefira aquela que:

seja mais simples;

tenha menor complexidade;

seja fácil de manter;

permita evolução futura;

mantenha o projeto profissional.

Antes de implementar uma grande mudança arquitetural, explique a decisão.

36. Primeiro passo

Não comece criando todas as funcionalidades.

Primeiro:

analise este documento;

apresente a arquitetura proposta;

apresente a estrutura de pastas;

apresente o schema inicial do Prisma;

apresente as principais rotas;

apresente as dependências necessárias;

explique brevemente as decisões técnicas.

Depois disso, aguarde minha aprovação para iniciar a implementação da Fase 1 — Fundação.

A partir daí, desenvolva uma fase por vez e só avance quando a fase atual estiver funcionando corretamente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/958e8eab-9151-4030-9439-a5c6ee76a682).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
