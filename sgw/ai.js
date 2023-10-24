function loadStats(){
	//strategical values for each type of unit and for each terrain type
	//
	//each row represents each unit, numbered as in
	//1st column is attack value on land, 2nd row is defense value on land
	//3rd and 4th columns are values on water
	//5th and 6th columns are values in the air
	aistratvals = [["1","1","0","0","0","0"],
	["4","4","0","0","0","0"],
	["4","0","0","0","0","0"],
	["1.5","0.8","0","0","0","0"],
	["1","1.5","0","0","0","5"],
	["0.5","4","0","0","0","0"],
	["1","1","1","1","0","0"],
	["5","5","4","4","0","0"],
	["0","0","0","0","0","0"],
	["3","3","2","1.5","1","1"],
	["0","0","0","0","0","0"],
	["0","0","0","0","0","0"]];


	taxTerritorialCostValue = [[1,	null,	0.5,	0.3],
			   [null,0.3,	null,	0.3],
			   [1,	null,	0.5,	0.5],
			   [1,	0.3,	0.5,	0.3]];

	territoryByWater = [[2,2,2,2],[2,0,2,0],[2,2,2,2],[2,0,2,0]];

        //city parameters:
        land_params = {
            population_weight : 1,
            steel_production_weight : 2,
            production_weight : 2,
            water_body_bonus : 1,
            land_size : 3
        }
        return land_params
}

//returns cost of tax transport between two fields
function taxTerritorialCost(z1,z2){
	//change 'z' value of a hex to array index
	var ax = Math.min(3,z1.z+2),ay = Math.min(3,z2.z+2);
	if(taxTerritorialCostValue[ax][ay]==null){
		return scian*scian;
	} else {
		return taxTerritorialCostValue[ax][ay];
	}
}

//a function which evaluates "danger score" from the enemy for a city
function checknearest(hex){
	var proximityScore = 0;

	//a map which stores cost of making a tax path from a city
	var distanceMap = [];

	var ih = hex;
	for(var a = 0;a<=scian+1;a++){
		distanceMap[a] = [];
		for(var b = 0;b<=scian+1;b++){
			distanceMap[a][b] = {distance:(scian*scian),prev:-1,bywater:false};
		}
	}
	distanceMap[ih.x][ih.y].distance = 0;
	distanceMap[ih.x][ih.y].bywater = true;
	var findLayer = [hex];
	var findLayerCount = 1;
	while(findLayerCount>0){
		var extr = findLayer[0];
		for(var i = 1;i<findLayerCount;i++){
			findLayer[i-1]=findLayer[i];
		}
		findLayerCount--;

		for(var i = 0;i<6;i++){
			if(istn(extr.border[i])){
				ih = extr.border[i];
				if(distanceMap[ih.x][ih.y].distance>=scian*scian){
				} else {
					var strata = taxTerritorialCost(ih,extr);
					if(istn(ih.x,ih.y) && distanceMap[ih.x][ih.y].distance+strata<distanceMap[extr.x][extr.y].distance){
						distanceMap[extr.x][extr.y].distance=distanceMap[ih.x][ih.y].distance+strata;
						distanceMap[extr.x][extr.y].prev = i;
						if(territoryByWater[Math.min(3,ih.z+2)][Math.min(3,extr.z+2)]==0 && distanceMap[ih.x][ih.y].bywater){
							distanceMap[extr.x][extr.y].bywater = true;
						} else {
							distanceMap[extr.x][extr.y].bywater = false;
						}
						//console.log(extr.z+","+extr.y+","+distanceMap[extr.x][extr.y].distance);
						//extr.z = Math.max(extr.z,distanceMap[extr.x][extr.y].distance);
					}
				}
			}
		}

		for(var i = 0;i<6;i++){
			if(extr.border[i]!=null && Math.max(extr.border[i].x,extr.border[i].y)<scian){
				ih = extr.border[i];
                                /*
                                if(!(ih.x in distanceMap)){
                                    console.log(ih.x+' '+distanceMap.length)
                                    break
                                }
                                if(!(ih.y in distanceMap[ih.x])){
                                    console.log(ih.y+' '+distanceMap[ih.x].length)
                                    break
                                }
                                */
				if(distanceMap[ih.x][ih.y].distance>=scian*scian && taxTerritorialCostValue[Math.min(3,ih.z+2)][Math.min(3,extr.z+2)]!="s" && (ih.z!=-1 || extr.z==-1 || (extr.z>0 && distanceMap[extr.x][extr.y].bywater))){
					if(!contains(findLayer,findLayerCount,ih,distanceMap[ih.x][ih.y].distance)){
						findLayer[findLayerCount] = ih;
						distanceMap[ih.x][ih.y].distance=distanceMap[extr.x][extr.y].distance+9;
						var aas = findLayerCount;
						while(aas>0 && distanceMap[findLayer[aas-1].x][findLayer[aas-1].y]>distanceMap[findLayer[aas].x][findLayer[aas].y]){
							var aux = findLayer[aas-1];
							findLayer[aas-1]=findLayer[aas];
							findLayer[aas] = aux;
							aas--;
						}
						findLayerCount++;
					}
				}
			}
		}
	}
	for(var i = 0;i<mist.length;i++){
		var r = mist[i];
		if(distanceMap[r.x][r.y].distance<scian*scian && r.z>0 && r.undr!=kolej){
			var f = 1;
			if(r.undr!=-1)
				f=2;
			proximityScore-=-(f*r.z)/distanceMap[r.x][r.y].distance*hex.z/100;
		}
	}
	return proximityScore;
}
class Land{
    constructor(city,params){
        this.occupiers = {}
        this.cities = []
        var thex = {}
        thex[hex.x+','+hex.y] = hex
        var temp1 = [hex]
        var temp2 = []
        var depth = params.land_size
        while(temp1.length>0 && depth>0){
            for(var i in temp1){
                var g = temp1[i]
                g.waterbody = this
                //g.test = num
                if(g.z>0)
                    this.cities.push(g)
                for(var j = 0;j<6;j++){
                    var h = g.border[j]
                    if(not_outside_board(h) && !(h.x+','+h.y in thex) && h.z>=0){
                        thex[h.x+','+h.y] = h
                        temp2.push(h)
                    }
                }
            }
            temp1 = temp2
            temp2 = []
            depth--
        }
        for(var i in thex){
            this.hexes.push(thex[i])
        }

    }
}
function not_outside_board(hex){
    return hex != null && Math.max(hex.x,hex.y)<scian
}
class Water{
    constructor(hex,num,params){
        this.params = params
        this.hexes = []
        this.cities = []
            
        var thex = {}
        thex[hex.x+','+hex.y] = hex
        var temp1 = [hex]
        var temp2 = []
        while(temp1.length>0){
            for(var i in temp1){
                var g = temp1[i]
                g.waterbody = this
                //g.test = num
                if(g.z>0)
                    this.cities.push(g)
                for(var j = 0;j<6;j++){
                    var h = g.border[j]
                    if(not_outside_board(h) && !(h.x+','+h.y in thex) && (h.z == -1 || h.z>0)){
                        thex[h.x+','+h.y] = h
                        temp2.push(h)
                    }
                }
            }
            temp1 = temp2
            temp2 = []
        }
        for(var i in thex){
            this.hexes.push(thex[i])
        }
    }
    city_value(x){
        return x.z*(this.params.population_weight)+x.hutn*(this.params.steel_production_weight)+x.prod*(this.params.production_weight)
    }
    value(){
        return Math.floor(this.cities.map(x=>this.city_value(x)).reduce((x,y)=>x+y)*this.hexes.length/scian/scian)
    }
}

function generate_areas(mist,params){
    for(var a = 0;a<scian;a++){
        for(var b = 0;b<scian;b++){
            heks[a][b].waterbody = null
            heks[a][b].land = null
        }
    }
    waterbodies = []
    for(var a = 0;a<scian;a++){
        for(var b = 0;b<scian;b++){
            if(heks[a][b].waterbody==null && (heks[a][b].z==-1 || heks[a][b].z>0)){
                waterbodies.push(new Water(heks[a][b],waterbodies.length,params))
            }
        }
    }
    lands = []
    for(var i = 0;i<mist.length;i++){
        //mist[i].test = mist[i].value()
        //lands.push(new Land(mist[i],params))
    }
}

