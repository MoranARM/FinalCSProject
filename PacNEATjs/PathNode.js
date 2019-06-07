class PathNode{//Nodes are the locations on the board where pacman or the ghosts can choose to change their direction
  constructor(x1, y1, doesNothing=false){
    this.edges = new LinkedList();
    this.x = x1;
    this.y = y1;
    this.smallestDistToLoc = 10000000;//the distance of the shortest path from the start of the node
    this.degree;
    this.value;
    this.checked = false;
    this.isGhost = doesNothing;
  }
  
  //draws a circle
  show(){
    fill(0, 100, 100);
    ellipse(this.x*16+8, this.y*16+8, 10, 10);
  }
  
  //adds all of the nodes this node is next to
  addEdges(nodes){//takes in an array of nodes
    for(let i=0; i<nodes.length; i++){//goes through all nodes
      if(nodes[i].y == this.y^nodes[i].x == this.x){//^ is the bitwise exclusive OR, while | is the bitwise inclusive OR, || is the logical OR
        if(nodes[i].y == this.y){//checks if the node is on the same horizontal line
          let mostLeft = round(min(nodes[i].x, this.x))+1;
          let maxValue = max(nodes[i].x, this.x);
          let edge = true; 
          while(mostLeft<maxValue){//looks from the node for a wall
            if(originalTiles[this.y][mostLeft].wall){
              edge = false;//not an edge since there is a wall in the way
              break;
            }mostLeft++;//move 1 step closer to the other node
          }if(edge){
            this.edges.addElement(nodes[i]);//add the node as an edge
          }
        }else if(nodes[i].x == this.x){//checks if node is on the same line vertically
          let mostUp = min(nodes[i].y, this.y)+1;
          let maxValue = max(nodes[i].y, this.y);
          let edge = true;
          while(mostUp<maxValue){
            if(originalTiles[mostUp][this.x].wall){
              edge = false;
              break;
            }mostUp++;
          }if(edge){
            this.edges.addElement(nodes[i]);
          }
        }
      }
    }
  }
  
  toString(){
    return " ("+this.x+","+this.y+") ";
  }
}
