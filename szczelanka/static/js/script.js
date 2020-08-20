
class Camera {
    constructor(oldCamera){
        this.x = 0
        this.y = 0
        this.z = 0
        this.skewed = 0.5
        this.rotation = 60 * Math.PI / 180
        this.magnification = 3
        if(oldCamera !== undefined){
            if(oldCamera.x)
                this.x = oldCamera.x
            if(oldCamera.y)
                this.y = oldCamera.y
            if(oldCamera.magnification)
                this.magnification = oldCamera.magnification
        }
        
        this.moving = false
        this.pixelSize = 1/this.magnification
    }
    
    getX(){ return this.x }
    setX(x){ this.x = x }
    
    getY(){ return this.y }
    setY(y){ this.y = y }
    
    getZ(){ return this.z }
    setZ(y){ this.z = z }
    
    getRotation(){ return this.rotation / Math.PI * 180 }
    setRotation(r){ this.rotation = r * Math.PI / 180 }
    
    getSkewed(){ return this.skewed }
    getAntiSkewed(){ return Math.sqrt(1 - this.skewed * this.skewed) }
    setSkewed(skewed){ this.skewed = Math.min(Math.max(skewed,0),1) }
    
    getMouseX() { return this.mouseX }
    getMouseY() { return this.mouseY }
    setMousePosition(x,y) { this.mouseX = x; this.mouseY = y}
    
    degreesToPixels(x,y,bounds,getx,z){
        if(z === undefined)
            z = 0
        var rotx = (this.x-x) * Math.cos(this.rotation) - (this.y-y) * Math.sin(this.rotation)
        var roty = (this.x-x) * Math.sin(this.rotation) + (this.y-y) * Math.cos(this.rotation)
        return getx 
                ? 
            (/*this.x + */rotx) * this.magnification + bounds.width/2
                :
            (/*this.y + */roty * this.skewed  + (this.z-z)*this.getAntiSkewed()) * this.magnification + bounds.height/2
    }
    getAbsoluteY(x,y,bounds){
        var roty = (this.x-x) * Math.sin(this.rotation) + (this.y-y) * Math.cos(this.rotation)
        return (roty * this.skewed) * this.magnification + bounds.height/2
    }
    checkIfFits(objwithXandY,bounds){
        var padding = 10
        var x = this.degreesToPixels(objwithXandY.x,objwithXandY.y,bounds,true,objwithXandY.z)
        var y = this.degreesToPixels(objwithXandY.x,objwithXandY.y,bounds,false,objwithXandY.z)
        return x > -padding && y > -padding && x < bounds.width+padding && y < bounds.height+padding
    }
    
    /*
    pixelsToDegrees(x,y,bounds,getx,z){
        //var derotx = x * Math.cos(-this.rotation) + y * Math.sin(-this.rotation)
        //var deroty = -x * Math.sin(-this.rotation) + y * Math.cos(-this.rotation)
        return getx 
                ?
            (x - bounds.width/2) / this.magnification - this.x
                :
            (-(y - bounds.height/2) / this.magnification - this.y)/this.skewed
    }*/
    
    getPixelSize(){
        this.pixelSize = 1 / this.magnification
        return this.pixelSize
    }
    
    // (number of pixels)/1degree, not incremented, but multiplied by a factor
    getMagnification(){ return this.magnification }
    setMagnification(magnification){ 
        var MIN_MAGNIFICATION = 0.5
        var MAX_MAGNIFICATION = 1000
        if(magnification < MIN_MAGNIFICATION)
            this.magnification = MIN_MAGNIFICATION
        else if(magnification > MAX_MAGNIFICATION)
            this.magnification = MAX_MAGNIFICATION
        else
            this.magnification = magnification
    }
    
    startMoving(movx,movy){
        this.startx = this.x
        this.starty = this.y
        this.startmovx = movx
        this.startmovy = movy
        this.movx = movx
        this.movy = movy
        this.moving = true
    }
    actualizeMoving(movx,movy){
        this.movx = movx
        this.movy = movy
        
        this.x = this.startx + (this.movx-this.startmovx) / this.magnification
        this.y = this.starty - (this.movy-this.startmovy) / this.magnification
    }
    stopMoving(){
        this.moving = false
    }
    getDegrees(){
        
    }
    
}
class AbstractCanvas {
    constructor(canvasElement,parentDiv,gameModel){
        this.canvasElement = canvasElement
        this.parentDiv = parentDiv
        this.gameModel = gameModel
        this.bounds = null
        
        this.styles = {
            lineWidth: 1,
            strokeStyle: "#000",
            fillStyle: "#000",
            textSize: 16,
            font: "Helvetica",
        }
        
        this.camera = new Camera()
        this.cameratimeout = undefined
        this.rerendertimeout = undefined
        
        this.actualizeBounds()
    }
    setStyle(styles){
        for(var style in styles){
            this.styles[style] = styles[style]
        }
        for(var style in styles){
            this.setParticularStyle(style)
        }
    }
    
