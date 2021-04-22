
class GameModel {
    constructor(){
        this.elements = []
        this.solid = []
        
        var TOTALSIZE = 4000
        var YSKIP = -3000
        this.elements.push(new Fill("#ffd",0,YSKIP,-1,TOTALSIZE,TOTALSIZE,0))
        this.elements.push(new Fill("#888",-230,-1430,1,40,1240,0))
        
        this.elements.push(new Cube("#ffd",-TOTALSIZE,YSKIP,0,10,TOTALSIZE,100))
        this.elements.push(new Cube("#ffd",0,-TOTALSIZE+YSKIP,0,TOTALSIZE,10,100))
        this.elements.push(new Cube("#ffd",TOTALSIZE,YSKIP,0,10,TOTALSIZE,100))
        this.elements.push(new Cube("#ffd",0,TOTALSIZE+YSKIP,0,TOTALSIZE,10,100))
        
        
        this.elements.push(new Cube("#840",-400,0,0,5,400,10))
        this.elements.push(new Cube("#840",120,-400,0,280,5,10))
        this.elements.push(new Cube("#840",-340,-400,0,60,5,10))
        this.elements.push(new Cube("#840",400,0,0,5,400,10))
        this.elements.push(new Cube("#840",-20,400,0,380,5,10))
        
        
        this.elements.push(new Cube("#ffb",0-80,-100,0,10,90,50))
        this.elements.push(new Cube("#ffb",0,-100-80,0,70,10,50))
        this.elements.push(new Cube("#ffb",0+80,-100,0,10,90,50))
        this.elements.push(new Cube("#ffb",0-10,-100+80,0,60,10,50))
        this.elements.push(new Cube("#b92",0,-100,50 ,80,80,10))
        
        this.elements.push(new Cube("#ffb",0-230,-100,80 ,100,100,20))
        this.elements.push(new Cube("#ffb",0-230,-100,0 ,110,110,5))
        this.elements.push(new Cube("#ffb",0-230,-100,5 ,90,90,5))
        this.elements.push(new Cube("#ffb",0-230-80,-100-80,10 ,5,5,70))
        this.elements.push(new Cube("#ffb",0-230-80,-100+80,10 ,5,5,70))
        this.elements.push(new Cube("#ffb",0-230+80,-100-80,10 ,5,5,70))
        this.elements.push(new Cube("#ffb",0-230+80,-100+80,10 ,5,5,70))
        
        
        this.elements.push(new Cube("#f00",0-230-8,-100,10 ,6,6,8))
        this.elements.push(new Cube("#f00",0-230+8,-100,10 ,6,6,8))
        this.elements.push(new Cube("#f00",0-230,-100,18 ,14,6,28))
        this.elements.push(new Cube("#fff",0-230,-100+8,32 ,9,2,8))
        
        
        this.elements.push(new Cube("#ccc",0-750,-2500,0 ,600,400,5))
        
        this.elements.push(new Cube("#aaa",0-750,-2500-400,0 ,600,10,70))
        this.elements.push(new Cube("#aaa",0-750-50,-2500+400,0 ,600-50,10,70))
        this.elements.push(new Cube("#aaa",0-750-600,-2500,0 ,10,400,70))
        this.elements.push(new Cube("#aaa",0-750+600,-2500,0 ,10,400,70))
        
        this.elements.push(new Cube("#aaa",0-750+500,-2500+60,0 ,10,340,70))
        this.elements.push(new Cube("#aaa",0-750+400,-2500-60,0 ,10,340,70))
        this.elements.push(new Cube("#aaa",0-750+300,-2500+300,0 ,10,100,70))
        this.elements.push(new Cube("#aaa",0-750-100,-2500+200,0 ,400,10,70))
        
        for(var i = 0;i<=3;i++){
            for(var j = 0;j<=3;j++){
                this.elements.push(new Cube("#eee",0-750+100-i*120,-2500+100-j*100,0 ,20,20,30))
            }
        }
        this.elements.push(new Cube("#eee",0-750-500,-2500-100,0 ,100,200,30))
        this.elements.push(new Cube("#eee",0-750-570,-2500+150,0 ,20,50,15))
        
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
        
        
        this.gamer = new LeGamer(0,0,0)
        this.gamer.setColor("#66f")
        this.elements.push(this.gamer)
        for(var i = -400;i<400;i+=20){
            for(var j = -400;j<400;j+=20){
                if(this.elements.filter(x=>x.solid && Math.abs(x.x-i)<x.getWidthX() && Math.abs(x.y-j)<x.getWidthY()).length == 0)
                    if(Math.random()<0.9*Math.pow(0.8,1+(Math.abs(i)+Math.abs(j))/40)){
                        var g = new LeGamer(i+Math.random()*8-4,j+Math.random()*8-4,200)
                        this.elements.push(g)
                        g.thinking = true
                    } else if(Math.random()<0.006){
                        this.elements.push(new BajoJajo(i+Math.random()*8-4,j+Math.random()*8-4))
                    }
            }
        }
        for(var i = -TOTALSIZE;i<TOTALSIZE;i+=60){
            for(var j = -TOTALSIZE+YSKIP;j<TOTALSIZE+YSKIP;j+=60){
                if(this.elements.filter(x=>x.solid && Math.abs(x.x-i)<x.getWidthX() && Math.abs(x.y-j)<x.getWidthY()).length == 0){
                    if(Math.random()<0.007){
                        for(var i2 = -40;i2<40;i2+=10){
                            for(var j2 = -40;j2<40;j2+=10){
                                if(Math.random()<0.05)
                                    this.elements.push(new GeorgeBush("#ffd",i+i2,j+j2,0,10,10,10))
                            }
                        }
                    } else if(Math.random()<0.003){
                        for(var i2 = -40;i2<40;i2+=10){
                            for(var j2 = -40;j2<40;j2+=10){
                                if(Math.random()<0.05)
                                    this.elements.push(new JebBush("#ffd",i+i2,j+j2,0,10,10,10))
                            }
                        }
                    } else if(Math.random()<0.01){
                        for(var i2 = -60;i2<60;i2+=30){
                            for(var j2 = -60;j2<60;j2+=30){
                                if(Math.random()<0.1){
                                    var w = 5*(1+Math.random()*5)
                                    var h = w * (0.5+Math.random())
                                    this.elements.push(new Rock("#fe0",i+i2,j+j2,0,w,w,h))
                                }
                            }
                        }
                    }
                }
                
            }
        }
        this.elements.push(new GeorgeBush("#ffd",20,20,0,10,10,10))
        this.elements.push(new JebBush("#ffd",20,40,0,10,8,8))
        

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
                ,35)
        
    }
    checkCollisions(){
        if(this.solid.length === 0)
            return
            
        var maxCollisionx = 0
        for(var i in this.solid){
            var a = this.solid[i]
            a.restartCollisions()
            var k = Math.abs(a.getBounds()[0][0]-a.getBounds()[1][0])
            if(k>maxCollisionx && !a.static)
                maxCollisionx = k
        }
        var solidsorted = this.solid.sort((a,b)=>a.x+a.getBounds()[0][0]-b.x-b.getBounds()[0][0])
        var lastSorted = []
        for(var i in solidsorted){
            var nw = solidsorted[i]
            var nwb = nw.getBounds()

            lastSorted = lastSorted.filter(a=>a.x+a.getBounds()[1][0] >= nw.x+nw.getBounds()[0][0]/*(Math.abs(a.x-nw.x)<=maxCollisionx || a.static || nw.static)*/)
            for(var i in lastSorted){
                var a = lastSorted[i]
                if(nw.static && a.static)
                    continue
                var ab = a.getBounds()
                
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
                                //if(a == this.gamer)
                                  //  console.log('aa',nw.z,nwb,a.z,ab)
                            if(a.z < nw.z && a.vz >= nw.vz && (Math.abs(ab[0][2]+ab[1][2])<40 || a.z+ab[1][2]-20 <= nw.z+nwb[0][2]) && a.z+ab[1][2] > nw.z+nwb[0][2]){
                                nw.notifyCollisions(5, a.static ? -nw.vz : Math.max(3,a.vz), a.static, a.z-nwb[0][2]+ab[1][2])
                                a.notifyCollisions(2, nw.static ? a.vz : Math.max(3,-nw.vz), nw.static, nw.z-nwb[0][2]+ab[1][2])
                            }
                            if(a.z > nw.z && a.vz <= nw.vz && (Math.abs(nwb[0][2]+nwb[1][2])<40 || a.z+ab[0][2] >= nw.z+nwb[1][2]-20) && a.z+ab[0][2] < nw.z+nwb[1][2]){
                                nw.notifyCollisions(2, a.static ? nw.vz : Math.max(3,-a.vz), a.static, a.z+nwb[1][2]-ab[0][2])
                                a.notifyCollisions(5, nw.static ? -a.vz : Math.max(3,nw.vz), nw.static, nw.z+nwb[1][2]-ab[0][2])
                            }
                        }   
                        
                        if(
                            (nw.y - a.y <= ab[1][1] - nwb[0][1] && a.y - nw.y <= -ab[0][1] + nwb[1][1]) &&
                            (nw.z - a.z <= ab[1][2] - nwb[0][2]-10 && a.z - nw.z <= -ab[0][2] + nwb[1][2]-10)
                        ){
                            if(
                            Math.abs(nw.x - nwb[0][0] - a.x + ab[1][0])*Math.abs(nwb[0][1]) >= Math.abs(nw.y - nwb[0][1] - a.y + ab[1][1])*Math.abs(nwb[0][0])
                                ||
                            Math.abs(nw.x - nwb[1][0] - a.x + ab[0][0])*Math.abs(nwb[1][1]) >= Math.abs(nw.y - nwb[1][1] - a.y + ab[0][1])*Math.abs(nwb[1][0])
                                ||
                            Math.abs(nw.x - nwb[0][0] - a.x + ab[1][0])*Math.abs(ab[1][1]) >= Math.abs(nw.y - nwb[0][1] - a.y + ab[1][1])*Math.abs(ab[1][0])
                                ||
                            Math.abs(nw.x - nwb[1][0] - a.x + ab[0][0])*Math.abs(ab[0][1]) >= Math.abs(nw.y - nwb[1][1] - a.y + ab[0][1])*Math.abs(ab[0][0])
                            ){
                                if(a.x < nw.x && a.vx >= nw.vx && a.x+ab[1][0] > nw.x+nwb[0][0]){
                                    nw.notifyCollisions(3, a.static ? Math.max(1,Math.abs(-nw.vx)) : Math.max(1,a.vx), a.static, a.x+ab[1][0])
                                    a.notifyCollisions(0, nw.static ? Math.max(1,Math.abs(a.vx)) : Math.max(1,-nw.vx), nw.static, nw.x-nwb[0][0])
                                }
                                if(a.x > nw.x && a.vx <= nw.vx && a.x+ab[0][0] < nw.x+nwb[1][0]){
                                    nw.notifyCollisions(0, a.static ? Math.max(3,Math.abs(nw.vx)) :  Math.max(1,-a.vx), a.static, a.x-ab[0][0])
                                    a.notifyCollisions(3, nw.static ? Math.max(3,Math.abs(-a.vx)) :  Math.max(1,nw.vx), nw.static, nw.x+nwb[1][0])
                                    
                                }
                            }
                        }
                        if(
                            (nwx - ax <= ab[1][0] - nwb[0][0] && ax - nwx <= -ab[0][0] + nwb[1][0]) &&
                            (nw.z - a.z <= ab[1][2] - nwb[0][2]-10 && a.z - nw.z <= -ab[0][2] + nwb[1][2]-10)
                        ){
                            if(
                            Math.abs(nwx - nwb[0][0] - ax + ab[1][0])*Math.abs(nwb[0][1]) < Math.abs(nwy - nwb[0][1] - ay + ab[1][1])*Math.abs(nwb[0][0])
                                ||
                            Math.abs(nwx - nwb[1][0] - ax + ab[0][0])*Math.abs(nwb[1][1]) < Math.abs(nwy - nwb[1][1] - ay + ab[0][1])*Math.abs(nwb[1][0])
                                ||
                            Math.abs(nwx - nwb[0][0] - ax + ab[1][0])*Math.abs(ab[1][1]) < Math.abs(nwy - nwb[0][1] - ay + ab[1][1])*Math.abs(ab[1][0])
                                ||
                            Math.abs(nwx - nwb[1][0] - ax + ab[0][0])*Math.abs(ab[0][1]) < Math.abs(nwy - nwb[1][1] - ay + ab[0][1])*Math.abs(ab[0][0])
                            ){
                                if(ay < nwy && avy >= nwvy && ay+ab[1][1] > nwy+nwb[0][1]){
                                    nw.notifyCollisions(4, a.static ? Math.max(1,Math.abs(-nwvy)) :  Math.max(1,avy), a.static, a.y+ab[1][1])
                                    a.notifyCollisions(1, nw.static ? Math.max(1,Math.abs(avy)) :  Math.max(1,-nwvy), nw.static, nw.y-nwb[0][1])
                                }
                                if(ay > nwy && avy <= nwvy && ay+ab[0][1] < nw.y+nwb[1][1]){
                                    nw.notifyCollisions(1, a.static ? Math.max(1,Math.abs(nwvy)) :   Math.max(1,-avy), a.static, a.y-ab[0][1])
                                    a.notifyCollisions(4, nw.static ? Math.max(1,Math.abs(-avy)) :   Math.max(1,nwvy), nw.static, nw.y+nwb[1][1])
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
            var veloc = 0.03
            this.cam.setSkewed(skewed+veloc)
        }
        if(this.keypressed["g"]){
            var veloc = 0.03
            this.cam.setSkewed(skewed-veloc)
        }
        var mag = this.cam.getMagnification()
        if(this.keypressed["y"]){
            //if(mag<16){
                mag *= 1.115
            //}
            this.cam.setMagnification(mag)
        }
        if(this.keypressed["h"]){
            //if(mag>1){
                mag /= 1.115
            //}
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
        this.bounds = null
    }
    refreshDrawing(){
        this.cache = null
    }
    getBounds(){
        if(this.bounds === null)
            this.bounds = this.generateBounds()
        return this.bounds
    }
    getWidthX(){
        var b = this.getBounds()
        return Math.abs(b[0][0]-b[1][0])
    }
    getWidthY(){
        var b = this.getBounds()
        return Math.abs(b[0][1]-b[1][1])
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
        this.potentialCollisions = [0,0,0,0,0,0]
        this.lastx = x
        this.lasty = y
        this.lastz = z
        this.airresistance = 0
        this.vx = 0
        this.vy = 0
        this.vz = 0
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
            this.vz = Math.max(this.vz-0.5,-16*(1-this.airresistance))
            this.refreshDrawing()
        } else {
            if(this.vz <= 0){
                this.vz = 0
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
        
        switch(index){
            case 0:
            case 3:
            this.x = this.lastx
            break
            case 1:
            case 4:
            this.y = this.lasty
            break
            case 2:
            case 5:
            this.z = this.lastz
             break
         }
        switch(index){
            case 0:
            case 3:
            this.vx = 0
            break
            case 1:
            case 4:
            this.vy = 0
            break
            case 2:
            case 5:
            this.vz = 0
             break
         }
    }
    notifyCollisions(index,force,arg1,arg2){
        var solid = arg1,border = arg2
        this.potentialCollisions[index] = force
        this.refreshDrawing()
        if(solid){
            //this.revertLastPosition(index)
        }
        
        var MOVE = 10
        switch(index){
            case 0: 
            if(solid && this.x > border && border !== undefined){
                this.x = this.x > border+MOVE ? this.x-MOVE : border-1
                //this.vx = 0
            }
            this.x -= force; 
            if(this.vx > 0)
                this.vx = -this.vx/2
            break
            case 1: 
            if(solid && this.y > border && border !== undefined){
                this.y = this.y > border+MOVE ? this.y-MOVE : border-1
                //this.vy = 0
            }
            this.y -= force; 
            if(this.vy > 0)
                this.vy = -this.vy/2
            break
            case 2: 
            if(this.z > border && border !== undefined){
                this.z = this.z > border+10 ? this.z-10 : border
            }
            this.vz = 0
            break
            
            case 3: 
            if(solid && this.x < border && border !== undefined){
                this.x = this.x < border-MOVE ? this.x+MOVE :border+1
                //this.vx = 0
            }
            this.x += force; 
            if(this.vx < 0)
                this.vx = -this.vx/2
            break
            case 4: 
            if(solid && this.y < border && border !== undefined){
                this.y = this.y < border-MOVE ? this.y+MOVE :border+1
                //this.vy = 0
            }
            this.y += force; 
            if(this.vy < 0)
                this.vy = -this.vy/2
            break
            case 5: 
            if(this.z < border && border !== undefined){
                this.z = this.z < border-10 ? this.z+10 :border
            }
            
            if(this.z < 0){
                this.z = 0
            }
            this.vz = 0
            break
        }
        this.lastx = this.x
        this.lasty = this.y
        this.lasyz = this.z
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
    notifyCollisions(index,force,arg1,arg2){
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
    constructor(x,y,z){
        super(x,y,z)
        this.rotation = Math.random()*360
        this.color = ["#fff","#d80","#740","#ff6"][Math.floor(Math.random()*Math.random()*4*Math.random()*4)]
        this.veloc = 0
        
        this.thinking = false
        this.stateofmind = 0
        this.memory = {}
        
        this.running = false
        
        var heightdifference = 6
        this.additionaHeight = Math.pow(Math.random()*heightdifference*2-heightdifference,3)/heightdifference/heightdifference
        this.airresistance = 0.1 + (1+this.additionaHeight/6)*0.1
        
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
            this.rotating = Math.max(0,Math.min(15,this.rotating))
            this.rotating += 1.2
            
            this.rotation += this.rotating
        }
        if(keypressed["ArrowRight"]){
            this.rotating = Math.max(-15,Math.min(0,this.rotating))
            this.rotating -= 1.2
            
            this.rotation += this.rotating
        }
        if(!(keypressed["ArrowLeft"] ^ keypressed["ArrowRight"])){
            if(this.rotating <= -5){
                this.rotating += 5
            } else if(this.rotating >= 5){
                this.rotating -= 5
            } else {
                this.rotating = 0
            }
            this.rotation += this.rotating
        }
        
        
        if(keypressed["ArrowUp"]){
            if(this.stepdirection === 0)
                this.stepdirection = 1
            this.veloc = keypressed["x"] ? 8 : 4
        }
        if(keypressed["ArrowDown"]){
            if(this.stepdirection === 0)
                this.stepdirection = 1
            this.veloc = -3
        }
        if(!keypressed["ArrowUp"] && !keypressed["ArrowDown"]){
            if(!this.falling())
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
        var ENDSTEP = 5
        var stepvelocity = Math.max(Math.abs(this.veloc/2),Math.max(-this.vz/2,ENDSTEP),0.5)
        if(this.falling() && this.vz < -2 && this.stepdirection == 0)
            this.stepdirection = 1
        if(this.stepdirection === 1){
            this.step += stepvelocity
            if(this.step>=ENDSTEP){
                this.step = ENDSTEP
                this.stepdirection = -1
            }
        } else if(this.stepdirection === -1) {
            this.step -= stepvelocity
            if(this.step<=-ENDSTEP){
                this.step = -ENDSTEP
                this.stepdirection = 1
            }
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
    notifyCollisions(index,force,arg1,arg2){
        super.notifyCollisions(index,force,arg1,arg2)
        if(this.thinking && this.stateofmind === 0 || this.stateofmind === 5){
            if(index == 5)
                return
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
                if(Math.random() <= 0.005){
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
            objs:!this.falling() ? this.walker() : this.faller()
        }
    }
    head(){
        return [
            {type:"ball",stroke:"#000",fill:this.color,coords:[[-2.5,-2.5,13+this.additionaHeight],[2.5,2.5,18+this.additionaHeight]]},
            {type:"line",stroke:"#000",coords:[[1,2,15+this.additionaHeight],[1,2,17+this.additionaHeight]]},
            {type:"line",stroke:"#000",coords:[[-1,2,15+this.additionaHeight],[-1,2,17+this.additionaHeight]]},
        ]
    }
    walker(){
        var obj = [
            {type:"line",stroke:"#000",coords:[[-3,this.step,0],[0,0,8+this.additionaHeight/2],[3,-this.step,0]]},
            {type:"line",stroke:"#000",coords:[[0,0,8+this.additionaHeight/2],[0,0,13+this.additionaHeight]]},
            {type:"line",stroke:"#000",coords:[[-3,-this.step/2,8+this.additionaHeight/2],[0,0,13+this.additionaHeight],[3,this.step/2,8+this.additionaHeight/2]]},
        ]
        return obj.concat(this.head())
    }
    faller(){
        var obj
        var progress = Math.min(this.vz/5,0.7)
        if(this.vz > 0){
            obj = [
                {type:"line",stroke:"#000",coords:[[-3*(1-progress),0,-3*(progress/2)],[0,0,8+this.additionaHeight/2],[3*(1-progress),0,-3*(progress/2)]]},
                {type:"line",stroke:"#000",coords:[[0,0,8+this.additionaHeight/2],[0,0,13+this.additionaHeight]]},
                {type:"line",stroke:"#000",coords:[[-3*(1-progress),0,8+this.additionaHeight/2-3*(progress/2)],[0,0,13+this.additionaHeight],[3*(1-progress),0,8+this.additionaHeight/2-3*(progress/2)]]},
            ]
        } else {
            obj = [
                {type:"line",stroke:"#000",coords:[[-3,this.step,0],[0,0,8+this.additionaHeight/2],[3,-this.step,0]]},
                {type:"line",stroke:"#000",coords:[[0,0,8+this.additionaHeight/2],[0,0,13+this.additionaHeight]]},
                {type:"line",stroke:"#000",coords:[[-3*(1-progress/3),-this.step/2,8+this.additionaHeight/2-3*(progress/2)],[0,0,13+this.additionaHeight],[3*(1-progress/3),this.step/2,8+this.additionaHeight/2-3*(progress/2)]]},
            ]
        }
        return obj.concat(this.head())
    }
}
class BajoJajo extends SolidGameObject{
    constructor(x,y){
        super(x,y,0,0)
        this.color = "#"+["0","0","0","0","0","0"].map(x=>"0123456789ab"[Math.floor(Math.random()*11)]).join("")
        this.width = 5 + Math.pow(Math.random(),2) * 10
        this.height = 10 + Math.pow(Math.random(),2) * 5
    }
    //move(){
    //    super.move()
    //}
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
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],
                },
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z2],[x2,y1,z2],[x2,y2,z2],[x1,y2,z2]],
                },
                
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x2,y1,z1],[x2,y1,z2],[x1,y1,z2]],
                },
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y2,z1],[x2,y2,z1],[x2,y2,z2],[x1,y2,z2]],
                },
                
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x1,y1,z2],[x1,y2,z2],[x1,y2,z1]],
                },
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],
                },
                //{type:"line",coords:[[0,0,20],[2.5,0,25],[0,0,30],[-2.5,0,25],[0,0,20]]},
            ]
        }
    }
}

