
class GameModel {
    constructor(){
        this.elements = []
        this.bounded = []
        this.gamer = new LeGamer(0,0)
        this.gamer.setColor("#66f")
        this.elements.push(this.gamer)
        for(var i in elements){
            
        }
        for(var i = -300;i<300;i+=10){
            for(var j = -300;j<300;j+=10){
                if(Math.random()<0.4*Math.pow(0.8,1+(Math.abs(i)+Math.abs(j))/20)){
                    this.elements.push(new LeGamer(i+Math.random()*8-4,j+Math.random()*8-4))
                } else if(Math.random()<0.003){
                    this.elements.push(new BajoJajo(i+Math.random()*8-4,j+Math.random()*8-4))
                }
            }
        }
        this.elements.push(new BajoJajo(100,100))
        this.keypressed = {}
    }
    addCanvas(canvas){
        this.canvas = canvas
        let t = this
        this.cam = this.canvas.camera
        this.canvas.canvasElement.addEventListener("mousedown",e=>t.mouseDown(e))
        this.canvas.canvasElement.addEventListener("mousemove",e=>t.mouseMove(e))
        this.canvas.canvasElement.addEventListener("mouseup",e=>t.mouseUp(e))
        this.canvas.canvasElement.addEventListener("keydown",e=>t.keyDown(e))
        this.canvas.canvasElement.addEventListener("keyup",e=>t.keyUp(e))
        this.run()
    }
    run(){
        
        for(var i in this.elements){
            this.elements[i].move()
        }
        this.gamer.moveGamer(this.keypressed)
        this.moveCanvas()
        
        let t = this
        setTimeout(
                function(e){
                    t.run()
                    t.canvas.draw()
                }
                ,50)
        
    }
    moveCanvas(){
        var rot = this.cam.getRotation()
        var x = this.cam.getX()
        var y = this.cam.getY()
        
        this.cam.setRotation(this.gamer.rotation)
        this.cam.setX(this.gamer.x)
        this.cam.setY(this.gamer.y)
        /*
        if(this.keypressed["ArrowLeft"]){
            this.cam.setRotation(rot + 10)
        }
        if(this.keypressed["ArrowRight"]){
            this.cam.setRotation(rot - 10)
        }
        
        
        if(this.keypressed["ArrowUp"]){
            var veloc = 5
            this.cam.setX(x + Math.sin(rot*Math.PI/180) * veloc)
            this.cam.setY(y + Math.cos(rot*Math.PI/180) * veloc)
        }
        if(this.keypressed["ArrowDown"]){
            var veloc = -2
            this.cam.setX(x + Math.sin(rot*Math.PI/180) * veloc)
            this.cam.setY(y + Math.cos(rot*Math.PI/180) * veloc)
        }*/
        
        var skewed = this.cam.getSkewed()
        if(this.keypressed["t"]){
            var veloc = 0.05
            this.cam.setSkewed(skewed+veloc)
        }
        if(this.keypressed["g"]){
            var veloc = 0.05
            this.cam.setSkewed(skewed-veloc)
        }
        
    }
    mouseMove(e){
        var x = e.clientX - this.canvas.bounds.left
        var y = e.clientY - this.canvas.bounds.top
    
        //this.camera.setMousePosition(x,y)
        
    }
    mouseDown(e){
        var x = e.clientX - this.canvas.bounds.left
        var y = e.clientY - this.canvas.bounds.top
        
        //this.camera.startMoving(x,y)
    }
    mouseUp(e){
        var x = e.clientX - this.canvas.bounds.left
        var y = e.clientY - this.canvas.bounds.top
        
        //this.camera.stopMoving(x,y)
    }
    keyDown(e){
        this.keypressed[e.key] = true
    }
    keyUp(e){
        delete this.keypressed[e.key]
    }
}