function makeAccessible(){
    
}
//function which controls the --easiest-- default ai
function ai1(){
    aimachine(1)
}
function ai2(){
    aimachine(2)
}
function ai3(){
    aimachine(3)
}
function ai4(){
    aimachine(4)
}
function ai5(){
    aimachine(5)
}
function aimachine(ailevel){
    //console.log(aistan)
	switch(aistan){
		case 0:
            var exists = false
			params = loadStats();
			mist = [];
			mistdefval = [];
			mista = 0;
			for(var a = 0;a<scian;a++){
				mistdefval[a] = [];
				for(var b = 0;b<scian;b++){
					if(heks[a][b].z>0){
                        /*
                        heks[a][b].test = Number( 
                            ( heks[a][b].z/8 - heks[a][b].hutn - heks[a][b].prod ) / 15
                        ).toFixed(1)
                        */
						mist.push(heks[a][b]);
						mistdefval[a][b] = {la:0,ld:0,wa:0,wd:0,aa:0,ad:0,blisk:0};
                        if(heks[a][b].undr == kolej)
                            exists = true
					}
					if(heks[a][b].unp > 0 && heks[a][b].undr == kolej){
                        exists = true
                    }
				}
			}
			mist.sort((a,b) => -a.z + b.z)
			aistan=1;
			miastkol = 0;
            spojx = 0;
            spojy = 0;
            tx = -1
            ty = -1
            zaznu = -1
            zaznx = -1
            zazny = -1
            changeState(2)
            if(!exists)
                aistan = 9001
		break;
        case 1:
            //console.log(spojx,spojy)
            while((heks[spojx][spojy].unp == 0 || heks[spojx][spojy].undr != kolej) && spojx < scian-1){
                spojy++
                if(spojy >= scian){
                    spojy = 0
                    spojx++
                }
            }
            if(spojx >= scian){
                aistan = 1.1
                return
            }
            var hex = heks[spojx][spojy]
            var nodziel = true
            var uht = 10
            while(nodziel && uht > 0){
                var rozboj = -1
                nodziel = false
                for(var i = 0;i<hex.unp && !nodziel;i++){
                    var unit1 = unix[kolej][hex.unt[i]]
                    if(unit1 != undefined && unix[kolej][unit1.id].x != -1 && unit1.rodz == 8 && unit1.rozb > 0 && unit1.rozb < 20 && unit1.il > 20)
                        unit1.rozb = 0
                    if(unit1 != undefined && unix[kolej][unit1.id].x != -1 && unit1.rozb > 0){
                        if(rozboj == -1)
                            rozboj = unit1.id
                        else
                            unit1.rozb = 0
                    }
                        
                    for(var j = 0;j<i;j++){
                        var unit2 = unix[kolej][hex.unt[j]]
                        if(unit1 == undefined || unit2 == undefined || hex.unt[i] == -1 || hex.unt[j] == -1 || unix[kolej][unit1.id].x == -1 || unix[kolej][unit2.id].x== -1)
                            continue
                            
                        if(unit1.rodz == unit2.rodz && (unit1.rozb == 0 || unit2.il > 60) && (unit2.rozb == 0 || unit2.il > 60) && unit1.il < 99 && unit2.il < 99){
                            zespoj(unit2.id,unit1.id,false)
                            if(unit2.rozb + unit2.il > 99)
                                unit2.rozb = 99-unit2.il
                            if(unit1.rozb + unit1.il > 99)
                                unit1.rozb = 99-unit1.il
                            if(zaznu > -1){
                                odzaznaj(false)
                                zaznu = -1
                            }
                            nodziel = true
                            break
                        }
                    }
                }
                uht--
            }
            for(var i = 0;i<hex.unp;i++){
                if(hex.unt[i] == -1)
                    continue
                var unit = unix[kolej][hex.unt[i]]
                if(unit != undefined && pathIsThroughCrowdedCity(null,hex.x,hex.y,unit.ruchk,unit.rucho)){
                    odceluj(hex.unt[i],kolej);
                    if(unix[kolej][hex.unt[i]] != undefined && unix[kolej][hex.unt[i]].x != undefined && unix[kolej][hex.unt[i]].x != -1){
                        oddroguj(hex.unt[i],kolej,false);
                    }
                }
            }
            spojy++
            if(spojy >= scian){
                spojy = 0
                spojx++
            }
            
        break;
        case 1.1:
            dfrou=distmapsFromUnit()
            
            simplifieddistmaps=simpledistmaps(dfrou)
            evaluate(dfrou,2)
            
            legalActions(dfrou,simplifieddistmaps)
            ulepszyns = 10
            aistan = 1.2
            //distmap = aidistmap()
            //checkDistmapDistance(distmap)
            generate_areas(mist,params)
        break
        case 1.2:
            
            inaccessible_path = {}
            for(var i = 0;i<scian;i++){
                inaccessible_path[i] = {}
                for(var j = 0;j<scian;j++){
                    inaccessible_path[i][j] = {x:i,y:j,inaccessible:true,coast:-1}
                    //heks[i][j].test = ""
                }
            }
            
            var sidima = {}
            for(var i in simplifieddistmaps){
                for(var j in simplifieddistmaps[i]){
                    sidima[j] = true
                }
            }
            dbetter = copyDistmaps(dfrou)
            evaluate(dbetter,2)
            
            //legalActions(dbetter)
            possible_targets_ix = 0
            possible_targets = []
            addedHexes = {}
            myHexes = 0
            for(var key in dfrou.distmaps){
                var distmap = dfrou.distmaps[key]
               // heks[distmap.hex.heks.x][distmap.hex.heks.y].test = ""
                
                /*
                if(distmap.hex.undr != kolej && (distmap.hex.units.length > 0 || distmap.hex.z > 0) && distmap.frontline){
                    possible_targets.push(distmap.hex)
                }*/
                
                inaccessible_path[distmap.hex.heks.x][distmap.hex.heks.y].inaccessible = false
                
                var totalUnitSize = 0
                for(var i in distmap.hex.units){
                    
                    var unittu = distmap.hex.units[i]
                    
                    //unittu.actions = renameBy(unittu.actions,'old_speculation')
                    
                    if(unittu.rozb <= 10 || unittu.il >= 40)
                        totalUnitSize += unittu.il
                }
                    
                var dr = distmap.hex.heks.undr != undefined ? distmap.hex.heks.undr : distmap.hex.heks.dru
                if(dr == kolej && distmap.hex.units.length > 0){
                    
                    if(totalUnitSize < 10){
                        continue
                    }
                    myHexes++
                    for(var movement_type in distmap.maps){
                        var dmap = distmap.maps[movement_type].hexmap.filter(x=>x.dist != -1)

                        var dmap = dmap.sort((a,b)=>a.dist-b.dist)
                        var lvlok = 2
                        var foundFrontline = false
                        for(var i in dmap){
                            var obj = dmap[i]
                            var obdr = obj.hex.heks.undr != undefined ? obj.hex.heks.undr : obj.hex.heks.dru
                            
                            var kodd = obj.hex.heks.x + '#' + obj.hex.heks.y
                            /*
                            if(false && kodd in dfrou.distmaps){
                                alli = dfrou.distmaps[kodd].alliegance[MAX_TURNS-1]
                                if(alli != -1 && alli != 11)
                                    obdr == alli
                            }*/
                            
                            if(obj.dist != -1 && movement_type == 'n'){
                                //heks[obj.hex.heks.x][obj.hex.heks.y].test = 'X'
                                inaccessible_path[obj.hex.heks.x][obj.hex.heks.y].inaccessible = false
                            }
                            if(obdr != kolej && (obj.hex.units.length > 0 || obj.hex.z > 0)){
                                
                                if(obdr != -1 && f.dist > lvlok + 3 && foundFrontline){
                                    continue
                                }
                                
                                /*
                                for(var j = 0;j<obj.hex.units.length;j++){
                                    if(obj.hex.units[j].actions.length > 0 && obj.hex.units[j].actions[0].type == 'move'){
                                        var cod = obj.hex.units[j].actions[0].destination[0] + '#' + obj.hex.units[j].actions[0].destination[1]
                                    }
                                }*/
                                var code = obj.hex.heks.x + '#' + obj.hex.heks.y
                                if(addedHexes[code] == undefined){
                                    addedHexes[code] = obj.dist
                                    if(code in sidima)
                                        possible_targets.push(obj)
                                } else if(obj.dist < addedHexes[code]){
                                    addedHexes[code] = obj.dist
                                    if(code in sidima){
                                        possible_targets = possible_targets.filter(a => a.hex.heks.x != obj.hex.heks.x || a.hex.heks.y != obj.hex.heks.y)
                                        possible_targets.push(obj)
                                    }
                                }
                                
                                if((!foundFrontline || lvlok > obj.dist) && obdr != -1 && obdr != kolej){
                                    foundFrontline = true
                                    lvlok = obj.dist
                                }
                                    
                                    
                            }
                        }
                        
                        var rmap = distmap.maps[movement_type].rangemap.filter(x=>x.dist != -1)

                        var rmap = rmap.sort((a,b)=>a.dist-b.dist)
                        for(var i in rmap){
                            var obj = rmap[i]
                            var obdr = obj.hex.heks.undr != undefined ? obj.hex.heks.undr : obj.hex.heks.dru

                            var kodd = obj.hex.heks.x + '#' + obj.hex.heks.y
                            /*
                            if(false && kodd in dfrou.distmaps){
                                alli = dfrou.distmaps[kodd].alliegance[MAX_TURNS-1]
                                if(alli != -1 && alli != 11)
                                    obdr == alli
                            }*/
                                
                            if(obdr != kolej && obj.hex.units.length > 0){
                                
                                var code = obj.hex.heks.x + '#' + obj.hex.heks.y
                                if(addedHexes[code] == undefined){
                                    addedHexes[code] = obj.dist
                                    if(code in sidima)
                                        possible_targets.push(obj)
                                } else if(obj.dist < addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y]){
                                    addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] = obj.dist
                                    possible_targets = possible_targets.filter(a => a.hex.heks.x != obj.hex.heks.x || a.hex.heks.y != obj.hex.heks.y)
                                    possible_targets.push(obj)
                                }
                            }
                        }
                    }
                    
                    
                    //for(var i in distmap.hex.units){
                    //    var unit = distmap.hex.units[i]
                        /*if(pathIsThroughCrowdedCity(dbetter,distmap.hex.x,distmap.hex.y,unit.ruchk,unit.rucho) && unit.actions.length > 0 && unit.actions[0].type == 'move'
                            || 
                            unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].destination == null && heks[unit.actions[0].destination[0]][unit.actions[0].destination[1]].z > -1 && heks[unit.actions[0].destination[0]][unit.actions[0].destination[1]].undr == kolej
                        )
                            unit.actions = []*/
                            
                    //}
                }
            }
            var possible_targets2 = []
            for(var i in possible_targets){
                var pt = possible_targets[i]
                if(pt.dist <= addedHexes[pt.hex.heks.x+'#'+pt.hex.heks.y]){
                    if(true || pt.hex.heks.x+'#'+pt.hex.heks.y in sidima){
                        //possible_targets2 = possible_targets2.filter(a => a.hex.heks.x != pt.hex.heks.x || a.hex.heks.y != pt.hex.heks.y)

                        possible_targets2.push(pt)
                    }
                    //pt.hex.heks.test = pt.dist
                }
            }
            
            possible_coastlines = []
            var coastlines = []
            for(var i = 0;i<scian;i++){
                for(var j = 0;j<scian;j++){
                    var gkk = heks[i][j]
                    
                    if(inaccessible_path[i][j].inaccessible)
                        continue
                        
                    for(var k in gkk.border){
                        var neiii = gkk.border[k]
                        
                        if(neiii != null && neiii.x < scian && neiii.y < scian && inaccessible_path[i][j].coast == -1 && inaccessible_path[neiii.x][neiii.y].inaccessible && heks[i][j].z == 0){
                            inaccessible_path[i][j].coast = 1
                            coastlines.push(inaccessible_path[i][j])
                           // heks[i][j].test = String(coastTownProfit(i,j,true)/coastTownProfit(i,j,false)).slice(0,4)
                        }
                    }
                    //inaccessible_path[j] = {inaccessible:true,coast:false}
                }
            }
            possible_coastlines = coastlines.slice()
            sorted_coastlines = coastlines.map(a=>[a,coastTownProfit(a.x,a.y,true)/coastTownProfit(a.x,a.y,false)]).filter(a => a[1] >= 1.5).sort((a,b)=>a[1]-b[1]).map(a => a[0])
            possible_coastline = sorted_coastlines.length == 0 ? null : sorted_coastlines[0]
            
            /*
            var coastlines2 = []
            var townexists = false
            while(coastlines.length > 0 && !townexists){
                for(var i in coastlines){
                    var field = coastlines[i]
                    
                    for(var j in heks[field.x][field.y].border){
                        var h2 = heks[field.x][field.y].border[j]
                        if(h2 == null || h2.x >= scian || h2.y >= scian)
                            continue
                            
                        var ip2 = inaccessible_path[h2.x][h2.y]
                        
                        if(!ip2.inaccessible && h2.z >= 0 && ip2.coast == -1 && !coastlines2.includes(ip2)){
                            //if(h2.z > 0)
                            //    townexists = true
                            ip2.coast = field.coast+1
                            heks[ip2.x][ip2.y].test = "C"+ip2.coast
                            coastlines2.push(ip2)
                        }
                    }
                }
                
                coastlines = coastlines2
                coastlines2 = []
            }*/
            
            //possible_targets = possible_targets2
            //possible_targets.sort((x,y)=>-(x.hex.units.reduce((a,b)=>a+evalUnitDefense(b),0)-x.hex.il) * Math.pow(0.5,x.dist) + (y.hex.units.reduce((a,b)=>a+evalUnitDefense(b),0) - y.hex.il) * Math.pow(0.5,y.dist))
            possible_targets.sort((a,b)=>a.dist - b.dist)
            //possible_targets.sort((a,b)=>(-(a.hex.z+2)/Math.pow(2,a.dist) + (b.hex.z+2)/Math.pow(2,b.dist)))
            //console.log(possible_targets)
            //possible_targets = possible_targets.filter(x => x.distanceMap)
            possible_targets = possible_targets.slice(0,15)
            
            
            tryMakeDestinationMap(dbetter,kolej)
            //possible_targets.sort(() => Math.random() - 0.5)
            overall_score_changed = false
            aistan = 1.3
        break
        case 1.3:
            if(possible_targets_ix >= possible_targets.length){
                if(ulepszyns > 0){
                    if(overall_score_changed){
                        overall_score_changed = false
                    } else {
                        ulepszyns--
                    }
                    dfrou = copyDistmaps(dbetter)
                    evaluate(dfrou,2)
                    
                                        
                    //console.log(dfrou)
                    
                    //legalActions(dfrou)
                    aistan = 1.2
                } else {
                    dfrou = dbetter
                    
                    aistan = 1.35
                }
            } else {
                for(var ct = 0;ct<12;ct++){
                    var tested_target = possible_targets[possible_targets_ix]
                    var checkedTurn = 1
                    var checkedTurn2 = MAX_TURNS-1
                    var newDistmap = copyDistmaps(dbetter)
                    tryMakeDestinationMap(newDistmap,kolej)
                    evaluate(newDistmap,2)
                    //legalActions(newDistmap)
                    
                    var code = tested_target.hex.x+'#'+tested_target.hex.y
                    if(newDistmap.distmaps[code].alliegance[MAX_TURNS-1] != kolej){
                        tryPutUnderAttack(newDistmap,tested_target.hex.x,tested_target.hex.y,kolej,i % 2 == 1)
                    }

                    evaluate(newDistmap)
                    
                    var score1 = {}
                    var score2 = {}
                    
                    for(var i in newDistmap.score){
                        score1[i] = {}
                        for(var j in newDistmap.score[i]){
                            score1[i][j] = newDistmap.score[i][j]
                        }
                        score2[i] = {}
                        for(var j in dbetter.score[i]){
                            score2[i][j] = dbetter.score[i][j]
                        }
                    }
                    var fact = 0.8
                    for(var i in score1){
                        for(var j in score1[i]){
                            score1[i][j] = score1[i][j] * Math.pow(fact,i+1) + score2[i][j] * (1 - Math.pow(fact,i+1))
                        }
                    }
                    if(dbetter == null)
                        dbetter = newDistmap
                    var maxBetter = 0
                    var minBetter = 0
                    /*for(var t = 0;t<MAX_TURNS;t++){
                        if(Math.max(0,-score2[t][kolej] + score1[t][kolej]) > maxBetter){
                            maxBetter = Math.max(0,score2[t][kolej] - score1[t][kolej])
                        }
                        if(Math.max(0,score2[t][kolej] - score1[t][kolej]) > minBetter){
                            minBetter = Math.max(0,-score2[t][kolej] + score1[t][kolej])
                        }*/
                        
                    if(dbetter == null || score1[checkedTurn][kolej] > score2[checkedTurn][kolej] || score1[checkedTurn][kolej] >= score2[checkedTurn][kolej]*0.8 && score1[checkedTurn2][kolej] > score2[checkedTurn2][kolej]){
                        dbetter = newDistmap
                        overall_score_changed = true
                    }
                        
                    //}
                    //if(maxBetter > minBetter)
                    //    dbetter = newDistmap
                    
                    possible_targets_ix++
                    if(possible_targets_ix >= possible_targets.length)
                        break
                }
            }
        break
        case 1.35:
            pola_z_tratwami = {}
            
            for(var key in dfrou.distmaps){
                var distmap = dfrou.distmaps[key]
                
                if(distmap.hex.dru != kolej)
                    continue
                    
                /*
                if(distmap.hex.undr != kolej && (distmap.hex.units.length > 0 || distmap.hex.z > 0) && distmap.frontline){
                    possible_targets.push(distmap.hex)
                }*/
                var totalUnitSize = 0
                if(distmap.hex.units.filter(x=>x.szyt == 'w' && zast[x.rodz] == 'x' && x.il >= 20).length > 0){
                    var code = distmap.hex.x+'#'+distmap.hex.y

                    pola_z_tratwami[code] = distmap
                }
            }
            var miejsca_do_wysłania_tratw = {}
            for(var key in dfrou.distmaps){
                var distmap = dfrou.distmaps[key]
                
                if(distmap.hex.dru != kolej)
                    continue
                    
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    if(unit.szyt == 'w' || unit.szyt == 'l')
                        continue
                    
                    if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                        var result = calculatePathUntilEmbarking(distmap.maps[unit.szyt],distmap.hex,unit,unit.actions[0])
                        
                        if(result != null){
                            var code = result.x+'#'+result.y
                            if(code in miejsca_do_wysłania_tratw && miejsca_do_wysłania_tratw[code] != null){
                                miejsca_do_wysłania_tratw[code].turn = Math.min(miejsca_do_wysłania_tratw[code].turn,result.turn)
                                miejsca_do_wysłania_tratw[code].need += result.need
                                //miejsca_do_wysłania_tratw[code].addedTratwas += result.addedTratwas
                                //miejsca_do_wysłania_tratw[code].addedTratwas++
                            } else {
                                miejsca_do_wysłania_tratw[code] = result
                            }
                            //if(miejsca_do_wysłania_tratw[code].hex.units.length > 3)
                            //    miejsca_do_wysłania_tratw[code].need = 0
                        }
                        
                        //unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il,destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}]

                    }
                }
            }
            
            for(var i in pola_z_tratwami){
                var pole_z_tratwami = pola_z_tratwami[i]
                
                var map = pole_z_tratwami.maps['w'].hexmap
                
                for(var j in pole_z_tratwami.hex.units){
                    var unit = pole_z_tratwami.hex.units[j]
                    
                    if(unit.szyt == 'w' && zast[unit.rodz] == 'x'){
                        if(unit.actions.length == 1 && unit.actions[0].type == 'move' && unit.actions[0].by == 'real'){
                            var code = unit.actions[0].destination[0] + '#' + unit.actions[0].destination[1]
                            if(code in miejsca_do_wysłania_tratw && miejsca_do_wysłania_tratw[code] != null && miejsca_do_wysłania_tratw[code].addedTratwas<3){
                                miejsca_do_wysłania_tratw[code].satisfied += unit.actions[0].il
                                miejsca_do_wysłania_tratw[code].addedTratwas++
                                pole_z_tratwami.addedTratwas--
                                continue
                            }
                        }
                        
                    }
                    
                    for(var k in map){
                        var field = map[k]
                        
                        var code = field.hex.x+'#'+field.hex.y
                        
                        if(code in miejsca_do_wysłania_tratw){
                                        
                            var result = getRuch(map,field)
                            
                            var ruchk = result.ruchk
                            var rucho = result.rucho
                            
                            if(pole_z_tratwami.x+'#'+pole_z_tratwami.y == code && miejsca_do_wysłania_tratw[code].satisfied > miejsca_do_wysłania_tratw[code].needed)
                                continue
                            
                            if(pole_z_tratwami.x+'#'+pole_z_tratwami.y == code && miejsca_do_wysłania_tratw[code].addedTratwas > 3)
                                continue
                            
                            var liczba = unit.il
                            //console.log(pole_z_tratwami.hex.units,pole_z_tratwami.hex.units.filter(a => a.actions.length > 0 && a.actions[0].type == 'move'))
                            if(pole_z_tratwami.hex.units.filter(a => a.actions.length > 0 && a.actions[0].type == 'move').length > pole_z_tratwami.hex.units.length-1){
                                liczba = unit.il-10
                            }
                            if(liczba < 5)
                                continue
                        
                            var action = {type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:liczba,from:[pole_z_tratwami.x,pole_z_tratwami.y],destination:leadPath(pole_z_tratwami.hex.x,pole_z_tratwami.hex.y,ruchk,rucho)}
                            
                            var turnsToGo = Math.floor(ruchk.length/unit.szy)
                            
                            var possibleMove = { unit:unit, unitId:unit.id, dru:unit.d, action:action, turnsToGo: turnsToGo }

                            miejsca_do_wysłania_tratw[code].possibleMoves.push(possibleMove)
                        }
                    }
                }
            }
                        
            var użyteTratwy = {}
            
            completely_used_passages = {}

            var miejsca = Object.values(miejsca_do_wysłania_tratw).sort((a,b)=>a.turn-b.turn)
            
            for(var i in miejsca){
                var miejsce = miejsca[i]
                miejsce.possibleMoves.sort((a,b)=>a.turnsToGo-b.turnsToGo)
                
                for(var j in miejsce.possibleMoves){
                    if(miejsce.satisfied > miejsce.need || miejsce.addedTratwas > 2){
                        break
                    }
                        
                    var possibleMove = miejsce.possibleMoves[j]
                    
                    if(użyteTratwy[possibleMove.unit.id])
                        continue
                        
                    miejsce.satisfied += possibleMove.unit.il
                    miejsce.addedTratwas++
                    possibleMove.unit.actions = [possibleMove.action]
                    
                    użyteTratwy[possibleMove.unit.id] = true
                }
                
                if(miejsce.satisfied > miejsce.need){
                    completely_used_passages[miejsce.x+'#'+miejsce.y] = true
                }
            }
            
            aistan = 1.36
        break
        case 1.36:
            if(sorted_coastlines.length > 0){
                for(var key in dfrou.distmaps){
                    var distmap = dfrou.distmaps[key]
                    
                    if(distmap.hex.dru != kolej)
                        continue
                        
                    /*
                    if(distmap.hex.undr != kolej && (distmap.hex.units.length > 0 || distmap.hex.z > 0) && distmap.frontline){
                        possible_targets.push(distmap.hex)
                    }*/
                    var totalUnitSize = 0
                    for(var i in distmap.hex.units){
                        var unit = distmap.hex.units[i]
                        
                        if(possible_coastlines.filter(a=>a.x == distmap.hex.x && a.y == distmap.hex.y).length > 0){
                            createCity(unit.id)
                        } else if(zast[unit.rodz] == 'm' && unit.actions.length == 0 && unit.rozb < 10){
                            
                            var possible_destinations = []
                            
                            var map = distmap.maps['n'].hexmap

                            for(var k in map){
                                var field = map[k]
                                
                                var code = field.hex.x+'#'+field.hex.y
                                
                                if(sorted_coastlines.filter(a=>a.x == field.hex.x && a.y == field.hex.y).length > 0 && field.dist != -1)
                                    possible_destinations.push(field)
                                
                                /*
                                if(code in miejsca_do_wysłania_tratw){
                                                
                                    var result = getRuch(map,field)
                                    
                                    var ruchk = result.ruchk
                                    var rucho = result.rucho
                                
                                    var action = {type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il,from:[pole_z_tratwami.x,pole_z_tratwami.y],destination:leadPath(pole_z_tratwami.hex.x,pole_z_tratwami.hex.y,ruchk,rucho)}
                                    
                                    var turnsToGo = Math.floor(ruchk.length/unit.szy)
                                    
                                    var possibleMove = { unit:unit, unitId:unit.id, dru:unit.d, action:action, turnsToGo: turnsToGo }

                                    miejsca_do_wysłania_tratw[code].possibleMoves.push(possibleMove)
                                }*/
                            }
                            //console.log([distmap.hex.x,distmap.hex.y,possible_destinations.sort((a,b)=>a.dist-b.dist)])
                            
                            if(possible_destinations.length > 0 && unit.il >= 55){
                                var best_dest = possible_destinations.sort((a,b)=>a.dist-b.dist)[0]
                                
                                var result = getRuch(map,best_dest)
                                
                                var ruchk = result.ruchk
                                var rucho = result.rucho
                            
                                var action = {type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il-10,from:[distmap.hex.x,distmap.hex.y],destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}
                                                                

                                unit.actions = [ action ]
                            }
                        }
                    }
                    /*
                    if(distmap.hex.units.filter(x=>x.szyt == 'w' && zast[x.rodz] == 'x' && x.il >= 20).length > 0){
                        var code = distmap.hex.x+'#'+distmap.hex.y

                        pola_z_tratwami[code] = distmap
                    }*/
                }
            }
            aistan = 1.4
        break
        case 1.4:
            actionsToReal(dfrou,kolej,completely_used_passages)
            aistan = 1.5
        break
        case 1.5:
            
            
            var endings = {}
            var paths = {}
            var relations = {}
            
            for(var i = 0;i<ruchwkolejcen;i++){
                var a_x = unix[kolej][ruchwkolejce[i]].x
                var a_y = unix[kolej][ruchwkolejce[i]].y
                if(a_x < 0 || a_x >= scian || a_y < 0 || a_y >= scian)
                    continue
                    
                if(unix[kolej][ruchwkolejce[i]].szyt == 'w' && zast[unix[kolej][ruchwkolejce[i]]] == 'x')
                    continue
                    
                var path = getLeadedPath(a_x,a_y,unix[kolej][ruchwkolejce[i]].ruchk,unix[kolej][ruchwkolejce[i]].rucho)
                
                if(path == undefined)
                    continue
                
                paths[ruchwkolejce[i]] = path
                var pathcode = path.x+'#'+path.y
                
                if(!(pathcode in endings))
                    endings[pathcode] = new Set()
                    
                endings[pathcode].add(ruchwkolejce[i])
                
            }
            
            for(var unit_id in paths){
                var path_set = paths[unit_id]
                var code1 = path_set.x+'#'+path_set.y
                for(var j in path_set.path){
                    var code2 = path_set.path[j].x+'#'+path_set.path[j].y
                    if(code2 in endings){
                        var setarray = Array.from(endings[code2])
                        for(var k in setarray){
                            if(!(unit_id in relations))
                                relations[unit_id] = new Set()
                            relations[unit_id].add(setarray[k])
                        }
                    }
                }
            }
            for(var unit_id in paths){
                for(var unit_id_2 in paths){
                    if(unit_id != unit_id_2){
                        if(unix[kolej][unit_id].celu == -1 && unix[kolej][unit_id_2].celu != -1 && (!(unit_id_2 in relations) || unit_id_2 in relations && !(relations[unit_id_2].has(unit_id)))){
                            if(!(unit_id_2 in relations))
                                relations[unit_id_2] = new Set()
                            relations[unit_id_2].add(unit_id)
                        }
                    }
                }
            }
            var porządek = weźSilneSkładowe(relations)
            
            var ruchy_tratw = []
            for(var i=0;i<ruchwkolejcen;i++){
                if(unix[kolej][ruchwkolejce[i]].szyt == 'w' && zast[unix[kolej][ruchwkolejce[i]].rodz] == 'x')
                    ruchy_tratw.push(Number(ruchwkolejce[i]))
            }
            
            var newDivide = []
            for(var key in porządek.perskł && !ruchy_tratw.includes(porządek.perskł[key])){
                newDivide = newDivide.concat(porządek.perskł[key].map(x=>Number(x)))
            }
            newDivide = newDivide.reverse()
            
            var rest = []
            for(var i=0;i<ruchwkolejcen;i++){
                if(!ruchy_tratw.includes(ruchwkolejce[i]) && !newDivide.includes(ruchwkolejce[i]))
                    rest.push(Number(ruchwkolejce[i]))
            }
            
            ruchwkolejcen = 0
            ruchwkolejce = []
            for(var i in ruchy_tratw){
                ruchwkolejce.push(ruchy_tratw[i])
                ruchwkolejcen++
            }
            for(var i in rest){
                ruchwkolejce.push(rest[i])
                ruchwkolejcen++
            }
            for(var i in newDivide){
                ruchwkolejce.push(newDivide[i])
                ruchwkolejcen++
            }
            //console.log(newDivide)
            
            
            
            aistan = 3.99
        break
        /*
		case 2:
                    //aistan = 3
            //dfrou=distmapsFromUnit()
            //evaluate(dfrou,2)
            //legalActions(dfrou)
            
                    
			while(miastkol<mista && mist[miastkol].undr==-1)
				miastkol++;

			if(miastkol<mista && mist[miastkol].undr==kolej){
				var k = mistdefval[mist[miastkol].x][mist[miastkol].y].blisk=checknearest(mist[miastkol]);
                                //mist[miastkol].test = k
			}
			miastkol++;
			if(miastkol>=mista){
				miastkol = 0;
				aistan = 3;
			}
                    
		break;
		case 3:
            //aistan = 4
                    
                     //stary sktypt, który ma dziwny algorytm wyboru stolycy

			while(miastkol<mista && mist[miastkol].undr!=kolej)
				miastkol++;
			//if(miastkol<mista && mist[miastkol].undr==kolej){
			//	if(mist[miastkol].podatpr>0 && mist[miastkol].trybutariuszy>0){
			//		odpodatkuj(mist[miastkol].x,mist[miastkol].y,0);
			//	}
			//}
			if(miastkol<mista && mist[miastkol].undr==kolej && mist[miastkol].podatpr==0){

				var distanceMap = [];
				var ih = mist[miastkol];
				for(var a = 0;a<scian;a++){
					distanceMap[a] = [];
					for(var b = 0;b<scian;b++){
						distanceMap[a][b] = {distance:(scian*scian),prev:-1,pn:1};
					}
				}
				distanceMap[ih.x][ih.y].distance = 0;
				var findLayer = [mist[miastkol]];
				var findLayer2 = [];
				var findLayerCount = 1;
				while(findLayerCount>0){
					var extr = findLayer[0];
					for(var i = 1;i<findLayerCount;i++){
						findLayer[i-1]=findLayer[i];
					}
					findLayerCount--;
					for(var i = 0;i<6;i++){
						if(extr.border[i]!=null && Math.max(extr.border[i].x,extr.border[i].y)<scian){
							ih = extr.border[i];
							if(distanceMap[ih.x][ih.y].distance>=scian*scian && (ih.undr==kolej  || ih.undr==-1)){
							} else {
								var strata = 2;
								if(heks[extr.x][extr.y].z==-2)
									strata = 5;
								else if(heks[extr.x][extr.y].z==-1)
									strata = 8;
								var pn = 1;
								while(ih.border[i]!=null && Math.max(extr.border[i].x,extr.border[i].y)<scian && ih.z>0 && ih.undr==kolej && ih!=mist[miastkol]){

									ih = ih.border[i];

									if(ih.z==-2)
										strata += 5;
									else if(ih.z==-1)
										strata += 8;
									else
										strata += 2;
									pn++;
								}
								if(istn(ih.x,ih.y) && distanceMap[ih.x][ih.y].distance+strata<distanceMap[extr.x][extr.y].distance){
									distanceMap[extr.x][extr.y].distance=distanceMap[ih.x][ih.y].distance+strata;
									distanceMap[extr.x][extr.y].prev = i;
									distanceMap[extr.x][extr.y].pn = pn;
								}
							}
						}
					}
					for(var i = 0;i<6;i++){
						if(extr.border[i] && Math.max(extr.border[i].x,extr.border[i].y)<scian){
							ih = extr.border[i];
							if(distanceMap[ih.x][ih.y].distance>=scian*scian && (ih.undr==kolej || ih.undr==-1)){
								if(!contains(findLayer,findLayerCount,ih,distanceMap[ih.x][ih.y].distance)){
									findLayer[findLayerCount] = ih;
									distanceMap[ih.x][ih.y].distance=distanceMap[extr.x][extr.y].distance+9;
									var aas = findLayerCount;
									while(aas>0 && distanceMap[findLayer[aas-1].x][findLayer[aas-1].y]>distanceMap[findLayer[aas].x][findLayer[aas].y]){
										var aux = findLayer[aas-1];
										findLayer[aas-1]=findLayer[aas];
										findLayer[aas] = aux;
										aas--;
									}
									findLayerCount++;
								}
							}
						}
					}
				}
				var miastval = mist[miastkol].z+10*(mist[miastkol].hutn+mist[miastkol].prod);
				var vyborv = miastval;
				var vybor = null;
				for(var a = 0;a<scian;a++){
					for(var b = 0;b<scian;b++){
							if(heks[a][b].z>0 && heks[a][b].undr==kolej && distanceMap[a][b].distance<(scian*scian) && heks[a][b]!=mist[miastkol]){
								var v = heks[a][b].z+10*(heks[a][b].hutn+heks[a][b].prod);
								v+=mistdefval[a][b].blisk;
								//console.log(mistdefval[a][b].blisk);
								for(var i = 0;i<mist[miastkol].trybutariuszy;i++){
									v-=mist[miastkol].trybutariusze[i].z;
								}
								v-=distanceMap[a][b].distance*20;
								if(v>vyborv){
									vyborv = v;
									vybor = heks[a][b];
								}

							}

					}
				}
				if(vybor!=null){
					var path = [];
					var przesz = vybor;
					var lastkier = -1;
					var jest = true;
					while(jest && przesz!=mist[miastkol]){
						var kr =distanceMap[przesz.x][przesz.y].prev;


						path[path.length] = przesz;
						var ii = distanceMap[przesz.x][przesz.y].pn;
						while(ii>0){
							var asa = przesz;
							przesz = asa.border[kr];
							ii--;
						}
						lastkier = kr;
					}

					if(jest){
                        zazmiasto(mist[miastkol].x,mist[miastkol].y);
                        taxRange.value = 100;
                        makeTaxPath();
                        for(var i = path.length-1;i>=0;i--){
                            popodatkuj(path[i].x,path[i].y,0);
                        }
                        odzaz();
                        //odpodatkuj(vybor.x,vybor.y,0);
					}
				}
			}
			miastkol++;
			if(miastkol>=mista){
				miastkol = 0;
				aistan = 4;
			}
                   */ 
		break;
        case 3.99:
            
            miast_dist = []
            for(var i in mist){
                var miasto = mist[i]
                
                var dist = scian*scian
                if(miasto.undr == kolej){
                    
                    var code = miasto.x+'#'+miasto.y
                    var distmap = dfrou.distmaps[code]
                    for(var movement_type in distmap.maps){
                        for(var j in distmap.maps[movement_type].hexmap){
                            var hex = distmap.maps[movement_type].hexmap[j]
                            
                            if(hex.hex.dru != kolej && hex.hex.units.length > 0 && hex.dist != -1 && hex.dist < dist)
                                dist = hex.dist
                        }
                    }
                }
                miast_dist[i] = dist
            }
            
            kolejność_miast = miast_dist.map(a => [0,a])
            for(var i in kolejność_miast){
                kolejność_miast[i][0] = Number(i)
            }
            kolejność_miast.sort((a,b) => a[1]-b[1])
            
            kolejność_miast = kolejność_miast.map(a => a[0])
            
            
            aistan = 4
        break
		case 4:
			while(miastkol<mist.length && mist[kolejność_miast[miastkol]].undr==-1)
				miastkol++;
        
			if(miastkol<mist.length && mist[kolejność_miast[miastkol]].undr==kolej){
                sellSteelXY(100,mist[kolejność_miast[miastkol]].x,mist[kolejność_miast[miastkol]].y)
				var v = mist[kolejność_miast[miastkol]].z*(100-mist[kolejność_miast[miastkol]].podatpr);
				var p = Math.min(mist[kolejność_miast[miastkol]].prod,mist[kolejność_miast[miastkol]].hutn);
				for(var i = 0;i<mist[kolejność_miast[miastkol]].trybutariuszy;i++){
					v+=mist[kolejność_miast[miastkol]].trybutariusze[i].z;
				}
				var okej = -1
				for(var i = 0;i<mist[kolejność_miast[miastkol]].unp;i++){
                    if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].ruchy == 0 && unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].celu == -1){
                        okej = i
                        break
                    }
                }
                //console.log(okej)
                if(okej == -1){
                    miastkol++
                    return
                } else if(unix[kolej][mist[kolejność_miast[miastkol]].unt[mist[kolejność_miast[miastkol]].unp-1]].ruchy != 0 || unix[kolej][mist[kolejność_miast[miastkol]].unt[mist[kolejność_miast[miastkol]].unp-1]].celu != -1) {
                    mist[kolejność_miast[miastkol]].tasuj()
                }
				if(v>0){
					var needed = 0;		//todo
					
					var code = mist[kolejność_miast[miastkol]].x+'#'+mist[kolejność_miast[miastkol]].y
					var dm_lad = dfrou.distmaps[code].maps['n'].hexmap
					var dm_morze = dfrou.distmaps[code].maps['w'].hexmap
					//console.log('l',dm_lad,'m',dm_morze)
					
					//miejsca_do_wysłania_tratw[code].satisfied > miejsca_do_wysłania_tratw[code].needed
					var local_prod = 0
					var sapper_prod = 0
					
					var lad_needs = 0
					var morze_needs = 0
					var tratwa_needs = 0
					for(var i in dm_lad){
                        var hks = dm_lad[i]
                        
                        if(hks.water > 0 || hks.dist <= 0)
                            continue
                            
                        var hdru = hks.hex.d != undefined ? hks.hex.d : hks.hex.dru
                        
                        if(hdru != kolej){
                            if(hks.hex.z > 0){
                                lad_needs += Number(hks.hex.z - 15 * hks.dist)
                            }
                            for(var j in hks.hex.units){
                                var unit = hks.hex.units[j]
                                
                                if(zast[unit.rodz] == 'n'){
                                    lad_needs += Number(evalUnitDefense(unit,unit.il+unit.rozb))
                                } else if(zast[unit.rodz] == 'm'){
                                    sapper_prod += unit.il+unit.rozb
                                }
                            }
                        } else {
                            if(hks.hex.z > 0){
                                local_prod += Math.max(0,Number(hks.hex.z - 15 * hks.dist))
                            }
                            for(var j in hks.hex.units){
                                var unit = hks.hex.units[j]
                                
                                if(zast[unit.rodz] == 'n'){
                                    lad_needs -= evalUnitAttack(unit,[{il:unit.il + unit.rozb}])
                                } else if(zast[unit.rodz] == 'm'){
                                    sapper_prod += unit.il+unit.rozb
                                }
                            }
                        }
                        
                    }
                    for(var i in dm_morze){
                        var hks = dm_morze[i]
                        
                        if(hks.dist <= 0 || hks.hex.x == mist[kolejność_miast[miastkol]].x && hks.hex.y == mist[kolejność_miast[miastkol]].y)
                            continue
                        
                        var hdru = hks.hex.d != undefined ? hks.hex.d : hks.hex.dru
                        
                        
                        if(hdru != kolej){
                            if(hks.z > 0){
                                morze_needs += Number(hks.hex.z - 45 * hks.dist)
                            }
                            for(var j in hks.hex.units){
                                var unit = hks.hex.units[j]
                                
                                if(zast[unit.rodz] == 'n'){
                                    morze_needs += Number(evalUnitDefense(unit,unit.il+unit.rozb))
                                }
                            }
                        } else {
                            if(hks.hex.z > 0){
                                local_prod += Math.max(Number(hks.hex.z - 15 * hks.dist))
                            }
                            for(var j in hks.hex.units){
                                var unit = hks.hex.units[j]
                                
                                if(zast[unit.rodz] == 'n' && szyt[unit.rodz] == 'w'){
                                    morze_needs -= evalUnitAttack(unit,[{il:unit.il + unit.rozb}])
                                }
                            }
                        }
                    }
                    
					//mist[miastkol].test = Math.floor(lad_needs) + '/' + Math.floor(morze_needs)
                    
                    if(morze_needs > lad_needs && morze_needs > 0)
                        needed = 6
                    
                    //mist[kolejność_miast[miastkol]].test = lad_needs+'/'+morze_needs
					/*
                    var wb = waterbodies.filter(a => a.hexes.filter(h => h.x == mist[miastkol].x && h.y == mist[miastkol].y).length > 0)
                    wb = wb.length > 0 ? wb[0] : null
                    if(wb && wb.cities.length < wb.hexes.length){
                        var neededToShip = 0
                        for(var i in wb.cities){
                            var city = wb.cities[i]
                            
                            if(city.undr == -1){
                                neededToShip += 15
                            } else if(city.undr != kolej) {
                                neededToShip += (evaluateAttackStrength(city)[1] + evaluateAttackStrength(city)[3])
                            } else {
                                var isShip = false
                                for(var j = 0;j<city.unp;j++){
                                    if(unix[kolej][city.unt[j]].szyt == 'w' && zast[unix[kolej][city.unt[j]].rodz] == 'n'){
                                        neededToShip -= unix[kolej][city.unt[j]].il+unix[kolej][city.unt[j]].rozb
                                        isShip = true
                                    }
                                }
                                //if(isShip)
                                //    neededToShip -= 50

                            }
                        }
                        if(neededToShip > 0){
                            needed = 6
                        }
                        //console.log(mist[miastkol].x,mist[miastkol].y,wb)
                    }*/
                    
                    var needednum = 99
                    var enough_units_produced = Math.max(lad_needs,morze_needs) <= local_prod * 1.5 && miast_dist[kolejność_miast[miastkol]] > 4
                    if(enough_units_produced && possible_coastline != null && sapper_prod <= 20){
                        needed = 11
                        needednum = 60
                    }
                    
                    if(!enough_units_produced || needed == 11){
                        var creat = -1;
                        for(var i = 0;i<mist[kolejność_miast[miastkol]].unp;i++){
                            if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].rodz==needed && unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].il<80)
                                creat = i;
                            if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].rozb > 0)
                                creat = i
                        }
                        if(creat>-1){
                            unix[kolej][mist[kolejność_miast[miastkol]].unt[creat]].rozb=Math.max(needednum-unix[kolej][mist[kolejność_miast[miastkol]].unt[creat]].il, 0);
                        }
                        if(mist[kolejność_miast[miastkol]].unp>=4){
                            
                        } else if(creat==-1 && mist[kolejność_miast[miastkol]].unp > 0) {
                            dodai(mist[kolejność_miast[miastkol]].x,mist[kolejność_miast[miastkol]].y,0,needed,needednum);
                            odzaz(); 
                        }
                    }
					mist[kolejność_miast[miastkol]].test = String(Math.max(lad_needs,morze_needs)).split('.')[0]+'/'+String(local_prod).split('.')[0]
				}
			}
			miastkol++;
			if(miastkol>=mist.length){
				checkedunit = 0;
				checkedunitstage = 0;
				aistan = 5;
			}
		break;
		case 5:
			/*checkedunitstage:
				0 - sprawdzenie, czy jest bezpiecznie i czy można wysłać jednostki
				1 - sprawdzanie najbliższych miast, czy da sie atakować
			*/
			while(checkedunit<oddid[kolej] && unix[kolej][checkedunit].kosz)
				checkedunit++;
			if(checkedunit<oddid[kolej]){

				checkedunit++;
			} else {
				aistan = 9001;
			}
		break;
		case 9001:
            zaznx = -1
            zazny = -1
            tx = -1
            ty = -1
            zaznu = -1
			changeState(4);
		break;
	}
}
function dfsStack(v,visited,stack,relations){
    visited[v] = true
    if(!(v in relations))
        return
    var arrayFromSet = Array.from(relations[v])
    for(var i in arrayFromSet){
        var v2 = arrayFromSet[i]
        
        if(!visited[v2]){
            dfsStack(v2,visited,stack,relations)
        }
        
        stack.push(v)
    }
}
function dfsAdd(v,visited,transponded,składowa_które_należy,cn){
    visited[v] = true
    składowa_które_należy[v] = cn
    for(var i in transponded[v]){
        var v2 = transponded[v][i]
        if(!visited[v2]){
            dfsAdd(v2,visited,transponded,składowa_które_należy,cn)
        }
    }
}
function weźSilneSkładowe(relations){
    var allVertices = Array.from(new Set(Object.values(relations).map(x=>Array.from(x)).reduce((a,b)=>a.concat(b),[]).concat(Object.keys(relations)).map(x=>Number(x))))
    
    var visited = {}
    var stack = []
    for(var i in allVertices){
        visited[allVertices[i]] = false
    }
    for(var i in allVertices){
        dfsStack(allVertices[i],visited,stack,relations)
    }
    var transponded = {}
    for(var key in relations){
        var arrayFromSet = Array.from(relations[key])
        for(var j in arrayFromSet){
            var key2 = arrayFromSet[j]
            if(!(key2 in transponded))
                transponded[key2] = []
            transponded[key2].push(key)
        }
    }
    for(var i in allVertices){
        visited[allVertices[i]] = false
    }
    
    var składowa_które_należy = {}
    var cn = 0
    while(stack.length > 0){
        var v = stack.pop()
        
        if(visited[v])
            continue
            
        cn++
        
        dfsAdd(v,visited,transponded,składowa_które_należy,cn)
    }
    
    var jednostki_wg_składowych = {}
    var relacje_między_składowymi = {}
    
    for(var key in składowa_które_należy){
        var key2 = składowa_które_należy[key]
        if(!(key2 in jednostki_wg_składowych))
            jednostki_wg_składowych[key2] = []
        jednostki_wg_składowych[key2].push(key)
    }
    for(var key1 in jednostki_wg_składowych){
        for(var i in jednostki_wg_składowych[key1]){
            var unit_id = jednostki_wg_składowych[key1][i]
            var arrayFromSet = Array.from(relations[unit_id])
            for(var j in arrayFromSet){
                var dest = arrayFromSet[j]
                if(składowa_które_należy[dest] != key1){
                    if(!(key1 in relacje_między_składowymi))
                        relacje_między_składowymi[key1] = new Set()
                    if(dest in składowa_które_należy)
                        relacje_między_składowymi[key1].add(składowa_które_należy[dest])
                }
            }
        }
    }
    return {perskł:jednostki_wg_składowych,relation:relacje_między_składowymi}
}
function attfunc(hexx,hexy){
	var powermap = [];
	for(var i = 0;i<12;i++){
		var powerobj = checkattbytype(hexx,hexy,i);

		for(var j = 0;j<12;i++){
			powermap[j]+=powerobj[j];
		}
	}
}
function checkattbytype(hexx,hexy,rodz){
	var poczhex = [hex[hexx][hexy]];
	switch(szy){

	}
}
function contains(tab,tabn,obj){
	for(var i = 0;i<tabn;i++){
		if(tab[i]==obj)
			return true;
	}
	return false;
}
function odzaz(){
    if(zaznu > 0)
        odzaznaj()
	odzaznam(0);
	zaznx = -1;
	zazny = -1;
    zaznu = -1
    tx = -1
    ty = -1
}
function zazmiasto(hex,hey){

	if(zaznx!=-1){
		odzaznam(0);
		heks[zaznx][zazny].zmiana++;
		zaznx = -1;
		zazny = -1;

	}
	zaznx = hex;
	zazny = hey;
	if(zaznu!=-1){
		odzaznaj();
		zaznu = -1;
	}
	cityName.value = heks[zaznx][zazny].nazwa;
}

