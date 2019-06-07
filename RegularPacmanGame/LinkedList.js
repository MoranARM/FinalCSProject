class LinkedList{
  constructor(head){// = null){
    this.head = null;//head;
    this.size = 0;//this.head!=null ? 1 : 0;
  }
  
  getEAt(index){//returns the LinkedListElement at index
    let count = 0;
    let element = this.head;
    while(element){
      if(count === index){
        return element;
      }count++;
      element = element.next;
    }return null;
  }
  
  getAt(index){//return the node at index
    return this.getEAt(index)==null ? null : this.getEAt(index).data;
  }
  
  addAt(element, index){
    if(this.head==null){//if the list is empty
      this.head = new LinkedListElement(element);
      this.size++;
      //console.log("Size added: addAt", this.size);
      return;
    }if(index === 0){
      this.head = new LinkedListElement(element, this.head);
      this.size++;
      //console.log("Size added: addAt2", this.size);
      return;
    }const prev = this.getEAt(index-1);
    let newElement = new LinkedListElement(element);
    newElement.next = prev.next;
    prev.next = newElement;
    this.size++;
    //console.log("Size added: addAt3", this.size);
    return;
  }
  
  addElement(element){//adds on the element to the end of the LinkedList
    let newElement = new LinkedListElement(element);
    if(this.head==null){
      this.head = newElement;
      this.size++;
      //console.log("Size added: addElement", this.size);
      return;
    }let tail = this.head;
    while(tail.next != null){
      tail = tail.next;
    }tail.next = newElement;
    this.size++;
    //console.log("Size added: addElement2", this.size);
    return;
  }
  
  pop(){//pops an element from the stack represented by the list, removes and returns the first element
    return this.removeAt(0);
    //return this.removeAt(this.size-1);
  }
  
  isEmpty(){//returns true if there are no elements, it returns if the size is equal to 0
    return this.head == null;
  }
  
  clone(){//returns a copy of the LinkedList
    let temp = new LinkedList();
    temp.head = this.head;
    temp.size = this.getSize();
    //console.log("Size copied: addElement", this.size);
    return temp;
  }
  
  addFirst(element){
    let newElement = new LinkedListElement(element);
    newElement.next = this.head;
    this.head = newElement;
    //console.log("Size added: addFirst", this.size);
    this.size++;
  }
  
  removeAt(index){//removes the node at index and returns it
    if(this.head==null){//when this.head equals null
      //console.log("Size NOT CHANGED BUT RETURNED: removeAt", this.size);
      return;
    }if(index === 0){//if the head then make next the head
      let temp = this.head.data;
      this.head = this.head.next;
      this.size--;
      //console.log("Size subtracted: removeAt", this.size);
      return temp;
    }const prev = this.getEAt(index-1);
    if(prev==null || prev.next==null){
      //console.log("Size NOT CHANGED BUT RETURNED: removeAt2", this.size);
      return;
    }prev.next = prev.next.next;
    this.size--;
    //console.log("Size subtracted: removeAt2", this.size);
    return this.head.data;
  }
  
  clearList(){//resets all values of the LinkedList
    this.head = null;
    this.size = 0;
    //console.log("Size set to zero: clearList", this.size);
  }
  
  getLast(){//returns the last element in the LinkedList
    return this.getSize()>0 ? this.getAt(this.getSize()-1) : null;
  }
  
  getSize(){//slower because it takes O(n) to run while .size is O(1)
    let num = 0;
    let temp = this.head;
    if(temp!=null){
      num++;
      while(temp.next!=null){
        temp = temp.next;
        num++;
      }
    }this.size = num;//ensures that this.size is accurate after checking the length
    return num;
  }
  
  //toString(){
  //  return "head = "+(this.head!=null?this.head.data:null)+" size is "+this.size;
  //}
  toString(){
    let output = "head = "+(this.head!=null?("("+this.head.data.x+","+this.head.data.y+")"):null)+" size is "+this.getSize()+", list contains:";
    let tempAt = this.head;
    if(tempAt!=null){
      while(tempAt.next!=null){
        output+=tempAt.data.toString()+", ";
        tempAt = tempAt.next;
      }output+=tempAt.data.toString();
    }return output;
  }
}