class LeGamer{
    constructor(x,y){
        this.x = x
        this.y = y
        this.z = 0
        this.rotation = Math.random()*360
        this.color = ["#fff","#d80","#740","#ff6"][Math.floor(Math.random()*Math.random()*4*Math.random()*4)]
        this.veloc = 0
        
        this.running = false
        
        var heightdifference = 6
        this.additionaHeight = Math.pow(Math.random()*heightdifference*2-heightdifference,3)/heightdifference/heightdifference
        
        this.step = 0
        this.stepdirection = 0
        this.rotating = 0
    }
    setColor(color){
        this.color = color
    }
    moveGamer(keypressed){
        
        if(keypressed["ArrowLeft"]){
            this.rotating = Math.max(0,Math.min(20,this.rotating))
            this.rotating += 1.5
            
            this.rotation += this.rotating
        }
        if(keypressed["ArrowRight"]){
            this.rotating = Math.max(-20,Math.min(0,this.rotating))
            this.rotating -= 1.5
            
            this.rotation += this.rotating
        }
        if(!(keypressed["ArrowLeft"] ^ keypressed["ArrowRight"])){
            if(this.rotating <= -8){
                this.rotating += 8
            } else if(this.rotating >= 8){
                this.rotating -= 8
            } else {
                this.rotating = 0
            }
            this.rotation += this.rotating
        }
        
        
        if(keypressed["ArrowUp"]){
            if(this.stepdirection === 0)
                this.stepdirection = 1
            this.veloc = keypressed["r"] ? 12 :5
        }
        if(keypressed["ArrowDown"]){
            if(this.stepdirection === 0)
                this.stepdirection = 1
            this.veloc = -2
        }
        if(!keypressed["ArrowUp"] && !keypressed["ArrowDown"]){
            this.stepdirection = 0
            this.veloc = 0
        }
        this.x += Math.sin(this.rotation*Math.PI/180) * this.veloc
        this.y += Math.cos(this.rotation*Math.PI/180) * this.veloc
    }
    move(){
        var stepvelocity = Math.abs(this.veloc)
        if(this.stepdirection === 1){
            this.step += stepvelocity
            if(this.step>=5)
                this.stepdirection = -1
        } else if(this.stepdirection === -1) {
            this.step -= stepvelocity
            if(this.step<=-5)
                this.stepdirection = 1
        } else if(this.stepdirection === 0){
            if(this.step <= -stepvelocity){
                this.step += stepvelocity
            } else if(this.step >= stepvelocity){
                this.step -= stepvelocity
            } else {
                this.step = 0
            }
        }
    }
    render(){
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                {type:"line",stroke:"#000",coords:[[-3,this.step,0],[0,0,8+this.additionaHeight/2],[3,-this.step,0]]},
                {type:"line",stroke:"#000",coords:[[0,0,8+this.additionaHeight/2],[0,0,13+this.additionaHeight]]},
                {type:"line",stroke:"#000",coords:[[-3,-this.step/2,8+this.additionaHeight/2],[0,0,13+this.additionaHeight],[3,this.step/2,8+this.additionaHeight/2]]},
                {type:"ball",stroke:"#000",fill:this.color,coords:[[-2.5,-2.5,13+this.additionaHeight],[2.5,2.5,18+this.additionaHeight]]}
                //{type:"line",coords:[[0,0,20],[2.5,0,25],[0,0,30],[-2.5,0,25],[0,0,20]]},
            ]
        }
    }
}
class BajoJajo{
    constructor(x,y){
        this.x = x
        this.y = y
        this.z = 0
        this.rotation = 0
        this.color = "#"+["0","0","0","0","0","0"].map(x=>"0123456789ab"[Math.floor(Math.random()*11)]).join("")
        this.width = 5 + Math.pow(Math.random(),2) * 10
        this.height = 10 + Math.pow(Math.random(),2) * 5
    }
    move(){
    }
    render(){
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                {type:"ball",stroke:"#000",fill:this.color,coords:
                    [[-this.width,-this.width,0],[this.width,this.width,this.height]]},
                {type:"ball",stroke:"#000",fill:this.color,coords:
                    [[-this.width*0.8,-this.width*0.8,this.height],[this.width*0.8,this.width*0.8,this.height*1.8]]},
                {type:"ball",stroke:"#000",fill:this.color,coords:
                    [[-this.width*0.64,-this.width*0.64,this.height*1.8],[this.width*0.64,this.width*0.64,this.height*2.44]]},
                //{type:"line",coords:[[0,0,20],[2.5,0,25],[0,0,30],[-2.5,0,25],[0,0,20]]},
            ]
        }
    }
}

