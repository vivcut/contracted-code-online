// currency.js

let _cachedCurrencyCode = null;

/**
 * Detects the user's currency code (e.g., "HKD") based on their location.
 * - First tries IP-based geolocation (ipapi.co).
 * - Falls back to guessing from the browser locale for some common regions.
 * - Defaults to "USD" if all else fails.
 *
 * Usage (React):
 * useEffect(() => {
 *   getUserCurrencyCode().then(code => console.log(code));
 * }, []);
 */
export async function getUserCurrencyCode() {
  if (_cachedCurrencyCode) return _cachedCurrencyCode;

  // 1) Try IP-based lookup (no permission prompt; subject to rate limits)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.currency === 'string' && data.currency.trim()) {
        _cachedCurrencyCode = data.currency.trim().toUpperCase();
        return _cachedCurrencyCode;
      }
    }
  } catch {
    // ignore and fall through
  }

  // 2) Fallback: infer from locale region (best-effort, not perfect)
  try {
    const locale =
      (Array.isArray(navigator.languages) && navigator.languages[0]) ||
      navigator.language ||
      '';

    // Extract region subtags like "HK" from "en-HK" or "zh-Hant-HK"
    const regionMatch = locale.match(/[-_](?<region>[A-Za-z]{2})(?!.*[-_])/);
    const region = regionMatch?.groups?.region?.toUpperCase();

    if (region) {
      const regionToCurrency = {
        US: 'USD', CA: 'CAD', GB: 'GBP', HK: 'HKD', AU: 'AUD',
        JP: 'JPY', CN: 'CNY', IN: 'INR', SG: 'SGD', NZ: 'NZD',
        CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', KR: 'KRW',
        BR: 'BRL', MX: 'MXN', ZA: 'ZAR', AE: 'AED', SA: 'SAR',
        DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
        BE: 'EUR', PT: 'EUR', IE: 'EUR', AT: 'EUR', FI: 'EUR',
        GR: 'EUR'
      };
      if (regionToCurrency[region]) {
        _cachedCurrencyCode = regionToCurrency[region];
        return _cachedCurrencyCode;
      }
    }
  } catch {
    // ignore and fall through
  }

  // 3) Final fallback
  _cachedCurrencyCode = 'USD';
  return _cachedCurrencyCode;
}