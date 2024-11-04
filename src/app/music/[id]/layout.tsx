import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

type Props = {
    children: React.ReactNode
}
const MusicPageLayout: React.FC<Props> = ({ children }) => {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}

export default MusicPageLayout