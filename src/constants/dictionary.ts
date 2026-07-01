export type Lang = "en" | "uz" | "ru";

export interface Dictionary {
  nav: {
    metrics: string;
    calculator: string;
    comparison: string;
    waitlist: string;
  };
  hero: {
    headline: string;
    sub: string;
    cta: string;
  };
  metrics: {
    capex: { value: string; label: string; detail: string };
    deploy: { value: string; label: string; detail: string };
    edge: { value: string; label: string; detail: string };
  };
  problem: {
    eyebrow: string;
    waste: { value: string; label: string };
    fatigue: { value: string; label: string };
    leakage: { value: string; label: string; detail: string };
  };
  calculator: {
    title: string;
    baseFee: string;
    variableFee: string;
    volumeLabel: string;
    unitsSuffix: string;
    estimatedLabel: string;
    perMonth: string;
    breakdownBase: string;
    breakdownVariable: string;
  };
  comparison: {
    title: string;
    headers: { feature: string; manual: string; keyence: string; corobox: string };
    rows: { feature: string; manual: string; keyence: string; corobox: string }[];
  };
  traction: {
    eyebrow: string;
    title: string;
    body: string;
    badge: string;
  };
  waitlist: {
    title: string;
    sub: string;
    companyName: string;
    lineType: string;
    lineTypePlaceholder: string;
    monthlyVolume: string;
    contactName: string;
    phone: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  footer: {
    rights: string;
  };
}

export const dictionary: Record<Lang, Dictionary> = {
  en: {
    nav: {
      metrics: "Metrics",
      calculator: "Calculator",
      comparison: "Comparison",
      waitlist: "Join Waitlist",
    },
    hero: {
      headline: "Automate Packaging Quality Control With Zero Line Disruption.",
      sub: "Over-the-line Edge-AI vision inspection for food, beverage, and pharmaceutical lines.",
      cta: "Get Your Cost Estimate",
    },
    metrics: {
      capex: {
        value: "$0 Upfront Capital",
        label: "No CapEx",
        detail: "Eliminates CapEx barrier to adoption.",
      },
      deploy: {
        value: "< 2-Hour Deployment",
        label: "Fast Install",
        detail: "Installs over your existing conveyor.",
      },
      edge: {
        value: "100% Local Edge-AI",
        label: "On-Prem Inference",
        detail: "Low latency, zero internet dependency.",
      },
    },
    problem: {
      eyebrow: "The Problem",
      waste: { value: "1.2B UZS ($95K)", label: "Annual Waste" },
      fatigue: { value: "80%", label: "Cognitive Fatigue Drop" },
      leakage: {
        value: "Financial Leakage",
        label: "Retailer fines & recalls",
        detail: "Defects reaching the end customer carry compounding cost.",
      },
    },
    calculator: {
      title: "Hybrid Pricing Calculator",
      baseFee: "Base platform fee: $150",
      variableFee: "Variable volume fee: $0.15 per 1,000 units",
      volumeLabel: "Monthly Production Volume",
      unitsSuffix: "units / month",
      estimatedLabel: "Estimated Monthly Cost",
      perMonth: "/ month",
      breakdownBase: "Base fee",
      breakdownVariable: "Volume fee",
    },
    comparison: {
      title: "Manual Labor vs. Keyence vs. Corobox",
      headers: { feature: "Metric", manual: "Manual Labor", keyence: "Keyence Vision", corobox: "Corobox" },
      rows: [
        { feature: "Upfront Capital", manual: "$0", keyence: "$40K–$120K", corobox: "$0" },
        { feature: "Deployment Time", manual: "N/A", keyence: "2–6 weeks", corobox: "< 2 hours" },
        { feature: "Detection Consistency", manual: "Degrades after 2h", keyence: "Fixed-rule based", corobox: "Constant, AI-adaptive" },
        { feature: "Line Modification", manual: "None", keyence: "Often required", corobox: "None" },
        { feature: "Internet Dependency", manual: "None", keyence: "Varies", corobox: "None (local Edge-AI)" },
      ],
    },
    traction: {
      eyebrow: "Traction",
      title: "Conditional Letter of Intent — Rash Milk",
      body: "Rash Milk has executed a conditional LOI to pilot Corobox on its primary bottling line, contingent on a 30-day on-site accuracy benchmark.",
      badge: "LOI Executed",
    },
    waitlist: {
      title: "Join the Waitlist",
      sub: "Get a line-specific cost estimate and pilot scheduling priority.",
      companyName: "Company Name",
      lineType: "Production Line Type",
      lineTypePlaceholder: "e.g. PET bottling, blister pack, carton",
      monthlyVolume: "Monthly Volume (units)",
      contactName: "Contact Name",
      phone: "Phone Number",
      submit: "Submit",
      submitting: "Submitting...",
      success: "Request received. Our deployment team will contact you within 48 hours.",
      error: "Submission failed. Please check your details and try again.",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },

  uz: {
    nav: {
      metrics: "Ko'rsatkichlar",
      calculator: "Kalkulyator",
      comparison: "Taqqoslash",
      waitlist: "Ro'yxatga yozilish",
    },
    hero: {
      headline: "Konveyer liniyasini to'xtatmasdan qadoqlash sifatini avtomatlashtiring.",
      sub: "Oziq-ovqat, ichimliklar va farmatsevtika liniyalari uchun to'g'ridan-to'g'ri konveyer ustiga o'rnatiladigan Edge-AI kompyuter ko'rish tizimi.",
      cta: "Narx hisobini oling",
    },
    metrics: {
      capex: {
        value: "$0 Boshlang'ich investitsiya",
        label: "CapEx yo'q",
        detail: "Katta xarajatlarsiz avtomatlashtirish.",
      },
      deploy: {
        value: "< 2 soat ichida o'rnatish",
        label: "Tez montaj",
        detail: "Mavjud liniyalarni kesmasdan montaj qilish.",
      },
      edge: {
        value: "100% Lokal Edge-AI",
        label: "Lokal hisoblash",
        detail: "Internet barqarorligiga bog'liqlik yo'q.",
      },
    },
    problem: {
      eyebrow: "Muammo",
      waste: { value: "Yillik 1.2 mlrd so'm ($95K)", label: "zarar" },
      fatigue: { value: "80%", label: "diqqat pasayishi" },
      leakage: {
        value: "Moliyaviy yo'qotishlar",
        label: "Sifatsiz mahsulot tufayli jarimalar",
        detail: "Brak mahsulotlar oqibatidagi yo'qotishlar mijozgacha yetganda kattalashadi.",
      },
    },
    calculator: {
      title: "Gibrid narxlash kalkulyatori",
      baseFee: "Baza platforma to'lovi: $150",
      variableFee: "O'zgaruvchan hajm to'lovi: har 1000 ta mahsulot uchun $0.15",
      volumeLabel: "Oylik ishlab chiqarish hajmi",
      unitsSuffix: "dona / oy",
      estimatedLabel: "Taxminiy oylik xarajat",
      perMonth: "/ oy",
      breakdownBase: "Baza to'lov",
      breakdownVariable: "Hajm to'lovi",
    },
    comparison: {
      title: "Qo'l mehnati vs. Keyence vs. Corobox",
      headers: { feature: "Ko'rsatkich", manual: "Qo'l mehnati", keyence: "Keyence Vision", corobox: "Corobox" },
      rows: [
        { feature: "Boshlang'ich xarajat", manual: "$0", keyence: "$40K–$120K", corobox: "$0" },
        { feature: "O'rnatish vaqti", manual: "Mavjud emas", keyence: "2–6 hafta", corobox: "< 2 soat" },
        { feature: "Aniqlash barqarorligi", manual: "2 soatdan keyin pasayadi", keyence: "Qattiq qoidalarga asoslangan", corobox: "Doimiy, AI moslashuvchan" },
        { feature: "Liniyani o'zgartirish", manual: "Talab qilinmaydi", keyence: "Ko'pincha talab qilinadi", corobox: "Talab qilinmaydi" },
        { feature: "Internetga bog'liqlik", manual: "Yo'q", keyence: "Har xil", corobox: "Yo'q (lokal Edge-AI)" },
      ],
    },
    traction: {
      eyebrow: "Bozor tasdig'i",
      title: "Shartli niyat xati — Rash Milk",
      body: "Rash Milk kompaniyasi 30 kunlik joyida aniqlik sinovi shartiga bog'liq holda, Corobox tizimini asosiy butilkalash liniyasida sinash uchun shartli niyat xatini imzoladi.",
      badge: "Niyat xati imzolandi",
    },
    waitlist: {
      title: "Ro'yxatga yoziling",
      sub: "Liniyangizga mos narx hisobini va sinov uchun ustuvor navbatni oling.",
      companyName: "Kompaniya nomi",
      lineType: "Ishlab chiqarish liniyasi turi",
      lineTypePlaceholder: "masalan, PET butilkalash, blister, karton",
      monthlyVolume: "Oylik hajm (dona)",
      contactName: "Aloqa shaxsi",
      phone: "Telefon raqami",
      submit: "Yuborish",
      submitting: "Yuborilmoqda...",
      success: "So'rov qabul qilindi. Bizning jamoamiz 48 soat ichida siz bilan bog'lanadi.",
      error: "Yuborishda xatolik yuz berdi. Ma'lumotlaringizni tekshirib, qayta urinib ko'ring.",
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan.",
    },
  },

  ru: {
    nav: {
      metrics: "Метрики",
      calculator: "Калькулятор",
      comparison: "Сравнение",
      waitlist: "Записаться",
    },
    hero: {
      headline: "Автоматизация контроля качества упаковки без остановки конвейера.",
      sub: "Инспекция на базе Edge-AI для пищевых, напиточных и фармацевтических линий прямо над конвейером.",
      cta: "Получить расчёт стоимости",
    },
    metrics: {
      capex: {
        value: "$0 Начальных вложений",
        label: "Без CapEx",
        detail: "Устраняет барьер CapEx для внедрения.",
      },
      deploy: {
        value: "< 2 часов на установку",
        label: "Быстрый монтаж",
        detail: "Монтаж без остановки производства.",
      },
      edge: {
        value: "100% Локальный Edge-AI",
        label: "Локальные вычисления",
        detail: "Работает без задержек и интернета.",
      },
    },
    problem: {
      eyebrow: "Проблема",
      waste: { value: "1.2 млрд сум ($95K)", label: "ежегодных потерь" },
      fatigue: { value: "80%", label: "падение концентрации" },
      leakage: {
        value: "Финансовые риски",
        label: "Штрафы ритейлеров и отзывы продукции",
        detail: "Дефекты, дошедшие до конечного покупателя, несут возрастающие издержки.",
      },
    },
    calculator: {
      title: "Гибридный калькулятор стоимости",
      baseFee: "Базовая плата: $150",
      variableFee: "Переменная плата за объем: $0.15 за 1000 единиц",
      volumeLabel: "Месячный объём производства",
      unitsSuffix: "ед. / месяц",
      estimatedLabel: "Расчётная месячная стоимость",
      perMonth: "/ месяц",
      breakdownBase: "Базовая плата",
      breakdownVariable: "Плата за объём",
    },
    comparison: {
      title: "Ручной труд vs. Keyence vs. Corobox",
      headers: { feature: "Метрика", manual: "Ручной труд", keyence: "Keyence Vision", corobox: "Corobox" },
      rows: [
        { feature: "Начальные вложения", manual: "$0", keyence: "$40K–$120K", corobox: "$0" },
        { feature: "Время развёртывания", manual: "Н/Д", keyence: "2–6 недель", corobox: "< 2 часов" },
        { feature: "Стабильность детекции", manual: "Снижается через 2ч", keyence: "На жёстких правилах", corobox: "Постоянная, адаптивный AI" },
        { feature: "Модификация линии", manual: "Не требуется", keyence: "Часто требуется", corobox: "Не требуется" },
        { feature: "Зависимость от интернета", manual: "Нет", keyence: "Зависит", corobox: "Нет (локальный Edge-AI)" },
      ],
    },
    traction: {
      eyebrow: "Подтверждённый интерес",
      title: "Условное письмо о намерениях — Rash Milk",
      body: "Компания Rash Milk подписала условное письмо о намерениях на пилотное внедрение Corobox на основной линии розлива, при условии успешного 30-дневного теста точности на месте.",
      badge: "Письмо подписано",
    },
    waitlist: {
      title: "Записаться в очередь",
      sub: "Получите расчёт стоимости под вашу линию и приоритет на пилотный запуск.",
      companyName: "Название компании",
      lineType: "Тип производственной линии",
      lineTypePlaceholder: "напр. розлив ПЭТ, блистер, картон",
      monthlyVolume: "Месячный объём (ед.)",
      contactName: "Контактное лицо",
      phone: "Номер телефона",
      submit: "Отправить",
      submitting: "Отправка...",
      success: "Заявка принята. Наша команда свяжется с вами в течение 48 часов.",
      error: "Ошибка отправки. Проверьте данные и попробуйте снова.",
    },
    footer: {
      rights: "Все права защищены.",
    },
  },
};
