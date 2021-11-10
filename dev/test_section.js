


let var2 = 0

function setup() {
    createCanvas(windowWidth, windowHeight)
}

function draw() {
    background(220)

    const width = 50
    const height = 50
    const space = 20
    const nx = 20
    const ny = 20
    const initialStartPoint = { x: space + 0.5 * width, y : space }

    for (let yi = 0; yi < nx; yi++) {
        for (let xi = 0; xi < ny; xi++) {
            startPoint = {
                x: initialStartPoint.x + xi * (width + space),
                y: initialStartPoint.x + yi * (height + space),
            }
            let spikyness = xi / (nx - 1)
            let var1 = yi / (ny - 1)

            createSection(
                startPoint,
                height,
                0.5,
                spikyness,
                var1,
                var2
            )
        }
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
      var2 -= 0.1
    } else if (keyCode === RIGHT_ARROW) {
      var2 += 0.1
    }
    console.log(var2)
  }