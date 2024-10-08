import { currentOrgResponseSchema } from "@/validate";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

export const useCurrentOrg = () => {
  const [loading, setLoading] = useState(true);
  const [currentOrg, setCurrentOrg] = useState<z.infer<
    typeof currentOrgResponseSchema
  > | null>(null);
  const pathname = usePathname();
  const { getToken, isSignedIn } = useAuth();
  const { setActive } = useOrganizationList();

  const getCurrentOrg = async () => {
    if (!isSignedIn) return;
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/current`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) return;
    const json = await res.json();
    if (!json) return;
    console.log("current org = ", json);
    setCurrentOrg(json);
    setLoading(false);
  };

  const revalidate = useCallback(async () => {
    console.log("revalidating current org");
    await getCurrentOrg();
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      console.log("getting current org");
      getCurrentOrg();
    }
  }, [pathname, isSignedIn]);

  const updateOrg = useCallback(
    async (id: string) => {
      if (!setActive) return;
      await setActive({
        organization: id,
      });
    },
    [setActive]
  );

  return { currentOrg, revalidate, loading, updateOrg };
};
