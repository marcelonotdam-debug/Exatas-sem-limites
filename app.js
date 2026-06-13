// app.js - Lógica principal e Gerenciador de Estado da Plataforma ENEM

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // INICIALIZAÇÃO DE ESTADO
  // ==========================================
  let config = JSON.parse(localStorage.getItem("exatas_v2_config")) || DEFAULT_PLATFORM_CONFIG;
  if (config.adminPassword === "admin123") {
    config.adminPassword = "banguela6742";
    localStorage.setItem("exatas_v2_config", JSON.stringify(config));
  }
  let materials = JSON.parse(localStorage.getItem("exatas_v2_materials")) || DEFAULT_MATERIALS_DATA;
  // Forçar atualização se os caminhos forem do formato antigo com acentos ou pastas redundantes
  if (materials.length > 0 && (materials[0].url.includes("estudos/") || materials[0].url.includes("MATEMÁTICA") || materials[0].url.includes("FÍSICA") || materials[0].url.includes("QUÍMICA"))) {
    materials = DEFAULT_MATERIALS_DATA;
    localStorage.setItem("exatas_v2_materials", JSON.stringify(materials));
  }
  let users = JSON.parse(localStorage.getItem("exatas_v2_users")) || DEFAULT_USERS_DATA;
  let currentUser = JSON.parse(localStorage.getItem("exatas_v2_current_user")) || null;
  
  let currentArea = "matematica";
  let currentSubject = "fme_livros";
  
  // Elementos do DOM
  const sectionLanding = document.getElementById("section-landing");
  const sectionDashboard = document.getElementById("section-dashboard");
  const sectionAdmin = document.getElementById("section-admin");
  const checkoutModal = document.getElementById("checkout-modal");
  const pdfViewer = document.getElementById("pdf-viewer");
  const adminLoginModal = document.getElementById("admin-login-modal");
  const loginModal = document.getElementById("login-modal");
  const privacyModal = document.getElementById("privacy-modal");
  
  const checkoutStepRegister = document.getElementById("checkout-step-register");
  const checkoutStepPayment = document.getElementById("checkout-step-payment");
  const adminTabContent = document.getElementById("admin-tab-content-pane");
  const adminTabUsers = document.getElementById("admin-tab-users-pane");
  
  // ==========================================
  // ROTEAMENTO DE SEÇÕES
  // ==========================================
  function navigateTo(sectionId) {
    // Esconder todas as seções
    [sectionLanding, sectionDashboard, sectionAdmin].forEach(sec => {
      sec.classList.remove("active");
    });
    
    // Fechar modais abertos
    checkoutModal.classList.remove("active");
    pdfViewer.classList.remove("active");
    loginModal.classList.remove("active");
    privacyModal.classList.remove("active");
    adminLoginModal.classList.remove("active");
    
    // Mostrar a seção desejada
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add("active");
      window.scrollTo(0, 0);
    }
  }

  // Atualizar crachá do aluno na barra lateral
  function updateUserBadge() {
    const avatar = document.querySelector(".user-avatar");
    const nameEl = document.querySelector(".user-name");
    const statusEl = document.querySelector(".user-status");
    if (currentUser) {
      nameEl.innerText = currentUser.name;
      const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
      avatar.innerText = initials || "AL";
      statusEl.innerText = currentUser.unlocked ? "● Acesso Ativo" : "○ Acesso Bloqueado";
    }
  }

  // Verificar acesso e carregar tela inicial
  function checkInitialRoute() {
    if (currentUser && currentUser.unlocked) {
      currentArea = "matematica";
      currentSubject = Object.keys(SUBJECTS_METADATA[currentArea].subjects)[0];
      updateUserBadge();
      renderDashboard();
      navigateTo("section-dashboard");
    } else {
      renderLandingPage();
      navigateTo("section-landing");
    }
  }

  // ==========================================
  // FLUXO DE VENDAS & LANDING PAGE
  // ==========================================
  function renderLandingPage() {
    // Atualiza textos da Landing Page baseados na Config
    document.getElementById("landing-hero-title").innerText = config.landingPage.heroTitle;
    document.getElementById("landing-hero-subtitle").innerText = config.landingPage.heroSubtitle;
    document.getElementById("landing-cta-btn").innerText = `Garantir Meu Combo por Apenas R$ ${config.productPrice.toFixed(2).replace('.', ',')}`;
    document.getElementById("pricing-product-name").innerText = config.productName;
    document.getElementById("pricing-value").innerText = config.productPrice.toFixed(2).replace('.', ',');
    
    // Renderiza Features (O que vai receber)
    const featuresContainer = document.getElementById("landing-features-container");
    featuresContainer.innerHTML = "";
    config.landingPage.features.forEach(feat => {
      const card = document.createElement("div");
      card.className = "feature-card glass-panel";
      card.innerHTML = `
        <div class="feature-icon-wrapper">${feat.icon}</div>
        <h3>${feat.title}</h3>
        <p>${feat.desc}</p>
      `;
      featuresContainer.appendChild(card);
    });

    // Renderiza Benefícios (Checklist do card de preço)
    const benefitsContainer = document.getElementById("landing-benefits-container");
    benefitsContainer.innerHTML = "";
    config.landingPage.benefits.forEach(benefit => {
      const item = document.createElement("li");
      item.className = "benefit-item";
      item.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${benefit}</span>
      `;
      benefitsContainer.appendChild(item);
    });
  }

  // ==========================================
  // GERADOR DE PAYLOAD PIX REAL (EMV/BR CODE)
  // ==========================================
  function getPixString(pixkey, price, name, city) {
    const key = pixkey.trim();
    const value = parseFloat(price).toFixed(2);
    const receiverName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 25);
    const merchantCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().substring(0, 15);
    
    const len = (val) => String(val.length).padStart(2, '0');
    
    const gui = "0014br.gov.bcb.pix";
    const keyTag = "01" + len(key) + key;
    const merchantAccount = "26" + len(gui + keyTag) + gui + keyTag;
    
    const parts = {
      "26": merchantAccount,
      "52": "0000", // Merchant Category Code
      "53": "986", // BRL Currency
      "54": value, // Amount
      "58": "BR", // Country
      "59": receiverName, // Receiver Name
      "60": merchantCity, // City
      "62": "0503***" // Transaction ID (unspecified)
    };
    
    let payload = "000201";
    for (const [tag, val] of Object.entries(parts)) {
      if (tag === "26") {
        payload += val;
      } else {
        payload += tag + len(val) + val;
      }
    }
    
    payload += "6304"; // Tag CRC16
    
    // CRC16 CCITT
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      let x = ((crc >> 8) ^ payload.charCodeAt(i)) & 0xFF;
      x ^= x >> 4;
      crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ (x << 0)) & 0xFFFF;
    }
    const crcString = crc.toString(16).toUpperCase().padStart(4, '0');
    
    return payload + crcString;
  }

  // ==========================================
  // FLUXO DO CHECKOUT MODAL
  // ==========================================
  function openCheckout() {
    if (currentUser) {
      if (currentUser.unlocked) {
        alert("Você já possui acesso liberado ao Combo Premium!");
        renderDashboard();
        navigateTo("section-dashboard");
        return;
      } else {
        // Logado, mas não liberado: vai direto pro QR Code
        renderCheckoutPix(currentUser.email);
        checkoutModal.classList.add("active");
        return;
      }
    }

    // Não logado: abrir tela de autenticação
    checkoutStepRegister.style.display = "block";
    checkoutStepPayment.style.display = "none";
    document.getElementById("checkout-modal-title").innerText = "Acesse ou Cadastre-se";
    
    // Mostrar aba de cadastro como ativa por padrão
    document.getElementById("btn-checkout-tab-register").classList.add("active");
    document.getElementById("btn-checkout-tab-login").classList.remove("active");
    document.getElementById("checkout-sub-register").style.display = "block";
    document.getElementById("checkout-sub-login").style.display = "none";

    // Reset form fields
    document.getElementById("checkout-reg-name").value = "";
    document.getElementById("checkout-reg-email").value = "";
    document.getElementById("checkout-reg-password").value = "";
    document.getElementById("checkout-login-email").value = "";
    document.getElementById("checkout-login-password").value = "";
    
    checkoutModal.classList.add("active");
  }

  function renderCheckoutPix(email) {
    document.getElementById("checkout-price-val").innerText = config.productPrice.toFixed(2).replace('.', ',');
    document.getElementById("checkout-product-name").innerText = config.productName;
    document.getElementById("checkout-modal-title").innerText = "Pagamento Pix";
    
    const pixPayload = getPixString(config.pixKey, config.productPrice, config.pixReceiverName, config.pixCity);
    
    const codeText = document.getElementById("pix-copia-cola-text");
    codeText.innerText = pixPayload;
    codeText.title = pixPayload;
    
    const canvas = document.getElementById("pix-qr-canvas");
    canvas.width = 180;
    canvas.height = 180;
    
    if (window.QRious) {
      new QRious({
        element: canvas,
        value: pixPayload,
        size: 180,
        background: 'white',
        foreground: 'black',
        level: 'H'
      });
    } else {
      console.error("Biblioteca QRious não carregada. QR Code não gerado.");
    }
    
    checkoutStepRegister.style.display = "none";
    checkoutStepPayment.style.display = "block";
  }

  // Copiar código Pix
  document.getElementById("btn-copy-pix").addEventListener("click", () => {
    const pixText = document.getElementById("pix-copia-cola-text").innerText;
    navigator.clipboard.writeText(pixText).then(() => {
      const btn = document.getElementById("btn-copy-pix");
      btn.innerText = "Copiado!";
      btn.style.background = "#10b981";
      setTimeout(() => {
        btn.innerText = "Copiar";
        btn.style.background = "var(--primary)";
      }, 2000);
    }).catch(err => {
      alert("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
    });
  });



  // ==========================================
  // FLUXO DO PORTAL DO ESTUDANTE (DASHBOARD)
  // ==========================================
  function renderDashboard() {
    // Renderiza menu lateral (Sidebar de Áreas)
    const sidebarNav = document.getElementById("sidebar-areas-nav");
    sidebarNav.innerHTML = "";
    
    Object.entries(SUBJECTS_METADATA).forEach(([key, info]) => {
      const link = document.createElement("a");
      link.className = `nav-link ${currentArea === key ? 'active' : ''}`;
      
      let icon = "📚";
      if (key === "matematica") icon = "📐";
      if (key === "fisica") icon = "⚡";
      if (key === "quimica") icon = "🧪";
      
      link.innerHTML = `<span class="nav-icon">${icon}</span> ${info.title.split(" (")[0]}`;
      link.addEventListener("click", () => {
        currentArea = key;
        currentSubject = Object.keys(info.subjects)[0];
        
        // Desmarcar o botão do fórum na sidebar
        document.getElementById("btn-sidebar-forum").classList.remove("active");
        document.getElementById("dashboard-materials-view").style.display = "block";
        document.getElementById("dashboard-forum-view").style.display = "none";
        
        renderDashboard();
      });
      sidebarNav.appendChild(link);
    });

    // Atualiza Título do Topo do Dashboard
    document.getElementById("dashboard-area-title").innerText = SUBJECTS_METADATA[currentArea].title;

    // Renderiza sub-abas das matérias
    const tabsContainer = document.getElementById("subjects-tabs-container");
    tabsContainer.innerHTML = "";
    
    const subjectList = SUBJECTS_METADATA[currentArea].subjects;
    Object.entries(subjectList).forEach(([key, name]) => {
      const tab = document.createElement("button");
      tab.className = `subject-tab ${currentSubject === key ? 'active' : ''}`;
      tab.innerText = name;
      tab.addEventListener("click", () => {
        currentSubject = key;
        renderDashboard();
      });
      tabsContainer.appendChild(tab);
    });

    // Renderiza materiais da matéria selecionada
    renderMaterials();
  }

  function renderMaterials() {
    const searchQuery = document.getElementById("search-materials").value.toLowerCase();
    const grid = document.getElementById("materials-grid");
    grid.innerHTML = "";

    // Filtra materiais por área, matéria e busca
    const filtered = materials.filter(mat => {
      const matchesCategory = mat.area === currentArea && mat.subject === currentSubject;
      const matchesSearch = mat.title.toLowerCase().includes(searchQuery) || 
                            mat.description.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 15px;">🔍</span>
          <p>Nenhum material encontrado para esta busca ou matéria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(mat => {
      const card = document.createElement("div");
      card.className = `material-card glass-panel type-${mat.type}`;
      
      const badgeText = mat.type === 'pdf' ? 'PDF' : (mat.type === 'video' ? 'Vídeo' : 'Link');
      
      card.innerHTML = `
        <div>
          <span class="material-badge">${badgeText}</span>
          <div class="material-meta">
            <span>${badgeText === 'PDF' ? '📄 Documento' : '🎥 Vídeo Aula'}</span>
            <span>•</span>
            <span>${mat.size || 'N/A'}</span>
          </div>
          <h4 class="material-title">${mat.title}</h4>
          <p class="material-desc">${mat.description}</p>
        </div>
        <div class="material-footer">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Exatas 2026</span>
          <div class="material-actions">
            <button class="btn btn-secondary btn-sm btn-view-material" data-id="${mat.id}">Estudar</button>
            <a href="${mat.url}" class="btn btn-primary btn-sm" target="_blank" style="text-decoration:none;">Baixar</a>
          </div>
        </div>
      `;
      
      // Evento para visualizar o PDF
      card.querySelector(".btn-view-material").addEventListener("click", () => {
        openPDFViewer(mat);
      });
      
      grid.appendChild(card);
    });
  }

  // ==========================================
  // VISUALIZADOR DE PDF CUSTOMIZADO
  // ==========================================
  function openPDFViewer(material) {
    const title = document.getElementById("pdf-viewer-title");
    title.innerText = material.title;
    
    const container = document.getElementById("pdf-viewer-body-container");
    container.innerHTML = "";
    
    // Se for um link de simulação '#', renderizamos uma visualização premium de mock.
    // Isso evita que a tela fique em branco e simula uma apostila interativa excelente!
    if (material.url === "#" || material.url === "") {
      container.innerHTML = `
        <div style="background: #ffffff; color: #1e293b; padding: 40px; max-width: 800px; margin: 40px auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); line-height: 1.8;">
          <div style="border-bottom: 2px solid var(--primary); padding-bottom: 15px; margin-bottom: 30px;">
            <span style="font-weight: 800; color: var(--primary); font-size: 0.9rem; text-transform: uppercase;">Coleção Exatas Premium</span>
            <h1 style="color: #0f172a; margin-top: 5px; font-size: 2rem;">${material.title}</h1>
            <p style="color: #64748b; font-size: 0.95rem; margin-top: 5px;">${material.description}</p>
          </div>
          
          <h3 style="color: #0f172a; margin-bottom: 15px;">Sumário de Conteúdo</h3>
          <ol style="margin-left: 20px; margin-bottom: 30px; font-weight: 500;">
            <li>Introdução e Conceitos Fundamentais</li>
            <li>Conceitos Fundamentais e Fórmulas Importantes</li>
            <li>Exemplos e Resoluções Passo a Passo</li>
            <li>Exercícios Práticos de Fixação com Gabarito Comentado</li>
          </ol>
          
          <h3 style="color: #0f172a; margin-bottom: 10px;">Capítulo 1: O Que Você Precisa Saber</h3>
          <p style="margin-bottom: 20px;">Este é um espaço reservado para o seu conteúdo de estudos. Como administrador, você pode substituir o link deste material por um link direto do seu arquivo PDF hospedado no Google Drive, Dropbox, ou site pessoal.</p>
          
          <div style="background: #f8fafc; border-left: 4px solid var(--accent); padding: 15px 20px; border-radius: 4px; margin-bottom: 30px;">
            <p style="font-weight: 600; margin: 0; color: #0f172a;">💡 Dica de Ouro das Exatas:</p>
            <p style="margin: 5px 0 0 0; font-size: 0.95rem; color: #334155;">A melhor forma de estudar exatas é fazendo exercícios. Sempre tente resolver o livro teórico primeiro e use a apostila de resoluções apenas para tirar dúvidas de raciocínio.</p>
          </div>

          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 40px;">
            <a href="MATEMATICA/FME/Volume 1 - Conjuntos, Funcoes.pdf" target="_blank" class="btn btn-primary" style="display: inline-flex;">
              Visualizar Livro Volume 1 Localmente
            </a>
          </div>
        </div>
      `;
    } else {
      // Se tiver link real, abre no iframe
      // Caso seja do Google Drive, o ideal é usar o visualizador do Google Docs para evitar problemas de CORS
      let embedUrl = material.url;
      if (embedUrl.includes("drive.google.com")) {
        // Converter link do Drive para modo embed preview
        embedUrl = embedUrl.replace("/view?usp=sharing", "/preview").replace("/view", "/preview");
      }
      container.innerHTML = `<iframe class="pdf-iframe" src="${embedUrl}" title="Leitor de PDF"></iframe>`;
    }
    
    pdfViewer.classList.add("active");
  }

  // Fechar Visualizador PDF
  document.getElementById("btn-close-pdf").addEventListener("click", () => {
    pdfViewer.classList.remove("active");
  });

  // ==========================================
  // FLUXO DO PAINEL DO ADMINISTRADOR
  // ==========================================
  function renderAdmin() {
    // Configurações Gerais
    document.getElementById("conf-product-name").value = config.productName;
    document.getElementById("conf-price").value = config.productPrice;
    document.getElementById("conf-pix-key").value = config.pixKey;
    document.getElementById("conf-receiver-name").value = config.pixReceiverName;
    document.getElementById("conf-city").value = config.pixCity;
    document.getElementById("conf-hero-title").value = config.landingPage.heroTitle;
    document.getElementById("conf-hero-subtitle").value = config.landingPage.heroSubtitle;
    document.getElementById("conf-admin-password").value = config.adminPassword;

    // Render users list as well
    renderAdminUsers();

    // Lista de materiais cadastrados
    const listContainer = document.getElementById("admin-materials-list");
    listContainer.innerHTML = "";
    document.getElementById("admin-materials-count").innerText = materials.length;

    materials.forEach(mat => {
      const item = document.createElement("div");
      item.className = "admin-material-item";
      
      const areaTitle = SUBJECTS_METADATA[mat.area]?.title.split(" (")[0] || mat.area;
      const subjectName = SUBJECTS_METADATA[mat.area]?.subjects[mat.subject] || mat.subject;
      
      item.innerHTML = `
        <div class="admin-mat-info">
          <div class="admin-mat-title">${mat.title}</div>
          <div style="margin-top: 4px;">
            <span class="admin-mat-subject">${areaTitle} (${subjectName})</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">${mat.size || 'N/A'}</span>
          </div>
        </div>
        <div class="admin-mat-actions">
          <button class="btn btn-secondary btn-sm btn-edit-mat" data-id="${mat.id}">Editar</button>
          <button class="btn btn-danger btn-sm btn-delete-mat" data-id="${mat.id}">Deletar</button>
        </div>
      `;
      
      // Handler para editar
      item.querySelector(".btn-edit-mat").addEventListener("click", () => {
        loadMaterialToForm(mat);
      });
      
      // Handler para deletar
      item.querySelector(".btn-delete-mat").addEventListener("click", () => {
        if (confirm(`Tem certeza que deseja remover o material "${mat.title}"?`)) {
          materials = materials.filter(m => m.id !== mat.id);
          localStorage.setItem("exatas_v2_materials", JSON.stringify(materials));
          renderAdmin();
          renderDashboard();
        }
      });
      
      listContainer.appendChild(item);
    });
  }

  // Preencher dropdown de matérias baseado na área no admin
  const matAreaSelect = document.getElementById("mat-area-select");
  const matSubjectSelect = document.getElementById("mat-subject-select");
  
  matAreaSelect.addEventListener("change", () => {
    const area = matAreaSelect.value;
    populateSubjectSelect(area);
  });

  function populateSubjectSelect(area, selectedSubject = "") {
    matSubjectSelect.innerHTML = "";
    
    if (!area || !SUBJECTS_METADATA[area]) {
      matSubjectSelect.disabled = true;
      matSubjectSelect.innerHTML = '<option value="" disabled selected>Escolha a área primeiro</option>';
      return;
    }

    matSubjectSelect.disabled = false;
    const subjects = SUBJECTS_METADATA[area].subjects;
    
    Object.entries(subjects).forEach(([key, name]) => {
      const option = document.createElement("option");
      option.value = key;
      option.innerText = name;
      if (selectedSubject === key) option.selected = true;
      matSubjectSelect.appendChild(option);
    });
  }

  // Salvar Configurações Gerais
  document.getElementById("form-admin-config").addEventListener("submit", (e) => {
    e.preventDefault();
    
    config.productName = document.getElementById("conf-product-name").value;
    config.productPrice = parseFloat(document.getElementById("conf-price").value);
    config.pixKey = document.getElementById("conf-pix-key").value;
    config.pixReceiverName = document.getElementById("conf-receiver-name").value;
    config.pixCity = document.getElementById("conf-city").value;
    config.landingPage.heroTitle = document.getElementById("conf-hero-title").value;
    config.landingPage.heroSubtitle = document.getElementById("conf-hero-subtitle").value;
    config.adminPassword = document.getElementById("conf-admin-password").value;
    
    localStorage.setItem("exatas_v2_config", JSON.stringify(config));
    alert("Configurações gerais salvas com sucesso!");
    
    renderLandingPage();
    renderDashboard();
  });

  // Salvar / Adicionar Material
  document.getElementById("form-admin-material").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const editId = document.getElementById("edit-material-id").value;
    const area = matAreaSelect.value;
    const subject = matSubjectSelect.value;
    const title = document.getElementById("mat-title").value;
    const description = document.getElementById("mat-desc").value;
    const url = document.getElementById("mat-url").value;
    const type = document.getElementById("mat-type").value;
    const size = document.getElementById("mat-size").value;

    if (editId) {
      // Modo Edição
      materials = materials.map(mat => {
        if (mat.id === editId) {
          return { ...mat, area, subject, title, description, url, type, size };
        }
        return mat;
      });
      alert("Material atualizado com sucesso!");
      resetMaterialForm();
    } else {
      // Modo Criação
      const newMaterial = {
        id: "mat-" + Date.now(),
        area,
        subject,
        title,
        description,
        url,
        type,
        size
      };
      materials.push(newMaterial);
      alert("Novo material adicionado com sucesso!");
      resetMaterialForm();
    }
    
    localStorage.setItem("exatas_v2_materials", JSON.stringify(materials));
    renderAdmin();
    renderDashboard();
  });

  function loadMaterialToForm(mat) {
    document.getElementById("edit-material-id").value = mat.id;
    matAreaSelect.value = mat.area;
    populateSubjectSelect(mat.area, mat.subject);
    document.getElementById("mat-title").value = mat.title;
    document.getElementById("mat-desc").value = mat.description;
    document.getElementById("mat-url").value = mat.url;
    document.getElementById("mat-type").value = mat.type;
    document.getElementById("mat-size").value = mat.size;

    document.getElementById("form-material-title-action").innerText = "Editar Material Selecionado";
    document.getElementById("btn-submit-material").innerText = "Atualizar Material";
    document.getElementById("btn-cancel-edit").style.display = "block";
    
    window.scrollTo({
      top: document.getElementById("form-admin-material").offsetTop - 50,
      behavior: 'smooth'
    });
  }

  function resetMaterialForm() {
    document.getElementById("edit-material-id").value = "";
    document.getElementById("form-admin-material").reset();
    matSubjectSelect.innerHTML = '<option value="" disabled selected>Escolha a área primeiro</option>';
    matSubjectSelect.disabled = true;
    
    document.getElementById("form-material-title-action").innerText = "Cadastrar Nova Apostila / Resumo";
    document.getElementById("btn-submit-material").innerText = "Salvar Material";
    document.getElementById("btn-cancel-edit").style.display = "none";
  }

  document.getElementById("btn-cancel-edit").addEventListener("click", resetMaterialForm);

  // Exportar Backup JSON
  document.getElementById("btn-export-data").addEventListener("click", () => {
    const dataToExport = {
      config: config,
      materials: materials
    };
    
    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "exatas-backup-plataforma.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Importar Backup JSON
  document.getElementById("import-json-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        if (importedData.config && importedData.materials) {
          config = importedData.config;
          materials = importedData.materials;
          
          localStorage.setItem("exatas_v2_config", JSON.stringify(config));
          localStorage.setItem("exatas_v2_materials", JSON.stringify(materials));
          
          alert("Base de dados importada com sucesso!");
          
          renderLandingPage();
          renderDashboard();
          renderAdmin();
        } else {
          alert("Arquivo JSON inválido. Certifique-se de que é um arquivo de backup exportado desta plataforma.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // ==========================================
  // GESTÃO DE ESTUDANTES (ADMIN PANEL)
  // ==========================================
  
  function renderAdminUsers() {
    const listContainer = document.getElementById("admin-users-list");
    listContainer.innerHTML = "";
    document.getElementById("admin-users-count").innerText = users.length;

    users.forEach(user => {
      const item = document.createElement("div");
      item.className = "admin-user-item";
      
      const statusText = user.unlocked ? "Liberado" : "Bloqueado";
      const statusClass = user.unlocked ? "unlocked" : "locked";
      
      item.innerHTML = `
        <div class="admin-user-info">
          <div class="admin-user-name">${user.name} <span class="admin-user-status ${statusClass}">${statusText}</span></div>
          <div class="admin-user-email">E-mail: ${user.email} | Senha: ${user.password}</div>
        </div>
        <div class="admin-user-actions">
          <button class="btn btn-secondary btn-sm btn-toggle-user-access" data-email="${user.email}">
            ${user.unlocked ? 'Bloquear' : 'Liberar'}
          </button>
          <button class="btn btn-secondary btn-sm btn-edit-user" data-email="${user.email}">Editar</button>
          <button class="btn btn-danger btn-sm btn-delete-user" data-email="${user.email}">Deletar</button>
        </div>
      `;
      
      // Toggle de liberação de acesso
      item.querySelector(".btn-toggle-user-access").addEventListener("click", () => {
        user.unlocked = !user.unlocked;
        if (currentUser && currentUser.email.toLowerCase() === user.email.toLowerCase()) {
          currentUser.unlocked = user.unlocked;
          localStorage.setItem("exatas_v2_current_user", JSON.stringify(currentUser));
        }
        localStorage.setItem("exatas_v2_users", JSON.stringify(users));
        renderAdminUsers();
      });

      // Carregar para edição
      item.querySelector(".btn-edit-user").addEventListener("click", () => {
        loadUserToForm(user);
      });

      // Deletar aluno
      item.querySelector(".btn-delete-user").addEventListener("click", () => {
        if (confirm(`Tem certeza que deseja deletar o aluno "${user.name}"?`)) {
          if (currentUser && currentUser.email.toLowerCase() === user.email.toLowerCase()) {
            currentUser = null;
            localStorage.removeItem("exatas_v2_current_user");
          }
          users = users.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
          localStorage.setItem("exatas_v2_users", JSON.stringify(users));
          renderAdminUsers();
        }
      });

      listContainer.appendChild(item);
    });
  }

  // Submit do formulário do aluno (Criar ou Editar)
  document.getElementById("form-admin-user").addEventListener("submit", (e) => {
    e.preventDefault();
    const editEmail = document.getElementById("edit-user-id").value;
    const name = document.getElementById("user-name-input").value.trim();
    const email = document.getElementById("user-email-input").value.trim().toLowerCase();
    const password = document.getElementById("user-password-input").value;
    const unlocked = document.getElementById("user-unlocked-checkbox").checked;

    if (editEmail) {
      // Editar
      users = users.map(u => {
        if (u.email.toLowerCase() === editEmail.toLowerCase()) {
          return { ...u, name, email, password, unlocked };
        }
        return u;
      });
      if (currentUser && currentUser.email.toLowerCase() === editEmail.toLowerCase()) {
        currentUser = { name, email, password, unlocked };
        localStorage.setItem("exatas_v2_current_user", JSON.stringify(currentUser));
      }
      alert("Dados do aluno atualizados com sucesso!");
      resetUserForm();
    } else {
      // Criar
      if (users.some(u => u.email.toLowerCase() === email)) {
        alert("Já existe um aluno cadastrado com este e-mail.");
        return;
      }
      users.push({ name, email, password, unlocked });
      alert("Novo aluno cadastrado com sucesso!");
      resetUserForm();
    }

    localStorage.setItem("exatas_v2_users", JSON.stringify(users));
    renderAdminUsers();
  });

  function loadUserToForm(user) {
    document.getElementById("edit-user-id").value = user.email;
    document.getElementById("user-name-input").value = user.name;
    document.getElementById("user-email-input").value = user.email;
    document.getElementById("user-password-input").value = user.password;
    document.getElementById("user-unlocked-checkbox").checked = user.unlocked;

    document.getElementById("form-user-title-action").innerText = "Editar Aluno Selecionado";
    document.getElementById("btn-submit-user").innerText = "Atualizar Aluno";
    document.getElementById("btn-cancel-user-edit").style.display = "block";
  }

  function resetUserForm() {
    document.getElementById("edit-user-id").value = "";
    document.getElementById("form-admin-user").reset();
    document.getElementById("user-unlocked-checkbox").checked = true;
    
    document.getElementById("form-user-title-action").innerText = "Cadastrar Novo Aluno";
    document.getElementById("btn-submit-user").innerText = "Salvar Aluno";
    document.getElementById("btn-cancel-user-edit").style.display = "none";
  }

  document.getElementById("btn-cancel-user-edit").addEventListener("click", resetUserForm);

  // ==========================================
  // EVENT LISTENERS E CLIQUES
  // ==========================================
  
  // Triggers de Compra (Landing page -> Checkout)
  document.querySelectorAll(".btn-buy-trigger").forEach(btn => {
    btn.addEventListener("click", openCheckout);
  });

  // Fechar Modal Checkout
  document.getElementById("btn-close-checkout").addEventListener("click", () => {
    checkoutModal.classList.remove("active");
  });

  // Controles de Abas do Checkout Modal
  const btnCheckoutTabRegister = document.getElementById("btn-checkout-tab-register");
  const btnCheckoutTabLogin = document.getElementById("btn-checkout-tab-login");
  const checkoutSubRegister = document.getElementById("checkout-sub-register");
  const checkoutSubLogin = document.getElementById("checkout-sub-login");

  btnCheckoutTabRegister.addEventListener("click", () => {
    btnCheckoutTabRegister.classList.add("active");
    btnCheckoutTabLogin.classList.remove("active");
    checkoutSubRegister.style.display = "block";
    checkoutSubLogin.style.display = "none";
  });

  btnCheckoutTabLogin.addEventListener("click", () => {
    btnCheckoutTabLogin.classList.add("active");
    btnCheckoutTabRegister.classList.remove("active");
    checkoutSubRegister.style.display = "none";
    checkoutSubLogin.style.display = "block";
  });

  // Cadastro de Usuário no Checkout
  document.getElementById("form-checkout-register").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("checkout-reg-name").value.trim();
    const email = document.getElementById("checkout-reg-email").value.trim().toLowerCase();
    const password = document.getElementById("checkout-reg-password").value;
    
    if (users.some(u => u.email.toLowerCase() === email)) {
      alert("Este e-mail já está cadastrado. Por favor, faça login no portal ou use outro e-mail.");
      return;
    }
    
    const newUser = {
      name: name,
      email: email,
      password: password,
      unlocked: false
    };
    
    users.push(newUser);
    currentUser = newUser; // Salva na sessão ativa do navegador
    localStorage.setItem("exatas_v2_users", JSON.stringify(users));
    localStorage.setItem("exatas_v2_current_user", JSON.stringify(currentUser));
    
    renderCheckoutPix(email);
  });

  // Login de Usuário no Checkout
  document.getElementById("form-checkout-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("checkout-login-email").value.trim().toLowerCase();
    const password = document.getElementById("checkout-login-password").value;
    
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (user) {
      currentUser = user;
      localStorage.setItem("exatas_v2_current_user", JSON.stringify(currentUser));
      updateUserBadge();

      if (user.unlocked) {
        alert("Sua conta já possui acesso liberado! Redirecionando para o Portal do Aluno...");
        checkoutModal.classList.remove("active");
        renderDashboard();
        navigateTo("section-dashboard");
      } else {
        renderCheckoutPix(email);
      }
    } else {
      alert("E-mail ou senha incorretos.");
    }
  });

  // Login Modal - Abrir
  function openLogin() {
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    loginModal.classList.add("active");
    setTimeout(() => {
      document.getElementById("login-email").focus();
    }, 100);
  }

  // Botão "Área do Aluno" na Landing
  document.getElementById("btn-goto-student").addEventListener("click", () => {
    if (currentUser && currentUser.unlocked) {
      renderDashboard();
      navigateTo("section-dashboard");
    } else {
      openLogin();
    }
  });

  // Fechar Login Modal
  document.getElementById("btn-close-login").addEventListener("click", () => {
    loginModal.classList.remove("active");
  });

  // Link Login -> Checkout
  document.getElementById("link-login-to-checkout").addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.remove("active");
    openCheckout();
  });

  // Enviar formulário de login do aluno
  document.getElementById("form-student-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (user) {
      if (user.unlocked) {
        currentUser = user;
        localStorage.setItem("exatas_v2_current_user", JSON.stringify(currentUser));
        loginModal.classList.remove("active");
        updateUserBadge();
        renderDashboard();
        navigateTo("section-dashboard");
      } else {
        alert("Sua conta está pendente de liberação. Por favor, realize o Pix de R$ 24,90 e envie o comprovante ao administrador.");
      }
    } else {
      alert("E-mail ou senha incorretos.");
    }
  });

  // Botão Sair do Dashboard (Voltar para a página inicial e limpar sessão)
  document.getElementById("btn-logout").addEventListener("click", () => {
    if (confirm("Deseja deslogar e voltar para a página inicial?")) {
      currentUser = null;
      localStorage.removeItem("exatas_v2_current_user");
      renderLandingPage();
      navigateTo("section-landing");
    }
  });

  // Triggers Política de Privacidade
  document.getElementById("link-privacy-policy").addEventListener("click", (e) => {
    e.preventDefault();
    privacyModal.classList.add("active");
  });

  document.getElementById("btn-close-privacy").addEventListener("click", () => {
    privacyModal.classList.remove("active");
  });

  // Abrir modal de Login do Admin
  function openAdminLogin() {
    document.getElementById("admin-login-password").value = "";
    adminLoginModal.classList.add("active");
    setTimeout(() => {
      document.getElementById("admin-login-password").focus();
    }, 100);
  }

  // Abrir Admin pelo link discreto do Footer
  document.getElementById("btn-admin-gate").addEventListener("click", () => {
    openAdminLogin();
  });

  // Abrir Admin pela Sidebar
  document.getElementById("btn-dashboard-admin").addEventListener("click", () => {
    openAdminLogin();
  });

  // Fechar Modal Login Admin
  document.getElementById("btn-close-admin-login").addEventListener("click", () => {
    adminLoginModal.classList.remove("active");
  });

  // Fechar Modais ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("active");
    }
    if (e.target === adminLoginModal) {
      adminLoginModal.classList.remove("active");
    }
    if (e.target === loginModal) {
      loginModal.classList.remove("active");
    }
    if (e.target === privacyModal) {
      privacyModal.classList.remove("active");
    }
  });

  // Submeter senha do Admin
  document.getElementById("btn-submit-admin-login").addEventListener("click", () => {
    const passwordInput = document.getElementById("admin-login-password");
    if (passwordInput.value === config.adminPassword) {
      adminLoginModal.classList.remove("active");
      renderAdmin();
      navigateTo("section-admin");
    } else {
      alert("Senha incorreta!");
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  // Submeter senha do Admin com Enter no input
  document.getElementById("admin-login-password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("btn-submit-admin-login").click();
    }
  });

  // Controle de Abas no Painel Admin
  const btnTabAdminContent = document.getElementById("btn-tab-admin-content");
  const btnTabAdminUsers = document.getElementById("btn-tab-admin-users");

  btnTabAdminContent.addEventListener("click", () => {
    btnTabAdminContent.classList.add("active");
    btnTabAdminUsers.classList.remove("active");
    btnTabAdminContent.style.color = "var(--text-primary)";
    btnTabAdminUsers.style.color = "var(--text-secondary)";
    adminTabContent.style.display = "block";
    adminTabUsers.style.display = "none";
  });

  btnTabAdminUsers.addEventListener("click", () => {
    btnTabAdminUsers.classList.add("active");
    btnTabAdminContent.classList.remove("active");
    btnTabAdminUsers.style.color = "var(--text-primary)";
    btnTabAdminContent.style.color = "var(--text-secondary)";
    adminTabContent.style.display = "none";
    adminTabUsers.style.display = "block";
    renderAdminUsers();
  });

  // Navegar de volta do Admin
  document.getElementById("btn-admin-to-dashboard").addEventListener("click", () => {
    if (currentUser && currentUser.unlocked) {
      renderDashboard();
      navigateTo("section-dashboard");
    } else {
      renderLandingPage();
      navigateTo("section-landing");
    }
  });

  document.getElementById("btn-admin-to-landing").addEventListener("click", () => {
    renderLandingPage();
    navigateTo("section-landing");
  });

  // Ouvintes de Busca e Filtro de Tópicos
  document.getElementById("search-materials").addEventListener("input", renderMaterials);

  // FAQ Accordion
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const isActive = item.classList.contains("active");
      
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
      
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // ==========================================
  // LÓGICA DO FÓRUM DO DASHBOARD (EXCLUSIVO)
  // ==========================================
  
  let forumPosts = JSON.parse(localStorage.getItem("exatas_v2_forum_posts")) || [
    {
      id: "post-1",
      title: "Dúvida na questão 15 de Combinatória (FME Vol 5)",
      category: "matematica",
      content: "Alguém conseguiu resolver a questão de arranjos simples com repetição? Tentei aplicar a fórmula padrão mas o gabarito bate 120 e o meu dá 240.",
      authorName: "Thiago Silva",
      authorInitials: "TS",
      createdAt: "2026-06-12T14:20:00Z",
      likes: 5,
      likedBy: [],
      comments: [
        {
          id: "c-1",
          authorName: "Ana Souza",
          authorInitials: "AS",
          text: "Thiago, lembre-se que você precisa dividir pelo fatorial dos elementos repetidos. Por isso o seu deu o dobro!",
          createdAt: "2026-06-12T15:10:00Z"
        }
      ]
    },
    {
      id: "post-2",
      title: "Como entender o efeito fotoelétrico de forma intuitiva?",
      category: "fisica",
      content: "Sempre me confundo na prova se a energia cinética máxima dos elétrons emitidos depende da intensidade da luz ou apenas da frequência. Podem ajudar?",
      authorName: "Pedro Lima",
      authorInitials: "PL",
      createdAt: "2026-06-11T09:30:00Z",
      likes: 8,
      likedBy: [],
      comments: []
    }
  ];

  let currentForumCat = "all";
  let forumSearchQuery = "";

  function renderForumPosts() {
    const container = document.getElementById("forum-posts-container");
    const emptyState = document.getElementById("forum-empty-state");
    
    let filtered = forumPosts;
    
    // Filtro de Categoria
    if (currentForumCat !== "all") {
      filtered = filtered.filter(p => p.category === currentForumCat);
    }
    
    // Filtro de Busca
    if (forumSearchQuery.trim() !== "") {
      const q = forumSearchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }
    
    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }
    
    emptyState.style.display = "none";
    
    // Ordenar por data recente
    const sorted = [...filtered].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = sorted.map(post => {
      const isLiked = currentUser && post.likedBy.includes(currentUser.email);
      const commentsList = post.comments.map(c => `
        <div class="comment-item">
          <div class="comment-avatar">${c.authorInitials}</div>
          <div class="comment-content-box">
            <div class="comment-meta">
              <span class="comment-author">${c.authorName}</span>
              <span class="comment-time">${new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="comment-text">${c.text}</p>
          </div>
        </div>
      `).join("");
      
      const catsMap = {
        matematica: "Matemática",
        fisica: "Física",
        quimica: "Química",
        geral: "Geral"
      };
      
      return `
        <div class="post-card" id="post-card-${post.id}">
          <div class="post-card-header">
            <div class="post-author-info">
              <div class="author-avatar">${post.authorInitials}</div>
              <div class="author-details">
                <span class="author-name">${post.authorName}</span>
                <span class="post-time">${new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <span class="category-badge ${post.category}">${catsMap[post.category] || post.category}</span>
          </div>
          <div class="post-card-body">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
          </div>
          <div class="post-card-footer">
            <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="window.likeForumPost('${post.id}')">
              <span>❤️</span> <span>${post.likes}</span> Curtidas
            </button>
            <button class="post-action-btn" onclick="window.toggleComments('${post.id}')">
              <span>💬</span> <span>${post.comments.length}</span> Comentários
            </button>
          </div>
          
          <div class="comments-section hidden" id="comments-${post.id}">
            <h4 class="comments-title">Comentários</h4>
            <div class="comments-list">
              ${post.comments.length === 0 ? '<p class="comment-text" style="text-align:center; padding:10px 0;">Sem respostas ainda. Ajude o colega!</p>' : commentsList}
            </div>
            <form class="add-comment-form" onsubmit="window.submitComment(event, '${post.id}')">
              <input type="text" placeholder="Escreva sua resposta..." required>
              <button type="submit" class="btn btn-primary btn-sm">Enviar</button>
            </form>
          </div>
        </div>
      `;
    }).join("");
  }

  window.likeForumPost = (postId) => {
    const post = forumPosts.find(p => p.id === postId);
    if (!post) return;
    if (!currentUser) return;
    
    const idx = post.likedBy.indexOf(currentUser.email);
    if (idx === -1) {
      post.likedBy.push(currentUser.email);
      post.likes++;
    } else {
      post.likedBy.splice(idx, 1);
      post.likes--;
    }
    localStorage.setItem("exatas_v2_forum_posts", JSON.stringify(forumPosts));
    renderForumPosts();
  };

  window.toggleComments = (postId) => {
    const el = document.getElementById(`comments-${postId}`);
    if (el) el.classList.toggle("hidden");
  };

  window.submitComment = (e, postId) => {
    e.preventDefault();
    const post = forumPosts.find(p => p.id === postId);
    if (!post) return;
    const input = e.target.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    
    const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    post.comments.push({
      id: "c-" + Date.now(),
      authorName: currentUser.name,
      authorInitials: initials,
      text: text,
      createdAt: new Date().toISOString()
    });
    
    localStorage.setItem("exatas_v2_forum_posts", JSON.stringify(forumPosts));
    renderForumPosts();
    
    // Keep drawer open
    const el = document.getElementById(`comments-${postId}`);
    if (el) el.classList.remove("hidden");
  };

  const btnSidebarForum = document.getElementById("btn-sidebar-forum");
  const dashboardMaterialsView = document.getElementById("dashboard-materials-view");
  const dashboardForumView = document.getElementById("dashboard-forum-view");
  const modalForumNewPost = document.getElementById("forum-new-post-modal");

  btnSidebarForum.addEventListener("click", () => {
    if (!currentUser) {
      alert("Você precisa fazer login para acessar o fórum!");
      openLogin();
      return;
    }
    
    if (!currentUser.unlocked) {
      alert("Acesso restrito! O fórum é exclusivo para alunos com o plano premium de R$ 24,90 ativo.");
      openCheckout();
      return;
    }

    // Ativar aba do fórum na sidebar
    document.querySelectorAll("#sidebar-areas-nav .nav-link").forEach(el => el.classList.remove("active"));
    btnSidebarForum.classList.add("active");
    
    // Mudar viewports
    dashboardMaterialsView.style.display = "none";
    dashboardForumView.style.display = "block";
    
    renderForumPosts();
  });

  document.getElementById("btn-trigger-new-post").addEventListener("click", () => {
    modalForumNewPost.classList.add("active");
  });

  document.getElementById("btn-close-forum-new-post").addEventListener("click", () => {
    modalForumNewPost.classList.remove("active");
  });

  document.getElementById("btn-cancel-forum-new-post").addEventListener("click", () => {
    modalForumNewPost.classList.remove("active");
  });

  document.getElementById("form-forum-new-post").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("forum-post-title").value.trim();
    const category = document.getElementById("forum-post-category").value;
    const content = document.getElementById("forum-post-content").value.trim();
    
    const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    
    forumPosts.push({
      id: "post-" + Date.now(),
      title: title,
      category: category,
      content: content,
      authorName: currentUser.name,
      authorInitials: initials,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    });
    
    localStorage.setItem("exatas_v2_forum_posts", JSON.stringify(forumPosts));
    renderForumPosts();
    modalForumNewPost.classList.remove("active");
    document.getElementById("form-forum-new-post").reset();
  });

  document.querySelectorAll(".forum-cat-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".forum-cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentForumCat = btn.getAttribute("data-forum-cat");
      renderForumPosts();
    });
  });

  document.getElementById("forum-search-input").addEventListener("input", (e) => {
    forumSearchQuery = e.target.value;
    renderForumPosts();
  });

  // Fechar Modal Fórum ao clicar fora
  window.addEventListener("click", (e) => {
    if (e.target === modalForumNewPost) {
      modalForumNewPost.classList.remove("active");
    }
  });

  // ==========================================
  // INICIALIZAR APLICAÇÃO
  // ==========================================
  checkInitialRoute();
});
