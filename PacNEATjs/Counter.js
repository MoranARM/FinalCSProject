class Counter{
  constructor(inN, out, inno, innoNums){
    this.inNode = inN;//int
    this.outNode = out;//int
    this.currentInnovation = inno;//int
    this.innovationNums = [...innoNums];//used to tell is another genome is the same, arrayOfInts, copied over in ES6 style
  }
  
  //true if genome matches the original and connections are between the same nodes
  matches(genome, inN, out){//Genome, NodeGene, NodeGene
    if(genome.connections.length == this.innovationNums.length){//if number of connections are not the same then the genomes are different
      if(inN.num == this.inNode && out.num == this.outNode){
        for(let i=0; i<genome.connections.length; i++){//goes through the connections and if one of them are different return false
          if(!this.innovationNums.includes(genome.connections[i].innovation)){
            return false;
          }
        }return true;//connections were the same
      }
    }return false;
  }
}
