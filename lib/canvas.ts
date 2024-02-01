export const splitImageToPieces = (
  canvas: HTMLCanvasElement,
  imageUrl: string,
  row = 3,
  col = 3
): Promise<{ images: string[]; aspectRatio: number }> => {
  return new Promise((res, rej) => {
    const ctx = canvas.getContext("2d")
    const image = new Image()
    image.src = imageUrl
    image.onerror = rej
    image.crossOrigin = "anonymous" // https://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported
    image.onload = (ev) => {
      canvas.width = image.width
      canvas.height = image.height
      console.log({ image })
      const piceCanvases: string[] = []
      const piceHeight = Math.floor(canvas.height / row)
      const piceWidth = Math.floor(canvas.width / col)

      ctx?.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      )

      for (let y = 0; y < row; y += 1) {
        for (let x = 0; x < col; x += 1) {
          const piceCanvas = document.createElement("canvas")
          piceCanvas.height = piceHeight
          piceCanvas.width = piceWidth
          piceCanvas
            .getContext("2d")!
            .drawImage(canvas, -x * piceWidth, -y * piceHeight)

          piceCanvases.push(piceCanvas.toDataURL())
        }
      }
      res({
        images: piceCanvases,
        aspectRatio: canvas.width / canvas.height,
      })
    }
  })
}