function distance(x1,y1,x2,y2){
    if(x1 % 2 == 0){
        if( y2 - y1 > Math.floor(Math.abs( (x2 - x1) / 2 ) ) ){
            return Math.abs( x2 - x1 ) + ( y2 - y1 - Math.floor(Math.abs( (x2 - x1) / 2 ) ) )
        } else if( y2 - y1 < -Math.ceil(Math.abs( (x2 - x1) / 2 ) )) {
            return Math.abs( x2 - x1 ) + ( y1 - y2 - Math.ceil(Math.abs( (x2 - x1) / 2 ) ) )
        } else {
            return Math.abs(x2 - x1)
        }
    } else {
        if( y2 - y1 > Math.ceil(Math.abs( (x2 - x1) / 2 ) ) ){
            return Math.abs( x2 - x1 ) + ( y2 - y1 - Math.ceil(Math.abs( (x2 - x1) / 2 ) ) )
        } else if( y2 - y1 < -Math.floor(Math.abs( (x2 - x1) / 2 ) )) {
            return Math.abs( x2 - x1 ) + ( y1 - y2 - Math.floor(Math.abs( (x2 - x1) / 2 ) ) )
        } else {
            return Math.abs(x2 - x1)
        }
    }
}

function copyHexdistmap(hexdistmap,hekstable){
    //{ hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  }
    return hexdistmap.map( x => new Object({ hex: hekstable[x.hex.x][x.hex.y], dist: x.dist, water : x.water, from: x.from === null ? null : hekstable[x.from.x][x.from.y], embarking: x.embarking }))
}
function copyHexrangemap(hexrangemap,hekstable){
    //{ hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  }
    return hexrangemap.map( x => new Object({ hex: hekstable[x.hex.x][x.hex.y], dist: x.dist}))
}

