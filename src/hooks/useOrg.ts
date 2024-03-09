import { currentOrgResponseSchema } from "@/validate";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

export const useCurrentOrg = () => {
  const [loading, setLoading] = useState(true);
  const [currentOrg, setCurrentOrg] = useState<z.infer<
    typeof currentOrgResponseSchema
  > | null>(null);

  const revalidate = useCallback(() => {
    getCurrentOrg();
  }, [setCurrentOrg]);

  const getCurrentOrg = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/current`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const json = await res.json();
    if (!json) return;
    console.log("current org = ", json);
    setCurrentOrg(json);
    setLoading(false);
  };

  useEffect(() => {
    getCurrentOrg();
  }, [setCurrentOrg]);

  return { currentOrg, revalidate, loading };
};
