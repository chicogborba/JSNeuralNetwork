class Car{
  constructor(x,y,width,height,controlType, maxSpeed=3){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed=0;
    this.acceleration=0.2;
    this.maxSpeed=maxSpeed;
    this.friction=0.05;
    this.angle=0;
    this.damaged=false;

    this.useBrain = controlType == "AI";


    if(controlType!="DUMMY"){
      this.sensor= new Sensor(this);
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount,6,4]);
  }
    this.controls = new Controls(controlType);
}

  update(roadBorders, trafic){
    if(!this.damaged){
    this.#mover();
    this.polygon = this.#createPolygon();
    this.damaged = this.#assessDamage(roadBorders,trafic);
    }
    if(this.sensor){
      this.sensor.update(roadBorders,trafic);
      const offset = this.sensor.readings.map((reading)=>{
        reading == null ? 0 : 1-reading.offset;
      });
      const output = NeuralNetwork.feedForward(offset, this.brain);

      if(this.useBrain){
        this.controls.forward = output[0]
        this.controls.left = output[1]
        this.controls.right = output[2]
        this.controls.reverse = output[3]

      }
    }
  }

  #assessDamage(roadBorders,trafic){
    for(let i=0;i<roadBorders.length;i++){
      if(polysIntersect(this.polygon,roadBorders[i])){
        return true;
      }
    }

    for(let i=0;i<trafic.length;i++){
      if(polysIntersect(trafic[i].polygon,this.polygon)){
        return true;
      }
    }

    return false;
  }

  #createPolygon(){
    const points=[];
    const rad=Math.hypot(this.width,this.height)/2;
    const alpha=Math.atan2(this.width,this.height);
    points.push({
      x:this.x-Math.sin(this.angle-alpha)*rad,
      y:this.y-Math.cos(this.angle-alpha)*rad,
    })
    points.push({
      x:this.x-Math.sin(this.angle+alpha)*rad,
      y:this.y-Math.cos(this.angle+alpha)*rad,
    })
    points.push({
      x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
      y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad,
    })
    points.push({
      x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
      y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad,
    })
    return points;

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
    

  draw(ctx, color){

    if(this.damaged){
      ctx.fillStyle='red';
    }else{
      ctx.fillStyle=color;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
    for(let i=1;i<this.polygon.length;i++){
      ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
    }
    ctx.fill();

    if(this.sensor){
    this.sensor.draw(ctx);
    }
  }
  
}