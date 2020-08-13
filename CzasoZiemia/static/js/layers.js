
class LayerPanel {
    constructor(configs){
        this.element = null
        this.setConfig(configs)
        this.layers = {
            type:"root",
            name:"root",
            drawable:false,
            children: {}  //dict
        }
        this.updateLayerView(this.layers,null)
    }
    setConfig(configs){
        for(var option in configs){
            switch(option){
                case "element":
                    this.element = document.getElementById(configs[option])
                    break;
            }
        }
    }
    
    //path is array of ids
    //initial data is written in geojson
    addLayer(path, name, type, initialData, bounds, resolution){
        var realpath = this.layers
        for(var i in path){
            var pathpart = path[i]
            realpath = realpath.children[pathpart]
        }
        var transformed = this.validateAndTransformToGeoJson(initialData, type)
        var testname = name
        var number = 2
        while(testname in realpath.children){
            testname = name + " (" + number + ")"
            number++
        }
        realpath.children[testname] = {
            type: type,
            name: testname,
            data: transformed["data"],
            drawable: transformed["drawable"],
            children: {},
            rendered: null,
        }
        this.render(realpath.children[testname], bounds, resolution)
        this.updateLayerView(path)
    }
    
    renderLayers(bounds, resolution){
        for(var i in this.layers.children){
            this.render(this.layers.children[i], bounds, resolution)
        }
    }
    
    render(layer, bounds, resolution){
        layer.rendered = {}
        console.log(resolution)
        this.mapLayerToRendered(layer.data,layer.rendered,bounds,resolution)
    }
    
    checkBounds(coords, bounds){
        return coords[0] > bounds.left && coords[1] > bounds.top && coords[0] < bounds.right && coords[1] < bounds.bottom
    }
    mapLayerToRendered(layer,rendered,bounds,resolution){
        var lastPosition = null
        for(var property in layer){
            var value = layer[property]
            if(value instanceof Object && !(value instanceof Array)){
                if("bbox" in value && (
                    value.bbox[0] > bounds.right || 
                    value.bbox[1] > bounds.bottom || 
                    value.bbox[2] < bounds.left || 
                    value.bbox[3] < bounds.top || 
                    (Math.abs(bounds.right-bounds.left) < resolution && Math.abs(bounds.bottom-bounds.top) < resolution)
                ))
                    continue
                var newObject = {}
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution)
            } else if(layer instanceof Array && value instanceof Array && value.length > 0 && typeof value[0] == "number"){
                if(lastPosition === null){
                    lastPosition = [value[0], value[1]]
                    if(this.checkBounds(lastPosition, bounds))
                        rendered.push([value[0],value[1]])
                }
                if(this.checkBounds(lastPosition, bounds) || this.checkBounds(value, bounds)){
                    if(!this.checkBounds(lastPosition, bounds))
                        rendered.push([lastPosition[0],lastPosition[1]])
                    if(!this.checkBounds(lastPosition, bounds) || 
                        Math.abs(lastPosition[0]-value[0]) + Math.abs(lastPosition[1]-value[1]) > resolution
                    ){
                        rendered.push([value[0],value[1]])
                        lastPosition = [value[0],value[1]]
                    }
                }
            } else if(value instanceof Array){
                var newObject = []
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution)
            } else {
                rendered[property] = value
            }
        }
    }
    
    //modification is path
    modifyLayer(path, type, modification){  
        
    }
    getLayers(){
        
    }
    
    updateLayerView(path){
        var element = this.element
        var layers = this.layers
        
        //for(var i in path){   NOT YEET
        //    var pathpart = path[i]
        //    realpath = realpath.children[pathpart]
        //}
        
        element.innerHTML = "<div>root<div>" //remove all
        var subnodes = document.createElement("div")
        element.appendChild(subnodes)
        subnodes.style.marginLeft = "3px"
        subnodes.style.borderLeft = "1px solid gray"
        subnodes.style.paddingLeft = "3px"
        for(var name in layers.children){
            var layer = layers.children[name]
            var newNode = document.createElement("div")
            newNode.innerHTML = "<div>"+layer.name+"</div>"
            subnodes.appendChild(newNode)
        }
    }
    
    validateAndTransformToGeoJson(data, type){
        var newdata, drawable = false
        switch(type){
            case "geojson":
                    newdata = JSON.parse(data)
                    this.addBboxes(newdata)
                    drawable = true
                break
            case "json":
                    newdata = JSON.parse(data)
                break
            case "test":
                    newdata = data
                break
        }
        return {
            data: newdata,
            drawable: drawable,
        }
    }
    boxFromPoints(x,y){
        return {
            left: x, 
            right: x,
            top: y,
            bottom: y
        }
    }
    mergeBoxes(bbox1,bbox2){
        if(bbox1 == null)
            return {
                left: bbox2.left, 
                right: bbox2.right,
                top: bbox2.top,
                bottom: bbox2.bottom
            }
            
        return {
            left: Math.min(bbox1.left,bbox2.left), 
            right: Math.max(bbox1.right,bbox2.right), 
            top: Math.min(bbox1.top,bbox2.top), 
            bottom: Math.max(bbox1.bottom,bbox2.bottom)
        }
    }
    addBboxes(data){
        var bbox = null
        if(data instanceof Array){
            for(var i in data){
                var elem = data[i]
                if(elem instanceof Array && elem.length>0 && elem[0] instanceof Array){
                    var getBbox = this.addBboxes(elem)
                    bbox = this.mergeBoxes(bbox, getBbox)
                } else {
                    bbox = this.mergeBoxes(bbox, this.boxFromPoints(elem[0], elem[1]))
                }
            }
            return bbox
        }
        switch(data.type){
            case "FeatureCollection":
                for(var i in data.features){
                    var newbbox = this.addBboxes(data.features[i])
                    bbox = this.mergeBoxes(bbox,newbbox)
                }
                break
            case "Feature":
                bbox = this.addBboxes(data.geometry)
                break
            case "GeometryCollection":
                for(var i in data.geometries){
                    var newbbox = this.addBboxes(data.geometries[i])
                    bbox = this.mergeBoxes(bbox,newbbox)
                }
                break
            case "MultiPolygon":
            case "Polygon":
            case "MultiLineString":
            case "LineString":
            case "MultiPoint":
            case "Point":
                bbox = this.addBboxes(data.coordinates)
                break
        }
        data.bbox = [bbox.left, bbox.top, bbox.right, bbox.bottom]
        return bbox
    }
}