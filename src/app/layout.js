import { Inter } from "next/font/google";
import Providers from "./providers";
import { CookiesProvider } from "next-client-cookies/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <CookiesProvider>
      <html lang="en">
        <body
          className={[inter.className, "trial"]}
          suppressHydrationWarning
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </CookiesProvider>
  );
}
