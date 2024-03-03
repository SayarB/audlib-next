"use client";
import { env } from "@/env/schema";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])

  const getProjects = async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
      credentials: "include",
    })

    const data = await res.json()

    console.log(data)
    setProjects(data)
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <main className="">
      
    </main>
  );
}
