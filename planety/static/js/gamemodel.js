
class GameModel {
    constructor(data){
        this.elements = []
        this.solid = []
        
        var TOTALSIZE = 4000
        var YSKIP = -3000
        
        //this.elements.push(new Fill("#ffd",0,YSKIP,-1,TOTALSIZE,TOTALSIZE,0))
        //this.elements.push(new Fill("#888",-230,-1430,1,40,1240,0))
        /*
        this.elements.push(new Cube("#ffd",-TOTALSIZE,YSKIP,0,10,TOTALSIZE,100))
        this.elements.push(new Cube("#ffd",0,-TOTALSIZE+YSKIP,0,TOTALSIZE,10,100))
        this.elements.push(new Cube("#ffd",TOTALSIZE,YSKIP,0,10,TOTALSIZE,100))
        this.elements.push(new Cube("#ffd",0,TOTALSIZE+YSKIP,0,TOTALSIZE,10,100))
        
        
        this.elements.push(new Cube("#840",-400,0,0,5,400,10))
        this.elements.push(new Cube("#840",120,-400,0,280,5,10))
        this.elements.push(new Cube("#840",-340,-400,0,60,5,10))
        this.elements.push(new Cube("#840",400,0,0,5,400,10))
        this.elements.push(new Cube("#840",-20,400,0,380,5,10))
        
        this.elements.push(normalCorrdsCube("#777",150,-270,0,170,-70,400))
        this.elements.push(normalCorrdsCube("#777",170,-270,0,330,-250,400))
        this.elements.push(normalCorrdsCube("#777",330,-270,0,350,-70,400))
        */
        
        var star = new Star("#fea",0,0,0,5,5,'Sun',{})
        this.elements.push(star)
        
        
        for(var name in data){
            var st = data[name]
            
            var radius = 1
                
            var properties = st.properties
            
            if(st.coords.length == 0){
                if('ra' in properties && 'dec' in properties){
                    var ra = properties.ra.replaceAll('{','').replaceAll('}','').split('|').map(x=>Number(x))
                    var dec = properties.dec.replaceAll("−","-").replaceAll('{','').replaceAll('}','').split('|').map(x=>Number(x))
                    if(ra.length<4 || dec.length<4 || ra.filter(x=>Number.isNaN(x) || x == undefined).length > 0 || dec.filter(x=>Number.isNaN(x) || x == undefined).length > 0)
                        continue
                    st.coords = [ra[1],ra[2],ra[3],dec[1],dec[2],dec[3]]
                } else {
                    continue
                }
            }
            if('parallax' in properties && properties.parallax > 0){
                var dist = 1000 / properties.parallax * 3.2616
            } else {
                continue
            }
            var rts = (st.coords[0] / 24 + st.coords[1] / 24/60 + st.coords[2] / 24/60/60) * 2 * Math.PI
            var dcl = (st.coords[3] / 90 + st.coords[4] / 90/60 + st.coords[5] / 90/60/60) / 2 * Math.PI
            
            var fact = 20
            var x = Math.sin(rts) * Math.cos(dcl) * dist * fact
            var y = Math.cos(rts) * Math.cos(dcl) * dist * fact
            var z = Math.sin(dcl) * dist * fact
            
            
            if('radius' in properties){
                radius = Number(properties.radius)*5
                if(Number.isNaN(radius)){
                    radius = properties.radius.replace(/(^\d+)(.+$)/i,'$1')*5
                }
                if(Number.isNaN(radius)){
                    radius = 1
                }
            }
            radius = Math.sqrt(radius) + 5       
            var color = '#f00'
            if('class' in properties){
                var cl = properties.class[0]
                switch(cl){
                    case 'O': color = '#9db4ff';  break
                    case 'B': color = '#a2b9ff';  break
                    case 'A': color = '#baccff';  break
                    case 'F': color = '#e4e8ff';  break
                    case 'G': color = '#fff5ec';  break
                    case 'K': color = '#ffebd1';  break
                    case 'M': color = '#ffbe7f';  break
                }
            }
            
            
            this.elements.push(new Star(color,x,y,z,radius,radius,name,data))
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
                            (nwy - ay <= ab[1][1] - nwb[0][1] && ay - nwy <= -ab[0][1] + nwb[1][1])
                        ){
                                //if(a == this.gamer)
                                  //  console.log('aa',nw.z,nwb,a.z,ab)
                            if(a.z < nw.z && a.vz >= nw.vz && (Math.abs(ab[0][2]+ab[1][2])<10 || a.z+ab[1][2]-10 <= nw.z+nwb[0][2]) && a.z+ab[1][2] > nw.z+nwb[0][2]){
                                nw.notifyCollisions(5, a.static ? Math.max(1,Math.abs(-nw.vz)) : Math.max(1,a.vz), a.static, a.z-nwb[0][2]+ab[1][2])
                                a.notifyCollisions(2, nw.static ? Math.max(1,Math.abs(a.vz)) : Math.max(1,-nw.vz), nw.static, nw.z-nwb[0][2]+ab[1][2])
                            }
                            if(a.z > nw.z && a.vz <= nw.vz && (Math.abs(nwb[0][2]+nwb[1][2])<10 || a.z+ab[0][2] >= nw.z+nwb[1][2]-10) && a.z+ab[0][2] < nw.z+nwb[1][2]){
                                nw.notifyCollisions(2, a.static ? Math.max(1,Math.abs(nw.vz)) : Math.max(1,-a.vz), a.static, a.z+nwb[1][2]-ab[0][2])
                                a.notifyCollisions(5, nw.static ? Math.max(1,Math.abs(-a.vx)) : Math.max(1,nw.vz), nw.static, nw.z+nwb[1][2]-ab[0][2])
                            }
                        }
                        
                        if(
                            (nw.y-nwvy - a.y+avy <= ab[1][1] - nwb[0][1] && a.y-avy - nw.y+nwvy <= -ab[0][1] + nwb[1][1]) &&
                            (nw.z - a.z <= ab[1][2] - nwb[0][2]-10 && a.z - nw.z <= -ab[0][2] + nwb[1][2]-10)
                        ){
                            if( Math.min(Math.abs(a.x-a.vx+ab[1][0] - nw.x+nw.vx-nwb[0][0]),Math.abs(-a.x+a.vx-ab[0][0] + nw.x-nw.vx+nwb[1][0])) <
                                Math.min(Math.abs(ay-avy+ab[1][1] - nwy+nwvy-nwb[0][1]),Math.abs(-ay+a.vy-ab[0][1] + nwy-nwvy+nwb[1][1]))
                                &&
                                Math.min(Math.abs(a.x-a.vx+ab[1][0] - nw.x+nw.vx-nwb[0][0]),Math.abs(-a.x+a.vx-ab[0][0] + nw.x-nw.vx+nwb[1][0])) <
                                Math.min(Math.abs(a.z-a.vz+ab[1][2] - nw.z+nw.vz-nwb[0][2]),Math.abs(-a.z+a.vz-ab[0][2] + nw.z-nw.vz+nwb[1][2]))
                            ){
                                if(a.x-a.vx < nw.x-nw.vx && a.vx >= nw.vx && a.x+ab[1][0] > nw.x+nwb[0][0]){
                                    nw.notifyCollisions(3, a.static ? Math.max(0,Math.abs(-nw.vx)) : Math.max(1,a.vx), a.static, a.x+ab[1][0])
                                    a.notifyCollisions(0, nw.static ? Math.max(0,Math.abs(a.vx)) : Math.max(1,-nw.vx), nw.static, nw.x-nwb[0][0])
                                }
                                if(a.x-a.vx > nw.x-nw.vx && a.vx <= nw.vx && a.x+ab[0][0] < nw.x+nwb[1][0]){
                                    nw.notifyCollisions(0, a.static ? Math.max(0,Math.abs(nw.vx)) : Math.max(1,-a.vx), a.static, a.x-ab[0][0])
                                    a.notifyCollisions(3, nw.static ? Math.max(0,Math.abs(-a.vx)) : Math.max(1,nw.vx), nw.static, nw.x+nwb[1][0])
                                    
                                }
                            }
                        }
                        if(
                            (nwx-nwvx - ax+avx <= ab[1][0] - nwb[0][0] && ax-avx - nwx+nwvx <= -ab[0][0] + nwb[1][0]) &&
                            (nw.z - a.z <= ab[1][2] - nwb[0][2]-10 && a.z - nw.z <= -ab[0][2] + nwb[1][2]-10)
                        ){
                            if( Math.min(Math.abs(ay-avy+ab[1][1] - nwy+nwvy-nwb[0][1]),Math.abs(-ay+avy-ab[0][1] + nwy-nwvy+nwb[1][1])) <
                                Math.min(Math.abs(ax-avx+ab[1][0] - nwx+nwvx-nwb[0][0]),Math.abs(-ax+avx-ab[0][0] + nwx-nwvx+nwb[1][0]))
                                &&
                                Math.min(Math.abs(ay-avy+ab[1][1] - nwy+nwvy-nwb[0][1]),Math.abs(-ay+avy-ab[0][1] + nwy-nwvy+nwb[1][1])) <
                                Math.min(Math.abs(a.z-a.vz+ab[1][2] - nw.z+nw.vz-nwb[0][2]),Math.abs(-a.z+a.vz-ab[0][2] + nw.z-nw.vz+nwb[1][2]))
                            ){
                                if(ay-avy < nwy-nwvy && avy >= nwvy && ay+ab[1][1] > nwy+nwb[0][1]){
                                    nw.notifyCollisions(4, a.static ? Math.max(0,Math.abs(-nwvy)) :  Math.max(1,avy), a.static, ay+ab[1][1])
                                    a.notifyCollisions(1, nw.static ? Math.max(0,Math.abs(avy)) :  Math.max(1,-nwvy), nw.static, nwy-nwb[0][1])
                                }
                                if(ay-avy > nwy-nwvy && avy <= nwvy && ay+ab[0][1] < nwy+nwb[1][1]){
                                    nw.notifyCollisions(1, a.static ? Math.max(0,Math.abs(nwvy)) :   Math.max(1,-avy), a.static, ay-ab[0][1])
                                    a.notifyCollisions(4, nw.static ? Math.max(0,Math.abs(-avy)) :   Math.max(1,nwvy), nw.static, nwy+nwb[1][1])
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
        
        /*
        this.cam.setRotation(this.gamer.rotation)
        this.cam.setX(this.gamer.x)
        this.cam.setY(this.gamer.y)
        this.cam.setZ(this.gamer.z)
        */
        
        if(this.keypressed["ArrowLeft"]){
            this.cam.setRotation(rot + 5)
        }
        if(this.keypressed["ArrowRight"]){
            this.cam.setRotation(rot - 5)
        }
        
        var veloc = 20 / this.cam.getMagnification()
        
        if(this.keypressed["ArrowUp"]){
            this.cam.setX(x + Math.sin(rot*Math.PI/180) * veloc)
            this.cam.setY(y + Math.cos(rot*Math.PI/180) * veloc)
        }
        if(this.keypressed["ArrowDown"]){
            this.cam.setX(x - Math.sin(rot*Math.PI/180) * veloc)
            this.cam.setY(y - Math.cos(rot*Math.PI/180) * veloc)
        }
        
        
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
    
        for(var i in this.elements){
            var elem = this.elements[i]
            
            var bound = elem.getBounds()
            var b1x = this.cam.degreesToPixels(elem.x+bound[0][0],elem.y+bound[0][1],this.canvas.bounds,true,elem.z+bound[0][2])
            var b1y = this.cam.degreesToPixels(elem.x+bound[0][0],elem.y+bound[0][1],this.canvas.bounds,false,elem.z+bound[0][2])
            var b2x = this.cam.degreesToPixels(elem.x+bound[1][0],elem.y+bound[1][1],this.canvas.bounds,true,elem.z+bound[1][2])
            var b2y = this.cam.degreesToPixels(elem.x+bound[1][0],elem.y+bound[1][1],this.canvas.bounds,false,elem.z+bound[1][2])
            
            var c1x = Math.min(b1x,b2x)
            var c2x = Math.max(b1x,b2x)
            var c1y = Math.min(b1y,b2y)
            var c2y = Math.max(b1y,b2y)
            if(c1x <= x && x <= c2x && c1y <= y && y <= c2y){
                elem.hoverReact()
            }
        }
        //this.camera.setMousePosition(x,y)
        
    }
    mouseDown(e){
        var x = e.clientX - this.canvas.bounds.left
        var y = e.clientY - this.canvas.bounds.top
        
        for(var i in this.elements){
            var elem = this.elements[i]
            
            var bound = elem.getBounds()
            var b1x = this.cam.degreesToPixels(elem.x+bound[0][0],elem.y+bound[0][1],this.canvas.bounds,true,elem.z+bound[0][2])
            var b1y = this.cam.degreesToPixels(elem.x+bound[0][0],elem.y+bound[0][1],this.canvas.bounds,false,elem.z+bound[0][2])
            var b2x = this.cam.degreesToPixels(elem.x+bound[1][0],elem.y+bound[1][1],this.canvas.bounds,true,elem.z+bound[1][2])
            var b2y = this.cam.degreesToPixels(elem.x+bound[1][0],elem.y+bound[1][1],this.canvas.bounds,false,elem.z+bound[1][2])
            
            var c1x = Math.min(b1x,b2x)
            var c2x = Math.max(b1x,b2x)
            var c1y = Math.min(b1y,b2y)
            var c2y = Math.max(b1y,b2y)
            if(c1x <= x && x <= c2x && c1y <= y && y <= c2y){
                elem.clickReact(this.cam)
            }
        }
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
        this.hidable = false
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
    hoverReact(){
        
    }
    clickReact(camera){
        
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
        var pts
        
        var pt_w = -objBounds[0][0]+objBounds[1][0]
        var pt_h = -objBounds[0][1]+objBounds[1][1]
        
        if(pt_w > pt_h){
            var dif = (pt_w-pt_h)/2
            pts = [
                [this.x-dif,this.y,this.z],
                [this.x+dif,this.y,this.z],
                [this.x-dif,this.y,this.z],
                [this.x+dif,this.y,this.z],
            ]
        } else if(pt_w <= pt_h) {
            var dif = (pt_h-pt_w)/2
            pts = [
                [this.x,this.y-dif,this.z],
                [this.x,this.y-dif,this.z],
                [this.x,this.y+dif,this.z],
                [this.x,this.y+dif,this.z],
            ]
            
        } else {
            pts = [
                [this.x,this.y,this.z],
                [this.x,this.y,this.z],
                [this.x,this.y,this.z],
                [this.x,this.y,this.z],
            ]
            
        }
        
        var pts2 = [
            [this.x+objBounds[0][0],this.y+objBounds[0][1],this.z],
            [this.x+objBounds[1][0],this.y+objBounds[0][1],this.z],
            [this.x+objBounds[0][0],this.y+objBounds[1][1],this.z],
            [this.x+objBounds[1][0],this.y+objBounds[1][1],this.z]
        ]        
        //degreesToPixels(x,y,bounds,getx,z)
        
        var minx = pts[0]
        var maxx = pts[0]
        for(var i = 1;i<4;i++){
            if(camera.degreesToPixels(pts[i][0],pts[i][1],cameraBounds,true,pts[i][2]) < camera.degreesToPixels(minx[0],minx[1],cameraBounds,true,minx[2]))
                minx = pts[i]
            if(camera.degreesToPixels(pts[i][0],pts[i][1],cameraBounds,true,pts[i][2]) > camera.degreesToPixels(maxx[0],maxx[1],cameraBounds,true,maxx[2]))
                maxx = pts[i]
        }
        var minx2 = pts2[0]
        var maxx2 = pts2[0]
        for(var i = 1;i<4;i++){
            if(camera.degreesToPixels(pts2[i][0],pts2[i][1],cameraBounds,true,pts2[i][2]) < camera.degreesToPixels(minx2[0],minx2[1],cameraBounds,true,minx2[2]))
                minx2 = pts2[i]
            if(camera.degreesToPixels(pts2[i][0],pts2[i][1],cameraBounds,true,pts2[i][2]) > camera.degreesToPixels(maxx2[0],maxx2[1],cameraBounds,true,maxx2[2]))
                maxx2 = pts2[i]
        }
        var minx3 = pts2[0]
        var maxx3 = pts2[0]
        for(var i = 1;i<4;i++){
            if(camera.degreesToPixels(pts2[i][0],pts2[i][1],cameraBounds,false,pts2[i][2]) < camera.degreesToPixels(minx3[0],minx3[1],cameraBounds,false,minx3[2]))
                minx3 = pts2[i]
            if(camera.degreesToPixels(pts2[i][0],pts2[i][1],cameraBounds,false,pts2[i][2]) > camera.degreesToPixels(maxx3[0],maxx3[1],cameraBounds,false,maxx3[2]))
                maxx3 = pts2[i]
        }
        
        return [
            camera.degreesToPixels(minx[0],minx[1],cameraBounds,true,minx[2]), camera.degreesToPixels(maxx[0],maxx[1],cameraBounds,true,maxx[2]),
            camera.degreesToPixels(minx[0],minx[1],cameraBounds,false,minx[2]), camera.degreesToPixels(maxx[0],maxx[1],cameraBounds,false,maxx[2]),
            this.z+objBounds[0][2],this.z+objBounds[1][2],
            camera.degreesToPixels(minx2[0],minx2[1],cameraBounds,true,minx2[2]), camera.degreesToPixels(maxx2[0],maxx2[1],cameraBounds,true,maxx2[2]),
            camera.degreesToPixels(minx3[0],minx3[1],cameraBounds,false,minx3[2]), camera.degreesToPixels(maxx3[0],maxx3[1],cameraBounds,false,maxx3[2]), //depth
            camera.degreesToPixels(minx[0],minx[1],cameraBounds,false,0), camera.degreesToPixels(maxx[0],maxx[1],cameraBounds,false,0),
            
        ]
        /*
         
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
         * */
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
        //this.refreshDrawing()
        if(solid && index != 2 && index != 5){
            this.revertLastPosition(index)
        }
        
        var MOVE = 15
        switch(index){
            case 0: 
            if(solid && this.x > border && border !== undefined){
                this.x = this.x > border+MOVE ? this.x-MOVE : border-1
                this.vx = 0
            }
            //this.x -= force; 
            if(this.vx > 0)
                this.vx = -this.vx/2
            break
            case 1: 
            if(solid && this.y > border && border !== undefined){
                this.y = this.y > border+MOVE ? this.y-MOVE : border-1
                this.vy = 0
            }
            //this.y -= force; 
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
                this.vx = 0
            }
            //this.x += force; 
            if(this.vx < 0)
                this.vx = -this.vx/2
            break
            case 4: 
            if(solid && this.y < border && border !== undefined){
                this.y = this.y < border-MOVE ? this.y+MOVE :border+1
                //this.vy = 0
            }
            //this.y += force; 
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

function normalCorrdsCube(color,x1,y1,z1,x2,y2,z2){
    return new Cube(color,(x1+x2)/2,(y1+y2)/2,z1,(x2-x1)/2,(y2-y1)/2,z2-z1)
}


class Star extends StaticGameObject{
    constructor(color,x,y,z,w,h,name,data){
        super(x,y,z,0)
        this.widthx = w
        this.widthy = w
        this.height = h
        this.color = color
        this.hidable = false
        
        this.name = name
        this.data = data
    }
    move(){
        
    }
    hoverReact(){
        window.status = this.name
    }
    clickReact(camera){
        camera.setX(this.x)
        camera.setY(this.y)
        camera.setZ(this.z)
    }
    generateBounds(){
        return [[-this.widthx,-this.widthy,-this.height],[this.widthx,this.widthy,this.height]]
    }
    render(){
        var x1 = -this.widthx
        var x2 = +this.widthx
        var y1 = -this.widthy
        var y2 = +this.widthy
        var z1 = -this.height
        var z2 = this.height
        return {
            x:this.x,
            y:this.y,
            z:this.z,
            rotation:this.rotation,
            objs:[
                {type:"ball",stroke:'#fff',fill:this.color,coords:
                    [[-this.widthx,-this.widthy,-this.height],[this.widthx,this.widthy,this.height]]},
                {type:"text",stroke:'#0000',fill:"#fff",text:this.name,size:10,coord:[0,0,z2+5]},
                    //{type:"line",stroke:"#fff",coords:[[0,0,0], [0,0,-this.z]]},
                    //{type:"line",stroke:"#fff",coords:[[0,0,-this.z], [-this.x,-this.y,-this.z]]},
                /*
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
                },*/
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
        this.hidable = true
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
        
        this.static = true
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

