import { cx } from "@/motion/lib/cx";
import s from "./privacidade.module.css";

/** Dado que só o usuário tem: aparece marcado na página até ser preenchido. */
const Fill = ({ children }: { children: string }) => <mark className={s.fill}>{children}</mark>;

/** Seções da política, na ordem da página (o sumário lateral usa a mesma lista). */
export const POLICY_SECTIONS = [
  { id: "quem-cuida", label: "Quem cuida dos seus dados" },
  { id: "dados-coletados", label: "Quais dados coletamos" },
  { id: "para-que", label: "Para que usamos" },
  { id: "bases-legais", label: "Bases legais" },
  { id: "compartilhamento", label: "Com quem compartilhamos" },
  { id: "prazos", label: "Por quanto tempo guardamos" },
  { id: "cookies", label: "Cookies e navegador" },
  { id: "seguranca", label: "Como protegemos" },
  { id: "direitos", label: "Seus direitos" },
  { id: "como-pedir", label: "Como exercer seus direitos" },
  { id: "mudancas", label: "Mudanças nesta política" },
] as const;

const title = (id: (typeof POLICY_SECTIONS)[number]["id"]) => POLICY_SECTIONS.find((x) => x.id === id)!.label;

/** Texto completo da política de privacidade (LGPD), em linguagem simples. */
export function Policy() {
  return (
    <div className={cx("prose", s.policy)}>
      <h2 id="quem-cuida">{title("quem-cuida")}</h2>
      <p>O controlador dos dados pessoais tratados neste site, ou seja, quem decide como e para que eles são usados, é:</p>
      <dl className={cx("card", s.controller)}>
        <div>
          <dt>Razão social</dt>
          <dd>
            <Fill>[Razão social]</Fill>
          </dd>
        </div>
        <div>
          <dt>CNPJ</dt>
          <dd>
            <Fill>[CNPJ]</Fill>
          </dd>
        </div>
        <div>
          <dt>Endereço</dt>
          <dd>
            <Fill>[Endereço]</Fill>
          </dd>
        </div>
        <div>
          <dt>Encarregado pelo tratamento de dados</dt>
          <dd>
            <Fill>[Nome do encarregado]</Fill>
          </dd>
        </div>
        <div>
          <dt>Canal para assuntos de dados pessoais</dt>
          <dd>
            O <a href="#pedido">formulário no fim desta página</a>
          </dd>
        </div>
      </dl>
      <p>
        Neste texto, &ldquo;V8 Studio&rdquo;, &ldquo;nós&rdquo; e &ldquo;a gente&rdquo; se referem a essa empresa. Esta política vale para o site da V8 Studio. Os sites e
        as lojas que fazemos para clientes têm políticas próprias, de responsabilidade de cada cliente.
      </p>

      <h2 id="dados-coletados">{title("dados-coletados")}</h2>
      <h3>No formulário Começar</h3>
      <p>Quando você pede uma proposta pelo formulário de 2 minutos, guardamos o que você informa:</p>
      <ul>
        <li>
          <strong>Sobre o projeto:</strong> o que você precisa, se já tem site, o objetivo, o segmento do negócio, o prazo, a faixa de investimento e o seu papel na
          empresa.
        </li>
        <li>
          <strong>Para falar com você:</strong> nome, WhatsApp e e-mail, além do nome da empresa, se você informar.
        </li>
        <li>
          <strong>Registro do aceite:</strong> a data em que você confirmou ter lido esta política e a versão do texto.
        </li>
        <li>
          <strong>Origem do pedido:</strong> a página do site por onde você chegou e, quando o link tiver, a identificação da campanha (os parâmetros UTM).
        </li>
      </ul>
      <h3>No formulário desta página</h3>
      <p>Nome, e-mail, o tipo de pedido e o que você escrever nos detalhes.</p>
      <h3>Enquanto você navega</h3>
      <p>
        Como em qualquer site, o servidor de hospedagem registra dados técnicos de cada acesso: endereço IP, data e hora, página pedida e informações do navegador. Não
        usamos esses registros para identificar visitantes nem para fazer propaganda.
      </p>
      <p>
        Não pedimos dados sensíveis, como informações de saúde, religião ou biometria. Por favor, não escreva esse tipo de informação nos campos abertos. O site não é
        voltado a menores de 18 anos.
      </p>

      <h2 id="para-que">{title("para-que")}</h2>
      <ul>
        <li>Responder ao seu pedido e preparar a proposta.</li>
        <li>Falar com você sobre o projeto, pelo contato que você informou.</li>
        <li>
          Organizar os pedidos que chegam. Com as respostas do formulário, o nosso sistema calcula uma nota de compatibilidade que ajuda a ordenar a fila. Essa nota não
          decide sozinha se você será atendido: todo pedido recebe resposta.
        </li>
        <li>Entender, em números somados e sem identificar ninguém, quais páginas e campanhas trazem pedidos, para melhorar o site.</li>
        <li>Se o pedido virar projeto, cumprir o contrato e as obrigações legais e fiscais.</li>
        <li>Atender pedidos sobre dados pessoais e nos defender em eventuais processos.</li>
      </ul>
      <p>Não enviamos propaganda que você não pediu. E não vendemos, alugamos nem cedemos dados a ninguém.</p>

      <h2 id="bases-legais">{title("bases-legais")}</h2>
      <p>A Lei Geral de Proteção de Dados (LGPD) só permite tratar dados pessoais com uma base legal (art. 7º). Estas são as que usamos:</p>
      <dl className={s.bases}>
        <div>
          <dt>Responder ao pedido, preparar a proposta e cumprir o contrato</dt>
          <dd>Procedimentos preliminares e execução de contrato, a seu pedido (art. 7º, V).</dd>
        </div>
        <div>
          <dt>Organizar a fila de pedidos e medir quais páginas e campanhas funcionam</dt>
          <dd>Legítimo interesse (art. 7º, IX), de forma limitada e compatível com o que você espera de quem recebe o seu pedido.</dd>
        </div>
        <div>
          <dt>Registros de acesso ao site</dt>
          <dd>Cumprimento de obrigação legal (art. 7º, II), pelo Marco Civil da Internet (Lei 12.965/2014, art. 15).</dd>
        </div>
        <div>
          <dt>Atender pedidos sobre dados pessoais</dt>
          <dd>Cumprimento de obrigação legal (art. 7º, II).</dd>
        </div>
        <div>
          <dt>Guardar documentos depois do contrato e nos defender em processos</dt>
          <dd>Cumprimento de obrigação legal e exercício regular de direitos (art. 7º, II e VI).</dd>
        </div>
      </dl>

      <h2 id="compartilhamento">{title("compartilhamento")}</h2>
      <p>Só com quem precisa dos dados para o site e o atendimento funcionarem:</p>
      <ul>
        <li>
          <strong>Hospedagem do site e dos dados:</strong> <Fill>[Provedor de hospedagem]</Fill>, que guarda as páginas, os pedidos e os registros de acesso.
        </li>
        <li>
          <strong>Envio de e-mail:</strong> <Fill>[Serviço de envio de e-mail]</Fill>, que leva até nós o aviso de cada pedido novo e entrega as mensagens que enviamos
          para você.
        </li>
        <li>
          <strong>Contabilidade:</strong> se o pedido virar contrato, os dados necessários para emitir a nota fiscal.
        </li>
        <li>
          <strong>Autoridades públicas:</strong> quando a lei ou uma ordem judicial exigir.
        </li>
      </ul>
      <p>
        Esses fornecedores só podem usar os dados para prestar o serviço que contratamos. Se algum deles guardar dados fora do Brasil, a transferência segue as regras da
        LGPD (arts. 33 a 36).
      </p>

      <h2 id="prazos">{title("prazos")}</h2>
      <ul>
        <li>
          <strong>Pedidos que não viram projeto:</strong> até 12 meses depois do último contato. Depois disso, apagamos os dados ou os deixamos anônimos.
        </li>
        <li>
          <strong>Pedidos que viram projeto:</strong> durante o contrato e, depois dele, pelo prazo que a lei exigir, como o das obrigações fiscais, ou enquanto forem
          necessários para defesa em processos (art. 16 da LGPD).
        </li>
        <li>
          <strong>Registros de acesso:</strong> 6 meses, como manda o Marco Civil da Internet.
        </li>
        <li>
          <strong>Pedidos sobre dados pessoais:</strong> pelo tempo necessário para comprovar que o pedido foi atendido.
        </li>
      </ul>
      <p>Se você pedir, apagamos antes, a não ser que a lei mande guardar.</p>

      <h2 id="cookies">{title("cookies")}</h2>
      <p>Este site não usa cookies de rastreamento, de publicidade ou de análise de comportamento.</p>
      <p>
        Ele guarda uma única anotação no seu navegador, no armazenamento da sessão, com o nome <code>v8-intro</code>. Ela serve só para não repetir a abertura animada do
        logo a cada visita à página inicial. A anotação some quando você fecha a aba, não identifica você e não é enviada para nós.
      </p>

      <h2 id="seguranca">{title("seguranca")}</h2>
      <ul>
        <li>Conexão segura (https) em todas as páginas.</li>
        <li>Acesso aos pedidos restrito às pessoas que atendem você, com login e senha.</li>
        <li>Fornecedores que só recebem os dados de que precisam para prestar o serviço.</li>
      </ul>
      <p>
        Nenhum sistema é totalmente imune a falhas. Se acontecer um incidente de segurança que possa trazer risco ou dano relevante a você, avisamos você e a Autoridade
        Nacional de Proteção de Dados (ANPD), como manda a lei (art. 48).
      </p>

      <h2 id="direitos">{title("direitos")}</h2>
      <p>A LGPD (art. 18) garante a você, a qualquer momento e sem custo:</p>
      <ul>
        <li>Confirmar se tratamos dados seus.</li>
        <li>Acessar os seus dados.</li>
        <li>Corrigir dados incompletos, errados ou desatualizados.</li>
        <li>Pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei.</li>
        <li>Pedir a portabilidade dos seus dados para outro fornecedor.</li>
        <li>Pedir a eliminação dos dados tratados com o seu consentimento.</li>
        <li>Saber com quem compartilhamos os seus dados.</li>
        <li>Saber que pode não dar consentimento e o que acontece se não der.</li>
        <li>Revogar o consentimento, quando ele for a base do tratamento.</li>
      </ul>
      <p>
        Você também pode se opor a um tratamento feito com outra base legal, se ele estiver em desacordo com a lei (art. 18, § 2º), e pedir a revisão de decisões tomadas
        só por sistemas automáticos (art. 20).
      </p>

      <h2 id="como-pedir">{title("como-pedir")}</h2>
      <p>
        Use o <a href="#pedido">formulário abaixo</a>. Como o site não mostra e-mail nem telefone, ele é o nosso canal oficial para assuntos de dados pessoais.
      </p>
      <ul>
        <li>Confirmamos o recebimento em até 1 dia útil.</li>
        <li>Respondemos em até 15 dias, prazo da LGPD para a confirmação e o acesso completo (art. 19).</li>
        <li>Para proteger você, podemos pedir uma confirmação de identidade antes de entregar, corrigir ou apagar dados.</li>
      </ul>
      <p>
        Se não ficar satisfeito com a resposta, você pode reclamar à ANPD, no site{" "}
        <a href="https://www.gov.br/anpd/pt-br" target="_blank" rel="noopener noreferrer">
          gov.br/anpd
        </a>
        .
      </p>

      <h2 id="mudancas">{title("mudancas")}</h2>
      <p>Quando esta política mudar, a data no topo da página muda junto. A versão que vale é sempre a publicada aqui.</p>
    </div>
  );
}
