/*
 * This code is running in an environment the same as simple-draw. Thus you have
 * two variables that will be helpful.
 *
 *  width - the width of the drawing area.
 *  height - the height of the drawing area.
 *
 * And these methods which do the same thing as in simple-draw.
 *
 *  drawLine(x1, y1, x2, y2, color, lineWidth)
 *
 *  drawCircle(x, y, radius, color, lineWidth=1)
 *
 *  drawRect(x, y, w, h, color, lineWidth=1)
 *
 *  drawTriangle(x1, y1, x2, y2, x3, y3, color, lineWidth=1)
 *
 *  drawFilledCircle(x, y, r, color)
 *
 *  drawFilledRect(x, y, width, height, color)
 *
 *  drawFilledTriangle(x1, y1, x2, y2, x3, y3, color)
 *
 *  clear()
 */
/*const bigness = 22 //just leave it at 5 or 10 please edit: it works now
var dist = bigness*2
while (dist < width){
  var dist = dist+bigness*2
}
const center = width-dist
var dist=center
var dist = dist+bigness*2
while (dist < width){ 
drawFilledCircle(dist-center/2, height/2, bigness, 'red')
var dist = dist+bigness*2
}
*/
const bigness = 22 
let dist = bigness*2
while (dist < width){
  let dist = dist+bigness*2
}
const center = width-dist
let dist=center
let dist = dist+bigness*2
while (dist < width){ 
drawFilledCircle(dist-center/2, height/2, bigness, 'red')
let dist = dist+bigness*2
}