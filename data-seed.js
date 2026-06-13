// data-seed.js - Banco de Dados para o Curso de Exatas Premium (FME, TF & Poliedro)

const DEFAULT_PLATFORM_CONFIG = {
  productName: "Combo Exatas Premium - FME, TF & Poliedro",
  productPrice: 24.90,
  pixKey: "marcelonotdam@gmail.com",
  pixReceiverName: "Marcelo Henrique Ceolin Webber",
  pixCity: "PASSO FUNDO",
  adminPassword: "banguela6742",
  landingPage: {
    heroTitle: "Domine as matérias mais difíceis do vestibular com os melhores materiais do mercado!",
    heroSubtitle: "Acesso completo e imediato às coleções de Fundamentos da Matemática Elementar (FME), Tópicos de Física (TF) e Poliedro Química + Resoluções detalhadas.",
    ctaText: "Garantir Acesso ao Combo por R$ 24,90",
    features: [
      { icon: "📐", title: "Fundamentos de Matemática Elementar", desc: "A coleção completa do FME (livros de teoria e exercícios) mais procurada por vestibulandos do ITA/IME e ENEM." },
      { icon: "⚡", title: "Tópicos de Física (TF)", desc: "Coleção de Física mais conceituada do país, cobrindo Mecânica, Termologia e Eletricidade em alto nível." },
      { icon: "🧪", title: "Química Poliedro", desc: "Material teórico-prático do Poliedro (Livros 1 a 4) com excelente didática e profundidade." },
      { icon: "🔑", title: "Resoluções Passo a Passo", desc: "Arquivos com gabaritos detalhados e resoluções das coleções FME e Tópicos de Física." }
    ],
    benefits: [
      "Acesso completo a 26 volumes em PDF",
      "Resoluções e gabaritos detalhados inclusos",
      "Ideal para preparação ENEM, FUVEST, ITA e IME",
      "Download direto e visualização integrada"
    ]
  }
};

