class ConnectionGene{
  constructor(inN, outN, w, inno){
    this.inNode = inN;//NodeGene
    this.outNode = outN;//NodeGene
    this.weight = w;//float
    this.expressed = true;//boolean
    this.innovation = inno;//used to compare genomes, int
  }
  
  mutateWeight(){//changes the weight, void 
    let r = random(1);//radnom float between 0 and 1 exclusive
    if(r<0.1){//changes the entire weight 10 percent of the time
      this.weight = random(-1, 1);//random float between -1 and 1
    }else{//slightly change the weight
      this.weight+=randomGaussian()/50;//a Processing method that returns a number very close to the mean with a standard deviation of one
      if(this.weight>1){//keeps weight in the limits of the activation function (sigmoid)
        this.weight = 1;
      }if(this.weight<-1){
        this.weight = -1;
      }
    }
  }
  
  getInNode(){//returns NodeGene
    return this.inNode;
  }
  
  getOutNode(){//returns NodeGene
    return this.outNode;
  }
  
  getWeight(){//returns weight
    return this.weight;
  }
  
  setWeight(w){
    this.weight = w;
  }
  
  isExpressed(){
    return this.expressed;
  }
  
  disable(){
    this.expressed = false;
  }
  
  getInnovation(){
    return this.innovation;
  }
  
  clone(inN, out){//returns ConnectionGene, takes in two NodeGenes
    return new ConnectionGene(inN, out, this.weight, this.expressed, this.innovation);
  }
  
}
