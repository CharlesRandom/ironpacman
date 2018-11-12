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

function Character(){
  this.x = 100
  this.y = 250
  this.width = 100
  this.height = 100
  this.image = new Image()
  this.image.src = images.pacman1
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    this.x+=1
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
  }
}

function Pacman(){
  Character.call(this)
  this.draw = function(){
    this.boundaries()
    this.x+=1
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

// instances
var bg = new Board()
var pacman = new Pacman()

//main functions
function start(){
  if(!interval) interval = setInterval(update,1000/60)
  // setInterval(update,1000/60)
}

function update(){
  frames++
  ctx.clearRect(0,0,canvas.width,canvas.height)
  bg.draw()
  pacman.draw()
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
      pacman.y += 30
      break;
    //ArrowDown
    case 38:
      pacman.y -= 30
      break;
    //ArrowLeft
    case 37:
      pacman.x -= 30
      break;
    //ArrowRight
    case 39:
      pacman.x += 30
      break;
  }
})