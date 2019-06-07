class Player{
  constructor(){
    this.pacman = new Pacman();//Pacman
    this.fitness;//float
    this.brain = new Genome(13, 4);//Genome
    this.vision = [];//[8] of floats, the input array fed into the neuralNet
    this.vision.length = 8;
    this.decision = [];//[4] of floats, the out put of the NN 
    this.decision.length = 4;
    this.unadjustedFitness;//float
    this.lifespan = 0;//int, how long the player lived for fitness
    this.bestScore =0;//int, stores the score achieved used for replay
    this.dead;//boolean
    this.score;//int
    this.gen = 0;
    this.stage =1; //used for gen shit
  }

  show(){
    for(let i=0; i<28; i++){
      for(let j=0; j<31; j++){
        this.pacman.tiles[j][i].show();
      }
    }this.pacman.blinky.show();
    this.pacman.inky.show();
    this.pacman.pinky.show();
    this.pacman.clyde.show();
    this.pacman.show();
  }
  
  move(){
    this.pacman.move();
    this.pacman.blinky.move();
    this.pacman.inky.move();
    this.pacman.pinky.move();
    this.pacman.clyde.move();
  }
  
  checkGameState(){
    if(this.pacman.gameOver){
      this.dead = true;
    }this.score = this.pacman.score;
  }
  
  update(){
    this.move();
    this.checkGameState();
  }
  
  look(){//checks the danger of going in a direction
    if(this.isCriticalPosition(this.pacman.pos)){
      this.vision = [];//[13] floats
      this.vision.length = 13;
      this.distanceToGhostInDirection();
      this.setDistanceToWalls();
      this.vision[this.vision.length-1] = (this.pacman.blinky.frightened)? 1 : 0;
    }
  }
  
  distanceToGhostInDirection(){//sets the inputs for vision in each direction for the ghosts
    this.pacman.blinky.setNodes();//using blinky's nodes
    let allNodes = this.pacman.blinky.ghostNodes.clone();//[] of PathNode
    let pacmanNode = allNodes[allNodes.length-1];//PathNode
    if(!this.pacman.blinky.active){
      allNodes.shift();//removes the first, opposite of pop()
    }else{
      allNodes[0].isGhost = true;
    }if(this.pacman.clyde.active){
      let clydePos = pixelToTile(this.pacman.clyde.gpos);//Vector
      allNodes.push(new PathNode(getClosestNonWallTile(createVector(clydePos.x, clydePos.y)), true));
    }if(this.pacman.inky.active){
      let inkyPos = pixelToTile(this.pacman.inky.gpos);//Vector
      allNodes.push(new PathNode(getClosestNonWallTile(createVector(inkyPos.x, inkyPos.y)), true));
    }if(this.pacman.pinky.active){
      let pinkyPos = pixelToTile(pacman.pinky.gpos);//Vector
      allNodes.push(new PathNode(getClosestNonWallTile(createVector(pinkyPos.x, pinkyPos.y)), true));
    }for(let i=0; i<allNodes.length; i++){//connect all nodes together
      allNodes[i].addEdges(allNodes);
    }let directions = [];//[4] of Vectors
    for(let i=0; i<4; i++){
      directions[i] = createVector(this.pacman.vel.x, this.pacman.vel.y);
      directions[i].rotate(Math.PI/2*i);
      directions[i].x = round(directions[i].x);
      directions[i].y = round(directions[i].y);
    }let visionIndex = -1;//int
    for(let dir of directions){//for each Vector in direction
      visionIndex++;
      let distance = 0;//float
      let temp = pacmanNode;//PathNode
      let previousNode = pacmanNode;
      let wrongWay = createVector(-dir.x, -dir.y);//Vector
      let min = 100;//float
      let minIndex = 0;//int
      let intersectionPassed = false;//boolean
      while(!temp.isGhost){//keeps looking left until it finds a wall or a ghost
        min = 100;
        for(let i=0; i<temp.edges.length; i++){//find the closest edge to the left
          let nodeInDirection = createVector(temp.edges[i].x-temp.x, temp.edges[i].y-temp.y);//Vector
          nodeInDirection.normalize();//make it a unit vector, length is 1
          if(nodeInDirection.x == dir.x && nodeInDirection.y == dir.y){//if the node is in the location of temp node
            if(dist(temp.x, temp.y, temp.edges[i].x, temp.edges[i].y)<min){//if the node is the closest in the desired direction
              min = dist(temp.x, temp.y, temp.edges[i].x, temp.edges[i].y);
              minIndex = i;
              wrongWay = createVector(-nodeInDirection.x, -nodeInDirection.y);
            }
          }
        }if(min == 100){//hit a wall
          break;
        }distance+=min;//add the distance to this node to the distance covered
        previousNode = temp;//set the previous node to the current one
        temp = temp.edges.get(minIndex);//set the current node to the closest node to the left of this node
        if(!intersectionPassed && this.isIntersection(temp)){//keep track of when the path passes an intersection
          intersectionPassed = true;
        }
      }if(temp.isGhost){//if player found a ghost then we are done checking this direction
        this.vision[visionIndex] = 1.0/distance;
      }else{
        if(distance == 0){
          this.vision[visionIndex] = 0.0;
        }else{
          if(intersectionPassed){
            this.vision[visionIndex] = 0.0;
          }else{//have not found a ghost or passed an intersection, so we hit a corner, find the nearest node that is not the last node
            while(!temp.isGhost && !this.isIntersection(temp)){
              min = 100;
              for(let i=0; i<temp.edges.length; i++){
                let nodeInDirection = createVector(temp.edges[i].x-temp.x, temp.edges[i].y-temp.y);//Vector
                nodeInDirection.normalize();//length set to 1
                if(nodeInDirection.x!=wrongWay.x || nodeInDirection.y!=wrongWay.y){
                  if(temp.edges[i]!=previousNode){
                    if(dist(temp.x, temp.y, temp.edges[i].x, temp.edges[i].y)<min){
                      min = dist(temp.x, temp.y, temp.edges[i].x, temp.edges[i].y);
                      minIndex = i;
                    }
                  }
                }
              }if(min == 100){//if no nodes found which are not the last
                console.log("error: no nodes found");
                break;
              }previousNode = temp;
              temp = temp.edges.get(minIndex);
              distance+=min;
              wrongWay = createVector(previousNode.x - temp.x, previousNode.y - temp.y);
              wrongWay.normalize();//makes it a unit vector
            }if(temp.isGhost){
              this.vision[visionIndex] = 1/distance;//if there is a ghost in the direction add the inverse of the distance to the inputs
            }else{
              this.vision[visionIndex] = (0.0);//if no ghost found add 0
            }
          }
        }
      }
    }
  }
  
  isIntersection(n){//takes in PathNode, returns whether or not the node is an intersection, if it has more than 2 direction going out of it
    let left = false,
    right = false,
    up = false,
    down= false;
    let countDirections = 0;//int
    for(let i=0; i<n.edges.length; i++){
      if(n.x<n.edges[i].x && !left){
        countDirections++;
        left = true;
      }else if(n.x>n.edges[i].x && !right){
        countDirections++;
        right = true;
      }else if(n.y<n.edges[i].y && !up){
        countDirections++;
        up = true;
      }else if(n.y>n.edges[i].y && !down){
        countDirections++;
        down = true;
      }if(countDirections>2){
        return true;
      }
    }return false;
  }

  setDistanceToWalls(){//sets some inputs for the Neural Net for whether or not there is a wall directly next to it in all directions
    let matrixPosition = pixelToTile(this.pacman.pos);//Vector
    let directions = [];//[4] of Vectors
    for(let i=0; i<4; i++){//adds 4 directions to the array
      directions[i] = createVector(this.pacman.vel.x, this.pacman.vel.y);
      directions[i].rotate(Math.PI/2*i);
      directions[i].x = round(directions[i].x);
      directions[i].y = round(directions[i].y);
    }let visionIndex = 4;
    for(let dir of directions){//for each direction 
      let lookingPosition = createVector(matrixPosition.x + dir.x, matrixPosition.y+ dir.y);//Vector, look in that direction
      if(originalTiles[lookingPosition.y][lookingPosition.x].wall){//checks if there is a wall in that direction
        this.vision[visionIndex] = 1;
      }else{
        this.vision[visionIndex] = 0;
      }while(true){//keep looking in that direction until you reach a dot or a wall
        if(originalTiles[lookingPosition.y][lookingPosition.x].wall){//if wall
          this.vision[visionIndex+4] = 0;
          break;
        }if(this.pacman.tiles[lookingPosition.y][lookingPosition.x].dot && !this.pacman.tiles[lookingPosition.y][lookingPosition.x].eaten){//if dot 
          this.vision[visionIndex+4] = 1;//this allows the players to see which direction a dot is
          break;
        }lookingPosition.add(dir);//if neither a dot nor a wall was found look further in that direction 
      }visionIndex+=1;
    }
  }

  
  think(){//gets the output of the brain then converts outputs to movements
    let max = 0;//float
    let maxIndex = 0;//int
    this.decision = this.brain.feedForward(this.vision);//get the output of the neural net
    for(let i=0; i<this.decision.length; i++){
      if(this.decision[i]>max){
        max = this.decision[i];
        maxIndex = i;
      }
    }if(max<0.8){//if the max output was less than 0.8 then do nothing
      return;
    }let currentVel = createVector(pacman.vel.x, pacman.vel.y);//Vector
    currentVel.rotate((Math.PI/2) * maxIndex);
    currentVel.x = round(currentVel.x);
    currentVel.y = round(currentVel.y);
    this.pacman.goTo = createVector(currentVel.x, currentVel.y);
    this.pacman.turn = true;
  }
  
  clone(){//returns a clone of this player with the same brain
    let clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork(); 
    clone.gen = this.gen;
    clone.bestScore = this.score;
    return clone;
  }

  cloneForReplay() {//takes care of the random factors such as ghosts moving when frightened
    let clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.pacman.blinky.frightenedTurns = this.pacman.blinky.frightenedTurns.clone();
    clone.pacman.blinky.replay = true;
    clone.pacman.pinky.frightenedTurns = this.pacman.pinky.frightenedTurns.clone();
    clone.pacman.pinky.replay = true;
    clone.pacman.inky.frightenedTurns = this.pacman.inky.frightenedTurns.clone();
    clone.pacman.inky.replay = true;
    clone.pacman.clyde.frightenedTurns = this.pacman.clyde.frightenedTurns.clone();
    clone.pacman.clyde.replay = true;
    clone.pacman.replay = true;
    clone.gen = this.gen;
    clone.bestScore = this.score;
    clone.stage = this.stage;
    return clone;
  }

  calculateFitness(){//for the Genetic algorithm
    this.score = this.pacman.score;
    this.bestScore = this.score;
    this.lifespan = this.pacman.lifespan;
    this.fitness = this.score*this.score;
  }

  crossover(parent2){//takes in Player
    let child = new Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
  }
}
