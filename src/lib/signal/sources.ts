// Tomorrow Signal - Global News Sources Database

export interface NewsSource {
  name: string;
  country: string;
  region: string; // 10-region classification
  language: string;
  rssUrl?: string; // RSS feed URL if available
  googleNewsQuery: string; // Google News search query
}

// 10 Global Regions
export const GLOBAL_REGIONS = [
  { id: 'north_america', labelKo: '북미', labelEn: 'North America', emoji: '🇺🇸' },
  { id: 'europe_west', labelKo: '서유럽', labelEn: 'Western Europe', emoji: '🇪🇺' },
  { id: 'europe_east', labelKo: '동유럽/러시아', labelEn: 'Eastern Europe & Russia', emoji: '🇷🇺' },
  { id: 'east_asia', labelKo: '동아시아', labelEn: 'East Asia', emoji: '🌏' },
  { id: 'south_asia', labelKo: '남아시아', labelEn: 'South Asia', emoji: '🇮🇳' },
  { id: 'southeast_asia', labelKo: '동남아시아', labelEn: 'Southeast Asia', emoji: '🌴' },
  { id: 'middle_east', labelKo: '중동', labelEn: 'Middle East', emoji: '🌙' },
  { id: 'latin_america', labelKo: '중남미', labelEn: 'Latin America', emoji: '🌎' },
  { id: 'africa', labelKo: '아프리카', labelEn: 'Africa', emoji: '🌍' },
  { id: 'oceania_ca', labelKo: '오세아니아/캐나다', labelEn: 'Oceania & Canada', emoji: '🦘' },
] as const;

export type GlobalRegion = typeof GLOBAL_REGIONS[number]['id'];

