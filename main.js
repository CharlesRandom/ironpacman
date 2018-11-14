// canvas
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')

// variables
var interval = null
var frames = 0
var speed = 25
var charSize = 30
var images = {
  pacman0: "images/Pacman/sprite_pacman0.png",
  pacman1: "images/Pacman/sprite_pacman1.png",
  pacman2: "images/Pacman/sprite_pacman2.png",
  blinky: "images/blinky.png",
  inky: "images/inky.png",
  pinky: "images/pinky.png",
  clyde: "images/clyde.png",
  obstacle_hor: "images/obstacle_hor.png",
  obstacle_ver: "images/obstacle_ver.png",
  ironhack: "images/ironhack.png"
}

// classes
function Board(){
  this.x = 0
  this.y = 0
  this.width = canvas.width
  this.height = canvas.height

  this.draw = function(){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
  }
}

function Pacman(){
  this.x = 210
  this.y = 250
  this.width = charSize
  this.height = charSize
  this.image = new Image()
  this.image.src = images.pacman1
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    // this.x+=1
    this.boundaries()
    ctx.fillStyle = "yellow"
    ctx.fillRect(this.x,this.y,this.width,this.height)
  }

  this.boundaries = function(){
    if(this.y+this.height > canvas.height-10){
      this.y = canvas.height - this.height -10
    } 
    if(this.y < 10){
      this.y = 10
    }
    if(this.x < 10){
      this.x = 10
    }
    if(this.x + this.width > canvas.width-10){
      this.x = canvas.width - this.width - 10
    }
  }
}

function Ghost(x,y,img,dir,long,color){
  this.x = x ? x : 600
  this.y = y ? y : 450
  this.dir = dir ? dir : 1
  this.changeDir = 1
  this.goBackwards = 1
  this.long = long ? long : 60
  this.width = charSize
  this.height = charSize
  this.color = color
  this.image = new Image()
  this.image.src = img ? img : images.pacman0
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    // ZigZag movement
    if(Math.floor(frames/this.long) % 2 === 0){
      this.changeDir = -1
    }
    else {
      this.changeDir = 1
    }
    if(this.x < 10){
      this.goBackwards = -1
    }
    if(this.x + this.width > canvas.width-10){
      this.goBackwards = 1
    }
    this.y -= this.changeDir * this.dir * 3
    this.x -= this.goBackwards * 3
    ctx.fillStyle = this.color
    ctx.fillRect(this.x,this.y,this.width,this.height)
  }
}

function Obstacle(x,y,width,height){
  this.x = x ? x : 300
  this.y = y ? y : 100
  this.width = width ? width : 250
  this.height = height ? height : 60

  this.draw = function(){
    ctx.strokeStyle = "blue"
    ctx.lineWidth = 5
    ctx.strokeRect(this.x,this.y,this.width,this.height)
  }
}

function Pellet(x,y,img){
  this.x = x ? x : 450
  this.y = y ? y : 50
  this.width = 20
  this.height = 20
  this.image = new Image()
  this.image.src = img ? img : images.ironhack
  this.image.onload = ()=>this.draw()
  this.active = true

  this.draw = function(){
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
  }
}

// instances
var bg = new Board()
var bar1 = new Obstacle(400,100,300,charSize) //Horizontal Top
var bar2 = new Obstacle(100,400,250,charSize) //Horizontal Bottom
var bar3 = new Obstacle(500,250,charSize,300) //Vertical
var pellet1 = new Pellet(450,50,images.ironhack)
var pellet2 = new Pellet(550,300,images.ironhack)
var pellet3 = new Pellet(200,450,images.ironhack)
var pacman = new Pacman()
var blinky = new Ghost(700,100,images.blinky,1,60,"#d03e19")
var inky = new Ghost(600,200,images.inky,-1,80,"#46bfee")
var pinky = new Ghost(700,300,images.pinky,1,60,"#ea82e5")
var clyde = new Ghost(600,400,images.clyde,-1,80,"#db851c")


//main functions
function start(){
  if(!interval) interval = setInterval(update,1000/60)
  // interval = setInterval(update,1000/60)
}

// aux functions 
// type:
// 1: Horizontal
// 2. Vertical
// 3. Sticker/Pellet
function checkCollision(item,type){
  if (pacman.x < item.x + item.width  && pacman.x + pacman.width  > item.x &&
    pacman.y < item.y + item.height && pacman.y + pacman.height > item.y) {
    // The objects are touching
    // console.log("touching")
    // Which element? Which side?
    if(type === 4){
      // Eliminar y sumar score
      gameOver()
    }
    if(type === 3){
      // Eliminar y sumar score
      item.active = false
      item.x = canvas.width
      item.y = canvas.height
      console.log("Sticker!")
    } else {
      if(pacman.x < item.x){
        pacman.x = pacman.x - charSize
      } else  if(pacman.x < item.x + item.width){
        pacman.x = pacman.x + charSize
      }
      if(type === 1 && pacman.y < item.y){
        pacman.y = pacman.y - charSize
      }
      if(type === 1 && pacman.y > item.y){
        pacman.y = pacman.y + charSize
      }
    }
  }
}

function update(){
  frames++
  ctx.clearRect(0,0,canvas.width,canvas.height)
  bg.draw()
  pacman.draw()
  blinky.draw()
  inky.draw()
  pinky.draw()
  clyde.draw()
  bar1.draw()
  bar2.draw()
  bar3.draw()
  if(pellet1.active) pellet1.draw()
  if(pellet2.active) pellet2.draw()
  if(pellet3.active) pellet3.draw()
  checkCollision(bar1,1)
  checkCollision(bar2,1)
  checkCollision(bar3,2)
  checkCollision(pellet1,3)
  checkCollision(pellet2,3)
  checkCollision(pellet3,3)
  checkCollision(blinky,4)
  checkCollision(inky,4)
  checkCollision(pinky,4)
  checkCollision(clyde,4)
}

function gameOver(){
  clearInterval(interval)
  interval = null
  ctx.fillStyle = "red"
  ctx.font = "bold 80px Arial"
  ctx.fillText("GAME OVER",50,200)
  ctx.fillStyle = "white"
  ctx.font = "bold 40px Arial"
  ctx.fillText("Score: " + Math.floor(frames/60),200,300)
  ctx.fillText("Press 'enter' to restart",50,350)
}

// aux functions
function getRandomPosition(max,min){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//listeners
addEventListener('keyup',function(e){
  switch(e.keyCode){
    case 13:
      return start()
    default:
      return
  }
})

addEventListener('keydown', function(e){
  switch(e.keyCode){
    //Space bar -> stop
    case 32:
      clearInterval(interval)
      interval = null
      break;
    //Enter -> start
    // case 13:
    //   if(!interval) update()
    //   break;
    //ArrowUp
    case 40:
      pacman.y += speed
      break;
    //ArrowDown
    case 38:
      pacman.y -= speed
      break;
    //ArrowLeft
    case 37:
      pacman.x -= speed
      break;
    //ArrowRight
    case 39:
      pacman.x += speed
      // checkCollision()
      break;
  }
})