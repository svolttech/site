const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const caseCards = document.querySelectorAll("[data-category]");
const diagnosticForm = document.querySelector("[data-diagnostic-form]");
const diagnosticResult = document.querySelector("[data-diagnostic-result]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");

const whatsappNumber = "5511953592909";
const contactEmail = "rafael.lira@svolttech.com.br";

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    caseCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("hidden", filter !== "todos" && !categories.includes(filter));
    });
  });
});

diagnosticForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = [...new FormData(diagnosticForm).values()].map(Number);
  const score = values.reduce((total, value) => total + value, 0);
  const percentage = Math.round((score / 12) * 100);
  const level = percentage >= 78 ? "avancada" : percentage >= 55 ? "intermediaria" : "inicial";
  const nextStep =
    percentage >= 78
      ? "Oportunidade: BI executivo, integracoes e IA aplicada."
      : percentage >= 55
        ? "Oportunidade: padronizar processos e automatizar tarefas recorrentes."
        : "Oportunidade: mapear processos, corrigir dados-base e priorizar ganhos rapidos.";

  diagnosticResult.textContent = `Maturidade ${level}: ${percentage}%. ${nextStep}`;
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!leadForm.reportValidity()) {
    return;
  }

  const lead = Object.fromEntries(new FormData(leadForm).entries());
  const leads = JSON.parse(localStorage.getItem("svolttech-leads") || "[]");
  leads.push({ ...lead, createdAt: new Date().toISOString() });
  localStorage.setItem("svolttech-leads", JSON.stringify(leads));

  const message = [
    "Ola, SvoltTech.",
    `Meu nome e ${lead.nome} e falo pela empresa ${lead.empresa}.`,
    `Tenho interesse em: ${lead.necessidade}.`,
    `Mensagem: ${lead.mensagem}`,
    `E-mail: ${lead.email}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const emailSubject = `Novo contato pelo site - ${lead.empresa}`;
  const emailUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(message)}`;
  formStatus.innerHTML = `Interesse registrado localmente. <a href="${whatsappUrl}" target="_blank" rel="noreferrer">Abrir no WhatsApp</a> ou <a href="${emailUrl}">enviar por e-mail</a>.`;
  leadForm.reset();
});