class Fill extends GameObject{
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
        
        var objs = []
        
        if(y1-y2 != 0 && x1-x2 != 0){
            objs = objs.concat([
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],
                },
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z2],[x2,y1,z2],[x2,y2,z2],[x1,y2,z2]],
                }
            ])
        }
        
        if(z1-z2 != 0 && x1-x2 != 0){
            objs = objs.concat([
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x2,y1,z1],[x2,y1,z2],[x1,y1,z2]],
                },
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y2,z1],[x2,y2,z1],[x2,y2,z2],[x1,y2,z2]],
                }
            ])
        }
        
        if(y1-y2 != 0 && z1-z2 != 0){
            objs = objs.concat([
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x1,y1,z1],[x1,y1,z2],[x1,y2,z2],[x1,y2,z1]],
                },
                {type:"polygon",stroke:"#000",fill:this.color,coords:
                    [[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],
                },
            ])
        }
        
        
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:objs
                //{type:"line",coords:[[0,0,20],[2.5,0,25],[0,0,30],[-2.5,0,25],[0,0,20]]},
        }
    }
}
class GeorgeBush extends GameObject{
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
        return [[-this.widthx*0.8,-this.widthy*0.8,0],[this.widthx*0.8,this.widthy*0.8,this.height]]
    }
    render(){
        var x1 = -this.widthx
        var x2 = +this.widthx
        var y1 = -this.widthy
        var y2 = +this.widthy
        var z1 = 0
        var z2 = this.height

        var woodcolor = "#840"
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                {type:"polygon",stroke:"#000",fill:woodcolor,coords:[
                    [-this.widthx,0,0],
                    [-this.widthx/8,-this.widthy/8,0],
                    [0,-this.widthy,0],
                    [this.widthx/8,-this.widthy/8,0],
                    [this.widthx,0,0],
                    [this.widthx/8,this.widthy/8,0],
                    [0,this.widthy,0],
                    [-this.widthx/8,this.widthy/8,0],
                ]},
                {type:"polygon",stroke:"#000",fill:woodcolor,coords:[
                    [-this.widthx/8,0,0],
                    [-this.widthx,-this.widthy,this.height],
                    [0,-this.widthy/8,0],
                    [this.widthx,-this.widthy,this.height],
                    [this.widthx/8,0,0],
                    [this.widthx,this.widthy,this.height],
                    [0,this.widthy/8,0],
                    [-this.widthx,this.widthy,this.height],
                ]},
                {type:"polygon",stroke:"#000",fill:woodcolor,coords:[
                    [-this.widthx/8,-this.widthy/8,0],
                    [0,0,this.height],
                    [this.widthx/8,-this.widthy/8,0],
                ]},
                
            ]
        }
    }
}


