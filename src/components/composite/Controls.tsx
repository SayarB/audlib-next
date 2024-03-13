import { LoadingSvg } from "../icons/Loading"
import { PauseSvg } from "../icons/Pause"
import { PlaySvg } from "../icons/Play"
import { Button } from "../ui/button"

export const PlayButton = ({ onClick, loading }: { onClick: React.MouseEventHandler, loading?: boolean }) => {
    return <Button className='aspect-square rounded-[100%] w-[40px] h-[40px] p-0' onClick={onClick}>
        {loading ? <LoadingSvg /> : PlaySvg
        }
    </Button >
}

export const PauseButton = ({ onClick, loading }: { onClick: React.MouseEventHandler, loading?: boolean }) => {
    return <Button className='aspect-square rounded-[100%] w-[40px] h-[40px] p-0' onClick={onClick}>
        {loading ? <LoadingSvg /> : PauseSvg}
    </Button >
}