export type BreakdownKind = "manga" | "drama";

export interface BreakdownWord {
  hangul: string;
  translation: string;
  grammar?: string;
}

export interface BreakdownLine {
  id: string;
  hangul: string;
  translation: string;
  note?: string;
  words: BreakdownWord[];
  time?: string;
}

export interface BreakdownPage {
  id: string;
  title: string;
  background: string;
  lines: BreakdownLine[];
}

export interface BreakdownEpisode {
  id: string;
  title: string;
  duration: string;
  videoUrl: string | null;
  lines: BreakdownLine[];
}

export interface BreakdownItem {
  id: string;
  kind: BreakdownKind;
  title: string;
  originalTitle: string;
  description: string;
  level: string;
  genres: string[];
  latest: string;
  updatedAt: string;
  cover: { from: string; to: string; ink: string };
  pages?: BreakdownPage[];
  episodes?: BreakdownEpisode[];
}

const line = (
  id: string,
  hangul: string,
  translation: string,
  words: BreakdownWord[],
  note?: string,
  time?: string,
): BreakdownLine => ({ id, hangul, translation, words, note, time });

const springLines = [
  line("spring-1", "오늘은 날씨가 정말 좋네요.", "Сегодня правда хорошая погода.", [
    { hangul: "오늘", translation: "сегодня" },
    { hangul: "날씨", translation: "погода" },
    { hangul: "정말", translation: "правда, очень" },
    { hangul: "좋다", translation: "быть хорошим" },
  ], "Непрошедшее время -네요 выражает мягкое удивление или наблюдение.", "00:04"),
  line("spring-2", "우리 같이 산책할래요?", "Хочешь вместе прогуляемся?", [
    { hangul: "우리", translation: "мы" },
    { hangul: "같이", translation: "вместе" },
    { hangul: "산책하다", translation: "гулять" },
    { hangul: "-(으)ㄹ래요?", translation: "предложение/намерение" },
  ], "-(으)ㄹ래요? — вежливое предложение что-то сделать вместе.", "00:09"),
  line("spring-3", "저도 꽃구경을 하고 싶어요.", "Я тоже хочу посмотреть на цветы.", [
    { hangul: "저", translation: "я (вежливо)" },
    { hangul: "도", translation: "тоже" },
    { hangul: "꽃구경", translation: "любование цветами" },
    { hangul: "고 싶다", translation: "хотеть" },
  ], "-고 싶다 присоединяется к основе глагола и выражает желание.", "00:14"),
  line("spring-4", "그럼 이번 주말에 만나요.", "Тогда встретимся на этих выходных.", [
    { hangul: "그럼", translation: "тогда" },
    { hangul: "이번", translation: "этот" },
    { hangul: "주말", translation: "выходные" },
    { hangul: "만나다", translation: "встречаться" },
  ], "-(으)ㅂ시다/아요 — договорённость о совместном действии.", "00:19"),
];

const nightLines = [
  line("night-1", "이곳에서 무슨 일이 있었던 거죠?", "Что здесь произошло?", [
    { hangul: "이곳", translation: "это место" },
    { hangul: "무슨", translation: "какой, что за" },
    { hangul: "일", translation: "дело, событие" },
    { hangul: "있었던 거죠?", translation: "произошло (уточнение)" },
  ], "-(으)ㄴ 거죠? используется, когда говорящий уточняет известный факт.", "00:12"),
  line("night-2", "아무도 말해 주지 않았어요.", "Мне никто не сказал.", [
    { hangul: "아무도", translation: "никто" },
    { hangul: "말하다", translation: "говорить" },
    { hangul: "주다", translation: "давать (здесь: для меня)" },
    { hangul: "-지 않다", translation: "отрицание" },
  ], "아무도 требует отрицательной формы сказуемого.", "00:18"),
];

