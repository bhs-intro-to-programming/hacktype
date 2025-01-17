import { setCanvas, drawFilledCircle, drawPolygon, clear, randColor, width, height, animate, now, drawText, drawLine, drawFilledRect, drawCircle, drawRect, } from './graphics.js';
setCanvas(document.getElementById('screen'));

//global decisions
const doSubwayMap = false // this overrides most of the following options
const fillSubwayLineGaps = false // this may take up to twice as long, and is unnoticable when zoomed out
const randomPlacement = true

//drawing dependents
// editable
let RoM = 2 * Math.PI // range of motion (radians) - read below
let length = 10
let angle = 0
let lineWidth = 1
let coords = { x: width / 2, y: height / 2 }
let lineColor = 'white' // for subwaymap
//non-editable
let recentArray = []
let offEdgeCount = 0
let polyArr = []
//for star detection this can be set to 4
const maxArrLength = 4//Math.round(4 * Math.PI / RoM) - 1

/* rom (shapes) guide
 * range of motion dictates the range at which the line can "turn" each update
 * it is in radians, 180 degrees = pi radians
 * on 'random', it will turn some angle in the range given, clockwise or counterclockwise
 * on 'round', it will only do the edges/center of that range
 * 'round' is the default, to enable 'random,' set randomPlacement to true (line 6)
 * 0 will do a straight line on random, 2pi does a straight line on round (0 & 4pi both do a straight line in one direction)
  
 *  - following informations is about 'round' - 
 * > 2 * pi will result in redundancy or breakage in the case of 4pi/2pi/0 
 * pi can make a perfect square, anything greater than that up to 2 pi will probably result in a triangle of some kind
 * anything less can make a shape with more sides or maybe break
 * shapes:
 * 4/3 for equilateral triangles
 * 8/5 pi makes stars (:
 * 1.5 makes right triangles
 * pi makes squares   (4/4 pi)
 * 4/5 makes pentagons
 * 2/3 makes hexagons  (4/6 pi)
 * 4/7 makes "septagons"
 * 1/2 makes octagons  (4/8 pi)
 * 4/9 makes nonagons 
 * etc
 * more sides = squares the chance to see it; 3 ^ (sides - 1) or 3^vertices, no vertice is created on an intersection point
*/

const update = (maybeRandom, maybeResetOffEdge, maybeDraw) => {
  const place = maybeRandom ? Math.random() * 2 - 1 : Math.round(Math.random() * 2 - 1);
  angle += place * RoM / 2
  const p = Math.cos(angle) * length
  const b = Math.sin(angle) * length
  const newCoords = { x: coords.x + b, y: coords.y + p }
  if (maybeResetOffEdge && ((newCoords.x < 0) || (newCoords.x > width) || (newCoords.y < 0) || (newCoords.y > height))) {
    coords = { x: width / 2, y: height / 2 }
    angle = 0
    offEdgeCount++
  } else {
    if (!maybeDraw) drawLine(coords.x, coords.y, newCoords.x, newCoords.y, lineColor, lineWidth)
    recentArray.push({ place, coords, angle })
    coords = newCoords
    if (!maybeRandom) checkForShape()
  }
};

const updateSubway = () => {
  const place = Math.round(Math.random() * 2 - 1);
  angle += place * RoM / 2
  const p = Math.cos(angle) * length
  const b = Math.sin(angle) * length
  const newCoords = { x: coords.x + b, y: coords.y + p }
  if (((newCoords.x < 0) || (newCoords.x > width) || (newCoords.y < 0) || (newCoords.y > height))) {
    coords = { x: width / 2, y: height / 2 }
    angle = 0
    offEdgeCount++
    if ((offEdgeCount % 2 === 0) && (offEdgeCount > 1)) {
      lineColor = randColor()
    } else if (offEdgeCount % 2 === 1) {
      angle = Math.PI
    }
  } else {
      if (fillSubwayLineGaps && (offEdgeCount >= 2) && (place != 0)) {
        drawFilledCircle(coords.x, coords.y, lineWidth / 2, lineColor)
      }
      //stations
      if ((Math.random() < 0.25) && (offEdgeCount >= 2)) {
        drawFilledCircle(coords.x, coords.y, lineWidth, lineColor)
      }
      drawLine(coords.x, coords.y, newCoords.x, newCoords.y, lineColor, lineWidth)
    coords = newCoords
  }
};

const startSubwayMap = () => {
  drawFilledRect(0, 0, width, height, '#FAF9F6')
  length = 300
  lineWidth = 100
  lineColor = '#87CEEB'
  RoM = Math.PI / 2 // 1/2 pi
  let lastOffEdge = 0
  const updateStart = () => {
    drawFilledCircle(coords.x, coords.y, lineWidth / 2, lineColor)
    updateSubway()
    if ((lastOffEdge === 0) && (offEdgeCount === 1)) angle = Math.PI
    lastOffEdge = offEdgeCount
  }
  while (offEdgeCount < 1) updateStart()
  angle = Math.PI
  while (offEdgeCount < 2) updateStart()
  lineColor = randColor()
  length = 50
  lineWidth = 10
  angle = 0
  coords = { x: width / 2, y: height / 2 }
}

const preDraw = (count) => {
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      if (doSubwayMap) {
        updateSubway()
      } else {
        update(randomPlacement, true, false)
        polyArr.push(coords)
      }
    }
    if (!doSubwayMap) drawPolygon(polyArr, lineColor, lineWidth)
  }
};

const drawSpace = (maybeLines, maybeCoords, maybeCenterMark) => {
  if (doSubwayMap) {
    startSubwayMap()
  } else {
    drawFilledRect(0, 0, width, height, '#002082')
    if (maybeCenterMark) {
      drawLine(width / 2, height / 2 - 50, width / 2, height / 2 + 50, 'orange', 5)
      drawLine(width / 2 + 50, height / 2, width / 2 - 50, height / 2, 'orange', 5)
    }
    if (maybeLines) {
      for (let i = 0; i < width; i += width / 100) {
        if (maybeCoords) {
          for (let s = 0; s < height; s += height / 100) {
            drawText('(' + (i - width / 2) + ', ' + (height - s - height / 2) + ')', i + 2, s - 2, 'grey', 10)
          }
        }
        drawLine(i, 0, i, height, 'grey', 1)
        drawLine(0, i, width, i, 'grey', 1)
      }
    }
  }
}
drawSpace(false, false, true)

const checkForShape = () => {
  if (recentArray.length > 1) {
    let checkVal = recentArray[0].place
    let count = 0
    let index = 0
    for (const element of recentArray) {
      if ((element.place === checkVal) && !(element.place === 0)) {
        count++
        if (count === maxArrLength) {
          let rad = recentArray[0].angle
          let loc = recentArray[0].coords
          for (let i = 0; i <= maxArrLength; i++) {
            const p = Math.cos(rad) * length
            const b = Math.sin(rad) * length
            const newLoc = { x: loc.x + b, y: loc.y + p }
            drawLine(loc.x, loc.y, newLoc.x, newLoc.y, 'orange', 3)
            rad += checkVal * RoM / 2
            loc = newLoc
          }
          recentArray = []
          drawFilledCircle(coords.x, coords.y, 2, 'orange')
          return 'fillertest'
        }
      } else {
        recentArray = recentArray.slice(index)
      }
      index++
    }
  }
};

preDraw(10000000) // keep relatively low for subway map

animate((t) => {
  if (doSubwayMap) {
    updateSubway()
  } else {
    update(randomPlacement, true, true)
  }
});
