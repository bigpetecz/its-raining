import './global.css';

export const metadata = {
  title: 'It\'s Raining - Card Game',
  description: 'A fun card game built with Next.js, XState, and Nx',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
