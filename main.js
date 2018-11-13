// canvas
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')

// variables
var interval = null
var frames = 0
var images = {
  pacman0: "images/Pacman/sprite_pacman0.png",
  pacman1: "images/Pacman/sprite_pacman1.png",
  pacman2: "images/Pacman/sprite_pacman2.png"
}

// classes
function Board(){
  this.x = 0
  this.y = 0
  this.width = canvas.width
  this.height = canvas.height

  this.draw = function(){
    ctx.fillRect(0,0,canvas.width,canvas.height)
  }
}

function Pacman(){
  this.x = 100
  this.y = 250
  this.width = 100
  this.height = 100
  this.image = new Image()
  this.image.src = images.pacman1
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    this.x+=1
    this.boundaries()
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
  }

  this.boundaries = function(){
    if(this.y+this.height > canvas.height-10){
      this.y = canvas.height - this.height
    } 
    if(this.y < 10){
      this.y = 10
    }
    if(this.x < 10){
      this.x = 10
    }
    if(this.x + this.width > canvas.width-10){
      this.x = canvas.width - this.width
    }
  }
}

function Ghost(x,y,dir,long){
  this.x = x ? x : 600
  this.y = y ? y : 450
  this.dir = dir ? dir : 1
  this.changeDir = 1
  this.long = long ? long : 60
  this.width = 100
  this.height = 100
  this.image = new Image()
  this.image.src = images.pacman0
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    // ZigZag movement
    if(Math.floor(frames/this.long) % 2 === 0){
      this.changeDir = -1
    }
    else {
      this.changeDir = 1
    }
    this.y -= this.changeDir * this.dir * 2
    this.x -= 2
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
  }
}

function Obstacle(x,y,width,height){
  this.x = x ? x : 300
  this.y = y ? y : 100
  this.width = width ? width : 250
  this.height = height ? height : 60

  this.draw = function(){
    ctx.strokeStyle = "blue"
    ctx.lineWidth = 10
    ctx.strokeRect(this.x,this.y,this.width,this.height)
  }
}

// instances
var bg = new Board()
var bar1 = new Obstacle(400,100,250,60) //Horizontal Top
var bar2 = new Obstacle(100,400,250,60) //Horizontal Bottom
var bar3 = new Obstacle(500,250,60,250) //Vertical
var pacman = new Pacman()
var blinky = new Ghost(700,getRandomPosition(300,200),1,30)
var pinky = new Ghost(700,getRandomPosition(200,100),-1,getRandomPosition(120,60))
// var ghost3 = new Ghost(getRandomPosition(700,600),getRandomPosition(200,100),1,getRandomPosition(120,60))
// var ghost4 = new Ghost(getRandomPosition(700,600),getRandomPosition(100,0),-1,getRandomPosition(120,30))

//main functions
function start(){
  if(!interval) interval = setInterval(update,1000/60)
  // interval = setInterval(update,1000/60)
}

function update(){
  frames++
  ctx.clearRect(0,0,canvas.width,canvas.height)
  bg.draw()
  pacman.draw()
  blinky.draw()
  pinky.draw()
  bar1.draw()
  bar2.draw()
  bar3.draw()
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
      pacman.y += 20
      break;
    //ArrowDown
    case 38:
      pacman.y -= 20
      break;
    //ArrowLeft
    case 37:
      pacman.x -= 20
      break;
    //ArrowRight
    case 39:
      pacman.x += 20
      break;
  }
})