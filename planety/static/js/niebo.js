

class Star {
    constructor(name,coords,properties){
        this.name = name
        this.coords = coords
        this.properties = properties
        
        this.realCoords = this.getRealCoords()
    }
    getRealCoords(){
        return [
            this.coords[0] + this.coords[1]/60 + this.coords[2]/3600,
            this.coords[3] + this.coords[4]/60 + this.coords[5]/3600
        ]
    }
    draw(ctx,ctxwidth,ctxheight){
        this.realCoords = this.getRealCoords()
        var x = ctxwidth/2 - ctxwidth/2 * (this.realCoords[0]-12)/12 * Math.sqrt(1 - Math.pow(this.realCoords[1]/90,2))
        var y = ctxheight/2 - ctxheight/2 * this.realCoords[1]/90
        
        var appmagprop = this.properties.appmag_v && this.properties.appmag_v.length > 0 ? this.properties.appmag_v : this.properties.appmag_v1
        if(appmagprop){
            appmagprop = appmagprop.replaceAll('−','-')
            var appmag = appmagprop.match(/[-\d.]+/)
            if(appmag != null && appmag.length > 0 && appmag[0] <= 6){
                var radius = Math.pow(0.5,appmag[0])
                ctx.beginPath()
                ctx.arc(x,y,radius,0,2*Math.PI)
                ctx.closePath()
                ctx.globalAlpha = 1 - Number(appmag[0])/6
                ctx.stroke()
                ctx.fill()
                ctx.globalAlpha = 1
                
                //ctx.font = '10px Verdana'
                //ctx.fillText(this.name,x,y)
            }
        }
    }
}
class Model {
    constructor(){
        this.starstats = []
    }
    setData(data){
        this.data = data
        this.loadData()
    }
    loadData(){
        var no = 0
        for(var key in this.data){
            var datum = this.data[key]
            var coords = datum.coords
            if(datum.coords.length == 0 && 'ra' in datum.properties && 'dec' in datum.properties){
                var ra = datum.properties.ra.replaceAll('−','-').slice(5,-2).split('|').map(x=>Number(x))
                var dec = datum.properties.dec.replaceAll('−','-').slice(6,-2).split('|').map(x=>Number(x))
                coords = ra.concat(dec)
            }
            this.starstats.push(new Star(key,coords, datum.properties))
        }
    }
}
class View {
    constructor(canvasElement,model){
        this.canvasElement = canvasElement
        this.ctx = this.canvasElement.getContext('2d')
        
        this.model = model
        
        this.width = this.canvasElement.width
        this.height = this.canvasElement.height
    }
    draw(){
        this.ctx.fillStyle = '#000'
        this.ctx.fillRect(0,0,this.width,this.height)
        this.ctx.strokeStyle = '#fff'
        this.ctx.fillStyle = '#fff'
        this.ctx.beginPath()
        this.ctx.ellipse(this.width/2,this.height/2,this.width/2,this.height/2,0,0,2*Math.PI)
        this.ctx.closePath()
        this.ctx.stroke()
        for(var i in this.model.starstats){
            var starstat = this.model.starstats[i]
            
            starstat.draw(this.ctx,this.width,this.height)
        }
    }
}
class Controller {
    constructor(model, view){
        this.model = model
        this.view = view
    }
    setData(data){
        this.model.setData(data)
        this.view.draw()
    }
}
function init(){
    let canvasElement = document.getElementById("canv")
    
    let model = new Model()
    let view = new View(canvasElement,model)
    let controller = new Controller(model, view)
    fetch('static/data/stars.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(json => {
        controller.setData(json)
    })/*
    .catch(function () {
    })*/

    
}
addEventListener("load",init);

