import ReactConfetti from "react-confetti"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

const Congratulation = ({
  open,
  onOpenChange,
  description,
}: {
  open: boolean
  onOpenChange: (x: boolean) => void
  description: string
}) => {
  if (typeof window === "undefined") return <></>

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              🎉 You won 🎉
            </DialogTitle>
            <DialogDescription className="!my-6 text-center text-base">
              {description}
            </DialogDescription>

            <DialogFooter>
              <DialogClose asChild className="mx-auto">
                <Button>Okay</Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {open && (
        <div className="fixed left-0 top-0 z-[9999999]">
          <ReactConfetti
            width={window?.innerWidth}
            height={window?.innerHeight}
          />
        </div>
      )}
    </>
  )
}

export default Congratulation
