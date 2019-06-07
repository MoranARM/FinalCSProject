//Pacman controls and ai
class Pacman{
  constructor(){
    this.pos = createVector(13*16+8, 23*16+8); //Starting position of pacman
    this.vel = createVector(-1, 0);//velocity or change where Pacman is headed
    this.goTo = createVector(-1, 0);//When pacman reaches a node, the velocity changes to where he is going with goTo
    this.turn = false;
    this.score = 0;
    this.lives = 2;
    this.level = 1;
    this.gameOver = false;
    this.rad1 = 0;//radian 1
    this.rad2 = 0;//radian 2
    this.chomp = true;//true if mouth is open
    this.dotsEaten = 0;
    this.extraLife = false;
  }
 
  //draws pacman
  show(){
    if(this.vel.x == -1){//left
      this.rad1 = 3.6651914;//210 degrees
      this.rad2 = 8.901179;//510
    }else if(this.vel.x == 1){//right
      this.rad1 = 0.5235988;//30
      this.rad2 = 5.7595863;//330
    }else if(this.vel.y == 1){//down
      this.rad1 = 2.0943952;//120
      this.rad2 = 7.330383;//420
    }else{//up
      this.rad1 = 5.2359877;//300
      this.rad2 = 10.471975;//600
    }fill(255,255,0);
    noStroke();
    if(this.chomp){//used to make pacman open and close his mouth
      arc(this.pos.x, this.pos.y, 20, 20, this.rad1, this.rad2, PIE);
    }else{
      ellipse(this.pos.x, this.pos.y, 20, 20);
    }this.chomp = frameCount%32 == 0 ? false : frameCount%16 == 0 ? true : this.chomp;
  }
  
  //returns true if pacman is hit by a ghost
  hitPacman(ghostPos){//takes in p5.Vector
    return (dist(ghostPos.x, ghostPos.y, this.pos.x, this.pos.y)<10);
  }
  
  //makes pacman lose a life and reset his location if he is hit by a ghost
  kill(){
    this.lives--;
    if(this.lives<0){
      this.gameOver = true;
    }else{
      resetBoard();
    }
  }
  
  //resets the game board after pacman dies or advances to the next level
  resetBoard(){
    //location pacman is reset to
    this.pos = createVector(13*16+8, 23*16+8); 
    //resets all of the ghosts
    blinky = new Blinky();
    clyde = new Clyde();
    pinky = new Pinky();
    inky = new Inky();
    //resets pacmans velocity
    this.vel = createVector(-1, 0);
    this.goTo = createVector(-1,0);
  }
  
  //Fixes the position of Pacman or ghosts if they go past through the tunnel
  specialCase(p){//takes in p5.vector
    p.x = (p.x == 24) ? 424 : (p.x == 424 ? 24 : p.x);//true if the pacman is leaving the tunnel
  }

  //returns true if pacman can move into the next location 
  checkPosition(){
    if((this.pos.x-8)%16 == 0 && (this.pos.y-8)%16 == 0){//checks if pacman is on a critical spot
      let arrPosition = createVector((this.pos.x-8)/16, (this.pos.y-8)/16);//changes location to an array position
      //resets all paths for the ghosts
      blinky.setPath();
      pinky.setPath();
      clyde.setPath();
      inky.setPath();
      //Checks if the position has been eaten or not, blank spaces are considered eaten
      if(!tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten){
        tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten = true;
        //score+=10;//adds points for eating
        //dotsEaten++;
        if(tiles[floor(arrPosition.y)][floor(arrPosition.x)].bigDot){//checks if the big dot is eaten
          //set all ghosts to frightened mode
          blinky.frightened = true;
          blinky.flashCount = 0;
          clyde.frightened = true;
          clyde.flashCount = 0;
          pinky.frightened = true;
          pinky.flashCount = 0;
          inky.frightened = true;
          inky.flashCount = 0;
        }
      }
      //the position in the tiles array that pacman is turning towards
      let positionToCheck = new createVector(arrPosition.x + this.goTo.x, arrPosition.y + this.goTo.y);
      //console.log("Position to Check X: ", positionToCheck.x, " Y: ", positionToCheck.y);
      if(tiles[floor(positionToCheck.y)][floor(positionToCheck.x)].tunnel){//checks if the next position will be in the tunnel
        specialCase(this.pos);
      }if(tiles[floor(positionToCheck.y)][floor(positionToCheck.x)].wall){//checks if the space is not a wall
        return !(tiles[floor(arrPosition.y + this.vel.y)][floor(arrPosition.x + this.vel.x)].wall);//if both are walls then don't move
      }else{//allows pacman to turn
        this.vel = createVector(this.goTo.x, this.goTo.y);
        return true;
      }
    }else{//if pacman is not on a critial spot
      if((this.pos.x+10*this.vel.x-8)%16 == 0 && (this.pos.y+10*this.vel.y-8)%16 == 0){
        let arrPosition = createVector((this.pos.x+10*this.vel.y-8)/16, (this.pos.y+10*this.vel.y)/16);
        if(!tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten){
          tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten = true;
          this.score+=10;
          this.dotsEaten++;
          if(tiles[floor(arrPosition.y)][floor(arrPosition.x)].bigDot){
            this.score+=40;
            //sets all ghosts to frightened mode
            blinky.frightened = true;
            blinky.flashCount = 0;
            pinky.frightened = true;
            pinky.flashCount = 0;
            inky.frightened = true;
            inky.flashCount = 0;
            clyde.frightened = true;
            clyde.flashCount = 0;
          }
        }    
      }
      if(this.goTo.x+this.vel.x == 0 && this.vel.y+this.goTo.y == 0){//if turning change directions entirely, 180 degrees
        this.vel = createVector(this.goTo.x, this.goTo.y);//turn
        return true;
      }return true;//if it is not a critical position then it will continue forward
    }
  } 
  
  //Automatically moves pacman if he is not facing the wall
  move(){
    if(this.checkPosition()){ //checks if pacman is facing a wall
      this.pos.add(this.vel);//moves pacman
    }
  }
}
