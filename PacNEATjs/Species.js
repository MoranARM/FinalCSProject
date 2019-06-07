class Species{
  constructor(p){
    this.players = [];//[] of Player
    this.players.push(p);
    this.bestFitness = p.fitness;//float
    this.best = p.cloneForReplay();//Player
    this.averageFitness = 0;//float
    this.staleness = 0;//int, how many generations the species has gone without an improvement
    this.mascot = p.brain.clone();//Genome
    //coefficients for testing compatibility 
    this.excessCoeff = 1;//float
    this.weightDiffCoeff = 0.5;
    this.compatibilityThreshold = 3;
  }
  
  sameSpecies(g){//takes in Genome, true if the parameter genome is in the species
    let compatibility;//float
    let excessAndDisjoint = getExcessDisjoint(g, mascot);//get the number of excess and disjoint genes between this player and the current species mascot
    let averageWeightDiff = averageWeightDiff(g, mascot);//get the average weight difference between matching genes
    let largeGenomeNormaliser = g.connections.length-20;
    if(largeGenomeNormaliser<1){
      largeGenomeNormaliser = 1;
    }compatibility = (excessCoeff*excessAndDisjoint/largeGenomeNormaliser)+(weightDiffCoeff*averageWeightDiff);//compatablilty formula
    return(compatibilityThreshold>compatibility);
  }

  addToSpecies(p){//adds a player to the species
    this.players.push(p);
  }

  getExcessDisjoint(brain1, brain2){//takes in two Genomes, returns the number of excess and disjoint genes between the 2 input genomes, all the genes that do not match
    let matching = 0.0;//float
    for(let i=0; i<brain1.connections.length; i++){
      for(let j=0; j<brain2.connections.length; j++){
        if (brain1.connections[i].innovation == brain2.connections[j].innovation){
          matching++;
          break;
        }
      }
    }return (brain1.connections.length+brain2.connections.length-2*(matching));//return num of excess and disjoint genes
  }
  
  averageWeightDiff(brain1, brain2){//takes in two Genomes, returns the average weight difference between matching genes in the input of the two genomes
    if(brain1.connections.length == 0 || brain2.connections.length == 0){
      return 0;
    }let matching = 0;//float
    let totalDiff= 0;
    for(let i=0; i<brain1.connections.length; i++){
      for(let j=0; j < brain2.connections.length; j++){
        if(brain1.connections[i].innovation == brain2.connections[j].innovation){
          matching++;
          totalDiff+=abs(brain1.connections[i].weight - brain2.connections[j].weight);
          break;
        }
      }
    }if(matching ==0){//divide by 0 error
      return 100;
    }return totalDiff/matching;
  }
  
  sortSpecies(){//sorts the species by their fitness 
    let temp = [];//[] of Player
    for(let i=0; i<this.players.length; i++){//selection sort
      let max = 0;//float
      let maxIndex = 0;//int
      for(let j=0; j<this.players.length; j++){
        if(this.players[j].fitness > max){
          max = this.players[j].fitness;
          maxIndex = j;
        }
      }temp.push(this.players[maxIndex]);
      this.players.splice(maxIndex, 1);
      i--;
    }this.players = temp.clone();//[]
    if(this.players.length == 0){
      console.log("error on sort species"); 
      this.staleness = 200;
      return;
    }if(this.players[0].fitness>this.bestFitness) {//if there is a new best player
      this.staleness = 0;
      this.bestFitness = this.players[0].fitness;
      this.mascot = this.players[0].brain.clone();
      this.best = this.players[0].cloneForReplay();
    }else{//if there is not a new best player
      this.staleness ++;
    }
  }

  setAverage() {
    let sum = 0;//float
    for(let i=0; i<this.players.length; i++){
      sum += this.players[i].fitness;
    }this.averageFitness = sum/this.players.length;
  }

  giveChild(innovation){//takes in [] of Counter, gets child from the players in this species
    let child;//Player
    if(random(1) < 0.25){//25 percent of the time there is no crossover and the child is a clone of a random player
      child = selectPlayer().clone();
    }else{//75 percent of the time crossover 
      let parent1 = selectPlayer();//Player, two random parents
      let parent2 = selectPlayer();
      if(parent1.fitness<parent2.fitness){//the crossover function expects the highest fitness parent to be the object and the lowest as the argument
        child = parent2.crossover(parent1);
      }else{
        child = parent1.crossover(parent2);
      }
    }child.brain.mutate(innovation);//mutate the child brain
    return child;
  }

  selectPlayer(){//selects a player based on their fitness
    let fitnessSum = 0;//float
    for(let i=0; i<this.players.length; i++){
      fitnessSum+=this.players[i].fitness;
    }let rand = random(fitnessSum);//float
    let runningSum = 0;
    for(let i=0; i<players.length; i++){
      runningSum+=this.players[i].fitness; 
      if(runningSum>rand){
        return this.players[i];
      }
    }return players[0];//needs to return something, will never reach here
  }
  
  snap(){//kills off bottom half of the species, called snap in reference to Thanos
    if(this.players.length>2){
      for(let i=this.players.length/2; i<this.players.length; i++){
        players.splice(i, 1); 
        i--;
      }
    }
  }
  
  fitnessSharing() {//in order to protect new players, the fitnesses of each player is divided by the number of players in the species that that player belongs to 
    for(let i=0; i<this.players.length; i++){
      this.players[i].fitness/= this.players.length;
    }
  }
}
