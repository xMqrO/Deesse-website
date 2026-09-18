import type { RouteObject } from "react-router-dom";
import Layout from "@/components/feature/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
import Shop from "@/pages/shop/page";
import ProductDetail from "@/pages/product/page";
import Cart from "@/pages/cart/page";
import FAQ from "@/pages/faq/page";
import Privacy from "@/pages/privacy/page";
import AdminOverview from "@/pages/admin/page";
import AdminProducts from "@/pages/admin/products/page";
import AdminInventory from "@/pages/admin/inventory/page";
import AdminOrders from "@/pages/admin/orders/page";
import AdminCustomers from "@/pages/admin/customers/page";
import AdminCategories from "@/pages/admin/categories/page";
import AdminDiscounts from "@/pages/admin/discounts/page";
import AdminReviews from "@/pages/admin/reviews/page";
import AdminAnalytics from "@/pages/admin/analytics/page";
import AdminProfile from "@/pages/admin/profile/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "faq", element: <FAQ /> },
      { path: "privacy", element: <Privacy /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "products", element: <AdminProducts /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "discounts", element: <AdminDiscounts /> },
      { path: "reviews", element: <AdminReviews /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;