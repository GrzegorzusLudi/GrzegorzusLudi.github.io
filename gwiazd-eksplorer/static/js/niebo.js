

class Star {
    constructor(name,coords,properties){
        this.name = name
        this.coords = coords
        this.properties = properties

        this.absmag = null
        this.appmag = null
        this.radius = 0
        
        this.realCoords = this.getRealCoords()
        this.cartesianPlace = this.getCartesianPlace()
        this.cacheCoords = null
        this.actualizeCacheCoords()
    }
    actualizeCacheCoords(camera){
        if(this.cartesianPlace == null)
            return
        

        var cax = 0,cay = 0,caz = 0
        if(camera != undefined){
            cax = camera.x
            cay = camera.y
            caz = camera.z
        }
        //var x = ctxwidth/2 - ctxwidth/2 * (this.realCoords[0]-12)/12 * Math.sqrt(1 - Math.pow(this.realCoords[1]/90,2))
        //var y = ctxheight/2 - ctxheight/2 * this.realCoords[1]/90
        
        var cx = -Math.atan2(this.cartesianPlace.y-cay,this.cartesianPlace.x-cax)/Math.PI
        var cy = Math.atan2(this.cartesianPlace.z-caz,Math.sqrt(Math.pow(this.cartesianPlace.x-cax,2)+Math.pow(this.cartesianPlace.y-cay,2)))/Math.PI*2

        var d = Math.sqrt(Math.pow(this.cartesianPlace.x-cax,2)+Math.pow(this.cartesianPlace.y-cay,2)+Math.pow(this.cartesianPlace.z-caz,2))

        var x = (cx) * Math.sqrt(1 - Math.pow(cy,2))
        var y = cy
        
        this.cacheCoords = {cx:cx,cy:cy,d:d,x:x,y:y}

        var absmagprop = this.properties.absmag_v && this.properties.absmag_v.length > 0 ? this.properties.absmag_v : this.properties.absmag_v1
        if(absmagprop){
            absmagprop = absmagprop.replaceAll('−','-')
            this.absmag = absmagprop.match(/[-\d.]+/)
        }

        if(this.cacheCoords.d > 0) {
            var appmagprop = this.properties.appmag_v && this.properties.appmag_v.length > 0 ? this.properties.appmag_v : this.properties.appmag_v1
            if(appmagprop){
                appmagprop = appmagprop.replaceAll('−','-')
                var appmag = appmagprop.match(/[-\d.]+/)

                if(appmag != null){
                    var original_d = Math.sqrt(Math.pow(this.cartesianPlace.x,2)+Math.pow(this.cartesianPlace.y,2)+Math.pow(this.cartesianPlace.z,2))

                    var newvalue = [Number(appmag[0]) - 5*( Math.log10(original_d/3.2616)-1)]
                    if(!isNaN(newvalue[0]))
                        this.absmag = newvalue
                }
            }
        }

        if(this.absmag != null && this.absmag.length > 0 && this.cacheCoords.d > 0 && this.name != 'Kappa Herculis'){
            this.appmag = Number(this.absmag[0]) + 5*( Math.log10(this.cacheCoords.d/3.2616)-1)
            this.radius = 2*(6 - this.appmag)
        }
    }
    getRealCoords(){
        return [
            this.coords[0] + this.coords[1]/60 + this.coords[2]/3600,
            this.coords[3] + this.coords[4]/60 + this.coords[5]/3600
        ]
    }
    getCartesianPlace(){
        if('sundistance' in this.properties){
            return {x:0,y:0,z:0}
        } else if('parallax' in this.properties && this.properties.parallax > 0){
            var dist = 1000 / this.properties.parallax * 3.2616

            var rts = this.realCoords[0]/24* 2 * Math.PI
            var dcl = this.realCoords[1]/360* 2 * Math.PI

            var fact = 1
            var x = Math.sin(rts) * Math.cos(dcl) * dist * fact
            var y = Math.cos(rts) * Math.cos(dcl) * dist * fact
            var z = Math.sin(dcl) * dist * fact

            return {x:x,y:y,z:z}
        } else {
            return null
        }
    }
    draw(ctx,ctxwidth,ctxheight,actualized,camera){
        if(actualized)
            this.actualizeCacheCoords(camera)

        if(this.cartesianPlace == null || this.absmag == null || this.properties.names == 'Marsic, [[Bayer designation|κ]]16081+1703')
            return

        this.realCoords = this.getRealCoords()
        //var x = ctxwidth/2 - ctxwidth/2 * (this.realCoords[0]-12)/12 * Math.sqrt(1 - Math.pow(this.realCoords[1]/90,2))
        //var y = ctxheight/2 - ctxheight/2 * this.realCoords[1]/90
        
        var cx = this.cacheCoords.cx
        var cy = this.cacheCoords.cy

        var d = this.cacheCoords.d

        var x = ctxwidth/2 - ctxwidth/2 * this.cacheCoords.x
        var y = ctxheight/2 - ctxheight/2 * this.cacheCoords.y
        /*
        var appmagprop = this.properties.appmag_v && this.properties.appmag_v.length > 0 ? this.properties.appmag_v : this.properties.appmag_v1
        if(appmagprop){
            appmagprop = appmagprop.replaceAll('−','-')
            var appmag = appmagprop.match(/[-\d.]+/)
            if(appmag != null && appmag.length > 0 && appmag[0] <= 5){
                ctx.fillStyle = this.starcolor()
                var radius = 4*Math.pow(0.7,appmag[0])
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.arc(x,y,radius,0,2*Math.PI)
                ctx.closePath()
                ctx.globalAlpha = 1// - Number(appmag[0])/6
                ctx.stroke()
                ctx.fill()
                ctx.globalAlpha = 1
                
                //ctx.font = '10px Verdana'
                //ctx.fillText(this.name,x,y)
            }
        }*/
        if(this.appmag != null && this.cacheCoords.d > 0){


            //if(this.appmag < 1)
            //    console.log(this.appmag,this.properties)
            var radius = this.radius

            if(radius > 0.5){
                ctx.fillStyle = this.starcolor()
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(x,y,1+radius,0,2*Math.PI)
                ctx.closePath()
                ctx.globalAlpha = 1// - Number(appmag[0])/6
                ctx.stroke()
                ctx.fill()
                ctx.globalAlpha = 1
            }
            //ctx.font = '10px Verdana'
            //ctx.fillText(this.name,x,y)
        }
    }
    starcolor(){
        var color = '#888'
        if('class' in this.properties){
            var cl = this.properties.class[0]
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
        return color
    }
}
class Model {
    constructor(){
        this.starstats = []
        this.sun = new Star("Sun",[0,0,0,0,0,0],{'color':'#0f0','absmag_v':'4.83','sundistance':true})
        this.starstats.push(this.sun)

        this.starranking = []
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
            if(no < 2)
                console.log(datum)
            this.starstats.push(new Star(key,coords, datum.properties))
            no++
        }
        this.sortStars()
        this.sortStarranking()
    }
    sortStars(){
        this.starstats.sort((a,b) => a.x-b.x)
    }
    sortStarranking(){
        this.starranking = this.starstats.filter(a=>a.appmag != null && a.cacheCoords.d != null && !Number.isNaN(a.cacheCoords.d) && !Number.isNaN(a.appmag[0])).sort((a,b) => Number(a.cacheCoords.d)-Number(b.cacheCoords.d))
    }
}
class Camera {
    constructor(){
        this.reset()
        this.actualized = false
    }
    reset(){
        this.x = 0
        this.y = 0
        this.z = 0
        this.actualized = true
    }
    setPlace(x,y,z){
        this.x = x
        this.y = y
        this.z = z
        this.actualized = true
    }
    getPlace(){
        return {x:this.x,y:this.y,z:this.z}
    }
}
class View {
    constructor(canvasElement,model){
        this.canvasElement = canvasElement
        this.ctx = this.canvasElement.getContext('2d')
        
        this.model = model
        
        this.width = this.canvasElement.width
        this.height = this.canvasElement.height

        this.camera = new Camera()
    }
    draw(camera){
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
            
            starstat.draw(this.ctx,this.width,this.height,camera.actualized,camera)
        }
        camera.actualized = false
    }
}
class Controller {
    constructor(model, view){
        this.model = model
        this.view = view

        this.camera = new Camera()

        this.starHistory = [model.sun]
        this.currentStar = model.sun
        this.focusedStar = null

        this.animating = false
    }
    setData(data){
        this.model.setData(data)
        this.updateLegendWithData()

        this.view.draw(this.camera)
        this.addListeners()
        
    }
    addListeners(){
        let t = this
        this.view.canvasElement.addEventListener('mousemove',function(e){
            t.mousemove(e)
        })
        this.view.canvasElement.addEventListener('click',function(e){
            t.mouseclick(e)
        })
        document.getElementById('backbutton').onclick = (e) => {t.goback()}
    }
    mousemove(e){
        var bounds = this.view.canvasElement.getBoundingClientRect()
        var x = (e.clientX - bounds.left)/bounds.width*this.view.canvasElement.width
        var y = (e.clientY - bounds.top)/bounds.height*this.view.canvasElement.height

        this.focusStar(x,y)
        this.updateLegendWithData()
    }
    updateLegendWithData(){
        let t = this
        var ranking = this.model.starranking

        var ranking_element = document.getElementById('ranking')
        ranking_element.innerHTML = ''

        document.getElementById('currentstar').innerHTML = this.focusedStar != null ? this.focusedStar.name : 'none'
        var table = document.createElement('table')

        for(var i = 0;i<20;i++){
            let star = ranking[i]
            var row = document.createElement('tr')
            row.innerHTML = `<td>${i+1}</td> <td>${star.name}</td> <td>${Number(star.appmag).toFixed(2)}</td> <td>${Number(star.absmag).toFixed(2)}</td>`

            
            row.onclick = () => {
                t.focusedStar = star
                
                t.startAnimating()
            }
            table.appendChild(row)
        }

        ranking_element.appendChild(table)

        
    }
    mouseclick(e){
        var bounds = this.view.canvasElement.getBoundingClientRect()
        var x = (e.clientX - bounds.left)/bounds.width*this.view.canvasElement.width
        var y = (e.clientY - bounds.top)/bounds.height*this.view.canvasElement.height

        this.focusStar(x,y)
        if(this.focusedStar != null){
            this.starHistory.push(this.currentStar)
            this.currentStar = this.focusedStar
            this.startAnimating()
        }
    }
    startAnimating(){
        this.startingPlace = this.camera.getPlace()
        this.destination = this.focusedStar.cartesianPlace
        this.animationProgress = 0
        this.animate()
    }
    progress(a,b,pro){
        return {
            x:a.x + pro*(b.x-a.x),
            y:a.y + pro*(b.y-a.y),
            z:a.z + pro*(b.z-a.z)
        }
    }
    goback(){
        if(this.starHistory.length > 0){
            this.focusedStar = this.starHistory.pop()
            this.currentStar = this.focusedStar
            this.startAnimating()
        }
    }
    animate(){
        if(this.animationProgress < 20){
            var prog
            if(this.animationProgress < 10){
                prog = this.progress(this.startingPlace,this.destination,0.5*Math.pow(0.5,10-this.animationProgress))
            } else {
                prog = this.progress(this.startingPlace,this.destination,1-0.5*Math.pow(0.5,this.animationProgress-10))
            }
            this.camera.setPlace(prog.x,prog.y,prog.z)
            this.view.draw(this.camera)
            this.animationProgress++

            this.model.sortStarranking()
            this.updateLegendWithData()
            setTimeout(() => this.animate(),50)
        } else {
            this.camera.setPlace(this.destination.x,this.destination.y,this.destination.z)
            this.view.draw(this.camera)
        }
    }
    focusStar(x,y){
        this.focusedStar = null

        var left = 0
        var right = 0

        var ctxwidth = this.view.width
        var ctxheight = this.view.height

        for(var i in this.model.starstats){
            var star = this.model.starstats[i]
            if(star.cacheCoords != null && Math.abs((ctxwidth/2 - ctxwidth/2 * star.cacheCoords.x) - x) <= star.radius && Math.abs((ctxheight/2 - ctxheight/2 * star.cacheCoords.y )- y) <= star.radius){

                this.focusedStar = star
            }
        }
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

