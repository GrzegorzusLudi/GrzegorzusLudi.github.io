

class DialogWindow {
    constructor(configs){
        this.element = null;
        this.canvas = null;
        this.display = false;
        this.setConfig(configs)
        this.getWindowCloser()
        this.previousType = null
    }
    setConfig(configs){
        for(var option in configs){
            switch(option){
                case "button":
                    let button = document.getElementById(configs[option])
                    let th = this
                    button.addEventListener("click",(e)=>{th.action(e)})
                    break;
                case "element":
                    this.element = document.getElementById(configs[option])
                    break;
                case "canvas":
                    this.canvas = configs[option]
                    break;
            }
        }
    }
    action(e, display){
        if(display !== undefined)
            this.display = display
        else
            this.display = !this.display;
        this.element.style.display = this.display ? "block" : "none"
    }
    getWindowCloser(){
        var children = Array.from(this.element.children),closer
        if(children)
            closer = children.filter(x=>x.classList.contains("window-closer"))
        if(closer.length > 0){
            let th = this
            closer[0].addEventListener("click",(e)=>{th.action(e)})
        }
        
    }
}

class ImportDialogWindow extends DialogWindow {
    constructor(configs){
        super(configs)
        this.data = null
        this.fileSelect = null
        this.typeSelect = null
        this.fileName = null
        this.layerPanel = null
        this.setOwnConfig(configs)
    }
    setOwnConfig(configs){
        for(var option in configs){
            let th = this
            switch(option){
                case "file":
                    var fileSelect = document.getElementById(configs[option])
                    fileSelect.addEventListener("change", (e)=>{th.loadFile(e)})
                    break
                case "datatype":
                    this.typeSelect = document.getElementById(configs[option])
                    this.typeSelect.addEventListener("change", (e)=>{th.changeType(e.target.value, false)})
                    break
                case "addlayer":
                    var addLayer = document.getElementById(configs[option])
                    addLayer.addEventListener("click", (e)=>{th.addLayer(e)})
                    break
                case "dialogpanel":
                    this.dialogpanel = configs[option]
                    break
                case "layerpanel":
                    this.layerpanel = configs[option]
                    break
            }
        }
    }
    loadFile(e){
        var file = e.target.files[0]
        const reader = new FileReader();
        
        var th = this
        reader.addEventListener('load', (event) => {
            th.setData(event.target.result, file.name)
        });
        reader.readAsText(file);
    }
    setData(data, filename){
        document.getElementById("layer-import-hidden").style.display = "block"
        
        this.fileName = filename
        this.data = data
        
        var type = this.determineType(data, filename)
        
        this.changeType(type, true)
        
        this.addFileLoaded(type)
    }
    determineType(data, filename){
        var datatypes = {
            '.geojson': 'geojson',
            '.json': 'geojson',
        }
        var extension = filename.match('[.][A-z0-9]+$')
        extension = extension.length == 0 ? '' : extension[0]
        
        var predicted = extension in datatypes ? datatypes[extension] : null
        var types = ['geojson','json'].sort((x,y)=>y===predicted)
        
        for(var i in types){
            var type = types[i]
            
            if(this.validateType(data, type)){
                return type
            }
        }
        return 'text'
    }
    validateType(data, type){
        switch(type){
            case 'geojson':
                if(this.predictGeoJson(data))
                    return true
                break
            case 'json':
                if(this.predictJson(data))
                    return true
                break
        }
        return false
    }
    predictGeoJson(data){
        if(this.predictJson(data)){
            try {
                wk_stringify(JSON.parse(data))
            } catch(e) {
                return false
            } 
            return true
        }
        return false 
    }
    predictJson(data){
        try {
            JSON.parse(data)
        } catch(e) {
            return false
        } 
        return true
    }
    
    changeType(type, update){
        if(!update && !this.validateType(this.data, type)){
            alert("Type doesn't match with the file.")
            this.typeSelect.value = this.previousType
        } else {
            this.typeSelect.value = type
            this.previousType = type
        }
    }
    
    addFileLoaded(type){
        document.getElementById("layer-import-hidden").style.display = "block"
    }
    
    addLayer(e){
        if(this.data !== null){
            var bounds = this.canvas.getDegreeBounds()
            var pixelSize = this.canvas.camera.getPixelSize()
            this.layerpanel.addLayer([], this.fileName, this.typeSelect.value, this.data, bounds, pixelSize)
            this.action(null, false)
            this.canvas.draw()
        }
    }
}
