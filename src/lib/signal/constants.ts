// Tomorrow Signal - Categories & Regions

export const SIGNAL_CATEGORIES = [
  { id: 'global_economy', labelKo: '글로벌 경제', labelEn: 'Global Economy', emoji: '💹', folder: 'news' },
  { id: 'tech_ai', labelKo: '테크/AI', labelEn: 'Tech & AI', emoji: '🤖', folder: 'news' },
  { id: 'geopolitics', labelKo: '지정학', labelEn: 'Geopolitics', emoji: '🌍', folder: 'news' },
  { id: 'energy', labelKo: '에너지/자원', labelEn: 'Energy & Resources', emoji: '⚡', folder: 'news' },
  { id: 'industry', labelKo: '산업/비즈니스', labelEn: 'Industry & Business', emoji: '🏢', folder: 'news' },
  { id: 'health_bio', labelKo: '건강/바이오', labelEn: 'Health & Bio', emoji: '🧬', folder: 'news' },
  { id: 'real_estate', labelKo: '부동산/인프라', labelEn: 'Real Estate & Infra', emoji: '🏗️', folder: 'news' },
  { id: 'life_trends', labelKo: '라이프/트렌드', labelEn: 'Life & Trends', emoji: '📊', folder: 'news' },
  // 주식시장 리포트 폴더
  { id: 'stock_index', labelKo: '주요 지수', labelEn: 'Major Indices', emoji: '📈', folder: 'stock' },
  { id: 'stock_sector', labelKo: '섹터/업종', labelEn: 'Sectors', emoji: '🏭', folder: 'stock' },
  { id: 'stock_earnings', labelKo: '실적/공시', labelEn: 'Earnings & Filings', emoji: '📋', folder: 'stock' },
  { id: 'stock_ipo', labelKo: 'IPO/상장', labelEn: 'IPO & Listings', emoji: '🔔', folder: 'stock' },
  { id: 'stock_forex', labelKo: '환율/원자재', labelEn: 'Forex & Commodities', emoji: '💱', folder: 'stock' },
  { id: 'stock_crypto', labelKo: '암호화폐', labelEn: 'Crypto', emoji: '₿', folder: 'stock' },
] as const;

export const SIGNAL_FOLDERS = [
  { id: 'news', labelKo: '뉴스 시그널', labelEn: 'News Signal', emoji: '🔮' },
  { id: 'stock', labelKo: '주식시장 리포트', labelEn: 'Stock Market Report', emoji: '📊' },
] as const;

export type SignalCategory = typeof SIGNAL_CATEGORIES[number]['id'];

export const SIGNAL_REGIONS = [
  { code: 'KR', labelKo: '한국', labelEn: 'Korea', flag: '🇰🇷', googleNewsHL: 'ko', googleNewsGL: 'KR' },
  { code: 'US', labelKo: '미국', labelEn: 'USA', flag: '🇺🇸', googleNewsHL: 'en', googleNewsGL: 'US' },
  { code: 'CN', labelKo: '중국', labelEn: 'China', flag: '🇨🇳', googleNewsHL: 'zh-CN', googleNewsGL: 'CN' },
  { code: 'JP', labelKo: '일본', labelEn: 'Japan', flag: '🇯🇵', googleNewsHL: 'ja', googleNewsGL: 'JP' },
  { code: 'GB', labelKo: '영국', labelEn: 'UK', flag: '🇬🇧', googleNewsHL: 'en', googleNewsGL: 'GB' },
  { code: 'ME', labelKo: '중동', labelEn: 'Middle East', flag: '🌙', googleNewsHL: 'en', googleNewsGL: 'AE' },
] as const;

export type SignalRegion = typeof SIGNAL_REGIONS[number]['code'];

// Google News RSS search keywords per category per region language
export const SEARCH_KEYWORDS: Record<string, Record<string, string>> = {
  global_economy: {
    ko: '글로벌 경제 환율 금리',
    en: 'global economy interest rate market',
    'zh-CN': '全球经济 利率 汇率',
    ja: 'グローバル経済 金利 為替',
  },
  tech_ai: {
    ko: 'AI 인공지능 반도체 기술',
    en: 'AI artificial intelligence semiconductor tech',
    'zh-CN': 'AI 人工智能 半导体 技术',
    ja: 'AI 人工知能 半導体 テクノロジー',
  },
  geopolitics: {
    ko: '국제정치 외교 안보',
    en: 'geopolitics diplomacy international relations',
    'zh-CN': '地缘政治 外交 国际关系',
    ja: '地政学 外交 国際関係',
  },
  energy: {
    ko: '에너지 원유 신재생에너지',
    en: 'energy oil renewable resources',
    'zh-CN': '能源 石油 可再生能源',
    ja: 'エネルギー 石油 再生可能エネルギー',
  },
  industry: {
    ko: '산업 기업 비즈니스 M&A',
    en: 'industry business M&A startup',
    'zh-CN': '产业 企业 商业 并购',
    ja: '産業 ビジネス M&A スタートアップ',
  },
  health_bio: {
    ko: '건강 바이오 의료 제약',
    en: 'health biotech medical pharmaceutical',
    'zh-CN': '健康 生物科技 医疗 制药',
    ja: '健康 バイオ 医療 製薬',
  },
  real_estate: {
    ko: '부동산 인프라 건설',
    en: 'real estate infrastructure construction',
    'zh-CN': '房地产 基础设施 建设',
    ja: '不動産 インフラ 建設',
  },
  life_trends: {
    ko: '트렌드 소비 문화 사회',
    en: 'trends consumer culture society',
    'zh-CN': '趋势 消费 文化 社会',
    ja: 'トレンド 消費 文化 社会',
  },
  // 주식시장 리포트 카테고리
  stock_index: {
    ko: '코스피 코스닥 나스닥 다우존스 증시',
    en: 'stock market S&P 500 Nasdaq Dow Jones index',
    'zh-CN': '股市 上证指数 深证 纳斯达克 道琼斯',
    ja: '株式市場 日経平均 TOPIX ナスダック ダウ',
  },
  stock_sector: {
    ko: '반도체 섹터 업종 테마주 주도주',
    en: 'stock sector semiconductor tech rotation leading',
    'zh-CN': '板块 半导体 科技股 行业轮动',
    ja: 'セクター 半導体 テーマ株 業種別',
  },
  stock_earnings: {
    ko: '실적 어닝 공시 분기 매출',
    en: 'earnings report quarterly revenue guidance',
    'zh-CN': '财报 季报 营收 业绩 公告',
    ja: '決算 四半期 売上 業績 開示',
  },
  stock_ipo: {
    ko: 'IPO 상장 공모주 기업공개',
    en: 'IPO listing public offering stock debut',
    'zh-CN': 'IPO 上市 新股 公开发行',
    ja: 'IPO 上場 新規公開 公募',
  },
  stock_forex: {
    ko: '환율 달러 원자재 금 유가',
    en: 'forex dollar gold oil commodity exchange rate',
    'zh-CN': '汇率 美元 黄金 原油 大宗商品',
    ja: '為替 ドル ゴールド 原油 コモディティ',
  },
  stock_crypto: {
    ko: '비트코인 이더리움 암호화폐 코인',
    en: 'bitcoin ethereum crypto cryptocurrency',
    'zh-CN': '比特币 以太坊 加密货币',
    ja: 'ビットコイン イーサリアム 仮想通貨 暗号資産',
  },
};
