
const fs = require('fs');
const path = require('path');

const locales = ['en', 'ko', 'ja', 'zh', 'hi'];
const messagesDir = path.join(process.cwd(), 'messages');

const en = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if(Array.isArray(obj[el])) return res;
    if(typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

const enKeys = getKeys(en);

console.log(`Base keys (en): ${enKeys.length}`);

let hasError = false;

locales.forEach(locale => {
  if (locale === 'en') return;
  try {
    const target = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf8'));
    const targetKeys = getKeys(target);
    
    const missing = enKeys.filter(k => !targetKeys.includes(k));
    
    if (missing.length > 0) {
      console.error(`[${locale}] Missing keys (${missing.length}):`, missing.slice(0, 5), missing.length > 5 ? '...' : '');
      hasError = true;
    } else {
      console.log(`[${locale}] OK - ${targetKeys.length} keys matched.`);
    }
  } catch (e) {
    console.error(`[${locale}] Failed to parse or read file:`, e.message);
    hasError = true;
  }
});

if (hasError) process.exit(1);
