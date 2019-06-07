class Tile{
  int num, wallType;
  PVector pos, rep;
  boolean wall = false;
  boolean dot = false;
  boolean bigDot = false;
  boolean eaten = false;
  boolean tunnel = false;
  Tile(){
    num = 0;
    pos = new PVector(0, 0);
    rep = new PVector(0, 0);
  }
  Tile(int x, int y){
    num = 0;
    pos = new PVector(x, y);
    rep = new PVector(pos.x*tileWidth+tileWidth/2, pos.y*tileHeight+tileHeight/2);
  }
  Tile(int n, int x, int y){
    num = n;
    pos = new PVector(x, y);
    rep = new PVector(pos.x*tileWidth+tileWidth/2, pos.y*tileHeight+tileHeight/2);
    wallType = -1;
  }
  
  //draw a dot if tile has a dot and eaten is false
  void show(){
    switch(num){
    case 1://case 1 is a wall
      wall = true;
      dot = false;
      bigDot = false;
      eaten = true;
      tunnel = false;
      break;
    case 0://case 0 is a dot
      wall = false;
      dot = true;
      bigDot = false;
      eaten = false;
      tunnel = false;
      wallType = -1;
      break;
    case 9://case 9 is a bigDot
      wall = false;
      dot = false;
      bigDot = true;
      eaten = false;
      tunnel = false;
      wallType = -1;
      break;
    case 2://case 2 is a tunnel
      wall = false;
      dot = false;
      bigDot = false;
      eaten = true;
      tunnel = true;
      wallType = -1;
      break;
    case 5://5 is a blank space
      wall = false;
      dot = false;
      bigDot = false;
      eaten = true;
      tunnel = false;
      wallType = -1;
      break;
    }if(wall){
      /*
         //-1 not a wall
         //wallType 0 = surrounded by walls
         //1 = left edge (
         //2 = top edge N
         //3 = Right edge )
         //4 = bottom edge U
         //5 = _|
         //6 = L
                __
         //7 = |
               __
         //8 =   |
         //9 = -|
         //10 = _|_
         //11 = |-
               ___
         //12 =   |
         //13 = ---
         //14 = |
         //15 = O
         
        if(vel.x == -1){//left
          rad1 = 3.6651914;//210 degrees
          rad2 = 8.901179;//510
        }else if(vel.x == 1){//right
          rad1 = 0.5235988;//30
          rad2 = 5.7595863;//330
        }else if(vel.y == 1){//down
          rad1 = 2.0943952;//120
          rad2 = 7.330383;//420
        }else{//up
          rad1 = 5.2359877;//300
          rad2 = 10.471975;//600
        }
         */
      noFill();
      stroke(32, 100, 210);
      strokeWeight(4);
      switch(wallType){
      case 0:
        fill(0);
        noStroke();
        ellipse(rep.x, rep.y, 12, 12);
        break;
      case 1:
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 2:
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 3:
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 4:
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 5://IMPORTANT
        arc(rep.x-tileWidth/2, rep.y-tileHeight/2, tileWidth, tileHeight, 0, PI/2, OPEN);
        break;
      case 6://IMPORTANT
        arc(rep.x+tileWidth/2, rep.y-tileHeight/2, tileWidth, tileHeight, PI/2, PI, OPEN);
        break;
      case 7://IMPORTANT
        arc(rep.x+tileWidth/2, rep.y+tileHeight/2, tileWidth, tileHeight, PI, 3*PI/2, OPEN);
        break;
      case 8://IMPORTANT
        arc(rep.x-tileWidth/2, rep.y+tileHeight/2, tileWidth, tileHeight, 3*PI/2, 2*PI, OPEN);
        break;
      case 9:
        line(rep.x, rep.y-tileHeight/2, rep.x, rep.y+tileHeight/2);
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 10:
        line(rep.x-tileWidth/2, rep.y, rep.x+tileWidth/2, rep.y);
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 11:
        line(rep.x, rep.y-tileHeight/2, rep.x, rep.y+tileHeight/2);
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 12:
        line(rep.x-tileWidth/2, rep.y, rep.x+tileWidth/2, rep.y);
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      case 13://IMPORTANT
        line(rep.x-tileWidth/2, rep.y, rep.x+tileWidth/2, rep.y);
        break;
      case 14://IMPORTANT
        line(rep.x, rep.y-tileHeight/2, rep.x, rep.y+tileHeight/2);
        break;
      case 15:
        //arc(rep.x, rep.y, tileWidth/2, tileHeight/2, rad1, rad2, PIE);
        break;
      }fill(255);
      noStroke();
      text(""+wallType, rep.x, rep.y);
    }
    if(dot){
      if(!eaten){//draw dot if not eaten
        fill(255, 255, 0);
        noStroke();
        ellipse(pos.x*tileWidth+tileWidth/2, pos.y*tileHeight+tileHeight/2, 3, 3);
      }
    }else if(bigDot){
      if(!eaten){
        fill(255, 255, 0);
        noStroke();
        ellipse(pos.x*tileWidth+tileWidth/2, pos.y*tileHeight+tileHeight/2, 6, 6);
      }
    }
  }
}
