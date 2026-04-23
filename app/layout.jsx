import './globals.css';

export const metadata = {
  title: 'Masal Rehberi — Tunceli Müzesi',
  description: 'Tunceli Müzesi Dijital Sesli Rehberi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