class JebBush extends GameObject{
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
        return [[-this.widthx*0.8,-this.widthy*0.8,0],[this.widthx*0.8,this.widthy*0.8,this.height]]
    }
    render(){
        var x1 = -this.widthx
        var x2 = +this.widthx
        var y1 = -this.widthy
        var y2 = +this.widthy
        var z1 = 0
        var z2 = this.height
        
        var greencolor = "#280"

        var woodcolor = "#840"
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                {type:"polygon",stroke:"#000",fill:greencolor,coords:[
                    [-this.widthx,0,0],
                    [-this.widthx/4,-this.widthy/4,0],
                    [0,-this.widthy,0],
                    [this.widthx/4,-this.widthy/4,0],
                    [this.widthx,0,0],
                    [this.widthx/4,this.widthy/4,0],
                    [0,this.widthy,0],
                    [-this.widthx/4,this.widthy/4,0],
                ]},
                {type:"polygon",stroke:"#000",fill:greencolor,coords:[
                    [-this.widthx/4,0,0],
                    [-this.widthx,-this.widthy,this.height],
                    [0,-this.widthy/4,0],
                    [this.widthx,-this.widthy,this.height],
                    [this.widthx/4,0,0],
                    [this.widthx,this.widthy,this.height],
                    [0,this.widthy/4,0],
                    [-this.widthx,this.widthy,this.height],
                ]},
                {type:"polygon",stroke:"#000",fill:greencolor,coords:[
                    [-this.widthx/6,-this.widthy/6,0],
                    [0,0,this.height],
                    [this.widthx/6,-this.widthy/6,0],
                ]},
                    
                {type:"ball",stroke:"#000",fill:greencolor,coords:[[0,0,0],[this.widthx/4,this.widthy/4,this.height/4]]},
                {type:"ball",stroke:"#000",fill:greencolor,coords:[[0,0,0],[this.widthx/4,-this.widthy/4,this.height/4]]},
                {type:"ball",stroke:"#000",fill:greencolor,coords:[[0,0,0],[-this.widthx/4,this.widthy/4,this.height/4]]},
                {type:"ball",stroke:"#000",fill:greencolor,coords:[[0,0,0],[-this.widthx/4,-this.widthy/4,this.height/4]]},
                    
            ]
        }
    }
}

