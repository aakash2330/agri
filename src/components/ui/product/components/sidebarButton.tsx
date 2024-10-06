"use client";

import useSetQueryParams from "@/hooks/use-set-query-param";
import { Button } from "../../button";

export function SidebarButton({ text }) {
  const setQueryParams = useSetQueryParams();
  return (
    <Button
      onClick={() => {
        setQueryParams({ address: text });
      }}
      variant="ghost"
      className="w-full justify-start text-green-500"
    >
      {text}
    </Button>
  );
}
