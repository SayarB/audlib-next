"use client"
import { env } from "@/env/schema";
import { useOrgStore } from "@/store/zustand";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const state = useOrgStore(st => ({ id: st.orgID, name: st.orgName }))
  const [projects, setProjects] = useState<any[]>([])

  const getProjects = async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
      credentials: "include",
      headers: {
        'Organization-ID': state.id
      }
    })

    const data = await res.json()

    console.log(data)
    setProjects(data)
  }

  useEffect(() => {
    if (state.id !== "") {
      getProjects()
    }
  }, [state.id])

  return (
    <main className="">
      <p>{state.id !== "" ? "Org = " + state.name : "No Organization"}</p>
      {state.id === "" ? <a href="/login">Login</a> :
        <ul>
          {projects!.map(proj => <li>{proj.Name}</li>)}
        </ul>
      }



    </main>
  );
}
