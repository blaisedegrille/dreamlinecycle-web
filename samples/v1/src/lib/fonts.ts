import localFont from "next/font/local";

export const archivo = localFont({
  src: "../fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["Arial Black", "Arial", "sans-serif"],
});

export const grotesk = localFont({
  src: "../fonts/SpaceGrotesk-Variable.ttf",
  variable: "--font-grotesk",
  weight: "300 700",
  style: "normal",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const mono = localFont({
  src: [
    {
      path: "../fonts/SpaceMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SpaceMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
  fallback: ["Courier New", "monospace"],
});

export const instrument = localFont({
  src: [
    {
      path: "../fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

export const fontVariables = [
  archivo.variable,
  grotesk.variable,
  mono.variable,
  instrument.variable,
].join(" ");