const DEFAULT_MATERIALS_DATA = [
  // ========================================================
  // MATEMÁTICA (FME) - LIVROS (TEORIA)
  // ========================================================
  {
    id: "fme-l-1",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 1 - Conjuntos e Funções",
    description: "Teoria geral de conjuntos, relações, funções afins, quadráticas e modais com exercícios gabaritados.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 1 - Conjuntos, Funções.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 1 - Conjuntos, Funções.pdf",
    size: "63.9 MB"
  },
  {
    id: "fme-l-2",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 2 - Logaritmos",
    description: "Potências, raízes, funções exponenciais, logaritmos, equações e inequações exponenciais e logarítmicas.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 2 - Logaritmos.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 2 - Logaritmos.pdf",
    size: "35.2 MB"
  },
  {
    id: "fme-l-3",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 3 - Trigonometria",
    description: "Arcos, funções trigonométricas, equações, inequações e relações métricas nos triângulos.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 3 - Trigonometria.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 3 - Trigonometria.pdf",
    size: "6.0 MB"
  },
  {
    id: "fme-l-4",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 4 - Sequências, Matrizes e Determinantes",
    description: "Progressões aritméticas e geométricas, matrizes, determinantes e sistemas lineares.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 4 - Sequências, Matrizes, Determinantes, Sistemas.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 4 - Sequências, Matrizes, Determinantes, Sistemas.pdf",
    size: "5.9 MB"
  },
  {
    id: "fme-l-5",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 5 - Combinatória e Probabilidade",
    description: "Análise combinatória básica e avançada, binômio de Newton e probabilidade.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 5 - Combinatória e Probabilidade - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 5 - Combinatória e Probabilidade - Resoluções.pdf",
    size: "40.5 MB"
  },
  {
    id: "fme-l-6",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 6 - Complexos e Polinômios",
    description: "Números complexos, polinômios, equações polinomiais e propriedades gerais das raízes.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 6 - Complexos, Polinômios, Equacoes.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 6 - Complexos, Polinômios, Equacoes.pdf",
    size: "5.6 MB"
  },
  {
    id: "fme-l-7",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 7 - Geometria Analítica",
    description: "Estudo analítico do ponto, reta, circunferência, elipse, hipérbole e parábola no plano cartesiano.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 7 - Geometria Analitica.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 7 - Geometria Analitica.pdf",
    size: "6.5 MB"
  },
  {
    id: "fme-l-9",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 9 - Geometria Plana",
    description: "Triângulos, polígonos, circunferências, áreas de superfícies planas e teoremas fundamentais.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 9 - Geometria Plana.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 9 - Geometria Plana.pdf",
    size: "12.4 MB"
  },
  {
    id: "fme-l-10",
    area: "matematica",
    subject: "fme_livros",
    title: "FME Vol. 10 - Geometria Espacial",
    description: "Estudo analítico e geométrico de prismas, pirâmides, cilindros, cones, esferas e sólidos.",
    type: "pdf",
    url: "MATEMÁTICA/FME/Volume 10 - Geometria Espacial.pdf",
    downloadUrl: "MATEMÁTICA/FME/Volume 10 - Geometria Espacial.pdf",
    size: "43.5 MB"
  },

  // ========================================================
  // MATEMÁTICA (FME) - RESOLUÇÕES
  // ========================================================
  {
    id: "fme-r-1",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 1 - Resoluções Detalhadas",
    description: "Gabarito passo a passo dos exercícios de fixação e desafios do Volume 1.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 1 - Conjuntos e Funções - Resuluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 1 - Conjuntos e Funções - Resuluções.pdf",
    size: "28.6 MB"
  },
  {
    id: "fme-r-2",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 2 - Resoluções Detalhadas",
    description: "Resoluções passo a passo de todas as equações exponenciais e logarítmicas do Volume 2.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 2 - Logaritmos - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 2 - Logaritmos - Resoluções.pdf",
    size: "58.5 MB"
  },
  {
    id: "fme-r-3",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 3 - Resoluções Detalhadas",
    description: "Resoluções das identidades, equações trigonométricas e triângulos do Volume 3.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 3 - Trigonometria - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 3 - Trigonometria - Resoluções.pdf",
    size: "35.0 MB"
  },
  {
    id: "fme-r-4",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 4 - Resoluções Detalhadas",
    description: "Resoluções dos determinantes e sistemas lineares complexos do Volume 4.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 4 - Sequências - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 4 - Sequências - Resoluções.pdf",
    size: "33.7 MB"
  },
  {
    id: "fme-r-5",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 5 - Resoluções Detalhadas",
    description: "Passo a passo dos problemas combinatórios e probabilidades do Volume 5.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 5 - Combinatória e Probabilidade - Resoluções (1).pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 5 - Combinatória e Probabilidade - Resoluções (1).pdf",
    size: "42.5 MB"
  },
  {
    id: "fme-r-6",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 6 - Resoluções Detalhadas",
    description: "Solução comentada dos complexos e divisões de polinômios do Volume 6.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 6 - Complexos e Polinômios - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 6 - Complexos e Polinômios - Resoluções.pdf",
    size: "32.4 MB"
  },
  {
    id: "fme-r-7",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 7 - Resoluções Detalhadas",
    description: "Resoluções analíticas de cônicas e intersecções de retas do Volume 7.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 7 - Geometria Analítica - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 7 - Geometria Analítica - Resoluções.pdf",
    size: "38.4 MB"
  },
  {
    id: "fme-r-9",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 9 - Resoluções Detalhadas",
    description: "Resolução detalhada de todas as demonstrações e áreas planas do Volume 9.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 9 - Geometria Plana - Resoluções.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 9 - Geometria Plana - Resoluções.pdf",
    size: "60.5 MB"
  },
  {
    id: "fme-r-10",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Vol. 10 - Resoluções Detalhadas",
    description: "Soluções de prismas, cones e pirâmides tridimensionais do Volume 10.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 10 - Geometria Espacial - Resolução.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/Volume 10 - Geometria Espacial - Resolução.pdf",
    size: "52.7 MB"
  },
  {
    id: "fme-r-extra",
    area: "matematica",
    subject: "fme_resolucoes",
    title: "FME Respostas Geral - Vol. 1",
    description: "Documento extra contendo gabaritos consolidados rápidos para o Volume 1.",
    type: "pdf",
    url: "MATEMÁTICA/FME - RESOLUÇÕES/705735289-Fundamentos-Da-Matematica-Elementar-1-Respostas.pdf",
    downloadUrl: "MATEMÁTICA/FME - RESOLUÇÕES/705735289-Fundamentos-Da-Matematica-Elementar-1-Respostas.pdf",
    size: "2.4 MB"
  },

  // ========================================================
  // FÍSICA (TÓPICOS DE FÍSICA) - LIVROS (TEORIA)
  // ========================================================
  {
    id: "tf-l-1",
    area: "fisica",
    subject: "tf_livros",
    title: "Tópicos de Física Vol. 1 - Mecânica",
    description: "Cinemática, Dinâmica, Trabalho, Energia, Conservação de Energia, Colisões e Estática.",
    type: "pdf",
    url: "FÍSICA/TF/Tópicos de Física - Vol. 1.pdf",
    downloadUrl: "FÍSICA/TF/Tópicos de Física - Vol. 1.pdf",
    size: "62.5 MB"
  },
  {
    id: "tf-l-2",
    area: "fisica",
    subject: "tf_livros",
    title: "Tópicos de Física Vol. 2 - Termologia e Óptica",
    description: "Termometria, Calorimetria, Gases Ideais, Termodinâmica, Óptica Geométrica e Ondulatória.",
    type: "pdf",
    url: "FÍSICA/TF/Tópicos de Física - Vol. 2.pdf",
    downloadUrl: "FÍSICA/TF/Tópicos de Física - Vol. 2.pdf",
    size: "60.5 MB"
  },
  {
    id: "tf-l-3",
    area: "fisica",
    subject: "tf_livros",
    title: "Tópicos de Física Vol. 3 - Eletricidade e Física Moderna",
    description: "Eletrostática, Eletrodinâmica, Magnetismo, Eletromagnetismo e noções de Física Moderna.",
    type: "pdf",
    url: "FÍSICA/TF/Tópicos de Física - Vol. 3.pdf",
    downloadUrl: "FÍSICA/TF/Tópicos de Física - Vol. 3.pdf",
    size: "38.3 MB"
  },

  // ========================================================
  // FÍSICA (TÓPICOS DE FÍSICA) - RESOLUÇÕES
  // ========================================================
  {
    id: "tf-r-1",
    area: "fisica",
    subject: "tf_resolucoes",
    title: "Resoluções TF Vol. 1 - Mecânica",
    description: "Resoluções completas comentadas dos exercícios de fixação e nível avançado do Volume 1.",
    type: "pdf",
    url: "FÍSICA/TF - RESOLUÇÕES/Volume 1 - Mecânica.pdf",
    downloadUrl: "FÍSICA/TF - RESOLUÇÕES/Volume 1 - Mecânica.pdf",
    size: "34.6 MB"
  },
  {
    id: "tf-r-2",
    area: "fisica",
    subject: "tf_resolucoes",
    title: "Resoluções TF Vol. 2 - Termologia & Óptica",
    description: "Soluções de todos os problemas de termodinâmica e ótica contidos no Volume 2.",
    type: "pdf",
    url: "FÍSICA/TF - RESOLUÇÕES/Volume 2 - Termologia.pdf",
    downloadUrl: "FÍSICA/TF - RESOLUÇÕES/Volume 2 - Termologia.pdf",
    size: "26.1 MB"
  },
  {
    id: "tf-r-3",
    area: "fisica",
    subject: "tf_resolucoes",
    title: "Resoluções TF Vol. 3 - Eletricidade",
    description: "Soluções das análises de circuitos, capacitores e malhas complexas do Volume 3.",
    type: "pdf",
    url: "FÍSICA/TF - RESOLUÇÕES/Volume 3 - Eletricidade.pdf",
    downloadUrl: "FÍSICA/TF - RESOLUÇÕES/Volume 3 - Eletricidade.pdf",
    size: "23.4 MB"
  },

  // ========================================================
  // QUÍMICA (POLIEDRO)
  // ========================================================
  {
    id: "pol-1",
    area: "quimica",
    subject: "poliedro_livros",
    title: "Química Poliedro - Livro 1",
    description: "Química geral, estrutura atômica, tabela periódica, ligações químicas e reações inorgânicas.",
    type: "pdf",
    url: "QUÍMICA/POLIEDRO/Química - Livro 1.pdf",
    downloadUrl: "QUÍMICA/POLIEDRO/Química - Livro 1.pdf",
    size: "21.8 MB"
  },
  {
    id: "pol-2",
    area: "quimica",
    subject: "poliedro_livros",
    title: "Química Poliedro - Livro 2",
    description: "Estequiometria, estudo dos gases, soluções, termoquímica e cinética química.",
    type: "pdf",
    url: "QUÍMICA/POLIEDRO/Química - Livro 2.pdf",
    downloadUrl: "QUÍMICA/POLIEDRO/Química - Livro 2.pdf",
    size: "23.6 MB"
  },
  {
    id: "pol-3",
    area: "quimica",
    subject: "poliedro_livros",
    title: "Química Poliedro - Livro 3",
    description: "Equilíbrio químico, eletroquímica (pilhas e eletrólise) e introdução à química orgânica.",
    type: "pdf",
    url: "QUÍMICA/POLIEDRO/Química - Livro 3.pdf",
    downloadUrl: "QUÍMICA/POLIEDRO/Química - Livro 3.pdf",
    size: "15.6 MB"
  },
  {
    id: "pol-4",
    area: "quimica",
    subject: "poliedro_livros",
    title: "Química Poliedro - Livro 4",
    description: "Nomenclatura orgânica avançada, isomeria, reações orgânicas e bioquímica básica.",
    type: "pdf",
    url: "QUÍMICA/POLIEDRO/Química - Livro 4.pdf",
    downloadUrl: "QUÍMICA/POLIEDRO/Química - Livro 4.pdf",
    size: "19.9 MB"
  }
];

const SUBJECTS_METADATA = {
  matematica: {
    title: "Matemática (Coleção FME)",
    subjects: {
      fme_livros: "Livros (Teoria)",
      fme_resolucoes: "Resoluções Detalhadas"
    }
  },
  fisica: {
    title: "Física (Tópicos de Física)",
    subjects: {
      tf_livros: "Livros (Teoria)",
      tf_resolucoes: "Resoluções Detalhadas"
    }
  },
  quimica: {
    title: "Química (Poliedro)",
    subjects: {
      poliedro_livros: "Livros Poliedro"
    }
  }
};

const DEFAULT_USERS_DATA = [
  {
    name: "Aluno de Teste",
    email: "aluno@exatas.com",
    password: "123",
    unlocked: true
  }
];

