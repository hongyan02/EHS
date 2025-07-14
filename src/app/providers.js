// app/providers.js
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "antd";
import { useState } from "react";

export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <App>{children}</App>
        </QueryClientProvider>
    );
}
