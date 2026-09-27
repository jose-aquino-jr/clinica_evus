/* =====================================================
   CLÍNICA EVUS — Interações
   ===================================================== */

/* -----------------------------------------------------
   CONFIGURAÇÃO
   -----------------------------------------------------
  Número em formato internacional, sem '+' nem espaços.
----------------------------------------------------- */
const WHATSAPP_NUMBER = "5513997878304";

/* -----------------------------------------------------
   DADOS DO CORPO CLÍNICO
   ----------------------------------------------------- */
const professionals = [
  {
    name: "Dra. Thayana Geraldeli",
    specialty: "Endocrinologia e Metabologia",
    specialtyKey: "endocrinologia",
    crm: "CRM-SP 176141",
    rqe: "RQE 89193",
    initials: "TG"
  },
  {
    name: "Dra. Thabata Geraldeli",
    specialty: "Dermatologia",
    specialtyKey: "dermatologia",
    crm: "CRM-SP 165273",
    rqe: null,
    initials: "TG"
  },
  {
    name: "Dra. Camila Pereira de Moraes",
    specialty: "Otorrinolaringologia",
    specialtyKey: "otorrino",
    crm: "CRM-SP 156650",
    rqe: "RQE 68759",
    initials: "CM"
  },
  {
    name: "Dra. Rafaela Manzano",
    specialty: "Otorrinolaringologia",
    specialtyKey: "otorrino",
    crm: "CRM-SP 192405",
    rqe: "RQE 96551",
    initials: "RM"
  },
  {
    name: "Dra. Bruna Guimarães",
    specialty: "Pediatria",
    specialtyKey: "pediatria",
    crm: null,
    rqe: null,
    initials: "BG"
  }
];

/* -----------------------------------------------------
   ESPECIALIDADES
   ----------------------------------------------------- */
const specialties = [
  { key: "alergologia",    name: "Alergologia Infantil e Adulto", num: "01" },
  { key: "dermatologia",   name: "Dermatologia Clínica e Estética", num: "02" },
  { key: "endocrinologia", name: "Endocrinologia e Metabologia", num: "03" },
  { key: "pediatria",      name: "Pediatria",                    num: "04" },
  { key: "nutrologia",     name: "Nutrologia Infantil",           num: "05" },
  { key: "otorrino",       name: "Otorrinolaringologia",          num: "06" }
];

/* -----------------------------------------------------
   RENDER — LISTA DE ESPECIALIDADES
   ----------------------------------------------------- */
function renderSpecialties() {
  const list = document.getElementById("specialty-list");
  if (!list) return;

  list.innerHTML = specialties.map((s) => `
    <li class="specialty-item reveal">
      <button class="specialty-btn" type="button" data-specialty="${s.key}">
        <span class="specialty-item__num">${s.num}</span>
        <span class="specialty-item__name">${s.name}</span>
        <span class="specialty-item__arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>
    </li>
  `).join("");
}

/* -----------------------------------------------------
   RENDER — CORPO CLÍNICO
   ----------------------------------------------------- */
function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildDoctorLink(doctor) {
  const message = `Olá! Gostaria de agendar uma consulta com ${doctor.name} (${doctor.specialty}).`;
  return buildWhatsAppLink(message);
}

function registryLine(doctor) {
  if (doctor.crm && doctor.rqe) return `${doctor.crm} · ${doctor.rqe}`;
  if (doctor.crm) return doctor.crm;
  return "";
}

function renderDoctors(filterKey) {
  const grid = document.getElementById("doctors-grid");
  if (!grid) return;

  const list = filterKey
    ? professionals.filter((d) => d.specialtyKey === filterKey)
    : professionals;

  grid.innerHTML = list.map((d, i) => {
    const registry = registryLine(d);

    return `
      <a class="doctor-card reveal" data-delay="${Math.min(i + 1, 5)}"
         href="${buildDoctorLink(d)}" target="_blank" rel="noopener noreferrer"
         aria-label="Agendar com ${d.name} — ${d.specialty}">
        <div class="doctor-card__portrait" aria-hidden="true">
          <span class="doctor-card__initials">${d.initials}</span>
        </div>
        <div class="doctor-card__body">
          <h3 class="doctor-card__name">${d.name}</h3>
          <p class="doctor-card__specialty">${d.specialty}</p>
          ${registry ? `<p class="doctor-card__registry">${registry}</p>` : ""}
          <span class="doctor-card__cta">
            Agendar atendimento
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </a>
    `;
  }).join("");

  // Observar novos reveals
  grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------
   RENDER — CHIPS DE AGENDAMENTO
   ----------------------------------------------------- */
function renderBookingChips() {
  const container = document.getElementById("booking-chips");
  if (!container) return;

  container.innerHTML = specialties.map((s) => `
    <button class="chip" type="button" aria-pressed="false" data-specialty="${s.key}">
      ${s.name}
    </button>
  `).join("");
}

/* -----------------------------------------------------
   FILTRO DE ESPECIALIDADE
   ----------------------------------------------------- */
function activateFilter(key) {
  const specialty = specialties.find((s) => s.key === key);
  if (!specialty) return;

  const filterBar = document.getElementById("doctors-filter");
  const filterName = document.getElementById("filter-name");
  if (!filterBar || !filterName) return;

  filterName.textContent = specialty.name;
  filterBar.hidden = false;

  renderDoctors(key);

  // Scroll até a seção
  document.getElementById("corpo-clinico")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearFilter() {
  const filterBar = document.getElementById("doctors-filter");
  if (filterBar) filterBar.hidden = true;
  renderDoctors(null);
}

/* -----------------------------------------------------
   AGENDAMENTO — SELEÇÃO E WHATSAPP
   ----------------------------------------------------- */
let selectedSpecialty = null;

function selectBookingChip(key) {
  selectedSpecialty = key;
  const specialty = specialties.find((item) => item.key === key);
  const bookingLink = document.getElementById("whatsapp-btn");

  if (specialty && bookingLink) {
    bookingLink.href = buildWhatsAppLink(
      `Olá! Gostaria de agendar um atendimento em ${specialty.name} na Clínica Evus.`
    );
  }

  document.querySelectorAll("#booking-chips .chip").forEach((chip) => {
    const isActive = chip.dataset.specialty === key;
    chip.classList.toggle("chip--active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
}

/* -----------------------------------------------------
   HEADER — SCROLL
   ----------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* -----------------------------------------------------
   MOBILE MENU
   ----------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
    setTimeout(() => { menu.hidden = true; }, 400);
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
}

/* -----------------------------------------------------
   REVEAL ON SCROLL
   ----------------------------------------------------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
);

function initReveals() {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------
   INIT
   ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Ano footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Renders
  renderSpecialties();
  renderDoctors(null);
  renderBookingChips();

  // Reveals (após render)
  initReveals();

  // Filtro por especialidade
  document.getElementById("specialty-list")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-specialty]");
    if (!btn) return;
    const hasProfessionals = professionals.some(
      (professional) => professional.specialtyKey === btn.dataset.specialty
    );

    if (hasProfessionals) {
      activateFilter(btn.dataset.specialty);
      return;
    }

    selectBookingChip(btn.dataset.specialty);
    document.getElementById("agendamento")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("clear-filter")?.addEventListener("click", clearFilter);

  // Chips de agendamento
  document.getElementById("booking-chips")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    selectBookingChip(chip.dataset.specialty);
  });

  // Header and mobile menu
  initHeaderScroll();
  initMobileMenu();
});