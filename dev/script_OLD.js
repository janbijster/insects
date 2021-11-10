class DNA {
    static length = 40
    static randomValues() {
        return Array.from({length: DNA.length}, () => Math.random());
    }
    static extractBit(value) {
        return [
            value > 0.5,
            value * 2 % 1
        ]
    }

    constructor(values) {
        this.values = values || DNA.randomValues()
    }

    getValue(index) {
        if (!index) {
            index = Math.floor(this.values.slice(-1) * DNA.length)
        }
        return this.values[index]
    }


    evolveValue(index) {
        let evolver = this.values[index + 1]
        let [ pos, evolverValue ] = DNA.extractBit(evolver)
        let expValue = Math.pow(evolverValue, 2)
        let exp = pos ? expValue : -expValue
        this.values[index] *= Math.pow(2, exp)
    }

    evolve() {
        for (let i = 0; i < DNA.length - 1; i++) {
            this.evolveValue(i)
        }
    }

    evolved() {
        let newDna = new DNA([...this.values])
        newDna.evolve()
        return newDna
    }

}


class Section {
    static getConf(dna) {
        let [ split, val ] = DNA.extractBit(dna.getValue())
        let [ evolve, size ] = DNA.extractBit(val)
        return { split, evolve, size }
    }

    constructor (dna, parent, child) {
        this.dna = dna
        this.parent = parent
        this.child = child
        this.conf = Section.getConf(this.dna)
    }

    evolve () {
        if (this.conf.size < 0.1 || (this.child && this.child.conf.size < 0.01)) {
            return
        }
        if (this.conf.evolve) {
            this.dna = this.dna.evolved()
            this.conf = Section.getConf(this.dna)
        }

        if (this.child) {
            this.child.evolve()
        }

        if (this.conf.split) {
            this.split()
        }
    }

    split() {
        this.child = new Section(this.dna.evolved(), this, this.child)
    }
}

function drawSection(section, position) {
    const size = 20
    ellipse(position.x, position.y + 0.5 * section.conf.size * size, section.conf.size * size)
    if (section.child) {
        drawSection(section.child, { x: position.x, y: position.y + section.child.conf.size * size })
    }
}

let dna = new DNA()
console.log(dna.values)
let section = new Section(dna)
let startPosition = { x: 30, y: 30 }

function setup() {
    createCanvas(windowWidth, windowHeight)
}

function draw() {
    background(220)
    drawSection(section, startPosition)
}

function keyPressed() {
    section.evolve()
    console.log(section)
}