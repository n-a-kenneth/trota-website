import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource/dm-mono/400.css";
import "@fontsource-variable/noto-sans-sinhala";
import "@fontsource-variable/noto-sans-tamil";
import "@fontsource-variable/noto-serif-sinhala";
import "@fontsource-variable/noto-serif-tamil";
import "lenis/dist/lenis.css";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Trota",
  description: "A women's health chatbot that keeps your records on your phone and shows where every answer comes from.",
};

const themeScript = `try{var m=localStorage.getItem('trota-mode')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(m==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
