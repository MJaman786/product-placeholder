import React from "react";
import Login from "../components/Auth/Login";
import ProductsPage from "../pages/Products";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  isPrivate: boolean;
  activePage?: string;
}

export const AppRoutes: AppRoute[] = [
  // ─── Public Routes ────────────────────────────────────────────────────────
  {
    path: "/login",
    element: <Login />,
    isPrivate: false,
  },

  // ─── Protected Routes ─────────────────────────────────────────────────────
  {
    path: "/products",
    element: <ProductsPage />,
    isPrivate: true,
    activePage: "Products Catalog",
  },
];