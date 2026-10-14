import { readingMinutes } from "@/components/Markdown";

// Artigos do blog. `body` é Markdown simples (##, ###, parágrafos, listas com "- " e "1. ", citações com "> ",
// **negrito**, *itálico* e [links](/caminho/)). Os minutos de leitura saem do próprio texto (readingMinutes).
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Palavra grande da capa tipográfica. */
  cover: string;
  category: string;
  date: string; // AAAA-MM-DD
  minutes: number;
  author: string;
  body: string;
  /** Serviço mais ligado ao artigo: a chamada final abre o formulário com ele escolhido. */
  service?: string;
};

/** O que as listagens precisam de um artigo (sem o texto, para não pesar a página). */
export type PostSummary = Pick<Post, "slug" | "title" | "excerpt" | "cover" | "category" | "date" | "minutes"> & {
  href: string;
  dateLabel: string;
};

const RAW: Omit<Post, "minutes">[] = [
  {
    slug: "landing-page-ou-site",
    title: "Landing page ou site completo: por onde começar?",
    excerpt: "As duas resolvem problemas diferentes. Veja qual faz mais sentido para o momento do seu negócio.",
    cover: "Uma página ou várias?",
    category: "Estratégia",
    date: "2026-10-06",
    author: "Equipe V8 Studio",
    body: `Quem decide investir na presença do negócio na internet costuma esbarrar na mesma dúvida logo no começo: fazer uma landing page ou um site completo? As duas opções resolvem problemas diferentes. A escolha certa depende menos do tamanho da sua empresa e mais do que você precisa que aconteça quando alguém chega até você.

Este guia explica a diferença sem jargão e termina com perguntas que ajudam a decidir.

## O que é uma landing page

Landing page é uma página única com um objetivo só. Tudo nela leva o visitante para a mesma ação: pedir um orçamento, agendar uma avaliação, garantir uma vaga, conhecer um cardápio.

Ela costuma ter um título forte, os benefícios principais, respostas para as dúvidas mais comuns e um botão que aparece mais de uma vez. Não tem menu com dez links nem caminhos que tirem a pessoa do foco.

É o destino ideal para anúncios. Quando você paga por cada clique, não faz sentido levar a pessoa para uma página inicial genérica e torcer para ela achar o que procura.

## O que é um site completo

O site completo, também chamado de site institucional, tem várias páginas: início, serviços, sobre a empresa, contato e, muitas vezes, um blog. Ele atende visitantes diferentes, com perguntas diferentes.

Um cliente quer saber o preço. Outro quer ver o endereço. Um terceiro quer conhecer a equipe antes de marcar. O site organiza tudo isso e funciona como o endereço oficial do seu negócio na internet.

Ele também ajuda a ser encontrado na busca, porque cada serviço pode ter a própria página, com as palavras que o cliente digita no Google.

## Quando a landing page é o melhor começo

- Você tem um serviço principal e quer vender mais dele agora.
- Vai investir em anúncios no Google ou no Instagram e precisa de um destino que transforme clique em contato.
- Tem uma oferta com data marcada: matrícula, lançamento, temporada, evento.
- Quer resultado rápido e prefere testar a mensagem antes de investir em algo maior.

Uma landing page é mais rápida de fazer e mais fácil de medir. Se o objetivo é um só, ela costuma ser o caminho mais curto.

## Quando o site completo faz mais sentido

- Você oferece vários serviços, para públicos diferentes.
- O seu cliente pesquisa bastante antes de decidir, como acontece com clínicas, escritórios, construtoras e escolas.
- Você quer aparecer na busca para vários assuntos, e não só para o nome da empresa.
- Precisa passar confiança mostrando estrutura, equipe, forma de trabalho e endereço.

Nesses casos, uma página só fica apertada. Ou ela vira uma página enorme, difícil de ler no celular, ou deixa de fora informações que o cliente precisa para escolher você.

## Os limites de cada formato

Nenhum dos dois resolve tudo. Vale conhecer os limites antes de decidir.

### A landing page

- Fica confusa quando tenta vender vários serviços ao mesmo tempo.
- Aparece na busca para poucos assuntos, porque tem uma página só.
- Pode parecer pouco para quem quer conhecer a empresa a fundo antes de contratar.

### O site completo

- Leva mais tempo para ficar pronto, porque tem mais páginas, textos e fotos.
- Divide a atenção: quem chega pela página inicial pode se perder entre os caminhos.
- Como destino de anúncio, costuma converter menos do que uma página focada.

## Cinco perguntas para decidir

1. Quantos serviços eu quero vender pela internet nos próximos meses?
2. De onde vão vir as visitas: anúncio, busca no Google, indicação ou redes sociais?
3. O que eu quero que a pessoa faça: pedir orçamento, agendar, comprar ou ligar?
4. O meu cliente decide rápido ou compara várias opções antes?
5. Para quando eu preciso disso no ar?

Se as respostas apontam para um serviço, visitas vindas de anúncio e uma ação clara, comece pela landing page. Se apontam para vários serviços, clientes que pesquisam e visitas vindas da busca, o site completo é o investimento certo.

## Dá para começar por um e chegar no outro

A escolha não é para sempre. Muitas empresas começam com uma landing page para o serviço que mais vende e, depois, ampliam para um site completo. Outras já têm um site e criam uma landing page para cada campanha.

O importante é planejar para não jogar trabalho fora. Domínio, identidade visual, textos e fotos feitos para a primeira página podem ser aproveitados no projeto seguinte, desde que tenham sido pensados com isso em mente.

> Comece pelo que traz cliente mais rápido, mas construa uma base que aguente crescer.

## O que não pode faltar em nenhum dos dois

- Uma frase clara, logo no topo, dizendo o que você faz e para quem.
- Um próximo passo evidente, com um botão que diga exatamente o que acontece ao clicar.
- Funcionamento impecável no celular, que é onde o seu cliente procura.
- Carregamento rápido, mesmo com a internet fraca.
- Informações reais: endereço, fotos do lugar e formas de contato que funcionam.

## Ainda em dúvida?

Veja como funcionam as nossas [landing pages](/servicos/landing-pages/) e os nossos [sites institucionais](/servicos/sites/). Se preferir, [conte o que você precisa](/comecar/): leva 2 minutos, e a proposta chega em até 1 dia útil, já com o formato que faz mais sentido para o seu momento.`,
  },
  {
    slug: "sinais-site-perdendo-clientes",
    title: "Cinco sinais de que o seu site está perdendo clientes",
    excerpt: "Visitas que não viram contato quase sempre têm a mesma causa. Dá para perceber em poucos minutos.",
    cover: "Cadê os contatos?",
    category: "Conversão",
    date: "2026-09-22",
    author: "Equipe V8 Studio",
    service: "sites",
    body: `O site recebe visitas, mas o telefone não toca e o formulário fica vazio. Quando isso acontece, a causa quase nunca é misteriosa. Na maior parte das vezes, o visitante chegou, não entendeu o que fazer e foi embora para o concorrente.

A boa notícia: dá para perceber os problemas mais comuns em poucos minutos, com o celular na mão.

## Antes de tudo, faça o teste do cliente

Desligue o Wi-Fi e abra o seu site no celular, usando a internet móvel. Finja que você nunca ouviu falar da sua empresa e acabou de encontrá-la numa busca. Marque quanto tempo leva para responder a duas perguntas:

- O que essa empresa faz?
- Como eu falo com ela?

Se qualquer uma das respostas demorar, você já encontrou o primeiro problema. Agora confira os sinais abaixo.

## 1. Ninguém entende o que você faz nos primeiros segundos

Frases como “Bem-vindo ao nosso site” ou “Qualidade e excelência em soluções” ocupam o lugar mais valioso da página sem dizer nada. O visitante não sabe se está no lugar certo e volta para a busca.

**Como corrigir:** troque o título por uma frase concreta. Diga o que você faz, para quem e, se o atendimento for local, onde. “Reformas de apartamento com orçamento detalhado e prazo por escrito” diz mais do que qualquer slogan. Veja como montar essa frase em [o que escrever na primeira tela do seu site](/blog/primeira-tela-do-site/).

## 2. O caminho até o contato é longo demais

O contato só aparece no rodapé ou numa página separada. O formulário pede doze informações. O botão de WhatsApp abre um número antigo. Cada obstáculo desses faz alguém desistir.

**Como corrigir:** coloque um botão de contato na primeira tela e repita ao longo da página. Peça no formulário só o necessário para responder: nome, telefone e o que a pessoa precisa. Teste todos os botões e links pelo menos uma vez por mês.

## 3. O site demora para abrir no celular

Imagens enormes, vídeos que tocam sozinhos, efeitos pesados e complementos instalados ao longo dos anos deixam o site lento. Enquanto a página carrega, o visitante desiste e toca no próximo resultado.

**Como corrigir:** reduza o tamanho das imagens antes de publicar, retire o que não ajuda a vender e confira se a hospedagem dá conta das suas visitas. Ferramentas gratuitas, como o PageSpeed Insights, do Google, mostram o que está pesando.

## 4. As informações estão desatualizadas

Preço antigo, endereço da loja anterior, horário que mudou, promoção de Natal no meio do ano, link para uma rede social abandonada. Para quem visita, isso passa uma mensagem clara: talvez essa empresa nem exista mais.

**Como corrigir:** reserve meia hora por mês para revisar o site inteiro. E garanta que você mesmo consiga trocar textos, fotos e preços, sem depender de ninguém e sem esperar dias.

## 5. Falta prova de que você é real

Fotos de banco de imagens, nenhum endereço, nenhum rosto da equipe, nenhuma avaliação. Na internet, a desconfiança vem antes da confiança. Quem não vê sinais de que a empresa existe prefere não arriscar.

**Como corrigir:** mostre o que é seu de verdade.

- Fotos reais do espaço, da equipe trabalhando e dos produtos.
- Endereço completo com mapa, se você atende no local.
- Avaliações reais de clientes, com link para o seu perfil no Google.
- CNPJ e regras claras de atendimento, troca ou cancelamento.

## Preste atenção no que os clientes perguntam

As mensagens que chegam também dizem muito sobre o site. Se os clientes vivem perguntando coisas que deveriam estar lá, como horário, preço inicial, área de atendimento ou formas de pagamento, o site não está respondendo.

Peça para quem atende anotar as perguntas mais repetidas durante duas semanas. Cada pergunta da lista vira uma frase, uma seção ou uma pergunta frequente no site. O atendimento fica mais leve, e quem ainda não chamou você já encontra a resposta.

## Como saber se melhorou

Depois de corrigir, acompanhe os resultados. Não precisa de nada complicado:

1. Anote quantos contatos chegam pelo site em cada semana.
2. Pergunte a cada cliente novo como ele encontrou você.
3. Compare o mês anterior com o mês seguinte às mudanças.

Sem medir, fica impossível saber se o problema era mesmo o site ou se estava em outro lugar, como o preço, o atendimento ou a falta de visitas.

> Um site bom não é o mais bonito. É o que deixa claro o que você faz e facilita o próximo passo.

## Quando vale refazer

Se o seu site mostra três ou mais desses sinais, ajustes pontuais podem não bastar. Muitas vezes sai mais rápido começar de novo, com uma estrutura pensada desde o início para transformar visita em contato.

Conheça os nossos [sites institucionais](/servicos/sites/) e as [landing pages](/servicos/landing-pages/), feitas para um objetivo só. Se quiser uma opinião sobre o seu caso, [comece por aqui](/comecar/): leva 2 minutos, e a resposta chega em até 1 dia útil.`,
  },
  {
    slug: "primeira-tela-do-site",
    title: "O que escrever na primeira tela do seu site",
    excerpt: "Você tem poucos segundos para dizer o que faz, para quem e qual o próximo passo. Um roteiro simples.",
    cover: "Primeiros segundos",
    category: "Texto",
    date: "2026-09-08",
    author: "Equipe V8 Studio",
    service: "landing-pages",
    body: `A primeira tela é tudo o que aparece antes de a pessoa rolar a página. É ali que o visitante decide se fica ou se volta para a busca. E essa decisão acontece rápido, muitas vezes antes de ele ler a segunda frase.

Por isso, a primeira tela tem uma tarefa só: responder a três perguntas.

## As três perguntas da primeira tela

1. **O que você faz?** O serviço ou o produto, com as palavras que o cliente usa.
2. **Para quem?** O tipo de cliente e, se o atendimento for local, a cidade ou a região.
3. **Qual é o próximo passo?** O que a pessoa deve fazer agora, com um botão.

Se alguém lê a sua primeira tela e não consegue responder às três, o texto precisa mudar.

## O título: diga o que você faz, sem enfeite

O título é a frase maior da página. Ele não é lugar para slogan, saudação ou o nome da empresa repetido.

Evite frases que qualquer concorrente poderia usar:

- “Bem-vindo ao nosso site.”
- “Excelência e compromisso com você.”
- “Soluções inovadoras para o seu negócio.”

Prefira frases concretas. Uma fórmula simples ajuda: **o que você faz, para quem ou onde, e um diferencial que dá para comprovar**.

- “Contabilidade para pequenas empresas, com atendimento pelo WhatsApp.”
- “Reformas de apartamento com orçamento detalhado e prazo por escrito.”
- “Aulas de natação para bebês a partir de seis meses, em turmas pequenas.”

Repare que nenhum desses exemplos diz “o melhor” ou “o mais completo”. Diferencial bom é o que o cliente consegue verificar.

### Antes e depois

Veja como uma troca simples muda o que o visitante entende. Os exemplos são ilustrativos:

- Antes: “Soluções em climatização.” Depois: “Instalação e limpeza de ar-condicionado para casas e escritórios, com visita agendada pelo site.”
- Antes: “Seu momento especial merece o melhor.” Depois: “Bolos de aniversário sob encomenda, com retirada na loja ou entrega no seu bairro.”
- Antes: “Tradição e confiança há anos.” Depois: “Escritório de contabilidade para MEI e pequenas empresas, com abertura de empresa e folha de pagamento.”

Em todos os casos, o “depois” responde ao que a pessoa queria saber. O “antes” obriga a pessoa a adivinhar.

## O subtítulo: responda à próxima dúvida

Logo abaixo do título, uma ou duas frases curtas resolvem a dúvida que vem em seguida. Pense no que os clientes perguntam primeiro quando ligam: “Vocês atendem no meu bairro?”, “Funciona aos sábados?”, “Precisa marcar?”.

Um exemplo: “Atendemos toda a zona sul, de segunda a sábado. Orçamento sem custo, com visita marcada pelo site.”

## O botão: um verbo e uma promessa clara

O botão diz o que acontece ao clicar. Use um verbo de ação ligado ao que a pessoa quer:

- “Pedir orçamento”
- “Agendar avaliação”
- “Ver cardápio”
- “Falar no WhatsApp”

Fuja de “Saiba mais” e “Clique aqui”, que não dizem nada. Tenha um botão principal e, no máximo, um secundário. Dois botões disputando a atenção acabam dividindo os cliques.

Logo abaixo do botão, uma frase curta pode tirar o receio de clicar, como “Sem compromisso” ou “Resposta no mesmo dia”. Só use se for verdade.

## A imagem: mostre o que é real

Uma foto do seu espaço, do produto ou da equipe trabalhando vale mais do que qualquer imagem de banco. Fotos genéricas, com pessoas sorrindo para a câmera, deixam a página com cara de anúncio e tiram a força do texto.

Se ainda não tem boas fotos, prefira uma página limpa, só com texto e cor, a uma imagem que não representa o seu negócio.

## O que tirar da primeira tela

- Carrossel de banners que troca sozinho. Quase ninguém espera o terceiro.
- Menu com dez itens. Deixe só o essencial.
- Janela que salta na tela antes de a pessoa ler qualquer coisa.
- A história da empresa. Ela é importante, mas pode ficar mais para baixo.
- Textos longos. Os detalhes cabem nas seções seguintes.

## Um roteiro para escrever em 20 minutos

1. Escreva numa frase o que você vende e para quem.
2. Liste as três perguntas que os clientes sempre fazem no primeiro contato.
3. Transforme a mais importante no subtítulo.
4. Escolha uma ação só para o botão.
5. Leia em voz alta para alguém que não conhece o seu negócio e pergunte o que a pessoa entendeu.

Se a resposta for parecida com o que você queria dizer, o texto está pronto para ir ao ar.

> Se o visitante precisa adivinhar o que você faz, ele vai embora antes de descobrir.

## Teste no celular

No celular, a primeira tela é bem menor. Título, subtítulo e botão precisam aparecer sem rolar. Se o botão ficou escondido lá embaixo, encurte o texto ou diminua a imagem. Leia mais sobre isso em [por que o site precisa ser pensado primeiro para o celular](/blog/site-celular-primeiro/).

## Precisa de ajuda com o texto?

Todo projeto da V8 inclui ajuda com os textos, a começar pela primeira tela. Veja como montamos [landing pages](/servicos/landing-pages/) e [sites institucionais](/servicos/sites/), ou [conte o que você precisa](/comecar/) em 2 minutos.`,
  },
  {
    slug: "aparecer-no-google",
    title: "Como aparecer quando alguém procura o seu serviço",
    excerpt: "O básico que todo site precisa ter para ser encontrado na busca, explicado sem jargão.",
    cover: "Ser encontrado",
    category: "Busca",
    date: "2026-08-25",
    author: "Equipe V8 Studio",
    service: "sites",
    body: `Quando alguém digita “dentista perto de mim” ou “conserto de geladeira em Curitiba”, o Google mostra um mapa com empresas e, logo abaixo, uma lista de sites. Estar nessa lista não depende de truque. Depende de deixar claro, para quem procura e para o próprio Google, o que você faz, onde atende e por que merece confiança.

Este é o básico que todo pequeno negócio pode fazer, explicado sem jargão.

## Comece pelo Perfil da Empresa no Google

O Perfil da Empresa no Google é gratuito e aparece no mapa e ao lado dos resultados. Para negócios locais, costuma ser o primeiro contato do cliente com você, antes mesmo do site.

Preencha tudo:

- A categoria principal certa, que descreva o que você faz.
- O endereço ou a área de atendimento.
- O horário de funcionamento, incluindo feriados.
- O telefone e o link para o seu site.
- Fotos reais da fachada, do espaço e dos produtos.

Peça avaliações para clientes satisfeitos e responda a todas, inclusive às negativas, com educação. Quem lê as respostas também está avaliando você.

## Uma página para cada serviço

Se você faz implante, clareamento e aparelho, cada um merece uma página própria. Uma página única chamada “Serviços”, com tudo listado, disputa pior na busca do que páginas específicas.

Cada página de serviço deve responder:

- O que é e para quem serve.
- Como funciona, passo a passo.
- Quanto tempo leva.
- O que influencia o preço.
- Onde você atende.

Assim, quem procura exatamente aquele serviço encontra uma página feita para ele.

## Título e descrição de cada página

Na lista de resultados, cada site aparece com um título e uma descrição curta. Esses textos podem ser escritos por você, página por página. Escreva para pessoas, não para robôs:

- **Título:** o serviço, a cidade e o nome da empresa. Por exemplo: “Clareamento dental em Campinas | Clínica Exemplo”.
- **Descrição:** uma ou duas frases que dizem o que a pessoa vai encontrar e por que vale clicar.

Cada página precisa de um título diferente. Títulos repetidos confundem quem procura e quem organiza os resultados.

## Escreva com as palavras do seu cliente

O cliente procura “conserto de celular”, não “assistência técnica em dispositivos móveis”. Use no site as mesmas palavras que aparecem nas mensagens e nas ligações que você recebe. Cite com naturalidade a cidade e os bairros que você atende.

## O básico técnico que não pode faltar

Você não precisa entender de programação, mas vale conferir se o seu site tem:

- Carregamento rápido no celular.
- Endereço com cadeado, o https.
- Um título principal claro em cada página.
- Mapa do site enviado ao Google pelo Search Console, uma ferramenta gratuita que também mostra por quais buscas as pessoas chegam até você.
- Texto alternativo nas imagens, que descreve cada foto para quem não consegue vê-la.
- Nome, endereço e telefone escritos do mesmo jeito no site, no Perfil da Empresa e nas redes sociais.

## Erros que atrapalham sem você perceber

- Texto importante escrito dentro de imagens, como banners com preço ou horário. A busca entende muito melhor o texto escrito na própria página.
- Páginas com o mesmo texto, trocando só o nome da cidade.
- Texto copiado de outro site, inclusive do fornecedor.
- Uma página “em construção” que fica no ar por meses.
- Endereço do site trocado sem redirecionar o antigo, o que faz quem chega por um link velho cair numa página de erro.

## Conteúdo que responde perguntas

Cada dúvida que um cliente tem antes de comprar pode virar um artigo: “Quanto tempo dura um clareamento?”, “Preciso de autorização do condomínio para reformar?”. Quem procura essas perguntas pode encontrar a sua resposta e, junto com ela, a sua empresa.

Constância vale mais do que volume. Um artigo útil por mês, durante um ano, ajuda mais do que vinte publicados de uma vez e depois esquecidos.

> Não existe atalho para o primeiro lugar. Existe um site claro, rápido e útil, cuidado com constância.

## Quanto tempo leva

Ninguém sério pode prometer posição na busca. O Google leva um tempo para ler e confiar num site novo, e a concorrência muda muito de uma cidade para outra e de um serviço para outro. Desconfie de quem garante o primeiro lugar em poucos dias.

## E os anúncios?

Os anúncios aparecem no topo enquanto você paga. A busca orgânica, que é tudo o que vimos até aqui, demora mais, mas continua trazendo visitas sem custo por clique. Muitas empresas usam anúncios no começo e constroem a presença orgânica ao mesmo tempo. Para anúncios, o destino ideal é uma [landing page](/servicos/landing-pages/) com um objetivo só.

## Por onde começar

Todo site da V8 sai com a base técnica para a busca: páginas rápidas, títulos e descrições pensados para cada página e mapa do site. Veja como funcionam os nossos [sites institucionais](/servicos/sites/) ou [conte o que você precisa](/comecar/) para receber uma proposta em até 1 dia útil.`,
  },
  {
    slug: "preparar-loja-virtual",
    title: "Loja virtual: o que preparar antes de começar",
    excerpt: "Fotos, descrições, frete e pagamento. Uma lista para chegar ao projeto com tudo encaminhado.",
    cover: "Antes da loja",
    category: "Lojas virtuais",
    date: "2026-08-11",
    author: "Equipe V8 Studio",
    service: "lojas-virtuais",
    body: `Uma loja virtual é, antes de tudo, uma loja. Tem produto, preço, estoque, entrega, pagamento e atendimento depois da venda. O site é a vitrine e o caixa. A operação por trás dele é o que faz a venda acontecer.

Chegar ao projeto com os pontos abaixo resolvidos economiza semanas e evita surpresas depois que a loja estiver no ar.

## Catálogo: comece pelo que já vende

Não é preciso colocar tudo de uma vez. Comece pelos produtos que já vendem bem na loja física, no Instagram ou no WhatsApp. Trinta produtos bem apresentados vendem mais do que quinhentos sem foto e sem descrição.

- Organize em categorias que o cliente entende, com os nomes que ele usa.
- Defina as variações de cada produto: tamanho, cor, sabor, voltagem.
- Tenha um código para cada variação. Ele ajuda a controlar o estoque.

## Fotos que vendem

Na internet, o cliente não pode tocar no produto. A foto faz esse papel.

- Use fundo neutro e luz natural, perto de uma janela.
- Faça várias fotos de cada produto: frente, costas, detalhe e em uso.
- Mantenha o mesmo enquadramento em todas. A loja fica organizada.
- Mostre o tamanho real, com o produto na mão ou ao lado de um objeto conhecido.
- Evite fotos do fornecedor, com marca d'água ou que aparecem em outras lojas.

## Descrições que respondem dúvidas

Pense nas perguntas que você responde todo dia por mensagem e coloque as respostas na página do produto: medidas, material, cuidados, o que vem na caixa e prazo de produção, se for sob encomenda. Para roupas e calçados, uma tabela de medidas evita trocas.

Uma descrição bem feita diminui as perguntas, as trocas e as devoluções.

## Frete: decida antes de abrir

O frete é uma das primeiras coisas que o cliente confere antes de fechar a compra. Defina:

- **Como vai entregar:** Correios, transportadora, entrega própria na sua cidade ou retirada na loja.
- **Peso e medidas** da embalagem de cada produto. Sem isso, não dá para calcular o frete.
- **Frete grátis:** se vai oferecer, a partir de qual valor, e se a sua margem aguenta.
- **Prazo de despacho:** em quantos dias úteis o pedido sai daí depois de pago.

## Pagamento

Escolha as formas de pagamento que o seu cliente espera encontrar: Pix, cartão de crédito e, se fizer sentido, boleto. As plataformas de pagamento cobram taxas por venda, que mudam conforme a forma de pagamento e o prazo para receber. Compare as opções e considere essas taxas na hora de definir o preço.

Decida também o parcelamento: em quantas vezes, com ou sem juros, e a partir de qual valor.

## Estoque e rotina

Antes de abrir, responda:

- Quem atualiza o estoque? Se você vende na loja física e na internet, os dois precisam bater.
- Quem separa, embala e despacha os pedidos?
- Quem responde às dúvidas e acompanha as entregas?

Uma loja virtual vende a qualquer hora, inclusive de madrugada e no fim de semana. A rotina precisa dar conta disso.

## Depois da venda

A compra não termina no pagamento. O cliente quer saber se o pedido foi recebido, quando sai e onde está. Combine antes:

- A mensagem de confirmação que o cliente recebe logo depois de comprar.
- Como e quando ele recebe o código de rastreio.
- Quem responde se a entrega atrasar ou o produto chegar com defeito.

Um pós-venda organizado faz o cliente voltar e diminui as reclamações.

## Regras claras e dentro da lei

O comércio pela internet tem regras próprias. Entre as principais:

- **Direito de arrependimento:** o Código de Defesa do Consumidor permite ao cliente desistir de uma compra feita fora da loja física em até sete dias depois de receber o produto.
- **Identificação da empresa:** o Decreto 7.962/2013 pede que a loja mostre razão social, CNPJ e endereço, entre outras informações.
- **Trocas e devoluções:** explique com clareza como o cliente deve proceder e quem paga o frete da devolução.
- **Privacidade:** diga quais dados a loja coleta e para quê, como pede a Lei Geral de Proteção de Dados.

Na dúvida, confirme os detalhes com o seu contador ou advogado.

> A loja virtual começa muito antes do site: começa na foto, no frete e em quem vai embalar o pedido.

## Lista para levar à primeira conversa

1. Os produtos iniciais, com preços e variações.
2. Fotos prontas ou um plano para produzi-las.
3. Peso e medidas das embalagens.
4. Formas de entrega e de pagamento escolhidas.
5. Regras de trocas e devoluções.
6. Domínio, se você já tiver um.
7. Quem vai cuidar dos pedidos no dia a dia.

Não tem tudo? Sem problema. A lista serve para mostrar o que precisa ser decidido, e a gente ajuda a decidir.

Veja como funcionam as nossas [lojas virtuais](/servicos/lojas-virtuais/). Se a operação já é grande e precisa de controle de pedidos e estoque feito sob medida, conheça também os [sistemas](/servicos/sistemas/). Quando estiver pronto, [comece por aqui](/comecar/): leva 2 minutos.`,
  },
  {
    slug: "site-celular-primeiro",
    title: "Por que o seu site precisa ser pensado primeiro para o celular",
    excerpt: "É no celular que o seu cliente procura. O que muda quando o projeto começa pela tela pequena.",
    cover: "Tela pequena primeiro",
    category: "Design",
    date: "2026-07-28",
    author: "Equipe V8 Studio",
    body: `Pense em como o seu cliente encontra você. Na fila do banco, no intervalo do almoço, no ônibus, no sofá à noite. Quase sempre com o celular numa mão e, muitas vezes, com a internet oscilando.

É nessa tela do tamanho de uma mão que ele decide se liga, se pede orçamento ou se volta para a busca. Um site desenhado para o computador e ajustado depois para o celular costuma mostrar isso logo de cara.

## O que significa “celular primeiro”

Celular primeiro é começar o projeto pela tela pequena. Primeiro se decide o que é mais importante, em que ordem aparece e o que pode sair. Só depois a página cresce para o computador, ganhando espaço e detalhes.

Parece só uma questão de ordem, mas muda o resultado. Quem começa pela tela grande tende a encher a página e depois espremer tudo. Quem começa pela tela pequena é obrigado a escolher. E escolher deixa o site mais claro em qualquer tela.

## O que muda na prática

### Texto direto

No celular, cada frase ocupa várias linhas. Parágrafos curtos, títulos que dizem tudo e detalhes mais abaixo. Se uma informação não ajuda o cliente a decidir, ela pode sair.

### Botões feitos para o dedo

Botões grandes, com espaço em volta, fáceis de tocar com o polegar. Telefone que liga com um toque, endereço que abre o mapa, botão de WhatsApp que já abre a conversa.

### Formulários curtos

Digitar no celular cansa. Peça só o necessário e use o teclado certo para cada campo: numérico para o telefone, com arroba para o e-mail. Deixe o navegador preencher o que ele já sabe, como nome e endereço.

### Velocidade

A conexão do celular varia o tempo todo. Imagens leves, nada pesado tocando sozinho e só o necessário para a página aparecer rápido.

### Leitura confortável

Letra grande o bastante para ler sem dar zoom, bom contraste entre texto e fundo e nada que obrigue a arrastar a tela para o lado.

### Imagens que fazem sentido em pé

A tela do celular é estreita e alta. Uma foto larga, que fica ótima no computador, vira uma faixa fina no celular, e o detalhe importante some. Escolha imagens que funcionem bem em pé ou prepare versões diferentes para cada tela.

## Erros comuns de site adaptado às pressas

- Menu que cobre a tela inteira e é difícil de fechar.
- Janela que salta na tela e esconde o próprio botão de fechar.
- Tabelas largas que obrigam a arrastar para o lado.
- Texto minúsculo, pensado para a tela grande.
- Botões colados um no outro, que fazem tocar no errado.
- Imagem enorme no topo, que empurra o conteúdo para baixo.

## Como testar o seu site hoje

1. Abra o site no seu celular, usando a internet móvel.
2. Marque quanto tempo leva para achar o telefone ou o botão de contato.
3. Preencha o formulário até o fim, como um cliente faria.
4. Peça para alguém que não conhece o site fazer o mesmo e observe sem ajudar.
5. Anote cada momento em que a pessoa hesitou, errou o toque ou precisou dar zoom.

Cada anotação é uma melhoria a fazer. Se você tem acesso às estatísticas do site, confira também quantas visitas chegam pelo celular e quantas pelo computador. Os seus próprios números dizem por onde começar.

> Se funciona bem na tela pequena, fica ainda melhor na grande. O contrário quase nunca acontece.

## O que perguntar a quem vai fazer o seu site

Antes de contratar, faça estas perguntas. As respostas mostram se o celular vai ser tratado como prioridade ou como adaptação:

- Vocês desenham primeiro a versão do celular?
- Posso ver e testar o projeto no meu próprio celular antes de aprovar?
- Como a página se comporta com a internet lenta?
- O formulário de contato foi testado no celular, do começo ao fim?
- Os botões de telefone, mapa e WhatsApp funcionam com um toque?

## E o computador?

Continua importante. Muita gente pesquisa no computador, principalmente antes de compras maiores e de contratações entre empresas. Pensar primeiro no celular não significa caprichar menos na tela grande. Significa decidir o essencial na tela pequena e usar o espaço extra do computador para mostrar mais, sem perder a clareza.

## Quando o celular vira o canal principal

Se os seus clientes usam o seu serviço toda semana, para agendar, pedir ou acompanhar alguma coisa, talvez valha ir além do site. Um [aplicativo](/servicos/aplicativos/) deixa o seu serviço a um toque, com avisos na hora certa.

Todo projeto da V8 nasce na tela pequena e depois cresce para o computador. Veja como fazemos [sites institucionais](/servicos/sites/) e [landing pages](/servicos/landing-pages/), ou [conte o que você precisa](/comecar/) em 2 minutos.`,
  },
];

