
class Camera {
    constructor(oldCamera){
        this.x = 0
        this.y = 0
        this.magnification = 4
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
    
    getMouseX() { return this.mouseX }
    getMouseY() { return this.mouseY }
    setMousePosition(x,y) { this.mouseX = x; this.mouseY = y}
    
    degreesToPixels(x,y,bounds,getx){
        return getx 
                ? 
            (this.x + x) * this.magnification + bounds.width/2
                :
            -(this.y + y) * this.magnification + bounds.height/2
    }
    
    pixelsToDegrees(x,y,bounds,getx){
        return getx 
                ?
            (x - bounds.width/2) / this.magnification - this.x
                :
            -(y - bounds.height/2) / this.magnification - this.y
    }
    
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
    constructor(canvasElement,parentDiv,layerPanel){
        this.canvasElement = canvasElement
        this.parentDiv = parentDiv
        this.layerPanel = layerPanel
        this.bounds = null
        this.layerdata = null
        
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
            this.camera.actualizeMoving(x,y)
            
            var t = this
            if(!this.cameratimeout)
                this.cameratimeout = setTimeout(
                function(ev){
                    t.draw()
                    t.cameratimeout = undefined
                }
                ,100)
        }
        
        this.camera.setMousePosition(x,y)
        
        if(!this.camera.moving)
            actualizeBottomWithCoords(this.camera, this.bounds)
    }
    mouseDown(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
        
        this.camera.startMoving(x,y)
    }
    mouseUp(e){
        var x = e.clientX - this.bounds.left
        var y = e.clientY - this.bounds.top
    
        this.camera.stopMoving(x,y)
        actualizeBottomWithCoords(this.camera, this.bounds)
        
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.layerPanel.renderLayers(bounds, pixelSize)
                t.draw()
            }
            ,500)
    }
    wheel(e){
        var delta = event.deltaY

        var magnification = this.camera.getMagnification()
        
        this.camera.setMagnification(magnification / (1 + delta * 0.1 ))
        
        actualizeBottomWithCoords(this.camera, this.bounds)
        this.draw()
        var t = this
        clearTimeout(this.rerendertimeout)
        this.rerendertimeout = setTimeout(
            function(ev){
                var bounds = t.getDegreeBounds()
                var pixelSize = t.camera.getPixelSize()
                t.layerPanel.renderLayers(bounds, pixelSize)
                t.draw()
            }
            ,500)
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
        this.canvasElement.height = bounds.height
        
        this.bounds = bounds
    }
    
    draw(){
        this.clear()
        this.setStyle({strokeStyle:"#000",fillStyle:"#ddffdd"})
        this.drawLayer(this.layerPanel.layers)
        this.drawGrid()
    }
    getDegreeBounds(){
        return {
            left: this.degreeBoundsLeft,
            right: this.degreeBoundsRight,
            top: this.degreeBoundsTop,
            bottom: this.degreeBoundsBottom,
        }
    }
    drawGrid(){
        var cam = this.camera
        this.bounds = this.parentDiv.getBoundingClientRect()
        
        var widthInDegrees = this.bounds.width/cam.getMagnification()
        var heightInDegrees = this.bounds.height/cam.getMagnification()

        var gridScale = Math.pow(10, Math.ceil( Math.log10 ( 20 / cam.getMagnification() ) ) )
        
    
        this.degreeBoundsLeft = -cam.getX() - widthInDegrees / 2
        this.degreeBoundsRight = -cam.getX() + widthInDegrees / 2
        this.degreeBoundsTop = -cam.getY() - heightInDegrees / 2
        this.degreeBoundsBottom = -cam.getY() + heightInDegrees / 2
        
        var leftScaled = Math.ceil( this.degreeBoundsLeft / gridScale ) * gridScale
        var topScaled = Math.ceil( this.degreeBoundsTop / gridScale ) * gridScale
        var rightScaled = Math.ceil( this.degreeBoundsRight / gridScale ) * gridScale
        var bottomScaled = Math.ceil( this.degreeBoundsBottom / gridScale ) * gridScale
        var leftScaled = Math.max(leftScaled-gridScale,-180)
        var rightScaled = Math.min(rightScaled+gridScale,180)
        var topScaled = Math.max(topScaled-gridScale,-90)
        var bottomScaled = Math.min(bottomScaled+gridScale,90)
        
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
    drawLayer(layer){
        if(layer.drawable){
            this.drawLayerData(layer.rendered)
        }
        for(var i in layer.children){
            this.drawLayer(layer.children[i])
        }
    }
    drawLayerData(data, closed){
        if(data instanceof Object && "bbox" in data && (
            data.bbox[0] > this.degreeBoundsRight || 
            data.bbox[1] > this.degreeBoundsBottom || 
            data.bbox[2] < this.degreeBoundsLeft || 
            data.bbox[3] < this.degreeBoundsTop
        ))
            return
        
        if(data instanceof Array){
            var lastPoint = null
            for(var i in data){
                var elem = data[i]
                if(elem instanceof Array && elem.length>0 && elem[0] instanceof Array && elem[0].length>0 && typeof elem[0][0] === "number"){
                    this.drawPolyLine(elem,closed)
                } else if(elem instanceof Array && elem.length>0 && typeof elem[0] === "number"){
                    this.drawLine(elem[0]-1,elem[1],elem[0]+1,elem[1])
                    this.drawLine(elem[0],elem[1]-1,elem[0],elem[1]+1)
                } else {
                    this.drawLayerData(elem,closed)
                }
                /* if(lastPoint === null) {
                    lastPoint = elem
                } else {
                    this.drawLine(lastPoint[0],lastPoint[1],elem[0],elem[1])
                    lastPoint = elem
                }*/
            }
            return
        }
        switch(data.type){
            case "FeatureCollection":
                for(var i in data.features){
                    this.drawLayerData(data.features[i])
                }
                break
            case "Feature":
                this.drawLayerData(data.geometry)
                break
            case "GeometryCollection":
                for(var i in data.geometries){
                    this.drawLayerData(data.geometries[i])
                }
                break
            case "MultiPolygon":
            case "Polygon":
            case "MultiLine":
            case "Line":
            case "MultiPoint":
                this.drawLayerData(data.coordinates, ["Polygon", "MultiPolygon"].indexOf(data.type) > -1)
            case "Point":
                var px = this.camera.pixelSize
                this.drawPoint(data.coordinates[0],data.coordinates[1])
                break
        }/*
        if("bbox" in data){
            this.setStyle({strokeStyle:"#f00"})
            this.drawLine(data.bbox[0],data.bbox[1],data.bbox[0],data.bbox[3])
            this.drawLine(data.bbox[2],data.bbox[1],data.bbox[2],data.bbox[3])
            this.drawLine(data.bbox[0],data.bbox[1],data.bbox[2],data.bbox[1])
            this.drawLine(data.bbox[0],data.bbox[3],data.bbox[2],data.bbox[3])
            this.setStyle({strokeStyle:"#000"})
        }*/
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
    drawLine(x1,y1,x2,y2){
        var points1x = this.camera.degreesToPixels(x1,y1,this.bounds,true)
        var points1y = this.camera.degreesToPixels(x1,y1,this.bounds,false)
        var points2x = this.camera.degreesToPixels(x2,y2,this.bounds,true)
        var points2y = this.camera.degreesToPixels(x2,y2,this.bounds,false)
        
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
    drawPolyLine(line, closed){
        
        if(line.length === 0)
            return
            
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
        if(closed)
            this.context.lineTo(x1,y1)
        this.context.stroke()
        if(closed)
            this.context.fill()
        this.context.closePath()
    }
}
class Controller {
    constructor(canvas){
        this.moving = false
        this.movable = document.getElementById("movable")
        this.leftpanel = document.getElementById("leftpanel")
        this.rightpanel = document.getElementById("rightpanel")
        this.canvas = canvas
        this.movable.addEventListener("mousedown",e=>this.mouseDown(e))
        window.addEventListener("mousemove",e=>this.mouseMove(e))
        window.addEventListener("mouseup",e=>this.mouseUp(e))
        window.addEventListener("resize",e=>this.windowResize(e))
        
        this.canvas.canvasElement.addEventListener("mousedown",e=>this.canvas.mouseDown(e))
        this.canvas.canvasElement.addEventListener("mousemove",e=>this.canvas.mouseMove(e))
        this.canvas.canvasElement.addEventListener("mouseup",e=>this.canvas.mouseUp(e))
        this.canvas.canvasElement.addEventListener("wheel",e=>this.canvas.wheel(e))
        
        this.actualizeRightPanel()
        this.timeout = undefined
    }
    mouseDown(e){
        this.moving = true
        this.startX = e.clientX;
        this.startpos = this.leftpanel.getClientRects()[0].width
    }
    mouseMove(e){
        if(this.moving){
            var x = e.clientX;
            var newx = x-this.startX+this.startpos;
            var lwidth = Math.max(100,newx)
            this.leftpanel.style.width = lwidth+"px"
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
        var lwidth = this.leftpanel.getBoundingClientRect().width
        var bodywidth = document.body.getBoundingClientRect().width
        this.rightpanel.style.width = (bodywidth - lwidth - 20)+"px"
        
        this.canvas.actualizeElementSize()
        
        var t = this
        clearTimeout(this.timeout)
        this.timeout = setTimeout(
            function(ev){
                t.canvas.actualizeBounds()
            }
            ,300)
    }
}
function actualizeBottom(text){
    var bottom = document.getElementById("bottom")
    bottom.innerHTML = text
}
function actualizeBottomWithCoords(camera, bounds){
    var degreesx = camera.pixelsToDegrees(camera.mouseX,camera.mouseY,bounds,true)
    var degreesy = camera.pixelsToDegrees(camera.mouseX,camera.mouseY,bounds,false)
    actualizeBottom(`Coords: ${String(degreesx).slice(0,5)} ${String(degreesy).slice(0,5)}, ${Math.floor(degreesx)}° ${Math.floor((degreesx % 1)*60)}' ${Math.floor(degreesy)}° ${Math.floor((degreesy % 1)*60)}'; magnification: ${String(camera.magnification).slice(0,5)}`)
}
function detectWebGL(){
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl && gl instanceof WebGLRenderingContext
}
function init(){
    
    let stageDiv = document.getElementById("stage")
    let canvasElement = document.getElementById("canv")
    let canvas
    let layerpanel = new LayerPanel({
        element: "leftpanelcontent",
        canvas: canvas
    })
    if(false && detectWebGL()){
        canvas = new WebGLCanvas(canvasElement,stageDiv,layerpanel)
    } else {
        canvas = new TwoDCanvas(canvasElement,stageDiv,layerpanel)
    }
    let movlist = new Controller(canvas);
    
    let importWindow = new ImportDialogWindow({
        button: "button-import", 
        element: "layer-import",
        file: "layer-import-file",
        datatype: "layer-import-datatype",
        addlayer: "dialog-window-add",
        layerpanel: layerpanel,
        canvas: canvas,
    })
    
    canvas.actualizeBounds()
}
addEventListener("load",init);

