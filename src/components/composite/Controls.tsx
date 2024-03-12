import { LoadingSvg } from "../icons/Loading"
import { PauseSvg } from "../icons/Pause"
import { PlaySvg } from "../icons/Play"
import { Button } from "../ui/button"

export const PlayButton = ({ onClick, loading }: { onClick: React.MouseEventHandler, loading?: boolean }) => {
    return <Button className='rounded-full w-[60px] aspect-square ' onClick={onClick}>
        {loading ? <LoadingSvg /> : PlaySvg
        }
    </Button >
}

export const PauseButton = ({ onClick, loading }: { onClick: React.MouseEventHandler, loading?: boolean }) => {
    return <Button onClick={onClick}>
        {loading ? <LoadingSvg /> : PauseSvg}
    </Button >
}