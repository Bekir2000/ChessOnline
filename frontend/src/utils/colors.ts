type ColorFamily = 'gray' | 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo';
type ShadeNumber = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TailwindColorKey = `${ColorFamily}-${ShadeNumber}`;

// Base HSL values for each color family
const baseColors: Record<ColorFamily, { h: number; s: number; l: number }> = {
  gray: { h: 220, s: 9, l: 46 },
  red: { h: 0, s: 84, l: 60 },
  blue: { h: 217, s: 91, l: 60 },
  green: { h: 142, s: 76, l: 36 },
  yellow: { h: 48, s: 96, l: 53 },
  purple: { h: 271, s: 91, l: 65 },
  pink: { h: 330, s: 81, l: 60 },
  indigo: { h: 231, s: 91, l: 63 }
};

// Shade configurations for generating variations
const shadeConfigs: Record<ShadeNumber, { s: number; l: number }> = {
  '50': { s: -40, l: 97 },
  '100': { s: -30, l: 92 },
  '200': { s: -20, l: 87 },
  '300': { s: -10, l: 82 },
  '400': { s: 0, l: 77 },
  '500': { s: 0, l: 60 },
  '600': { s: 5, l: 45 },
  '700': { s: 10, l: 35 },
  '800': { s: 15, l: 25 },
  '900': { s: 20, l: 17 }
};

/**
 * Adjusts HSL values within valid ranges
 */
function normalizeHSL(h: number, s: number, l: number): string {
  h = h % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Converts HSL color to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Generates a color variation based on the base color and shade configuration
 */
function generateColor(family: ColorFamily, shade: ShadeNumber): string {
  const base = baseColors[family];
  const config = shadeConfigs[shade];
  
  const h = base.h;
  const s = base.s + config.s;
  const l = config.l;
  
  return hslToHex(h, s, l);
}

/**
 * Gets the color value for a Tailwind-style color key
 */
export function getTailwindColor(colorClass: TailwindColorKey): string {
  const [family, shade] = colorClass.split('-') as [ColorFamily, ShadeNumber];
  return generateColor(family, shade);
}

/**
 * Gets all available color variations for a specific color family
 */
export function getColorFamily(colorFamily: ColorFamily): Record<ShadeNumber, string> {
  const result: Partial<Record<ShadeNumber, string>> = {};
  Object.keys(shadeConfigs).forEach(shade => {
    result[shade as ShadeNumber] = generateColor(colorFamily, shade as ShadeNumber);
  });
  return result as Record<ShadeNumber, string>;
}

/**
 * Gets all available color families
 */
export function getColorFamilies(): ColorFamily[] {
  return Object.keys(baseColors) as ColorFamily[];
}