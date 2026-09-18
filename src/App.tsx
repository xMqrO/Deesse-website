import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "@/router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { CartProvider } from "@/context/CartContext";
import { SocialProvider } from "@/context/SocialContext";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const id = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 60);
        return () => clearTimeout(id);
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SocialProvider>
        <CartProvider>
          <BrowserRouter basename={__BASE_PATH__}>
            <ScrollManager />
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </SocialProvider>
    </I18nextProvider>
  );
}

export default App;