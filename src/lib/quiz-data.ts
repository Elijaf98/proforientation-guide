export type Direction = "analyst" | "nocode" | "product" | "ops" | "growth" | "qa";

export type Scores = Record<Direction, number>;

export type QuizOption = {
  key: string;
  text: string;
  scores: Partial<Scores>;
  // For Q1 — which Q2 branch to show
  track?: "DATA" | "BUILD" | "PRODUCT" | "PEOPLE";
};

export type QuizQuestion = {
  key: string;
  text: string;
  options: QuizOption[];
};

// Q1 — common
export const q1: QuizQuestion = {
  key: "q1",
  text: "Когда перед тобой новая рабочая задача — что включается первым?",
  options: [
    {
      key: "a",
      text: "Разложить по таблице и посмотреть на цифры",
      scores: { analyst: 3, qa: 1 },
      track: "DATA",
    },
    {
      key: "b",
      text: "Придумать, как это автоматизировать, чтобы не делать руками",
      scores: { nocode: 3, ops: 1 },
      track: "BUILD",
    },
    {
      key: "c",
      text: "Понять, кому и зачем это нужно",
      scores: { product: 3, growth: 1 },
      track: "PRODUCT",
    },
    {
      key: "d",
      text: "Организовать шаги, людей и сроки",
      scores: { ops: 3, product: 1 },
      track: "PEOPLE",
    },
  ],
};

// Q2 — branches
export const q2ByTrack: Record<NonNullable<QuizOption["track"]>, QuizQuestion> = {
  DATA: {
    key: "q2",
    text: "С данными тебе важнее…",
    options: [
      { key: "a", text: "Найти закономерность и сделать вывод", scores: { analyst: 3, growth: 1 } },
      { key: "b", text: "Чтобы всё сходилось и не было ошибок", scores: { qa: 3, analyst: 1 } },
    ],
  },
  BUILD: {
    key: "q2",
    text: "В автоматизации тебя больше драйвит…",
    options: [
      {
        key: "a",
        text: "Собрать связку из сервисов (Make/Airtable/боты), чтобы процесс шёл сам",
        scores: { nocode: 3 },
      },
      { key: "b", text: "Чтобы система работала стабильно и без сбоев", scores: { qa: 2, nocode: 1 } },
    ],
  },
  PRODUCT: {
    key: "q2",
    text: "Тебе интереснее…",
    options: [
      { key: "a", text: "Придумывать фичи и проверять гипотезы", scores: { product: 3 } },
      {
        key: "b",
        text: "Разбираться по цифрам, почему люди приходят и уходят",
        scores: { growth: 3, analyst: 1 },
      },
    ],
  },
  PEOPLE: {
    key: "q2",
    text: "В работе с процессами тебе ближе…",
    options: [
      { key: "a", text: "Держать всё под контролем: статусы, сроки, договорённости", scores: { ops: 3 } },
      {
        key: "b",
        text: "Связывать людей и решать, что делаем в первую очередь",
        scores: { product: 2, ops: 1 },
      },
    ],
  },
};

export const q3: QuizQuestion = {
  key: "q3",
  text: 'Какая задача звучит как "прикольно, я бы сделал"?',
  options: [
    { key: "a", text: "Навести порядок в хаотичной таблице", scores: { analyst: 2, qa: 1 } },
    { key: "b", text: "Собрать бота/автоматизацию, экономящую часы рутины", scores: { nocode: 2 } },
    { key: "c", text: "Разобрать, какие функции продукта реально нужны", scores: { product: 2 } },
    { key: "d", text: "Запустить рекламную гипотезу и померить результат", scores: { growth: 2 } },
  ],
};

export const q4: QuizQuestion = {
  key: "q4",
  text: "Что тебя бесит сильнее всего?",
  options: [
    { key: "a", text: "Когда в цифрах бардак и ничего не сходится", scores: { analyst: 2, qa: 1 } },
    { key: "b", text: "Когда люди делают руками то, что можно автоматизировать", scores: { nocode: 2, ops: 1 } },
    { key: "c", text: "Когда делают фичу, которой никто не пользуется", scores: { product: 2 } },
    { key: "d", text: "Когда задачи висят без статусов и сроков", scores: { ops: 2 } },
  ],
};

