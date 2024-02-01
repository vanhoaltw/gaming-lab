/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import shuffle from "lodash/shuffle"

import { splitImageToPieces } from "@/lib/canvas"
import { Button } from "@/components/ui/button"
import Timer from "@/components/Timer"
import Congratulation from "@/components/congratulation"
import Container from "@/components/container"
import { Icons } from "@/components/icons"

import GameSetting from "./_components/GameSetting"
import { GAME_IMAGES, gameLevels } from "./constant"

const LazyBoardGame = dynamic(() => import("./_components/BoardGame"), {
  ssr: false,
})

export interface TileProps {
  ratio: number
  url: string
  isEmpty: boolean
  originIndex: number
  x: number
  y: number
}


const defaultSetting = {
  level: gameLevels[0].value,
  imageUrl: GAME_IMAGES[0],
  timeStart: null,
}

export default function PuzzlePage() {
  const [showCongra, setShowCongra] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [setting, setSetting] = useState<any>(defaultSetting)
  const [moveCount, setMoveCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [tiles, setTiles] = useState<TileProps[]>([])

  const { level, imageUrl } = setting || {}

  const onFinish = () => {
    setSetting((pre: any) => ({ ...pre, timeStart: null }))
    setTimeout(() => {
      setShowCongra(true)
    }, 250)
  }

  const swapHandler = (direction: string) => {
    if (!setting?.timeStart) {
      setSetting((pre: any) => ({
        ...pre,
        timeStart: new Date().toISOString(),
      }))
    }

    const curIdx = tiles.findIndex((i) => i.isEmpty)
    let newIdx: number = -1

    switch (direction) {
      case "UP": {
        newIdx = curIdx + setting.level
        break
      }
      case "DOWN": {
        newIdx = curIdx - setting.level
        break
      }
      case "LEFT": {
        const reachedRight = (curIdx + 1) % setting.level === 0
        if (!reachedRight) newIdx = curIdx + 1
        break
      }
      case "RIGHT": {
        const reachedLeft = curIdx % setting.level === 0
        if (!reachedLeft) newIdx = curIdx - 1
        break
      }
    }

    if (newIdx >= 0 && newIdx < setting.level * setting.level) {
      setMoveCount((pre) => pre + 1)

      setTiles((pre) => {
        const clone = [...pre]
        clone[curIdx] = tiles[newIdx as number]
        clone[newIdx as number] = tiles[curIdx]
        return clone
      })
    }
  }

  const newGame = async () => {
    if (!canvasRef.current) return

    try {
      setLoading(true)
      const { images, aspectRatio } = await splitImageToPieces(
        canvasRef.current,
        imageUrl,
        setting.level,
        setting.level
      )
      const cl = images.map((url, idx) => ({
        url,
        originIndex: idx,
        isEmpty: false,
        ratio: aspectRatio,
      }))
      cl[cl.length - 1].isEmpty = true
      const newPieces = shuffle(cl)
      setMoveCount(0)
      setTiles(newPieces as any)
    } catch (error) {
      console.error({ error })
    } finally {
      setLoading(false)
    }
  }

  const onRestart = () => {
    const newPieces = shuffle(tiles)
    setMoveCount(0)
    setSetting((pre: any) => ({ ...pre, timeStart: null }))
    setTiles(newPieces)
  }

  useEffect(() => {
    newGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, imageUrl])

  // useHotKeys([
  //   ["ArrowUp", () => swapHandler?.("UP")],
  //   ["ArrowDown", () => swapHandler("DOWN")],
  //   ["ArrowRight", () => swapHandler("RIGHT")],
  //   ["ArrowLeft", () => swapHandler("LEFT")],
  // ])

  return (
    <Container>
      <h1 className="text-xl font-bold sm:text-3xl">Puzzle game</h1>
      <p className="text-muted-foreground"></p>

      <div className="flex max-w-4xl flex-wrap justify-center gap-8">
        <canvas ref={canvasRef} className="sr-only" />
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            Loading...
          </div>
        ) : (
          <div className="flex-1">
            <LazyBoardGame
              tiles={tiles}
              boardSize={setting?.level}
              onMove={swapHandler}
              onSolved={onFinish}
            />
          </div>
        )}

        <aside className="w-full space-y-4 sm:max-w-40">
          <Timer timeStart={setting.timeStart} isStart={!!setting?.timeStart} />
          <div>
            <p className="text-sm">Score</p>
            <strong className="text-2xl">{moveCount}</strong>
          </div>
          <div className="flex flex-col gap-3">
            <GameSetting defaultValue={setting} onChange={setSetting} />
            <Button variant="outline" onClick={onRestart}>
              <Icons.restart className="mr-2" size={16} />
              Restart
            </Button>
          </div>

          <div>
            <p className="mb-1 text-sm text-muted-foreground">Preview</p>
            <img
              src={setting?.imageUrl}
              alt=""
              height="auto"
              width={250}
              className="rounded-md"
            />
          </div>
        </aside>
      </div>

      <Congratulation
        open={showCongra}
        onOpenChange={setShowCongra}
        description={`You won with ${moveCount} moves. That's amazing.`}
      />
    </Container>
  )
}