const familyLines = [
  line("family-1", "가족들과 함께 살았습니다.", "Жил вместе с семьёй.", [
    { hangul: "가족", translation: "семья" },
    { hangul: "들", translation: "множественное число" },
    { hangul: "함께", translation: "вместе" },
    { hangul: "살다", translation: "жить" },
  ], "-았/었- — прошедшее время; вместе с -습니다 звучит формально.", "00:05"),
  line("family-2", "어머니는 요리를 아주 잘하세요.", "Мама очень хорошо готовит.", [
    { hangul: "어머니", translation: "мама" },
    { hangul: "요리", translation: "готовка, блюдо" },
    { hangul: "아주", translation: "очень" },
    { hangul: "잘하다", translation: "хорошо делать" },
  ], "-(으)시- — вежливый суффикс для старших.", "00:11"),
  line("family-3", "저녁에 다 같이 식탁에 앉아요.", "Вечером все вместе садимся за стол.", [
    { hangul: "저녁", translation: "вечер" },
    { hangul: "다 같이", translation: "все вместе" },
    { hangul: "식탁", translation: "обеденный стол" },
    { hangul: "앉다", translation: "садиться" },
  ], "-아/어요 — вежливо-разговорная форма.", "00:17"),
];

const dramaLines = [
  line("drama-1", "왜 나한테 그런 말을 했어요?", "Почему ты сказал мне такое?", [
    { hangul: "왜", translation: "почему" },
    { hangul: "나", translation: "я" },
    { hangul: "한테", translation: "кому (разговорная форма)" },
    { hangul: "그런 말", translation: "такие слова" },
  ], "-한테 — разговорный вариант дательного падежа для людей.", "00:08"),
  line("drama-2", "미안해요. 제가 오해했어요.", "Прости. Я неправильно понял.", [
    { hangul: "미안하다", translation: "извиняться" },
    { hangul: "제가", translation: "я (вежливо, подлежащее)" },
    { hangul: "오해하다", translation: "неправильно понять" },
  ], "제가 — вежливая форма 이/가 для «я».", "00:13"),
  line("drama-3", "이제 다시 이야기해 볼까요?", "Может, снова поговорим?", [
    { hangul: "이제", translation: "теперь" },
    { hangul: "다시", translation: "снова" },
    { hangul: "이야기하다", translation: "разговаривать" },
    { hangul: "-(으)ㄹ까요?", translation: "предложение" },
  ], "-(으)ㄹ까요? — мягкое предложение или предположение.", "00:21"),
];

const secretLines = [
  line("secret-1", "진실은 반드시 밝혀질 겁니다.", "Правда обязательно раскроется.", [
    { hangul: "진실", translation: "правда" },
    { hangul: "반드시", translation: "обязательно" },
    { hangul: "밝혀지다", translation: "раскрываться" },
    { hangul: "-(으)ㄹ 겁니다", translation: "будущее/уверенность" },
  ], "-ㄹ/을 겁니다 — формальная уверенность в будущем.", "00:15"),
  line("secret-2", "저를 믿어 주시겠습니까?", "Вы можете мне доверять?", [
    { hangul: "저", translation: "я (вежливо)" },
    { hangul: "믿다", translation: "верить" },
    { hangul: "-아/어 주다", translation: "сделать для кого-то" },
    { hangul: "-시겠습니까?", translation: "вежливый вопрос" },
  ], "-아/어 주시겠습니까? — очень вежливая просьба.", "00:23"),
];

const tasteLines = [
  line("taste-1", "한국의 김치는 매운 편이에요.", "Корейская кимчи скорее острая.", [
    { hangul: "한국", translation: "Корея" },
    { hangul: "김치", translation: "кимчи" },
    { hangul: "맵다", translation: "быть острым" },
    { hangul: "-은/는 편이다", translation: "скорее, довольно" },
  ], "-은/는 편이다 смягчает характеристику: «скорее …».", "00:06"),
  line("taste-2", "처음 먹는 사람도 좋아할 거예요.", "Даже тот, кто ест впервые, полюбит.", [
    { hangul: "처음", translation: "впервые" },
    { hangul: "먹다", translation: "есть" },
    { hangul: "사람", translation: "человек" },
    { hangul: "좋아하다", translation: "любить" },
  ], "-(으)ㄹ 거예요 — будущее или предположение.", "00:12"),
];

