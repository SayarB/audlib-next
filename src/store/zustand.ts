import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OrgStore {
  orgID: string;
  orgName: string;
  changeOrg: (value: { orgID: string; orgName: string }) => void;
}

export const useOrgStore = create<OrgStore>()(
  persist(
    (set) => ({
      orgID: "",
      orgName: "",
      changeOrg: (value: { orgID: string; orgName: string }) => {
        set(value, true);
      },
    }),
    {
      name: "org-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
