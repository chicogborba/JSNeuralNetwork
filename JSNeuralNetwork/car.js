class Car{
  constructor(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;


    this.speed=0;
    this.acceleration=0.2;
    this.maxSpeed=5;
    this.friction=0.05;
    this.angle=0;

    this.controls = new Controls()
  }

  update(){
    this.#mover();
  }

  #mover(){
        // Accelerate and reverse movement
    if(this.controls.forward){
      this.speed+=this.acceleration;
    }
    if(this.controls.reverse){
      this.speed-=this.acceleration;
    }

    // Prevent the car from going beyond the max speed
    if(this.speed>this.maxSpeed){
      this.speed=this.maxSpeed;
    }
    if(this.speed<-this.maxSpeed/2){
      this.speed=-this.maxSpeed/2;
    }

    // Apply friction
    if(this.speed>0){
      this.speed-=this.friction;
    }
    if(this.speed<0){
      this.speed+=this.friction;
    }
    if(Math.abs(this.speed)<this.friction){
      this.speed=0;
    }

    // Turn left and right
    if(this.speed!=0){
      const flip = this.speed>0?1:-1;
    if(this.controls.left){
      this.angle+=0.03*flip;
    }
    if(this.controls.right){
      this.angle-=0.03*flip;
    }
    }

    this.x-=this.speed*Math.sin(this.angle);

    this.y-=this.speed;
  }
    

  draw(ctx){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(
      -this.width/2,
      -this.height/2,
      this.width,
      this.height
    )
    ctx.fill();

    ctx.restore();
  }
  
}