
class GameModel {
    constructor(){
        this.elements = []
        this.solid = []
        
        
        this.elements.push(new Cube("#ffb",0-80,-100,0,10,90,50))
        this.elements.push(new Cube("#ffb",0,-100-80,0,70,10,50))
        this.elements.push(new Cube("#ffb",0+80,-100,0,10,90,50))
        this.elements.push(new Cube("#ffb",0-10,-100+80,0,60,10,50))
        
        
        
        this.elements.push(new Cube("#f00",200,160,0,140,140,20))
        this.elements.push(new Cube("#f80",200,160,20,120,120,20))
        this.elements.push(new Cube("#ff0",200,160,40,100,100,20))
        this.elements.push(new Cube("#0f0",200,160,60,80,80,20))
        this.elements.push(new Cube("#08f",200,160,80,60,60,20))
        this.elements.push(new Cube("#00c",200,160,100,40,40,20))
        this.elements.push(new Cube("#80f",200,160,120,20,20,20))
        
        this.elements.push(new Cube("#777",200,-120,0,50,50,400))
        this.elements.push(new Cube("#777",320,-120,0,50,50,400))
        
        this.elements.push(new Cube("#0a0",380,120,-1,50,80,6))
        
        
        this.gamer = new LeGamer(0,0)
        this.gamer.setColor("#66f")
        this.elements.push(this.gamer)
        for(var i = -300;i<300;i+=10){
            for(var j = -300;j<300;j+=10){
                if(this.elements.filter(x=>Math.abs(x.x-i)<19 && Math.abs(x.y-j)<19).length == 0)
                    if(Math.random()<0.2*Math.pow(0.8,1+(Math.abs(i)+Math.abs(j))/40)){
                        var g = new LeGamer(i+Math.random()*8-4,j+Math.random()*8-4)
                        this.elements.push(g)
                        g.thinking = true
                    } else if(Math.random()<0.003){
                        this.elements.push(new BajoJajo(i+Math.random()*8-4,j+Math.random()*8-4))
                    }
            }
        }
        

        for(var i in this.elements){
            if(this.elements[i].solid)
                this.solid.push(this.elements[i])
        }
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
        this.checkCollisions()
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
    checkCollisions(){
        if(this.solid.length === 0)
            return
            
        var maxCollisionx = 0
        for(var i in this.solid){
            var a = this.solid[i]
            a.restartCollisions()
            var k = Math.abs(a.getBounds()[0][0]-a.getBounds()[1][0])
            if(k>maxCollisionx)
                maxCollisionx = k
        }
        var solidsorted = this.solid.sort((a,b)=>a.x-b.x)
        var lastSorted = []
        for(var i in solidsorted){
            var nw = solidsorted[i]
            lastSorted = lastSorted.filter(a=>Math.abs(a.x-nw.x<=maxCollisionx))
            for(var i in lastSorted){
                var a = lastSorted[i]
                var ab = a.getBounds()
                var nwb = nw.getBounds()
                
                if(a!==nw){
                        var ax = a.x
                        var ay = a.y
                        var nwx = nw.x
                        var nwy = nw.y
                        var avx = a.vx
                        var avy = a.vy
                        var nwvx = nw.vx
                        var nwvy = nw.vy
                        if(
                            (nwx - ax <= ab[1][0] - nwb[0][0] && ax - nwx <= -ab[0][0] + nwb[1][0]) &&
                            (nw.y - a.y <= ab[1][1] - nwb[0][1] && a.y - nw.y <= -ab[0][1] + nwb[1][1])
                        ){
                            if(a.z < nw.z && a.vz >= nw.vz && a.z+ab[1][2]-20 <= nw.z+nwb[0][2] && a.z+ab[1][2] >= nw.z+nwb[0][2]){
                                nw.notifyCollisions(5, a.static ? -nw.vz : Math.max(1,a.vz), a.static, a.z-nwb[0][2]+ab[1][2])
                                a.notifyCollisions(2, nw.static ? a.vz : Math.max(1,-nw.vz), nw.static, nw.z+nwb[0][2]-ab[1][2])
                            }
                            if(a.z > nw.z && a.vz <= nw.vz && a.z+ab[0][2] >= nw.z+nwb[1][2]-20 && a.z+ab[0][2] <= nw.z+nwb[1][2]){
                                nw.notifyCollisions(2, a.static ? nw.vz : Math.max(1,-a.vz), a.static, a.z+nwb[1][2]-ab[0][2])
                                a.notifyCollisions(5, nw.static ? -a.vz : Math.max(1,nw.vz), nw.static, nw.z-nwb[1][2]+ab[0][2])
                            }
                        }   
                        
                        if(
                            (nw.y - a.y <= ab[1][1] - nwb[0][1] && a.y - nw.y <= -ab[0][1] + nwb[1][1]) &&
                            (nw.z - a.z <= ab[1][2] - nwb[0][2]-5 && a.z - nw.z <= -ab[0][2] + nwb[1][2]-5)
                        ){
                            if(
                            Math.abs(nw.x - nwb[0][0] - a.x + ab[1][0]) <= Math.abs(nw.y - nwb[0][1] - a.y + ab[1][1])
                                ||
                            Math.abs(nw.x - nwb[1][0] - a.x + ab[0][0]) <= Math.abs(nw.y - nwb[1][1] - a.y + ab[0][1])
                            ){
                                if(a.x < nw.x && a.vx >= nw.vx && a.x+ab[1][0] > nw.x+nwb[0][0]){
                                    nw.notifyCollisions(3, a.static ? Math.abs(-nw.vx) : Math.max(1,a.vx), a.static)
                                    a.notifyCollisions(0, nw.static ? Math.abs(a.vx) : Math.max(1,-nw.vx), nw.static)
                                }
                                if(a.x > nw.x && a.vx <= nw.vx && a.x+ab[0][0] < nw.x+nwb[1][0]){
                                    nw.notifyCollisions(0, a.static ? Math.abs(nw.vx) :  Math.max(1,-a.vx), a.static)
                                    a.notifyCollisions(3, nw.static ? Math.abs(-a.vx) :  Math.max(1,nw.vx), nw.static)
                                    
                                }
                            }
                        }
                        if(
                            (nwx - ax <= ab[1][0] - nwb[0][0] && ax - nwx <= -ab[0][0] + nwb[1][0]) &&
                            (nw.z - a.z <= ab[1][2] - nwb[0][2]-5 && a.z - nw.z <= -ab[0][2] + nwb[1][2]-5)
                        ){
                            if(
                            Math.abs(nwx - nwb[0][0] - ax + ab[1][0]) > Math.abs(nwy - nwb[0][1] - ay + ab[1][1])
                                ||
                            Math.abs(nwx - nwb[1][0] - ax + ab[0][0]) > Math.abs(nwy - nwb[1][1] - ay + ab[0][1])
                            ){
                            if(ay < nwy && avy >= nwvy && ay+ab[1][1] > nwy+nwb[0][1]){
                                nw.notifyCollisions(4, a.static ? Math.abs(-nwvy) :  Math.max(1,avy), a.static)
                                a.notifyCollisions(1, nw.static ? Math.abs(avy) :  Math.max(1,-nwvy), nw.static)
                            }
                            if(ay > nwy && avy <= nwvy && ay+ab[0][1] < nw.y+nwb[1][1]){
                                nw.notifyCollisions(1, a.static ? Math.abs(nwvy) :   Math.max(1,-avy), a.static)
                                a.notifyCollisions(4, nw.static ? Math.abs(-avy) :   Math.max(1,nwvy), nw.static)
                            }
                            }
                        }
                       
                }
             
            }
            lastSorted.push(nw)
        }
    }
    moveCanvas(){
        var rot = this.cam.getRotation()
        var x = this.cam.getX()
        var y = this.cam.getY()
        
        this.cam.setRotation(this.gamer.rotation)
        this.cam.setX(this.gamer.x)
        this.cam.setY(this.gamer.y)
        this.cam.setZ(this.gamer.z)
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
        var mag = this.cam.getMagnification()
        if(this.keypressed["y"]){
            if(mag<16){
                mag *= 1.125
            }
            this.cam.setMagnification(mag)
        }
        if(this.keypressed["h"]){
            if(mag>1){
                mag /= 1.125
            }
            this.cam.setMagnification(mag)
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

class GameObject {
    constructor(x,y,z,rotation){
        this.x = x ? x : 0
        this.y = y ? y : 0
        this.z = z ? z : 0
        this.rotation = rotation ? rotation : 0
        this.cache = null
        this.solid = false
    }
    refreshDrawing(){
        this.cache = null
    }
    /*getCenter(camera,bounds){
        return camera.getAbsoluteY(this.x,this.y,bounds)
    }*/
    
    getCenter(camera,cameraBounds){
        var objBounds = this.getBounds()
        //[[-this.widthx,-this.widthy,0],[this.widthx,this.widthy,this.height]]
        //this.camera.getAbsoluteY(a.x,a.y,this.bounds)
        var pts = [
            [this.x+objBounds[0][0],this.y+objBounds[0][1]],
            [this.x+objBounds[1][0],this.y+objBounds[0][1]],
            [this.x+objBounds[0][0],this.y+objBounds[1][1]],
            [this.x+objBounds[1][0],this.y+objBounds[1][1]]
        ]
        
        var minx = pts[0]
        var maxx = pts[0]
        for(var i = 1;i<4;i++){
            if(camera.getAbsoluteX(pts[i][0],pts[i][1],cameraBounds) < camera.getAbsoluteX(minx[0],minx[1],cameraBounds))
                minx = pts[i]
            if(camera.getAbsoluteX(pts[i][0],pts[i][1],cameraBounds) > camera.getAbsoluteX(maxx[0],maxx[1],cameraBounds))
                maxx = pts[i]
        }
        
        return [
            camera.getAbsoluteY(minx[0],minx[1],cameraBounds), camera.getAbsoluteY(maxx[0],maxx[1],cameraBounds),
            camera.getAbsoluteX(minx[0],minx[1],cameraBounds), camera.getAbsoluteX(maxx[0],maxx[1],cameraBounds),
            this.z+objBounds[0][2],this.z+objBounds[1][2]
        ]
    }
    getThing(){
        if(this.cache === null)
            this.cache = this.render()
        return this.cache
    }
}
class SolidGameObject extends GameObject {
    constructor(x,y,z,rotation){
        super(x,y,z,rotation)
        this.solid = true
        this.static = false
        this.bounds = null
        this.potentialCollisions = [0,0,0,0,0,0]
        this.lastx = x
        this.lasty = y
        this.lastz = z
        this.airresistance = 0
        this.vx = 0
        this.vy = 0
        this.vz = 0
    }
    getBounds(){
        if(this.bounds === null)
            this.bounds = this.generateBounds()
        return this.bounds
    }
    restartCollisions(){
        for(var i in this.potentialCollisions){
            this.potentialCollisions[i] = 0
        }
    }
    move(){
        this.lastx = this.x
        this.lasty = this.y
        this.lasyz = this.z
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz
        if(this.falling()){
            this.vz = Math.max(this.vz-1,-16*(1-this.airresistance))
            this.refreshDrawing()
        } else {
            if(this.vz != 0){
                //this.vz = 0
                this.refreshDrawing()
            }
            if(this.z < 0){
                this.z = 0
            }
        }
        //this.restartCollisions()
    }
    falling(){
        return this.z > 0 && this.potentialCollisions[5] == 0 
    }
    revertLastPosition(index){
        /*
        switch(index){
            case 0:
            case 3:*/
            this.x = this.lastx/*
            break
            case 1:
            case 4:*/
            this.y = this.lasty/*
            break
            case 2:
            case 5:*/
            this.z = this.lastz
//             break
//         }
    }
    notifyCollisions(index,force,solid,border){
        this.potentialCollisions[index] = force
        this.refreshDrawing()
        if(solid){
            this.revertLastPosition(index)
        }
        this.lastx = this.x
        this.lasty = this.y
        this.lasyz = this.z
        
        switch(index){
            case 0: this.x -= force; break
            case 1: this.y -= force; break
            case 2: 
            if(this.z > border){
                this.z = border
                //this.vz = 0
            }
            this.z -= force;
            this.z = Math.max(0,this.z) 
                break
            case 3: this.x += force; break
            case 4: this.y += force; break
            case 5: 
            if(this.z < border){
                this.z = border
                //this.vz = 0
            }
            this.z += force; 
            this.z = Math.max(0,this.z)
            break
        }
    }
}
class StaticGameObject extends GameObject {
    constructor(x,y,z,rotation){
        super(x,y,z,rotation)
        this.solid = true
        this.static = true
        this.bounds = null
        this.potentialCollisions = [0,0,0,0,0,0]
        this.lastx = x
        this.lasty = y
        this.lastz = z
        this.vx = 0
        this.vy = 0
        this.vz = 0
    }
    getBounds(){
        if(this.bounds === null)
            this.bounds = this.generateBounds()
        return this.bounds
    }
    restartCollisions(){
        for(var i in this.potentialCollisions){
            this.potentialCollisions[i] = 0
        }
    }
    move(){
        /*
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz
        */
    }
    notifyCollisions(index,force){
        this.potentialCollisions[index] = force
        /*
        this.refreshDrawing()
        switch(index){
            case 0: this.x -= force; break
            case 1: this.y -= force; break
            case 2: this.z -= force; break
            case 3: this.x += force; break
            case 4: this.y += force; break
            case 5: this.z += force; break
        }*/
    }
}
class LeGamer extends SolidGameObject {
    constructor(x,y){
        super(x,y,1000)
        this.rotation = Math.random()*360
        this.color = ["#fff","#d80","#740","#ff6"][Math.floor(Math.random()*Math.random()*4*Math.random()*4)]
        this.veloc = 0
        
        this.thinking = false
        this.stateofmind = 0
        this.memory = {}
        
        this.running = false
        
        var heightdifference = 6
        this.additionaHeight = Math.pow(Math.random()*heightdifference*2-heightdifference,3)/heightdifference/heightdifference
        this.airresistance = 0.1 + (1+this.additionaHeight/6)*0.2
        
        this.step = 0
        this.stepdirection = 0
        this.rotating = 0
    }
    setColor(color){
        this.color = color
    }
    moveGamer(keypressed){
        var firstx = this.x
        var firsty = this.y
        var firstz = this.z
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
            this.veloc = keypressed["x"] ? 12 : 5
        }
        if(keypressed["ArrowDown"]){
            if(this.stepdirection === 0)
                this.stepdirection = 1
            this.veloc = -4
        }
        if(!keypressed["ArrowUp"] && !keypressed["ArrowDown"]){
            this.stepdirection = 0
            this.veloc = 0
        }
        
        if(keypressed["z"] && !this.falling()){
            this.vz = 6
        }

        this.vx = Math.sin(this.rotation*Math.PI/180) * this.veloc
        this.vy = Math.cos(this.rotation*Math.PI/180) * this.veloc
        //if(vx > 0 && !this.potentialCollisions[0] || vx < 0 && !this.potentialCollisions[3])
        //    this.x += this.vx
        //if(vy > 0 && !this.potentialCollisions[1] || vy < 0 && !this.potentialCollisions[4])
        //    this.y += this.vy
        
        if(this.veloc != 0 || this.rotating != 0 || this.step != 0)
            this.refreshDrawing()
    }
    move(){
        super.move()
        if(this.thinking){
            this.think()
        }
        var stepvelocity = Math.max(Math.abs(this.veloc),1)
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
    notifyCollisions(index,force){
        super.notifyCollisions(index,force)
        if(this.thinking && this.stateofmind === 0 || this.stateofmind === 5){
            switch(index){
                case 0: this.rotation = 270; break
                case 1: this.rotation = 0; break
                case 3: this.rotation = 90; break
                case 4: this.rotation = 180; break
            }
            this.rotation += Math.random()*30-15
            this.changeStateOfMind(5,{time:5})
            this.think()
        }
    }
    think(){
        if(this.thinking)
        switch(this.stateofmind){
            case 0:
                this.moveGamer({})
                if(Math.random() <= 0.001){
                    var x = Math.random() * 400 - 200
                    var y = Math.random() * 400 - 200
                    this.changeStateOfMind(1,{time:10})
                } else if(Math.random() <= 0.01){
                    this.changeStateOfMind(2,{time:10,rot:Math.random()*2-1})
                } else if(Math.random() <= 0.0001){
                    this.changeStateOfMind(3,{time:100})
                }
                break
            case 1:
            case 5:
                this.moveGamer({"ArrowUp":true})
                this.memory['time']--
                if(this.memory['time']<=0)
                    this.changeStateOfMind(0,{})
                    
                break
            case 2:
                if(this.memory["rot"] > 0)
                    this.moveGamer({"ArrowLeft":true})
                else
                    this.moveGamer({"ArrowRight":true})
                this.memory['time']--
                if(this.memory['time']<=0)
                    this.changeStateOfMind(0,{})
                    
                break
            case 3:
                this.moveGamer({"ArrowUp":true,"r":true,"ArrowLeft":true})
                this.memory['time']--
                if(this.memory['time']<=0)
                    this.changeStateOfMind(0,{})
                    
                break
        }
    }
    changeStateOfMind(state,memory){
        this.stateofmind = state
        this.memory = memory ? memory : {}
    }
    generateBounds(){
        return [[-3,-3,0],[3,3,18+this.additionaHeight]]
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
                //
                {type:"ball",stroke:"#000",fill:this.color,coords:[[-2.5,-2.5,13+this.additionaHeight],[2.5,2.5,18+this.additionaHeight]]},
                {type:"line",stroke:"#000",coords:[[1,2,15+this.additionaHeight],[1,2,17+this.additionaHeight]]},
                {type:"line",stroke:"#000",coords:[[-1,2,15+this.additionaHeight],[-1,2,17+this.additionaHeight]]},
            ]
        }
    }
}
class BajoJajo extends SolidGameObject{
    constructor(x,y){
        super(x,y,0,0)
        this.color = "#"+["0","0","0","0","0","0"].map(x=>"0123456789ab"[Math.floor(Math.random()*11)]).join("")
        this.width = 5 + Math.pow(Math.random(),2) * 10
        this.height = 10 + Math.pow(Math.random(),2) * 5
    }
    move(){
    }
    generateBounds(){
        return [[-this.width,-this.width,0],[this.width,this.width,this.height*2.44]]
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

class Cube extends StaticGameObject{
    constructor(color,x,y,z,wx,wy,h){
        super(x,y,z,0)
        this.color = color
        this.widthx = wx
        this.widthy = wy
        this.height = h
    }
    move(){
    }
    generateBounds(){
        return [[-this.widthx,-this.widthy,0],[this.widthx,this.widthy,this.height]]
    }
    render(){
        var x1 = -this.widthx
        var x2 = +this.widthx
        var y1 = -this.widthy
        var y2 = +this.widthy
        var z1 = 0
        var z2 = this.height
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                {type:"rect",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],
                },
                {type:"rect",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z2],[x2,y1,z2],[x2,y2,z2],[x1,y2,z2]],
                },
                
                {type:"rect",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x2,y1,z1],[x2,y1,z2],[x1,y1,z2]],
                },
                {type:"rect",stroke:"#000",fill:this.color,coords:
                    [[x1,y2,z1],[x2,y2,z1],[x2,y2,z2],[x1,y2,z2]],
                },
                
                {type:"rect",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x1,y1,z2],[x1,y2,z2],[x1,y2,z1]],
                },
                {type:"rect",stroke:"#000",fill:this.color,coords:
                    [[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],
                },
                //{type:"line",coords:[[0,0,20],[2.5,0,25],[0,0,30],[-2.5,0,25],[0,0,20]]},
            ]
        }
    }
}