    mouseMove(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
    
        
        if(this.camera.moving){
            //this.camera.actualizeMoving(x,y)
            
            var t = this
            if(!this.cameratimeout)
                this.cameratimeout = setTimeout(
                function(ev){
                    t.draw()
                    t.cameratimeout = undefined
                }
                ,50)
        }
        
        this.camera.setMousePosition(x,y)
        
    }
    mouseDown(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
        
        //this.camera.startMoving(x,y)
    }
    mouseUp(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
    
        //this.camera.stopMoving(x,y)
        
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.draw()
            }
            ,50)
    }
    wheel(e){/*
        var delta = event.deltaY

        var magnification = this.camera.getMagnification()
        
        this.camera.setMagnification(magnification / (1 + delta * 0.1 ))
        
        this.draw()
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.draw()
            }
            ,500)*/
    }
    
    actualizeBounds(){
        var bounds = this.parentDiv.getBoundingClientRect()
        this.bounds = bounds
        
        this.initializeContext()
        this.setStyle(this.styles)
        this.draw()
    }
    actualizeElementSize(){
        var bounds = this.parentDiv.getBoundingClientRect()
        console.log(bounds)
        this.canvasElement.width = bounds.width
        this.canvasElement.height = bounds.height-5
        
        this.bounds = bounds
    }
    
    draw(){
        this.clear()
        this.setStyle({strokeStyle:"#000",fillStyle:"#ddffdd",lineWidth:1})
        this.drawGrid()
        this.drawThings()
    }
    getDegreeBounds(){
        return {
            left: this.degreeBoundsLeft,
            right: this.degreeBoundsRight,
            top: this.degreeBoundsTop,
            bottom: this.degreeBoundsBottom,
        }
    }
    
    drawThings(){
        this.setStyle({strokeStyle:"#000",fillStyle:"#fff",lineWidth:2})
        var things = this.gameModel.elements.filter(x=>this.camera.checkIfFits(x,this.bounds)).sort((a,b)=>this.camera.getAbsoluteY(a.x,a.y,this.bounds)-this.camera.getAbsoluteY(b.x,b.y,this.bounds))
        for(var i in things){
            this.drawThing(things[i].render())
        }
    }
    drawThing(rendered){
        for(var i in rendered.objs){
            var obj = rendered.objs[i]
            this.setStyle({strokeStyle:(obj.stroke ? obj.stroke : "#000"),fillStyle:(obj.fill ? obj.fill : "#fff"),lineWidth:2})
            switch(obj.type){
                case "line":
                    this.drawPolyLine(obj.coords,false,rendered.x,rendered.y,rendered.z,rendered.rotation)
                    break
                case "ball":
                    this.drawBall(obj.coords,false,rendered.x,rendered.y,rendered.z)
                    break
            }
        }
    }
    drawGrid(){
        var cam = this.camera
        this.bounds = this.parentDiv.getBoundingClientRect()
        
        var widthInDegrees = this.bounds.width/cam.getMagnification()
        var heightInDegrees = this.bounds.height/cam.getMagnification()

        var gridScale = Math.pow(10, Math.ceil( Math.log10 ( 20 / cam.getMagnification() ) ) )
        
        var rot = (cam.getRotation()) / 180 * Math.PI
    
        this.degreeBoundsLeft = - widthInDegrees
        this.degreeBoundsRight = + widthInDegrees
        this.degreeBoundsTop = - heightInDegrees
        this.degreeBoundsBottom = + heightInDegrees
        
        var skewed = cam.getSkewed()
        
        var leftScaled = Math.ceil( this.degreeBoundsLeft / gridScale ) * gridScale
        var topScaled = Math.ceil( this.degreeBoundsTop / gridScale / skewed ) * gridScale
        var rightScaled = Math.ceil( this.degreeBoundsRight / gridScale ) * gridScale
        var bottomScaled = Math.ceil( this.degreeBoundsBottom / gridScale / skewed ) * gridScale
        
        var leftScaled = Math.max(leftScaled-gridScale,-180*4)
        var rightScaled = Math.min(rightScaled+gridScale,180*4)
        var topScaled = Math.max(topScaled-gridScale,-90*4)
        var bottomScaled = Math.min(bottomScaled+gridScale,90*4)
        
        this.setStyle({strokeStyle:"#55d"})
        
        for(var d = leftScaled;d <= rightScaled;d+=gridScale){
            this.drawLine(d,topScaled,d,bottomScaled)
        }
        this.drawLine(rightScaled,topScaled,rightScaled,bottomScaled)
        
        for(var d = topScaled;d <= bottomScaled;d+=gridScale){
            this.drawLine(leftScaled,d,rightScaled,d)
        }
        this.drawLine(leftScaled,bottomScaled,rightScaled,bottomScaled)
        
        //console.log(widthInDegrees+" "+heightInDegrees+" "+gridScale)
    }
}
class WebGLCanvas extends AbstractCanvas {
    initializeContext(){
        this.context = this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl")
    }
    drawLine(x1,y1,x2,y2){
        
    }
}
class TwoDCanvas extends AbstractCanvas {
    initializeContext(){
        this.context = this.canvasElement.getContext("2d")
    }
    setParticularStyle(style){
        switch(style){
            case "lineWidth":
                this.context.lineWidth = this.styles[style]
                break
            case "strokeStyle":
                this.context.strokeStyle = this.styles[style]
                break
            case "fillStyle":
                this.context.fillStyle = this.styles[style]
                break
            case "textSize":
            case "font":
                this.context.font = this.styles["textSize"] + "px " + this.styles["font"]
                break
        }
    }
    clear(){
        this.context.clearRect(0,0,this.bounds.width,this.bounds.height)
    }
    drawLine(x1,y1,x2,y2,z1,z2){
        var points1x = this.camera.degreesToPixels(x1,y1,this.bounds,true,z1)
        var points1y = this.camera.degreesToPixels(x1,y1,this.bounds,false,z1)
        var points2x = this.camera.degreesToPixels(x2,y2,this.bounds,true,z2)
        var points2y = this.camera.degreesToPixels(x2,y2,this.bounds,false,z2)
        
        this.context.beginPath()
        this.context.moveTo(points1x,points1y)
        this.context.lineTo(points2x,points2y)
        this.context.stroke()
        this.context.closePath()
    }
    drawPoint(x,y){
        var pointx = this.camera.degreesToPixels(x,y,this.bounds,true)
        var pointy = this.camera.degreesToPixels(x,y,this.bounds,false)
        
        this.context.beginPath()
        this.context.moveTo(pointx-2.5,pointy)
        this.context.lineTo(pointx+2.5,pointy)
        this.context.stroke()
        
        this.context.beginPath()
        this.context.moveTo(pointx,pointy-2.5)
        this.context.lineTo(pointx,pointy+2.5)
        this.context.stroke()
    }
    drawPolyLine(line, closed,x,y,z,rotation){
        
        if(line.length === 0)
            return
            
        this.context.beginPath()
        
        var sin = Math.sin(rotation*Math.PI/180)
        var cos = Math.cos(rotation*Math.PI/180)
        
        var x1,y1
        for(var point in line){
            var pointx = this.camera.degreesToPixels(
                line[point][0]*cos+line[point][1]*sin+x,
                -line[point][0]*sin+line[point][1]*cos+y,
                this.bounds,true,line[point][2]+z)
            var pointy = this.camera.degreesToPixels(
                line[point][0]*cos+line[point][1]*sin+x,
                -line[point][0]*sin+line[point][1]*cos+y,
                this.bounds,false,line[point][2]+z)
            
            if(point === 0){
                this.context.moveTo(pointx,pointy)  
                x1 = pointx
                y1 = pointy
            } else
                this.context.lineTo(pointx,pointy)
        }
        if(closed)
            this.context.lineTo(x1,y1)
        this.context.stroke()
        //if(closed)
        //    this.context.fill()
        this.context.closePath()
    }
    drawBall(coords, closed,x,y,z){
        
        if(coords.length === 0)
            return
            
        this.context.beginPath()
            
        var point1x = this.camera.degreesToPixels(coords[0][0]+x,coords[0][1]+y,this.bounds,true,coords[0][2]+z)
        var point1y = this.camera.degreesToPixels(coords[0][0]+x,coords[0][1]+y,this.bounds,false,coords[0][2]+z)
        var point2x = this.camera.degreesToPixels(coords[1][0]+x,coords[1][1]+y,this.bounds,true,coords[1][2]+z)
        var point2y = this.camera.degreesToPixels(coords[1][0]+x,coords[1][1]+y,this.bounds,false,coords[1][2]+z)
        
        var cx = (point2x+point1x)/2
        var cy = (point2y+point1y)/2
        var rx = Math.max(Math.abs(coords[0][0]-coords[1][0]),Math.abs(coords[0][1]-coords[1][1])) * this.camera.getMagnification()/2
        var ry = (
            Math.abs(coords[0][2]-coords[1][2]) * this.camera.getMagnification() * this.camera.getAntiSkewed()/2
            +
            rx * (1 - this.camera.getAntiSkewed()))
        
        this.context.save(); // save state
        this.context.beginPath();

        this.context.translate(cx-rx, cy-ry);
        this.context.scale(rx, ry);
        this.context.arc(1, 1, 1, 0, 2 * Math.PI, false);

        this.context.restore(); // restore to original state
        
        this.context.fill()
        this.context.stroke()
    }
    drawPolygon(polygon){
        
        if(polygon.length === 0)
            return
            
        var firstPoint = true

        this.context.beginPath()
        var x1,y1
        for(var i in polygon){
            var line = polygon[i]
                
            for(var point in line){
                var pointx = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,true)
                var pointy = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,false)
                if(point === 0){
                    if(firstPoint)
                        this.context.moveTo(pointx,pointy)
                    else
                        this.context.lineTo(pointx,pointy)
                    firstPoint = false
                    x1 = pointx
                    y1 = pointy
                } else
                    this.context.lineTo(pointx,pointy)
            }
            if(x1)
                this.context.lineTo(x1,y1)
        }
        this.context.fill()
        this.context.closePath()
        
        for(var i in polygon){
            var line = polygon[i]
            if(line.length === 0)
                continue
                
            this.context.beginPath()
            var x1,y1
            for(var point in line){
                var pointx = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,true)
                var pointy = this.camera.degreesToPixels(line[point][0],line[point][1],this.bounds,false)
                if(point === 0){
                    this.context.moveTo(pointx,pointy)
                    x1 = pointx
                    y1 = pointy
                } else
                    this.context.lineTo(pointx,pointy)
            }
            this.context.lineTo(x1,y1)
            this.context.closePath()
            this.context.stroke()
        }
    }
}
class Controller {
    constructor(canvas, gameModel){
        this.moving = false
        this.canvas = canvas
        this.gameModel = gameModel
        window.addEventListener("mousemove",e=>this.mouseMove(e))
        window.addEventListener("mouseup",e=>this.mouseUp(e))
        window.addEventListener("resize",e=>this.windowResize(e))
        
        /*
        this.canvas.canvasElement.addEventListener("mousedown",e=>this.canvas.mouseDown(e))
        this.canvas.canvasElement.addEventListener("mousemove",e=>this.canvas.mouseMove(e))
        this.canvas.canvasElement.addEventListener("mouseup",e=>this.canvas.mouseUp(e))
        this.canvas.canvasElement.addEventListener("wheel",e=>this.canvas.wheel(e))
        */
        
        
        this.actualizeRightPanel()
        this.timeout = undefined
    }
    mouseDown(e){
        this.moving = true
        this.startX = e.clientX;
    }
    mouseMove(e){
        if(this.moving){
            var x = e.clientX;
            var newx = x-this.startX+this.startpos;
            var lwidth = Math.max(100,newx)
            this.actualizeRightPanel()
            //this.rightpanel.style.marginLeft = (lwidth + 20)+"px"
        }
    }
    mouseUp(e){
        this.moving = false
        this.canvas.mouseUp(e)
    }
    wheel(e){
        this.canvas.wheel(e)
    }
    windowResize(e){
        this.actualizeRightPanel()
    }
    actualizeRightPanel(){
        var bodywidth = document.body.getBoundingClientRect().width
        
        this.canvas.actualizeElementSize()
        
        var t = this
        clearTimeout(this.timeout)
        this.timeout = setTimeout(
            function(ev){
                t.canvas.actualizeBounds()
            }
            ,50)
    }
}
function detectWebGL(){
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl && gl instanceof WebGLRenderingContext
}
function init(){
    
    let stageDiv = document.getElementById("stage")
    let canvasElement = document.getElementById("canv")
    
    let gameModel = new GameModel()
    
    let canvas
    if(false && detectWebGL()){
        canvas = new WebGLCanvas(canvasElement,stageDiv,gameModel)
    } else {
        canvas = new TwoDCanvas(canvasElement,stageDiv,gameModel)
    }
    let movlist = new Controller(canvas,gameModel);
    
    gameModel.addCanvas(canvas)
    
    canvas.actualizeBounds()
}
addEventListener("load",init);