const sampleVideo =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const BREAKDOWNS: BreakdownItem[] = [
  {
    id: "spring-day",
    kind: "manga",
    title: "Весенний день",
    originalTitle: "봄날의 우리",
    description: "Тихая история о двух людях, которые учатся говорить о своих чувствах.",
    level: "A2",
    genres: ["Романтика", "Повседневность"],
    latest: "Глава 8",
    updatedAt: "2 часа назад",
    cover: { from: "#f7c6d9", to: "#c5b8ff", ink: "#3a2b55" },
    pages: [
      { id: "p1", title: "Кадр 1", background: "linear-gradient(135deg,#fde7ef,#cdd9ff)", lines: springLines.slice(0, 2) },
      { id: "p2", title: "Кадр 2", background: "linear-gradient(135deg,#e7f6e9,#fce8c8)", lines: springLines.slice(2) },
    ],
  },
  {
    id: "city-night",
    kind: "manga",
    title: "Ночь города",
    originalTitle: "도시의 밤",
    description: "Детективная история: один вопрос меняет всё, что казалось известным.",
    level: "B1",
    genres: ["Триллер", "Детектив"],
    latest: "Глава 14",
    updatedAt: "5 часов назад",
    cover: { from: "#17213b", to: "#3b2b62", ink: "#f6e7a8" },
    pages: [
      { id: "p1", title: "Кадр 1", background: "linear-gradient(135deg,#17213b,#39466b)", lines: nightLines },
      { id: "p2", title: "Кадр 2", background: "linear-gradient(135deg,#241c34,#6b3d52)", lines: springLines.slice(0, 1) },
    ],
  },
  {
    id: "family-table",
    kind: "manga",
    title: "Семейный стол",
    originalTitle: "가족의 식탁",
    description: "Тёплые бытовые сцены и лексика о доме, еде и семье.",
    level: "A2",
    genres: ["Повседневность", "Семья"],
    latest: "Глава 5",
    updatedAt: "вчера",
    cover: { from: "#f7d7a6", to: "#e9a58c", ink: "#4a2c22" },
    pages: [
      { id: "p1", title: "Кадр 1", background: "linear-gradient(135deg,#fff1d9,#f5c7ab)", lines: familyLines },
      { id: "p2", title: "Кадр 2", background: "linear-gradient(135deg,#e6f4e8,#f7e4c8)", lines: springLines.slice(1, 3) },
    ],
  },
  {
    id: "seoul-lovers",
    kind: "drama",
    title: "Сеульские влюблённые",
    originalTitle: "서울의 연인",
    description: "Короткие диалоги о встречах, ссорах и примирениях.",
    level: "A2",
    genres: ["Романтика", "Мелодрама"],
    latest: "Серия 3",
    updatedAt: "сегодня",
    cover: { from: "#2f2145", to: "#c45b7a", ink: "#ffe8f0" },
    episodes: [
      { id: "e1", title: "Серия 1", duration: "00:42", videoUrl: sampleVideo, lines: dramaLines },
      { id: "e2", title: "Серия 2", duration: "00:38", videoUrl: sampleVideo, lines: dramaLines.slice(1).concat(springLines.slice(0, 1)) },
    ],
  },
  {
    id: "secret-forest",
    kind: "drama",
    title: "Лес секретов",
    originalTitle: "비밀의 숲",
    description: "Формальные диалоги, вопросы и лексика расследований.",
    level: "B1",
    genres: ["Детектив", "Драма"],
    latest: "Серия 6",
    updatedAt: "вчера",
    cover: { from: "#152e2b", to: "#4d6b55", ink: "#e9f5d8" },
    episodes: [
      { id: "e1", title: "Серия 1", duration: "00:51", videoUrl: sampleVideo, lines: secretLines },
      { id: "e2", title: "Серия 2", duration: "00:47", videoUrl: sampleVideo, lines: secretLines.slice(1).concat(dramaLines.slice(0, 1)) },
    ],
  },
  {
    id: "taste-korea",
    kind: "drama",
    title: "Вкус Кореи",
    originalTitle: "한국의 맛",
    description: "Мини-документалка о еде: простая лексика для первых разборов.",
    level: "A1",
    genres: ["Еда", "Документальное"],
    latest: "Серия 1",
    updatedAt: "3 дня назад",
    cover: { from: "#45251f", to: "#c47a49", ink: "#ffe2b7" },
    episodes: [
      { id: "e1", title: "Серия 1", duration: "00:30", videoUrl: sampleVideo, lines: tasteLines },
    ],
  },
];

export function findBreakdown(id: string | undefined): BreakdownItem | null {
  return BREAKDOWNS.find((item) => item.id === id) ?? null;
}
