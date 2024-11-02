"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import persistStore from "redux-persist/es/persistStore";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/auth-context";
import { PersistGate } from "redux-persist/es/integration/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const persistor = persistStore(store);

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <NextUIProvider>
            <NextThemesProvider
              defaultTheme="system"
              attribute="class"
              {...themeProps}
            >
              {children}
              <ToastContainer />
            </NextThemesProvider>
          </NextUIProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
