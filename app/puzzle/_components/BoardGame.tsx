/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react"
import { animated, useSpring } from "@react-spring/web"

import { cn } from "@/lib/utils"
import { useHotKeys } from "@/hooks/useHotKeys"

import { TileProps } from "../page"

interface Props {
  tiles: TileProps[]
  boardSize?: number
  onSolved?: () => void
  onMove?: (dir: string) => void
}

const getVisualPosition = (index: number, size: number) => {
  return {
    x: index % size,
    y: Math.floor(index / size),
  }
}

const BoardGame = (props: Props) => {
  const { tiles, boardSize = 3 } = props || {}
  const drawerAudio = new Audio("/sound/drawer.wav")

  const moveHandler = (dir: string) => {
    if (isSolved) return
    drawerAudio.play()
    props.onMove?.(dir)
  }

  useHotKeys([
    ["ArrowUp", () => moveHandler("UP")],
    ["ArrowDown", () => moveHandler("DOWN")],
    ["ArrowRight", () => moveHandler("RIGHT")],
    ["ArrowLeft", () => moveHandler("LEFT")],
  ])

  const isSolved = !!tiles?.every?.((i, index) => i.originIndex === index)

  useEffect(() => {
    if (isSolved) props.onSolved?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSolved])

  return (
    <div className="select-none rounded-lg bg-primary p-1">
      <ul
        style={{ aspectRatio: tiles?.[0]?.ratio }}
        className={cn(
          "relative",
          isSolved && "text-transparent transition-colors"
        )}
      >
        {tiles.map((item, idx) => (
          <Tile
            key={item.url}
            index={idx}
            tileData={item}
            boardSize={boardSize}
          />
        ))}
      </ul>
    </div>
  )
}

const Tile = ({
  tileData,
  index,
  boardSize,
}: {
  index: number
  tileData: any
  boardSize: number
}) => {
  const { isEmpty } = tileData || {}
  const { x, y } = getVisualPosition(index, boardSize)

  const style = {
    width: `calc(100% / ${boardSize})`,
    height: `calc(100% / ${boardSize})`,
  }

  const spring = useSpring({
    config: { duration: 100 },
    to: {
      x: `${x * 100}%`,
      y: `${y * 100}%`,
    },
  })

  return (
    <animated.li style={{ ...style, ...spring }} className="absolute p-0.5">
      {isEmpty ? null : (
        <img
          src={tileData.url}
          alt={`Piece-${index}`}
          className="size-full rounded-sm object-cover object-center"
          loading="eager"
        />
      )}
    </animated.li>
  )
}

export default BoardGame