function populateEmbarkingPossibility(hekstable,checkedGrid,x,y,il){
    var thex = {}
    thex[x+','+y] = true
    var temp1 = [hekstable[x][y]]
    var temp2 = []
    checkedGrid[x][y].embarking += il
    while(temp1.length>0){
        for(var i in temp1){
            var g = temp1[i]
            g.waterbody = this
            //g.test = il
            checkedGrid[g.x][g.y].embarking += il
            
            for(var j = 0;j<6;j++){
                var h = g.border[j]
                if(h != null && (h.x == undefined || not_outside_board(h)) && !(h.x+','+h.y in thex) && (h.z == -1 || h.z>0) && (true || h.undr != undefined && h.undr != kolej || h.dru != undefined && h.dru != kolej)){
                    thex[h.x+','+h.y] = true
                    
                    temp2.push(h)
                }
            }
        }
        temp1 = temp2
        temp2 = []
    }
}
function addEmbarkingPossibility(hekstable,checkedGrid){

    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            if('unp' in hekstable[i][j]){
                for(var k = 0;k<hekstable[i][j].unp;k++){
                    var unit = unix[hekstable[i][j].undr][hekstable[i][j].unt[k]]
                    if(unit.d == kolej && szyt[unit.rodz] == 'w' && zast[unit.rodz] == 'x'){
                        populateEmbarkingPossibility(hekstable,checkedGrid,i,j,unit.il)
                    }
                }
            } else {
                for(var k = 0;k<hekstable[i][j].units.length;k++){
                    //console.log(hekstable[i][j])
                    var unit = hekstable[i][j].units[k]
                    //console.log(unit.dru,kolej,' ',szyt[unit.rodz],zast[unit.rodz])
                    if(unit.d == kolej && szyt[unit.rodz] == 'w' && zast[unit.rodz] == 'x'){
                        populateEmbarkingPossibility(hekstable,checkedGrid,i,j,unit.il)
                    }
                }
            }
            
        }
    }
}

function hexdistmap(x,y,water,mountain,air,heavy,transporting,hekstable){
    if(hekstable == undefined)
        hekstable = heks
    var tocheck = [ hekstable[x][y] ]
    var tocheck2 = []
    var checkedGrid = []
    var startwater = 0//!water && !air && hekstable[x][y].z == -1 ? 1 : 0
    var checkedList = []//[ { hex: hekstable[x][y], dist: 0, water:startwater, from: null } ]
    for(var i = 0;i<scian;i++){
        checkedGrid[i] = []
        for(var j = 0;j<scian;j++){
            checkedGrid[i][j] = {dist:-1,water:startwater,range:-1,from:null,embarking:0}
            
        }
    }
    checkedGrid[x][y].dist = 0
    
    addEmbarkingPossibility(hekstable,checkedGrid)
    
    var step = 1
    while(tocheck.length > 0){
        for(var i in tocheck){
            var hexfrom = tocheck[i]
            for(var j = 0;j<6;j++){
                if(tocheck[i].border[j] != null && tocheck[i].border[j].x < scian && tocheck[i].border[j].y < scian && (checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist/* || checkedGrid[tocheck[i].x][tocheck[i].y].water + 1 < checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water*/)){
                    var hexto = tocheck[i].border[j]
                    
                    var step = 1
                    var pluswater = 0
                    
                    var unp_to = hexto.units ? hexto.units.length : hexto.unp
                    var unp_from = hexfrom.units ? hexfrom.units.length : hexfrom.unp
                    
                    var wieltratw = 0/*
                    if(hexto.units != undefined){
                        for(var k in hexto.units){
                            var uniit = hexto.units[k].rodz
                            if(szyt[uniit.rodz] == 'w' && zast[uniit.rodz] == 'x'){
                                wieltratw++
                            }
                        }
                    } else {
                        for(var k=0;k<hexto.unp;k++){
                            var uniit = unix[kolej][hexto.unt[k]]
                            if(uniit == undefined){
                                continue
                            }
                            if(szyt[uniit.rodz] == 'w' && zast[uniit.rodz] == 'x'){
                                wieltratw++
                            }
                        }
                    }*/
                    
                    var dru_to = hexto.dru ? hexto.dru : hexto.undr
                    var dru_from = hexfrom.dru ? hexfrom.dru : hexfrom.undr
                    
                    if(air){
                        
                    } else if(water){
                        step = 0.8
                        if(hexto.z == -2 || hexto.z == 0)
                            continue
                            
                        if(transporting && dru_to != -1 && dru_to != kolej){
                            continue
                        }
                        
                        if(unp_to > 3 && unp_from <= 3 && dru_to == (checkedGrid[x][y].dru != undefined ? checkedGrid[x][y].dru : checkedGrid[x][y].undr)/* && checkedGrid[x][y] != -1*/){
                            step *= 10
                        }
                        if(unp_to == 4 && dru_to == (checkedGrid[x][y].dru != undefined ? checkedGrid[x][y].dru : checkedGrid[x][y].undr)){
                            continue
                        }
                    } else {
                        
                        if(hexto.z == -2 && (heavy || hexfrom.z == -1))
                            continue
                        if(hexto.z == -2 && !mountain)
                            step = 2
                        if(hexto.z == -1){
                            if(hexfrom.z > 0){
                                //if(wieltratw > 0){
                                //    pluswater = 1
                                //} else {
                                    pluswater = 1.2
                                //}
                            } else if(hexfrom.z != -1){
                                //if(wieltratw > 0){
                                //    pluswater = 1
                                //} else {
                                if(checkedGrid[hexto.x][hexto.y].embarking > 0){
                                    pluswater = 3
                                } else {
                                    continue
                                }
                                //}
                            }
                        }
                        if(hexfrom.z == -1 && dru_to != -1 && dru_to != kolej)
                            continue
                        if(unp_to > 3 && unp_from <= 3 && dru_to == kolej/* && checkedGrid[x][y] != -1*/){
                            step *= 10
                        }
                        if(unp_to == 4 && dru_to == kolej){
                            continue
                        }
                    }
                    if(checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist + step + pluswater*2){
                        var dist = checkedGrid[hexfrom.x][hexfrom.y].dist + step + pluswater*2
                        var waterdist = checkedGrid[hexfrom.x][hexfrom.y].water + pluswater
                        
                        if(checkedGrid[hexfrom.x][hexfrom.y].from != undefined && hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y] != undefined && checkedGrid[hexfrom.x][hexfrom.y].from.x == hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y].x && checkedGrid[hexfrom.x][hexfrom.y].from.y == hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y].y)
                            continue
                            
                        //console.log(dist)
                        tocheck2.push(tocheck[i].border[j])
                        //checkedList.push( { hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  } )
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist = dist
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water = waterdist
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].from = hexfrom
                        
                        //if(heks[x][y].unp >= 1 && heks[x][y].z >= 0 && heks[x][y].undr == kolej){
                            //heks[hexto.x][hexto.y].test = hexfrom != null//(3+j)%6//checkedGrid[hexto.x][hexto.y].embarking
                            //console.log([hexto.x,hexto.y,checkedGrid[hexto.x][hexto.y].embarking])
                        //}
                        
                        //heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = waterdist//(3+j) % 6
                        
                        //if(heks[x][y].unp >= 1 && heks[x][y].z >= 0 && !water && !mountain && !air && !heavy){
                        //    heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = (3+j) % 6// = waterdist
//                            heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = dist+'/'+waterdist    //debug
                        //}
                    }
                }
            }
        }
        tocheck = tocheck2
        tocheck2 = []
        step++
    }
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            //if(heks[x][y].unp >= 1 && heks[x][y].z >= 0 && heks[x][y].undr == kolej && !water && !mountain && !air && !heavy && !transporting){
            //    heks[i][j].test = checkedGrid[i][j].dist//(3+j)%6//checkedGrid[hexto.x][hexto.y].embarking
            //}
            //if(!water && !mountain && !air && !transporting)
            //      heks[i][j].test = checkedGrid[i][j].dist
            checkedList.push( { hex: hekstable[i][j], dist: checkedGrid[i][j].dist, water : checkedGrid[i][j].water, from: checkedGrid[i][j].from, embarking: checkedGrid[i][j].embarking } )
        }        
    }
    //if(!water && !mountain && !heavy && !air && !transporting && heks[x][y].unp >= 1 && heks[x][y].z >= 0 && heks[x][y].undr == kolej)
    //    console.log(x+' '+y,checkedList)

    return checkedList
}
function hexrangemap(x,y,water,mountain,air,heavy,hekstable){
    if(hekstable == undefined)
        hekstable = heks
        
    var LARGEST_DIST = zas.reduce((a,b)=>Math.max(a,b),0)
    //console.log(LARGEST_DIST)
    var checkedList = []
    for(var _x in hekstable){
        for(var _y in hekstable[_x]){
            var dist = distance(x,y,_x,_y)
            if(dist < LARGEST_DIST){
                var _hex = hekstable[_x][_y]
                
                checkedList.push({ hex: _hex, dist: dist })
            }
        }
    }
    
    return checkedList
    
    /*
    var tocheck = [ hekstable[x][y] ]
    var tocheck2 = []
    var checkedGrid = []
    var startwater = !water && !air && hekstable[x][y].z == -1 ? 1 : 0
    var checkedList = [ { hex: hekstable[x][y], dist: 0, water:startwater, from: null } ]
    for(var i = 0;i<scian;i++){
        checkedGrid[i] = []
        for(var j = 0;j<scian;j++){
            checkedGrid[i][j] = {dist:-1,water:startwater}
        }        
    }
    checkedGrid[x][y].dist = 0
    
    var LARGEST_DIST = zas.reduce((a,b)=>Math.max(a,b),0)
    
    var step = 1
    while(tocheck.length > 0){
        for(var i in tocheck){
            var hexfrom = tocheck[i]
            for(var j = 0;j<6;j++){
                if(tocheck[i].border[j] != null && tocheck[i].border[j].x < scian && tocheck[i].border[j].y < scian && (checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist + step/* || checkedGrid[tocheck[i].x][tocheck[i].y].water + 1 < checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water*//*)){
                    var hexto = tocheck[i].border[j]
                    
                    var step = 1
                    var pluswater = 0
                    
                    /*
                    if(air){
                        
                    } else if(water){
                        if(hexto.z == -2 || hexto.z == 0)
                            continue
                    } else {
                        if(hexto.z == -2 && heavy)
                            continue
                        if(hexto.z == -2 && !mountain)
                            step = 2
                        if((hexfrom.z > 0 || hexfrom.z == -1) && hexto.z == -1){
                            pluswater = 1
                        if(hexto.unp > 3 && hexfrom.unp <= 3 && hexto.undr == checkedGrid[x][y].undr && checkedGrid[x][y] != -1)
                            step *= 10
                        } else if(hexfrom.z != -1 && hexto.z == -1){
                            continue
                        }
                    }*//*
                    var dist = checkedGrid[hexfrom.x][hexfrom.y].dist + step// + pluswater*2
                    if(dist > LARGEST_DIST)
                        continue
                    //var waterdist = checkedGrid[hexfrom.x][hexfrom.y].water + pluswater
                    
                    //console.log(dist)
                    tocheck2.push(tocheck[i].border[j])
                    checkedList.push( { hex: tocheck[i].border[j], dist: dist, from: hexfrom  } )
                    checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist = dist
                    checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].from = hexfrom
                    
                    //heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = dist    //debug
                }
            }
        }
        tocheck = tocheck2
        tocheck2 = []
        step++
    }
    return checkedList*/
}


