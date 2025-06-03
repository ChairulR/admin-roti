import "./globals.css";
import ClientWrapper from "@/components/clientWarp";

export const metadata = {
  title: "Admin Roti",
  description: "Admin Roti",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
