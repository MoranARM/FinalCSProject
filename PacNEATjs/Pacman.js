//Pacman controls and ai
class Pacman{
  constructor(){
    //this.pos = createVector(13*16+8, 23*16+8); //Starting position of pacman
    this.pos = createVector(13, 28);
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
    this.lifespan;//int
    this.ttl = 100;//int, time left to live without eating another dot
    this.stopTimer = 0;//how long the player has been stopped for
    this.replay = false;
    this.livesLost = 0;//int
    this.tiles = [];//[31][28] of Tiles
    for(let j=0; j<31; j++){
      this.tiles[j] = [];
      for(let i=0; i<28; i++){
        this.tiles[j][i] = originalTiles[j][i].clone();
      }
    }this.blinky = new Blinky(this);
    this.inky = new Inky(this);
    this.pinky = new Pinky(this);
    this.clyde = new Clyde(this);
  }
  
  setGhosts(b, p, i, c){//takes in Blinky, Pinky, Inky, and Clyde, sets pointers for all the ghosts
    this.blinky = b;
    this.inky = i;
    this.pinky = p;
    this.clyde = c;
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
    return (dist(ghostPos.x, ghostPos.y, this.pos.x, this.pos.y)<10);//change to <25 for 1080p
  }
  
  //makes pacman lose a life and reset his location if he is hit by a ghost
  kill(){
    this.lives--;
    this.livesLost++;
    if(this.lives<0){
      this.gameOver = true;
    }else{
      this.resetBoard();
    }
  }
  
  //resets the game board after pacman dies or advances to the next level
  resetBoard(){
    //location pacman is reset to
    this.pos = createVector(13*16+8, 23*16+8); 
    //resets all of the ghosts
    this.blinky = new Blinky();
    this.clyde = new Clyde();
    this.pinky = new Pinky();
    this.inky = new Inky();
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
    if(isCriticalPosition(this.pos)){
    //if((this.pos.x-8)%16 == 0 && (this.pos.y-8)%16 == 0){//checks if pacman is on a critical spot
      //let arrPosition = createVector((this.pos.x-8)/16, (this.pos.y-8)/16);//changes location to an array position
      let arrPosition = pixelToTile(this.pos);
      //resets all paths for the ghosts
      //this.blinky.setPath();
      //this.pinky.setPath();
      //this.clyde.setPath();
      //this.inky.setPath();
      //Checks if the position has been eaten or not, blank spaces are considered eaten
      if(!this.tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten){
        this.tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten = true;
        //score+=10;//adds points for eating
        this.score+=1;
        this.dotsEaten++;
        this.ttl = 600;
        if(this.tiles[floor(arrPosition.y)][floor(arrPosition.x)].bigDot){//checks if the big dot is eaten
          //set all ghosts to frightened mode
          if(!this.blinky.goHome && !this.blinky.tempDead){
            this.blinky.frightened = true;
            this.blinky.flashCount = 0;
          }if(!this.clyde.goHome && !this.clyde.tempDead){
            this.clyde.frightened = true;
            this.clyde.flashCount = 0;
          }if(!this.pinky.goHome && !this.pinky.tempDead){
            this.pinky.frightened = true;
            this.pinky.flashCount = 0;
          }if(!this.inky.goHome && !this.inky.tempDead){
            this.inky.frightened = true;
            this.inky.flashCount = 0;
          }
        }
      }
      //the position in the tiles array that pacman is turning towards
      let positionToCheck = new createVector(arrPosition.x + this.goTo.x, arrPosition.y + this.goTo.y);
      //console.log("Position to Check X: ", positionToCheck.x, " Y: ", positionToCheck.y);
      if(this.tiles[floor(positionToCheck.y)][floor(positionToCheck.x)].tunnel){//checks if the next position will be in the tunnel
        this.specialCase(this.pos);
      }if(this.tiles[floor(positionToCheck.y)][floor(positionToCheck.x)].wall){//checks if the space is not a wall
        if(tiles[floor(arrPosition.y + vel.y)][floor(arrPosition.x + vel.x)].wall){
          this.vel = createVector(this.goTo.x, this.goTo.y);//Not sure about this line...
          return false;
        }else{//moving ahead is free
          return true;
        }//return !(this.tiles[floor(arrPosition.y + this.vel.y)][floor(arrPosition.x + this.vel.x)].wall);//if both are walls then don't move
      }else{//allows pacman to turn
        this.vel = createVector(this.goTo.x, this.goTo.y);
        return true;
      }
    }else{//if pacman is not on a critial spot
      let ahead = createVector(this.pos.x+10*this.vel.x, this.pos.y+10*this.vel.y);
      //if((this.pos.x+10*this.vel.x-8)%16 == 0 && (this.pos.y+10*this.vel.y-8)%16 == 0){
      if(isCriticalPosition(ahead)){
        //let arrPosition = createVector((this.pos.x+10*this.vel.y-8)/16, (this.pos.y+10*this.vel.y)/16);
        let arrPostion = pixelToTile(ahead);//convert to an array position
        if(!this.tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten){
          this.tiles[floor(arrPosition.y)][floor(arrPosition.x)].eaten = true;//eat the dot
          this.score+=1;//10
          this.dotsEaten++;
          ttl = 600;
          if(this.tiles[floor(arrPosition.y)][floor(arrPosition.x)].bigDot && bigDotsActive){
            //this.score+=40;//could be used to give a better reward for getting the big dots
            //sets all ghosts to frightened mode
            if(!this.blinky.goHome && !this.blinky.tempDead){
              this.blinky.frightened = true;
              this.blinky.flashCount = 0;
            }if(!this.clyde.goHome && !this.clyde.tempDead){
              this.clyde.frightened = true;
              this.clyde.flashCount = 0;
            }if(!this.pinky.goHome && !this.pinky.tempDead){
              this.pinky.frightened = true;
              this.pinky.flashCount = 0;
            }if(!this.inky.goHome && !this.inky.tempDead){
              this.inky.frightened = true;
              this.inky.flashCount = 0;
            }
          }
        }    
      }if(this.goTo.x+this.vel.x == 0 && this.vel.y+this.goTo.y == 0){//if turning change directions entirely, 180 degrees
        this.vel = createVector(this.goTo.x, this.goTo.y);//turn
        return true;
      }return true;//if it is not a critical position then it will continue forward
    }
  } 
  
  //Automatically moves pacman if he is not facing the wall
  move(){
    if(!clydeActive){
      this.ttl--;
      if(this.ttl<=0){
        this.kill();
      }
    }if(this.checkPosition()&&this.vel.mag()!=0){//checks if pacman is facing a wall
      this.stopTimer = 0;
      this.pos.add(this.vel);
      //this.pos.add(this.vel);//repeat it for each time it has been upscaled, 2x for 1080p
    }else{
      this.stopTimer++;
      if(this.stopTimer>100){
        this.kill();
      }
    }this.lifespan++;
  }
}
