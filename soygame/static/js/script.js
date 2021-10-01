
class Camera {
    constructor(oldCamera){
        this.x = 0
        this.y = 0
        if(oldCamera !== undefined){
            if(oldCamera.x)
                this.x = oldCamera.x
            if(oldCamera.y)
                this.y = oldCamera.y
        }
        
        this.moving = false
    }
    
    getX(){ return this.x }
    setX(x){ this.x = x }
    
    getY(){ return this.y }
    setY(y){ this.y = y }
    
    degreesToPixels(x,y,getx,bounds){
        var rotx = -(this.x-x) + bounds.width/2
        var roty = (this.y-y) + bounds.height/2
        return getx ? rotx : roty
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
        
        this.x = this.startx + (this.movx-this.startmovx)
        this.y = this.starty - (this.movy-this.startmovy)
    }
    stopMoving(){
        this.moving = false
    }
    getDegrees(){
        
    }
    
}
class AbstractCanvas {
    constructor(canvasElement,parentDiv,gameModel,imgs){
        this.canvasElement = canvasElement
        this.parentDiv = parentDiv
        this.gameModel = gameModel 
        this.bounds = null
        
        this.images = imgs
        
        this.styles = {
            lineWidth: 1,
            strokeStyle: "#000",
            fillStyle: "#000",
            textSize: 16,
            font: "Helvetica",
        }
        this.degreeBounds = {}
        
        this.camera = new Camera()
        this.cameratimeout = undefined
        this.rerendertimeout = undefined
        
        this.actualizeBounds()
    }
    addImages(dict){
        for(var i in dict){
            this.images[i] = dict[i]
        }
    }
    setStyle(styles){
        for(var style in styles){
            this.styles[style] = styles[style]
        }
        for(var style in styles){
            this.setParticularStyle(style)
        }
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
        
        this.canvasElement.width = bounds.width
        this.canvasElement.height = bounds.height-5
        
        this.bounds = bounds
    }
    
