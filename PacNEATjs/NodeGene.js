class NodeGene{
  constructor(n = undefined){
    this.num = n;//int
    this.inputSum;//float, current sum
    this.outputValue;//value after activation function
    this.outputConnections = [];//[] of ConnectionGene
    this.layer = 0;//int
    this.pos = createVector();//Vector, used to show the neural net
  }
  
  sigmoid(x){//basic activation function, could be changed to tanh, RELU or PRELU in the future
    let y = 1/(1+pow(Math.E, -4.9*x));
    return y;
  }
  
  activate(){//activates the node by having the outputs set to the inputs of nodes it is connected to
    if(this.layer != 0){//the activation function will not use the input layer and bias
      this.outputValue = this.sigmoid(this.inputSum);
    }for(let i=0; i<this.outputConnections.length; i++){//goes through each connection
      if(this.outputConnections[i].isExpressed()){//if not enbled then don't change anything
        this.outputConnections[i].outNode.inputSum+=this.outputConnections[i].weight*this.outputValue;//add the weighted output to the sum of the inputs of whatever this node is connected to
      }
    }
  }
  
  connectedTo(node){//takes in NodeGene, true if this node is connected to the parameter node, used for checking new connections
    if(node.layer == this.layer){//cannot connect nodes in the same layer
      return false;
    }if(node.layer<this.layer){//if node is in the layer behind the current node
      for(let i=0; i<node.outputConnections.length; i++){
        if(node.outputConnections[i].outNode == this){
          return true;
        }
      }
    }else{//if this node is in the layer behind node
      for(let i=0; i<this.outputConnections.length; i++){
        if(this.outputConnections[i].outNode == node){
          return true;
        }
      }
    }return false;
  }
  
  clone(){
    let clone = new NodeGene(this.num);
    clone.layer = this.layer;
    return clone;
  }
}
