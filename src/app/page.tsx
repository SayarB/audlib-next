"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { env } from "@/env/schema";
import { useAuth } from "@/hooks/useAuth";
import { projectResponseSchema } from "@/validate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Home() {

  const [projects, setProjects] = useState<z.infer<typeof projectResponseSchema>>([])
  const { isAuthed, isOrgSelected } = useAuth()
  const getProjects = async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
      credentials: "include",
    })

    const data = await res.json()
    if (res.status !== 200) console.log("Error fetching projects")
    console.log(data)
    setProjects(data ?? [])
  }

  useEffect(() => {
    if (isAuthed && isOrgSelected) getProjects()
  }, [isAuthed, isOrgSelected])

  return (
    <main className="">
      <div className="mb-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="">
          <CardHeader> <div className="flex justify-between"><p className="text-2xl font-bold">Your Projects</p> <Link href={'/projects'}><Button variant={'default'}>View All</Button></Link></div></CardHeader>
          <CardContent>
            <ul>
              {projects.map((project) => (
                <li key={project.ID}>
                  <Link href={`/projects/${project.ID}`}>
                    <Card className="hover:border-gray-300">
                      <CardContent className="p-0">
                        <div className="p-3">
                          <p className="font-semibold">
                            {project.Name}
                          </p>
                          <p>
                            {project.LatestVersion?.Title ?? "No Version"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