function coastTownProfit(x,y,afterplaced){
    var hekstable = heks
    var firsthex = hekstable[x][y]
    var tocheck = [ firsthex ]
    var tocheck2 = []
    var checkedGrid = []
    var startwater = 0//!water && !air && hekstable[x][y].z == -1 ? 1 : 0
    var checkedList = []//[ { hex: hekstable[x][y], dist: 0, water:startwater, from: null } ]
    for(var i = 0;i<scian;i++){
        checkedGrid[i] = []
        for(var j = 0;j<scian;j++){
            checkedGrid[i][j] = {dist:-1,embarking:0}
            
        }        
    }
    checkedGrid[x][y].dist = 0
    
    var newAccess = 0
    
    var step = 0
    while(tocheck.length > 0){
        for(var i in tocheck){
            var hexfrom = tocheck[i]
            for(var j = 0;j<6;j++){
                if(tocheck[i].border[j] != null && tocheck[i].border[j].x < scian && tocheck[i].border[j].y < scian && (checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist)){
                    var hexto = tocheck[i].border[j]
                    
                    var landstep = 1
                    var embarkingstep = 0
                    var pluswater = 0
                    
                    
                    /*
                    if(hexto.units != undefined){
                        for(var k in hexto.units){
                            var uniit = hexto.units[k].rodz
                            if(szyt[uniit.rodz] == 'w' && zast[uniit.rodz] == 'x'){
                                wieltratw++
                            }
                        }
                    } else {
                        for(var k=0;k<hexto.unp;k++){
                            var uniit = unix[kolej][hexto.unt[k]]
                            if(uniit == undefined){
                                continue
                            }
                            if(szyt[uniit.rodz] == 'w' && zast[uniit.rodz] == 'x'){
                                wieltratw++
                            }
                        }
                    }*/
                    
                    var dru_to = hexto.dru ? hexto.dru : hexto.undr
                    var dru_from = hexfrom.dru ? hexfrom.dru : hexfrom.undr
                    
                        
                    if(hexto.z == -2 && hexfrom.z == -1)
                        continue
                    if(hexto.z == -1){
                        if(hexfrom.z > 0){
                            
                        } else if(hexfrom.z != -1 && (hexfrom != firsthex || !afterplaced)){
                            embarkingstep = 1
                        }
                    }
                    if(hexfrom.z == -1 && dru_to != -1 && dru_to != kolej)
                        continue
                    
                    if(checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || (checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist + landstep && checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].embarking == checkedGrid[tocheck[i].x][tocheck[i].y].embarking + embarkingstep) || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].embarking > checkedGrid[tocheck[i].x][tocheck[i].y].embarking + embarkingstep){
                        var dist = 1
                            
                        //console.log(dist)
                        tocheck2.push(hexto)
                        //checkedList.push( { hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  } )
                        var newdist = checkedGrid[tocheck[i].x][tocheck[i].y].dist + landstep
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist = newdist
                        var newembarking = checkedGrid[tocheck[i].x][tocheck[i].y].embarking + embarkingstep
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].embarking = newembarking
                        
                        //if(!water && !mountain && !air && !heavy){
                        //    heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = dist+'/'+waterdist    //debug
                        //}
                        
                        //if(checkedGrid[hexto.x][hexto.y] == -1/* && inaccessible_path[hexto.x][hexto.y].inaccessible)*/){
                            //console.log(4)
                        if(hexto.z > 0){
                            if(hexto.undr != kolej)
                                newAccess += (1 / Math.pow(2,newembarking)) * Math.max(hexto.z - newdist,5)
                            else
                                newAccess += (1 / Math.pow(2,newembarking)) * (newembarking <= 0 ? 0 : Math.max(hexto.z - newdist,5) * 2)
                        }
                        //}
                            
                    }
                }
            }
        }
        tocheck = tocheck2
        tocheck2 = []
        step++
    }
    return newAccess
    /*
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            checkedList.push( { hex: hekstable[i][j], dist: checkedGrid[i][j].dist, water : checkedGrid[i][j].water, from: checkedGrid[i][j].from } )
        }        
    }
    return checkedList*/
    
}


function cityscore(hex){
    if(hex.z <= 0)
        return 0
    return hex.z + (hex.hutn + hex.prod) * 2
}
class Level {
    constructor(x,y,hexes,range,level){
        this.x = x
        this.y = y
        this.hexes = hexes
        this.range = range
        this.level = level
        
        this.score = hexes.map(x=>cityscore(x.hex)).reduce((a,b)=>a+b,0)
        
        //this.belongs = false
        
        this.subordinates = []
    }
    compare(other_hexes){
        if(other_hexes.filter(h=>h.hex.x == this.x && h.hex.y == this.y).length == 0)
            return true
            
        var mapped1 = this.hexes.map(h=>[h.hex.x+'-'+h.hex.y,cityscore(h.hex)]).sort()
        var mapped2 = other_hexes.map(h=>[h.hex.x+'-'+h.hex.y,cityscore(h.hex)]).sort()
        
        var common = []
        var ix2 = 0
        for(var i=0;i<mapped1.length;i++){
            while(ix2 < mapped2.length && mapped2[ix2][0] < mapped1[i][0]){
                ix2++
            }
            if(ix2 < mapped2.length && mapped2[ix2][0] == mapped1[i][0]){
                common.push(mapped1[i])
            }
        }
        return common.map(x=>x[1]).reduce((a,b)=>a+b,0) * 2 < mapped2.map(x=>x[1]).reduce((a,b)=>a+b,0)
    }
    addBelonging(levels){
        for(var i in levels){
            var level = levels[i]
            //if(level.belongs && level.level < this.level - 1)
            //    continue
            
            for(var j in this.hexes){
                var hex = this.hexes[j]
                if(hex.hex.x == level.x && hex.hex.y == level.y/* && hex.dist + level.range <= this.range*/){
                    //console.log(hex.dist, level.range, this.range)
                    this.subordinates.push(level)
                    //level.belongs = true
                    break
                }
            }
        }
    }
}
function aidistmap(){
    var miasta = heks.flat().filter(x=>x.z > 0 || x.unp > 0).sort((a,b)=>b.z-a.z)
    var levels = {
        1:{land:[],water:[]}
    }
    
    for(var l = 1;l<=10;l++){
        var newLevel = {land:[],water:[]}
        var nmiasta = miasta.map(m=>[hexdistmap(m.x,m.y,false,false,false,false,false).filter(x=>x.dist <= 2*l),m]).map(([distmap,m])=>[distmap,m,distmap.map(x=>cityscore(x.hex)).reduce((a,b)=>a+b,0)]).sort((a,b)=>-a[2]+b[2])
        for(var i in nmiasta){
            var miasto = nmiasta[i][1]
            var land_distmap = nmiasta[i][0]
            //var water_distmap = hexdistmap(miasto.x,miasto.y,true,false,false,false).filter(x=>x.dist <= 3)
            
            var canpushLand = true
            for(var j in newLevel.land){
                if(!newLevel.land[j].compare(land_distmap)){
                    canpushLand = false
                    break
                }
            }
            if(canpushLand){
                newLevel.land.push(new Level(miasto.x,miasto.y,land_distmap,2*l,l))
                //miasto.test = i
            }
            //newLevel.water.push(water_distmap)
        }
        /*
        for(var j in newLevel.land){
            if(l > 1){
                newLevel.land[j].addBelonging(levels[l-1].land)
                if(newLevel.land[j].subordinates.length > 1)
                    heks[newLevel.land[j].x][newLevel.land[j].y].test = l
            } else {
                heks[newLevel.land[j].x][newLevel.land[j].y].test = 1
            }
        }*/
                //redraw(true);
        levels[l] = newLevel
    }
    return levels
}
function checkDistmapDistance(distmap){
    for(var level in distmap){
        var areas = distmap[level].land
        for(var i in areas){
            var area = areas[i]
            area.attackEvaluation = {}
            area.defenseEvaluation = {}
            area.productionPotential = {}
            for(var j = 0;j<12;j++){
                area.attackEvaluation[j] = 0
                area.defenseEvaluation[j] = 0
                area.productionPotential[j] = 0
            }
            for(var j in area.hexes){
                var h = area.hexes[j].hex
                var value = evaluateAttackStrength(h)
                if(h.undr >= 0){
                    area.attackEvaluation[h.undr] += value[0]
                    area.defenseEvaluation[h.undr] += value[1]
                    
                    area.productionPotential[h.undr] -= -evaluateProductionPotential(h,level)
                }
            }
            var maxeval = 0
            var evalcolor = '#000'
            for(var j in area.attackEvaluation){
                if(area.attackEvaluation[j] + area.productionPotential[j] > maxeval){
                    maxeval = area.attackEvaluation[j] + area.productionPotential[j]
                    evalcolor = kolox(j,0)
                }
            }
            var allAreaValues = Object.values(area.attackEvaluation).reduce((a,b) => a+b,0) + Object.values(area.productionPotential).reduce((a,b) => a+b,0)
            //heks[area.x][area.y].test = level+'#'+(maxeval * 2 - allAreaValues)
            //heks[area.x][area.y].testColor = evalcolor
        }
    }
}

function evaluateAttackStrength(h){
    var dr = h.undr
    var value = [0,0,0,0,0,0]
    if(dr < 0)
        return value
        
    for(var i = 0;i<h.unp;i++){
        var unit = unix[dr][h.unt[i]]
        var rodz = unit.rodz
        for(var j in aistratvals[rodz]){
            value[j] -= -(aistratvals[rodz][j] * unit.il)
        }
    }
    return value
}
function evaluateProductionPotential(h,level){
    var dr = h.undr
    var value = [0,0,0,0,0,0]
    if(dr < 0)
        return value
    
    return h.z / 4 * level
}

function putPath(uni, hex_x, hex_y, stopBefore, completely_used_passages){
    //szyt = ["n","c","c","n","g","c","w","w","w","l","l","n"];
    //zast = ["n","n","n","n","n","p","n","n","x","l","x","m"];

    if(!(uni in unix[kolej]))
        return
        
    var unit = unix[kolej][uni]
    unit.rozb = 0
    
    var unitDistMap = hexdistmap(unit.x,unit.y,szyt[unit.rodz] == 'w',szyt[unit.rodz] == 'g',szyt[unit.rodz] == 'l',szyt[unit.rodz] == 'c',zast[unit.rodz] == 'x')
    
    var heksk = unitDistMap.filter(a => a.hex.x == hex_x && a.hex.y == hex_y)
    if(heksk.length == 0)
        return
        
        
    var unitDistDict = {}
    for(var i in unitDistMap){
        var elem = unitDistMap[i]
        unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
    }
    heksk = heksk[0]
    var path = [heksk]
    var i = 0
    while(heksk.from != null && i<1000){
        heksk = unitDistDict[heksk.from.x+'#'+heksk.from.y]
        path.push(heksk)
        i++
    }
    path = path.map(a => new Object({x: a.hex.x, y:a.hex.y})).reverse().slice(1)
    
    if(zaznu != -1){
        odzaznaj(false)
        unit.sebix = unit.x
        unit.sebiy = unit.y
        zaznu = -1
    }
        
    zaznu = uni
    zaznaj(uni,false)
    odceluj(uni,kolej);
    oddroguj(uni,kolej,false);
    for(var i in path){
        
        if(i >= path.length - stopBefore)
            break
        var p = path[i]
        unit.rozb = 0
        droguj(p.x,p.y,uni)
        zaznaj(uni,false)
    }
    if(stopBefore == undefined){
        odzaznaj(false)
        aktdroguj(kolej,zaznu)
        unit.sebix = unit.x
        unit.sebiy = unit.y
        zaznu = -1
        tx = -1
        ty = -1
    }
    
    return path.length > 0 && unit.szyt != 'w' && unit.szyt != 'l' && heks[unit.x][unit.y].z > 0 && heks[path[0].x][path[0].y].z == -1 && !(path[0].x+'#'+path[0].y in completely_used_passages)
}


function calculatePathUntilEmbarking(unitDistMap,hex, unit, action, stopBefore){
    var he = heks[hex.x][hex.y]
    if(stopBefore == undefined)
        stopBefore = 0
        
    var speed = unit.szy

    var turn = 0
    for(var i in action.ruchk){
        if(i >= action.ruchk.length-stopBefore)
            break
        for(var j = 0;j<action.rucho[i];j++){
            he = he.border[action.ruchk[i]]
            if(he.z == -2 && unit.szyt != 'g'){
                turn++
            } else {
                turn+=1/speed
            }
            if(he.z == -1){
                var tratwas = 0
                var satisf = 0
                for(var k = 0;k<he.unp;k++){
                    var uu = unix[kolej][he.unt[k]]
                    if(uu == undefined)
                        continue
                    if(zast[uu.rodz] == 'x' && szyt[uu.rodz] == 'w' && uu.ruchy == 0){
                        tratwas++
                        satisf += uu.il
                    }
                }
                return {x:he.x,y:he.y,hex:hex,turn:Math.ceil(turn),need:unit.il,satisfied:satisf,possibleMoves:[],addedTratwas:tratwas}
            }
                
            if(he == undefined)
                return undefined
        }
    }
    return null
}

