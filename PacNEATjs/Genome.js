class Genome{
  constructor(inp, out, crossover=false){//if crossOver create an empty Genome
    this.inputs = inp;//int
    this.outputs = out;//int
    if(!crossover){
      this.connections = [];//[] of ConnectionGene
      this.nodes = [];//[] of NodeGene
      this.network = [];//[] of NodeGene, nodes in the order they need to be looked at by the neural net
      this.layers = 2;
      this.nextNode = 0;
      this.biasNode;//int
      //used for drawing the neural net
      this.allNodes;//[] of [] of NodeGene, This is a 2D array
      this.nodePos;//[] of vectors
      this.nodeNums;//[] of ints
      for(let i=0; i<this.inputs; i++){//creates input nodeGenes
        this.nodes.push(new NodeGene(i));
        this.nextNode++;
        this.nodes[i].layer = 0;
      }for(let i=0; i<this.outputs; i++){//creates output nodeGenes
        this.nodes.push(new NodeGene(i+this.inputs));
        this.nodes[i+this.inputs].layer = 1;
        this.nextNode++;
      }this.nodes.push(new NodeGene(this.nextNode));//the bias node
      this.biasNode = this.nextNode;
      this.nextNode++;
      this.nodes[this.biasNode].layer = 0;
    }
  }

  connectNodes(){//adds the connections between nodes so it can access the next node in feedforward
    for(let i=0; i<this.nodes.length; i++){//clear all connections in nodes
      this.nodes[i].outputConnections = [];
    }for(let i=0; i<this.connections.length; i++){//goes through each connection gene
      this.connections[i].inNode.outputConnections.push(this.connections[i]);//adds connection to the node
    }
  }

  generateNetwork(){
    this.connectNodes();
    this.network = [];
    //add the node in each layer, it does not need to be ordered since layers can not connect to themselves
    for(let l=0; l<this.layers; l++){//goes through each layer
      for(let i=0; i<this.nodes.length; i++){//goes through each node
        if(this.nodes[i].layer == l){//checks if the node is in that layer
          this.network.push(this.nodes[i]);
        }
      }
    }
  }
  
  getNode(nodeNum){//returns a nodeGene with a matching number
    for(let i=0; i<this.nodes.length; i++){
      if(this.nodes[i].num == nodeNum){
        return this.nodes[i];
      }
    }return null;
  }
  
  feedForward(inputValues){//returns an output array after giving it inputs, feed forward refers to the connections only going one direction
    for(let i=0; i<this.inputs; i++){//sets outputs equal to the inputs
      this.nodes[i].outputValue = inputValues[i];
    }this.nodes[this.biasNode].outputValue = 1;//the bias output is always 1
    for(let i=0; i<this.network.length; i++){//activates each node in the network, explained in the NodeGene class
      this.network[i].activate();
    }let outs = [];//float []
    for(let i=0; i<this.outputs; i++){
      outs[i] = this.nodes[inputs+i].outputValue;
    }for(let i=0; i<this.nodes.length; i++){//reset all the nodes for the next feed forward
      nodes[i].inputSum = 0;
    }return outs;
  }
  
  mutate(innovation){//[] of Counter
    if(this.connections.length == 0){//if connections is empty
      this.addConnectionMutation(innovation);
    }let r1 = random(1);
    if(r1<0.8){//80 percent of the time mutate the weights
      for(let i=0; i<this.connections.length; i++){
        this.connections[i].mutateWeight();
      }
    }let r2 = random(1);
    if(r2<0.08){//8 percent of the time add a new connection
      this.addConnectionMutation(innovation);
    }let r3 = random(1);
    if(r3<0.02){//2 percent of the time add a node
      this.addNodeMutation(innovation);
    }
  }
  
  getInnovationNumber(innovation, inN, out){//takes in []counter, NodeGene, NodeGene, and returns the innovationNumber for a new mutation
    let isNew = true;//if it is a new mutation
    let connectionInnovationNum = nextConnectionNo;
    for(let i=0; i<innovation.length; i++){//checks if there is a matching mutation for each previous mutation
      if(innovation[i].matches(this, inN, out)){
        isNew = false;//not a new mutation
        connectionInnovationNum = innovation[i].currentInnovation;//set the innovation num as the innovation num of the matching
        break;
      }
    }if(isNew){//if the mutation is new then make and arraylist of the current state of the genome
      let innoNums = [];//[] of ints
      for(let i=0; i<this.connections.length; i++){//sets the innovation number
        innoNums.push(this.connections[i].innovation);
      }innovation.push(new Counter(inN.num, out.num, connectionInnovationNum, innoNums));
      nextConnectionNo++;
    }return connectionInnovationNum;
  }
  
  fullyConnected(){//returns if the network is fully connected
    let maxConnections = 0;//for each layer the maximum amount of connections is the number in that layer * number of nodes in front of it
    let nodesEachLayer = [];//stores the amount of nodes in each layer
    nodesEachLayer[0] = usingInputsEnd-usingInputsStart+2;
    for(let i=1; i<this.nodes.length; i++){//fill the array
      nodesEachLayer[this.nodes[i].layer]+=1;
    }for(let i=0; i<this.layers-1; i++){//adds the max for each layer together to get the maximum amount of connections
      let nodesInFront = 0;//int
      for(let j=i+1; j<this.layers; j++){//adds up the nodes for each layer in front of this layer
        nodesInFront+=nodesEachLayer[j];
      }maxConnections+=nodesEachLayer[i]*nodesInFront;
    }return maxConnections == this.connections.length;//if the number of connections equals the max possible then it is fully connected
  }
  
  badRandomConnection(r1, r2){//takes in two random ints
    if(this.nodes[r1].layer == this.nodes[r2].layer){//checks if the nodes are in the same layer
      return true;
    }if(this.nodes[r1].connectedTo(this.nodes[r2])){//checks is the nodes are connected already
      return true;
    }if(r1<this.inputs && (r1>usingInputsEnd || r1<usingInputsStart)){//if r1 is an input and not between the nodes being used
      return true;
    }if(r2<this.inputs && (r2>usingInputsEnd || r2<usingInputsStart)){//if r2 is an input and not between the nodes being used
      return true;
    }return false;
  }
  
  addConnectionMutation(innovation){//takes in [] of Counter, connects two nodes that are not currently connected
    if(this.fullyConnected()){//can't add more to a full network
      console.log("tried but could not add more connctions");
      return;
    }let randomNode1 = floor(random(this.nodes.length));//int
    let randomNode2 = floor(random(this.nodes.length));
    while(this.badRandomConnection(randomNode1, randomNode2)){//while random nodes are bad, get new ones
      randomNode1 = floor(random(this.nodes.length));
      randomNode2 = floor(random(this.nodes.length));
    }let temp;
    if(this.nodes[randomNode1].layer > this.nodes[randomNode2].layer){//if the first random node is after the second then swap them
      temp = randomNode2;
      randomNode2 = randomNode1;
      randomNode1 = temp;
    }let connectionInnovationNum = this.getInnovationNumber(innovation, this.nodes[randomNode1], this.nodes[randomNode2]);//gets the innovation num of the connection
    this.connections.push(new ConnectionGene(this.nodes[randomNode1], this.nodes[randomNode2], random(-1, 1), connectionInnovationNum));//add the connection into the array
    this.connectNodes();
  }
  
  addNodeMutation(innovation){//taes in [] of Counter, connection gene is randomly chosen and replaced with two new connections
    if(this.connections.length == 0){
      this.addConnectionMutation(innovation);
      return;
    }let randomConnection = floor(random(this.connections.length));
    while(this.connections[randomConnection].inNode == this.nodes[this.biasNode] && this.connections.length!=1){//keep the bias connected
      randomConnection = floor(random(this.connections.length));
    }this.connections[randomConnection].disable();//disable it
    let newNodeNum = this.nextNode;
    this.nodes.push(new NodeGene(newNodeNum));
    this.nextNode++;
    let connectionInnovationNum = this.getInnovationNumber(innovation, this.connections[randomConnection].inNode, this.getNode(newNodeNum));//add a new connection with weight of 1
    this.connections.push(new ConnectionGene(this.connections[randomConnection].inNode, this.getNode(newNodeNum), 1, connectionInnovationNum));
    connectionInnovationNum = this.getInnovationNumber(innovation, this.getNode(newNodeNum), this.connections[randomConnection].outNode);
    //adds a new connection from the new node that has the same weight as the disabled connection
    this.connections.push(new ConnectionGene(this.getNode(newNodeNum), this.connections[randomConnection].outNode, this.connections[randomConnection].weight, connectionInnovationNum));
    this.getNode(newNodeNum).layer = this.connections[randomConnection].inNode.layer+1;
    connectionInnovationNum = this.getInnovationNumber(innovation, this.nodes[this.biasNode], this.getNode(newNodeNum));
    this.connections.push(new ConnectionGene(this.nodes[this.biasNode], this.getNode(newNodeNum), 0, connectionInnovationNum));//connect the new node to the bias with a weight of 0
    //increment the layer numbers of all layers greater than or equal to this node
    if(this.getNode(newNodeNum).layer == this.connections[randomConnection].outNode.layer){
      for(let i=0; i<this.nodes.length-1; i++){//do not include the newest node
        if(this.nodes[i].layer >= this.getNode(newNodeNum).layer){
          this.nodes[i].layer++;
        }
      }this.layers++;
    }this.connectNodes();
  }
  
  //parent1, this genome, is more fit, parent2 is less fit
  crossover(parent2){//takes in and returns a Genome
    let child = new Genome(this.inputs, this.outputs, true);
    child.connections = [];
    child.nodes = [];
    child.layers = this.layers;
    child.nextNode = this.nextNode;
    child.biasNode = this.biasNode;
    let childGenes = [];//[] of ConnectionGene, list of genes to inherit from the parents
    let isExpressed = [];//[] of Boolean
    for(let i=0; i<this.connections.length; i++){//goes through all inherited connections
      let setExpressed = true;//used to enable or not enable the child
      let parent2connection = this.matchingGene(parent2, this.connections[i].innovation);
      if(parent2connection != -1){//if the gene matches
        if(!this.connections[i].expressed || !parent2.connections[parent2connection].expressed){//checks if either of the matching genes are disabled
          if(random(1)<0.75){//75 percent of the time the childs connection gene will be disabled
            setExpressed = false;
          }
        }let r = random(1);
        if(r<0.5){//get connection gene from this parent
          childGenes.push(this.connections[i]);
        }else{//get connection gene from parent2
          childGenes.push(parent2.connections[parent2connection]);
        }
      }else{//disjoint or excess gene
        childGenes.push(this.connections[i]);
        setExpressed = connections[i].expressed;
      }isExpressed.push(setExpressed);
    }
    //all excess and disjoint genes are inherited from the more fit parent, this genome
    for(let i=0; i<this.nodes.length; i++){
      child.nodes.push(this.nodes[i].clone());
    }for(let i=0; i<childGenes.length; i++){//clone all connections to connect the childs nodes
      child.connections.push(childGenes[i].clone(child.getNode(childGenes[i].inNode.num), child.getNode(childGenes[i].outNode.num)));
      child.connections[i].expressed = isExpressed[i];
    }child.connectNodes();
    return child;
  }
  
  matchingGene(parent2, innoNum){//takes in Genome and int, returns the index of a matching innovation number in the input genome, or if there are none -1
    for(let i=0; i<parent2.connections.length; i++){
      if(parent2.connections[i].innovation == innoNum){
        return i;
      }
    }return -1;//no gene was matching
  }
  
  clone(){//returns a new Genome
    let clone = new Genome(this.inputs, this.outputs, true);
    for(let i=0; i<this.nodes.length; i++){//copies the nodes
      clone.nodes.push(this.nodes[i].clone());
    }for(let i=0; i<this.connections.length; i++){//copies all connections
      clone.connections.push(this.connections[i].clone(clone.getNode(this.connections[i].inNode.num), clone.getNode(this.connections[i].outNode.num)));
    }clone.layers = this.layers;
    clone.nextNode = this.nextNode;
    clone.biasNode = this.biasNode;
    clone.connectNodes();
    return clone;
  }
  
  printGenome(){//prints info about the Genome
    console.log("Genome Layers: "+this.layers+", bias Node: "+this.biasNode+", nodes: ");
    for(let i=0; i<this.nodes.length; i++){//each NodeGene
      console.log(this.nodes[i].num+",");
    }console.log("Genes: ");
    for(let i=0; i<connections.length; i++){//each ConnectionGene
      console.log("connection "+connections[i].innovation+" In Node "+connections[i].inNode+" Out Node "+connections[i].outNode.num+" is expressed "+connections[i].expressed+" in layer "+connections[i].inNode.layer+" out layer "+connections[i].outNode.layer+" weight: "+connections[i].weight);
    }
  }
  
  drawGenome(startx, starty, w, h){//takes in 4 ints, draws the nerual net so the user can see it evolve
    this.allNodes = [];//[] of NodeGene
    this.nodePos = [];//[] of p5Vectors
    this.nodeNums = [];//[] of ints
    for(let l=0; l<this.layers; l++){//each layer
      let temp = [];//[] of NodeGene
      for(let i=0; i<this.nodes.length; i++){//each node
        if(this.nodes[i].layer == l){//check if node is in this layer
          temp.push(this.nodes[i]);//add to this layer
        }
      }this.allNodes.push(temp);//add this layer to all nodes
    }//add the position of the node to the nodePos array for each layer
    for(let i=0; i<this.layers; i++){
      fill(255, 0, 0);
      let x = startx+((i+1)*w)/(layers+1.0);
      for(let j=0; j<this.allNodes[i].length; j++){//each position in the layer
        let y = starty+(((j+1)*h)/(this.allNodes[i].length+1.0));
        this.nodePos.push(createVector(x, y));
        this.nodeNums.push(this.allNodes[i][j].num);
      }
    }//draw connections
    stroke(0);
    strokeWeight(2);
    for(let i=0; i<this.connections.length; i++){
      if(this.connections[i].expressed){
        stroke(0);
      }else{
        stroke(100);
      }let inV;//vector
      let out;
      inV = this.nodePos[this.nodeNums.indexOf(this.connections[i].inNode.num)];
      out = this.nodePos[this.nodeNums.indexOf(this.connections[i].outNode.num)];
      if(this.connections[i].weight>0){
        stroke(255, 0, 0);
      }else{
        stroke(0, 0, 255);
      }strokeWeight(map(abs(this.connections[i].weight), 0, 1, 0, 5));
      line(inV.x, inV.y, out.x, out.y);
    }//draws the nodes last so they appear over the connections
    for(let i=0; i<this.nodePos.length; i++){
      fill(255);
      stroke(0);
      strokeWeight(1);
      ellipse(this.nodePos[i].x, this.nodePos[i].y, 20, 20);
      textSize(10);
      fill(0);
      textAlign(CENTER, CENTER);
      text(this.nodeNums[i], this.nodePos[i].x, this.nodePos[i].y);
    }
  }
}