class Rock extends StaticGameObject{
    constructor(color,x,y,z,wx,wy,h){
        super(x,y,z,0)
        this.color = color
        this.widthx = wx
        this.widthy = wy
        this.rotation = Math.random()*360
        this.height = h
    }
    move(){
    }
    generateBounds(){
        return [[-this.widthx,-this.widthy,0],[this.widthx,this.widthy,this.height]]
    }
    render(){
        var xp1 = -this.widthx*(Math.random()*0.4+0.8)
        var yp1 = -this.widthy*(Math.random()*0.4+0.8)
        var xp2 = -this.widthx*(Math.random()*0.4+0.8)
        var yp2 = this.widthy*(Math.random()*0.4+0.8)
        var xp3 = this.widthx*(Math.random()*0.4+0.8)
        var yp3 = this.widthy*(Math.random()*0.4+0.8)
        var xp4 = this.widthx*(Math.random()*0.4+0.8)
        var yp4 = -this.widthy*(Math.random()*0.4+0.8)
        
        var xq1 = -this.widthx*(Math.random()*0.4+0.8)*0.8
        var yq1 = -this.widthy*(Math.random()*0.4+0.8)*0.8
        var xq2 = -this.widthx*(Math.random()*0.4+0.8)*0.8
        var yq2 = this.widthy*(Math.random()*0.4+0.8)*0.8
        var xq3 = this.widthx*(Math.random()*0.4+0.8)*0.8
        var yq3 = this.widthy*(Math.random()*0.4-0.2)*0.8
        var z1 = 0
        var z2 = this.height
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                //{type:"polygon",stroke:"#000",fill:this.color,coords:[[xp1,yp1,z1],[xp2,yp2,z1],[xp3,yp3,z1],[xp4,yp4,z1]],},
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xq1,yq1,z2],[xq2,yq2,z2],[xq3,yq3,z2]]},
                
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp1,yp1,z1],[xp2,yp2,z1],[xq1,yq1,z2]]},
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp2,yp2,z1],[xp3,yp3,z1],[xq2,yq2,z2]]},
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp3,yp3,z1],[xp4,yp4,z1],[xq3,yq3,z2]]},
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp4,yp4,z1],[xp1,yp1,z1],[xq1,yq1,z2]]},
                
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp2,yp2,z1],[xq2,yq2,z2],[xq1,yq1,z2]]},
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp3,yp3,z1],[xq3,yq3,z2],[xq2,yq2,z2]]},
                {type:"polygon",stroke:"#000",fill:this.color,coords:[[xp4,yp4,z1],[xq3,yq3,z2],[xq1,yq1,z2]]},
                //{type:"polygon",stroke:"#000",fill:this.color,coords:[[xp1,yp1,z2],[xq1,yq1,z2],[xq3,yq3,z2]]},
                //{type:"polygon",stroke:"#000",fill:this.color,coords:[[xq1,yq1,z2],[xq1,yq1,z2],[xq3,yq3,z2]]},
                //{type:"line",coords:[[0,0,20],[2.5,0,25],[0,0,30],[-2.5,0,25],[0,0,20]]},
            ]
        }
    }
}

