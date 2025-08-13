import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app/App";
import "./index.css";
import { config } from "@/config/WagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./app/components/Layout";
import Transfer from "./app/modules/transfer/Transfer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/transfer",
    element: (
      <Layout>
        <Transfer />
      </Layout>
    ),
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </WagmiProvider>
);
