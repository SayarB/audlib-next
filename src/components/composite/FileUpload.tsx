import React, { ChangeEvent } from 'react'
import { Input } from '../ui/input'
import { env } from '@/env/schema'
import { postAudioFileSchema } from '@/validate'
import { z } from 'zod'
import { LoadingSvg } from '../icons/Loading'
import { UploadIcon } from '@radix-ui/react-icons'
import { useAuth } from '@clerk/nextjs'

type Props = {
    keyString: string
    onError: (e: string) => void
    onFileUploadEnd: (data: z.infer<typeof postAudioFileSchema>) => void
}

const FileUpload = ({ keyString, onError, onFileUploadEnd }: Props) => {
    const [fileUploading, setFileUploading] = React.useState(false)
    const [fileName, setFileName] = React.useState("")

    const { getToken } = useAuth()

    const onFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("audioFile", file)
        setFileUploading(true)
        // const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/audio`, {
        //     method: "POST",
        //     credentials: "include",
        //     body: formData
        // })


        // if (!res.ok) {
        //     onError("Could not upload file")
        // }

        try {
            const resUploadUrl = await fetch(`${env.NEXT_PUBLIC_API_URL}/audio/upload?filename=${file.name}`, {
                headers: {
                    'Authorization': 'Bearer ' + await getToken()
                }
            })
            if (resUploadUrl.status !== 200) {
                throw new Error("Could not get upload url")
            }

            const uploadUrl = (await resUploadUrl.json()) as {
                url: string, key: string
            }


            const res = await fetch(uploadUrl.url, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                    "Content-Length": file.size.toString(),
                },
                body: formData.get("audioFile"),
            })

            if (res.status !== 200) {
                throw new Error("Could not upload file")
            }

            const addAudioToDBRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/audio`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + await getToken(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ key: uploadUrl.key, filename: file.name, size: file.size, mime: file.type })
            })

            if (addAudioToDBRes.status !== 200 && addAudioToDBRes.status !== 201) {
                throw new Error("Could not add audio to db")
            }

            const data = postAudioFileSchema.parse(await addAudioToDBRes.json())
            console.log("Upload end", data)
            onFileUploadEnd(data)
        } catch (e) {
            console.error(e)
        } finally {
            setFileUploading(false)
            setFileName(file.name ?? "")
        }

    }

    return (
        <div className='w-[300px] h-[50px]'>
            <label htmlFor={`file-upload-${keyString}`} className='w-[300px] h-[50px] cursor-pointer'>
                <Input id={`file-upload-${keyString}`} placeholder="Audio File" className='w-[300px] hidden' type='file' onChange={onFileUpload} />
                <div className='w-full h-full border text-center flex items-center justify-center'>
                    {!fileUploading ? <div>
                        {fileName.length > 0 ? fileName : <div className='flex items-center'><p className='mr-2'>Upload</p><UploadIcon /></div>}
                    </div> :
                        <LoadingSvg />
                    }
                </div>
            </label>
        </div>
    )
}

export default FileUpload