class Copyable {
    constructor(fieldsToCopy){
        this.fieldsToCopy = fieldsToCopy
    }
    getFields(obj){
        if(obj == undefined)
            obj = this
            
        var fields = {}
        for(var i in this.fieldsToCopy){
            var key = this.fieldsToCopy[i]
            
            if(key in obj){
                if(obj[key] instanceof Array){
                    fields[key] = obj[key].slice()
                } else {
                    fields[key] = obj[key]
                }
            } else {
                fields[key] = undefined
            }
        }
        return fields
    }
    setFields(fields){
        for(var key in fields){
            if(this[key] instanceof Array){
                this[key] = fields[key].slice()
            } else {
                this[key] = fields[key] 
            }
        }
    }
}
class CopyableDeeper extends Copyable {
    getFields(obj){
        if(obj == undefined)
            obj = this
            
        var fields = {}
        for(var i in this.fieldsToCopy){
            var key = this.fieldsToCopy[i]
            
            if(key in obj){
                if(obj[key] instanceof Array){
                    fields[key] = obj[key].slice()
                    for(var j in fields[key]){
                        
                        if(fields[key][j] instanceof Array){
                            fields[key][j] = fields[key][j].slice()
                        }
                    }
                } else {
                    fields[key] = obj[key]
                }
            } else {
                fields[key] = undefined
            }
        }
        return fields
    }
    setFields(fields){
        for(var key in fields){
            if(this[key] instanceof Array){
                this[key] = fields[key].slice()
                for(var j in this[key]){
                    
                    if(this[key][j] instanceof Array){
                        this[key][j] = this[key][j].slice()
                    }
                }
            } else {
                this[key] = fields[key] 
            }
        }
    }
}
function copyDict(dict){
    var newDict = {}
    for(var k in dict){
        newDict[k] = dict[k]
        if(newDict[k] instanceof Array){
            newDict[k] = newDict[k].slice()
        }
    }
    return newDict
}
class UnitAction extends Copyable {
    constructor(unit,hex){
        super(['d','il','id','rodz','ata','atakt','celd','celu','ruchk','ruchy','rucho','zalad','rozb','kolor','szy','szyt','atakt'])
        
        //this.unit = unit
        this.setFields(this.getFields(unit))
        this.actions = []   //np. {type:'przenies',size:'10',x:4,y:6}
        this.legalActions = []
        if(unit.actions != undefined){
            this.actions = unit.actions.map(dict => copyDict(dict))
            this.legalActions = unit.legalActions.map(array => array.map(dict => copyDict(dict)))
        } else {
            if(this.ruchy > 0){
                var rucho = this.rucho.slice(0,this.ruchy)
                var ruchk = this.ruchk.slice(0,this.ruchy)
                this.actions.push({type:'move',by:'real',rucho:rucho,ruchk:ruchk,il:unit.il,from:[hex.x,hex.y],destination:leadPath(hex.x,hex.y,ruchk,rucho)})
            }
            if(this.celu != -1 && this.celd in unix){
                var aimedunit = unix[this.celd][this.celu]
                this.actions.push({type:'aim',by:'real',celu:this.celu,celd:this.celd,hex_x:aimedunit.x,hex_y:aimedunit.y,kolor:this.kolor})
            }
            if(this.rozb > 0){
                this.actions.push({type:'build',by:'real',size:this.rozb})
            }
            
        }
    }
}
function leadPath(x,y,ruchk,rucho,stopBefore){
    var he = heks[x][y]
    if(stopBefore == undefined)
        stopBefore = 0
    for(var i in ruchk){
        if(i >= ruchk.length-stopBefore)
            break
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                return undefined
        }
    }
    return [he.x,he.y]
}
function getLeadedPath(x,y,ruchk,rucho,stopBefore){
    var leadedPath = []
    
    var he = heks[x][y]
    if(stopBefore == undefined)
        stopBefore = 0
    for(var i in ruchk){
        if(i >= ruchk.length-stopBefore)
            break
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                return undefined
            leadedPath.push({x:he.x, y:he.y})
        }
    }
    return {x:x,y:y,path:leadedPath}
}
function pathIsThroughCrowdedCity(dm,x,y,ruchk,rucho,unitAttackStrength){
    var orhe = heks[x][y]
    var he = heks[x][y]
    for(var i=0;i<ruchk.length;i++){
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                break
            
            var str = he.x+'#'+he.y
            if(i > 0 && i < ruchk.length-1 && /*(he.dru != undefined && he.dru != kolej || he.d != undefined && he.d != kolej) && */(dm != undefined && str in dm.distmaps && dm.distmaps[str].hex.units.length == 4 || dm == undefined && heks[he.x][he.y].unp == 4)){
                return true
            }
            /*
            if(false && unitAttackStrength != undefined){
                if(i > 0 && i < ruchk.length-1 && (dm != undefined && str in dm.distmaps && dm.distmaps[str].hex.units.length > 0 || dm == undefined && heks[he.x][he.y].unp > 0) && heks[he.x][he.y].undr != orhe.undr && heks[he.x][he.y].undr != -1){
                    return true
                }
            }*/
        }
        if(he == undefined)
            break
    }
    
    return false
}
class BoardHex extends Copyable {
    constructor(x,y,oldheks){
        super(['z','hutn','prod','zpl','hutnpl','prodpl','kasy','stali','zmiana'])
        
        this.x = x
        this.y = y
        this.heks = heks[x][y]
        this.dru = this.heks.undr
        
        this.units = []
        if(oldheks != undefined){
            this.setFields(oldheks.getFields())
            for(var i = 0;i<oldheks.units.length;i++){
                var unit = oldheks.units[i]
                if(unit.x == -1)
                    continue
                this.units.push(new UnitAction(unit,oldheks))
            }
            //this.border = oldheks.border.slice().map(x=>x == null ? null : x.slice())
        } else {
            this.setFields(this.getFields(this.heks))
            for(var i = 0;i<this.heks.unp;i++){
                var unit = unix[this.heks.undr][this.heks.unt[i]]
                if(unit.x == -1)
                    continue
                this.units.push(new UnitAction(unit,this.heks))
            }
            //this.border = this.heks.border.map(x=>x == null ? null : [x.x,x.y])
        }
    }
}
function mapToModel(){
    var board = []
    for(var i = 0;i<scian;i++){
        board[i] = []
        for(var j = 0;j<scian;j++){
            board[i][j] = new BoardHex(i,j)
        }
    }
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            var hks = board[i][j].heks
            board[i][j].border = hks.border.map(a => a == null || a.x >= scian || a.y >= scian ? null : board[a.x][a.y])
        }
    }
    /*
    var units = {}
    
    for(var kolj = 0;kolj<12;kolj++){
        units[kolj] = {}
        var pal = 0
        while(pal<oddid[kolj]){
            if(!unix[kolj][pal].kosz)
                units[kolj][pal] = {unit:unix,actions:[]}
            pal++;
        }
    }*/
    return {board:board}
}
function copyModel(model){
    var board = model.board
    var newBoard = []
    for(var i = 0;i<scian;i++){
        newBoard[i] = []
        for(var j = 0;j<scian;j++){
            newBoard[i][j] = new BoardHex(i,j,board[i][j])
        }
    }
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            var hks = newBoard[i][j].heks
            newBoard[i][j].border = hks.border.map(a => a == null || a.x >= scian || a.y >= scian ? null : newBoard[a.x][a.y])
        }
    }
    return {board:newBoard}
}
function copyModelBoard(board){
    var newBoard = []
    for(var i = 0;i<scian;i++){
        newBoard[i] = []
        for(var j = 0;j<scian;j++){
            newBoard[i][j] = new BoardHex(i,j,board[i][j])
        }
    }
    return newBoard
}

function copyDistmaps(dm){
    var model = copyModel(dm.model)
    var distmaps = dm.distmaps
    var board = model.board
    var hexesWithUnits = []
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            if(board[i][j].units.length > 0 || board[i][j].z > 0){
                hexesWithUnits.push([i,j])
            }
        }
    }
    var newDistmaps = {}
    for(var i in hexesWithUnits){
        var coord = hexesWithUnits[i]
        var bhex = board[coord[0]][coord[1]]
        var code = coord[0]+'#'+coord[1]
        newDistmaps[code] = {maps:{}, hex:bhex, potentialtocome:[], realtocome:[], defence:[],alliegance:allTurns(),fromenemy:allMoves(),fromally:allMoves(),frontline:false}
        for(var szybt in distmaps[code].maps){
            //var unit = bhex.units[j]
            //var szybt = szyt[unit.rodz]
            //if(!(szybt in newDistmaps[code].maps)){
                newDistmaps[code].maps[szybt] = {hexmap:copyHexdistmap(distmaps[code].maps[szybt].hexmap,board), rangemap:copyHexrangemap(distmaps[code].maps[szybt].rangemap,board)}            
                for(var ks in newDistmaps[code].maps[szybt].hexmap){
                    
                    /*
                    if(newDistmaps[code].maps[szybt].hexmap[ks].water > 0){
                        alert('a')
                        console.log(newDistmaps[code].maps[szybt].hexmap[ks])
                    }*/
                }

                //console.log(newDistmaps[code].maps[szybt].hexmap.filter(x=>x.embarking > 0).length)
                //{hexmap:hexdistmap(bhex.x,bhex.y,szybt == 'w',szybt == 'g',szybt == 'l',szybt == 'c',board)}
            //}
        }
    }
    return {distmaps:newDistmaps,score:null,model:model}
}
function distmapsFromUnit(){
    var model = mapToModel()
    var board = model.board
    var hexesWithUnits = []
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            if(board[i][j].units.length > 0 || board[i][j].z > 0){
                hexesWithUnits.push([i,j])
            }
        }
    }
    var distmaps = {}
    for(var i in hexesWithUnits){
        var coord = hexesWithUnits[i]
        var bhex = board[coord[0]][coord[1]]
        var code = coord[0]+'#'+coord[1]
        distmaps[code] = {maps:{}, hex:bhex, potentialtocome:[], realtocome:[], defence:[],alliegance:allTurns(),fromenemy:allMoves(),fromally:allMoves(),frontline:false}
        for(var j in bhex.units){
            var unit = bhex.units[j]
            var szybt = szyt[unit.rodz]
            if(szybt == 'w' && zast[unit.rodz] == 'x')
                szybt == 'x'
            
            if(!(szybt in distmaps[code])){
                distmaps[code].maps[szybt] = {hexmap:hexdistmap(bhex.x,bhex.y,szybt == 'w' || szybt == 'x',szybt == 'g',szybt == 'l',szybt == 'c',szybt == 'x',board),rangemap:hexrangemap(bhex.x,bhex.y,szybt == 'w',szybt == 'g',szybt == 'l',szybt == 'c',board)}
            }
            
        }
        
        if(!('w' in distmaps[code].maps) && (heks[coord[0]][coord[1]].z == -1 || heks[coord[0]][coord[1]].z > 0)){
            distmaps[code].maps['w'] = {hexmap:hexdistmap(bhex.x,bhex.y,true,false,false,false,false,board),rangemap:hexrangemap(bhex.x,bhex.y,true,false,false,false,board)}
        }
        if(!('n' in distmaps[code].maps)){
            distmaps[code].maps['n'] = {hexmap:hexdistmap(bhex.x,bhex.y,false,false,false,false,false,board),rangemap:hexrangemap(bhex.x,bhex.y,false,false,false,false,board)}
        }/*
        if(distmaps[code].maps['c'] == undefined){
            distmaps[code].maps['c'] = {hexmap:hexdistmap(bhex.x,bhex.y,false,false,false,true,board),rangemap:hexrangemap(bhex.x,bhex.y,false,false,false,true,board)}
        }
        if(distmaps[code].maps['l'] == undefined){
            distmaps[code].maps['l'] = {hexmap:hexdistmap(bhex.x,bhex.y,false,false,true,false,board),rangemap:hexrangemap(bhex.x,bhex.y,false,false,true,false,board)}
        }
        if(distmaps[code].maps['g'] == undefined){
            distmaps[code].maps['g'] = {hexmap:hexdistmap(bhex.x,bhex.y,false,true,false,false,board),rangemap:hexrangemap(bhex.x,bhex.y,false,true,false,false,board)}
        }*/
    }
    return {distmaps:distmaps,score:null,model:model}
}
function simulateMove(model,move){
    
}
function calculatePathLength(szyt,path){
    
}
function allMoves(){
    var max = scian*scian
    return {"n":max,"c":max,"g":max,"w":max,"l":max}
}
function allColors(){
    var result = {}
    
    for(var i = 0;i<12;i++){
        result[i] = 0
    }
    return result
}
function evalUnitAttack(unit,actions,model){
    var il = unit.il
    if(actions != undefined && actions.length > 0 && actions[0].il != undefined)
        il = actions[0].il
        
    var terrainFactor = 1
    if(actions != undefined && actions.length > 0 && actions[0].type == 'move'){
        origHex = model.board[actions[0].from[0]][actions[0].from[1]]
        destHex = model.board[actions[0].destination[0]][actions[0].destination[1]]
        
        terrainFactor = ataz2(unit,{szyt:'n'},origHex,destHex,"a")
    }
    
    var fromFar = 1
    if(actions != undefined && actions[actions.length-1].type == 'aim' && (zast[unit.rodz] == 'n' || zast[unit.rodz] == 'l') && zas[unit.rodz] > 1){
        fromFar = 1.1
    }
    return fromFar * at[unit.rodz] * (0.5+obrr[unit.rodz]) * exponentiel(unit.il) * terrainFactor
}
function evalUnitDefense(unit,il){
    if(il == undefined)
        il = unit.il
    return at[unit.rodz] * (0.5+obrr[unit.rodz]) * exponentiel(il)
}
MAX_TURNS = 10
function allTurns(){
    var tr = []
    for(var i = 0;i<MAX_TURNS;i++){
        tr.push(-1)
    }
    return tr
}
function evaluate(dm,time,potentialMoves){
    var distmaps = dm.distmaps
    for(var key in distmaps){
        if(distmaps[key].potentialtocome == null || distmaps[key].potentialtocome.length == 0){
            distmaps[key].potentialtocome = []
            distmaps[key].realtocome = []
            distmaps[key].defence = []
            for(var t = 0;t<MAX_TURNS;t++){
                distmaps[key].potentialtocome.push(allColors())
                distmaps[key].realtocome.push(allColors())
                distmaps[key].defence.push(allColors())
            }
            distmaps[key].alliegance = allTurns()
            /*
            distmaps[key].fromenemy = allMoves()
            distmaps[key].fromally = allMoves()
            */
            distmaps[key].frontline = false
        } else {
            for(var t = 0;t<MAX_TURNS;t++){
                for(var i = 0;i<12;i++){

                    distmaps[key].potentialtocome[t][i] = 0
                    distmaps[key].realtocome[t][i] = 0
                    distmaps[key].defence[t][i] = 0
                }
                
                distmaps[key].alliegance[t] = -1
            }
            
            var max = scian*scian/*
            distmaps[key].fromenemy['n'] = max
            distmaps[key].fromally['n'] = max
            distmaps[key].fromenemy['c'] = max
            distmaps[key].fromally['c'] = max
            distmaps[key].fromenemy['g'] = max
            distmaps[key].fromally['g'] = max
            distmaps[key].fromenemy['w'] = max
            distmaps[key].fromally['w'] = max
            distmaps[key].fromenemy['l'] = max
            distmaps[key].fromally['l'] = max
            distmaps[key].frontline = false*/
            
        }
    }
    for(var key in distmaps){
        var distmap = distmaps[key]
        
        var hex = distmap.hex
        var peoplePotential = hex.z / ced[0]    //produkcja piechoty
        var productionPotential = Math.min(hex.z / ced[1], Math.min(hex.prod / ces[1], hex.hutn / ces[1]))    //produkcja czougów
        
        var firepower = 0
        for(var i in distmap.hex.units){
            var unit = distmap.hex.units[i]
            
            if(unit.szyt == szyt[unit.rodz] && zas[unit.rodz] > 1){
                firepower += at[unit.rodz] * unit.il * (zas[unit.rodz]-1)/2
            }
        }
        var maxdef = Math.max(peoplePotential, productionPotential * 4)// + firepower
        
        for(var t = 0;t<MAX_TURNS;t++){
            for(var i in distmap.hex.units){
                var unit = distmap.hex.units[i]
                var unitAttackStrength = evalUnitAttack(unit,undefined,dm.model)
                var unitDefenseStrength = evalUnitDefense(unit)
                
                distmap.defence[t][unit.d] -= -maxdef * t
                
                if(unit.actions.length > 0){
                    for(var j in unit.actions){
                        var action = unit.actions[j]
                        if(action.type == 'move' && action.destination != undefined/* && j == unit.actions.length - 1*/){
                            var code = action.destination[0]+'#'+action.destination[1]
                            var dist = action.rucho.reduce((a,b)=>a+b,0)
                            var unitAttackStrength = evalUnitAttack(unit, [action], dm.model)
                            var path = getLeadedPath(distmap.hex.x,distmap.hex.y,action.ruchk,action.rucho)
                            var losses = 0
                            
                            if(action.il < unit.il){
                                distmap.realtocome[t][unit.d] -= -Number(evalUnitDefense(unit,unit.il - action.il))
                            }
                            
                            var unitAttackStrength2 = evalUnitAttack(unit, [action], dm.model)
                            
                            for(var k=0;k<path.path.length-1;k++){
                                
                                var field = path.path[k]
                                var code2 = field.x+'#'+field.y
                                
                                var turn = Math.ceil((k - (zas[unit.rodz] <= 1 ? 0 : zas[unit.rodz])) / szy[unit.rodz])
                                if(code2 in distmaps && distmaps[code2].hex.units.length > 0/* && distmaps[code2].hex.units[0].d != unit.d)*/){
                                    if(distmaps[code2].alliegance[MAX_TURNS-1] != unit.d){
                                        for(var l in distmaps[code2].hex.units){
                                            var unit2 = distmaps[code2].hex.units[l]
                                            var evaldefense = evalUnitDefense(unit2)
                                            //for(var l in distmaps[code2].realtocome){
                                                if(t >= turn){
                                                    distmaps[code2].realtocome[t][unit2.d] -= unitAttackStrength2
                                                    if(distmaps[code2].realtocome[t][unit2.d] < 0)
                                                        distmaps[code2].realtocome[t][unit2.d] = 0
                                                }
                                            //}
                                            unitAttackStrength2 -= evaldefense
                                            if(unitAttackStrength2 < 0)
                                                unitAttackStrength2 = 0
                                                
                                            if(unitAttackStrength2 <= 0)
                                                break
                                        }
                                    } else if(distmaps[code2].hex.units.length == 4 && distmaps[code2].alliegance[MAX_TURNS-1] == unit.d){
                                        unitAttackStrength2 = 0
                                        break
                                    }
                                }
                                if(unitAttackStrength2 <= 0)
                                    break
                            }
                            //if(!pathIsThroughCrowdedCity(dm,distmap.hex.x,distmap.hex.y,action.ruchk,action.rucho,unitAttackStrength))
                            if(code in distmaps && szy[unit.rodz] * t + (zas[unit.rodz] <= 1 ? 0 : zas[unit.rodz]) >= dist){
                                //console.log(szy[unit.rodz] * t + zas[unit.rodz], dist, unitAttackStrength)
                                
                                distmaps[code].realtocome[t][unit.d] -= -Number(unitAttackStrength2)
                            }
                        }
                        if(action.type == 'aim'){
                            var code = unix[action.celd][action.celu].x + '#' + unix[action.celd][action.celu].y//action.hex_x + '#'+ action.hex_y
                            distmaps[code].realtocome[t][unit.d] -= -Number(unitAttackStrength)
                        }
                        if(action.type == 'stay' || action.type == 'build' || action.type == 'aim' && unit.actions[0].type != 'move'){
                            distmap.realtocome[t][unit.d] -= -Number(unitDefenseStrength)
                        }
                    }

                } else {
                    distmap.realtocome[t][unit.d] -= -Number(unitDefenseStrength)
                }
            }
        }

        for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap

            //var hexesToCheck = map_of_movement_type.filter(x => x.hex.z > 0 || x.hex.units.length > 0)
            /*
            var unitDistDict = {}
            for(var i in map_of_movement_type){
                var elem = map_of_movement_type[i]
                unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
            }*/
            for(var j in distmap.hex.units){
                var unit = distmap.hex.units[j]
                
                if(szyt[unit.rodz] != movement_type/* || unit.actions.length > 0*/)
                    continue
                
                /*
                var hexesCheckedInTurn = {}
                
                for(var t = 0;t<MAX_TURNS;t++){
                    hexesCheckedInTurn[t] = 0
                }
                for(var i in hexesToCheck){
                    var hex = hexesToCheck[i]
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    if(hexkey in distmaps && distmaps[hexkey].units.length > 0 || hex.hex.z > 0){
                        
                        for(var t = 0;t<MAX_TURNS;t++){
                            if(szy[unit.rodz] * t + zas[unit.rodz]-1 >= hex.dist){
                                hexesCheckedInTurn[t]+=distmaps[hexkey].units.length > 0 ? 1 : 0.1
                            }
                        }
                    }
                    
                }*/
                //console.log(hexesCheckedInTurn)
                for(var i in map_of_movement_type){
                    var hex = map_of_movement_type[i]
                    if(hex.hex.z > 0 || hex.hex.units.length > 0){
                        var hexkey = hex.hex.x + '#' + hex.hex.y
                        
                        var unitAttackStrength = evalUnitAttack(unit,null,dm.model)
                        
                        var potential = 0
                        for(var t = 0;t<MAX_TURNS;t++){
                            if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 ? 0 : zas[unit.rodz]) >= hex.dist){
                                if(potentialMoves && unit.actions.length == 0)
                                    distmaps[hexkey].potentialtocome[t][unit.d] -= (-Number(unitAttackStrength) - potential * maxdef) // hexesCheckedInTurn[t]
                                //console.log(hex.hex.dru, unit.d, hexkey in distmaps, distmaps[hexkey].fromenemy)
                                /*
                                if(hex.hex.dru != unit.d && hex.hex.dru != -1 && hexkey in distmaps && distmaps[hexkey].fromenemy[movement_type] > t)
                                    distmaps[hexkey].fromenemy[movement_type] = t
                                if(hex.dist > 0 && hex.hex.dru == unit.d && hexkey in distmaps && distmaps[hexkey].fromally[movement_type] > t)
                                    distmaps[hexkey].fromally[movement_type] = t
                                */
                                potential++
                            }
                        }
                    }
                }
                /*
                var path = [hex]
                
                var j = 0
                while(hex.from != null && j<1000){
                    hex = unitDistDict[hex.from.x+'#'+hex.from.y]
                    path.push(hex)
                    j++
                }
                path = path.reverse()
                */
                
            }
        }
    }
    if(time == undefined)
        time = 1
        
    if(dm.score == undefined || dm.score[0] == undefined){
        dm.score = {}
        for(var t = 0;t<MAX_TURNS;t++){
            dm.score[t] = allColors()
        }
    } else {
        for(var t = 0;t<MAX_TURNS;t++){
            for(var i = 0;i<12;i++){
                dm.score[t][i] = 0
            }
        }
    }
        
    for(var t = 0;t<MAX_TURNS;t++){
        for(var key in distmaps){
            var distmap = distmaps[key]
            
            var biggestpower = 0
            var biggestpowercolor = -1
            var secondbiggestpower = 0
            var secondbiggestpowercolor = -1
            var powers = {}
            for(var d = 0;d<12;d++){
                //if(distmap.realtocome[t][d] > 0)
                //    console.log(distmap.hex.x,distmap.hex.y,d,distmap.potentialtocome[t][d], distmap.realtocome[t][d], distmap.defence[t][d])
                powers[d] = distmappower(distmap,t,d)
                if(powers[d] >= biggestpower){
                    secondbiggestpower = biggestpower
                    secondbiggestpowercolor = biggestpowercolor
                    biggestpower = powers[d]
                    biggestpowercolor = d   
                }
            }
            /*
            var fromenemy = Math.min(Math.min(distmap.fromenemy['w'],distmap.fromenemy['n']),Math.min(distmap.fromenemy['c'],distmap.fromenemy['g']))
            var fromally = Math.min(Math.min(distmap.fromally['w'],distmap.fromally['n']),Math.min(distmap.fromally['c'],distmap.fromally['g']))
            var frontline = fromenemy <= 1 || fromally >= fromenemy
            distmap.frontline = frontline/*
            //heks[distmap.hex.x][distmap.hex.y].test = frontline ? 'X' : ''//

            /*if(t == time){
                if(biggestpower > secondbiggestpower){
                    heks[distmap.hex.x][distmap.hex.y].testColor = kolox(biggestpowercolor,0)
                    heks[distmap.hex.x][distmap.hex.y].test = Math.round(biggestpower - secondbiggestpower,2).toFixed(2)
                } else {
                    heks[distmap.hex.x][distmap.hex.y].testColor = '#fff'
                    heks[distmap.hex.x][distmap.hex.y].test = 0
                }
            }*/
            distmap.alliegance[t] = biggestpowercolor
            //if(distmap.hex.undr > -1){
            //    score[distmap.hex.undr] += evaluateDefenseStreng()
            //}
            if(biggestpowercolor > -1){
                //var factor = distmap.frontline ? 1 : 1
                dm.score[t][biggestpowercolor] += distmap.hex.z + (distmap.hex.stali + Math.min(distmap.hex.prod,distmap.hex.stali)) * 2// * factor
            }
            
            //heks[area.x][area.y].test = level+'#'+(maxeval * 2 - allAreaValues)
            //heks[area.x][area.y].testColor = evalcolor

        }
    }
    
    //dm.score = score
    //console.log(distmaps)
}
function distmappower(distmap,t,d){
    return Number(distmap.potentialtocome[t][d]) + Number(distmap.realtocome[t][d]) + Number(distmap.defence[t][d])
}