    keydown(e){
        this.gameModel.keydown(e)
    }
    keyup(e){
        this.gameModel.keyup(e)
    }
    draw(){
        this.clear()
        this.setStyle({strokeStyle:"#000",fillStyle:"#ddffdd",lineWidth:this.camera.magnification/2})
        this.drawThings()
        this.gameModel.drawPanel(this.context)
    }
    getDegreeBounds(){
        this.degreeBounds.left = this.degreeBoundsLeft
        this.degreeBounds.right = this.degreeBoundsRight
        this.degreeBounds.top = this.degreeBoundsTop
        this.degreeBounds.bottom = this.degreeBoundsBottom
        
        return this.degreeBounds
    }
    drawThings(){
        this.setStyle({strokeStyle:"#000",fillStyle:"#fff",lineWidth:this.camera.magnification})
        var things = this.gameModel.elements
        for(var i in things){
            var th = things[i]
            var bounds = th.getBounds()
            if(this.bounds[0] > th.x+bounds[2] || this.bounds[2] < th.x+bounds[0] || this.bounds[1] > th.y+bounds[3] || this.bounds[3] < th.y+bounds[1])
                continue
            this.drawThing(th.getThing(),th.x,th.y)
        }
    }
    drawThing(rendered,thx,thy){
        var t = this
        var objs = rendered.objs
        
        for(var i in objs){
            var obj = objs[i]
            this.setStyle({strokeStyle:(obj.stroke ? obj.stroke : "#000"),fillStyle:(obj.fill ? obj.fill : "#fff"),lineWidth:2,globalAlpha:(obj.alpha ? obj.alpha/100 : 1)})
            switch(obj.type){
                case "image":
                    this.drawImage(obj.src,thx,thy,obj.bounds,obj.flipped ? obj.flipped : false)
                    break
                case "line":
                    this.drawPolyLine(obj.coords,false,rendered.x,rendered.y)
                    break
                case "polygon":
                    this.drawPolygon(obj.coords,false,thx,thy)
                    break
                case "ball":
                    this.drawBall(obj.coords,false,rendered.x,rendered.y)
                    break
                case "text":
                    this.drawText(obj,thx+obj.x,thy+obj.y)
                    break
            }
        }
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
            case "globalAlpha":
                this.context.globalAlpha = this.styles[style]
                break
        }
    }
    clear(){
        this.context.clearRect(0,0,this.bounds.width,this.bounds.height)
    }
    drawText(src,x,y){
        var points1x = this.camera.degreesToPixels(x,y,true,this.bounds)
        var points1y = this.camera.degreesToPixels(x,y,false,this.bounds)
        
        this.context.font = src.font ? src.font : '20px sans-serif'
        this.context.textAlign = 'center'
        this.context.fillText(src.text,points1x,points1y)
    }
    drawImage(src,x,y,imgbounds,flipped){
        var points1x = this.camera.degreesToPixels(x+imgbounds[0],y+imgbounds[1],true,this.bounds)
        var points1y = this.camera.degreesToPixels(x+imgbounds[0],y+imgbounds[1],false,this.bounds)
        var points2x = this.camera.degreesToPixels(x+imgbounds[2],y+imgbounds[3],true,this.bounds)
        var points2y = this.camera.degreesToPixels(x+imgbounds[2],y+imgbounds[3],false,this.bounds)
        
        if(flipped){
            this.context.translate(points1x + (points2x-points1x)/2, points1y + (points2y-points1y)/2);
            this.context.scale(-1, 1);
            this.context.translate(-(points1x + (points2x-points1x)/2), -(points1y + (points2y-points1y)/2));
        }
        this.context.drawImage(this.images[src],points1x,points1y,points2x-points1x,points2y-points1y)
        if(flipped){
            this.context.translate(points1x + (points2x-points1x)/2, points1y + (points2y-points1y)/2);
            this.context.scale(-1, 1);
            this.context.translate(-(points1x + (points2x-points1x)/2), -(points1y + (points2y-points1y)/2));
        }
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
    drawPolygon(line, closed,x,y){
        if(line.length === 0)
            return
            
        this.context.beginPath()
        
        var x1,y1
        for(var point in line){
            var pointx = this.camera.degreesToPixels(
                line[point][0]+x,
                line[point][1]+y,true,
                this.bounds)
            var pointy = this.camera.degreesToPixels(
                line[point][0]+x,
                line[point][1]+y,false,
                this.bounds)
            
            if(point === 0){
                this.context.moveTo(pointx,pointy)  
                x1 = pointx
                y1 = pointy
            } else
                this.context.lineTo(pointx,pointy)
        }
            this.context.lineTo(x1,y1)
        this.context.closePath()
        this.context.fill()
        this.context.stroke()
    }
}
class Controller {
    constructor(canvas, gameModel){
        this.moving = false
        this.canvas = canvas
        this.gameModel = gameModel
        window.addEventListener("resize",e=>this.windowResize(e))
        window.addEventListener("keydown",e=>this.keydown(e))
        window.addEventListener("keyup",e=>this.keyup(e))
        
        this.actualizeRightPanel()
        this.timeout = undefined
    }
    keydown(e){
        this.canvas.keydown(e)
    }
    keyup(e){
        this.canvas.keyup(e)
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

function loadElement(url) {
  return new Promise((resolve) => {
    const e = new Image();
    e.addEventListener("load", () => { resolve(e); });
    e.src = url;
  });
}

function loadImagesRec(urls,imgs){
    if(urls.length == 0){
        initAfterImageLoad(imgs)
    } else {
        var url = urls[0]
        var img = new Image();   // Create new img element
        img.addEventListener('load', function() {
            imgs[url] = img
            loadImagesRec(urls.slice(1),imgs)
        }, false);
        img.src = 'static/img/'+url; // Set source path
    }
}
function loadImages(urls){
    loadImagesRec(urls,{})
}

function init(){
    loadImages(['sojak.png','sojakdead.png','czud.png','czuddead.png','normal.png','throwing.png','throwed.png','pychota1.png','robal1.png','robal2.png','robal3.png','robal4.png','robal5.png','robal6.png','nigga.png','szwab.png','downvote.png','deading.png','dead.png','mask.png'])
}

function initAfterImageLoad(imgs){
    let stageDiv = document.getElementById("stage")
    let canvasElement = document.getElementById("canv")
    
    let gameModel = new GameModel()
    
    
    let canvas = new TwoDCanvas(canvasElement,stageDiv,gameModel,imgs)
    let movlist = new Controller(canvas,gameModel);
    
    gameModel.addCanvas(canvas)
    
    canvas.actualizeBounds()
}
addEventListener("load",init);

