var list;
function setup() {
  list = new LinkedList(new LinkedListElement("head"));
  list.addElement(3);
  list.addElement(765);
  list.addElement(4);
  list.addElement(65);
  list.addElement(8);
  console.log(list, list.toString());
  list.pop();
  console.log(list, list.toString());
  list.removeAt(list.size-1);
  console.log(list, list.toString()+"\n0000000000000000000");
  
  console.log(list.getEAt(0));
  console.log(list, list.toString());
  console.log(list.getEAt(1));
  console.log(list, list.toString());
  console.log(list.getEAt(2));
  console.log(list, list.toString()+"\n1111111111111111111111");
  
  console.log(list.getAt(0));
  console.log(list, list.toString());
  console.log(list.getAt(1));
  console.log(list, list.toString());
  console.log(list.getAt(2));
  console.log(list, list.toString()+"\n222222222222222222222222");
  
  list.addAt(96, 0);
  console.log(list, list.toString());
  list.addAt(43, 2);
  console.log(list, list.toString());
  list.addAt(112, list.size);
  console.log(list, list.toString()+"\n3333333333333333333333");
  
  list.addElement(23456);
  console.log(list, list.toString()+"\n4444444444444444");
  
  console.log(list.pop());
  console.log(list, list.toString()+"\n5555555555555555555");
  
  console.log(list.isEmpty());
  console.log(list, list.toString()+"\n66666666666666666");
  
  list.clone();
  console.log(list, list.toString()+"\n77777777777777");
  
  list.addFirst(876);
  console.log(list, list.toString()+"\n88888888888");
  
  console.log(list.removeAt(0));
  console.log(list, list.toString());
  list.removeAt(1);
  console.log(list, list.toString());
  console.log(list.removeAt(list.size-1));
  console.log(list, list.toString()+"\n99999999999999999999");
  
  console.log(list.getLast());
  console.log(list, list.toString()+"\n101101010101101101001");
  
  console.log(list.getSize());
  console.log(list, list.toString(+"\n11 11 11 11 11 11 11 11 11"));
  
  //list.clearList();
  //console.log(list, list.toString()+"\n12 12 12 112 122 112 112 12 12");
  console.log(list.pop());
  console.log(list, list.toString()+"\n5555555555555555555");
  
  console.log(list.pop());
  console.log(list, list.toString()+"\n5555555555555555555");
  
  console.log(list.pop());
  console.log(list, list.toString()+"\n5555555555555555555");
  
  console.log(list.pop());
  console.log(list, list.toString()+"\n5555555555555555555");
  
  
  console.log(list.isEmpty());
  console.log(list, list.toString()+"\n66666666666666666");
  
  console.log(list.getSize());
  console.log(list, list.toString());
}

function draw() {
  
}

  //getEAt(index)
  //getAt(index)
  //addAt(element, index)
  //addElement(element)
  //pop()
  //isEmpty()
  //clone()
  //addFirst(element)
  //removeAt(index)
  //clearList()
  //getLast()
  //getSize()
