import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, "../..");

const fontDir = path.join(root, "src", "fonts");

export const fonts = [
  {
    name: "Archivo",
    data: fs.readFileSync(path.join(fontDir, "ArchivoBlack-Regular.ttf")),
    weight: 400,
    style: "normal",
  },
  {
    name: "Grotesk",
    data: fs.readFileSync(path.join(fontDir, "SpaceGrotesk-Variable.ttf")),
    weight: 400,
    style: "normal",
  },
  {
    name: "Mono",
    data: fs.readFileSync(path.join(fontDir, "SpaceMono-Regular.ttf")),
    weight: 400,
    style: "normal",
  },
  {
    name: "Mono",
    data: fs.readFileSync(path.join(fontDir, "SpaceMono-Bold.ttf")),
    weight: 700,
    style: "normal",
  },
  {
    name: "Instrument",
    data: fs.readFileSync(path.join(fontDir, "InstrumentSerif-Regular.ttf")),
    weight: 400,
    style: "normal",
  },
  {
    name: "Instrument",
    data: fs.readFileSync(path.join(fontDir, "InstrumentSerif-Italic.ttf")),
    weight: 400,
    style: "italic",
  },
];

const bikePaths = `
  <circle cx="230" cy="430" r="150" stroke-width="14"/>
  <circle cx="230" cy="430" r="130" stroke-width="4" opacity=".55"/>
  <circle cx="770" cy="430" r="150" stroke-width="14"/>
  <circle cx="770" cy="430" r="130" stroke-width="4" opacity=".55"/>
  <g stroke-width="4" opacity=".45">
    <path d="M230 280v300M80 430h300M124 324l212 212M336 324L124 536"/>
    <path d="M770 280v300M620 430h300M664 324l212 212M876 324L664 536"/>
  </g>
  <path d="M230 430 L470 430 L370 235 L660 220 L680 295 L770 430"/>
  <path d="M470 430 L370 235"/>
  <path d="M470 430 L680 295"/>
  <path d="M370 235 L352 190"/>
  <path d="M300 182 L410 176 L400 196 L310 200 Z" fill="COLOR" stroke="none"/>
  <path d="M660 220 L690 170 L770 160"/>
  <path d="M770 160 C 820 160 830 205 800 225 C 780 238 762 220 770 205"/>
  <circle cx="470" cy="430" r="34" stroke-width="10"/>
  <circle cx="470" cy="430" r="12" fill="COLOR" stroke="none"/>
  <circle cx="470" cy="430" r="46" stroke-width="5" stroke-dasharray="4 6" opacity=".7"/>
  <path d="M470 430 L515 472"/>
  <path d="M500 478 L535 462" stroke-width="18"/>
  <path d="M470 396 L230 410" stroke-width="5"/>
  <path d="M470 464 L230 450" stroke-width="5"/>
  <circle cx="230" cy="430" r="26" stroke-width="8"/>
`;

export function bikeSvg(color = "#17150F") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 620" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round">${bikePaths.replaceAll("COLOR", color)}</svg>`;
}

export function bikeDataUri(color = "#17150F") {
  return `data:image/svg+xml;base64,${Buffer.from(bikeSvg(color)).toString("base64")}`;
}

export function el(type, props = {}, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children
        .flat(Infinity)
        .filter((child) => child !== null && child !== undefined && child !== false),
    },
  };
}

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function renderPng(markup, width, height) {
  const svg = await satori(markup, { width, height, fonts });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

export async function renderJpeg(markup, width, height, quality = 86) {
  const svg = await satori(markup, { width, height, fonts });
  return sharp(Buffer.from(svg))
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

export const colorways = [
  {
    bg: "#F4EBDD",
    ink: "#17150F",
    accent: "#E8401C",
    tagBg: "#17150F",
    tagInk: "#F4EBDD",
  },
  {
    bg: "#E8401C",
    ink: "#F4EBDD",
    accent: "#F2C230",
    tagBg: "#F4EBDD",
    tagInk: "#17150F",
  },
  {
    bg: "#2440E8",
    ink: "#F4EBDD",
    accent: "#F2C230",
    tagBg: "#F2C230",
    tagInk: "#17150F",
  },
  {
    bg: "#F2C230",
    ink: "#17150F",
    accent: "#2440E8",
    tagBg: "#2440E8",
    tagInk: "#F4EBDD",
  },
  {
    bg: "#17150F",
    ink: "#F4EBDD",
    accent: "#E8401C",
    tagBg: "#E8401C",
    tagInk: "#F4EBDD",
  },
  {
    bg: "#0F7A63",
    ink: "#F4EBDD",
    accent: "#F2C230",
    tagBg: "#F4EBDD",
    tagInk: "#17150F",
  },
];

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}
