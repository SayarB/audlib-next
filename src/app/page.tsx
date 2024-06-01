"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { env } from "@/env/schema";
import { projectResponseSchema } from "@/validate";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";

export default function Home() {

  const [projects, setProjects] = useState<z.infer<typeof projectResponseSchema>>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const { organization } = useOrganization()
  const { isSignedIn, getToken } = useAuth()
  const getProjects = async () => {

    console.log(organization)
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects?limit=3`, {
      headers: {
        'Authorization': `Bearer ${await getToken()}`
      }
    })

    const data = await res.json()
    if (res.status !== 200) console.log("Error fetching projects")
    console.log(data)
    setProjects(data ?? [])

    setLoadingProjects(false)
  }

  useEffect(() => {
    if (isSignedIn) getProjects()
  }, [isSignedIn])

  return (
    <main className="">
      <div className="mb-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="">
          {loadingProjects || projects.length > 0 ? <><CardHeader> <div className="flex justify-between"><p className="text-2xl font-bold">Your Projects</p> <Link href={'/projects'}><Button variant={'default'}>View All</Button></Link></div></CardHeader>
            <CardContent>
              <ul className="max-h-[270px] overflow-hidden">
                {projects.map((project) => (
                  <li key={project.ID}>
                    <Link href={`/projects/${project.ID}`}>
                      <Card className="hover:border-gray-300 my-2">
                        <CardContent className="p-0">
                          <div className="p-3">
                            <p className="font-semibold">
                              {project.Name}
                            </p>
                            <p>
                              {project.LatestVersion ? (project.LatestVersion?.IsPublished ? "Published: " : "Latest: ") + project.LatestVersion.Title : "No Versions"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent></> :
            <div>
              <Link href={'/projects?create=true'}><Button variant={'ghost'} className="w-[100%] h-[200px]"><div className="flex flex-col items-center justify-center">
                <PlusCircledIcon width={25} height={25} className="mb-2" />
                <p className="text-lg">Create a project</p>
              </div></Button></Link>
            </div>
          }
        </Card>

      </div>
    </main>
  );
}
