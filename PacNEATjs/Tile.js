class Tile{
  //constructor
  constructor(x, y){
    this.pos = createVector(x, y);
    this.wall = false;
    this.dot = false;
    this.bigDot = false;
    this.eaten = false;
    this.tunnel = false;
  }
  
  //draw a dot if tile has a dot and eaten is false
  show(){
    if(this.dot){
      if(!this.eaten){//draw dot if not eaten
        fill(255, 255, 0);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 3, 3);
      }
    }else if(this.bigDot){
      if(!this.eaten){
        fill(255, 255, 0);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 6, 6);
      }
    }
  }
  
  clone(){
    let clone = new Tile(this.pos.x, this.pos.y);
    clone.wall = this.wall;
    clone.dot = this.dot;
    clone.bigDot = this.bigDot;
    clone.eaten = this.eaten;
    clone.tunnel = this.tunnel;
    return clone;
  }
}
