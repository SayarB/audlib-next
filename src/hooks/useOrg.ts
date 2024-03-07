import { currentOrgResponseSchema } from "@/validate";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

export const useCurrentOrg = () => {
  const [currentOrg, setCurrentOrg] = useState<z.infer<
    typeof currentOrgResponseSchema
  > | null>(null);

  const revalidate = useCallback(() => {
    getCurrentOrg();
  }, [setCurrentOrg]);

  const getCurrentOrg = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/current`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const json = await res.json();
    if (!json) return;
    console.log("current org = ", json);
    setCurrentOrg(json);
  };

  useEffect(() => {
    getCurrentOrg();
  }, [setCurrentOrg]);

  return { currentOrg, revalidate };
};