// Full source list - 90+ global business/economy newspapers
export const NEWS_SOURCES: NewsSource[] = [
  // === 북미 (North America) ===
  { name: 'The Wall Street Journal (WSJ)', country: '미국', region: 'north_america', language: 'en', googleNewsQuery: 'site:wsj.com business economy' },
  { name: 'Bloomberg', country: '미국', region: 'north_america', language: 'en', googleNewsQuery: 'site:bloomberg.com economy markets' },
  { name: 'The New York Times – Business', country: '미국', region: 'north_america', language: 'en', googleNewsQuery: 'site:nytimes.com/section/business' },
  { name: 'The Washington Post – Business', country: '미국', region: 'north_america', language: 'en', googleNewsQuery: 'site:washingtonpost.com business economy' },
  { name: 'Forbes', country: '미국', region: 'north_america', language: 'en', googleNewsQuery: 'site:forbes.com business economy' },
  { name: "Barron's", country: '미국', region: 'north_america', language: 'en', googleNewsQuery: "site:barrons.com markets economy" },
  { name: "Investor's Business Daily (IBD)", country: '미국', region: 'north_america', language: 'en', googleNewsQuery: 'site:investors.com economy markets' },
  { name: 'Reuters', country: '영국/글로벌', region: 'north_america', language: 'en', googleNewsQuery: 'site:reuters.com business economy' },

  // === 서유럽 (Western Europe) ===
  { name: 'Financial Times (FT)', country: '영국', region: 'europe_west', language: 'en', googleNewsQuery: 'site:ft.com economy business' },
  { name: 'The Economist', country: '영국', region: 'europe_west', language: 'en', googleNewsQuery: 'site:economist.com finance business' },
  { name: 'The Guardian – Business', country: '영국', region: 'europe_west', language: 'en', googleNewsQuery: 'site:theguardian.com/business' },
  { name: 'Handelsblatt', country: '독일', region: 'europe_west', language: 'de', googleNewsQuery: 'site:handelsblatt.com wirtschaft' },
  { name: 'FAZ – Wirtschaft', country: '독일', region: 'europe_west', language: 'de', googleNewsQuery: 'site:faz.net wirtschaft' },
  { name: 'Börsen-Zeitung', country: '독일', region: 'europe_west', language: 'de', googleNewsQuery: 'site:boersen-zeitung.de' },
  { name: 'Les Échos', country: '프랑스', region: 'europe_west', language: 'fr', googleNewsQuery: 'site:lesechos.fr economie' },
  { name: 'La Tribune', country: '프랑스', region: 'europe_west', language: 'fr', googleNewsQuery: 'site:latribune.fr economie' },
  { name: 'Il Sole 24 Ore', country: '이탈리아', region: 'europe_west', language: 'it', googleNewsQuery: 'site:ilsole24ore.com economia' },
  { name: 'Corriere della Sera – Economia', country: '이탈리아', region: 'europe_west', language: 'it', googleNewsQuery: 'site:corriere.it economia' },
  { name: 'Cinco Días', country: '스페인', region: 'europe_west', language: 'es', googleNewsQuery: 'site:cincodias.elpais.com economia' },
  { name: 'Expansión', country: '스페인', region: 'europe_west', language: 'es', googleNewsQuery: 'site:expansion.com economia' },
  { name: 'El País – Economía', country: '스페인', region: 'europe_west', language: 'es', googleNewsQuery: 'site:elpais.com economia' },
  { name: 'Het Financieele Dagblad', country: '네덜란드', region: 'europe_west', language: 'nl', googleNewsQuery: 'site:fd.nl economie' },
  { name: 'Dagens Industri', country: '스웨덴', region: 'europe_west', language: 'sv', googleNewsQuery: 'site:di.se ekonomi' },

  // === 동유럽/러시아 (Eastern Europe & Russia) ===
  { name: 'Kommersant', country: '러시아', region: 'europe_east', language: 'ru', googleNewsQuery: 'site:kommersant.ru economy business' },
  { name: 'Vedomosti', country: '러시아', region: 'europe_east', language: 'ru', googleNewsQuery: 'site:vedomosti.ru economy' },
  { name: 'The Moscow Times – Business', country: '러시아', region: 'europe_east', language: 'en', googleNewsQuery: 'site:themoscowtimes.com business' },
  { name: 'The Times of Central Asia', country: '중앙아시아', region: 'europe_east', language: 'en', googleNewsQuery: 'site:timesca.com economy business' },

  // === 동아시아 (East Asia) ===
  { name: 'Nikkei / Nikkei Asia', country: '일본', region: 'east_asia', language: 'ja', googleNewsQuery: 'site:nikkei.com economy business' },
  { name: 'Asahi Shimbun – Economy', country: '일본', region: 'east_asia', language: 'ja', googleNewsQuery: 'site:asahi.com economy business' },
  { name: 'Yomiuri Shimbun – Economy', country: '일본', region: 'east_asia', language: 'ja', googleNewsQuery: 'site:yomiuri.co.jp economy' },
  { name: 'Sankei Biz', country: '일본', region: 'east_asia', language: 'ja', googleNewsQuery: 'site:sankeibiz.jp economy' },
  { name: 'Caixin Global', country: '중국', region: 'east_asia', language: 'en', googleNewsQuery: 'site:caixinglobal.com economy business' },
  { name: '21st Century Business Herald', country: '중국', region: 'east_asia', language: 'zh', googleNewsQuery: 'site:21jingji.com economy' },
  { name: 'China Daily', country: '중국', region: 'east_asia', language: 'en', googleNewsQuery: 'site:chinadaily.com.cn business economy' },
  { name: 'Securities Times (证券时报)', country: '중국', region: 'east_asia', language: 'zh', googleNewsQuery: 'site:stcn.com economy stock' },
  { name: 'Shanghai Securities News', country: '중국', region: 'east_asia', language: 'zh', googleNewsQuery: 'site:cnstock.com economy' },
  { name: 'Reference News (参考消息)', country: '중국', region: 'east_asia', language: 'zh', googleNewsQuery: 'site:cankaoxiaoxi.com economy' },
  { name: 'Renmin Daily (人民日报)', country: '중국', region: 'east_asia', language: 'zh', googleNewsQuery: 'site:people.com.cn economy finance' },
  { name: 'South China Morning Post (SCMP)', country: '홍콩', region: 'east_asia', language: 'en', googleNewsQuery: 'site:scmp.com business economy' },
  { name: 'Maeil Business Newspaper (매일경제)', country: '한국', region: 'east_asia', language: 'ko', googleNewsQuery: 'site:mk.co.kr economy business' },
  { name: 'The Korea Economic Daily (한국경제)', country: '한국', region: 'east_asia', language: 'ko', googleNewsQuery: 'site:hankyung.com economy' },
  { name: 'Chosun Biz (조선비즈)', country: '한국', region: 'east_asia', language: 'ko', googleNewsQuery: 'site:biz.chosun.com economy' },
  { name: 'JoongAng Ilbo – Economy', country: '한국', region: 'east_asia', language: 'ko', googleNewsQuery: 'site:joongang.co.kr economy business' },
  { name: 'DongA Business Review (DBR)', country: '한국', region: 'east_asia', language: 'ko', googleNewsQuery: 'site:donga.com business economy' },
  { name: 'KED Global', country: '한국', region: 'east_asia', language: 'en', googleNewsQuery: 'site:kedglobal.com economy business' },
  { name: 'Yonhap', country: '한국', region: 'east_asia', language: 'ko', googleNewsQuery: 'site:yna.co.kr economy business' },

  // === 남아시아 (South Asia) ===
  { name: 'The Economic Times', country: '인도', region: 'south_asia', language: 'en', googleNewsQuery: 'site:economictimes.indiatimes.com markets economy' },
  { name: 'Business Standard', country: '인도', region: 'south_asia', language: 'en', googleNewsQuery: 'site:business-standard.com economy markets' },
  { name: 'Mint (Livemint)', country: '인도', region: 'south_asia', language: 'en', googleNewsQuery: 'site:livemint.com economy markets' },
  { name: 'Financial Express', country: '인도', region: 'south_asia', language: 'en', googleNewsQuery: 'site:financialexpress.com economy' },
  { name: 'The Hindu Business Line', country: '인도', region: 'south_asia', language: 'en', googleNewsQuery: 'site:thehindubusinessline.com economy' },
  { name: 'Dawn – Business', country: '파키스탄', region: 'south_asia', language: 'en', googleNewsQuery: 'site:dawn.com business economy' },

  // === 동남아시아 (Southeast Asia) ===
  { name: 'The Straits Times – Business', country: '싱가포르', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:straitstimes.com business economy' },
  { name: 'Business Times', country: '싱가포르', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:businesstimes.com.sg economy' },
  { name: 'Channel NewsAsia', country: '싱가포르', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:channelnewsasia.com business economy' },
  { name: 'Bangkok Post – Business', country: '태국', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:bangkokpost.com business' },
  { name: 'Jakarta Post – Business', country: '인도네시아', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:thejakartapost.com business economy' },
  { name: 'Kompas – Bisnis', country: '인도네시아', region: 'southeast_asia', language: 'id', googleNewsQuery: 'site:kompas.com bisnis ekonomi' },
  { name: 'The Edge Malaysia', country: '말레이시아', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:theedgemarkets.com economy' },
  { name: 'BusinessWorld', country: '필리핀', region: 'southeast_asia', language: 'en', googleNewsQuery: 'site:bworldonline.com economy' },

  // === 중동 (Middle East) ===
  { name: 'Gulf News – Business', country: 'UAE', region: 'middle_east', language: 'en', googleNewsQuery: 'site:gulfnews.com business economy' },
  { name: 'Arabian Business', country: 'UAE', region: 'middle_east', language: 'en', googleNewsQuery: 'site:arabianbusiness.com economy' },
  { name: 'The National', country: 'UAE', region: 'middle_east', language: 'en', googleNewsQuery: 'site:thenationalnews.com business economy' },
  { name: 'Arab News – Business', country: '사우디아라비아', region: 'middle_east', language: 'en', googleNewsQuery: 'site:arabnews.com business economy' },
  { name: 'Asharq Al-Awsat – Business', country: '사우디/범아랍', region: 'middle_east', language: 'en', googleNewsQuery: 'site:aawsat.com economy business' },
  { name: 'Al-Ahram (English) – Business', country: '이집트', region: 'middle_east', language: 'en', googleNewsQuery: 'site:english.ahram.org.eg business economy' },
  { name: 'The Jerusalem Post – Business', country: '이스라엘', region: 'middle_east', language: 'en', googleNewsQuery: 'site:jpost.com business' },
  { name: 'Calcalist', country: '이스라엘', region: 'middle_east', language: 'en', googleNewsQuery: 'site:calcalistech.com economy business' },
  { name: 'Globes', country: '이스라엘', region: 'middle_east', language: 'en', googleNewsQuery: 'site:en.globes.co.il economy' },

  // === 중남미 (Latin America) ===
  { name: 'Folha de S.Paulo', country: '브라질', region: 'latin_america', language: 'pt', googleNewsQuery: 'site:folha.uol.com.br economia mercado' },
  { name: 'O Globo – Economia', country: '브라질', region: 'latin_america', language: 'pt', googleNewsQuery: 'site:oglobo.globo.com economia' },
  { name: 'Valor Econômico', country: '브라질', region: 'latin_america', language: 'pt', googleNewsQuery: 'site:valor.globo.com economia' },
  { name: 'El Economista', country: '멕시코', region: 'latin_america', language: 'es', googleNewsQuery: 'site:eleconomista.com.mx economia' },
  { name: 'El Financiero', country: '멕시코', region: 'latin_america', language: 'es', googleNewsQuery: 'site:elfinanciero.com.mx economia' },
  { name: 'El Tiempo', country: '콜롬비아', region: 'latin_america', language: 'es', googleNewsQuery: 'site:eltiempo.com economia' },
  { name: 'Infobae – Economía', country: '아르헨티나', region: 'latin_america', language: 'es', googleNewsQuery: 'site:infobae.com economia' },

  // === 아프리카 (Africa) ===
  { name: 'Business Day', country: '남아공', region: 'africa', language: 'en', googleNewsQuery: 'site:businesslive.co.za economy' },
  { name: 'News24 Fin24', country: '남아공', region: 'africa', language: 'en', googleNewsQuery: 'site:news24.com/fin24 economy business' },
  { name: 'Business Daily Africa', country: '케냐', region: 'africa', language: 'en', googleNewsQuery: 'site:businessdailyafrica.com economy' },
  { name: 'Daily Nation – Business', country: '케냐', region: 'africa', language: 'en', googleNewsQuery: 'site:nation.africa business economy' },

  // === 오세아니아/캐나다 (Oceania & Canada) ===
  { name: 'Australian Financial Review (AFR)', country: '호주', region: 'oceania_ca', language: 'en', googleNewsQuery: 'site:afr.com economy markets' },
  { name: 'The Globe and Mail – Business', country: '캐나다', region: 'oceania_ca', language: 'en', googleNewsQuery: 'site:theglobeandmail.com business' },
  { name: 'Financial Post', country: '캐나다', region: 'oceania_ca', language: 'en', googleNewsQuery: 'site:financialpost.com economy' },
];

// Get sources by region
export function getSourcesByRegion(region: GlobalRegion): NewsSource[] {
  return NEWS_SOURCES.filter((s) => s.region === region);
}
