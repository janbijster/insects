function createSection(
    startPoint = {x: 50, y: 50}, 
    height = 50,
    width = 0.5,
    spikyness = 0.5,
    var1 = 0.5,
    var2 = 0.5
) {
    const endPoint = {x: startPoint.x, y: startPoint.y + height}
    const control1 = {
        x: startPoint.x - ((1 - spikyness) * width * height),
        y: startPoint.y + ((3 * var1 - 0.5) * width * height)
    }
    const control2 = {
        x: startPoint.x - (2 * width * height),
        y: startPoint.y + ((3 * var2 - 1) * width * height)
    }
    
    stroke(0);
    bezier(
        startPoint.x, startPoint.y,
        control1.x, control1.y,
        control2.x, control2.y,
        endPoint.x, endPoint.y
    )
    bezier(
        startPoint.x, startPoint.y,
        2 * startPoint.x - control1.x, control1.y,
        2 * startPoint.x - control2.x, control2.y,
        endPoint.x, endPoint.y
    )
}