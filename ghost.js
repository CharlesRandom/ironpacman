function Ghost(x,y,img,dir,long){
  this.x = x ? x : 600
  this.y = y ? y : 450
  this.dir = dir ? dir : 1
  this.changeDir = 1
  this.goBackwards = 1
  this.long = long ? long : 60
  this.width = charSize
  this.height = charSize
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
    ctx.drawImage(this.image, this.x, this.y,this.width,this.height)
  }
}