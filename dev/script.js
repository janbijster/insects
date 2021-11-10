class DNA {
    static length = 200
    static randomValues() {
        return Array.from({length: DNA.length}, () => Math.random());
    }
    static extractBit(value) {
        return [
            value > 0.5,
            value * 2 % 1
        ]
    }
    static squash(value, factor) {
        return Math.pow(value, factor)
    }

    constructor(values) {
        this.values = values || DNA.randomValues()
    }

    getValue(index) {
        return this.values[index % DNA.length]
    }
    inverse() {
        return new DNA(
            this.values.map(value => 1 - value)
        )
    }
    mutate() {
        this.values[Math.floor(Math.random() * DNA.length)] = Math.random()
    }
    mutated() {
        let newDna = new DNA([...this.values])
        newDna.mutate()
        return newDna
    }
    combine(dna, factor) {
        let newValues = [...this.values]
        for (let i = 0; i < DNA.length; i++) {
            if (Math.random() < factor) {
                newValues[i] = dna.values[i]
            }
        }
        return new DNA(newValues)
    }
}

class Cell {
    constructor (dna, startIndex, angle, angleOffset, sideChain, sizeVal, color, growVal, counterVal, parent) {
        this.dna = dna || new DNA()
        this.startIndex = startIndex || 0
        this._index = this.startIndex

        if (color == undefined) {
            this.color = {
                r: DNA.squash(this.newValue(), 4),
                g: DNA.squash(this.newValue(), 4),
                b: DNA.squash(this.newValue(), 4)
            }
        } else {
            this.color = {
                r: (color.r + (0.1 * this.newValue() - 0.05)) % 1,
                g: (color.g + (0.1 * this.newValue() - 0.05)) % 1,
                b: (color.b + (0.1 * this.newValue() - 0.05)) % 1
            }
        }

        this.sizeVal = sizeVal == undefined ? this.newValue() : sizeVal
        this.counterVal = counterVal == undefined ? this.newValue() : counterVal
        this.growVal = growVal == undefined ? this.newValue() : growVal

        this.size = 10 * DNA.squash(this.sizeVal, 0.5)
        this.counter = Math.floor(5000 * this.counterVal) 
        this.grow = DNA.squash(this.growVal - 0.5, 3)

        this.parent = parent
        this.sideChain = sideChain || false
        this.angle = angle || 0
        this.angleOffset = angleOffset == undefined ? (this.newValue() - 0.5) * 0.1 : angleOffset
        this.children = []
    }

    get index() {
        return this._index++
    }

    newValue() {
        return this.dna.getValue(this.index)
    }

    next(depth = 10) {
        if (depth > 0) {
            this.children.forEach(child => child.next(depth - 1))
        }
        if (this.counter > 0) {

            // grow/shrink
            this.size += this.grow

            // change grow
            if (this.newValue() * 2 < this.grow) {
                this.grow *= this.newValue() * 0.8 + 0.6
            }
            if (this.newValue() * 5 < this.children.length) {
                this.grow -= this.newValue() * 0.05
            }
            if (this.newValue() < 0.001) {
                this.grow = 0.1
            }
            if (this.grow < 0) {
                this.counter = 0
            }

            // split
            if (this.sideChain) {
                if (this.size > this.newValue()) {
                    this.split()
                }
            } else {
                if (this.newValue() * (this.children.length + 1) < 1 * Math.pow(this.size / 10, 2)) {
                    this.split()
                }
            }

            // count down
            this.counter--
        }

    }

    split() {
        let newSizeVal = DNA.squash(this.size/11, 2)
        if (!this.sideChain) {
            if (this.newValue() < 0.2) {
                newSizeVal = this.newValue()
            }
        }
        if (this.children.length == 0) {
            let newAngleOffset
            if (this.sideChain) {
                if (this.size > this.newValue() * 10) {
                    newAngleOffset = this.angleOffset + this.angle * 0.1 * this.size * (this.newValue() - 0.5)
                } else {
                    newAngleOffset = this.angleOffset
                }
            } else {
                newAngleOffset = this.angleOffset + 0.1 * (this.newValue() - 0.5)
            } 
            const newStartIndex = this.newValue() < 0.2 ? this.startIndex + 1 : this.startIndex
            this.children.push(
                new Cell(this.dna, newStartIndex, this.angle + this.angleOffset, newAngleOffset, this.sideChain, newSizeVal, this.color)
            )
        } else {
            if (this.newValue() < 0.1 && (!this.sideChain || this.newValue() < 0.1)) {
                const angleOffset = 1.57 + DNA.squash(this.newValue() - 0.5, 3) * 10
                this.children.push(
                    new Cell(this.dna.inverse(), this.startIndex + 1, this.angle + angleOffset, 0, true, newSizeVal / 10, this.color)
                )
                this.children.push(
                    new Cell(this.dna.inverse(), this.startIndex + 1, this.angle - angleOffset, 0, true, newSizeVal / 10, this.color)
                )
            }
        }
    }
}

function offsetPosition(position, distance, angle) {
    return [
        position[0] - Math.sin(angle) * distance,
        position[1] + Math.cos(angle) * distance
    ]
}

function drawCell(cell, position) {
    const size = 2
    fill(cell.color.r * 255, cell.color.g * 255, cell.color.b * 255)
    ellipse(position[0], position[1], cell.size * size)
    cell.children.forEach(child => {
        let useAngle = child.angle
        let angleDiff = cell.angle - child.angle
        if (child.sideChain) {
            if (abs(angleDiff) < 1) {
                useAngle = child.angle * (1 + 0.1 * Math.sin(millis() / 100 + 3 * child.size + angleDiff))
            }
        } else {
            useAngle = child.angle * (1 + 0.5 * Math.sin(millis() / 1000 + 3 * child.size))
        }
        const newPosition = offsetPosition(position, (cell.size + child.size), useAngle)
        drawCell(child, newPosition)
    })
}


let insects = []
let startPositions = []
let colors = []

function setup() {
    createCanvas(windowWidth, windowHeight)
    for (let y = 100; y < windowHeight; y += 300) {
        let secondLastInsect
        let lastInsect
        for (let x = 100; x < windowWidth; x += 400) {
            secondLastInsect = lastInsect
            lastInsect = new Cell()
            insects.push(lastInsect)
            startPositions.push([x, y])
            if (x > 100) {
                let combinedDna1 = secondLastInsect.dna.combine(lastInsect.dna, 0.8)
                let combinedDna2 = secondLastInsect.dna.combine(lastInsect.dna, 0.5)
                let combinedDna3 = secondLastInsect.dna.combine(lastInsect.dna, 0.2)

                insects.push(new Cell(combinedDna1))
                startPositions.push([x - 100, y + 50])

                insects.push(new Cell(combinedDna2))
                startPositions.push([x - 200, y + 50])

                insects.push(new Cell(combinedDna3))
                startPositions.push([x - 300, y + 50])
            }
        }
    }
}

function draw() {
    background(220)
    insects.forEach((cell, index) => {
        drawCell(cell, startPositions[index])
        cell.next()
    })
}

function keyPressed() {
    insects = insects.map(insect => new Cell(insect.dna.mutated()))
}