"use client";

import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 30,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  return browserQueryClient;
}