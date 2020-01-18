declare module "color" {
  type RGBObject = {
    r: number;
    g: number;
    b: number;
  };

  type HSLObject = {
    h: number;
    s: number;
    l: number;
  };

  type HSVObject = {
    h: number;
    s: number;
    v: number;
  };

  type HWBObject = {
    h: number;
    w: number;
    b: number;
  };

  type CMYKObject = {
    c: number;
    m: number;
    y: number;
    k: number;
  };

  class Color {
    constructor(value?: RGBObject | string);

    static(value?: RGBObject | string): Color;

    rgb(r: number, g: number, b: number): Color;
    rgb(rgb: Array<number>): Color;
    rgb(): RGBObject;
    rgbArray(): Array<number>;

    hsl(h: number, s: number, l: number): Color;
    hsl(hsl: HSLObject): Color;
    hsl(): HSLObject;
    hslArray(): Array<number>;

    hsvArray(): Array<number>;
    hsv(h: number, s: number, v: number): Color;
    hsv(hsv: HSVObject): Color;
    hsv(): HSVObject;

    hwb(h: number, w: number, b: number): Color;
    hwb(hwb: HWBObject): Color;
    hwb(): HWBObject;
    hwbArray(): Array<number>;

    cmyk(c: number, m: number, y: number, k: number): Color;
    cmyk(cmyk: CMYKObject): Color;
    cmyk(): CMYKObject;
    cmykArray(): Array<number>;

    alpha(alpha: number): Color;
    alpha(): number;

    red(red: number): Color;
    red(): number;

    green(green: number): Color;
    green(): number;

    blue(blue: number): Color;
    blue(): number;

    hue(hue: number): Color;
    hue(): number;

    saturation(saturation: number): Color;
    saturation(): number;

    saturationv(saturationv: number): Color;
    saturationv(): number;

    lightness(lightness: number): Color;
    lightness(): number;

    whiteness(whiteness: number): Color;
    whiteness(): number;

    blackness(blackness: number): Color;
    blackness(): number;

    cyan(cyan: number): Color;
    cyan(): number;

    magenta(magenta: number): Color;
    magenta(): number;

    yellow(yellow: number): Color;
    yellow(): number;

    black(black: number): Color;
    black(): number;

    clearer(value: number): Color;
    clone(): Color;
    contrast(color: Color): number;
    dark(): boolean;
    darken(value: number): Color;
    desaturate(value: number): Color;
    fade(value: number): Color;
    grayscale(): Color;
    hexString(): string;
    hslString(): string;
    hwbString(): string;
    keyword(): string | undefined;
    light(): boolean;
    lighten(value: number): Color;
    luminosity(): number;
    mix(color: Color, value?: number): Color;
    negate(): Color;
    opaquer(value: number): Color;
    percentString(): string;
    rgbString(): string;
    rotate(value: number): Color;
    saturate(value: number): Color;
  }

  export = Color;
}
