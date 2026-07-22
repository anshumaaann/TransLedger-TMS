import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";

const queryClient = new QueryClient();
console.log("MAIN WITH QUERY PROVIDER");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);