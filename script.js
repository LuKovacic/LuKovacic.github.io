(() => {
  const header = document.getElementById("site-header");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function getNavH(){
    if (!header) return 72;
    return Math.round(header.getBoundingClientRect().height);
  }

  // Postavi 16:9 frame prema visini ekrana (minus navbar)
  function setFrameVars(){
    const navH = getNavH();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const slideH = Math.max(420, vh - navH);
    const targetW = slideH * (16/9);
    const frameW = Math.min(vw, targetW);

    document.documentElement.style.setProperty("--navH", `${navH}px`);
    document.documentElement.style.setProperty("--slideH", `${slideH}px`);
    document.documentElement.style.setProperty("--frameW", `${Math.round(frameW)}px`);
  }

  // Tint navbara dok si u hero
  const hero = document.getElementById("hero");
  function syncHeaderTint(){
    if (!header || !hero) return;
    const navH = getNavH();
    const heroRect = hero.getBoundingClientRect();
    const inHero = heroRect.bottom > navH + 2;
    header.classList.toggle("on-hero", inHero);
  }

  // Aktivna crta u navbaru (osim dok je hero aktivan)
  const navLinks = Array.from(document.querySelectorAll(".nav a[data-target]"));
  const sections = navLinks
    .map(a => document.getElementById(a.dataset.target))
    .filter(Boolean);

  function setActiveLink(){
    const navH = getNavH();
    const scrollY = window.scrollY;

    // ako smo praktički na vrhu -> nema aktivnog
    if (scrollY < 8) {
      navLinks.forEach(a => a.classList.remove("active"));
      return;
    }

    // odredi koja sekcija je “trenutna”
    let currentId = null;
    for (const sec of sections) {
      const top = sec.offsetTop - navH - 2;
      const bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = sec.id;
        break;
      }
    }

    // ako je hero u kadru -> ništa nije aktivno
    if (hero) {
      const heroTop = hero.offsetTop;
      const heroBottom = heroTop + hero.offsetHeight;
      const inHero = scrollY < (heroBottom - navH - 2);
      if (inHero) {
        navLinks.forEach(a => a.classList.remove("active"));
        return;
      }
    }

    navLinks.forEach(a => {
      a.classList.toggle("active", a.dataset.target === currentId);
    });
  }

  // Smooth scroll s točnim poravnanjem (bez “1mm ulaska u prošlu sekciju”)
  function setupSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href").slice(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;

        e.preventDefault();
        const navH = getNavH();
        const y = el.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  // Init
  function onScroll(){
    syncHeaderTint();
    setActiveLink();
  }

  window.addEventListener("resize", () => {
    setFrameVars();
    onScroll();
  });

  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("load", () => {
    setFrameVars();
    setupSmoothScroll();
    onScroll();
  });
})();
