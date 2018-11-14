function Pacman(){
  this.x = 468
  this.y = 250
  this.width = charSize
  this.height = charSize
  this.image = new Image()
  this.image.src = images.pacman1
  this.image.onload = ()=>this.draw()

  this.draw = function(){
    // this.x+=1
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