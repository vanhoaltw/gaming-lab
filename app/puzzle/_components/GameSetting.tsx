import { useEffect, useState } from "react"

import { verifyImageResponse } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { gameLevels } from "../constant"

const GameSetting = ({
  defaultValue,
  onChange,
}: {
  defaultValue?: { level?: number; imageUrl?: string }
  onChange?: any
}) => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [isVerifying, setIsVerifying] = useState(false)

  const onSetValue = (v: any) => setValue((pre) => ({ ...pre, ...v }))

  useEffect(() => {
    if (isOpen && !!defaultValue) setValue(defaultValue)
  }, [isOpen, defaultValue])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Icons.setting className="mr-2" size={16} />
          Setting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Setting</DialogTitle>
        </DialogHeader>
        <div>
          <p className="mb-1.5 mt-3 font-bold">Level</p>
          <div className="flex flex-wrap justify-between gap-3">
            {gameLevels.map((l) => (
              <div
                key={l.value}
                onClick={() => onSetValue({ level: l.value })}
                className={
                  value?.level === l.value
                    ? "inline-block text-primary"
                    : "inline-block cursor-pointer text-muted-foreground"
                }
              >
                <small>{l.name}</small>
                <div
                  className="mt-1.5 grid size-24 border-b border-r border-current"
                  style={{ gridTemplateColumns: `repeat(${l.value}, 1fr)` }}
                >
                  {/* @ts-ignore */}
                  {[...Array(Math.pow(l.value, 2)).keys()].map((k) => (
                    <div
                      className="aspect-square border-l border-t border-current"
                      key={k}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mb-2 mt-6 font-bold">Image Url</p>
          <Input
            value={value?.imageUrl}
            onChange={(e) => onSetValue({ imageUrl: e.target.value })}
            placeholder="Put you image url at here"
          />

          <p className="mt-6 text-red-500">
            <strong>Danger:</strong> if you save, you will reset current game
            progress
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            isLoading={isVerifying}
            onClick={async () => {
              try {
                setIsVerifying(true)
                await verifyImageResponse(value?.imageUrl as string)
                setIsVerifying(false)
                setIsOpen(false)
                onChange(value)
              } catch {
                toast({
                  description: "You image url is invalid",
                  variant: "destructive",
                })
                setIsVerifying(false)
              }
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GameSetting
