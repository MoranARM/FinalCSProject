# finalProject

# PacNEATjs create Pacman in Javascript

This project was to create the game Pacman in Javascript, using p5.js and es6 syntax, along with implementing the NEAT algorithm to train pacman to beat the game itself. The game has the ghosts finding the correct location around pacman, being Blinky goes directly after him, Pinky goes 4 spaces ahead, Inky uses pacman and blinky's locations and Clyde goes right after pacman until he is within 8 spaces, turing to scatter mode until he is farther than 8 away from Pacman, then goes back to targeting him. The visuals for Pacman are made using p5js objects such as ellipses, arcs and rectangles in order to run smoother than having an image move around the screen, which is beneficial to both the end result of how the ghosts and pacman appear as well as the playability of the game to run at a smooth framerate. 

### Difficulties or opportunities you encountered along the way.

The toughest part was getting the custom made LinkedList to work with the A* algortihm implementation in order to have the Ghosts use accurate path finding to get to their target positions, reletive to Pacman. Other difficulties involved transitioning from Java syntax to the new way in which javascript classes are made and can be modified, especially the difference between when to use this. or let and just call the variable by its name normally. 

### Most interesting piece of your code and explanation for what it does.

```Javascript
if(this.goHome){//if retruning home then the target is above the ghost spawn
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
```
This is the code that is used by all ghosts to decide where they go. It is kept in the Ghost class so that each Blinky, Pinky, Inky, and Clyde are child classes that then use the same function instead of each having a nearly copied and pasted one. This also makes it easier to understand the slight differences between each Ghosts targeting pattern in relation to Pacman.
## Built With

* [p5.js](https://p5js.org/) - the Javascript Library used for visuals
* [Processing](https://processing.org/) - The IDE used

## Authors

* **Alex Moran** 

## Acknowledgments

* Hat tip to CodeBullet for his work with NEAT and videos on it
* Toru Iwatani, for creating Pacman in 1980
* Ken Stanley for developing the NEAT algorithm in 2002
* Peter Hart, Nils Nilsson and Bertram Raphael for inventing the A* algorithm in 1968
