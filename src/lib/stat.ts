export interface StatNumber {
  value: number;
  decimals: number;
  /** Source used thousands separators, e.g. "1,200". */
  grouped: boolean;
}

export interface ParsedStat {
  prefix: string;
  numbers: [StatNumber] | [StatNumber, StatNumber];
  /** Text between the two numbers of a range, e.g. "–". */
  separator: string;
  suffix: string;
}

const NUMBER = String.raw`(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?`;
const SINGLE = new RegExp(String.raw`^(\D*?)${NUMBER}(\D*)$`);
const RANGE = new RegExp(String.raw`^(\D*?)${NUMBER}(\s*[–—-]\s*)${NUMBER}(\D*)$`);

const toNumber = (int: string, fraction: string | undefined): StatNumber => ({
  value: Number(`${int.replace(/,/g, '')}${fraction ? `.${fraction}` : ''}`),
  decimals: fraction?.length ?? 0,
  grouped: int.includes(','),
});

/**
 * Splits a stat like "99.4%+" into prefix, number(s) and suffix so only the number animates.
 * Supports ranges like "86–96%". Returns null when the value has no single number or range.
 */
export function parseStatValue(raw: string): ParsedStat | null {
  const value = raw.trim();

  const range = RANGE.exec(value);
  if (range) {
    const [, prefix, int1, frac1, separator, int2, frac2, suffix] = range;
    return {
      prefix,
      numbers: [toNumber(int1, frac1), toNumber(int2, frac2)],
      separator,
      suffix,
    };
  }

  const single = SINGLE.exec(value);
  if (single) {
    const [, prefix, int, frac, suffix] = single;
    return { prefix, numbers: [toNumber(int, frac)], separator: '', suffix };
  }

  return null;
}

export function formatStatNumber({ decimals, grouped }: StatNumber, current: number) {
  return grouped
    ? current.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : current.toFixed(decimals);
}
