/* =========================================================
   Menu: marca como ativo o botão da seção visível na tela.
   Não precisa mexer aqui: ele lê os links de ".menu .pill"
   e procura a <section> com o id igual ao href.
   ========================================================= */
(function () {
  const links = Array.from(document.querySelectorAll(".menu .pill"));
  const menu = document.querySelector(".menu");

  // Pareia cada link com a sua seção
  const alvos = links
    .map((link) => ({ link, secao: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.secao);

  function ativar(id) {
    alvos.forEach(({ link, secao }) => {
      const ativo = secao.id === id;
      link.classList.toggle("is-active", ativo);
      if (ativo) {
        link.setAttribute("aria-current", "page");
        // No celular, mantém o botão ativo visível dentro do menu rolável
        if (menu && menu.scrollWidth > menu.clientWidth) {
          link.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // Considera "atual" a seção que cruza a faixa central da tela
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) ativar(entrada.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  alvos.forEach(({ secao }) => observador.observe(secao));
})();

/* =========================================================
   Barra do topo: ganha fundo escuro quando a página é rolada
   (classe .is-scrolled, estilizada no CSS).
   ========================================================= */
(function () {
  const barra = document.querySelector(".topbar");
  if (!barra) return;

  function atualizar() {
    barra.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", atualizar, { passive: true });
  atualizar();
})();

/* =========================================================
   Vídeo do hero: botão de pausar/reproduzir.
   Só aparece se existir um <video> dentro de ".hero__media".
   ========================================================= */
(function () {
  const video = document.querySelector(".hero__media video");
  const botao = document.querySelector(".hero__toggle");
  if (!video || !botao) return;

  botao.hidden = false;

  // Quem pediu menos animação no sistema começa com o vídeo pausado
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.removeAttribute("autoplay");
    video.pause();
  }

  function atualizar() {
    const tocando = !video.paused;
    botao.classList.toggle("is-paused", !tocando);
    botao.setAttribute("aria-label", tocando ? "Pausar vídeo" : "Reproduzir vídeo");
  }

  botao.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", atualizar);
  video.addEventListener("pause", atualizar);
  atualizar();
})();
