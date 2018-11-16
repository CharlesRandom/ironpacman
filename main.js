// canvas
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')

//DOM Manipulation
var header = document.getElementById("h1")

// variables
var interval = null
var frames = 0
var seconds = 2
var speed = 25
var charSize = 35
var player = 1
var countdown = 3
var level = 1
var score = 0
var gameStart = false
var stickers = 3
var timeLimit = 60
var images = {
  pacman0: "images/pacman0.png",
  pacman1: "images/pacman1.png",
  pacman2: "images/pacman2.png",
  pacman3: "images/pacman3.png",
  pacman4: "images/pacman4.png",
  pacman5: "images/pacman5.png",
  mpacman0: "images/mpacman0.png",
  mpacman1: "images/mpacman1.png",
  mpacman2: "images/mpacman2.png",
  mpacman3: "images/mpacman3.png",
  mpacman4: "images/mpacman4.png",
  mpacman5: "images/mpacman5.png",
  mpacman6: "images/mpacman6.png",
  mpacman7: "images/mpacman7.png",
  blinky1: "images/blinky1.png",
  inky1: "images/inky1.png",
  pinky1: "images/pinky1.png",
  clyde1: "images/clyde1.png",
  blinky2: "images/blinky2.png",
  inky2: "images/inky2.png",
  pinky2: "images/pinky2.png",
  clyde2: "images/clyde2.png",
  obstacle_hor: "images/obstacle_hor.png",
  obstacle_ver: "images/obstacle_ver.png",
  ironhack: "images/ironhack.png",
  menu: "images/pacman_menu.png"
}

var audio = {
  start:"audio/PacManOriginalTheme.mp3",
  play: "audio/PacManWakaWaka.mp3",
  gameOver: "audio/PacManGameOver.mp3",
  madworld: "audio/MadWorld.mp3"
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
  this.drawScore = function(){
    ctx.fillStyle = "white"
    ctx.font = "bold 24px Avenir"
    // ctx.fillText("Score: " + Math.floor(frames/60),50,50)
    ctx.fillText("Score: " + score + " pts   Time: " + Math.floor(frames/60) + " sec",50,50)
  }
}

function Menu(){
  this.x = 0
  this.y = 0
  this.width = 860
  this.height = 211
  this.image = new Image()
  this.image.src = images.menu
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
    ctx.fillStyle = "yellow"
    ctx.font = "bold 30px Avenir"
    ctx.fillText("Instructions:",50,280)
    ctx.font = "bold 24px Avenir"
    ctx.fillText("1. After you press enter, you'll have a few seconds to get ready",50,330)
    ctx.fillText("2. Use the arrow keys to move around",50,365)
    ctx.fillText("3. There's a force pushing you to the right, be stronger!",50,400)
    ctx.fillText("4. If you hit the obstacles, you'll bounce back",50,440)
    ctx.fillText("5. Level's completed once you got all the stickers",50,475)
    ctx.fillText("6. If a ghost hits you, you're dead D:",50,510)
  }
}