function exponentiel(number){
    return Math.pow(number,1.2)
}

function getRuch(map_of_movement_type,hex){
    var hToCheck = map_of_movement_type.filter(h => h.hex.x == hex.hex.x && h.hex.y == hex.hex.y)[0]
    var ruchk = []
        
    var i = scian*10
    while(hToCheck.from != null){
        var hfrom = hToCheck.from
        //heks[hfrom.x][hfrom.y].test = 'X'
        
        var goodkier = -1
        for(var k = 0;k<6;k++){
            if(hfrom.border[k] != undefined && hfrom.border[k].x == hToCheck.hex.x && hfrom.border[k].y == hToCheck.hex.y){
                
                goodkier = k
                break
            }
        }
        ruchk.push(goodkier)
        var hToCheck = map_of_movement_type.filter(h => h.hex.x == hfrom.x && h.hex.y == hfrom.y)[0]
        i--
        if(i<0){
            break
        }
    }
    ruchk = ruchk.reverse()
    rucho = ruchk.map(a => 1)
    //console.log([ruchk,rucho])
    return {ruchk:ruchk,rucho:rucho}
}

function simpledistmaps(dm){
    var map = {}
    
    var distmaps = dm.distmaps
    for(var key in distmaps){
        
        var distmap = distmaps[key]
        
        map[key] = {}
        
        for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap

            var hexesToCheck = map_of_movement_type.filter(x => x.hex.z > 0 || x.hex.units.length > 0)
                        
            for(var i in hexesToCheck){
                var hex = hexesToCheck[i]
                var hexkey = hex.hex.x + '#' + hex.hex.y
                
                //if(hex.hex.units.length == 0 && hex.hex.z <= 0)
                //    continue
                
                if(hexkey != key && hexkey in distmaps && (!(hexkey in map[key]) || map[key][hexkey] > hex.dist)){
                    map[key][hexkey] = hex.dist
                }
            }
        }
    }
    for(var i in map){
        for(var j in map[i]){
            for(var k in map){
                if(k in map && k in map[i] && j in map[k] && map[i][j]-2 > (map[i][k] + map[k][j]) * 0.8 && !(dm.distmaps[i].hex.units.length > 0 && dm.distmaps[k].hex.units.length > 0 && dm.distmaps[i].hex.units[0].dru == dm.distmaps[k].hex.units[0].dru)){
                    //console.log('tró')
                    delete map[i][j]
                    delete map[j][i]
                    break
                }
            }
        }
    }
    return map
}
function legalActions(dm,simplifieddistmaps){
    var distmaps = dm.distmaps
    for(var key in distmaps){
        var distmap = distmaps[key]
        //if(distmap.hex.z <= 0 && distmap.hex.units.map(x=>evalUnitAttack(x)).reduce((a,b) => a+b,0) < 20)
        //    continue
       
       for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap

            var hexesToCheck = map_of_movement_type.filter(x => x.hex.z > 0 || x.hex.units.length > 0)
            
            var range_map_of_movement_type = distmap.maps[movement_type].rangemap

            var range_hexesToCheck = range_map_of_movement_type.filter(x => x.hex.units.length > 0)

            /*
            var unitDistDict = {}
            for(var i in map_of_movement_type){
                var elem = map_of_movement_type[i]
                unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
            }*/
            for(var j in distmap.hex.units){
                var unit = distmap.hex.units[j]
                
                unit.legalActions = []
            }
       }
    }
    for(var key in distmaps){
        var distmap = distmaps[key]
        //if(distmap.hex.z <= 0 && distmap.hex.units.map(x=>evalUnitAttack(x)).reduce((a,b) => a+b,0) < 20)
        //    continue
       
       for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap

            var hexesToCheck = map_of_movement_type.filter(x => x.hex.z > 0 || x.hex.units.length > 0)
            
            var range_map_of_movement_type = distmap.maps[movement_type].rangemap

            var range_hexesToCheck = range_map_of_movement_type.filter(x => x.hex.units.length > 0)

            /*
            var unitDistDict = {}
            for(var i in map_of_movement_type){
                var elem = map_of_movement_type[i]
                unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
            }*/
            for(var j in distmap.hex.units){
                var unit = distmap.hex.units[j]
                
                if(szyt[unit.rodz] != movement_type/* || unit.actions.length > 0*/)
                    continue
                    
                for(var i in hexesToCheck){
                    var hex = hexesToCheck[i]
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    /*==
                    if(!(key in simplifieddistmaps && hexkey in simplifieddistmaps[key]))
                        continue
                    */
                    if(hex.hex.units.length == 0 && hex.hex.z <= 0)
                        continue
                    
                    //if(!distmaps[hexkey].frontline)
                    //    continue
                    
                    var potential = 0
                    //for(var t = 0;t<MAX_TURNS;t++){
                        //if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
                            //if(hexkey in distmaps && ( distmaps[hexkey].frontline || distmaps[hexkey].units.length == 0 ||  )){
                                //unit.legalActions.push({type:'move',rucho:rucho,ruchk:ruchk,destination:leadPath(hex.x,hex.y,ruchk,rucho)})
                                    
                    if(zast[unit.rodz] == 'x')
                        continue
                        
                    var result = getRuch(map_of_movement_type,hex)
                    
                    var ruchk = result.ruchk
                    var rucho = result.rucho
                    //console.log([hex.hex.x,hex.hex.y,ruchk,rucho])
                    
                    //if(movement_type != 'w' && movement_type != 'l' && hex.water > 0 && (unit.d != undefined && (unit.d == -1 || unit.d != kolej) || unit.dru != undefined && (unit.dru == -1 || unit.dru != kolej)))
                    //    continue
                    
                    if(!pathIsThroughCrowdedCity(dm,distmap.hex.x,distmap.hex.y,ruchk,rucho)){
                        unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il,from:[distmap.hex.x,distmap.hex.y],destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                        if(unit.il > 10 && distmap.hex.units.length <= 3)
                            unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il-10,from:[distmap.hex.x,distmap.hex.y],destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                        //if(unit.il > 20 && distmap.hex.units.length <= 2 && distmap.frontline)
                        //    unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:Math.floor(unit.il/2),from:[distmap.hex.x,distmap.hex.y],destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                        
                        if(hex.hex.units.length > 0/* && distmap.frontline*/){
                            if(hex.hex.units.length > 0){
                                var aimedunit = hex.hex.units[hex.hex.units.length-1]
                                //tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"
                                if(aimedunit != null && aimedunit.d != unit.d && miaruj(unit,aimedunit,hex.hex)){
                                    rucho2 = rucho.slice(0,rucho.length - zas[unit.rodz] - 1)
                                    ruchk2 = ruchk.slice(0,ruchk.length - zas[unit.rodz] - 1)
                                    
                                    var lp = leadPath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)
                                    var ds = distance(lp[0],lp[1],hex.hex.x,hex.hex.y)
                                    if(ds != undefined && ds <= zas[unit.rodz]){
                                        unit.legalActions.push([
                                            {type:'move',by:'speculation',rucho:rucho2,ruchk:ruchk2,il:unit.il,from:[distmap.hex.x,distmap.hex.y],destination:[hex.hex.x,hex.hex.y]},  //not a real situation, but it solves some problem
                                            {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,destination:[hex.hex.x,hex.hex.y]},
                                        ])
                                        if(unit.il > 10 && distmap.hex.units.length <= 3)
                                            unit.legalActions.push([
                                                {type:'move',by:'speculation',rucho:rucho2,ruchk:ruchk2,il:unit.il-10,from:[distmap.hex.x,distmap.hex.y],destination:[hex.hex.x,hex.hex.y]},
                                                {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il-10,destination:[hex.hex.x,hex.hex.y]},
                                            ])
                                    }

                                }
                                //this.actions.push({type:'aim',celu:this.celu,celd:this.celd,hex_x:aimedunit.x,hex_y:aimedunit.y,kolor:this.kolor})

                            }
                        }
                    }
                                /*
                                if(potentialMoves && unit.actions.length == 0)
                                    distmaps[hexkey].potentialtocome[t][unit.d] -= (-Number(unitAttackStrength) - potential * maxdef) // hexesCheckedInTurn[t]
                                //console.log(hex.hex.dru, unit.d, hexkey in distmaps, distmaps[hexkey].fromenemy)
                                if(hex.hex.dru != unit.d && hexkey in distmaps && distmaps[hexkey].fromenemy[movement_type] > t)
                                    distmaps[hexkey].fromenemy[movement_type] = t
                                potential++*/
                            //}
                        //}
                    //}
                }
                
                                //console.log(unit.legalActions)
                if(zas[unit.rodz]>1)
                    for(var i in range_hexesToCheck){
                        var hex = range_hexesToCheck[i]
                        var hexkey = hex.hex.x + '#' + hex.hex.y
                        
                        if(hex.hex.units.length == 0)
                            continue
                        if(hex.hex.units.length > 0){
                            var aimedunit = hex.hex.units[hex.hex.units.length-1]
                            
                            var ds = distance(hex.hex.x,hex.hex.y,distmap.hex.x,distmap.hex.y)

                            //tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"
                            if(aimedunit != null && aimedunit.d != unit.d && miaruj(unit,aimedunit,hex.hex) && ds != undefined && ds <= zas[unit.rodz]){
                                unit.legalActions.push([
                                    {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,from:[distmap.hex.x,distmap.hex.y],destination:[hex.hex.x,hex.hex.y]},
                                ])

                            }
                                    //this.actions.push({type:'aim',celu:this.celu,celd:this.celd,hex_x:aimedunit.x,hex_y:aimedunit.y,kolor:this.kolor})

                        }
                    }
                
            }
            
        }
    }
}

