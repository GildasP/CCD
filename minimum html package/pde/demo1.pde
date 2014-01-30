
// variable spécifique à ce sketch
var bubbles = new Array();

// Setup the Processing Canvas
void setup(){
  
  size(300, 300);
  frameRate(25);
  noStroke();
  fill(0);
  background(255);
  ellipseMode(CENTER);

  // création des bulles
  for(var i=0; i<10; i++){
    bubbles.push(new Bubble());
  }
}

// Main draw loop
void draw(){

  background(255);

  for(var i=0; i<bubbles.length; i++){
  	bubbles[i].drawBubble();
  }      
}

class Bubble {
  // variables propres à chaque bulle
  var diam,ray,pos,vit,coul;

	Bubble(){
    diam = 20 + Math.random()*40;
    ray = diam/2;
    pos = new PVector(
      ray + Math.random()*(width-diam),
      ray + Math.random()*(height-diam)
    );
    vit = new PVector(
      Math.random()*10 - 5,
      Math.random()*10 - 5
    );
    coul = 0; // couleur
	}

	void drawBubble(){
    // limites du sketch
    if(pos.x+vit.x<ray || pos.x+vit.x>width-ray){
      vit.set(-1*vit.x, vit.y);
    }
    if(pos.y+vit.y<ray || pos.y+vit.y>height-ray){
      vit.set(vit.x, -1*vit.y);
    }

    // update position de la bulle
    pos.add(vit);

    // survol de la souris...
    if(dist(pos.x, pos.y, mouseX, mouseY)<=ray){
      fill(200); // change de couleur au survol
    } else {
      fill(coul);
    }

    // draw    
    ellipse(pos.x, pos.y, diam, diam);
    fill(255);
    ellipse(pos.x, pos.y, 5, 5);
	}
}


// événements souris
void mouseMoved(){
}
void mouseClicked(){
}