function Pacman(){
  this.which = true;
  this.x = 200
  this.y = canvas.height/2 - charSize
  this.width = charSize
  this.height = charSize
  this.img1 = new Image();
  this.img1.src = images.mpacman1;
  this.img2 = new Image();
  this.img2.src = images.mpacman0;
  // this.image.onload = ()=>this.draw()

  this.draw = function(){
    // Animation
    var img = this.which ? this.img1 : this.img2;
    this.x+=1
    this.boundaries()
    // ctx.fillStyle = "yellow"
    // ctx.fillRect(this.x,this.y,this.width,this.height)
    ctx.drawImage(img, this.x, this.y,this.width,this.height)
    if(frames % 10 === 0) this.toggleWhich();
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
  this.toggleWhich = function(){
    this.which = !this.which;
  }
}

function Ghost(x,y,img1,img2,dir,long,color,speed){
  this.which = true;
  this.x = x ? x : 600
  this.y = y ? y : 450
  this.dir = dir ? dir : 1
  this.changeDir = 1
  this.goBackwards = 1
  this.long = long ? long : 60
  this.width = charSize
  this.height = charSize
  this.color = color
  this.speed = speed ? speed : 3
  // this.image = new Image()
  // this.image.src = img ? img : images.pacman0

  this.img1 = new Image();
  this.img1.src = img1;
  this.img2 = new Image();
  this.img2.src = img2;
  // this.image.onload = ()=>this.draw()

  this.draw = function(){
    // Animation
    var img = this.which ? this.img1 : this.img2;
    // ZigZag movement
    if(Math.floor(frames/this.long) % 2 === 0){
      this.changeDir = -1
    }
    else {
      this.changeDir = 1
    }
    // Return when reach canvas limit
    if(this.x < 10){
      this.goBackwards = -1
    }
    if(this.x + this.width > canvas.width-10){
      this.goBackwards = 1
    }
    this.y -= this.changeDir * this.dir * this.speed
    this.x -= this.goBackwards * this.speed
    // ctx.fillStyle = this.color
    // ctx.fillRect(this.x,this.y,this.width,this.height)
    ctx.drawImage(img, this.x, this.y,this.width,this.height)
    if(frames % 10 === 0) this.toggleWhich();
  }
  this.toggleWhich = function(){
    this.which = !this.which;
  }
}

function Obstacle(x,y,width,height){
  this.x = x ? x : 300
  this.y = y ? y : 100
  this.width = width ? width : 250
  this.height = height ? height : 60

  this.draw = function(){
    // ctx.strokeStyle = "blue"
    // ctx.lineWidth = 5
    // ctx.strokeRect(this.x,this.y,this.width,this.height)
    ctx.fillStyle = "blue"
    ctx.fillRect(this.x,this.y,this.width,this.height)
    ctx.fillStyle = "black"
    ctx.fillRect(this.x+5,this.y+5,this.width-10,this.height-10)
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
  this.points = 30

  this.draw = function(){
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
  }
}

// instances
var bg = new Board()
var bgSound = new Audio()
var menu = new Menu()
var bar1 = new Obstacle(canvas.width,canvas.height,300,charSize) //Horizontal Top
var bar2 = new Obstacle(canvas.width,canvas.height,250,charSize) //Horizontal Bottom
var bar3 = new Obstacle(canvas.width,canvas.height,charSize,300) //Vertical
var pellet1 = new Pellet(canvas.width,canvas.height,images.ironhack)
var pellet2 = new Pellet(canvas.width,canvas.height,images.ironhack)
var pellet3 = new Pellet(canvas.width,canvas.height,images.ironhack)
var pacman = new Pacman()
var blinky = new Ghost(700,100,images.blinky1,images.blinky2,1,60,"#d03e19")
var inky = new Ghost(700,200,images.inky2,images.inky1,-1,120,"#46bfee")
var pinky = new Ghost(700,300,images.pinky1,images.pinky2,1,60,"#ea82e5")
var clyde = new Ghost(700,400,images.clyde2,images.clyde1,-1,120,"#db851c")


//main functions
function start(){
  h1.innerHTML = "Player " + player
  levelSettings(level)
  if(!interval) interval = setInterval(update,1000/60)
  // interval = setInterval(update,1000/60)
}

function update(){
  frames++
  if(Math.floor(frames/60) > seconds-1 && seconds > 0) {
    bgSound.pause()
    bgSound = new Audio()
    bgSound.src = audio.play
    bgSound.play()
    bgSound.loop = true
    seconds = 0
  }
  ctx.clearRect(0,0,canvas.width,canvas.height)
  bg.draw()
  bg.drawScore()
  pacman.draw()
  bar1.draw()
  bar2.draw()
  bar3.draw()
  if(pellet1.active) pellet1.draw()
  if(pellet2.active) pellet2.draw()
  if(pellet3.active) pellet3.draw()
  blinky.draw()
  inky.draw()
  pinky.draw()
  clyde.draw()
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
  if(checkLevelComplete()) {
    // score += timeLimit - Math.floor(frames/60)
    setTimeout(levelComplete,200)
  }
}

function gameOver(){
  // score += timeLimit - Math.floor(frames/60)
  bgSound.pause()
  gameStart = false
  clearInterval(interval)
  interval = null
  ctx.fillStyle = "rgba(15,15,15,0.7)"
  ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = "red"
  ctx.font = "bold 80px Arial"
  ctx.fillText("GAME OVER",50,220)
  ctx.fillStyle = "white"
  ctx.font = "bold 40px Arial"
  ctx.fillText("Final Score: " + score + " pts   Time: " + Math.floor(frames/60) + " sec",120,360)
  if(player === 1){
    bgSound.pause()
    bgSound = new Audio()
    bgSound.src = audio.gameOver
    bgSound.play()
    ctx.fillText("Next player get ready",50,500)
    player = 2
    setTimeout(nextPlayer,3000)
  } else {
    player = 1
    ctx.fillText("Press 'enter' to restart",50,500)
    playCredits()
  }
}

function levelComplete(){
  clearInterval(interval)
  interval = null
  bgSound.pause()
  ctx.fillStyle = "yellow"
  ctx.font = "bold 80px Arial"
  ctx.fillText("Level " + level + " Completed!",50,220)
  ctx.fillStyle = "white"
  ctx.font = "bold 40px Arial"
  ctx.fillText("Final Score: " + score + " pts   Time: " + Math.floor(frames/60) + " sec",120,360)
  bgSound = new Audio()
  if(player === 1){
    // bgSound = new Audio()
    // bgSound.src = audio.gameOver
    // bgSound.play()
    // ctx.fillText("Next player get ready",50,500)
    player = 2
    setTimeout(nextPlayer,3000)
  } else {
    bgSound.pause()
    bgSound = new Audio()
    bgSound.src = audio.start
    bgSound.play()
  }
}

// aux functions
function getRandomPosition(max,min){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
      // Calculate Score. If player 1, set game for player 2
      gameOver()
    }
    if(type === 3){
      // Eliminar y sumar score
      item.x = canvas.width
      item.y = canvas.height
      pacman.draw()
      item.draw()
      item.active = false
      score += item.points
      stickers--
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

function checkLevelComplete(){
  return stickers === 0
}

function levelSettings(level){
  gameStart = true
  switch(level){
    case 1:
      // start()
      if(player === 1){
        pacman.img1.src = images.pacman0
        pacman.img2.src = images.pacman1
      } else {
        pacman.img1.src = images.mpacman0
        pacman.img2.src = images.mpacman1
      }
      bar1.x = 400
      bar1.y = 100
      bar2.x = 100
      bar2.y = 400
      bar3.x = 500
      bar3.y = 250
      pellet1.x = 450
      pellet1.y = 50
      pellet2.x = 550
      pellet2.y = 300
      pellet3.x = 200
      pellet3.y = 450
      pellet1.active = true
      pellet2.active = true
      pellet3.active = true
      stickers = 3
      score = 0
      frames = 0
      blinky.x = 700
      blinky.y = 100
      inky.x = 600
      inky.y = 200
      pinky.x = 700
      pinky.y = 300
      clyde.x = 600
      clyde.y = 400
      pacman.x = 200
      pacman.y = canvas.height/2 - charSize
      break;
    default:
      nextPlayer()
      break;
  }
}

function nextPlayer(){
  h1.innerHTML = "Player " + player
  clearInterval(interval)
  interval = null
  bgSound.pause()
  bgSound = new Audio()
  bgSound.src = audio.start
  bgSound.play()
  seconds = 2
  score = 0
  frames = 0
  interval = setInterval(function(){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "yellow"
    ctx.font = "bold 80px Arial"
    ctx.fillText("Player " + player + " Ready in",50,220)
    ctx.font = "bold 140px Arial"
    ctx.fillText(countdown + "!",350,450)
    countdown--
    if(countdown === 0){
      clearInterval(interval)
      interval = null
      countdown = 3
      setTimeout(start,500)
    }
  },1000)
  // setTimeout(start,5000)
}

function playCredits(){
  bgSound.pause()
  bgSound = new Audio()
  bgSound.src = audio.madworld
  bgSound.play()
}

//listeners
addEventListener('keyup',function(e){
  switch(e.keyCode){
    case 13:
      if(!gameStart){
        gameStart = true
        return nextPlayer()
      }
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
    case 38:
      pacman.y -= speed
      if (player === 1){
        pacman.img1.src = images.pacman4
        pacman.img2.src = images.pacman0
      } else {
        pacman.img1.src = images.mpacman4
        pacman.img2.src = images.mpacman5
      }
      break;
    //ArrowDown
    case 40:
      pacman.y += speed
      if (player === 1){
        pacman.img1.src = images.pacman5
        pacman.img2.src = images.pacman0
      } else {
        pacman.img1.src = images.mpacman6
        pacman.img2.src = images.mpacman7
      }
      break;
    //ArrowLeft
    case 37:
      pacman.x -= speed
      if (player === 1){
        pacman.img1.src = images.pacman3
        pacman.img2.src = images.pacman0
      } else {
        pacman.img1.src = images.mpacman2
        pacman.img2.src = images.mpacman3
      }
      break;
    //ArrowRight
    case 39:
      pacman.x += speed
      if (player === 1){
        pacman.img1.src = images.pacman1
        pacman.img2.src = images.pacman0
      } else {
        pacman.img1.src = images.mpacman0
        pacman.img2.src = images.mpacman1
      }
      break;
  }
})