function removeAttack(dm, x, y, color){
    var distmaps = dm.distmaps
    
    //var interestingUnits = {'c':[],'n':[],'l':[],'g':[],'w':[]}
    var interestingUnits = []
    for(var key in distmaps){
        var distmap = distmaps[key]
        if(distmap.frontline)
            continue
        
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            if(unit.actions.length > 0){
                var action = unit.actions[0]
                if(unit.actions.length == 1 && action.type == 'move' && action.destination[0] == x && action.destination[1] == y){
                    unit.actions.splice(0,unit.actions.length)
                }
            }
        }
    }
    
    evaluate(dm)
}
function tryMakeDestinationMap(dm,color){
    var distmaps = dm.distmaps

    
    destinationmap = {}
    bestAction = {}
    
    for(var code1 in distmaps){
        var distmap = distmaps[code1]
        //if(!distmap.frontline)
        //    continue
        
        //unit,
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            if(unit.d != color || unit.rozb > 20 && unit.il < 20 && (unit.legalActions.length == 0 || unit.legalActions[0].type == 'move' && heks[unit.legalActions[0].destination[0]][unit.legalActions[0].destination[0]].undr != -1)/* || unit.actions.filter(x => x.type == 'move').length > 0 && !distmap.frontline || unit.actions.filter(x => x.type == 'move' && x.by == 'speculation').length > 0*/)
                continue
                
            var susactions = false
            for(var i in unit.actions){
                if(unit.actions[i].type == 'move' && unit.actions[i].by == 'speculation'){
                    //susactions = true
                    break
                }
            }
            if(susactions)
                continue
            
            //if(hasunits && (zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm'))
            //    continue
                /*
            if(unit.actions.length > 0 && unit.actions[0].type == 'move' && distmap.hex.units[0] == unit && unit.actions[0].il > unit.il-10)
                continue*/
                
            var unitcode = code1+'#'+j
            
            //console.log(unit.legalActions.length)
            var bestAction = {}
            var lac = unit.legalActions

            for(var i in lac){
                var legalAction = lac[i].filter(x => x.type != 'build')

                if(legalAction.length >= 1 && (legalAction[0].type == 'move' || legalAction[0].type == 'aim') && legalAction[0].destination != undefined){
                    
                    var dest_code = legalAction[0].destination[0] + '#' + legalAction[0].destination[1]

                    var properAction = legalAction[0]
                    
                    
                    if(distmap.hex.z > 0 && properAction.il > unit.il-10 && (j == distmap.hex.units.length-1 || distmap.hex.units.length == 1)){
                        continue
                    }
                    if(distmap.hex.z > 0 && properAction.il < unit.il && distmap.hex.units.length == 4){
                        continue
                    }
                    if(distmap.hex.z <= 0 && properAction.il < unit.il-10){
                        continue
                    }
                    if(distmap.alliegance[0] != -1 && distmap.hex.z <= 0 && unit.il <= 10){
                        continue
                    }
                    //if(properAction.il < 60 && properAction.)
                    
                    //if(legalAction[0].type == 'aim'){
                    //    console.log(legalAction[0].destination,[x,y])
                    //    console.log(evalUnitAttack(unit,legalAction), evalUnitAttack(unit,bestAction))
                    //}
                    if(bestAction[dest_code] == null || evalUnitAttack(unit,legalAction,dm.model) > evalUnitAttack(unit,bestAction[dest_code],dm.model) || legalAction.length == 1 && bestAction[dest_code].length == 1 && legalAction[0].type == 'aim' && bestAction[dest_code][0].type == 'move' || legalAction.length > 1 && bestAction[dest_code].length == 1 && legalAction[0].type == 'aim' && bestAction[dest_code][0].type == 'move'){
                        //if(legalAction.length >= 2)
                        //    console.log('c'+(evalUnitAttack(unit,legalAction) + ',' + evalUnitAttack(unit,bestAction)))
                        
                        bestAction[dest_code] = legalAction
                    }
                }
            }
            for(var dest_code in bestAction){
                if(bestAction[dest_code] != null && bestAction[dest_code].length >= 1){
                    //console.log(unit.il)
                    //interestingUnits.push({unit:unit, action:bestAction, hex:distmap.hex})
                    if(!(dest_code in destinationmap))
                        destinationmap[dest_code] = []
                        
                    destinationmap[dest_code].push({unit:unit, action:bestAction[dest_code], hex:distmap.hex})
                }
            }
        }
    }
    
}
function tryPutUnderAttack(dm, x, y, color, thinkmore){
    var distmaps = dm.distmaps
    
    var code = x+'#'+y
    var hexUnderAttack = distmaps[code].hex
    var hasunits = hexUnderAttack.units.length > 0
    //var interestingUnits = {'c':[],'n':[],'l':[],'g':[],'w':[]}
//     var interestingUnits = []
//     for(var key in distmaps){
//         var distmap = distmaps[key]
//         //if(!distmap.frontline)
//         //    continue
//         console.log(key)
//         
//         //unit,
//         for(var j in distmap.hex.units){
//             var unit = distmap.hex.units[j]
//             if(unit.d != color || unit.rozb > 20 && unit.il < 20 && (unit.legalActions.length == 0 || unit.legalActions[0].type == 'move' && heks[unit.legalActions[0].destination[0]][unit.legalActions[0].destination[0]].undr != -1)/* || unit.actions.filter(x => x.type == 'move').length > 0 && !distmap.frontline || unit.actions.filter(x => x.type == 'move' && x.by == 'speculation').length > 0*/)
//                 continue
//                 
//             var susactions = false
//             for(var i in unit.actions){
//                 if(unit.actions[i].type == 'move' && unit.actions[i].by == 'speculation'){
//                     //susactions = true
//                     break
//                 }
//             }
//             if(susactions)
//                 continue
//             
//             if(hasunits && (zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm'))
//                 continue
//                 /*
//             if(unit.actions.length > 0 && unit.actions[0].type == 'move' && distmap.hex.units[0] == unit && unit.actions[0].il > unit.il-10)
//                 continue*/
//                 
//             
//             //console.log(unit.legalActions.length)
//             var bestAction = null
//             var populateAction = null
//             var lac = unit.legalActions
// 
//             for(var i in lac){
//                 var legalAction = lac[i].filter(x => x.type != 'build')
// 
//                 if(legalAction.length >= 1 && (legalAction[0].type == 'move' || legalAction[0].type == 'aim') && legalAction[0].destination != undefined && legalAction[0].destination[0] == x && legalAction[0].destination[1] == y){
//                     var properAction = legalAction[0]
//                     
//                     
//                     if(distmap.hex.z > 0 && properAction.il > unit.il-10 && (j == distmap.hex.units.length-1 || distmap.hex.units.length == 1)){
//                         continue
//                     }
//                     if(distmap.hex.z > 0 && properAction.il < unit.il-10 && distmap.hex.units.length == 4){
//                         continue
//                     }
//                     if(distmap.hex.z <= 0 && properAction.il < unit.il-10){
//                         continue
//                     }
//                     if(distmap.alliegance[0] != -1 && distmap.hex.z <= 0 && unit.il <= 10){
//                         continue
//                     }
//                     
//                     //if(legalAction[0].type == 'aim'){
//                     //    console.log(legalAction[0].destination,[x,y])
//                     //    console.log(evalUnitAttack(unit,legalAction), evalUnitAttack(unit,bestAction))
//                     //}
//                     if(bestAction == null || evalUnitAttack(unit,legalAction) > evalUnitAttack(unit,bestAction) || legalAction.length == 1 && bestAction.length == 1 && legalAction[0].type == 'aim' && bestAction[0].type == 'move' || legalAction.length > 1 && bestAction.length == 1 && legalAction[0].type == 'aim' && bestAction[0].type == 'move'){
//                         //if(legalAction.length >= 2)
//                         //    console.log('c'+(evalUnitAttack(unit,legalAction) + ',' + evalUnitAttack(unit,bestAction)))
//                         
//                         bestAction = legalAction
//                     }
//                 }
//             }
//             if(bestAction != null && bestAction.length >= 1){
//                 //console.log(unit.il)
//                 interestingUnits.push({unit:unit, action:bestAction, hex:distmap.hex})
//             }
//         }
//     }

    var interestingUnits = destinationmap[code] ? destinationmap[code].slice() : []
    
    //console.log(interestingUnits.map(a => 1/Math.pow(2,a.action[0].rucho ? a.action[0].rucho.length : 0)*(a.action[0].il)))
    interestingUnits.sort((a,b) => (-1/Math.pow(a.action[0].rucho ? a.action[0].rucho.length : 0,2)*(a.action[0].il) + 
                                     1/Math.pow(b.action[0].rucho ? b.action[0].rucho.length : 0,2)*(b.action[0].il)))
    //interestingUnits.sort((a,b) => (a.action.il - b.action.il))

    //interestingUnits1 = interestingUnits.filter(x=>x.action.length == 0 || x.action[0].by == 'real')
    //interestingUnits2 = interestingUnits.filter(x=>x.action.length > 0 && x.action[0].by != 'real')
    //interestingUnits.sort((a,b) => (a.hex.dist - b.hex.dist))
    
    //interestingUnits = interestingUnits1.concat(interestingUnits2)
    
    evaluate(dm)
    var postęp = 0
    var valuesByTime = dm.distmaps[code].alliegance
    for(var t in valuesByTime){
        valuesByTime[t] = valuesByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0 
    }
    var value = valuesByTime.reduce((a,b) => a+b, 0)
    
    var oldActionArrayUnits = []
    var oldActionArrayActions = []
    var value2
    var fails = 0
    for(var i in interestingUnits){
        var unitaction = interestingUnits[i]
        
        oldActionArrayUnits.push(unitaction.unit)
        oldActionArrayActions.push(unitaction.unit.actions)
    }
    for(var i in interestingUnits){
        var unitaction = interestingUnits[i]
        
        if(!(unitaction.unit.actions.length == 0 || unitaction.unit.actions[0].by == 'real'))
            continue
            
        var oldaction = unitaction.unit.actions
        
        unitaction.unit.actions = unitaction.action
        evaluate(dm)
        var values2ByTime = dm.distmaps[x+'#'+y].alliegance

        for(var t in values2ByTime){
            values2ByTime[t] = valuesByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0
        }
        value2 = values2ByTime.reduce((a,b) => a+b, 0)

        //console.log('a',value2,value)
        if(value2 > value)
            break
            
        if(value2 < value){
            unitaction.unit.actions = oldaction
            /*
            fails++
            if(fails > 5){
                break
            }*/
            break
        }
    }
    if(value2 == undefined || value2 <= value){
        for(var i in oldActionArrayUnits){
            oldActionArrayUnits[i].actions = oldActionArrayActions[i]
        }
        return []
    }
        
    return interestingUnits
    
}

/*
 * 
 * 
    unit.legalActions.push([
        {type:'move',by:'speculation',rucho:rucho2,ruchk:ruchk2,il:unit.il,destination:[hex.hex.x,hex.hex.y]},  //not a real situation, but it solves some problem
        {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,destination:[hex.hex.x,hex.hex.y]},
    ])
 */

function renameBy(action,newBy){
    var newAction = []
    for(var i in action){
        var particularMove = action[i]
        var newMove = {}
        
        for(var key in particularMove){
            var val = particularMove[key]
            if(key == 'by'){
                newMove[key] = newBy
            } else {
                newMove[key] = val
            }
        }
        newAction.push(newMove)
    }
    return newAction
}
function actionsToReal(dm,color,completely_used_passages){
    if(color == kolej){
        var distmaps = dm.distmaps
        
        for(var key in distmaps){
            var distmap = distmaps[key]
            //if(!distmap.frontline)
            //    continue
            
            var tratwa = 0
            
            for(var j in distmap.hex.units){
                var unit = distmap.hex.units[j]
                if(unit.d != color)
                    continue
                    
                if(unit.rodz == 8)
                    tratwa -= unit.il + unit.rozb
                if(unit.actions.length == 1 && unit.actions[0].type == 'move'){
                    var properAction = unit.actions[0]
                    
                    var unid = unit.id
                    if(properAction.il < unit.il){
                        unid = divideUnit(unid,unit.il - properAction.il,false)
                        if(unid == -1)
                            continue
                    }
                    var dodajTratwe = putPath(unid,properAction.destination[0],properAction.destination[1],undefined,completely_used_passages)
                    if(dodajTratwe && unit.szyt != 'w' && unit.szyt != 'l')
                        tratwa += properAction.il

                } else if(unit.actions.length == 1 && unit.actions[0].type == 'aim'){
                    var action2 = unit.actions[0]
                    
                    var unid = unit.id
                    if(action2.il < unit.il){
                        unid = divideUnit(unid,unit.il - action2.il,false)
                        if(unid == -1)
                            continue
                    }
                    var stopBefore = 1
                    if((zast[unit.rodz] == 'n' || zast[unit.rodz] == 'p' || zast[unit.rodz] == 'l'))
                        stopBefore = zas[unit.rodz]
                        
                    //{type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,destination:[distmap.hex.x,distmap.hex.y]},

                    zaznu = unid
                    tx = distmap.hex.x
                    ty = distmap.hex.y
                    celuj(distmap.hex.x,distmap.hex.y,action2.celd,action2.celu,false);

                    if(zaznu!=-1){
                        heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana++;
                        unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
                        unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
                        tx = unix[kolej][zaznu].x;
                        ty = unix[kolej][zaznu].y;
                        odzaznaj(false);
                        zaznu = -1
                    }


                } else if(unit.actions.length == 2 && unit.actions[0].type == 'move' && unit.actions[1].type == 'aim'){
                    var action1 = unit.actions[0]
                    var action2 = unit.actions[1]
                    
                    var unid = unit.id
                    if(action1.il < unit.il){
                        unid = divideUnit(unid,unit.il - action1.il,false)
                        if(unid == -1)
                            continue
                    }
                    var stopBefore = 1
                    if((zast[unit.rodz] == 'n' || zast[unit.rodz] == 'p' || zast[unit.rodz] == 'l') && zas[unit.rodz] > 1)
                        stopBefore = zas[unit.rodz]
                        
                    var dodajTratwe = putPath(unid,action1.destination[0],action1.destination[1],stopBefore,completely_used_passages)
                    if(dodajTratwe && unit.szyt != 'w' && unit.szyt != 'l')
                        tratwa += action1.il
                        
                    //{type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,destination:[distmap.hex.x,distmap.hex.y]},

                    zaznu = unid
                    var cords = leadPath(distmap.hex.x,distmap.hex.y,action1.ruchk,action1.rucho,stopBefore)
                    tx = cords[0]
                    ty = cords[1]
                    
                    celuj(cords[0],cords[1],action2.celd,action2.celu,false);

                    if(zaznu!=-1){
                        heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana++;
                        unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
                        unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
                        tx = cords[0]
                        ty = cords[1]
                        odzaznaj(false);
                        zaznu = -1
                    }
                }
                if(unit.actions.length == 0){
                    putPath(unit.id,unit.x,unit.y)
                }
                zaznu = -1;
                zaznx = -1;zazny = -1;
                tx = -1
                ty = -1
                changeState(2)
            }
            if(tratwa > 0){
                dodai(distmap.hex.x,distmap.hex.y,0,8,Math.min(Math.floor(tratwa),99))
            }
        }
        
    }
}
/*
actionsDistance(actions){
    var ax = 0
    for(var t = 0;t<MAX_TURNS;t++){
        if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
            
        }
    }
}*/