export const POSTS: Post[] = RAW.map((p) => ({ ...p, minutes: readingMinutes(p.body) }));

export const postHref = (slug: string) => `/blog/${slug}/`;

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
/** "6 de outubro de 2026" (sem depender do fuso do servidor). */
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
};

/** Versão leve de um artigo para listagens e componentes de cliente. */
export const summarize = (p: Post): PostSummary => ({
  slug: p.slug,
  href: postHref(p.slug),
  title: p.title,
  excerpt: p.excerpt,
  cover: p.cover,
  category: p.category,
  date: p.date,
  dateLabel: formatDate(p.date),
  minutes: p.minutes,
});

/** Categorias na ordem em que aparecem (do artigo mais novo para o mais antigo). */
export const CATEGORIES = Array.from(new Set(POSTS.map((p) => p.category)));

/**
 * Artigos para o "Leia também": primeiro os da mesma categoria, depois os vizinhos na lista
 * (mais perto em data), sem repetir o artigo atual.
 */
export function relatedPosts(slug: string, n = 2): Post[] {
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i < 0) return POSTS.slice(0, n);
  const current = POSTS[i];
  const others = POSTS.map((p, j) => ({ p, d: Math.abs(j - i) + (j > i ? 0 : 0.5) })).filter(({ p }) => p.slug !== slug);
  others.sort((a, b) => Number(b.p.category === current.category) - Number(a.p.category === current.category) || a.d - b.d);
  return others.slice(0, n).map(({ p }) => p);
}