export const q5: QuizQuestion = {
  key: "q5",
  text: "Через год ты хочешь уметь…",
  options: [
    { key: "a", text: "Строить дашборды и решать по данным", scores: { analyst: 2, growth: 1 } },
    { key: "b", text: "Автоматизировать любой процесс через no-code", scores: { nocode: 2 } },
    { key: "c", text: "Вести продукт от идеи до запуска", scores: { product: 2, ops: 1 } },
    { key: "d", text: "Управлять воронкой и ростом по метрикам", scores: { growth: 2 } },
  ],
};

export const TOTAL_QUESTIONS = 5;

export const DIRECTION_PRIORITY: Direction[] = [
  "analyst",
  "nocode",
  "product",
  "ops",
  "growth",
  "qa",
];

export type Conclusion = {
  title: string;
  description: string;
  toLearn: string;
  firstStep: string;
};

export const conclusions: Record<Direction, Conclusion> = {
  analyst: {
    title: "Аналитик данных",
    description:
      "Тебе заходит порядок в цифрах и поиск закономерностей. Ты видишь смысл за таблицей и превращаешь хаос в выводы.",
    toLearn: "Google Sheets/Excel (сводные, формулы), базовый SQL, основы дашбордов.",
    firstStep: "Возьми открытый датасет и собери мини-дашборд с 3–4 выводами.",
  },
  nocode: {
    title: "No-code / автоматизатор",
    description:
      "Ты мыслишь процессами и не любишь делать руками то, что можно автоматизировать. Кайфуешь, собирая рабочие связки из сервисов.",
    toLearn: "Make и Airtable, логика вебхуков/API, Telegram-боты без кода.",
    firstStep: "Автоматизируй одну свою рутину (заявки из формы → таблица → уведомление).",
  },
  product: {
    title: "Продакт-менеджер",
    description:
      "Ты сначала думаешь «кому и зачем это нужно» — это продуктовое мышление. Решаешь проблему пользователя, а не просто делаешь фичи.",
    toLearn: "Гипотезы, приоритизация (RICE/ICE), продуктовые метрики.",
    firstStep: "Опиши 3 гипотезы по росту удержания знакомого продукта с метрикой проверки.",
  },
  ops: {
    title: "Проджект / операционный менеджер",
    description:
      "Ты держишь под контролем статусы, сроки и договорённости. Без таких людей команды вязнут.",
    toLearn: "Трекеры (Notion/ClickUp), планирование, базовые процессы (SOP).",
    firstStep: "Опиши свой повторяющийся процесс как чек-лист шагов с ответственными.",
  },
  growth: {
    title: "Маркетолог-аналитик",
    description:
      "Тебя тянет к воронкам, метрикам и экспериментам. Соединяешь «привлечь» и «измерить, что сработало».",
    toLearn: "Метрики воронки (CR, CAC, retention), UTM, веб-аналитика.",
    firstStep: "Разбери воронку любого лендинга и предложи, что тестировать первым.",
  },
  qa: {
    title: "QA / контроль качества",
    description:
      "Тебе важно, чтобы всё работало без ошибок и сходилось. Внимательность к деталям — твоя суперсила.",
    toLearn: "Тест-кейсы, проверка данных и выгрузок, как устроены автоматизации.",
    firstStep: "Для любой формы составь список из 10 проверок «что может сломаться».",
  },
};

export const DIRECTION_EMOJI: Record<Direction, string> = {
  analyst: "📊",
  nocode: "⚙️",
  product: "🚀",
  ops: "🗂️",
  growth: "📈",
  qa: "🔍",
};

export function emptyScores(): Scores {
  return { analyst: 0, nocode: 0, product: 0, ops: 0, growth: 0, qa: 0 };
}

export function pickWinner(scores: Scores): Direction {
  let best: Direction = DIRECTION_PRIORITY[0];
  let bestScore = -Infinity;
  for (const dir of DIRECTION_PRIORITY) {
    const v = scores[dir];
    if (v > bestScore) {
      bestScore = v;
      best = dir;
    }
  }
  return best;
}
