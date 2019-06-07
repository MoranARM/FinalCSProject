class Ghost{
  constructor(){
    this.gpos = createVector(13*16+8, 11*16+8);//starting position of the ghost
    this.gvel = createVector(1, 0);
    this.mainPath = new Path();//stores the path the ghost will follow
    this.ghostNodes = [];//nodes with the path including gpos and the goal position
    this.start;//ghost pos as a node
    this.end;//ghost goal as a node
    this.rgb;//color of the ghost (r, g, b)
    this.eyeC;//color of ghost eyes
    this.chase = true;//true when ghost is in chase mode, false when in scatter mode
    this.frightened = false;//true when ghost is in frightened mode
    this.flashCount = 0;//used to make the ghost flash when freightened
    this.chaseCount = 0;//counter to switch between chase and scatter
    this.goHome = false;//if ghost is eaten return home
    this.tempDead = false;//after ghost is eaten it is invisible for a bit
    this.deadCount = 0;
    this.scatx = 0;
    this.scaty = 0;
    this.showBody = true;//false when ghost is eaten by pacman
    this.pink = false;
    this.ink = false;
    this.clyd = false;
    this.release = false;
  }
  
  //shows the eyes based on the direction the ghost is heading
  showEyes(){
    noStroke();
    fill(255);
    if(this.gvel.y == -1){//look up
      ellipse(this.gpos.x-4, this.gpos.y-3, 6, 8);
      ellipse(this.gpos.x+4, this.gpos.y-3, 6, 8);
      fill(0, 0, 200);
      ellipse(this.gpos.x-4, this.gpos.y-5, 4, 4);
      ellipse(this.gpos.x+4, this.gpos.y-5, 4, 4);
    }else if(this.gvel.y == 1){//look down
      ellipse(this.gpos.x-4, this.gpos.y-1, 6, 8);
      ellipse(this.gpos.x+4, this.gpos.y-1, 6, 8);
      fill(0, 0, 200);
      ellipse(this.gpos.x-4, this.gpos.y+1, 4, 4);
      ellipse(this.gpos.x+4, this.gpos.y+1, 4, 4);
    }else if(this.gvel.x == -1){//look left
      ellipse(this.gpos.x-6, this.gpos.y-1, 6, 8);
      ellipse(this.gpos.x+2, this.gpos.y-1, 6, 8);
      fill(0, 0, 200);
      ellipse(this.gpos.x-8, this.gpos.y-1, 4, 4);
      ellipse(this.gpos.x, this.gpos.y-1, 4, 4);
    }else if(this.gvel.x == 1){//look right
      ellipse(this.gpos.x-2, this.gpos.y-1, 6, 8);
      ellipse(this.gpos.x+6, this.gpos.y-1, 6, 8);
      fill(0, 0, 200);
      ellipse(this.gpos.x, this.gpos.y-1, 4, 4);
      ellipse(this.gpos.x+8, this.gpos.y-1, 4, 4);
    }else{
      ellipse(this.gpos.x-4, this.gpos.y-1, 6, 8);
      ellipse(this.gpos.x+4, this.gpos.y-1, 6, 8);
    }
  }
  
  show(){
    //counts switch between chase and scatter
    this.chaseCount++;
    if(this.chase){
      if(this.chaseCount>2000){
        this.chase = false;
        this.chaseCount = 0;
      }
    }else{
      if(this.chaseCount>700){
        this.chase = true;
        this.chaseCount = 0;
      }
    }
    if(this.tempDead){
      this.deadCount++;
      if(this.deadCount>300){
        this.tempDead = false;
      }
    }else{//if not temp Dead then show the ghost
      if(!this.frightened){
        if(!this.goHome){//have the ghost be only eyes heading home
          fill(this.rgb);
        }if(showAllPath){
          this.mainPath.pathCol = this.rgb;
          this.mainPath.show();//shows the path the ghost is following
        }
      }else{//if it is frightened
        this.flashCount++;
        if(this.flashCount>800){//after 8 seconds the ghosts are no longer frightened
          this.frightened = false;
          this.flashCount = 0;
        }fill(0, 0, 200);
      }noStroke();
      if(!this.goHome){
        ellipse(this.gpos.x, this.gpos.y, 20, 20);
        rect(this.gpos.x-10, this.gpos.y, 20, 10);
      }this.showEyes();
    }
  }
  
  //moves the ghost
  move(){
    if(!this.tempDead){//do not move if dead
      this.gpos.add(this.gvel);
      this.checkDirection();//check if direction will change next move
    }
  }
  
  //finds a path from the start to end of ghostnodes and sets it as the mainPath
  setPath(){
    let output = "Ghost Nodes";
    fill(0, 255, 0);
    for(let i=0; i<this.ghostNodes.length; i++){
      output+=", ("+this.ghostNodes[i].x+", "+this.ghostNodes[i].y+")";
      ellipse(this.ghostNodes[i].x*16+8, this.ghostNodes[i].y*16+8, 10, 10);
    }console.log(output);
    this.setNodes();
    let start = this.ghostNodes[0];
    let end = this.ghostNodes[this.ghostNodes.length-1];
    //console.log("start: ", start, " end: ", end, " gvel: x:", this.gvel.x, " y: ", this.gvel.y);
    let temp = AStar(start, end, this.gvel);
    //console.log("Temp path: ", temp);
    if(temp!=null){//if the path is found then do not change mainPath
      this.mainPath = temp.clone();
    }
  }
  
  //sets all of the nodes and connects them to the other nodes nearby, and sets target node
  setNodes(){
    this.ghostNodes = [];
    this.ghostNodes[0] = new PathNode((this.gpos.x-8)/16, (this.gpos.y-8)/16);//add the current position as a node
    for(let i=1; i<27; i++){
      for(let j=1; j<30; j++){
        if(!originalTiles[j][i].wall){//if there is a space up or down and left or right then it is a node
          if(!originalTiles[j-1][i].wall || !originalTiles[j+1][i].wall){//check up or down
            if(!originalTiles[j][i-1].wall || !originalTiles[j][i+1].wall){//check left or right
              this.ghostNodes[this.ghostNodes.length] = new PathNode(i, j);//add the nodes
            }
          }
        }
      }
    }
    if(this.goHome){//if retruning home then the target is above the ghost spawn
    console.log("YOU LIARRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
      this.ghostNodes[this.ghostNodes.length] = new PathNode(13, 11);
    }else{
      if(this.chase){
        if(this.clyd){//true if ghost is orange
          if(dist((this.gpos.x-8)/16, (this.gpos.y-8)/16, (pacman.pos.x-8)/16, (pacman.pos.y-8)/16)>8){
            this.ghostNodes[this.ghostNodes.length] = new PathNode((pacman.pos.x-8)/16, (pacman.pos.y-8)/16);//go after pacman
          }else{
            this.ghostNodes[this.ghostNodes.length] = new PathNode(this.scatx, this.scaty);//run away from pacman
          }
        }else if(this.pink){//true if ghost is pink
          let lookPast = 4;//pinky targets 4 spaces in front of pacman
          let pacArrPos = createVector((pacman.pos.x-8)/16+(pacman.vel.x*lookPast), (pacman.pos.y-8)/16+(pacman.vel.y*lookPast));
          //console.log("PacArrPos",pacArrPos);
          while(pacArrPos.x<=0 || pacArrPos.y<=0 || pacArrPos.x>=28 || pacArrPos.y>=31 || originalTiles[floor(pacArrPos.y)][floor(pacArrPos.x)].wall){
            lookPast-=1;
            pacArrPos = createVector((pacman.pos.x-8)/16+(pacman.vel.x*lookPast), (pacman.pos.y-8)/16+(pacman.vel.y*lookPast));
          }this.ghostNodes[this.ghostNodes.length] = (dist((this.gpos.x-8)/16, (this.gpos.y-8)/16, pacArrPos.x, pacArrPos.y)<1) ? new PathNode((pacman.pos.x-8)/16, (pacman.pos.y-8)/16) : new PathNode(pacArrPos.x, pacArrPos.y);
          //*******************Not finding a path sometimes due to when blinky is sometimes dead??******************
        }else if(this.ink){//true if ghost is blue
          let pacPos = createVector((pacman.pos.x-8)/16, (pacman.pos.y-8)/16);
          let blinkPos = createVector((blinky.gpos.x-8)/16, (blinky.gpos.y-8)/16);
          let blinkToPac = createVector(pacPos.x-blinkPos.x, pacPos.y-blinkPos.y);
          let goal = createVector(pacPos.x+blinkToPac.x, pacPos.y+blinkToPac.y);
          let closestTile = getClosestNonWallTile(goal);
          this.ghostNodes[this.ghostNodes.length] = (dist((this.gpos.x-8)/16, (this.gpos.y-8)/16, closestTile.x, closestTile.y)<1) ? new PathNode((pacman.pos.x-8)/16, (pacman.pos.y-8)/16) : new PathNode(closestTile.x, closestTile.y);
        }else{//target pacman, what Blinky uses
          this.ghostNodes[this.ghostNodes.length] = new PathNode((pacman.pos.x-8)/16, (pacman.pos.y-8)/16);
        }
      }else{
        this.ghostNodes[this.ghostNodes.length] = new PathNode(this.scatx, this.scaty);//scatter to corner
      }
    }for(let i=0; i<this.ghostNodes.length; i++){//connect nodes together
      this.ghostNodes[i].addEdges(this.ghostNodes);
    }
  }
  
  //check if the ghost needs to change direction or return home
  checkDirection(){
    if(pacman.hitPacman(this.gpos)){//if pacman gets hit
      if(this.frightened){//eaten by pacman
        this.goHome = true;
        this.frightened = false;
        pacman.score+=200;
      }else if(!this.goHome){//kill pacman
        pacman.kill();
      }
    }if(this.goHome){//check if reached home
      if(dist((this.gpos.x-8)/16, (this.gpos.y-8)/16, 13, 11)<1){//set tempDead to true
        this.goHome = false;
        this.tempDead = true;
        this.deadCount = 0;
      }
    }if((this.gpos.x-8)%16 == 0 && (this.gpos.y-8)%16 == 0){//if on a critical position
      let arrPos = createVector((this.gpos.x-8)/16, (this.gpos.y-8)/16);//convert to array position
      //console.log("Ghost: Pink:", this.pink, " arrPos X:", 0arrPos.x, " Y: ",arrPos.y);
      //let tempVel = createVector(gvel.x/2, gvel.y/2);//can be used to slow ghosts down in the tunnel
      if(originalTiles[floor(arrPos.y)][floor(arrPos.x)].tunnel){//checks if the next position will be in the tunnel
        pacman.specialCase(this.gpos);
        //gvel = createVector(tempVel.x, tempVel.y);//half the speed exponentially
      }if(this.frightened){//no path will be made if frightened
        let isNode = false;
        for(let j=0; j<this.ghostNodes.length; j++){
          if(arrPos.x == this.ghostNodes[j].x && arrPos.y == this.ghostNodes[j].y){
            isNode = true;
          }
        }if(isNode){//if on a node set a random direction
          let newVel = createVector();
          let rand = floor(random(4));
          switch(rand){
          case 0:
            newVel = createVector(1, 0);
            break;
          case 1:
            newVel = createVector(-1, 0);
            break;
          case 2:
            newVel = createVector(0, 1);
            break;
          case 3:
            newVel = createVector(0, -1);
            break;
          }//if the random vel chosen is to a wall or opposite direction then choose another
          while(originalTiles[floor(arrPos.y+newVel.y)][floor(arrPos.x+newVel.x)].wall || (newVel.x+2*this.gvel.x == 0 && newVel.y+2*this.gvel.y == 0)){
            this.rand = floor(random(4));
            switch(this.rand){
            case 0:
              this.newVel = createVector(1, 0);
              break;
            case 1:
              this.newVel = createVector(-1, 0);
              break;
            case 2:
              this.newVel = createVector(0, 1);
              break;
            case 3:
              this.newVel = createVector(0, -1);
              break;
            }
          }this.gvel = createVector(newVel.x/2, newVel.y/2);//half the speed
        }
      }else{//not frightened
        this.setPath();
        if(this.mainPath)
          for(let i=0; i<this.mainPath.path.length-1; i++){//if on a node turn to the next node in the path
            if(arrPos.x == this.mainPath.path.getAt(i).x && arrPos.y == this.mainPath.path.getAt(i).y){
              this.gvel = createVector(this.mainPath.path.getAt(i+1).x-arrPos.x, this.mainPath.path.getAt(i+1).y-arrPos.y);
              this.gvel.limit(1);
              return;
            }
          }
      }
    }
  }
}
