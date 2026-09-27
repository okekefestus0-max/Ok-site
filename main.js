(function () {
  const root = document.documentElement;
  root.classList.remove("no-js");

  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector(".nav-toggle");
  const toc = document.getElementById("toc");
  const clock = document.getElementById("lagos-clock");
  const rateMonth = document.getElementById("rate-month");
  const year = document.getElementById("year");
  const indicator = document.getElementById("sheet-indicator");
  const mobileBar = document.querySelector("[data-mobile-bar]");
  const form = document.getElementById("brief");
  const phoneField = document.getElementById("phone-field");
  const phoneInput = document.getElementById("phone");

  const sheets = [
    ["hero", "01 · Cover"],
    ["difference", "02 · Difference"],
    ["services", "03 · Schedules"],
    ["month", "04 · The month"],
    ["retainer", "05 · Retainer"],
    ["work", "06 · Work"],
    ["fit", "07 · Fit"],
    ["contact", "08 · Brief"]
  ];

  function lagosNow() {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).format(new Date());
  }

  function tick() {
    if (!clock) return;
    const value = lagosNow();
    clock.textContent = value;
    clock.dateTime = value;
  }

  tick();
  window.setInterval(tick, 30000);

  if (rateMonth) {
    rateMonth.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }

  if (year) year.textContent = String(new Date().getFullYear());

  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!toggle || !toc) return;
    toggle.setAttribute("aria-expanded", "false");
    toc.hidden = true;
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!toggle || !toc) return;
    toggle.setAttribute("aria-expanded", "true");
    toc.hidden = false;
    document.body.classList.add("menu-open");
  }

  if (toggle && toc) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      if (open) closeMenu();
      else openMenu();
    });

    toc.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960) closeMenu();
    });
  }

  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = sheets
    .map(function (pair) {
      return document.getElementById(pair[0]);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const visible = new Map();
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let current = sheets[0][0];
        let best = -1;
        sheets.forEach(function (pair) {
          const ratio = visible.get(pair[0]) || 0;
          if (ratio > best) {
            best = ratio;
            current = pair[0];
          }
        });
        const label = sheets.find(function (pair) { return pair[0] === current; });
        if (indicator && label) indicator.textContent = label[1];
        navLinks.forEach(function (link) {
          const on = link.getAttribute("href") === "#" + current;
          if (on) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.2, 0.5] }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  const contact = document.getElementById("contact");
  if (mobileBar && contact && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      function (entries) {
        mobileBar.classList.toggle("is-hidden", entries[0].isIntersecting);
      },
      { threshold: 0.15 }
    );
    barObserver.observe(contact);
  }

  function selectedReply() {
    const picked = form.querySelector('input[name="reply"]:checked');
    return picked ? picked.value : "email";
  }

  function syncPhone() {
    if (!phoneField || !phoneInput) return;
    const wants = selectedReply() === "whatsapp";
    phoneField.hidden = !wants;
    phoneInput.required = wants;
  }

  if (form) {
    form.querySelectorAll('input[name="reply"]').forEach(function (input) {
      input.addEventListener("change", syncPhone);
    });
    syncPhone();
    form.addEventListener("submit", onSubmit);
  }

  function fieldOf(input) {
    return input.closest(".field, fieldset");
  }

  function clearErrors() {
    form.querySelectorAll(".err").forEach(function (node) { node.remove(); });
    form.querySelectorAll(".is-invalid").forEach(function (node) {
      node.classList.remove("is-invalid");
    });
    const status = document.getElementById("form-status");
    if (status) status.textContent = "";
  }

  function showError(input, message) {
    const wrap = fieldOf(input);
    if (!wrap) return;
    wrap.classList.add("is-invalid");
    const note = document.createElement("span");
    note.className = "err";
    note.textContent = message;
    wrap.appendChild(note);
  }

  function value(id) {
    const node = document.getElementById(id);
    return node ? node.value.trim() : "";
  }

  function spendValue() {
    const picked = form.querySelector('input[name="spend"]:checked');
    return picked ? picked.value : "";
  }

  function validate() {
    clearErrors();
    let first = null;

    function fail(input, message) {
      showError(input, message);
      if (!first) first = input;
    }

    const name = document.getElementById("name");
    const business = document.getElementById("business");
    const email = document.getElementById("email");
    const country = document.getElementById("country");
    const offer = document.getElementById("offer");
    const message = document.getElementById("message");
    const spend = form.querySelector('input[name="spend"]');

    if (value("name").length < 2) fail(name, "Add your name.");
    if (value("business").length < 2) fail(business, "Add the business name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) fail(email, "Add a real email.");
    if (value("country").length < 2) fail(country, "Add the country you operate in.");
    if (!offer.value) fail(offer, "Select what you sell.");
    if (!spendValue()) fail(spend, "Choose a spend option.");
    if (value("message").length < 12) fail(message, "A sentence or two is enough — what should the next 90 days do?");
    if (selectedReply() === "whatsapp" && value("phone").length < 6) {
      fail(phoneInput, "Add the WhatsApp number I should use.");
    }

    if (first) {
      const status = document.getElementById("form-status");
      if (status) status.textContent = "A few fields still need an answer.";
      first.focus();
      return false;
    }
    return true;
  }

  function briefText() {
    const lines = [
      "Retainer brief — Festus Okeke",
      "",
      "Name: " + value("name"),
      "Business: " + value("business"),
      "Email: " + value("email"),
      "Country: " + value("country"),
      "Website: " + (value("website") || "—"),
      "Sells: " + document.getElementById("offer").value,
      "Ad spend: " + spendValue(),
      "Reply via: " + selectedReply()
    ];
    if (selectedReply() === "whatsapp") lines.push("WhatsApp: " + value("phone"));
    lines.push("", "Next 90 days:", value("message"), "", "Package of interest: Operator retainer, $2,400 USD / month ($1,500 work + $900 media).");
    return lines.join("\n");
  }

  function mailtoHref(text) {
    const email = form.dataset.email;
    const subject = "Retainer brief — " + value("business");
    return "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
  }

  function whatsappHref(text) {
    const number = form.dataset.whatsapp;
    const short = [
      "Hello Festus — retainer brief.",
      value("name") + ", " + value("business") + " (" + value("country") + ").",
      value("message")
    ].join(" ");
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(short.slice(0, 1200));
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return false;
    }
  }

  function renderFiled(text, mode) {
    const card = form.parentElement;
    const bar = card.querySelector(".brief-bar");
    form.hidden = true;

    const filed = document.createElement("div");
    filed.className = "filed";
    filed.setAttribute("role", "status");

    const kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = mode === "sent" ? "Brief received · not a contract" : "Brief ready · not a contract";

    const title = document.createElement("h3");
    title.textContent = mode === "sent" ? "Received, " + value("name") + "." : "Ready to send, " + value("name") + ".";

    const copy = document.createElement("p");
    if (mode === "sent") {
      copy.textContent = "I’ll reply to " + value("email") + " within one business day. If it’s a fit, the next note is a one-page scope — not a pitch deck. Nothing starts until you accept that and the invoice clears.";
    } else {
      copy.textContent = "Direct delivery isn’t available from this page yet. The brief is below. Email it to " + form.dataset.email + ", or WhatsApp it. Nothing is signed by preparing this.";
    }

    const pre = document.createElement("pre");
    pre.className = "brief-copy";
    pre.textContent = text;

    const actions = document.createElement("div");
    actions.className = "filed-actions";

    const mail = document.createElement("a");
    mail.className = "btn btn-ink";
    mail.href = mailtoHref(text);
    mail.textContent = "Open email";

    const wa = document.createElement("a");
    wa.className = "btn btn-line";
    wa.href = whatsappHref(text);
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    wa.textContent = "WhatsApp";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn btn-line";
    copyBtn.textContent = "Copy brief";
    copyBtn.addEventListener("click", async function () {
      const ok = await copyText(text);
      copyBtn.textContent = ok ? "Copied" : "Copy failed — select the brief";
    });

    actions.append(mail, wa, copyBtn);
    filed.append(kicker, title, copy, pre, actions);
    bar.insertAdjacentElement("afterend", filed);
    title.focus && title.setAttribute("tabindex", "-1");
    title.focus();
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const honeypot = document.getElementById("company_website_confirm");
    if (honeypot && honeypot.value) {
      renderFiled("Thanks.", "sent");
      return;
    }

    const text = briefText();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = "Sending…";

    const payload = {
      name: value("name"),
      email: value("email"),
      business: value("business"),
      country: value("country"),
      website: value("website") || "—",
      offer: document.getElementById("offer").value,
      spend: spendValue(),
      reply: selectedReply(),
      phone: value("phone") || "—",
      message: value("message"),
      _subject: "Retainer brief — " + value("business"),
      _template: "table",
      _captcha: "false",
      _replyto: value("email")
    };

    let sent = false;
    try {
      const controller = new AbortController();
      const timer = window.setTimeout(function () { controller.abort(); }, 8000);
      const response = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(form.dataset.email), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      window.clearTimeout(timer);
      if (response.ok) {
        const data = await response.json().catch(function () { return {}; });
        sent = String(data.success) === "true" || data.success === true;
      }
    } catch (error) {
      sent = false;
    }

    if (!sent) await copyText(text);
    renderFiled(text, sent ? "sent" : "ready");
  }
})();
