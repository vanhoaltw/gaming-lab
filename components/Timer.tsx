import { useEffect, useState } from "react"
import dayjs from "dayjs"

import { durationDisplay } from "@/lib/utils"

interface Props {
  timeStart?: Date | null
  isStart?: boolean
}

const Timer = ({ isStart, timeStart }: Props) => {
  const [time, setTime] = useState<number>(0)

  const getLiveTime = () => dayjs().diff(dayjs(timeStart), "second")

  useEffect(() => {
    let interval: any = null

    if (isStart) {
      interval = setInterval(() => {
        setTime(getLiveTime())
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isStart]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="">
      <p className="text-sm">Time</p>
      <b className="text-2xl">{durationDisplay(time)}</b>
    </div>
  )
}

export default Timer
