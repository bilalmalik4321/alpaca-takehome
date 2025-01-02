import "./globals.css"; // Ensure you have a global CSS file for styling
import HamburgerMenu from "../components/HamburgerMenu";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="p-4 bg-blue-500 text-white flex items-center">
          <HamburgerMenu />
          <h1 className="ml-4 text-xl font-bold">Session Notes App</h1>
        </header>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
