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

function extractActions(map){
    
}

function evalAlliegance(dmap,obj,t){
    if(t == undefined)
        t = MAX_TURNS-1
    var code = obj.hex.heks.x + '#' + obj.hex.heks.y
    var undr = obj.hex.heks.undr != undefined ? obj.hex.heks.undr : obj.hex.heks.dru
    if(code in dmap.distmaps){
        var alliegance = dmap.distmaps[code].alliegance[MAX_TURNS-1]
        
        return alliegance
    }
    return undr
}
function mapmap(map,subfield){
    var result = {}
    for(var i in map){
        if(subfield != undefined){
            result[map[i][subfield].x+'#'+map[i][subfield].y] = map[i]
        } else {
            result[map[i].x+'#'+map[i].y] = map[i]
        }
    }
    return result
}
laststan = -1
function aimachine(ailevel){
    podswu = -1
    podswd = -1
    if(laststan != aistan){
        laststan = aistan
    }
    console.log('aistan:',aistan)
	switch(aistan){
		case 0:
			var endedgame = liczeb.filter(x=>x>0).length <= 1
			if(endedgame)
                return
            var exists = false
			params = loadStats();
			mist = [];
			mistdefval = [];
			mista = 0;
			for(var a = 0;a<scian;a++){
				mistdefval[a] = [];
				for(var b = 0;b<scian;b++){
					if(heks[a][b].z>0){
                        //heks[a][b].test = ""
                    
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
            for(var k = 0;k<10;k++){
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
                        //if(unit1 != undefined && unix[kolej][unit1.id].x != -1 && unit1.rodz == 8 && unit1.rozb > 0 && unit1.rozb < 20 && unit1.il > 20)
                        //    unit1.rozb = 0
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
                                
                            if(unit1.rodz == unit2.rodz && (unit1.ruchy == 0 && unit2.ruchy == 0 || unit1.ruchy > 0 && unit2.ruchy > 0) /* && (unit1.rozb == 0 || unit2.il > 60) && (unit2.rozb == 0 || unit2.il > 60)*/ && unit1.il < 99 && unit2.il < 99){
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
                    if(unit != undefined && pathIsThroughCrowdedCity(null,hex.x,hex.y,unit.ruchk,unit.rucho,unit)){
                        console.log('usuwa')
                        zaznu = -1
                        zaznu = hex.unt[i]
                        //zaznaj(hex.unt[i],false)
                        odceluj(hex.unt[i],kolej);
                        if(unix[kolej][hex.unt[i]] != undefined && unix[kolej][hex.unt[i]].x != undefined && unix[kolej][hex.unt[i]].x != -1){
                            oddroguj(hex.unt[i],kolej,false);
                        }
                        zaznu = -1

                    }
                }
                spojy++
                if(spojy >= scian){
                    spojy = 0
                    spojx++
                }
            }
            
        break;
        case 1.1:
            dfrou=distmapsFromUnit()
            dfrouEmbarkingTargets = getEmbarkingTargets(dfrou,kolej)
            tryRemoveUnnecessaryPaths(dfrou,kolej,dfrouEmbarkingTargets)
            dfrou=distmapsFromUnit()
            
            simplifieddistmaps=simpledistmaps(dfrou)
            dfrouEmbarkingTargets = getEmbarkingTargets(dfrou,kolej)

            evaluate(dfrou,dfrouEmbarkingTargets)
            
            legalActions(dfrou,simplifieddistmaps)
            iterations = 0
            orig_ulepszyns = 9
            ulepszyns = orig_ulepszyns
            aistan = 1.15
            //distmap = aidistmap()
            //checkDistmapDistance(distmap)
            generate_areas(mist,params)
        break
        case 1.15:
            aistan = 1.2
        break
        case 1.2:
            
            inaccessible_path = {}
            for(var i = 0;i<scian;i++){
                inaccessible_path[i] = {}
                for(var j = 0;j<scian;j++){
                    inaccessible_path[i][j] = {x:i,y:j,inaccessible:true,coast:-1}
                    //if(ulepszyns == 3)
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
            embarkingTargets = getEmbarkingTargets(dbetter,kolej)

            evaluate(dbetter,embarkingTargets)
            
            if(window.large_map == undefined)
                large_map = {}
            large_map = prepareLargeMap(dfrou,large_map)
            if(window.large_map_heavy == undefined)
                large_map_heavy = {}
            large_map_heavy = prepareLargeMap(dfrou,large_map_heavy,true)
            //console.log(large_map)
            
            //legalActions(dbetter)
            possible_stationary_targets = []
            
            possible_targets_ix = 0
            possible_targets = []
            addedHexes = {}
            myHexes = 0
            for(var key in dfrou.distmaps){
                var distmap = dfrou.distmaps[key]
                
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
                
                
                var drur = distmap.hex.heks.undr != undefined ? distmap.hex.heks.undr : distmap.hex.heks.dru
                var dr = evalAlliegance(dfrou,distmap)//distmap.hex.heks.undr != undefined ? distmap.hex.heks.undr : distmap.hex.heks.dru
                /*
                //for(var movement_type in distmap.maps){
                var dmap1 = distmap.maps['n'].hexmap.filter(x=>x.dist != -1)
                var dmap2 = 'w' in distmap.maps ? distmap.maps['w'].hexmap.filter(x=>x.dist != -1) : null
                
                dmap1.sort((a,b)=>a.dist-b.dist)

                for(var i in dmap1){
                    var obj = dmap1[i]        
                    
                    if(( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj.objdist < large_map[obj.hex.x][obj.hex.y].dmap[key].dist )){
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj.objdist,water:obj.water,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                        

                    }
                }
                if(dmap2 != null){
                    dmap2.sort((a,b)=>a.dist-b.dist)
                    for(var i in dmap2){
                        var obj = dmap2[i]        
                        if( !(key in large_map[obj.hex.x][obj.hex.y].dmap)
                            // || obj.dist < large_map[obj.hex.x][obj.hex.y].dmap[key].dist )
                        ){
                            large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj.objdist,water:obj.water,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                            

                        }
                    }
                }*/
                //}
                    
                large_map[distmap.hex.heks.x][distmap.hex.heks.y].color = dr
                large_map_heavy[distmap.hex.heks.x][distmap.hex.heks.y].color = dr
                if(dr == kolej && distmap.hex.units.length > 0){
                    
                    if(totalUnitSize < 10 && distmap.hex.heks.z <= 0){
                        continue
                    }
                    
                    //heks[distmap.hex.heks.x][distmap.hex.heks.y].test = "X"
                    //if(dr != -1)
                    //    heks[distmap.hex.heks.x][distmap.hex.heks.y].testColor = kolox(dr,0)
                    myHexes++
                    for(var movement_type in distmap.maps){
                        var dmap = distmap.maps[movement_type].hexmap.filter(x=>x.dist != -1)

                        dmap = dmap.sort((a,b)=>a.dist-b.dist)
                        var lvlok = 2
                        var foundFrontline = false
                        for(var i in dmap){
                            var obj = dmap[i]
                            
                            
                            var obdrreal = obj.hex.heks.undr != undefined ? obj.hex.heks.undr : obj.hex.heks.dru
                            var obdr = evalAlliegance(dfrou,obj)//obj.hex.heks.undr != undefined ? obj.hex.heks.undr : obj.hex.heks.dru
                            if(obdr != obdrreal){
                                //obj = Object.assign({}, obj)
                                obj.dist += scian
                            }
                            
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
                            if((obdr != kolej || obdrreal != kolej) && (obj.hex.units.length > 0 || obj.hex.z > 0)){
                                
                                if(!(obdr != -1 && f.dist > lvlok + 3 && foundFrontline)){
                                        
                                    
                                    /*
                                    for(var j = 0;j<obj.hex.units.length;j++){
                                        if(obj.hex.units[j].actions.length > 0 && obj.hex.units[j].actions[0].type == 'move'){
                                            var cod = obj.hex.units[j].actions[0].destination[0] + '#' + obj.hex.units[j].actions[0].destination[1]
                                        }
                                    }*/
                                    var code = obj.hex.heks.x + '#' + obj.hex.heks.y
                                    if(addedHexes[code] == undefined){
                                        addedHexes[code] = obj.dist
                                        //if(code in sidima)
                                            var obj2 = Object.assign({}, obj)
                                            possible_targets.push(obj2)
                                    } else if(obj.dist < addedHexes[code]){
                                        addedHexes[code] = obj.dist
                                        //if(code in sidima){
                                            var ix = -1
                                            for(var k in possible_targets){
                                                if(possible_targets[k].hex.heks.x == obj.hex.heks.x && possible_targets[k].hex.heks.y == obj.hex.heks.y){
                                                    ix = k
                                                }
                                            }
                                            if(ix != -1)
                                                possible_targets.splice(ix,1)// = possible_targets.filter(a => a.hex.heks.x != obj.hex.heks.x || a.hex.heks.y != obj.hex.heks.y)
                                            var obj2 = Object.assign({}, obj)
                                            possible_targets.push(obj2)
                                        //}
                                    }
                                    
                                    if((!foundFrontline || lvlok > obj.dist) && obdr != -1 && obdr != kolej){
                                        foundFrontline = true
                                        lvlok = obj.dist
                                    }
                                }
                                    
                                    
                            }
                        }
                        
                        var rmap = distmap.maps[movement_type].rangemap.filter(x=>x.dist != -1)

                        var rmap = rmap.sort((a,b)=>a.dist-b.dist)
                        for(var i in rmap){
                            var obj = rmap[i]
                            var obdr = evalAlliegance(dfrou,obj)//obj.hex.heks.undr != undefined ? obj.hex.heks.undr : obj.hex.heks.dru

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
                                    //if(code in sidima)
                                        possible_targets.push(obj)
                                } else if(obj.dist < addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y]){
                                    addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] = obj.dist
                                    var ix = -1
                                    for(var k in possible_targets){
                                        if(possible_targets[k].hex.heks.x == obj.hex.heks.x && possible_targets[k].hex.heks.y == obj.hex.heks.y){
                                            ix = k
                                        }
                                    }
                                    if(ix != -1)
                                        possible_targets.splice(ix,1)
                                    //possible_targets = possible_targets.filter(a => a.hex.heks.x != obj.hex.heks.x || a.hex.heks.y != obj.hex.heks.y)
                                    possible_targets.push(obj)
                                    possible_stationary_targets.push(obj)
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
            }/*
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
            }*/
            
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
             * 
        var wysortowane = []
        for(var j = 0;j < other_hexes.length;j++){
            var code = other_hexes[j].x + '#' + other_hexes[j].y
            
            if(code in hexes[i].dmap){
                wysortowane.push({hex:other_hexes[j],dist:hexes[i].dmap[code].dist})
            }
        }
        wysortowane.sort((a,b) => a.dist - b.dist)
        
        var hexDef = summedHexValue(hexes[i].x,hexes[i].y,false)
        var toOvercome = 0
        for(var j in wysortowane){
            toOvercome += summedHexValue(wysortowane[j].hex.x,wysortowane[j].hex.y,true)
            if(toOvercome > hexDef){
                dist = wysortowane[j].dist
                clos = wysortowane[j].hex
                break
            }
        }*/
            //summedHexValue
            for(var i = 0;i<scian;i++){
                for(var j = 0;j<scian;j++){
                    
                    var mountainous = false
                    for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
                        var lmap = mountainous ? large_map[i][j] : large_map_heavy[i][j]
                        
                        var closest = Infinity
                        var closestElem = []
                        
                        
                        if(lmap.color == kolej){
                            closest = 0
                            closestElem = [lmap]
                        }
                        
                        var hexDef = summedHexValue(i,j,false)
                        var toOvercome = 0
                        
                        var wysortowane = []
                        
                        for(var k in lmap.dmap){
                            //{dist:obj.dist,color:obdr}
                            var dmapelem = lmap.dmap[k]
                            
                            if(dmapelem.x+'#'+dmapelem.y in dfrou.distmaps && dmapelem.dist > 0){
                                if(lmap.color == kolej && dmapelem.color != kolej){
                                    wysortowane.push({hex:dmapelem,dist:dmapelem.dist})
                                } else if(lmap.color != kolej && dmapelem.color == kolej){
                                    wysortowane.push({hex:dmapelem,dist:dmapelem.dist})
                                }
                            }
                        }
                        wysortowane.sort((a,b) => a.dist - b.dist)
                        for(var k in wysortowane){
                            toOvercome += summedHexValue(wysortowane[k].hex.x,wysortowane[k].hex.y,true)
                            if(toOvercome > hexDef){
                                if(wysortowane[k].dist < Infinity && wysortowane[k].dist > closest){
                                    break
                                }
                                closest = wysortowane[k].dist
                                closestElem.push(wysortowane[k].hex)
                            }
                        }


                        //heks[i][j].test = Math.floor(closest*100)/100
                        if(lmap.color != kolej){
                            //if(heks[lmap.x][lmap.y].z > 0)
                            //    console.log('ce',wysortowane,closestElem)
                            lmap.closestelem = closestElem
                            lmap.dist = closest
                            lmap.closestenemy = []
                            lmap.distenemy = Infinity
                        } else {
                            lmap.closestelem = [lmap]
                            lmap.dist = 0
                            lmap.closestenemy = closestElem
                            lmap.distenemy = closest
                            //console.log('ce2',lmap)
                        }
                    }
                }
            }
            
            
            var dist_layers = {}
            var curr_hexes = []
            var from_hexes = []

            var curr_hexes_heavy = []
            var from_hexes_heavy = []
            
            var mountainous = false
            for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
                for(var key in dfrou.distmaps){
                    /*
                    var okoks = dfrou.distmaps[key].hex.heks.z > 0
                    if(!okoks)
                        for(var j in dfrou.distmaps[key].hex.units){
                            var unit = dfrou.distmaps[key].hex.units[j]
                            if(zast[unit.rodz] != 'x' && zast[unit.rodz] != 'm')
                                okoks = true
                        }*/
                    //if(okoks || true){
                        var coords = key.split('#')
                        
                        var ckolor = evalAlliegance(dfrou,dfrou.distmaps[key],MAX_TURNS-1)
                        var dkolor = dfrou.distmaps[key].hex.dru

                        if((ckolor != kolej) && (ckolor != -1 || dfrou.distmaps[key].hex.heks.z > 0)/* && (ckolor != -1 || dfrou.distmaps[key].hex.heks.z > 0) || dfrou.distmaps[key].hex.dru != kolej && (ckolor != -1 || dfrou.distmaps[key].hex.heks.z > 0)*/){
                            //console.log('cle',large_map[coords[0]][coords[1]].closestelem)
                            if(mountainous)
                                curr_hexes.push(large_map[coords[0]][coords[1]])
                            else if(heks[coords[0]][coords[1]].z != -2) {
                                curr_hexes_heavy.push(large_map_heavy[coords[0]][coords[1]])
                            }
                        } else {
                            if(mountainous)
                                from_hexes.push(large_map[coords[0]][coords[1]])
                            else if(heks[coords[0]][coords[1]].z != -2) {
                                from_hexes_heavy.push(large_map_heavy[coords[0]][coords[1]])
                            }
                        }
                    //}
                }
            }
            
            var stop = false
            var nearest_hexes = {true:[],false:[]}
            
            behind_score = {}
            
            i_am_behind = {true:{},false:{}}
            var curr_hexes2 = {true:[],false:[]}
            
            strictly_forward = {true:{},false:{}}
            
            var scurr = curr_hexes
            var mountainous = false
            for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
                var chexes = mountainous ? curr_hexes : curr_hexes_heavy
                for(var i = 0;i < chexes.length;i++){
                    var d2code = chexes[i].x+'#'+chexes[i].y
                    behind_score[d2code] = {hex:chexes[i],value:cityscore(heks[chexes[i].x][chexes[i].y])+1}
                    strictly_forward[mountainous][d2code] = {hex:chexes[i],value:behind_score[d2code],mountainous:mountainous}
                }
            }
            //console.log('curr',curr_hexes)
            var mountainous = false
            for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
//                var curr_hexes2 = []
                var chexes = mountainous ? curr_hexes : curr_hexes_heavy
                for(var i = 0;i < chexes.length;i++){
                    var ok = true
                    var ok2 = true
                    
                    var ok__ = false
                    var ok2__ = false
                    
                    var clos = chexes[i].closestelem
                    
                    var d1code = chexes[i].x+'#'+chexes[i].y
                    i_am_behind[mountainous][d1code] = {value:cityscore(chexes[i]),codes:[]}
                    //console.log('cl',[curr_hexes[i].closestelem,curr_hexes[i].closestenemy])
                    for(var ij in clos){
                            
                        var ok_ = true
                        var ok2_ = true
                        var eachclos = clos[ij]

                        var closcode = eachclos.x+'#'+eachclos.y
                        var closelem = large_map[eachclos.x][eachclos.y]
                        for(var j = 0;j < chexes.length;j++){
                            if(i != j && chexes[i].x+'#'+chexes[i].y != closcode && heks[eachclos.x][eachclos.y].z != -2 && heks[chexes[i].x][chexes[i].y].z != -2 && chexes[j].x+'#'+chexes[j].y != closcode/* && curr_hexes[j].color != -1*/){
                                //if(curr_hexes[j].x+'#'+curr_hexes[j].y in curr_hexes[i].dmap)
                                //    console.log([curr_hexes[i].dmap[closcode].dist, curr_hexes[j].dmap[closcode].dist, curr_hexes[i].dmap[curr_hexes[j].x+'#'+curr_hexes[j].y].dist])

                                if(closcode in chexes[i].dmap && closcode in chexes[j].dmap && chexes[j].x+'#'+chexes[j].y in chexes[i].dmap/* && 
                                    curr_hexes[i].dmap[closcode].dist-1 > (curr_hexes[j].dmap[closcode].dist + curr_hexes[i].dmap[curr_hexes[j].x+'#'+curr_hexes[j].y].dist)*0.7 */){
                                    var d2code = chexes[j].x+'#'+chexes[j].y
                                    var d1 = chexes[i].dmap[closcode].dist// - curr_hexes[j].dmap[closcode].water*2
                                    var d2 = chexes[j].dmap[closcode].dist// - curr_hexes[j].dmap[closcode].water*2
                                    var d3 = (chexes[i].dmap[chexes[j].x+'#'+chexes[j].y].dist)// - curr_hexes[i].dmap[curr_hexes[j].x+'#'+curr_hexes[j].y].dist*2
                                    
                                    var prst = d1 > (d2 + d3)*0.7 && !(d2 > (d1 + d3)*0.7)/* && d1 > 3*/ && /*distance(chexes[i].x,chexes[i].y,chexes[j].x,chexes[j].y)*/d2 > 1// && d1-1 > d2
                                    if(prst){
                                        ok2_ = false
                                        i_am_behind[mountainous][d1code].codes.push(d2code)
                                        //if(d1 >= 2/* && d2 >= 2*/){
                                        //if(d1 > 1){
                                            ok_ = false
                                        //}
                                        //}
                                    }
                                }
                            }
                        }
                        ok__ |= ok_
                        ok2__ |= ok2_
                        break
                    }
                    if(clos.length > 0){
                        ok = ok__
                        ok2 = ok2__
                    }
                    //ok2 = ok
                        if(!ok){
                            curr_hexes2[mountainous].push(chexes[i])
                            //heks[curr_hexes[i].x][curr_hexes[i].y].test = 'F'
                        } else {
                            nearest_hexes[mountainous].push(chexes[i])
                            /*
                            var code = curr_hexes[i].x+'#'+curr_hexes[i].y
                            if(!(code in behind))
                                behind[code] = {hex:curr_hexes[i],value:0}
                            behind[code].value += heks[curr_hexes[i].x][curr_hexes[i].y].z
                            */
                        }
                        if(!ok2){
                            delete strictly_forward[mountainous][d1code]
                        }
                   // }
                }
                //curr_hexes = curr_hexes2
                stop = true
            }        
            curr_hexes = curr_hexes2[false].slice()
            for(var i in curr_hexes2[true]){
                var newhex = curr_hexes2[true][i]
                if(curr_hexes.filter(a => a.x == newhex.x && a.y == newhex.y).length == 0){
                    curr_hexes.push(newhex)
                }
            }
            const DISTANCE_FROM_FRONT = 3
            realSfKeys = {}
            var sfkeys = []
            for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
                for(var key in strictly_forward[mountainous]){
                    heks[strictly_forward[mountainous][key].hex.x][strictly_forward[mountainous][key].hex.y].test = 'H'
                    sfkeys.push({hex:strictly_forward[mountainous][key].hex, key:key, score:strictly_forward[mountainous][key].value})
                    if(!(key in realSfKeys))
                        realSfKeys[key] = {hex:strictly_forward[mountainous][key].hex, distTable:allColorTables(), maxPlayer: -1, maxPlayerScore: 0, mountainous: mountainous}
                }
            }
            sfkeys.sort((a,b)=>a.score-b.score)
            
            for(var i in sfkeys){
                var sfkey = sfkeys[i]
                var cod1 = sfkey.hex.x + '#' + sfkey.hex.y
    
                if(!(cod1 in realSfKeys))
                    continue
                
                for(var key in sfkey.hex.dmap){
                    if(key != cod1 && (sfkey.hex.dmap[key].dist <= DISTANCE_FROM_FRONT && !(key in realSfKeys && realSfKeys[key].hex.z < 0 && realSfKeys[cod1].hex.z >= 0))){
                        delete realSfKeys[key]
                    }
                }
                
            }
            
            for(var key in realSfKeys){
                var sts = realSfKeys[key]
                
                heks[sts.hex.x][sts.hex.y].test = 'Q'
            }
             
            allowPaths = {}
             
            //console.log(nearest_hexes,from_hexes)
            
            var mountainous = false
            for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
                for(var i = 0;i < nearest_hexes[mountainous].length;i++){
                    var d2code = nearest_hexes[mountainous][i].x+'#'+nearest_hexes[mountainous][i].y
                    
                    //heks[nearest_hexes[i].x][nearest_hexes[i].y].test = 'G'

                    var fhexes = mountainous ? from_hexes : from_hexes_heavy
                    for(var j = 0;j < fhexes.length;j++){
                        //if(curr_hexes[j].x+'#'+curr_hexes[j].y in curr_hexes[i].dmap)
                        //    console.log([curr_hexes[i].dmap[closcode].dist, curr_hexes[j].dmap[closcode].dist, curr_hexes[i].dmap[curr_hexes[j].x+'#'+curr_hexes[j].y].dist])
                        var d1code = fhexes[j].x+'#'+fhexes[j].y

                        if(d1code == d2code)
                            continue
                                
                        var clos = fhexes[j].closestenemy

                        var ok = false
                        var ok2 = false
                        /*if(nearest_hexes[i].color == -1){
                            ok = true
                        } else */
                        for(var ij in clos){
                            var eachclos = clos[ij]
                            var closcode = eachclos.x+'#'+eachclos.y

                            var closelem = large_map[eachclos.x][eachclos.y]
                            //console.log([closcode in nearest_hexes[i].dmap, closcode in from_hexes[j].dmap, nearest_hexes[i].x+'#'+nearest_hexes[i].y in from_hexes[j].dmap, from_hexes[j]])
                            if(closcode in nearest_hexes[mountainous][i].dmap && closcode in fhexes[j].dmap && nearest_hexes[mountainous][i].x+'#'+nearest_hexes[mountainous][i].y in fhexes[j].dmap){
                                
                                var d1 = fhexes[j].dmap[closcode].dist //+ from_hexes[j].dmap[closcode].water*2
                                var d2 = nearest_hexes[mountainous][i].dmap[closcode].dist //+ nearest_hexes[i].dmap[closcode].water*2
                                var d3 = (fhexes[j].dmap[nearest_hexes[mountainous][i].x+'#'+nearest_hexes[mountainous][i].y].dist)// - curr_hexes[i].dmap[curr_hexes[j].x+'#'+curr_hexes[j].y].dist*2
                                
                                var prsz = d1 < (d2 + d3)*0.7 && !(d3 >= (d3 + d1)*0.7)
                                
                                //console.log([d1, (d1 + d2)*0.7,d2,d3,from_hexes[j].dmap[closcode],nearest_hexes[i].dmap[closcode]])
                                if(prsz){
                                    ok2 = true
                                }
                                if(prsz/* || d2 <= 1*/){
                                    //if(!(d2code in behind))
                                    //    behind[d2code] = {hex:from_hexes[j],value:0}
                                    //behind[d2code].value += heks[nearest_hexes[i].x][nearest_hexes[i].y].z
                                    ok = true
                                }
                            }
                            
                        }
                        if(clos.length == 0){
                            ok = true
                            ok2 = true
                        }
                        if(ok){

                            allowPaths[d1code+'#'+d2code] = true
                            //heks[nearest_hexes[i].x][nearest_hexes[i].y].test = ''
                        }
                        if(!ok2){
                            delete strictly_forward[d1code]
                        }
                    }
                }
            }
        
            var mountainous = false
            for(var mountainous = false, swicz = false;!swicz;swicz = mountainous,mountainous = true){
                for(var d1code in i_am_behind[mountainous]){
                    var codes = i_am_behind[mountainous][d1code].codes
                    var value = i_am_behind[mountainous][d1code].value
                    for(var i in codes){
                        var d2code = codes[i]
                        //if(allowPaths[d1code+'#'+d2code])
                            behind_score[d2code].value += value / (codes.length+1)
                    }
                }
            }
            
            
            farFromFront = []
            prepareDistTable(realSfKeys, farFromFront, allowPaths, dfrou)
            //console.log(realSfKeys)
            
            /*
            if(ulepszyns == 6)
            for(var code in behind){
                heks[behind[code].hex.x][behind[code].hex.y].test = behind[code].value
            }*/
            
            //redraw(true)
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
            //possible_targets.sort((a,b)=>a.dist - b.dist)
            //possible_targets = nearest_hexes.map(a => new Object({hex:{x:a.x, y:a.y, z:heks[a.x][a.y].z},dist:a.dist}))
            
            //console.log('a1',possible_targets)
            possible_targets = Array.from(new Set(nearest_hexes[true].concat(nearest_hexes[false]))).map(a => new Object({hex:{x:a.x, y:a.y, z:heks[a.x][a.y].z},dist:a.dist,value:0}))
            
            possible_targets.sort((a,b) => (new String(a.hex.x+'#'+a.hex.y)).localeCompare(b.hex.x+'#'+b.hex.y))
            possible_targets = possible_targets.filter(x=>x.dist < Infinity)
            //console.log('a2',nearest_hexes[true],nearest_hexes[false])
            
            for(var i in possible_stationary_targets){
                var był = false
                for(var j in possible_targets){
                    if(possible_targets[j].hex.x == possible_stationary_targets[i].hex.x && possible_targets[j].hex.y == possible_stationary_targets[i].hex.y){
                        był = true
                        break
                    }
                }
                if(!był){
                    possible_targets.push(possible_stationary_targets[i])
                }
            }
            var possible_targets3 = []
            for(var i in possible_targets){
                var targ1 = possible_targets[i]
                if(i == 0){
                    possible_targets3.push(targ1)
                    continue
                }
                var targ2 = possible_targets[i-1]
                if(targ1.hex.x == targ2.hex.x && targ1.hex.y == targ2.hex.y){
                    continue
                } else {
                    possible_targets3.push(targ1)
                }
            }
            possible_targets = possible_targets3
            for(var i in possible_targets){
                var targ = possible_targets[i]
                
                var code = targ.hex.x+'#'+targ.hex.y
                
                var modif = {}
                modif[code] = kolej
                targ.value = (code in behind_score ? behind_score[code].value : 1) + cityscore(heks[targ.hex.x][targ.hex.y])*2//calculateStrategicMapForTeam(large_map, dfrou, kolej, modif)// + heks[targ.hex.x][targ.hex.y].z
            }
            //calculateStrategicMapForTeam(large_map, dm, color, mod)
            //console.log(possible_targets)
            //console.log(possible_targets)
            //possible_targets.sort((a,b)=>(-(a.hex.z+2)/Math.pow(2,a.dist) + (b.hex.z+2)/Math.pow(2,b.dist)))
            //possible_targets.sort((a,b)=>(-a.value + b.value))
//            possible_targets.sort((a,b)=>(-(a.dist-1/(2+a.value))+(b.dist-1/(2+b.value))))
            possible_targets.sort((a,b)=>(-Math.pow(0.5,a.dist)*(2+a.value)+Math.pow(0.5,b.dist)*(2+b.value)))

            
            possible_dest_codes = {}
            for(var i in possible_targets){
                var code = possible_targets[i].hex.x+'#'+possible_targets[i].hex.y
                possible_dest_codes[code] = true
            }
            //possible_targets.sort((a,b) => (a.x+'#'+a.y in behind ? behind[a.x+'#'+a.y].value : 0) - (b.x+'#'+b.y in behind ? behind[b.x+'#'+b.y].value : 0))
            
            //console.log(possible_targets)
            //possible_targets = possible_targets.filter(x => x.distanceMap)
            
            //possible_targetsNew = possible_targets.filter(x=>x.hex.z > 0).slice(0,20)
            //possible_targetsAdditional = possible_targets.filter(x=>x.hex.z <= 0).slice(0,5)
            //possible_targets = possible_targets.slice(0,10)
            //possible_targets = possible_targets.slice(-10)
            
            //possible_targets = possible_targetsNew.concat(possible_targetsAdditional)
            //possible_targets = possible_targets.slice(0,15)
            //console.log(possible_targets)
            /*
            failedUses = {}
            for(var i in possible_targets){
                var targ = possible_targets[i]
                failedUses[possible_targets[i].hex.x+'#'+possible_targets[i].hex.y] = 0
                //heks[targ.hex.x][targ.hex.y].test = 'X'
            }*/
            //console.log('pt',possible_targets)

            if(iterations == 0)
                legalActions(dfrou,simplifieddistmaps)
            tryMakeDestinationMap(dfrou,kolej,allowPaths)
            
            destinies = prepareAllDestinies(dfrou)
            
            //possible_targets.sort(() => Math.random() - 0.5)
            overall_score_changed = false
            aistan = 1.3
        break
        case 1.3:
            if(possible_targets_ix >= possible_targets.length){
                if(ulepszyns > 0){
                    if(overall_score_changed && dbetter != null){
                        overall_score_changed = false
                    } else {
                        ulepszyns--
                    }
                    var score1 = 0
                    for(var i = 0;i<MAX_TURNS;i++){ score1 += dfrou.score[kolej][i] * Math.pow(1/2.1,i) }
                    var score2 = 0
                    for(var i = 0;i<MAX_TURNS;i++){ score2 += dbetter.score[kolej][i] * Math.pow(1/2.1,i) }
                    
                    large_map = prepareLargeMap(dfrou,large_map)
                    var modif = {}
                    for(var t in dfrou.score){
                        //score_1 += calculateStrategicMapForTeam(large_map, dfrou, kolej, modif, t) / Math.pow(2.1,t)
                        //score_2 += calculateStrategicMapForTeam(large_map, dbetter, kolej, modif, t) / Math.pow(2.1,t)
                    }
                    score_1 = scoreOfBehinds(dfrou,kolej,behind_score)
                    score_2 = scoreOfBehinds(dbetter,kolej,behind_score)
                    if(score_2 > score_1 || score_1 == score_2 && score2 > score1){
                        dfrou = copyDistmaps(dbetter)
                        dfrouEmbarkingTargets = getEmbarkingTargets(dfrou,kolej)

                        evaluate(dfrou,dfrouEmbarkingTargets)
                        ulepszyns--
                    } else {
                        ulepszyns--
                    }

                    
                    
                    //console.log(dfrou)
                    
                    //legalActions(dfrou)
                    aistan = 1.2
                    iterations++
                } else {
                    dfrou = dbetter
                    dfrouEmbarkingTargets = getEmbarkingTargets(dfrou,kolej)

                    
                    aistan = 1.33
                }
            } else {
                for(var ct = 0;ct<4;ct++){
                    var tested_target = possible_targets[possible_targets_ix]
                    var checkedTurn = 1
                    var checkedTurn2 = MAX_TURNS-1
                    //var extractedActions = extractActions(dbetter)
                    var newDistmap = copyDistmaps(dfrou)
                    
                    //evaluate(newDistmap,2)
                    //legalActions(newDistmap)
                    
                    //console.log(embarkingTargets)
                    
                    var code = tested_target.hex.x+'#'+tested_target.hex.y
                    if(newDistmap.distmaps[code].alliegance[MAX_TURNS-1] != kolej){
                        tryMakeDestinationMap(newDistmap,kolej,allowPaths)
                        embarkingTargets = Object.assign({},dfrouEmbarkingTargets)
                        var result = tryPutUnderAttack(newDistmap,tested_target.hex.x,tested_target.hex.y,kolej,destinies,ulepszyns % 2 == 1,embarkingTargets,behind_score)
                        //if(!result){
                        //    failedUses[tested_target.hex.x+'#'+tested_target.hex.y]++
                        //}
                        evaluate(newDistmap,embarkingTargets)
                    }

                    
                    /*
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
                    }/*
                    var fact = 0.8
                    for(var i in score1){
                        for(var j in score1[i]){
                            score1[i][j] = score1[i][j] * Math.pow(fact,i+1) + score2[i][j] * (1 - Math.pow(fact,i+1))
                        }
                    }*/
                    
                    if(dbetter == null)
                        dbetter = newDistmap
                    
                    var maxBetter = 0
                    var minBetter = 0
                    
                    var score__1 = 0
                    var score__2 = 0
                    var score_1 = scoreOfBehinds(newDistmap,kolej,behind_score)
                    var score_2 = scoreOfBehinds(dbetter,kolej,behind_score)
                    /*
                    for(var i = 0;i<MAX_TURNS;i++){ score__1 += newDistmap.score[kolej][i] * Math.pow(1/2.1,i) }
                    for(var i = 0;i<MAX_TURNS;i++){ score__2 += dbetter.score[kolej][i] * Math.pow(1/2.1,i) }
                    *//*
                    for(var t in newDistmap.score){
                        score__1 += newDistmap.score[t][kolej] / Math.pow(2.1,t)
                        score__2 += dbetter.score[t][kolej] / Math.pow(2.1,t)
                    }*/
                    var score__1 = 0
                    for(var i = 0;i<MAX_TURNS;i++){ score__1 += newDistmap.score[kolej][i] * Math.pow(1/2.1,i) }
                    var score__2 = 0
                    for(var i = 0;i<MAX_TURNS;i++){ score__2 += dbetter.score[kolej][i] * Math.pow(1/2.1,i) }
                    
                    var modif = {}
                    //var large_map = prepareLargeMap(dbetter)
                    //var large_map2 = prepareLargeMap(dbetter)
                    //for(var t in newDistmap.score){
                    //    score_1 += calculateStrategicMapForTeam(large_map, newDistmap, kolej, modif, t) / Math.pow(2.1,t)
                    //    score_2 += calculateStrategicMapForTeam(large_map, dbetter, kolej, modif, t) / Math.pow(2.1,t)
                    //}
                    
                    
                    /*for(var t = 0;t<MAX_TURNS;t++){
                        if(Math.max(0,-score2[t][kolej] + score1[t][kolej]) > maxBetter){
                            maxBetter = Math.max(0,score2[t][kolej] - score1[t][kolej])
                        }
                        if(Math.max(0,score2[t][kolej] - score1[t][kolej]) > minBetter){
                            minBetter = Math.max(0,-score2[t][kolej] + score1[t][kolej])
                        }*/
                        
                    /*
                    if(dbetter == null || score1[checkedTurn][kolej] > score2[checkedTurn][kolej] || score1[checkedTurn][kolej] >= score2[checkedTurn][kolej]*0.8 && score1[checkedTurn2][kolej] > score2[checkedTurn2][kolej]){
                        dbetter = newDistmap
                        if(dbetter != null && score1[checkedTurn2][kolej] > score2[checkedTurn2][kolej])
                            overall_score_changed = true
                    }*/
                    //console.log(score_1,score_2)
                    //console.log(score_1, score_2, score__1, score__2)
                    
                    if(score_1 > score_2 || score_1 == score_2 && score__1 > score__2){
                        dbetter = newDistmap
                        //if(dbetter != null && score1[checkedTurn2][kolej] > score2[checkedTurn2][kolej]){
                            overall_score_changed = true
                        //}
                    }
                    
                    //embarkingTargets = getEmbarkingTargets(dfrou,kolej)
                    //}
                    //if(maxBetter > minBetter)
                    //    dbetter = newDistmap
                    
                    /*
                    for(var key in dfrou.distmaps){
                        var distmap = dfrou.distmaps[key]
                            
                        var biggest = -1
                        var moving_units = 0
                        var units_outgoing = []
                        for(var i in distmap.hex.units){
                            var unit = distmap.hex.units[i]
                            for(var j in unit.actions){
                                var action = unit.actions[j]
                                if(action.by == 'speculation2')
                                    action.by = 'speculation'
                            }
                        }
                    }*/
                    possible_targets_ix++
                    if(possible_targets_ix >= possible_targets.length)
                        break
                        
                }
            }
        break
        case 1.33:
            biggestScore = -Infinity
            biggestScoreHex = null
            for(var key in realSfKeys){
                var score = behind_score[key]
                if(score > biggestScore){
                    biggestScore = score
                    biggestScoreHex = realSfKeys[key]
                }
            }
            
            dodawane = 10
            scorenotchanged = 0
            failedvvals = {}
            usedvvals = {}
            aistan = 1.331
            //aistan=1.34
            legalActions(dfrou,simplifieddistmaps)
            dbetter = copyDistmaps(dfrou)
            break
        case 1.331:
            
            dbetter = copyDistmaps(dfrou)
            

            farFromFront = []

            tryMakeDestinationMap(dbetter,kolej,allowPaths)
            var score1 = prepareDistTable(realSfKeys, farFromFront, allowPaths, dbetter)
            var score2 = score1
            
            var realSfKeysSorted = Object.values(realSfKeys).sort((a,b) => a.maxPlayerScore - b.maxPlayerScore)
            //if(biggestScoreHex != null)
            //    realSfKeysSorted.push(biggestScoreHex)

            
            var embarkingTargets = getEmbarkingTargets(dbetter,kolej)
            for(var i in realSfKeysSorted){
                usedvvals = {}
                //if(realSfKeysSorted[i].maxPlayerScore > 5000 && i < realSfKeysSorted.length-1)
                //    continue
                
//                if(i < realSfKeysSorted.length-1)
//                    continue
                     
                dnew = copyDistmaps(dbetter)

                //evaluate(dnew,embarkingTargets)
                
                var sfKey = realSfKeysSorted[i]
                if(sfKey != undefined && sfKey.hex != undefined){
                    var newSfKeys = {}
                    newSfKeys[sfKey.hex.x+'#'+sfKey.hex.y] = sfKey
                    //console.log(newSfKeys)
                    var pUnitActions = tryGetFarUnitsToFront(newSfKeys, farFromFront, allowPaths, dnew, failedvvals, realSfKeys)

                    var vals = Object.values(pUnitActions)
                    
                    //console.log(vals)
                    //console.log('vals:', vals, sfKey.hex.x+'#'+sfKey.hex.y)
                    for(var jj in vals){
                        var vvals = vals[jj]
                        //vvals.sort((a,b) => -a.action[0].il/Math.pow(2,a.time)+b.action[0].il/Math.pow(2,b.time))
                        vvals.sort((a,b) => a.time-b.time)
                        for(k in vvals){
                            
                            var firstVal = vvals[k]
                            
                            if(usedvvals[firstVal.hex_from+'#'+firstVal.unitIx])
                                continue
                            
                            //console.log(firstVal)
                            //console.log(firstVal.action[0])
                            
                            //if((fcode in failedvvals)){
                            //    continue
                            //}
                                
                            
                            var path = getLeadedPath(firstVal.action[0].from[0],firstVal.action[0].from[1],firstVal.action[0].ruchk,firstVal.action[0].rucho)
                            var oks = true
                            
                            for(var j in path.path){
                                var hx = path.path[j]
                                
                                if(j > 0 && j < path.path.length-1 && heks[hx.x][hx.y].unp > 3 && heks[hx.x][hx.y].undr == kolej){
                                    oks = false
                                    break
                                }
                            }
                            if(!oks){
                                continue
                            }
                            if(dnew.distmaps[firstVal.hex_from].hex.heks.z > 0){
                                var staying = 0
                                //console.log(dnew.distmaps[firstVal.hex_from],firstVal)
                                for(var i in dnew.distmaps[firstVal.hex_from].hex.units){
                                    if((dnew.distmaps[firstVal.hex_from].hex.units[i].actions.length == 0 || dnew.distmaps[firstVal.hex_from].hex.units[i].actions[0].type != 'move' || dnew.distmaps[firstVal.hex_from].hex.units[i].actions[0].il < dnew.distmaps[firstVal.hex_from].hex.units[i].il)){
                                        staying++
                                    }
                                }
                                if(staying == 0 && firstVal.action[0].type == 'move' && firstVal.action[0].il == dnew.distmaps[firstVal.hex_from].hex.units[firstVal.unitIx].il){
                                    //dnew.distmaps[firstVal.hex_from].hex.units[firstVal.unitIx].actions.length = 0
                                    //console.log(firstVal.action[0].from[0],firstVal.action[0].from[1],staying)
                                    continue
                                }
                            }
                            
                            var newaction = [cutaction(firstVal.action[0],firstVal.unitrodz)]
                            if(newaction[0].rucho.length > 0){
                                //evaluate(dnew)
                                //var score_1 = scoreOfBehinds(dnew,kolej,behind_score)

                                //var oldaction = dnew.distmaps[firstVal.hex_from].hex.units[firstVal.unitIx].actions
                                newaction.somethingAlong = false
                                dnew.distmaps[firstVal.hex_from].hex.units[firstVal.unitIx].actions = newaction.map(x=>Object.assign(new Object(),x))
                                //evaluate(dnew)
                                
                                //var score_2 = scoreOfBehinds(dnew,kolej,behind_score)
                                
                                //console.log('zskorr:',score_1,score_2)
                                //if(score_2 < score_1){
                                //    dnew.distmaps[firstVal.hex_from].hex.units[firstVal.unitIx].actions = oldaction
                                //}
                                usedvvals[firstVal.hex_from+'#'+firstVal.unitIx] = true
                                break
                                
                            }
                        }
                    } 
                    if(vals.length == 0){
                        continue
                    }
                }
                var score3 = prepareDistTable(realSfKeys, farFromFront, allowPaths, dnew)
                
                console.log('b: '+score3+'\t'+score2)
                if(score3 > score2){
                    score2 = score3
                    dbetter = dnew
                    //console.log('poszło')
                } else {
                    //console.log('nie poszło')
                    /*
                    for(var k in failablevvals){
                        failedvvals[k] = true
                    }*/
                }/*
                if(i>0)
                    break*/
                    
            }
            /*
            for(var key in realSfKeys){
                
            }*/
            
            if(score2 > score1){
                console.log('a: '+score2+'\t'+score1)
                
                dfrou = dbetter
                dfrouEmbarkingTargets = getEmbarkingTargets(dfrou,kolej)

            } else {
                scorenotchanged++
            }
            
            dodawane--
            if(dodawane <= 0 || scorenotchanged > 3){
                aistan = 1.34
                for(var key in dfrou.distmaps){
                    var distmap = dfrou.distmaps[key]
                        
                    var biggest = -1
                    var moving_units = 0
                    for(var i in distmap.hex.units){
                        var unit = distmap.hex.units[i]
                        for(var j in unit.actions){
                            var action = unit.actions[j]
                            if(action.by == 'speculation2'){
                                unit.actions[j] = Object.assign({},action)
                                unit.actions[j].by = 'speculation'
                            }
                        }
                    }
                }
            }
           // }
        break
        case 1.34:
            var cele_tratw = {}
            
            //legalActions(dfrou,simplifieddistmaps)

            for(var key in dfrou.distmaps){
                var distmap = dfrou.distmaps[key]
                
                if(distmap.hex.dru != kolej)
                    continue
                    
                /*
                if(distmap.hex.undr != kolej && (distmap.hex.units.length > 0 || distmap.hex.z > 0) && distmap.frontline){
                    possible_targets.push(distmap.hex)
                }*/
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    if(unit.szyt == 'w' && zast[unit.rodz] == 'x'){
                        var code = distmap.hex.x+'#'+distmap.hex.y
                        var il = unit.il
                        if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                            code = unit.actions[0].destination[0]+'#'+unit.actions[0].destination[1]
                            il = unit.actions[0].il
                        }
                        if(!(code in cele_tratw))
                            cele_tratw[code] = 0
                        cele_tratw[code] -= -il
                    }
                }
                
            }
            
            for(var key in dfrou.distmaps){
                
                var distmap = dfrou.distmaps[key]
                
                if(distmap.hex.dru != kolej)
                    continue
                    
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    if(zast[unit.rodz] != 'x'){
                        var code = distmap.hex.x+'#'+distmap.hex.y
                        var il = unit.il
                        if(unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].embarking != null){
                            var embark = unit.actions[0].embarking.x + '#' + unit.actions[0].embarking.y
                            if(embark in cele_tratw){
                                cele_tratw[embark] -= unit.actions[0].il
                            }
                        }
                    }
                }
            }
            for(var key in dfrou.distmaps){
                
                var distmap = dfrou.distmaps[key]
                
                if(distmap.hex.dru != kolej)
                    continue
                var embarkingTargets = getEmbarkingTargets(dfrou,kolej)
                    
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    if(zast[unit.rodz] != 'x'){
                        var code = distmap.hex.x+'#'+distmap.hex.y
                        var il = unit.il
                        if(unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].embarking != null){
                            var embark = unit.actions[0].embarking.x + '#' + unit.actions[0].embarking.y
                            if(!(embark in cele_tratw) || cele_tratw[embark] > 9){
                                var unitaction = {unit:unit, action:unit.actions, hex:distmap.hex, potentialEmbarkings: distmap.potentialEmbarkings}
                                //console.log(distmap.potentialEmbarkings)

                                addEmbarking(unitaction,embarkingTargets,dfrou.distmaps,key,dfrou,[],[],[])
                                if(embark in cele_tratw)
                                    cele_tratw[embark] -= unit.actions[0].il
                            }
                        }
                    }
                }
            }
            
            aistan = 1.35
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
                if(distmap.hex.units.filter(x=>x.szyt == 'w' && zast[x.rodz] == 'x' && x.il >= 20 && x.rozb < 10).length > 0){
                    var code = distmap.hex.x+'#'+distmap.hex.y

                    pola_z_tratwami[code] = distmap
                }
            }
            miejsca_do_wysłania_tratw = {}
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
                
                var map = pole_z_tratwami.maps['x'].hexmap
                var mapmapmap = mapmap(map,'hex')
                
                for(var j in pole_z_tratwami.hex.units){
                    var unit = pole_z_tratwami.hex.units[j]
                    
                    if(unit.szyt == 'w' && zast[unit.rodz] == 'x' && unit.rozb < 10){
                        if(unit.actions.length == 1 && unit.actions[0].type == 'move' && unit.actions[0].by == 'real'){
                            var code = unit.actions[0].destination[0] + '#' + unit.actions[0].destination[1]
                            if(code in miejsca_do_wysłania_tratw && miejsca_do_wysłania_tratw[code] != null/* && miejsca_do_wysłania_tratw[code].addedTratwas<3*/){
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
                                        
                            var result = getRuch(mapmapmap,field)
                            
                            var ruchk = result.ruchk
                            var rucho = result.rucho
                            
                            if(pole_z_tratwami.x+'#'+pole_z_tratwami.y == code && miejsca_do_wysłania_tratw[code].satisfied > miejsca_do_wysłania_tratw[code].needed)
                                continue
                            
                            if(pole_z_tratwami.x+'#'+pole_z_tratwami.y == code && miejsca_do_wysłania_tratw[code].addedTratwas > 3)
                                continue
                            
                            var liczba = unit.il
                            //console.log(pole_z_tratwami.hex.units,pole_z_tratwami.hex.units.filter(a => a.actions.length > 0 && a.actions[0].type == 'move'))
                            //console.log(pole_z_tratwami.hex.units.filter(a => a.actions.length > 0 && a.actions[0].type == 'move').length,pole_z_tratwami.hex.units.length-1)
                            if(pole_z_tratwami.hex.z > 0 && pole_z_tratwami.hex.units.filter(a => a.actions.length > 0 && a.actions[0].type == 'move').length >= pole_z_tratwami.hex.units.length-1){
                                liczba = unit.il-10
                            }
                            if(liczba < 5)
                                continue
                        
                            var action = {type:'move',by:'speculation2',rucho:rucho,ruchk:ruchk,il:liczba,from:[pole_z_tratwami.x,pole_z_tratwami.y],somethingAlong:true,destination:leadPath(pole_z_tratwami.hex.x,pole_z_tratwami.hex.y,ruchk,rucho),leadedPath:getLeadedPath(pole_z_tratwami.hex.x,pole_z_tratwami.hex.y,ruchk,rucho)/*,collisional:isPathCollisional(pole_z_tratwami.hex.x,pole_z_tratwami.hex.y,ruchk,rucho)*/}
                            
                            var turnsToGo = Math.floor(ruchk.length/unit.szy)
                            
                            var possibleMove = { unit:unit, unitId:unit.id, dru:unit.d, action:action, turnsToGo: turnsToGo }

                            miejsca_do_wysłania_tratw[code].possibleMoves.push(possibleMove)
                        }
                    }
                }
            }
                        
            var użyteTratwy = {}
            
            completely_used_passages = {}
            /*
            if(false){
            //var miejsca = Object.values(miejsca_do_wysłania_tratw).sort((a,b)=>a.turn/a.need-b.turn/b.need)
            var miejsca = Object.values(miejsca_do_wysłania_tratw).sort((a,b)=>a.turn-b.turn)
            //console.log(Object.values(miejsca_do_wysłania_tratw).map(a=>[a.turn,a.need]))
            for(var i in miejsca){
                var miejsce = miejsca[i]
                heks[miejsce.x][miejsce.y].test = 'X'
                miejsce.possibleMoves.sort((a,b)=>(a.turnsToGo-b.turnsToGo))
                
                var totalTratwas = miejsce.satisfied
                var tratwas_to_be_added = []
                
                for(var j in miejsce.possibleMoves){
                    //if(totalTratwas > miejsce.need || miejsce.addedTratwas > 2){
                    //    break
                    //}
                        
                    var possibleMove = miejsce.possibleMoves[j]
                    
                    if(użyteTratwy[possibleMove.unit.id])
                        continue
                    tratwas_to_be_added.push(possibleMove)
                    totalTratwas += possibleMove.action.il// - j > 0 ? 10 : 0
                }
                //if(totalTratwas >= miejsce.need*0.5){
                    tratwas_to_be_added.sort((a,b)=>a.turnsToGo-b.turnsToGo)
                    for(var j in tratwas_to_be_added){
                        if(miejsce.satisfied > miejsce.need || miejsce.addedTratwas > 2){
                            break
                        }
                        var possibleMove = tratwas_to_be_added[j]
                            
                        miejsce.satisfied += possibleMove.action.il + 10
                        miejsce.addedTratwas++
                        possibleMove.unit.actions = [possibleMove.action]
                        
                        użyteTratwy[possibleMove.unit.id] = true
                    }
                    
                    if(miejsce.satisfied > miejsce.need){
                        completely_used_passages[miejsce.x+'#'+miejsce.y] = true
                    }
                //}
                
//                 for(var j in miejsce.possibleMoves){
//                     //if(totalTratwas > miejsce.need || miejsce.addedTratwas > 2){
//                     //    break
//                     //}
//                         
//                     var possibleMove = miejsce.possibleMoves[j]
//                     
//                     if(użyteTratwy[possibleMove.unit.id])
//                         continue
//                     tratwas_to_be_added.push(possibleMove)
//                     totalTratwas += possibleMove.action.il
//                 }
//                 if(totalTratwas > miejsce.need-20 && miejsce.need >= 10){
//                     for(var j in tratwas_to_be_added){
//                         if(miejsce.satisfied > miejsce.need || miejsce.addedTratwas > 2){
//                             break
//                         }
//                         var possibleMove = tratwas_to_be_added[j]
//                             
//                         miejsce.satisfied += possibleMove.action.il
//                         miejsce.addedTratwas++
//                         possibleMove.unit.actions = [possibleMove.action]
//                         
//                         użyteTratwy[possibleMove.unit.id] = true
//                     }
//                     
//                     if(miejsce.satisfied > miejsce.need){
//                         completely_used_passages[miejsce.x+'#'+miejsce.y] = true
//                     }
//                 }
            }
            }*/
            
            aistan = 1.36
        break
        case 1.36:
            
            var embarkingPotential = findWastedLegalActionsWithNoLanding(dfrou,allowPaths,realSfKeys)
            
            var coastlines = sorted_coastlines.slice()
            for(var key in embarkingPotential){
                var empo = embarkingPotential[key]
                var empoem = embarkingPotential[key].embarking
                
                if(heks[empoem.x][empoem.y].z != 0)
                    continue
                    
                var needsFulfiled = portPotential(empoem.x,empoem.y,false)
                
                var needs = empo.needed
                
                //heks[empoem.x][empoem.y].test = needsFulfiled + '/' + needs
                
                var restFulfilled = needsFulfiled - needs
                
                if(restFulfilled < -40){
                    coastlines.push(inaccessible_path[empoem.x][empoem.y])
                    possible_coastlines.push(inaccessible_path[empoem.x][empoem.y])
                    if(possible_coastline == null){
                        possible_coastline = inaccessible_path[empoem.x][empoem.y]
                    }
                }
            }
            //sorted_coastlines2 = coastlines.map(a=>[a,coastTownProfit(a.x,a.y,true)/coastTownProfit(a.x,a.y,false)]).filter(a => a[1] >= 1.5).sort((a,b)=>a[1]-b[1]).map(a => a[0])
            sorted_coastlines2 = coastlines.map(a=>[a,portPotential(a.x,a.y,true)]).filter(a => a[1] >= 1).sort((a,b)=>a[1]-b[1]).map(a => a[0])
            if(sorted_coastlines2.length > 0){
                for(var key in dfrou.distmaps){
                    var distmap = dfrou.distmaps[key]
                    
                    if(distmap.hex.dru != kolej && distmap.hex.dru != -1)
                        continue
                        
                    var alreadyDestination = {}
                    var sorted_coastlines_map = {}
                    for(var i in sorted_coastlines2){
                        sorted_coastlines_map[sorted_coastlines2[i].x + '#' + sorted_coastlines2[i].y] = true
                    }
                    var possible_coastlines_map = {}
                    for(var i in possible_coastlines){
                        possible_coastlines_map[possible_coastlines[i].x + '#' + possible_coastlines[i].y] = true
                    }
                    /*
                    if(distmap.hex.undr != kolej && (distmap.hex.units.length > 0 || distmap.hex.z > 0) && distmap.frontline){
                        possible_targets.push(distmap.hex)
                    }*/
                    var totalUnitSize = 0
                    for(var i in distmap.hex.units){
                        var unit = distmap.hex.units[i]
                        
                        if(possible_coastlines_map[distmap.hex.x + '#' + distmap.hex.y] && unit.szyt != 'w' && zast[unit.rodz] == 'm' && unit.il > 50){
                            createCity(unit.id)
                        } else if(zast[unit.rodz] == 'm' && unit.rozb < 10){
                            if(unit.actions.length == 0){
                            
                                var possible_destinations = []
                                
                                var map = distmap.maps['n'].hexmap
                                var mapmapmap = mapmap(map,'hex')

                                for(var k in map){
                                    var field = map[k]
                                    
                                    var code = field.hex.x+'#'+field.hex.y
                                    
                                    if(sorted_coastlines_map[field.hex.x +'#'+ field.hex.y] && field.dist != -1)
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
                                var additil = 0
                                if(distmap.hex.units.length == 0)
                                    additil = 10
                                if(possible_destinations.length > 0 && unit.il >= 55+additil){
                                    var best_dest = possible_destinations.sort((a,b)=>a.dist-b.dist)[0]
                                    
                                    var result = getRuch(mapmapmap,best_dest)
                                    
                                    var ruchk = result.ruchk
                                    var rucho = result.rucho
                                    var epo = embarkingPointFromLeadedPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)

                                
                                    if(epo == null){
                                        var lepa = leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)
                                        var lepakod = lepa[0]+'#'+lepa[1]
                                        
                                        if(!(lepakod in alreadyDestination)){
                                            var action = {type:'move',by:'speculation2',rucho:rucho,ruchk:ruchk,il:unit.il-additil,from:[distmap.hex.x,distmap.hex.y],destination:lepa,somethingAlong:true,leadedPath:getLeadedPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)/*,collisional:isPathCollisional(distmap.hex.x,distmap.hex.y,ruchk,rucho)*/}

                                            unit.actions = [ action ].map(x=>Object.assign(new Object(),x))
                                        }
                                    }
                                }
                            } else if(unit.actions[0].type == 'move') {
                                var lepa = unit.actions[0].destination
                                var lepakod = lepa[0]+'#'+lepa[1]
                                if(!(lepakod in alreadyDestination))
                                    alreadyDestination[lepakod] = 0
                                alreadyDestination[lepakod] += unit.il
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
            aistan = 1.37
        break
        case 1.37:
            /*
            var distmaps = dfrou.distmaps
            
            var destMap = {}
            for(var key in distmaps){
                var distmap = distmaps[key]
                
                destMap[key] = 0
            }
            for(var key in distmaps){
                var distmap = distmaps[key]
            
                //if(!distmap.frontline)
                //    continue
                
                if(distmap.hex.dru != kolej)
                    continue
                    
                for(var j in distmap.hex.units){
                    var unit = distmap.hex.units[j]
                    
                    if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                        var dest = unit.actions[0].destination[0]+'#'+unit.actions[0].destination[1]
                        destMap[dest]++
                    } else if(zast[unit.rodz] != 'x') {
                        destMap[key]++
                    }
                }
            }
            for(var key in distmaps){
                var distmap = distmaps[key]
                //heks[distmap.hex.heks.x][distmap.hex.heks.y].test = destMap[key]
                continue
                if(destMap[key] == 0 && distmap.hex.heks.z > 0 && distmap.hex.dru == kolej){
                    for(var j in distmap.hex.units){
                        var unit = distmap.hex.units[j]
                        
                        if(unit.il > 10 || j == distmap.hex.units.length-1){
                            if(unit.il > 10 && unit.actions.length > 0 && unit.actions[0].type == 'move'){
                                unit.actions[0].il = Math.max(10, unit.actions[0].il-10)
                            } else {
                                unit.actions.length = 0
                            }
                            break
                        }
                    }
                }
                
            }*/
                        
            
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
            for(var key in porządek.perskł){
                if(!ruchy_tratw.includes(porządek.perskł[key])){
                    newDivide = newDivide.concat(porządek.perskł[key].map(x=>Number(x)))
                }
            }
            newDivide = newDivide.reverse()
            
            var rest = []
            for(var i=0;i<ruchwkolejcen;i++){
                if(!ruchy_tratw.includes(ruchwkolejce[i]) && !newDivide.includes(ruchwkolejce[i]))
                    rest.push(Number(ruchwkolejce[i]))
            }

            var restrest = rest.concat(newDivide)
            
            var restfar = []
            var restland = []
            for(var i in restrest){
                if(zas[unix[kolej][ruchwkolejce[i]].rodz] >= 1){
                    restfar.push(restrest[i])
                } else {
                    restland.push(restrest[i])  
                }
            }
            restrest = restfar.concat(restland)
            
            ruchwkolejcen = 0
            ruchwkolejce = []
            for(var i in ruchy_tratw){
                ruchwkolejce.push(ruchy_tratw[i])
                ruchwkolejcen++
            }
            for(var i in restrest){
                ruchwkolejce.push(restrest[i])
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
            for(var k = 0;k<10;k++){
                while(miastkol<mist.length && mist[kolejność_miast[miastkol]].undr==-1)
                    miastkol++;
            
                if(miastkol<mist.length && mist[kolejność_miast[miastkol]].undr==kolej){
                    sellSteelXY(100,mist[kolejność_miast[miastkol]].x,mist[kolejność_miast[miastkol]].y)
                    var v = mist[kolejność_miast[miastkol]].z*(100-mist[kolejność_miast[miastkol]].podatpr);
                    var p = Math.min(mist[kolejność_miast[miastkol]].prod,mist[kolejność_miast[miastkol]].hutn);
                    for(var i = 0;i<mist[kolejność_miast[miastkol]].trybutariuszy;i++){
                        v+=heks[mist[kolejność_miast[miastkol]].trybutariusze[i][0]][mist[kolejność_miast[miastkol]].trybutariusze[i][1]].z;
                    }
                    var okej = -1
                    for(var i = 0;i<mist[kolejność_miast[miastkol]].unp;i++){
                        //if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].ruchy == 0 && unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].celu == -1){
                            okej = i
                        //}
                        if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].rozb > 0){
                            okej = -1
                            break
                        }
                    }
                    //console.log(okej)
                    if(okej == -1){
                        miastkol++
                        continue
                    } else if(unix[kolej][mist[kolejność_miast[miastkol]].unt[mist[kolejność_miast[miastkol]].unp-1]].ruchy != 0 || unix[kolej][mist[kolejność_miast[miastkol]].unt[mist[kolejność_miast[miastkol]].unp-1]].celu != -1) {
                        mist[kolejność_miast[miastkol]].tasuj()
                    }
                    there_is_possible_coastline = false
                    var needed = bloknia[kolej].indexOf(false);		//todo
                    if(needed != -1){
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
                        
                        var lad_needsByTurn = []
                        var morze_needsByTurn = []
                        
                        for(var i = 0;i<MAX_TURNS;i++){
                            lad_needsByTurn[i] = 0
                            morze_needsByTurn[i] = 0
                        }
                        for(var i in dm_lad){
                            var hks = dm_lad[i]
                            
                            if(hks.water > 0 || hks.dist <= 0)
                                continue
                                
                            if(possible_coastline != null){
                                if(hks.hex.heks.x == possible_coastline.x && hks.hex.heks.y == possible_coastline.y){
                                    there_is_possible_coastline = true
                                }
                            }
                            var hdru = hks.hex.d != undefined ? hks.hex.d : hks.hex.dru
                            
                            if(hdru != kolej){
                                if(hks.hex.z > 0){
                                    for(var j = 0;j<MAX_TURNS;j++){
                                        if(hdru != -1){
                                            lad_needsByTurn[j] -= -Number(hks.hex.z / 8 * hks.dist / 2)
                                        }
                                        lad_needsByTurn[j] -= -Math.max(10,Number(hks.hex.z * (1-hks.dist/scian) ))
                                    }
                                }
                                for(var j in hks.hex.units){
                                    var unit = hks.hex.units[j]
                                    
                                    if(zast[unit.rodz] == 'n'){
                                        for(var j = 0;j<MAX_TURNS;j++){
                                            if(j >= hks.dist/szy[unit.rodz]){
                                                lad_needsByTurn[j] -= -Number(evalUnitDefense(unit,unit.il+unit.rozb))
                                            }
                                        }
                                    }
                                }
                                /*
                                for(var j = 0;j<heks[hks.hex.x][hks.hex.y].unp;j++){
                                    var unigz = unix[kolej][heks[hks.hex.x][hks.hex.y].unt[j]]
                                    if(zast[unigz.rodz] == 'm'){
                                        sapper_prod += unigz.il+unigz.rozb
                                    }
                                }*/
                            } else {
                                if(hks.hex.z > 0){
                                    if(hdru != -1){
                                        for(var j = 0;j<MAX_TURNS;j++){
                                            lad_needsByTurn[j] -= Number(hks.hex.z / 8 * hks.dist / 2)
                                        }
                                    }
                                    local_prod += Math.max(10,Number(hks.hex.z * (1-hks.dist/scian) ))
                                }
                                for(var j in hks.hex.units){
                                    var unit = hks.hex.units[j]
                                    
                                    if(zast[unit.rodz] == 'n'){
                                        for(var j = 0;j<MAX_TURNS;j++){
                                            if(j >= hks.dist/szy[unit.rodz]){
                                                lad_needsByTurn[j] -= evalUnitAttack(unit,[{il:unit.il + unit.rozb}])
                                            }
                                        }
                                    } else if(zast[unit.rodz] == 'm'){
                                        if(unit.il+unit.rozb >= 60)
                                            sapper_prod += unit.il+unit.rozb
                                    } else if(zast[unit.rodz] == 'x' && szyt[unit.rodz] == 'w'){
                                        tratwa_needs -= unit.il
                                    }
                                }
                                /*
                                for(var j = 0;j<heks[hks.hex.x][hks.hex.y].unp;j++){
                                    if(zast[unit.rodz] == 'm'){
                                        var unit = unix[kolej][heks[hks.hex.x][hks.hex.y].unt[j]]
                                        if(unit.il+unit.rozb >= 60)
                                            sapper_prod += unit.il+unit.rozb
                                    }
                                }*/
                                for(var j = 0;j<heks[hks.hex.x][hks.hex.y].unp;j++){
                                    var unigz = unix[kolej][heks[hks.hex.x][hks.hex.y].unt[j]]
                                    if(zast[unigz.rodz] == 'm'){
                                        if(unigz.il+unigz.rozb >= 60)
                                            sapper_prod += unigz.il+unigz.rozb
                                    }
                                }
                            }
                            
                        }
                        for(var i in dm_morze){
                            var hks = dm_morze[i]
                            
                            if(hks.dist <= 0 || hks.hex.x == mist[kolejność_miast[miastkol]].x && hks.hex.y == mist[kolejność_miast[miastkol]].y)
                                continue
                            
                            var hdru = hks.hex.d != undefined ? hks.hex.d : hks.hex.dru
                            
                            var kod = hks.hex.x+'#'+hks.hex.y
                            //if(kod in miejsca_do_wysłania_tratw && miejsca_do_wysłania_tratw[kod].needed > miejsca_do_wysłania_tratw[kod].satisfied)
                            //    tratwa_needs += miejsca_do_wysłania_tratw[kod].needed - miejsca_do_wysłania_tratw[kod].satisfied
                            
                            //if(dfrou.distmaps[code])
                            if(hdru != kolej){
                                if(hks.z > 0){
                                    for(var j = 0;j<MAX_TURNS;j++){
                                        if(hdru != -1){
                                            morze_needsByTurn[j] -= -Number(hks.hex.z / 12 * hks.dist / 3)
                                        }
                                        morze_needsByTurn[j] -= -Math.max(10,Number(hks.hex.z * (1-hks.dist/scian) ))
                                    }
                                }
                                for(var j in hks.hex.units){
                                    var unit = hks.hex.units[j]
                                    
                                    if(zast[unit.rodz] == 'n'){
                                        for(var j = 0;j<MAX_TURNS;j++){
                                            if(j >= hks.dist/szy[unit.rodz]){
                                                morze_needsByTurn[j] -= -Number(evalUnitDefense(unit,unit.il+unit.rozb))
                                            }
                                        }
                                    }
                                }
                            } else {
                                if(hks.hex.z > 0){
                                    if(hdru != -1){
                                        for(var j = 0;j<MAX_TURNS;j++){
                                            morze_needsByTurn[j] -= Number(hks.hex.z / 12 * hks.dist / 3)
                                        }
                                    }
                                    //local_prod += Math.max(Number(hks.hex.z * (1-hks.dist/scian) ))
                                }
                                for(var j in hks.hex.units){
                                    var unit = hks.hex.units[j]
                                    
                                    if(zast[unit.rodz] == 'n' && szyt[unit.rodz] == 'w'){
                                        for(var j = 0;j<MAX_TURNS;j++){
                                            if(j >= hks.dist/szy[unit.rodz]){
                                                morze_needsByTurn[j] -= evalUnitAttack(unit,[{il:unit.il + unit.rozb}])
                                            }
                                        }
                                    } else if(zast[unit.rodz] == 'x' && szyt[unit.rodz] == 'w'){
                                        tratwa_needs -= unit.il
                                    } else if(szyt[unit.rodz] != 'w' && szyt[unit.rodz] != 'l' && unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].embarking != null){
                                        tratwa_needs += unit.il
                                    }
                                }
                            }
                        }
                        
                        lad_needs = lad_needsByTurn.reduce((a,b)=>Math.max(a,b),0)
                        morze_needs = morze_needsByTurn.reduce((a,b)=>Math.max(a,b),0)

                        //mist[miastkol].test = Math.floor(lad_needs) + '/' + Math.floor(morze_needs)
                        
                        //console.log(lad_needsByTurn, morze_needsByTurn)
                        
                            
                        if(tratwa_needs > morze_needs*2 && tratwa_needs > 0 && !bloknia[kolej][6])
                            needed = 8
                        
                        if(morze_needs > lad_needs+10 && morze_needs > 0 && !bloknia[kolej][6])
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
                        var enough_units_produced = Math.max(lad_needs,morze_needs) <= local_prod// && miast_dist[kolejność_miast[miastkol]] > 0
                        
                        //var mistkod = mist[kolejność_miast[miastkol]].x+'#'+mist[kolejność_miast[miastkol]].y
                        if(enough_units_produced && possible_coastline != null && there_is_possible_coastline && sapper_prod <= 100 && !bloknia[kolej][11]){
                            //console.log([enough_units_produced,possible_coastline,sapper_prod])
                            needed = 11
                            needednum = 60
                        }
                        
                        //if(!enough_units_produced || needed == 11){
                            var creat = -1;
                            for(var i = 0;i<mist[kolejność_miast[miastkol]].unp;i++){
                                if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].rodz==needed){
                                    if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].il<80)
                                        creat = i;
                                    if(unix[kolej][mist[kolejność_miast[miastkol]].unt[i]].rozb > 0)
                                        creat = i
                                }
                            }
                            if(creat>-1 && unix[kolej][mist[kolejność_miast[miastkol]].unt[creat]].ruchy == 0 && unix[kolej][mist[kolejność_miast[miastkol]].unt[creat]].celu == -1){
                                unix[kolej][mist[kolejność_miast[miastkol]].unt[creat]].rozb=Math.max(needednum-unix[kolej][mist[kolejność_miast[miastkol]].unt[creat]].il, 0);
                            }
                            if(mist[kolejność_miast[miastkol]].unp>=4){
                                
                            } else if(creat==-1/* && mist[kolejność_miast[miastkol]].unp > 0*/ && needed != -1) {
                                dodai(mist[kolejność_miast[miastkol]].x,mist[kolejność_miast[miastkol]].y,0,needed,needednum);
                                odzaz(); 
                            }
                            
                        //}
                        //mist[kolejność_miast[miastkol]].test = String(Math.max(lad_needs,morze_needs)).split('.')[0]+'/'+String(local_prod).split('.')[0]
                    }
                }
                miastkol++;
                if(miastkol>=mist.length){
                    checkedunit = 0;
                    checkedunitstage = 0;
                    aistan = 5;
                    break
                }
            }
            tryRemoveUnnecessaryBuilds(dfrou,kolej)
		break;
		case 5:
			/*checkedunitstage:
				0 - sprawdzenie, czy jest bezpiecznie i czy można wysłać jednostki
				1 - sprawdzanie najbliższych miast, czy da sie atakować
			*/
			while(checkedunit<oddid[kolej] && unix[kolej][checkedunit].kosz)
				checkedunit++;
			if(checkedunit<oddid[kolej] && false /*kek*/){

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

function scoreOfBehinds(dm,color,behind_score){
    var score = 0
    for(var j in dm.distmaps){
        var distmap = dm.distmaps[j]
        var code = distmap.hex.heks.x+'#'+distmap.hex.heks.y
        if(code in behind_score){
            for(var i = 0;i<MAX_TURNS;i++){
                if(distmap.alliegance[i] == color){
                    //console.log(behind_score[code])
                    score += behind_score[code].value * Math.pow(1/2.1,i) 
                }
            }
        }
    }
    return score
}
function hasProblematicUnits(dm,i,j,key){
    if(key in dm.distmaps){
        for(var k in dm.distmaps[key].hex.units){
            var unit = dm.distmaps[key].hex.units[k]
            if(szyt[unit.rodz] == 'l')
                return true
        }
    }
    return false
}
function prepareLargeMapOld(dm,t){
    if(t == undefined)
        t= MAX_TURNS-1
    var large_map = {}
    for(var i = 0;i<scian;i++){
        large_map[i] = {}
        for(var j = 0;j<scian;j++){
            var key = i+'#'+j
            var evalg = key in dm.distmaps ? evalAlliegance(dm,dm.distmaps[key],t) : -1
            var ckolor = evalg != -1 ? evalg : hasProblematicUnits(dm,i,j,key) ? heks[i][j].undr : -1
            large_map[i][j] = {x:i,y:j,color:ckolor,dmap:{},closestelem:[],dist:Infinity,closestenemy:[],distenemy:Infinity}
        }
    }
    
    
    for(var key in dm.distmaps){
        var distmap = dm.distmaps[key]
        
        var dr = evalAlliegance(dm,distmap)//distmap.hex.heks.undr != undefined ? distmap.hex.heks.undr : distmap.hex.heks.dru
        
        //for(var movement_type in distmap.maps){
        var dmap1 = distmap.maps['n'].hexmap.filter(x=>x.dist != -1)
        var dmap2 = 'w' in distmap.maps ? distmap.maps['w'].hexmap.filter(x=>x.dist != -1) : null
        var dmap3 = distmap.maps['n'].rangemap.filter(x=>x.dist != -1)
        var dmap4 = 'w' in distmap.maps ? distmap.maps['w'].rangemap.filter(x=>x.dist != -1) : null

        dmap1.sort((a,b)=>a.dist-b.dist)

        var distproperty = 'objdist'
        for(var i in dmap1){
            var obj = dmap1[i]        
            
            var dkey = obj.hex.x + '#' + obj.hex.y
            
            if(( !(dkey in large_map[distmap.hex.x][distmap.hex.y].dmap) || obj[distproperty] < large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].dist )){
                //if(Math.random()<0.00001)
                //    console.log(obj[distproperty],obj.water,dr,obj.hex.x,obj.hex.y)
                if(!(dkey in large_map[distmap.hex.x][distmap.hex.y].dmap))
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey] = {}
                else {
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].dist = obj[distproperty]
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].water = obj.water
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].color = large_map[obj.hex.x][obj.hex.y].color
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].x = obj.hex.x
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].y = obj.hex.y
                }
                    
                    //{dist:obj[distproperty],water:obj.water,color:,x:obj.hex.x,y:obj.hex.y}
            }
        }
        dmap3.sort((a,b)=>a.dist-b.dist)
        for(var i in dmap3){
            var obj = dmap3[i]        
            
            var dkey = obj.hex.x + '#' + obj.hex.y
            
            if(( !(dkey in large_map[distmap.hex.x][distmap.hex.y].dmap) || obj[distproperty] < large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].dist )){
                large_map[distmap.hex.x][distmap.hex.y].dmap[dkey] = {dist:obj[distproperty],water:0,color:large_map[obj.hex.x][obj.hex.y].color,x:obj.hex.x,y:obj.hex.y}
                
                if(!(dkey in large_map[distmap.hex.x][distmap.hex.y].dmap))
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey] = {}
                else {
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].dist = obj[distproperty]
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].water = 0
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].color = large_map[obj.hex.x][obj.hex.y].color
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].x = obj.hex.x
                    large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].y = obj.hex.y
                }
            }
        }
        if(dmap2 != null){
            dmap2.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap2){
                var obj = dmap2[i]        
                if( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist ){
                    if(key in large_map[obj.hex.x][obj.hex.y].dmap){
                        large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                    } else {
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:obj.water,color:large_map[obj.hex.x][obj.hex.y].color,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                    }
                }
            }
        }
        if(dmap4 != null){
            dmap4.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap4){
                var obj = dmap4[i]        
                if( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist ){
                    if(key in large_map[obj.hex.x][obj.hex.y].dmap){
                        large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                    } else {
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:0,color:large_map[obj.hex.x][obj.hex.y].color,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                    }
                }
            }
        }
    }
    return large_map
}
function clearDict(dict,dontdelete){
    for(var i in dict){
        if(dontdelete)
            dict[i] = undefined
        else
            delete dict[i]
    }
}
function prepareLargeMap(dm,existing,heavy){
    var t = MAX_TURNS-1
    
    var large_map
    if(existing == undefined)
        large_map = {}
    else
        large_map = existing
    for(var i = 0;i<scian;i++){
        if(existing == undefined || !(i in large_map))
            large_map[i] = {}
        for(var j = 0;j<scian;j++){
            //var key = i+'#'+j
            //var ckolor = key in dm.distmaps ? evalAlliegance(dm,dm.distmaps[key],t) : -1//heks[i][j].undr
            //ckolor = heks[i][j].undr
            
            var key = i+'#'+j
            var evalg = key in dm.distmaps ? evalAlliegance(dm,dm.distmaps[key],t) : -1
            var ckolor = evalg != -1 ? evalg : hasProblematicUnits(dm,i,j,key) ? heks[i][j].undr : -1
            if(existing == undefined || !(j in large_map[i]))
                large_map[i][j] = {}
            large_map[i][j].x = i
            large_map[i][j].y = j
            large_map[i][j].color = ckolor
            if(existing == undefined || !('dmap' in large_map[i][j]))
                large_map[i][j].dmap = {}
            else
                clearDict(large_map[i][j].dmap)
            if(existing == undefined || !('closestelem' in large_map[i][j]))
                large_map[i][j].closestelem = []
            else
                large_map[i][j].closestelem.length = 0
                
            large_map[i][j].dist = Infinity
            if(existing == undefined || !('closestenemy' in large_map[i][j]))
                large_map[i][j].closestenemy = []
            else
                large_map[i][j].closestenemy.length = 0
            large_map[i][j].distenemy = Infinity
            large_map[i][j].heavy = heavy
            //{x:i,y:j,color:ckolor,dmap:{},closestelem:[],dist:Infinity,closestenemy:[],distenemy:Infinity,heavy:heavy}
            
        }
    }
    
    
    for(var key in dm.distmaps){
        var distmap = dm.distmaps[key]
        
        
        var dr = evalAlliegance(dm,distmap)//distmap.hex.heks.undr != undefined ? distmap.hex.heks.undr : distmap.hex.heks.dru
        
        var normalny_typ = heavy && ('c' in distmap.maps) ? 'c' : 'n'
        //for(var movement_type in distmap.maps){
        var dmap1 = distmap.maps[normalny_typ].hexmap.filter(x=>x.dist != -1)
        var dmap2 = 'w' in distmap.maps ? distmap.maps['w'].hexmap.filter(x=>x.dist != -1) : null
        var dmap3 = distmap.maps[normalny_typ].rangemap.filter(x=>x.dist != -1)
        var dmap4 = 'w' in distmap.maps ? distmap.maps['w'].rangemap.filter(x=>x.dist != -1) : null
        var dmap5 = 'l' in distmap.maps ? distmap.maps['l'].hexmap.filter(x=>x.dist != -1) : null

        dmap1.sort((a,b)=>a.dist-b.dist)

        var distproperty = 'objdist'
        for(var i in dmap1){
            var obj = dmap1[i]
            
            if(( !(key in large_map[obj.hex.x][obj.hex.y].dmap))){
                //if(distmap.hex.dru == kolej)
                //    heks[obj.hex.x][obj.hex.y].test = obj[distproperty]
                large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:obj.water,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
            } else if(obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist){
                large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
            }
        }
        if(dmap2 != null){
            dmap2.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap2){
                var obj = dmap2[i]        
                if( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist ){
                    if(key in large_map[obj.hex.x][obj.hex.y].dmap){
                        large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                    } else {
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:obj.water,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                    }
                }
            }
        }
        dmap3.sort((a,b)=>a.dist-b.dist)
        for(var i in dmap3){
            var obj = dmap3[i]        
            
            if(( !(key in large_map[obj.hex.x][obj.hex.y].dmap) )){
                //if(distmap.hex.dru == kolej)
                //    heks[obj.hex.x][obj.hex.y].test = obj[distproperty]
                large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:0,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
            } else if(obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist){
                large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
            }
        }
        if(dmap4 != null){
            dmap4.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap4){
                var obj = dmap4[i]        
                if( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist ){
                    if(key in large_map[obj.hex.x][obj.hex.y].dmap){
                        large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                    } else {
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:0,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                    }
                }
            }
        }
        if(dmap5 != null){
            dmap5.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap5){
                var obj = dmap5[i]        
                
                if(( !(key in large_map[obj.hex.x][obj.hex.y].dmap) )){
                    //if(distmap.hex.dru == kolej)
                    //    heks[obj.hex.x][obj.hex.y].test = obj[distproperty]
                    large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:0,color:dr,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                } else if(obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist){
                    large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                }
            }
        }
    }
    return large_map
}
function prepareLargeMapNu(dm,t){
    if(t == undefined)
        t= MAX_TURNS-1
    var large_map = {}
    for(var i = 0;i<scian;i++){
        large_map[i] = {}
        for(var j = 0;j<scian;j++){
            //var key = i+'#'+j
            //var ckolor = key in dm.distmaps ? evalAlliegance(dm,dm.distmaps[key],t) : -1//heks[i][j].undr
            //ckolor = heks[i][j].undr
            
            var key = i+'#'+j
            var evalg = key in dm.distmaps ? evalAlliegance(dm,dm.distmaps[key],t) : -1
            var ckolor = evalg != -1 ? evalg : hasProblematicUnits(dm,i,j,key) ? heks[i][j].undr : -1
            large_map[i][j] = {x:i,y:j,color:ckolor,dmap:{},closestelem:[],dist:Infinity,closestenemy:[],distenemy:Infinity}
        }
    }
    
    
    for(var key in dm.distmaps){
        var distmap = dm.distmaps[key]
        
        
        var dr = evalAlliegance(dm,distmap)//distmap.hex.heks.undr != undefined ? distmap.hex.heks.undr : distmap.hex.heks.dru
        //for(var movement_type in distmap.maps){
        var dmap1 = distmap.maps['n'].hexmap.filter(x=>x.dist != -1)
        var dmap2 = 'w' in distmap.maps ? distmap.maps['w'].hexmap.filter(x=>x.dist != -1) : null
        var dmap3 = distmap.maps['n'].rangemap.filter(x=>x.dist != -1)
        var dmap4 = 'w' in distmap.maps ? distmap.maps['w'].rangemap.filter(x=>x.dist != -1) : null
        var dmap5 = 'l' in distmap.maps ? distmap.maps['l'].hexmap.filter(x=>x.dist != -1) : null


        var distproperty = 'objdist'
        dmap1.sort((a,b)=>a.dist-b.dist)
        for(var i in dmap1){
            var obj = dmap1[i]
            
            var dkey = obj.hex.x + '#' + obj.hex.y
            
            if(( !(dkey in large_map[distmap.hex.x][distmap.hex.y].dmap) || obj[distproperty] < large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].dist)){
                //if(Math.random()<0.00001)
                //    console.log(obj[distproperty],obj.water,dr,obj.hex.x,obj.hex.y)
                large_map[distmap.hex.x][distmap.hex.y].dmap[dkey] = {dist:obj[distproperty],water:obj.water,color:large_map[obj.hex.x][obj.hex.y].color,x:obj.hex.x,y:obj.hex.y}
            }
        }
        dmap3.sort((a,b)=>a.dist-b.dist)
        for(var i in dmap3){
            var obj = dmap3[i]        
            
            var dkey = obj.hex.x + '#' + obj.hex.y
            
            if(( !(dkey in large_map[distmap.hex.x][distmap.hex.y].dmap) || obj[distproperty] < large_map[distmap.hex.x][distmap.hex.y].dmap[dkey].dist )){
                large_map[distmap.hex.x][distmap.hex.y].dmap[dkey] = {dist:obj[distproperty],water:0,color:large_map[obj.hex.x][obj.hex.y].color,x:obj.hex.x,y:obj.hex.y}
            }
        }/*
        if(dmap2 != null){
            dmap2.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap2){
                var obj = dmap2[i]        
                if( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist ){
                    if(key in large_map[obj.hex.x][obj.hex.y].dmap){
                        large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                    } else {
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:obj.water,color:large_map[obj.hex.x][obj.hex.y].color,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                    }
                }
            }
        }
        if(dmap4 != null){
            dmap4.sort((a,b)=>a.dist-b.dist)
            for(var i in dmap4){
                var obj = dmap4[i]        
                if( !(key in large_map[obj.hex.x][obj.hex.y].dmap) || obj[distproperty] < large_map[obj.hex.x][obj.hex.y].dmap[key].dist ){
                    if(key in large_map[obj.hex.x][obj.hex.y].dmap){
                        large_map[obj.hex.x][obj.hex.y].dmap[key].dist = obj[distproperty]
                    } else {
                        large_map[obj.hex.x][obj.hex.y].dmap[key] = {dist:obj[distproperty],water:0,color:large_map[obj.hex.x][obj.hex.y].color,x:distmap.hex.heks.x,y:distmap.hex.heks.y}
                    }
                }
            }
        }*/
    }
    return large_map
}


function calculateStrategicMapForTeam(large_map, dm, color, mod, t){
    if(t == undefined)
        t = MAX_TURNS - 1
    //var nearest_hexes = []
    var other_hexes = []
    var hexes = []
    var behind = {}
    var noonebehind = {}
    for(var key in dm.distmaps){
        var okoks = dm.distmaps[key].hex.heks.z > 0
        if(!okoks)
            for(var j in dm.distmaps[key].hex.units){
                var unit = dm.distmaps[key].hex.units[j]
                if(zast[unit.rodz] != 'x' && zast[unit.rodz] != 'm')
                    okoks = true
            }
        if(okoks){
            var coords = key.split('#')
            var druu = dm.distmaps[key].alliegance[t] 
            if(druu == color && (mod == undefined || !(key in mod) || mod[key] == color) || druu != color && (mod != undefined && key in mod && mod[key] == color)){
                hexes.push(large_map[coords[0]][coords[1]])
                var code = coords[0]+'#'+coords[1]
                noonebehind[code] = Infinity
                behind[key] = {hex:large_map[coords[0]][coords[1]],value:cityscore(dm.distmaps[key].hex.heks)}

            } else {
                other_hexes.push(large_map[coords[0]][coords[1]])
            }
        }
    }
    for(var i = 0;i < hexes.length;i++){
        var ok = true
        var clos = null
        var dist = Infinity
        var d1code = hexes[i].x + '#' + hexes[i].y

        //summedHexValue
        var wysortowane = []
        for(var j = 0;j < other_hexes.length;j++){
            var code = other_hexes[j].x + '#' + other_hexes[j].y
            
            /*if(code in hexes[i].dmap && (clos == null || hexes[i].dmap[code].dist < dist)){
                clos = other_hexes[j]
                dist = hexes[i].dmap[code].dist
            }*/
            if(code in hexes[i].dmap && hexes[i].color != color){
                wysortowane.push({hex:other_hexes[j],dist:hexes[i].dmap[code].dist})
            }
        }
        wysortowane.sort((a,b) => a.dist - b.dist)
        
        var hexDef = summedHexValue(hexes[i].x,hexes[i].y,false)
        var toOvercome = 0
        for(var j in wysortowane){
            toOvercome += summedHexValue(wysortowane[j].hex.x,wysortowane[j].hex.y,true)
            if(toOvercome > hexDef){
                dist = wysortowane[j].dist
                clos = wysortowane[j].hex
                break
            }
        }
        
        //console.log('cl',clos)
        if(clos != null){
            var closcode = clos.x+'#'+clos.y
            var closelem = large_map[clos.x][clos.y]
            for(var j = 0;j < hexes.length;j++){
                if(i != j){                                    
                    if(closcode in hexes[i].dmap && closcode in hexes[j].dmap && hexes[j].x+'#'+hexes[j].y in hexes[i].dmap && hexes[j]){
                        var d2code = hexes[j].x+'#'+hexes[j].y
                        var d1 = hexes[i].dmap[closcode].dist-1//-1 - curr_hexes[j].dmap[closcode].water*2
                        var d2 = hexes[j].dmap[closcode].dist// - curr_hexes[j].dmap[closcode].water*2
                        var d3 = (hexes[i].dmap[hexes[j].x+'#'+hexes[j].y].dist)// - curr_hexes[i].dmap[curr_hexes[j].x+'#'+curr_hexes[j].y].dist*2
                            
                        var condit = d1 >= (d2 + d3)*0.7
                        //console.log([d1,d2,d3])
                        if(d1 > 3 && d2 > 3 && condit){
                            behind[d2code].value += cityscore(heks[hexes[i].x][hexes[i].y].z) /*- d1 / 1000*/// + d2/1000// - d3/10000
                            noonebehind[d1code] = null
                            if(noonebehind[d2code] != null && d2 < noonebehind[d2code]){
                                noonebehind[d2code] = d2
                            }
                            ok = false
                        }
                    }
                }
            }
        }
    }
    /*
    for(var code in noonebehind){        
        //if(noonebehind[code] != null && noonebehind[code] < Infinity)
        //    behind[code] -= noonebehind[code]/1000
    }*/
    
    var totalscore = 0
    for(var code in behind){
        //heks[behind[code].hex.x][behind[code].hex.y].test = behind[code].value
        totalscore += behind[code].value
    }
    return totalscore
}
function summedHexValue(x,y,att){
    var summa = 0
    for(var i = 0;i<heks[x][y].unp;i++){
        var unit = unix[heks[x][y].undr][heks[x][y].unt[i]]
        summa += att ? evalUnitAttack(unit) : evalUnitDefense(unit)
    }
    return summa
}
function prepareDistTable(realSfKeys, farFromFront, allowPaths, dfrou){
    var distmaps = dfrou.distmaps
    
    //realSfKeys.distTable
    
    for(var k in realSfKeys){
        for(var i in realSfKeys[k].distTable){
            
            var build = cityscore(realSfKeys[k].hex)

            for(var j = 0;j<MAX_TURNS;j++){
                realSfKeys[k].distTable[i][j] = 0
            }
        }
    }
    var embarkingCapacity = {}
    
    
    for(var key in distmaps){
        //if(!(interestingAction == undefined || interestingAction.hex.x+'#'+interestingAction.hex.y == key))
        //    continue
        var distmap = distmaps[key]
        var embars = {}
        
        for(var s in distmap.potentialEmbarkings){
            var poe = distmap.potentialEmbarkings[s]
            
            if(!(poe.embarking in embars))
                embars[poe.embarking] = []
            embars[poe.embarking].push(poe)
        }
        
        if(distmap.hex.dru == -1){
            continue
        }
        
        var hex = distmap.hex
        var peoplePotential = hex.heks.z / ced[0]    //produkcja piechoty
        var productionPotential = Math.min(hex.heks.z / ced[1], Math.min(hex.prod / ces[1], hex.hutn / ces[1]))    //produkcja czougów
        /*
        var firepower = 0
        for(var i in distmap.hex.units){
            var unit = distmap.hex.units[i]
            
            if(unit.szyt == szyt[unit.rodz] && zas[unit.rodz] > 1){
                firepower += at[unit.rodz] * unit.il * (zas[unit.rodz]-1)/2
            }
        }*/
    
        for(var i in distmap.hex.units){
            var unit = distmap.hex.units[i]
            
            //if(!(interestingAction == undefined || interestingAction.unit == unit))
            //    continue
                                    
            var attackStrength = evalUnitAttack(unit,undefined,dfrou.model)
            /*
            var realPlace = null
            if(unit.d == kolej){
                if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                    realPlace = {}
                    for(var t = 0;t<MAX_TURNS;t++){
                        var newRuchk = unit.actions[0].ruchk.slice(0,t * zas[unit.rodz])
                        var newRucho = unit.actions[0].rucho.slice(0,t * zas[unit.rodz])
                        var place = leadPath(distmap.hex.x,distmap.hex.y,newRuchk,newRucho)
                        realPlace[t] = place
                    }
                    
                }
            }*/
            /*
            var realDest = null
            if(unit.d == kolej){
                if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                    realDest = unit.actions[0].destination
                }
            }*/
            
            var infantrytime = {}
            var sfkeysToAdd = {}

            var farFromFrontBool = unit.d == kolej
            var mintime = Infinity
            //if(!(unit.d == kolej && unit.actions.length > 0 && unit.actions[0].type == 'move'))
            if(unit.d != kolej)
                for(var la in unit.legalActions){
                    var lac = unit.legalActions[la]
                    if(lac[0].type == 'move' && lac.length == 1 && lac[0].il == unit.il){
                        var lade = lac[0].destination[0]+'#'+lac[0].destination[1]
                        if(lade in realSfKeys){
                            var dist = lac[0].rucho.reduce((a,b)=>a+b,0)
                            
                            var time = Math.ceil(dist/szy[unit.rodz])
                            var time2 = dist/szy[unit.rodz]
                            /*
                            if(realDest != null){
                                time = Math.ceil(distance(realDest[0],realDest[1],lac[0].destination[0],lac[0].destination[1])/szy[unit.rodz])
                                time2 = (distance(realDest[0],realDest[1],lac[0].destination[0],lac[0].destination[1])-Math.max(0,zas[unit.rodz]-1))/szy[unit.rodz]
                            }*/
                            //time = time2

                            if(time < 2) {
                                farFromFrontBool = false
                            }
                            //console.log(distmap.hex.x+'#'+distmap.hex.y,time)
                            if(unit.d == kolej && time > 2){
                                //continue
                            }
                            mintime = Math.min(time2,mintime)
                            if(infantrytime[lade] == null){
                                infantrytime[lade] = Math.ceil(dist/szy[unit.rodz])
                            }
                            for(var t = Math.ceil(time);t<MAX_TURNS;t++){
                                if(!(t in sfkeysToAdd))
                                    sfkeysToAdd[t] = []
                                sfkeysToAdd[t].push(lade)
                            }
                        }
                    }
                }
            var nocapped = false

            var time = 0
            var destx = distmap.hex.x
            var desty = distmap.hex.y
            
            if(unit.d == kolej && unit.actions.length > 0 && unit.actions[0].type == 'move'){
                var lade = unit.actions[0].destination[0]+'#'+unit.actions[0].destination[1]
                var dist = unit.actions[0].rucho.reduce((a,b)=>a+b,0)
                
                time = Math.ceil((dist/*-Math.max(zas[unit.rodz],0)*/)/szy[unit.rodz])
                destx = unit.actions[0].destination[0]
                desty = unit.actions[0].destination[1]

                /*
                if(unit.actions[0].embarking != null){
                    var kod = unit.actions[0].embarking.x+'#'+unit.actions[0].embarking.y
                    //if(kod in embars){
                    //    console.log('a',kod,unit.actions[0].embarking.lastz, embars[kod])
                    //}
                    if(!(kod in embarkingCapacity))
                        embarkingCapacity[kod] = 0
                    //console.log(embarkingCapacity[kod])
                    if(embarkingCapacity[kod] >= 4){
                        //console.log('nocap: ',embarkingCapacity[kod])
                        nocapped = true
                    }
                    embarkingCapacity[kod]++
                    
                }*/
                
                //mintime = Math.min(time,mintime)

                //console.log(time)
                //if(time <= 2){
                    //if(!nocapped)
                    for(var ld in realSfKeys){
                        
                        var disttotown = distance(destx, desty, realSfKeys[ld].hex.x, realSfKeys[ld].hex.y)

                        /*
                        if((disttotown-Math.max(0,zas[unit.rodz]-1))/szy[unit.rodz] > 2){
                            continue
                        }*/
                        //console.log('disttotown:',disttotown,(disttotown-Math.max(0,zas[unit.rodz]-1))/szy[unit.rodz])
                        if((disttotown-Math.max(0,zas[unit.rodz]))/szy[unit.rodz] <= 2){
                        
                            var ndist = dist + disttotown
                            /*
                            if(infantrytime[ld] == null){
                                infantrytime[ld] = Math.ceil(ndist/szy[unit.rodz])
                            } else {
                                infantrytime[ld] = Math.min(infantrytime[ld], Math.ceil(ndist/szy[unit.rodz]))
                            }*/
                            for(var t = Math.ceil(time);t<MAX_TURNS;t++){
                                if(!(t in sfkeysToAdd))
                                    sfkeysToAdd[t] = []
                                sfkeysToAdd[t].push(ld)
                            }
                        }
                    }
                //}
            }
            if(unit.d == kolej && (farFromFrontBool)){
                farFromFront.push({code:key,unitIx:i,time:mintime,il:unit.il})
                if(unit.il > 50)
                    farFromFront.push({code:key,unitIx:i,time:mintime,il:unit.il-10})
            }
            if(unit.d != kolej || !nocapped)
            for(var t in sfkeysToAdd){
                var len = sfkeysToAdd[t].length
                for(var la in sfkeysToAdd[t]){
                    var lade = sfkeysToAdd[t][la]
                    realSfKeys[lade].distTable[unit.d][t] -= -attackStrength / len
                }
            }
            /*
            
            //cityscore
            if(key in realSfKeys){
                for(var t = 1;t<MAX_TURNS;t++){
                    if(unit.actions.length == 0 || unit.actions[0].type != 'move')
                        realSfKeys[key].distTable[unit.d][t] -= -attackStrength
                }
                if(infantrytime[key] != null){
                    var build = cityscore(heks[distmap.hex.x][distmap.hex.y])
                    for(var t = infantrytime[key];t<MAX_TURNS;t++){
                        //realSfKeys[key].distTable[unit.d][t] -= -build * (t-infantrytime[key]+1)
                    }
                }
            }*/
        }
    }
    var sumOfZskor = 0
    var zskors = []
    for(var k in realSfKeys){
        var t = MAX_TURNS-1
        var maxPlayer = -1
        var maxPlayerScore = 0
        var secondMaxPlayer = -1
        var secondMaxPlayerScore = 0
        var kolejPlayeScore = 0
        
        for(var t = 0;t<MAX_TURNS;t++){
            kolejPlayeScore += realSfKeys[k].distTable[kolej][t] / Math.pow(2.1,t)
        }
        for(var i in realSfKeys[k].distTable){
            var scor = 0
            for(var t = 0;t<MAX_TURNS;t++){
                scor += realSfKeys[k].distTable[i][t] / Math.pow(2.1,t)
            }
            
            if(scor > maxPlayerScore){
                secondMaxPlayer = maxPlayer
                secondMaxPlayerScore = maxPlayerScore

                maxPlayer = i
                maxPlayerScore = scor
            } else if(scor > secondMaxPlayerScore && scor < maxPlayerScore){
                secondMaxPlayer = i
                secondMaxPlayerScore = scor
            }
        }
        var zskor = 0
        if(maxPlayer != -1){
            if(maxPlayer != kolej){
                zskor = kolejPlayeScore - maxPlayerScore

                //zskor = -zskor
            } else {
                zskor = maxPlayerScore - secondMaxPlayerScore
            }
        }
        realSfKeys[k].maxPlayer = maxPlayer
        realSfKeys[k].maxPlayerScore = zskor
        //heks[realSfKeys[k].hex.x][realSfKeys[k].hex.y].test = zskor
        
        sumOfZskor -= -zskor
        zskors.push(zskor)
    }
    var minzskor = zskors.reduce((a,b)=>Math.min(a,b),Infinity)
    return sumOfZskor
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
function getEmbarkingTargets(dm,color){
    var embarkingMap = {}
    
    for(var key in dm.distmaps){
        if(dm.distmaps[key].hex.dru == color){
            for(var i in dm.distmaps[key].hex.units){
                var unit = dm.distmaps[key].hex.units[i]
                
                if(szyt[unit.rodz] == 'w' && zast[unit.rodz] == 'x'){
                    if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                        var code = unit.actions[0].destination[0]+'#'+unit.actions[0].destination[1]
                        
                        
                        if(!(code in embarkingMap))
                            embarkingMap[code] = 0
                        embarkingMap[code]++
                        
                    } else {
                        if(!(key in embarkingMap))
                            embarkingMap[key] = 0
                        embarkingMap[key]++
                    }
                }
            }
        }
    }
    return embarkingMap
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
        odzaznaj(false)
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
		odzaznaj(false);
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
    return hexdistmap.map( x => new Object({ hex: hekstable[x.hex.x][x.hex.y], dist: x.dist, objdist: x.objdist, water : x.water, from: x.from === null ? null : hekstable[x.from.x][x.from.y], embarking: x.embarking }))
}
function copyHexrangemap(hexrangemap,hekstable){
    //{ hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  }
    return hexrangemap.map( x => new Object({ hex: hekstable[x.hex.x][x.hex.y], dist: x.dist, objdist: x.objdist}))
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
                if(h != null && (h.x == undefined || not_outside_board(h)) && !(h.x+','+h.y in thex) && (h.z == -1 || h.z>0 && h.unp < 4) && (true || h.undr != undefined && h.undr != kolej || h.dru != undefined && h.dru != kolej)){
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

function hexdistmap(x,y,water,mountain,air,heavy,transporting,bridgemaking,hekstable){
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
            checkedGrid[i][j] = {dist:-1,objdist:-1,water:startwater,range:-1,from:null,embarking:0}
            
        }
    }
    checkedGrid[x][y].dist = 0
    checkedGrid[x][y].objdist = 0
    
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
                    
                    var unp_to = hexto.units ? hexto.units.filter(x=>x.actions.length == 0 || x.actions[0].type == 'move' && (x.actions[0].ruchk[0]-j+6)%6 == 3).length : hexto.unp
                    var unp_from = hexfrom.units ? hexfrom.units.filter(x=>x.actions.length == 0 || x.actions[0].type == 'move' && (x.actions[0].ruchk[0]-j+6)%6 == 3).length : hexfrom.unp
                    
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
                    
                    var dru_to = hexto.dru != undefined ? hexto.dru : hexto.undr
                    var dru_from = hexfrom.dru != undefined ? hexfrom.dru : hexfrom.undr
                    
                    if(air){
                        if(unp_to == 4 && (dru_to == (checkedGrid[x][y].dru != undefined ? checkedGrid[x][y].dru : checkedGrid[x][y].undr) || dru_to == kolej)){
                            continue
                        }
                    } else if(water){
                        step = 0.8
                        if(hexto.z == -2 || hexto.z == 0)
                            continue
                            
                        if(transporting && dru_to != -1 && dru_to != kolej){
                            continue
                        }
                        
                        //console.log('g1', unp_to , unp_from, dru_to, (hekstable[x][y].dru != undefined ? hekstable[x][y].dru : hekstable[x][y].undr))
                        //console.log('g2', dru_to,hekstable[x][y], (hekstable[x][y].dru != undefined ? hekstable[x][y].dru : hekstable[x][y].undr), dru_to == kolej)
                        if(unp_to >= 3 && unp_from <= 3 && dru_to == (hekstable[x][y].dru != undefined ? hekstable[x][y].dru : hekstable[x][y].undr)/* && checkedGrid[x][y] != -1*/){
                            step *= 10
                        }
                        if(unp_to == 4 && (dru_to == (hekstable[x][y].dru != undefined ? hekstable[x][y].dru : hekstable[x][y].undr) || dru_to == kolej)){
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
                                    pluswater = 3
                                //}
                            } else if(hexfrom.z != -1){
                                //if(wieltratw > 0){
                                //    pluswater = 1
                                //} else {
                                if(checkedGrid[hexto.x][hexto.y].embarking > 0){
                                    pluswater = 3
                                    step += 5
                                } else if(bridgemaking) {
                                    step *= 2
                                } else {
                                    continue
                                }
                                //}
                            }
                        }
                        if(hexto.z != -1 && dru_to != -1 && dru_to != kolej && hexfrom.z == -1 && transporting){
                            step *= 3
                        }
                        //if(hexfrom.z == -1 && dru_to != -1 && dru_to != kolej)
                        //    continue
                        if(unp_to > 3 && unp_from <= 4 && dru_to == kolej/* && checkedGrid[x][y] != -1*/){
                            step *= 10
                        }
                        if(unp_to == 4 && dru_to == kolej){
                            continue
                        }
                    }
                    if(checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist + step + pluswater*2){
                        var dist = checkedGrid[hexfrom.x][hexfrom.y].dist + step + pluswater*2
                        var waterdist = checkedGrid[hexfrom.x][hexfrom.y].water + pluswater
                        var objdist = checkedGrid[hexfrom.x][hexfrom.y].objdist - (-1)
                        
                        if(checkedGrid[hexfrom.x][hexfrom.y].from != undefined && hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y] != undefined && checkedGrid[hexfrom.x][hexfrom.y].from.x == hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y].x && checkedGrid[hexfrom.x][hexfrom.y].from.y == hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y].y)
                            continue
                            
                        //console.log(dist)
                        tocheck2.push(tocheck[i].border[j])
                        //checkedList.push( { hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  } )
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist = dist
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water = waterdist
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].from = hexfrom
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].objdist = objdist
                        
                        //heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = dist

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
            checkedList.push( { hex: hekstable[i][j], dist: checkedGrid[i][j].dist, objdist: checkedGrid[i][j].objdist, water : checkedGrid[i][j].water, from: checkedGrid[i][j].from, embarking: checkedGrid[i][j].embarking} )
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
                
                checkedList.push({ hex: _hex, dist: dist, objdist: dist })
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
    var hekks = heks[hex.x][hex.y]
    if(hekks.z <= 0)
        return 0
    return hekks.z + (hekks.hutn + hekks.prod) * 2
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
        var nmiasta = miasta.map(m=>[hexdistmap(m.x,m.y,false,false,false,false,false,false).filter(x=>x.dist <= 2*l),m]).map(([distmap,m])=>[distmap,m,distmap.map(x=>cityscore(x.hex)).reduce((a,b)=>a+b,0)]).sort((a,b)=>-a[2]+b[2])
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

function putPath(uni, distmap, hex_x, hex_y, stopBefore, completely_used_passages){
    //szyt = ["n","c","c","n","g","c","w","w","w","l","l","n"];
    //zast = ["n","n","n","n","n","p","n","n","x","l","x","m"];

    if(!(uni in unix[kolej]))
        return// null
        
    var unit = unix[kolej][uni]
    unit.rozb = 0
    
    szybt = szyt[unit.rodz]
    if(szybt == 'w' && zast[unit.rodz] == 'x')
        szybt == 'x'
    
    if(szybt == 'n' && zast[unit.rodz] == 'm')
        szybt == 'm'
        
    if(!(szybt in distmap.maps))
        szybt = 'n'
    var unitDistMap = distmap.maps[szybt].hexmap//hexdistmap(unit.x,unit.y,szyt[unit.rodz] == 'w',szyt[unit.rodz] == 'g',szyt[unit.rodz] == 'l',szyt[unit.rodz] == 'c',zast[unit.rodz] == 'x',zast[unit.rodz] == 'm')
    
    var heksk = unitDistMap.filter(a => a.hex.x == hex_x && a.hex.y == hex_y)
    if(heksk.length == 0)
        return// null
        
        
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
        aktdroguj(kolej,zaznu)
        unit.sebix = unit.x
        unit.sebiy = unit.y
        zaznu = -1
        /*
        zaznx = -1
        zazny = -1
        tx = -1
        ty = -1*/
    }
        
    unix[kolej][uni].sebix = unix[kolej][uni].x
    unix[kolej][uni].sebiy = unix[kolej][uni].y
    tx = -1
    ty = -1
    zaznu = -1
    zaznu = uni
    zaznaj(uni,false)
    odceluj(uni,kolej);
    oddroguj(uni,kolej,false);
    for(var i in path){
        if(i >= path.length - stopBefore){
            break
        }
        var p = path[i]
        unix[kolej][uni].rozb = 0
        
        droguj(p.x,p.y,uni)
        zaznaj(uni,false)
    }
    if(stopBefore == undefined){
    }
    
    return path.length > 0 && unit.szyt != 'w' && unit.szyt != 'l' && heks[unit.x][unit.y].z > 0 && heks[path[0].x][path[0].y].z == -1// && !(path[0].x+'#'+path[0].y in completely_used_passages)
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
    constructor(unit){
        super(['d','il','id','rodz','ata','atakt','celd','celu','ruchk','ruchy','rucho','zalad','rozb','kolor','szy','szyt','atakt'])
        
        this.unit = unit
        this.setFields(this.getFields(unit))
    }
}
function newUnitAction(unit,hex){
    var newunit = new UnitAction(unit)
    
    newunit.actions = []   //np. {type:'przenies',size:'10',x:4,y:6}
    newunit.legalActions = []
    if(unit.actions != undefined){
        newunit.actions = unit.actions.map(dict => copyDict(dict))
        newunit.legalActions = unit.legalActions.map(array => array.map(dict => copyDict(dict)))
    } else {
        if(newunit.ruchy > 0){
            var rucho = newunit.rucho.slice(0,newunit.ruchy)
            var ruchk = newunit.ruchk.slice(0,newunit.ruchy)
            newunit.actions.push({type:'move',by:'real',rucho:rucho,ruchk:ruchk,il:unit.il,from:[hex.x,hex.y],destination:leadPath(hex.x,hex.y,ruchk,rucho),embarking:embarkingPointFromLeadedPath(hex.x,hex.y,ruchk,rucho),somethingAlong:thereIsSomethingAlongThePath(hex.x,hex.y,ruchk,rucho),distant:false,leadedPath:getLeadedPath(hex.x,hex.y,ruchk,rucho)/*,collisional:isPathCollisional(hex.x,hex.y,ruchk,rucho)*/})
        }
        if(newunit.celu != -1 && newunit.celd in unix){
            var aimedunit = unix[newunit.celd][newunit.celu]
            newunit.actions.push({type:'aim',by:'real',celu:newunit.celu,celd:newunit.celd,hex_x:aimedunit.x,hex_y:aimedunit.y,kolor:newunit.kolor,distant:false})
        }
        if(newunit.rozb > 0){
            newunit.actions.push({type:'build',by:'real',size:newunit.rozb,distant:false})
        }
        
    }
    return newunit
}
function copyUnitAction(unitaction,hex){
    var newunitaction = new UnitAction(unitaction.unit,hex)
    
    newunitaction.actions = unitaction.actions.slice()
    newunitaction.legalActions = unitaction.legalActions
    return newunitaction
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
function isPathCollisional(x,y,ruchk,rucho,stopBefore){
    //return true
    var he = heks[x][y]
    var undr = he.undr
    if(stopBefore == undefined)
        stopBefore = 0
    for(var i in ruchk){
        if(i >= ruchk.length-stopBefore)
            break
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(collisional(he))
                return true
            if(he == undefined)
                return false
        }
    }
    if(heks[he.x][he.y].z > 0 || collisional(he,undr))
        return true
    return false
}
function collisional(he,undr){
    var result = heks[he.x][he.y].unp > 0 && heks[he.x][he.y].undr != undr && heks[he.x][he.y].undr != -1
    return result
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
function thereIsSomethingAlongThePath(x,y,ruchk,rucho,stopBefore){    
    var kol1 = heks[x][y].undr
    var he = heks[x][y]
    if(stopBefore == undefined)
        stopBefore = 0
    for(var i in ruchk){
        if(i >= ruchk.length-stopBefore)
            break
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                return false
            if(he.undr != -1 && he.undr != kol1){
                return true
            }
            if(he.unp>= 4){
                return true
            }
        }
    }
    if(he.z >= 1)
        return true
    return false
}
function embarkingPointFromLeadedPath(x,y,ruchk,rucho,stopBefore){
    var he = heks[x][y]
    var last = he
    if(he.z == -1)
        return null
    if(stopBefore == undefined)
        stopBefore = 0
    for(var i in ruchk){
        if(i >= ruchk.length-stopBefore)
            break
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            
            if(he.undr != kolej && he.undr != -1)
                return null
            if(he == undefined)
                return undefined
        }
        if(he.z == -1)
            return {x:he.x,y:he.y,last:last,lastz:last.z}
        last = he
    }
    return null
}
function pathIsThroughCrowdedCity(dm,x,y,ruchk,rucho,unitAttackStrength,unit){
//    return false
    var he = heks[x][y]
    for(var i=0;i<ruchk.length;i++){
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                break
            
            var str = he.x+'#'+he.y
            if(i > 0 && i <= ruchk.length-1 && (he.dru != undefined && he.dru == kolej || he.d != undefined && he.d == kolej) && (dm != undefined && str in dm.distmaps && dm.distmaps[str].hex.units.length == 4 || dm == undefined && heks[he.x][he.y].unp >= 4)){
                return true
            }
            //if(zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm')
            //    console.log([he.dru,unit.d])
            if(unit != undefined && (zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm') && heks[he.x][he.y].undr != unit.d && heks[he.x][he.y].undr != -1 && heks[he.x][he.y].unp > 0){
                console.log('usuń!')
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
                this.units.push(copyUnitAction(unit,this.heks))
            }
            //this.border = oldheks.border.slice().map(x=>x == null ? null : x.slice())
        } else {
            this.setFields(this.getFields(this.heks))
            for(var i = 0;i<this.heks.unp;i++){
                var unit = unix[this.heks.undr][this.heks.unt[i]]
                if(unit.x == -1)
                    continue
                this.units.push(newUnitAction(unit,this.heks))
            }
            //this.border = this.heks.border.map(x=>x == null ? null : [x.x,x.y])
        }
    }
    selfCopy(){
        
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
            if(board[i][j].units.length > 0){
                newBoard[i][j] = new BoardHex(i,j,board[i][j])
            } else {
                newBoard[i][j] = board[i][j]
            }
            /*var units = newBoard[i][j].units
            for(var k in units){
                units[k].legalActions = board[i][j].units[k].legalActions
                units[k].actions = board[i][j].units[k].actions
            }*/
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
    
    //var backup = getScoresAndAlliegances(dm)
    
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
        var code = coord[0]+'#'+coord[1]    //distmap:key, dru:unit.d, embarking:hexkey, unitIndex:j, turn:turn, move:move
        newDistmaps[code] = {maps:{}, hex:bhex, potentialEmbarkings:dm.distmaps[code].potentialEmbarkings, realtocome:[], defence:[],alliegance:allTurns(),fromenemy:allMoves(),fromally:allMoves(),frontline:false}

        for(var szybt in distmaps[code].maps){
            //var unit = bhex.units[j]
            //var szybt = szyt[unit.rodz]
            //if(!(szybt in newDistmaps[code].maps)){
                newDistmaps[code].maps[szybt] = {hexmap:/*copyHexdistmap(distmaps[code].maps[szybt].hexmap,board)*/distmaps[code].maps[szybt].hexmap, rangemap:/*copyHexrangemap(distmaps[code].maps[szybt].rangemap,board)*/distmaps[code].maps[szybt].rangemap,hexmapmap:distmaps[code].maps[szybt].hexmapmap,rangemapmap:distmaps[code].maps[szybt].rangemapmap}    
                /*
                for(var ks in newDistmaps[code].maps[szybt].hexmap){
                    
                    
                    if(newDistmaps[code].maps[szybt].hexmap[ks].water > 0){
                        alert('a')
                        console.log(newDistmaps[code].maps[szybt].hexmap[ks])
                    }
                }*/

                //console.log(newDistmaps[code].maps[szybt].hexmap.filter(x=>x.embarking > 0).length)
                //{hexmap:hexdistmap(bhex.x,bhex.y,szybt == 'w',szybt == 'g',szybt == 'l',szybt == 'c',board)}
            //}
        }
    }
    //setScoresAndAlliegances(dm,backup)
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
        distmaps[code] = {maps:{}, hex:bhex, potentialEmbarkings:[], realtocome:[], defence:[],alliegance:allTurns(),fromenemy:allMoves(),fromally:allMoves(),frontline:false}
        for(var j in bhex.units){
            var unit = bhex.units[j]
            var szybt = szyt[unit.rodz]
            var szybtorig = szyt[unit.rodz]
            if(szybt == 'w' && zast[unit.rodz] == 'x')
                szybt = 'x'
            
            if(szybt == 'n' && zast[unit.rodz] == 'm')
                szybt = 'm'
            
            if(!(szybt in distmaps[code])){
                distmaps[code].maps[szybt] = {hexmap:hexdistmap(bhex.x,bhex.y,szybt == 'w' || szybt == 'x',szybt == 'g',szybt == 'l',szybt == 'c',szybt == 'x',szybt == 'm',board),rangemap:hexrangemap(bhex.x,bhex.y,szybt == 'w' || szybt == 'x',szybt == 'g',szybt == 'l',szybt == 'c',board)}
                //distmaps[code].maps[szybt].hexmapmap = mapmap(distmaps[code].maps[szybt].hexmap,'hex')
                //distmaps[code].maps[szybt].rangemapmap = mapmap(distmaps[code].maps[szybt].rangemap,'hex')

            }
            
        }
        
        if(!('w' in distmaps[code].maps) && (heks[coord[0]][coord[1]].z == -1 || heks[coord[0]][coord[1]].z > 0)){
            distmaps[code].maps['w'] = {hexmap:hexdistmap(bhex.x,bhex.y,true,false,false,false,false,false,board),rangemap:hexrangemap(bhex.x,bhex.y,true,false,false,false,board)}
            //distmaps[code].maps['w'].hexmapmap = mapmap(distmaps[code].maps['w'].hexmap,'hex')
            //distmaps[code].maps['w'].rangemapmap = mapmap(distmaps[code].maps['w'].rangemap,'hex')
        }
        if(!('n' in distmaps[code].maps)){
            distmaps[code].maps['n'] = {hexmap:hexdistmap(bhex.x,bhex.y,false,false,false,false,false,false,board),rangemap:hexrangemap(bhex.x,bhex.y,false,false,false,false,board)}
            //distmaps[code].maps['n'].hexmapmap = mapmap(distmaps[code].maps['n'].hexmap,'hex')
            //distmaps[code].maps['n'].rangemapmap = mapmap(distmaps[code].maps['n'].rangemap,'hex')
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
    for(var i in hexesWithUnits){
        var coord = hexesWithUnits[i]
        var bhex = board[coord[0]][coord[1]]
        var code = coord[0]+'#'+coord[1]
        //distmaps[code] = {maps:{}, hex:bhex, potentialEmbarkings:[], realtocome:[], defence:[],alliegance:allTurns(),fromenemy:allMoves(),fromally:allMoves(),frontline:false}
        for(var szybt in distmaps[code].maps){
            distmaps[code].maps[szybt].hexmapmap = mapmap(distmaps[code].maps[szybt].hexmap,'hex')
            distmaps[code].maps[szybt].rangemapmap = mapmap(distmaps[code].maps[szybt].rangemap,'hex')
        }
    }
    /*
    for(var code in distmaps){
        var distmap = distmaps[code]
        if('n' in distmaps[code].maps && 'w' in distmaps[code].maps){
            for(var key in distmaps[code].maps['n'].hexmap){
                var hex = distmaps[code].maps['n'].hexmap[key]
                
                if((hex.hex.z == -1 || hex.hex.z > 0) && (hex.hex.dru == kolej || hex.hex.dru == -1) && hex.water <= 1){
                    for(var i in hex.hex.units){
                        var unit = hex.hex.units[i]
                        
                        var cod = hex.hex.x+'#'+hex.hex.y
                        
                        if(szyt[unit.rodz] == 'w' && zast[unit.rodz] == 'x'){
                            if(!(cod in distmap.potentialEmbarkings))
                                distmap.potentialEmbarkings[cod] = 0
                            distmap.potentialEmbarkings[cod] += unit.il
                        }
                    }
                }
                //if(Object.values(distmap.potentialEmbarkings).length > 0){
                //    console.log(distmap.potentialEmbarkings)
                //}
            }
        }
    }*/
    
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
function allColorTables(){
    var result = {}
    
    for(var i = 0;i<12;i++){
        result[i] = {}
    }
    return result
}
szytisn = {szyt:'n'}
function evalUnitAttack(unit,actions,model,oneaction,path){
    var il = unit.il
    var thisaction = oneaction || actions == undefined ? actions : actions[0]
    if(actions != undefined && (oneaction || actions.length > 0) && thisaction.il != undefined)
        il = thisaction.il
        
    var terrainFactor = 1
    if(actions != undefined && (oneaction || actions.length > 0) && thisaction.type == 'move'){
        var origHex,destHex
        if(path != undefined && zas[unit.rodz] > 1 && unit.actions.length - zas[unit.rodz] > path.path.length){
            origHex = model.board[path.path[unit.actions.length - zas[unit.rodz]].x][path.path[unit.actions.length - zas[unit.rodz]].y]
            destHex = model.board[thisaction.destination[0]][thisaction.destination[1]]
        } else {
            origHex = model.board[thisaction.from[0]][thisaction.from[1]]
            destHex = model.board[thisaction.destination[0]][thisaction.destination[1]]
        }
        
        terrainFactor = ataz2(unit,szytisn,origHex,destHex,"a")
    }
    
    var fromFar = 1
    if(actions != undefined && !oneaction && actions[actions.length-1].type == 'aim' && (zast[unit.rodz] == 'n' || zast[unit.rodz] == 'l') && zas[unit.rodz] > 1){
        fromFar = 1.1
    }
    return fromFar * at[unit.rodz] * (0.5+obrr[unit.rodz]) /** exponentiel(unit.il)*/ * unit.il * terrainFactor
}
function evalUnitDefense(unit,il){
    if(il == undefined)
        il = unit.il
    return (at[unit.rodz]+0.001) * (0.5+obrr[unit.rodz] /** Math.pow(1.4,zas[unit.rodz])*/) * exponentiel(il)
}
MAX_TURNS = 10
MAX_PLAYERS = 12
SMALL_FRACTION = 0.0000001
function allTurns(){
    var tr = []
    for(var i = 0;i<MAX_TURNS;i++){
        tr.push(-1)
    }
    return tr
}
function evaluate(dm,embarkingTargets,alreadyAttacking){   //{unit:unit, action:bestAction[dest_code], hex:distmap.hex}
    var distmaps = dm.distmaps
    var codedest = undefined
    //if(interestingAction != undefined && interestingAction.action.destination != undefined){
    //    codedest = interestingAction.action.destination[0]+'#'+interestingAction.action.destination[1]
    //}
    for(var key in distmaps){
        //if(interestingAction != undefined && !(interestingAction.hex.x+'#'+interestingAction.hex.y == key) && !(codedest != undefined && key == codedest))
        //    continue
            
        if(alreadyAttacking != null && !(key in alreadyAttacking))
            continue
            
        if(distmaps[key].realtocome == null || distmaps[key].realtocome.length == 0){
            distmaps[key].realtocome = []
            //distmaps[key].defence = []
            for(var t = 0;t<MAX_TURNS;t++){
                distmaps[key].realtocome.push(allColors())
                //distmaps[key].defence.push(allColors())
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

                    distmaps[key].realtocome[t][i] = 0
                    //distmaps[key].defence[t][i] = 0
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
    //for(var t = 0;t<MAX_TURNS;t++){
    
    //var leadedPaths = [null,null,null,null]
        for(var key in distmaps){
            //if(!(interestingAction == undefined || interestingAction.hex.x+'#'+interestingAction.hex.y == key))
            //    continue
            
            if(alreadyAttacking != null && !(key in alreadyAttacking))
                continue
                
            var distmap = distmaps[key]
            
            if(distmap.dru == -1)
                continue
            var hex = distmap.hex.heks
            if(hex.z <= 0)
                continue
                
            var peoplePotential = hex.z / ced[0]    //produkcja piechoty
            var productionPotential = Math.min(hex.z / ced[1], Math.min(hex.prod / ces[1], hex.hutn / ces[1]))    //produkcja czougów
            
            var maxdef = Math.max(peoplePotential, productionPotential * 4)// + firepower
        
            var hasdefense = false
            for(var i in distmap.hex.units){
                var unit = distmap.hex.units[i]
                
                  
                if(unit.actions > 0 && unit.actions[0].type == 'move' && unit.actions[0].il >= unit.il)
                    continue
                    
                  
                hasdefense = true
                break
                //var unitAttackStrength = evalUnitAttack(unit,undefined,dm.model)
                //var unitDefenseStrength = evalUnitDefense(unit)
            }
            if(hasdefense){
                var st = 2
                var jejgo = 1
                for(var t = 0;t<MAX_TURNS;t++){
                        var moje = distmap.realtocome[t][distmap.hex.dru]
                        var jestmoje = moje > 0
                        
                        var on = -1
                        var jego = 0
                        
                        for(var k = 0;k<12;k++){
                            if(k!=distmap.hex.dru){
                                if(distmap.realtocome[t][k] > moje && (on == -1 || distmap.realtocome[t][k] > jego)){
                                    on = k
                                    jego = distmap.realtocome[t][k]
                                    jestmoje = false
                                }
                            }
                        }
                        st += jestmoje ? 1 : 0
                        jejgo += jestmoje ? 0 : 1
                        //if(on == -1)
                            distmap.realtocome[t][distmap.hex.dru] -= -maxdef * st
                            //distmap.defence[t][distmap.hex.dru] -= -maxdef * st

                        //else
                            //distmap.defence[t][on] -= -maxdef * jejgo
                     
                        
                    //distmap.defence[t][unit.d] = Math.min(distmap.defence[t][unit.d], 99*8)
                }
            }
                
                
        }
        

        
        //calculateAlliegance(dm)
        
        var embapo = 0
        var bembapo = 0
        if(false)
        if(window.embapot == undefined){
            embapot = {}
            addedembapo = {}
            embars = {}
        } else {
            clearDict(embapot,true)
            clearDict(addedembapo,true)
            clearDict(embars,true)
        }
        for(var ownunit=false,b2=false;!b2;(b2=ownunit) | (ownunit=true)){
            for(var key in distmaps){
                //if(!(interestingAction == undefined || interestingAction.hex.x+'#'+interestingAction.hex.y == key))
                //    continue
                if(alreadyAttacking != null && !(key in alreadyAttacking))
                    continue

                var distmap = distmaps[key]
                if(distmap.dru == -1 || (ownunit && distmap.dru != kolej) || (!ownunit && distmap.dru == kolej)){
                    continue
                }
                /*
                for(var s in embars){
                    delete embars[s]
                }
                
                for(var s in distmap.potentialEmbarkings){
                    var poe = distmap.potentialEmbarkings[s]
                    
                    embars[poe.embarking] = poe
                }*/
                var notownunit = !ownunit
                
                
                var hex = distmap.hex
                var peoplePotential = hex.z / ced[0]    //produkcja piechoty
                var productionPotential = Math.min(hex.z / ced[1], Math.min(hex.prod / ces[1], hex.hutn / ces[1]))    //produkcja czougów
                /*
                var firepower = 0
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    if(unit.szyt == szyt[unit.rodz] && zas[unit.rodz] > 1){
                        firepower += at[unit.rodz] * unit.il * (zas[unit.rodz]-1)/2
                    }
                }*/
                var maxdef = Math.max(peoplePotential, productionPotential * 4)// + firepower
            
                /*
                if(!ownunit && false)
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    if(alreadyAttacking != undefined && !(key in alreadyAttacking && alreadyAttacking[key].unit == unit))
                        continue
                        
                    if(unit.actions.length > 0){
                        for(var j in unit.actions){
                            var action = unit.actions[j]
                            if(action.type == 'move' && action.destination != undefined && zast[unit.rodz] != 'x'){
                                var dist = action.rucho.reduce((a,b)=>a+b,0)
                                
                                var path = action.leadedPath
                                //leadedPaths[j] = path
                                var losses = 0
                                
                                var embarkingDelay = 0
                                var onland = hex.z != -1
                                var embarkingPossible = 0
                                var lastFieldX = distmap.hex.x
                                var lastFieldY = distmap.hex.y
                                var addEmbarkingPossibility = false
                                var embarkingOnPlace = false
                                
                                for(var k=0;k<path.path.length-1;k++){
                                    
                                    var field = path.path[k]
                                    var code2 = field.x+'#'+field.y
                                    
                                    addEmbarkingPossibility = false
                                    embarkingOnPlace = false
                                    
                                    if(onland && heks[lastFieldX][lastFieldY].z != -1 && heks[field.x][field.y].z == -1 && szyt[unit.rodz] != 'l' && szyt[unit.rodz] != 'w'){
                                        onland = false
                                        addEmbarkingPossibility = true
                                        
                                        if(heks[lastFieldX][lastFieldY].z > 0 && heks[field.x][field.y].z == -1){
                                            embarkingOnPlace = true
                                        }
                                    }
                                    if(!onland && heks[lastFieldX][lastFieldY].z == -1 && heks[field.x][field.y].z != -1)
                                        onland = true
                                        
                                        
                                    if(addEmbarkingPossibility){
                                        addedembapo[i+'#'+k] = true
                                        var kod = embarkingOnPlace && lastFieldX != null ? lastFieldX+'#'+lastFieldY : code2
                                        
                                        var bestpoe = null
                                        var best = null
                                        //heks[lastField.x][lastField.y].test = 'X'
                                        if(kod in distmaps){
                                            for(var l in distmaps[kod].hex.units){
                                                var unit2 = distmaps[kod].hex.units[l]
                                                
                                                if(szyt[unit2.rodz] == 'w' && zast[unit2.rodz] == 'x'){
                                                    
                                                    embapo += unit.il
                                                    bembapo += unit.il
                                                    if(!(i+'#'+k) in embapot)
                                                        embapot[i+'#'+k] = 0
                                                    embapot[i+'#'+k] += unit.rozb
                                                    
                                                    break
                                                } else if(distmap.potentialEmbarkings.length > 0){
                                                    //for(var s in distmap.potentialEmbarkings){
                                                    //    var poe = distmap.potentialEmbarkings[s]
                                                    //    bestpoe = poe
                                                    //    if(poe.embarking == kod){
                                                    //        best = poe.move[0].il
                                                    //    }
                                                    //}
                                                    if(kod in embars && embars[kod] != null){
                                                        bestpoe = embars[kod]
                                                        best = bestpoe.move[0].il
                                                    }
                                                    if(best != null){
                                                        embapo += best
                                                        addedembapo[i+'#'+k] = bestpoe
                                                    } else {
                                                        delete addedembapo[i+'#'+k]
                                                    }
                                                } else if(unit2.rozb > 0){
                                                    embapot[i+'#'+k] -= unit.rozb
                                                }
                                            }
                                        }
                                        //console.log(embarkingDelay)
                                    }
                                        
                                    lastFieldX = field == null ? null : field.x
                                    lastFieldY = field == null ? null : field.y
                                }
                                

                            }
                        }
                    }
                    
                }*/
                for(var i in distmap.hex.units){
                    var unit = distmap.hex.units[i]
                    
                    //if(!(interestingAction == undefined || interestingAction.unit == unit))
                    //    continue
                    
                    var unitAttackStrength = evalUnitAttack(unit,undefined,dm.model)
                    var unitDefenseStrength = evalUnitDefense(unit)
                    
                    /*
                    for(var t = 0;t<MAX_TURNS;t++){
                        if(alreadyAttacking == undefined)
                            distmap.defence[t][unit.d] -= -maxdef * t
                        distmap.defence[t][unit.d] = Math.min(distmap.defence[t][unit.d], 99*8)
                    }*/

                    if(unit.actions.length > 0){
                        
                        var path = null
                        var movingDelay = 0
                        var embarkingDelay = 0
                        for(var j in unit.actions){
                            var action = unit.actions[j]
                            if(action.somethingAlong)
                            if(action.type == 'move' && action.destination != undefined/* && j == unit.actions.length - 1*/ && zast[unit.rodz] != 'x'){
                                var code = action.destination[0]+'#'+action.destination[1]
                                
                                //if(unit.actions.length > 1 && zas[unit.rodz] > 1 && j > unit.actions.length - zas[unit.rodz])
                                //    break
                                    
                                var dist = action.rucho.reduce((a,b)=>a+b,0)
                                
                                path = action.leadedPath
                                var losses = 0
                                
                                var unitAttackStrength2 = action.destination[0] in dm.model.board ? evalUnitAttack(unit, action, dm.model, true, path) : 0
                                var origUnitAttackStrength2 = unitAttackStrength2

                                var onland = hex.z != -1
                                //var embarkingPossible = 0
                                var lastFieldX = distmap.hex.x
                                var lastFieldY = distmap.hex.y
                                //var addEmbarkingPossibility = false
                                //var embarkingOnPlace = false
                                
                                for(var k=0;k<path.path.length-1;k++){
                                    
                                    if(unitAttackStrength2 <= 0)
                                        break
                                    
                                    var field = path.path[k]
                                    var code2 = field.x+'#'+field.y
                                        
                                    if(code2 in distmaps && distmaps[code2].hex.dru == -1 && distmaps[code2].hex.z <= 0)
                                        continue
                                        
                                    if(code2 in distmaps && distmaps[code2].hex.units.length == 4 && distmaps[code2].hex.dru == unit.d /*alliegance[MAX_TURNS-1] == unit.d*/){
                                        unitAttackStrength2 = 0
                                        break
                                    }
                                    
                                    //addEmbarkingPossibility = false
                                    //embarkingOnPlace = false
                                    
                                    if(onland && action.embarking != null && heks[lastFieldX][lastFieldY].z != -1 && heks[field.x][field.y].z == -1){
                                        onland = false
                                        //addEmbarkingPossibility = true
                                        if(heks[lastFieldX][lastFieldY].z > 0 && action.by != 'real' || field.x+'#'+field.y in embarkingTargets || lastFieldX+'#'+lastFieldY in embarkingTargets){
                                            embarkingDelay += 4
                                        } else {
                                            embarkingDelay = Infinity
                                        }
                                        
                                        //if(heks[lastFieldX][lastFieldY].z > 0 && heks[field.x][field.y].z == -1){
                                        //    embarkingOnPlace = true
                                        //}
                                    }
                                    if(!onland && heks[lastFieldX][lastFieldY].z == -1 && heks[field.x][field.y].z != -1)
                                        onland = true
                                        
                                    
                                    /*if(false)
                                    if(szyt[unit.rodz] != 'w' && szyt[unit.rodz] != 'l'/* && addedembapo[i+'#'+k]*){
                                        embarkingDelay = 0
                                        /*
                                        var kod = embarkingOnPlace && lastFieldX != null ? lastFieldX+'#'+lastFieldY : code2
                                        
                                        var bestpoe = null
                                        var best = null
                                        //heks[lastField.x][lastField.y].test = 'X'
                                        if(kod in distmaps){
                                            for(var l in distmaps[kod].hex.units){
                                                var unit2 = distmaps[kod].hex.units[l]
                                                
                                                if(szyt[unit2.rodz] == 'w' && zast[unit2.rodz] == 'x'){
                                                    embarkingPossible = Math.min(unit.il,embarkingPossible+unit2.il)
                                                    
                                                    break
                                                } else if(distmap.potentialEmbarkings.length > 0){
                                                    for(var s in distmap.potentialEmbarkings){
                                                        var poe = distmap.potentialEmbarkings[s]
                                                        bestpoe = poe
                                                        if(poe.embarking == kod){
                                                            best = poe.move[0].il
                                                        }
                                                    }
                                                    if(best != null){
                                                        embarkingPossible = Math.min(unit.il,embarkingPossible+best)
                                                    }
                                                }
                                            }
                                        }*
                                        unitAttackStrength2 = origUnitAttackStrength2 * (1 - embarkingPossible/unit.il)
                                        //if(embapo >= unit.il * 0.7){
                                            /*
                                            for(var l = 0;l<heks[lastFieldX][lastFieldX].unp;l++){
                                                
                                            }*
                                            if(heks[lastFieldX][lastFieldY].z > 0 || (bembapo >= unit.il * 0.7 || embapo >= unit.il * 0.7)){
                                                var il = unit.il
                                                if(i+'#'+k in embapot)
                                                    il -= embapot[i+'#'+k]
                                                embarkingDelay = Math.ceil(il * ced[8] / heks[lastFieldX][lastFieldY].z)
                                                
                                                
                                                embapo -= unit.il
                                                bembapo -= unit.il
                                            } else {
                                                embarkingDelay = Infinity
                                            }

                                            if(addedembapo[i+'#'+k] instanceof Object){
                                                
                                                newEmbarkingDelay = Math.ceil(Math.min(k, addedembapo[i+'#'+k].turn))
                                                if(newEmbarkingDelay < embarkingDelay){
                                                    embarkingDelay = newEmbarkingDelay
                                                    embapo -= unit.il
                                                }
                                            }
                                        //}
                                        
                                    }*/
                                        
                                    lastFieldX = field == null ? null : field.x
                                    lastFieldY = field == null ? null : field.y
                                    var turn = Math.max(1,Math.ceil((k - (zas[unit.rodz] <= 1 ? 0 : zas[unit.rodz])) / szy[unit.rodz]) + embarkingDelay)

                                    if(turn < MAX_TURNS && code2 in distmaps && distmaps[code2].hex.units.length > 0/* && distmaps[code2].hex.units[0].d != unit.d*/){
                                        //if(k == 0)
                                        //    continue
                                        if(distmaps[code2].hex.dru != unit.d){
                                            for(var l in distmaps[code2].hex.units){
                                                var unit2 = distmaps[code2].hex.units[l]
                                                //if(unit2.actions.length == 0 || unit2.actions[0].type != 'move'){
                                                    var evaldefense = evalUnitDefense(unit2)
                                                    //for(var l in distmaps[code2].realtocome){
                                                    for(var t = turn;t<MAX_TURNS;t++){
                                                        if(t < MAX_TURNS && distmaps[code2].realtocome != undefined && t in distmaps[code2].realtocome){
                                                            distmaps[code2].realtocome[t][unit2.d] -= unitAttackStrength2
                                                            if(distmaps[code2].realtocome[t][unit2.d] < 0)
                                                                distmaps[code2].realtocome[t][unit2.d] = 0
                                                        }
                                                    }
                                                    //}
                                                    
                                                    unitAttackStrength2 -= evaldefense
                                                    origUnitAttackStrength2 -= evaldefense
                                                    if(unitAttackStrength2 < 0)
                                                        unitAttackStrength2 = 0
                                                        
                                                    if(unitAttackStrength2 <= 0)
                                                        break
                                                //}
                                            }
                                        }
                                    }
                                    
                                }
                                //if(true || !pathIsThroughCrowdedCity(dm,distmap.hex.x,distmap.hex.y,action.ruchk,action.rucho,unitAttackStrength))
                                if(unitAttackStrength2 > 0 && embarkingDelay < Infinity)
                                    for(var t = 0;t<MAX_TURNS;t++){
                                        if(code in distmaps && szy[unit.rodz] * (t - embarkingDelay) + ((zas[unit.rodz] <= 1 || unit.szyt != szyt[unit.rodz]) ? 0 : zas[unit.rodz]) >= dist){
                                        //console.log(szy[unit.rodz] * t + zas[unit.rodz], dist, unitAttackStrength)
                                            if(movingDelay == 0)
                                                movingDelay = t
                                            distmaps[code].realtocome[t][unit.d] -= -Number(unitAttackStrength2)
                                        }
                                        
                                        //if(alreadyAttacking != null)
                                        //    distmap.realtocome[t][unit.d] -= Number(unitDefenseStrength)
                                        
                                    }
                            }

                            if(embarkingDelay < Infinity){
                                if(action.type == 'aim'){             
                                    if(action.celd == -2)
                                        continue                                    
                                    var code3 = action.hex_x+'#'+action.hex_y//unix[action.celd][action.celu].x + '#' + unix[action.celd][action.celu].y//action.hex_x + '#'+ action.hex_y
                                    var def = 0
                                    for(var k in distmaps[code3].hex.units){
                                        var unik = distmaps[code3].hex.units[k]
                                        
                                        if(zas[unik.rodz] >= zas[unit.rodz]){
                                            def -= Number(evalUnitDefense(unik))
                                        }
                                    }
                                    var attak = 0
                                    var str = Number(unitAttackStrength)
                                    console.log('delay',movingDelay)
                                    for(var t = movingDelay;t<MAX_TURNS;t++){
                                        if(zas[unit.rodz] > 1){
                                            attak -= -str * (Math.pow(0.85,(t - movingDelay)))//Math.min(1.5,t-movingDelay+1)
                                        } else if(t == movingDelay) {
                                            attak -= -str//2//Math.min(1.5,t-movingDelay+1)
                                        }// else if(t == movingDelay+1){
                                            attak -= -str/2
                                        //}
                                        str = Math.max(0,str-def/2)
                                        distmaps[code3].realtocome[t][unit.d] -= -attak
                                    }
                                }/*
                                if(action.type == 'move' && action.destination != undefined && zast[unit.rodz] == 'x'){
                                    if(szyt[unit.rodz] == 'w'){
                                        
                                    }
                                }*/
                                
                            }
                            if(action.somethingAlong)
                            if(action.type == 'stay' || action.type == 'build' || (unit.actions[0].type != 'move'/* && unit.actions[0].il < unit.il-10*/ && j == 0)){
                                for(var t = 0;t<MAX_TURNS;t++){
                                    distmap.realtocome[t][unit.d] -= -Number(unitDefenseStrength)
                                }
                            }
                        }
                        
                    } else {
                        for(var t = 0;t<MAX_TURNS;t++){
                            distmap.realtocome[t][unit.d] -= -Number(unitDefenseStrength)
                        }
                    }
                }
            }
        }
        
        //if(false)
        //for(var movement_type in distmap.maps){
         //   var map_of_movement_type = distmap.maps[movement_type].hexmap

            //var hexesToCheck = map_of_movement_type.filter(x => x.hex.z > 0 || x.hex.units.length > 0)
            /*
            var unitDistDict = {}
            for(var i in map_of_movement_type){
                var elem = map_of_movement_type[i]
                unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
            }*/
            //for(var j in distmap.hex.units){
            //    var unit = distmap.hex.units[j]
                
            //    if(szyt[unit.rodz] != movement_type/* || unit.actions.length > 0*/)
            //        continue
                
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
//                 if(false){
//                     for(var i in map_of_movement_type){
//                         var hex = map_of_movement_type[i]
//                         if(hex.hex.z > 0 || hex.hex.units.length > 0){
//                             var hexkey = hex.hex.x + '#' + hex.hex.y
//                             
//                             var unitAttackStrength = evalUnitAttack(unit,null,dm.model)
//                             
//                             var potential = 0
//                             for(var t = 0;t<MAX_TURNS;t++){
//                                 if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 ? 0 : zas[unit.rodz]) >= hex.dist){
//                                     if(unit.actions.length == 0)
//                                         distmaps[hexkey].potentialtocome[t][unit.d] -= (-Number(unitAttackStrength) - potential * maxdef) // hexesCheckedInTurn[t]
//                                     //console.log(hex.hex.dru, unit.d, hexkey in distmaps, distmaps[hexkey].fromenemy)
//                                     /*
//                                     if(hex.hex.dru != unit.d && hex.hex.dru != -1 && hexkey in distmaps && distmaps[hexkey].fromenemy[movement_type] > t)
//                                         distmaps[hexkey].fromenemy[movement_type] = t
//                                     if(hex.dist > 0 && hex.hex.dru == unit.d && hexkey in distmaps && distmaps[hexkey].fromally[movement_type] > t)
//                                         distmaps[hexkey].fromally[movement_type] = t
//                                     */
//                                     potential++
//                                 }
//                             }
//                         }
//                     }
//                 }
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
                
        //    }
        //}
    //}
    calculateAlliegance(dm,alreadyAttacking)
    
    
    //dm.score = score
    //console.log(distmaps)
}
function calculateAlliegance(dm,alreadyAttacking){
    
    var distmaps = dm.distmaps
    if(dm.score == undefined || dm.score[0] == undefined){
        dm.score = {}
        for(var t = 0;t<MAX_PLAYERS;t++){
            dm.score[t] = allColors()
        }
    } else {
        for(var t = 0;t<MAX_PLAYERS;t++){
            for(var i = 0;i<12;i++){
                dm.score[t][i] = 0
            }
        }
    }
        
    for(var t = 0;t<MAX_TURNS;t++){
        for(var key in distmaps){
            var distmap = distmaps[key]
            
            if(alreadyAttacking != null && !(key in alreadyAttacking))
                continue

            var biggestpower = 0
            var biggestpowercolor = -1
            var secondbiggestpower = 0
            var secondbiggestpowercolor = -1
            
            var powers = {}
            var rangea = {}
            for(var d = 0;d<12;d++){
                //if(distmap.realtocome[t][d] > 0)
                //    console.log(distmap.hex.x,distmap.hex.y,d,distmap.potentialtocome[t][d], distmap.realtocome[t][d], distmap.defence[t][d])
                powers[d] = distmappower(distmap,t,d)
                if(powers[d] > biggestpower){
                    secondbiggestpower = biggestpower
                    secondbiggestpowercolor = biggestpowercolor
                    biggestpower = powers[d]
                    biggestpowercolor = d   
                }
            }
            var percentage = 0//0.5 * (1-1/(1+totalrangeattack/200))
            var ownpercentage = 0//0.5 * (1-1/(1+totalrangeattack/200))
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
                //dm.score[t][biggestpowercolor] += SMALL_FRACTION*2
                dm.score[t][biggestpowercolor] += distmap.hex.z + (distmap.hex.stali + Math.min(distmap.hex.prod,distmap.hex.stali)) * 2 // * factor
                if(biggestpowercolor != -1){
                    for(var d = 0;d<12;d++){
                        if(d != biggestpowercolor){
                            dm.score[t][d] -= SMALL_FRACTION
                        }
                    }
                }
                
            }
            
            //heks[area.x][area.y].test = level+'#'+(maxeval * 2 - allAreaValues)
            //heks[area.x][area.y].testColor = evalcolor

        }
    }
}
function getScoresAndAlliegances(dm){
    var score = {}
    var alliegance = {}
    for(var t = 0;t<MAX_TURNS;t++){
        score[t] = allColors()
        for(var i in score[t]){
            score[t][i] = dm.score[t][i]
        }   
    }
    
    for(var key in dm.distmaps){
        alliegance[key] = allTurns()
        for(var i in alliegance[key]){
            alliegance[key][i] = dm.distmaps[key].alliegance[i]
        }
    }
    
    return {score:score,alliegance:alliegance}
}
function setScoresAndAlliegances(dm,backup){
    for(var t = 0;t<MAX_TURNS;t++){
        for(var i in backup.score[t]){
            dm.score[t][i] = backup.score[t][i]
        }   
    }
    
    for(var key in dm.distmaps){
        for(var i in backup.alliegance[key]){
            dm.distmaps[key].alliegance[i] = backup.alliegance[key][i]
        }
    }
}
function distmappower(distmap,t,d){
    return Number(distmap.realtocome[t][d])// + Number(distmap.defence[t][d])
}

function exponentiel(number){
    return Math.pow(number,1.1)
}

function getRuch(map_of_movement_type,hex){
    var hToCheck = map_of_movement_type[hex.hex.x+'#'+hex.hex.y]
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
        var hToCheck = map_of_movement_type[hfrom.x+'#'+hfrom.y]
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

            var hexesToCheck = map_of_movement_type
                        
            for(var i in hexesToCheck){
                var hex = hexesToCheck[i]
                if(hex.hex.z > 0 || hex.hex.units.length > 0){
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    
                    //if(hex.hex.units.length == 0 && hex.hex.z <= 0)
                    //    continue
                    
                    if(hexkey != key && hexkey in distmaps && (!(hexkey in map[key]) || map[key][hexkey] > hex.dist)){
                        map[key][hexkey] = hex.dist
                    }
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
       
       distmap.potentialEmbarkings.length = 0
       
       /*for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap

            //var hexesToCheck = map_of_movement_type.filter(x => x.hex.z > 0 || x.hex.units.length > 0)
            
            //var range_map_of_movement_type = distmap.maps[movement_type].rangemap

            //var range_hexesToCheck = range_map_of_movement_type.filter(x => x.hex.units.length > 0)

            /*
            var unitDistDict = {}
            for(var i in map_of_movement_type){
                var elem = map_of_movement_type[i]
                unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
            }*/
       //}
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            
            unit.legalActions = []
        }
    }
    /*
    for(var i = 0;i<scian;i++){
        for(var j = 0;j<scian;j++){
            heks[i][j].test = ''
        }
    }*/
    
    /*
    var potar = window.possible_targets != undefined ? possible_targets.map(a=>a.hex.x+'#'+a.hex.y) : null
    var potar2 = {}
    for(var i in potar){
        potar2[potar[i]] = true
    }*/
    
    var possibleEmbarkings = allColorTables()
    for(var key in distmaps){
        var distmap = distmaps[key]
        var dimap = [distmap.hex.x,distmap.hex.y]
        //if(distmap.hex.z <= 0 && distmap.hex.units.map(x=>evalUnitAttack(x)).reduce((a,b) => a+b,0) < 20)
        //    continue
           
       for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap

            var mapmapmap = distmap.maps[movement_type].hexmapmap//mapmap(map_of_movement_type,'hex')
            
            var hexesToCheck = map_of_movement_type//.filter(a => (a.hex.x+'#'+a.hex.y in potar2))
            
            var range_map_of_movement_type = distmap.maps[movement_type].rangemap

            var range_hexesToCheck = range_map_of_movement_type//.filter(a => (a.hex.x+'#'+a.hex.y in potar2))

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
                    
                    //if(potar != undefined && !(hexkey in potar2)/* && !(hexkey in realSfKeys)*/){
                    //    continue
                    //}
                    /*==
                    if(!(key in simplifieddistmaps && hexkey in simplifieddistmaps[key]))
                        continue
                    */
                    if(hex.hex.units.length == 0 && hex.hex.z <= 0 && (hex.from == null || !(hex.hex.z == -1 && hex.from.z != -1)))
                        continue
                        
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    
                    //if(!distmaps[hexkey].frontline)
                    //    continue
                    
                    var potential = 0
                    //for(var t = 0;t<MAX_TURNS;t++){
                        //if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
                            //if(hexkey in distmaps && ( distmaps[hexkey].frontline || distmaps[hexkey].units.length == 0 ||  )){
                                //unit.legalActions.push({type:'move',rucho:rucho,ruchk:ruchk,destination:leadPath(hex.x,hex.y,ruchk,rucho)})
                                    
                    if(zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm')
                        continue
                        
                    var result = getRuch(mapmapmap,hex)
                    
                    var ruchk = result.ruchk
                    var rucho = result.rucho
                    
                    
                    //console.log([hex.hex.x,hex.hex.y,ruchk,rucho])
                    
                    //if(movement_type != 'w' && movement_type != 'l' && hex.water > 0 && (unit.d != undefined && (unit.d == -1 || unit.d != kolej) || unit.dru != undefined && (unit.dru == -1 || unit.dru != kolej)))
                    //    continue
                    
                    if(szyt[unit.rodz] != 'w' && szyt[unit.rodz] != 'l'/* && unit.actions.length == 0*/){
                        var embarking = embarkingPointFromLeadedPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)
                        if(embarking != null){
                            var kod = embarking.x + '#' + embarking.y
                            if(!(kod in possibleEmbarkings[unit.d]))
                                possibleEmbarkings[unit.d][kod] = []
                            if(!possibleEmbarkings[unit.d][kod].includes(key)){
                                possibleEmbarkings[unit.d][kod].push(key)
                                //heks[embarking.x][embarking.y].test = 'Q'
                            }
                        }
                    }
                    var somethingAlong = thereIsSomethingAlongThePath(distmap.hex.x,distmap.hex.y,ruchk,rucho)
                    
                    //var frontline = undefined//hex.hex.dru != -1 && hex.hex.dru != kolej ? getFrontLine(distmap.hex.x,distmap.hex.y,unit,ruchk,rucho) : null
                    
                    //if(frontline != null)
                    //    heks[frontline[0]][frontline[1]].test = 'S'
                    
                    if(!pathIsThroughCrowdedCity(dm,distmap.hex.x,distmap.hex.y,ruchk,rucho)){
                        var hede = [hex.hex.x,hex.hex.y]
                        var lnp = leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)
                        
                        //if(frontline == undefined || true){
                            var glp = getLeadedPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)
                            unit.legalActions.push([{type:'move',by:'speculation2',rucho:rucho,ruchk:ruchk,il:unit.il,from:dimap,destination:lnp,embarking:embarking,somethingAlong:somethingAlong,distant:false,leadedPath:glp/*,collisional:isPathCollisional(distmap.hex.x,distmap.hex.y,ruchk,rucho)*/}])
                            if(unit.il > 10 && distmap.hex.units.length <= 3)
                                unit.legalActions.push([{type:'move',by:'speculation2',rucho:rucho,ruchk:ruchk,il:unit.il-10,from:dimap,destination:lnp,embarking:embarking,somethingAlong:somethingAlong,distant:false,leadedPath:glp/*,collisional:isPathCollisional(distmap.hex.x,distmap.hex.y,ruchk,rucho)*/}])
                            //if(unit.il > 20 && distmap.hex.units.length <= 2 && distmap.frontline)
                            //    unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:Math.floor(unit.il/2),from:[distmap.hex.x,distmap.hex.y],destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                            
                            if(hex.hex.units.length > 0/* && distmap.frontline*/){
                                if(hex.hex.units.length > 0){
                                    var aimedunit = hex.hex.units[hex.hex.units.length-1]
                                    //tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"
                                    if(aimedunit != null && aimedunit.d != unit.d && miaruj(unit,aimedunit,hex.hex)){
                                        rucho2 = rucho.slice(0,rucho.length - zas[unit.rodz] - 1)
                                        ruchk2 = ruchk.slice(0,ruchk.length - zas[unit.rodz] - 1)
                                        
                                        var turnPrediction = Math.ceil((rucho2.reduce((a,b) => a+b, 0)) / szy[unit.rodz])
                                        
                                        var lp = leadPath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)
                                        var embarking2 = embarkingPointFromLeadedPath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)
                                        
                                        var somethingAlong2 = thereIsSomethingAlongThePath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)

                                        /*
                                        if(embarking2 != null){
                                            var kod = embarking2.x + '#' + embarking2.y
                                            if(!(kod in possibleEmbarkings[unit.d]))
                                                possibleEmbarkings[unit.d][kod] = {hexesfrom:[], barks:[]}
                                            possibleEmbarkings[unit.d][kod].hexesfrom.push(key)
                                        }*/
                        

                                        var ds = distance(lnp[0],lnp[1],hex.hex.x,hex.hex.y)
                                        if(ds != undefined && ds <= zas[unit.rodz] && turnPrediction < 2 && rucho2.length+1 <= szy[unit.rodz]){
                                            var glp2 = getLeadedPath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)
                                            unit.legalActions.push([
                                                {type:'move',by:'speculation2',rucho:rucho2,ruchk:ruchk2,il:unit.il,from:dimap,destination:hede,embarking:embarking2,somethingAlong:somethingAlong2,distant:false,leadedPath:glp2/*,collisional:isPathCollisional(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)*/},  //not a real situation, but it solves some problem
                                                {type:'aim',by:'speculation2',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,destination:hede,hex_x:hex.hex.x,hex_y:hex.hex.y},
                                            ])
                                            if(unit.il > 10 && distmap.hex.units.length <= 3){
                                                unit.legalActions.push([
                                                    {type:'move',by:'speculation2',rucho:rucho2,ruchk:ruchk2,il:unit.il-10,from:dimap,destination:hede,embarking:embarking2,somethingAlong:somethingAlong2,distant:false,leadedPath:glp2/*,collisional:isPathCollisional(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)*/},
                                                    {type:'aim',by:'speculation2',celu:aimedunit.id,celd:aimedunit.d,il:unit.il-10,destination:hede,hex_x:hex.hex.x,hex_y:hex.hex.y},
                                                ])
                                                }
                                        }

                                    }
                                    //this.actions.push({type:'aim',celu:this.celu,celd:this.celd,hex_x:aimedunit.x,hex_y:aimedunit.y,kolor:this.kolor})

                                }
                            }
                        //}
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
                        if(hex.hex.units.length > 0){
                            var hexkey = hex.hex.x + '#' + hex.hex.y
                            
                            if(hex.hex.units.length == 0)
                                continue
                            if(hex.hex.units.length > 0){
                                var aimedunit = hex.hex.units[hex.hex.units.length-1]
                                
                                var ds = distance(hex.hex.x,hex.hex.y,distmap.hex.x,distmap.hex.y)

                                //tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"
                                if(aimedunit != null && aimedunit.d != unit.d && miaruj(unit,aimedunit,hex.hex) && ds != undefined && ds <= zas[unit.rodz]){
                                    unit.legalActions.push([
                                        {type:'aim',by:'speculation2',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,from:dimap,hex_x:hex.hex.x,hex_y:hex.hex.y,destination:hede},
                                    ])

                                }
                                        //this.actions.push({type:'aim',celu:this.celu,celd:this.celd,hex_x:aimedunit.x,hex_y:aimedunit.y,kolor:this.kolor})

                            }
                        }
                    }
                
            }
            
        }
    }
    for(var key in distmaps){
        var distmap = distmaps[key]
        
        if(!('x' in distmap.maps))
            continue
            
        var map_of_movement_type = distmap.maps['x'].hexmap

        var mapmapmap = distmap.maps['x'].hexmapmap//mapmap(map_of_movement_type,'hex')
        
        var hexesToCheck = map_of_movement_type//.filter(x => x)
        


        /*
        var unitDistDict = {}
        for(var i in map_of_movement_type){
            var elem = map_of_movement_type[i]
            unitDistDict[elem.hex.x+'#'+elem.hex.y] = elem
        }*/
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            
            if(szyt[unit.rodz] != 'w' || zast[unit.rodz] != 'x'/* || unit.actions.length > 0*/)
                continue
            //if(unit.rucho.length > 0)
            //    continue
                
            for(var i in hexesToCheck){
                var hex = hexesToCheck[i]
                
                //if(hex.hex.z > 0 || hex.hex.units.length > 0){
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    /*==
                    if(!(key in simplifieddistmaps && hexkey in simplifieddistmaps[key]))
                        continue
                    */
                    //if(hex.hex.units.length == 0 && hex.hex.z <= 0)
                    //    continue
                    
                    //if(!distmaps[hexkey].frontline)
                    //    continue
                    
                    var potential = 0
                    //for(var t = 0;t<MAX_TURNS;t++){
                        //if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
                            //if(hexkey in distmaps && ( distmaps[hexkey].frontline || distmaps[hexkey].units.length == 0 ||  )){
                                //unit.legalActions.push({type:'move',rucho:rucho,ruchk:ruchk,destination:leadPath(hex.x,hex.y,ruchk,rucho)})
                    
                    if(hexkey in possibleEmbarkings[unit.d]){
                        
                        var result = getRuch(mapmapmap,hex)
                        
                        var ruchk = result.ruchk
                        var rucho = result.rucho
                        
                        var il = distmap.hex.units.length <= 1 ? unit.il-10 : unit.il
                        //if(il < 10)
                        //    continue
                        var leadedPath = getLeadedPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)
                        var move = [{type:'move',by:'speculation2',rucho:rucho,ruchk:ruchk,il:unit.il,from:[distmap.hex.x,distmap.hex.y],destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho),embarking:null,somethingAlong:true,leadedPath:leadedPath}]
                        
                        var olej = false
                        for(var l in leadedPath){
                            var koi = leadedPath[l].x+'#'+leadedPath[l].y
                            if(koi in distmaps && distmaps[koi].hex.dru != kolej){
                                olej = true
                            }
                        }
                        if(olej)
                            continue
                            
                        var turn = rucho.length / szy[unit.rodz]
                        
                        
                        var pemb = {distmap:key, dru:unit.d, embarking:hexkey, unitIndex:j, turn:turn, move:move}
                        
                        for(var ix in possibleEmbarkings[unit.d][hexkey]){
                            distmaps[possibleEmbarkings[unit.d][hexkey][ix]].potentialEmbarkings.push(pemb)
                            /*
                            for(var k in distmap.hex.units){
                                console.log(distmap.hex.units[k])
                            }*/
                        }
                        //unit.legalActions.push(move)
                        //console.log([hex.hex.x,hex.hex.y,ruchk,rucho])
                        
                        //if(movement_type != 'w' && movement_type != 'l' && hex.water > 0 && (unit.d != undefined && (unit.d == -1 || unit.d != kolej) || unit.dru != undefined && (unit.dru == -1 || unit.dru != kolej)))
                        //    continue
                        
                    }
                //}
            }
        }
    }
}
function findWastedLegalActionsWithNoLanding(dfrou,allowPaths,realSfKeys){
    var distmaps = dfrou.distmaps
    
    /*
    for(var k in realSfKeys){
        for(var i in realSfKeys[k].distTable){
            
            var build = cityscore(realSfKeys[k].hex)

            for(var j = 0;j<MAX_TURNS;j++){
                realSfKeys[k].distTable[i][j] = 0
            }
        }
    }*/
    var embarkingPotential = {}
    var usedHexes = {}
    for(var key in distmaps){
        var distmap = distmaps[key]
        
        if(distmap.hex.dru == kolej){
            var is_land = false
            
            usedHexes[key] = 0
            for(var j in distmap.hex.units){
                var unit = distmap.hex.units[j]
                                
                if(szyt[unit.rodz] == 'w' || szyt[unit.rodz] == 'l')
                    continue
                is_land = true
                break
                /*
                var lacs = unit.actions.length >= 1 ? [unit.actions] : unit.legalActions
                for(var la in lacs){
                    var lac = lacs[la]
                    if(lac.length >= 1 && lac[0].type == 'move' && lac[0].il == unit.il && lac[0].embarking != null){
                        var lade = lac[0].destination[0]+'#'+lac[0].destination[1]
                        if(lade in realSfKeys){
                            var dist = lac[0].rucho.reduce((a,b)=>a+b,0)
                            
                            var laste = lac[0].embarking.last
                            var lastekod = laste.x+'#'+laste.y
                            
                            if(!(lastekod in embarkingPotential)){
                                embarkingPotential[lastekod] = {embarking:laste,units:[],needed:0}
                            }
                            embarkingPotential[lastekod].units.push({unit:unit,x:distmap.hex.heks.x,y:distmap.hex.heks.y,j:j})
                            usedUnits[key+'#'+j]++
                        }
                    }
                }*/
            }
            if(is_land){
                var ldm = landdistmap(distmap.hex.x,distmap.hex.y,false,false,false)
                var mapmapmap = mapmap(ldm,'hex')

                for(var key2 in realSfKeys){
                    var realSf = realSfKeys[key2]
                    var gr = getRuch(mapmapmap,realSf)
                    
                    var epo = embarkingPointFromLeadedPath(distmap.hex.x,distmap.hex.y,gr.ruchk,gr.rucho)
                    if(epo != null){
                        var laste = epo.last
                        var lastekod = laste.x+'#'+laste.y
                        
                        if(!(lastekod in embarkingPotential)){
                            embarkingPotential[lastekod] = {embarking:laste,hexes:[],needed:0}
                        }
                        embarkingPotential[lastekod].hexes.push({units:distmap.hex.units,x:distmap.hex.heks.x,y:distmap.hex.heks.y,j:j})
                        usedHexes[key2]++
                    }
                }
            }
        }
    }
    for(var key in embarkingPotential){
        var empo = embarkingPotential[key]
        var empoem = embarkingPotential[key].embarking
        
        var needsFulfiled = portPotential(empoem.x,empoem.y,false)
        
        var needs = empo.hexes.length * 99
        //heks[empoem.x][empoem.y].test = needsFulfiled + '/' + needs
        
        for(var i in empo.hexes){
            var h = empo.hexes[i]
            
            empo.needed += 99/usedHexes[h.x+'#'+h.y]
        }
        
    }

    return embarkingPotential
}
function portPotential(x,y,whenadded){
    var he = heks[x][y]
    
    if(he.z <= 0 && !whenadded)
        return 0
        
    var tocheck = [he]
    var tocheck2 = []
    var allchecked = [he]
    
    var sum = he.z
    
    while(tocheck.length > 0){
        for(var i in tocheck){
            var he = tocheck[i]
            for(var j = 0;j<6;j++){
                var he2 = he.border[j]
                if(he2 != null && he2.z > 0 && !allchecked.includes(he2)){
                    tocheck2.push(he2)
                    allchecked.push(he2)
                    sum += he2.z
                }
            }
            //he = he.border[ruchk[i]]
            
        }
        tocheck = tocheck2
        tocheck2 = []
    }
    return sum
}
function landdistmap(x,y,withLandMaking,heavy,mountain){
    var hekstable = heks
    var tocheck = [ hekstable[x][y] ]
    var tocheck2 = []
    var checkedGrid = []
    var startwater = 0//!water && !air && hekstable[x][y].z == -1 ? 1 : 0
    var checkedList = []//[ { hex: hekstable[x][y], dist: 0, water:startwater, from: null } ]
    for(var i = 0;i<scian;i++){
        checkedGrid[i] = []
        for(var j = 0;j<scian;j++){
            checkedGrid[i][j] = {dist:-1,objdist:-1,water:startwater,range:-1,from:null,embarking:0}
            
        }
    }
    checkedGrid[x][y].dist = 0
    checkedGrid[x][y].objdist = 0
    
    //addEmbarkingPossibility(hekstable,checkedGrid)
    
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
                    
                        
                    if(true){
                        
                        if(hexto.z == -2 && (heavy || hexfrom.z == -1))
                            continue
                        if(hexto.z == -2 && !mountain)
                            step = 2
                        if(hexto.z == -1){
                            if(hexfrom.z > 0){
                                //if(wieltratw > 0){
                                //    pluswater = 1
                                //} else {
                                    pluswater = 1
                                //}
                            } else if(hexfrom.z != -1){
                                //if(wieltratw > 0){
                                //    pluswater = 1
                                //} else {
                                
                                step += 2
                                pluswater = 1
                                //}
                            }
                        }
                        //if(hexfrom.z == -1 && dru_to != -1 && dru_to != kolej)
                        //    continue
                        if(unp_to > 3 && unp_from <= 4 && dru_to == kolej/* && checkedGrid[x][y] != -1*/){
                            step *= 10
                        }
                        if(unp_to == 4 && dru_to == kolej){
                            continue
                        }
                    }
                    if(checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist + step + pluswater*2){
                        var dist = checkedGrid[hexfrom.x][hexfrom.y].dist + step + pluswater*2
                        var waterdist = checkedGrid[hexfrom.x][hexfrom.y].water + pluswater
                        var objdist = checkedGrid[hexfrom.x][hexfrom.y].objdist - (-1)
                        
                        if(checkedGrid[hexfrom.x][hexfrom.y].from != undefined && hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y] != undefined && checkedGrid[hexfrom.x][hexfrom.y].from.x == hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y].x && checkedGrid[hexfrom.x][hexfrom.y].from.y == hekstable[tocheck[i].border[j].x][tocheck[i].border[j].y].y)
                            continue
                            
                        //console.log(dist)
                        tocheck2.push(tocheck[i].border[j])
                        //checkedList.push( { hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  } )
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist = dist
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water = waterdist
                        checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].from = hexfrom
                        
                        //heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = dist

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
            checkedList.push( { hex: hekstable[i][j], dist: checkedGrid[i][j].dist, objdist: checkedGrid[i][j].objdist, water : checkedGrid[i][j].water, from: checkedGrid[i][j].from, embarking: checkedGrid[i][j].embarking} )
        }        
    }
    //if(!water && !mountain && !heavy && !air && !transporting && heks[x][y].unp >= 1 && heks[x][y].z >= 0 && heks[x][y].undr == kolej)
    //    console.log(x+' '+y,checkedList)

    return checkedList
}
function getFrontLine(x,y,unit,ruchk,rucho){    
    var he = heks[x][y]
    
    var stopBefore = szy[unit.rodz]+(zas[unit.rodz] > 1 ? zas[unit.rodz] : 0)
    
    for(var i in ruchk){
        if(i >= ruchk.length-stopBefore){
            return [he.x,he.y]
        }
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                return undefined
        }
    }
    return null
    
}
function removeAttack(dm, x, y, color){
    var distmaps = dm.distmaps
    
    //var interestingUnits = {'c':[],'n':[],'l':[],'g':[],'w':[]}
    var interestingUnits = []
    for(var key in distmaps){
        var distmap = distmaps[key]
        //if(distmap.frontline)
        //    continue
        
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
function warnung(distmap,unit,legalAction,j,debug){
    properAction = legalAction[0]
    if(distmap.hex.z > 0 && properAction.il > unit.il-10 && (/*j == distmap.hex.units.length-1 || */distmap.hex.units.length == 1)){
        if(debug)console.log(1)
        return true
    }
    if(distmap.hex.z > 0 && properAction.il < unit.il && distmap.hex.units.length == 4){
        if(debug)console.log(2)
        return true
    }
    if(distmap.hex.z <= 0 && properAction.il < unit.il-10){
        if(debug)console.log(3)
        return true
    }
    if(distmap.alliegance[0] != -1 && distmap.hex.z <= 0 && unit.il <= 10){
        if(debug)console.log(4)
        return true
    }
    if(properAction.il < 40 && legalAction[0].destination != undefined && heks[legalAction[0].destination[0]][legalAction[0].destination[1]].z > 0 && heks[legalAction[0].destination[0]][legalAction[0].destination[1]].undr != -1){
        if(debug)console.log(5)
        return true
    }
    return false
}
function tryMakeDestinationMap(dm,color,allowedPaths){
    var distmaps = dm.distmaps

    
    destinationmap = {}
    
    
    for(var code1 in distmaps){
        var distmap = distmaps[code1]
        //if(!distmap.frontline)
        //    continue
        
        //unit,
        if(distmap.alliegance[MAX_TURNS-1] == color)
            continue
            
        var checked = false
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            
            if(unit.d != color || unit.rozb > 20 && unit.il < 20/* && (unit.legalActions.length == 0 || unit.legalActions[0].type == 'move' && heks[unit.legalActions[0].destination[0]][unit.legalActions[0].destination[0]].undr != -1)/* || unit.actions.filter(x => x.type == 'move').length > 0 && !distmap.frontline || unit.actions.filter(x => x.type == 'move' && x.by == 'speculation').length > 0*/)
                continue
                
            var susactions = false
/*          for(var i in unit.actions){
                if(unit.actions[i].type == 'move' && unit.actions[i].by.startsWith('speculation')){
                    //susactions = true
                    break
                }
            }*/
            if(susactions)
                continue
                
                
            
            //if(hasunits && (zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm'))
            //    continue
                /*
            if(distmap.hex.heks.z > 0 && unit.actions.length > 0 && unit.actions[0].type == 'move' && distmap.hex.units[0] == unit && unit.actions[0].il > unit.il-10 && j == 0){
                unit.actions.length = 0
                continue
            }*/
            var timing = Infinity
            
            if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                timing = unit.actions[0].rucho.length/szy[unit.rodz]
            }

                
            var unitcode = code1+'#'+j
            
            //console.log(unit.legalActions.length)
            var bestAction = {}
            var lac = unit.legalActions//.sort((a,b)=>-a.length+b.length)
            
            //console.log(lac)

            for(var i in lac){
                var legalAction = lac[i].filter(x => x.type != 'build')

                if(legalAction.length >= 1 && (legalAction[0].type == 'move' || legalAction[0].type == 'aim') && (legalAction[0].destination != undefined || legalAction[0].hex_x != undefined)){
                    
                    var dest_code = legalAction[0].destination ? legalAction[0].destination[0] + '#' + legalAction[0].destination[1] : legalAction[0].hex_x + '#' + legalAction[0].hex_y
                    
                    
                    if(!(dest_code in possible_dest_codes))
                        continue
                        
                    //UBAUBA
                    
                    var properAction = legalAction[0]
                    /*
                    if(legalAction[0].type == 'move'){
                        var turnPrediction = Math.ceil((legalAction[0].rucho.length - Math.max(zas[unit.rodz]-1,0)) / szy[unit.rodz])
                        if(turnPrediction > 2){
                            legalAction[0].distant = true
                        } else {
                            legalAction[0].distant = false
                        }
                    }*/
                    
                    //console.log(allowedPaths,code1+'#'+dest_code)
                    //if(!allowedPaths[code1+'#'+dest_code] && legalAction[0].type != 'aim')
                    //    continue

                    //if(properAction.type == 'move'){
                    if(warnung(distmap,unit,legalAction,j)){
                        continue
                    }
                    
                    var timing2 = Infinity
                    /*
                    if(legalAction.length > 0 && legalAction[0].type == 'move'){
                        timing2 = (legalAction[0].rucho.length-zas[unit.rodz])/szy[unit.rodz]
                        
                        //if(timing2 > timing && distmaps[dest_code].alliegance[MAX_TURNS] != kolej)
                        //    continue
                    }*/
                        
                        if(distmap.hex.z > 0 && properAction.il > unit.il-10 && (j == 0/* || distmap.hex.units.length == 1*/)){
                            continue
                        }
                        /*
                        if(distmap.hex.z > 0 && properAction.il < unit.il && distmap.hex.units.length == 4){
                            continue
                        }
                        if(distmap.hex.z <= 0 && properAction.il <= unit.il-10){
                            continue
                        }
                        if(distmap.alliegance[0] != -1 && distmap.hex.z <= 0 && unit.il <= 10){
                            continue
                        }
                        if(properAction.il < 40 && legalAction[0].destination != undefined && heks[legalAction[0].destination[0]][legalAction[0].destination[1]].z > 0 && heks[legalAction[0].destination[0]][legalAction[0].destination[1]].undr != -1){
                            continue
                        }*/
                    //}
                    
                    //if(legalAction[0].type == 'aim'){
                    //    console.log(legalAction[0].destination,[x,y])
                    //    console.log(evalUnitAttack(unit,legalAction), evalUnitAttack(unit,bestAction))
                    //}
                    /*
                    if(false && legalAction[0].type == 'aim' && legalAction.length == 1){
                        console.log([
                            bestAction[dest_code],
                            [evalUnitAttack(unit,legalAction,dm.model), evalUnitAttack(unit,bestAction[dest_code],dm.model)],
                            [legalAction.length == 1, bestAction[dest_code].length == 1, legalAction[0].type == 'aim',bestAction[dest_code][0].type == 'move']
                        ])
                    }*/
                    
                    var destdef = 0
                    if(dest_code in distmaps){
                        for(var k in distmaps[dest_code].hex.units){
                            var unit2 = distmaps[dest_code].hex.units[k]
                            
                            destdef += evalUnitDefense(unit2,unit2.il)
                            
                        }
                    }
                    var evatak = evalUnitAttack(unit,legalAction,dm.model)
//                    console.log('deva',destdef,evatak)
                    if(bestAction[dest_code] == null || 
                        //bestAction[dest_code][0].distant && bestAction[dest_code][0].type == 'move' && !legalAction[0].distant && legalAction[0].type == 'move' ||
                        //(evalUnitAttack(unit,legalAction,dm.model) > evalUnitAttack(unit,bestAction[dest_code],dm.model)) || 
                        (evalUnitAttack(unit,legalAction,dm.model) > evalUnitAttack(unit,bestAction[dest_code],dm.model)) || 
                        (zas[unit.rodz] > 1)/* && (destdef > 0 && destdef > evatak*0.5)*/ && 
                            bestAction[dest_code].length <= 1 && legalAction[legalAction.length-1].type == 'aim'
                            //legalAction.length == 1 && bestAction[dest_code].length == 1 && zas[unit.rodz] == 1 && legalAction[0].type == 'move'  
                            /*
                            legalAction.length == 1 && bestAction[dest_code].length == 1 && bestAction[dest_code].type == 'move' && zas[unit.rodz] > 1 && legalAction[0].type == 'aim'
                            || 
                            legalAction.length > 1 && bestAction[dest_code].length >= 1 && bestAction[dest_code].type == 'move' && zas[unit.rodz] > 1/* && legalAction[0].rucho.length > zas[unit.rodz] && legalAction[1].type == 'aim'/* && bestAction[dest_code][0].type == 'move'*/){
                        
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
                        
                    //if(bestAction[dest_code][0].type == 'aim' && bestAction[dest_code].length == 1)
                        //console.log('nadzieja' + bestAction[dest_code].length)
                                                
                    destinationmap[dest_code].push({unit:unit, ix:j, action:bestAction[dest_code], hex:distmap.hex, potentialEmbarkings: distmap.potentialEmbarkings})
                }
            }
        }
    }
    
}
function tryPutUnderAttack(dm, x, y, color, destinies, thinkmore, embarkingTargets, behind_score){
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

//     var alreadyAttacking = {}
//     //alreadyAttacking[x+'#'+y] = true
//     
//     for(var key in distmaps){
//          var distmap = distmaps[key]
//          //if(!distmap.frontline)
//          //    continue
//          
//          for(var j in distmap.hex.units){
//              var unit = distmap.hex.units[j]
//              
//              if(unit.actions.length > 0 && (unit.actions[0].type == 'move' && unit.actions[0].destination[0] == x && unit.actions[0].destination[1] == y || unit.actions[unit.actions.length-1] != undefined && 
//                  unit.actions[unit.actions.length-1].type == 'aim' && /*unit.actions[unit.actions.length-1].destination && */unit.actions[unit.actions.length-1].hex_x == x && unit.actions[unit.actions.length-1].hex_y == y
//             ) ){
//                  alreadyAttacking[unit.x+'#'+unit.y] = true
//              }
//          }
//      }

    if(!destinationmap[code])
        return false
    var interestingUnits = destinationmap[code]
    
    
        
    //console.log(x,y,interestingUnits)

    //interestingUnits = interestingUnits.filter(x=>
    //    (x.action[0].type != 'move' || 
    //    (x.action[0].rucho.length/*-zas[x.unit.rodz]*/) / szy[x.unit.rodz] <= 2) && 
    //    (x.unit.actions.length == 0 || x.unit.actions[0].type == 'build' && x.unit.il > 50 ||
    //    (/*x.unit.actions[0].by != 'speculation2' && */(x.unit.actions[0].type == 'move' && (x.unit.actions[0].by != 'speculation2' || x.action[0].type != 'move' || (x.action[0].rucho.length) / szy[x.unit.rodz] <= 1) && x.action[0].type == 'move' && (/*x.action[0].rucho.length <= 2*szy[x.unit.rodz]+2 || */x.unit.actions[0].rucho.length > x.action[0].rucho.length+2)/* && x.unit.actions[0].type != 'move' && x.unit.actions[0].type != 'aim'*/))))
    
    /*
    interestingUnits = interestingUnits.filter(x=>
        (x.action[0].type != 'move'
        
        || (x.action[0].rucho.length) / szy[x.unit.rodz] <= 2)
            && (x.unit.actions.length == 0 
            
            || x.unit.actions[0].type == 'build' && x.unit.il > 40
            
            || x.unit.actions[0].type != 'move' && x.unit.actions[0].type != 'build'
                    //|| ((x.unit.actions[0].rucho.length) / szy[x.unit.rodz] <= 1)
            || (x.unit.actions[0].type == 'move' && x.action[0].type != 'aim' && x.unit.actions[0].by != 'speculation2' &&
                 ((x.unit.actions[0].rucho.length < szy[x.unit.rodz] || x.unit.actions[0].rucho.length > x.action[0].rucho.length || heks[x.unit.actions[0].destination[0]][x.unit.actions[0].destination[1]].z <= 0 || heks[x.unit.actions[0].destination[0]][x.unit.actions[0].destination[1]].undr == kolej)))
                    
            )
        )*/
        interestingUnits = interestingUnits.filter(x=>
        (x.action[0].type != 'move'
        
        || (x.action[0].rucho.length) / szy[x.unit.rodz] <= 2)
            && (x.unit.actions.length == 0 
            
            || x.unit.actions[0].type == 'build' && x.unit.il > 40
            
            || x.unit.actions[0].type != 'move' && x.unit.actions[0].type != 'build'
                    //|| ((x.unit.actions[0].rucho.length) / szy[x.unit.rodz] <= 1)
            || (x.unit.actions[0].type == 'move' && x.action[0].type != 'aim' && x.unit.actions[0].by != 'speculation2' &&
                 (x.action[0].type == 'aim' || (/*x.unit.actions[0].rucho.length < szy[x.unit.rodz] || */x.unit.actions[0].rucho.length > x.action[0].rucho.length/* || heks[x.unit.actions[0].destination[0]][x.unit.actions[0].destination[1]].z <= 0 || heks[x.unit.actions[0].destination[0]][x.unit.actions[0].destination[1]].undr == kolej*/)))
            )
        )
    //console.log(interestingUnits.map(a => new Object({type:a.action[0].type,by:a.action[0].by,rucho:a.action[0].type == 'move' ? a.action[0].rucho.length : null})))
    
    //console.log('filtered',interestingUnits)
    //console.log(interestingUnits.map(a => 1/Math.pow(2,a.action[0].rucho ? a.action[0].rucho.length : 0)*(a.action[0].il)))
    
    
    //interestingUnits.sort((a,b) => (a.action.il - b.action.il))

    //interestingUnits1 = interestingUnits.filter(x=>x.action.length == 0 || x.action[0].by == 'real')
    //interestingUnits2 = interestingUnits.filter(x=>x.action.length > 0 && x.action[0].by != 'real')
    //interestingUnits.sort((a,b) => (a.hex.dist - b.hex.dist))
    
    //interestingUnits = interestingUnits1.concat(interestingUnits2)
    
    if(interestingUnits.length == 0)
        return false
    
    //interestingUnits = interestingUnits.slice(0,8)
    //interestingUnits.sort((a,b) => -(1/Math.pow(1.4,(a.action[0].rucho ? (a.action[0].rucho.length/* + (a.action.length > 1 ? 0.5 : 0)*/)/szy[a.unit.rodz] : a.action[0].type == 'aim' ? 0 : 0))*(a.action[0].il) + 
    //                                 1/Math.pow(1.4,(b.action[0].rucho ? (b.action[0].rucho.length/* + (b.action.length > 1 ? 0.5 : 0)*/)/szy[b.unit.rodz] : b.action[0].type == 'aim' ? 0 : 0))*(b.action[0].il) ))
    
        
    interestingUnits.sort((a,b) => -(1/Math.pow(2,(a.action[0].rucho ? (a.action[0].rucho.length)/szy[a.unit.rodz] : 0))
    *(2-Math.pow(0.9,a.action[0].il+1)) + 
                                     1/Math.pow(2,(b.action[0].rucho ? (b.action[0].rucho.length)/szy[b.unit.rodz] : 0))
    *(2-Math.pow(0.9,b.action[0].il+1)) ))
    //console.log(interestingUnits.map((a) => [a.hex.x,a.hex.y,-1/Math.pow(1.4,(a.action[0].rucho ? (a.action[0].rucho.length + a.action.length > 1 ? 0.5 : 0)/szy[a.unit.rodz] : a.action[0].type == 'aim' ? 0 : 0))]))
    //console.log(interestingUnits)

    //interestingUnits = interestingUnits.filter(x=>x.action[0].type == 'aim' && zas[x.unit.rodz] > 1).concat(interestingUnits.filter(x=>!(x.action[0].type == 'aim' && zas[x.unit.rodz] > 1)))
    //console.log(interestingUnits)
    //console.log(interestingUnits,x,y)
    
    //interestingUnits = interestingUnits.slice(0,10)
    
    //if(failedUses[x+'#'+y] > 0){
    //    interestingUnits = interestingUnits.slice(failedUses[x+'#'+y])
    //}
    
    //console.log("iul:\t" + interestingUnits.length)
    var oldEmbarkingTargets = {}
    Object.assign(oldEmbarkingTargets,embarkingTargets)
    
    evaluate(dm,embarkingTargets)
    
    var modif = {}
    var score1 = scoreOfBehinds(dm,kolej,behind_score)
    
    
    var valuesByTime = dm.distmaps[code].alliegance.slice()
    for(var t in valuesByTime){
        valuesByTime[t] = valuesByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0 
    }
    var value1 = valuesByTime.reduce((a,b) => a+b, 0)
//    for(var i = 0;i<MAX_TURNS;i++){ score1 += Math.pow(1/2.1,dm.score[kolej][i]) }
    
    //var score__1 = getScore(dm)
    //score_1 = calculateStrategicMapForTeam(large_map, dm, kolej, modif)
    //var backup = getScoresAndAlliegances(dm)
    var postęp = 0
    
    var oldActionArrayUnits = []
    var oldActionArrayActions = []
    var value2
    var fails = 0
    for(var i in interestingUnits){
        var unitaction = interestingUnits[i]
        
        oldActionArrayUnits.push(unitaction.unit)
        oldActionArrayActions.push(unitaction.unit.actions)
    }
    var interestingUnitsHexCodes = interestingUnits.map(x=>x.hex.x+'#'+x.hex.y)

    var destiny = unitaction.action[0].destination[0]+'#'+unitaction.action[0].destination[1]

    var addedEmbarkigns = []
    var alreadyAttacking = {}
    alreadyAttacking[destiny] = true
    
    addDestinies(alreadyAttacking,destinies,destiny)
    
    var lost = false
    for(var i in interestingUnits){
        var unitaction = interestingUnits[i]
        
        //console.log(unitaction.potentialEmbarkings)
        
        //if((unitaction.unit.actions.length > 0 && (unitaction.unit.actions[0].by == 'speculation2'/* || unitaction.unit.actions[0].by == 'real'/* && !thinkmore*/) && (unitaction.unit.actions[0].type == 'aim' || unitaction.unit.actions[0].type == 'move'))){
        //    console.log('ech1')
        //    continue
        //}
            
        
        //console.log(unitaction.potentialEmbarkings)
        var oldaction = unitaction.unit.actions
        var bark = null
        var oldEmbarkingAction = null
        
        var oldEmbarkingCode = null
        
        var hexcod = unitaction.hex.x+'#'+unitaction.hex.y
        
        
        alreadyAttacking[hexcod] = true
        addDestinies(alreadyAttacking,destinies,hexcod)

        
        evaluate(dm,embarkingTargets,alreadyAttacking)
        
        var valuesByTime = dm.distmaps[code].alliegance.slice()
        for(var t in valuesByTime){
            valuesByTime[t] = valuesByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0 
        }
        var value = valuesByTime.reduce((a,b) => a+b, 0)
        
        unitaction.unit.actions = unitaction.action.map(x=>Object.assign(new Object(),x))
        //addAllDestinies(dm,alreadyAttacking)
        //console.log('bz',unitaction.action)
        
        if(unitaction.action[0].embarking != null){
            var obj = addEmbarking(unitaction,embarkingTargets,distmaps,hexcod,dm,oldActionArrayUnits,oldActionArrayActions,addedEmbarkigns,bark,oldEmbarkingCode,oldEmbarkingAction)
            if(obj == null){
                unitaction.unit.actions = oldaction.map(x=>Object.assign(new Object(),x))
                continue
            } else {
                bark = obj.bark
                oldEmbarkingCode = obj.oldEmbarkingCode
                oldEmbarkingAction = obj.oldEmbarkingAction
            }
        }
        
        
        evaluate(dm,embarkingTargets,alreadyAttacking)
        
        //alreadyAttacking[hexcod] = unitaction//,null,alreadyAttacking,x+'#'+y)
        //delete alreadyAttacking[hexcod] 
        var values2ByTime = dm.distmaps[x+'#'+y].alliegance.slice()
        
        lost = lost || unitaction.hex.heks.z > 0 && dm.distmaps[unitaction.hex.x+'#'+unitaction.hex.y].alliegance[MAX_TURNS-1] != color

        for(var t in values2ByTime){
            values2ByTime[t] = values2ByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0
        }
        value2 = values2ByTime.reduce((a,b) => a+b, 0)
        

        //if(i > 0){
        //    console.log(i,value,value2)
        //}
        //console.log('a',value2,value)
        var evaluated = false
        //console.log('val: '+value2+' '+value)
        
        var score2 = scoreOfBehinds(dm,kolej,behind_score)
        if(score2 > score1 && value2 >= value){
            console.log('ok1',value2,value,score2,score1)
            break
        }
        if(value2 > value && score2 == score1/* || lost*/){
            console.log('ok1.5',value2,value,score2,score1)
            break
        }
            //evaluate(dm)
            /*
            var values2ByTime = dm.distmaps[x+'#'+y].alliegance.slice()

            for(var t in values2ByTime){
                values2ByTime[t] = values2ByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0
            }
            value2 = values2ByTime.reduce((a,b) => a+b, 0)
            evaluated = true
            if(value2 > value){
                break
            }*/
        //}
//        for(var j = 0;j<MAX_TURNS;j++){ score2 += Math.pow(1/2.1,dm.score[kolej][j]) }
        
        //score_2 = calculateStrategicMapForTeam(large_map, dm, kolej, modif)
            
        //console.log([value2,value],[score2,score1])
        //if(value2 < value || score2 < score1 && value2 <= value || lost){
        //    if(!evaluated){
                //evaluate(dm)
        //    }/*
        /*    var values2ByTime = dm.distmaps[x+'#'+y].alliegance.slice()

            for(var t in values2ByTime){
                values2ByTime[t] = values2ByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0
            }
            value2 = values2ByTime.reduce((a,b) => a+b, 0)*/
            //if(value2 < value){
            if(value2 < value/* || score2 < score1 && value2 <= value/* || lost*/){
            console.log('ech2')
                unitaction.unit.actions = oldaction.map(x=>Object.assign(new Object(),x))
                if(bark != null){
                    bark.actions = oldEmbarkingAction
                    embarkingTargets[oldEmbarkingCode]--
                }
                addedEmbarkigns = addedEmbarkigns.filter(x=>x!=bark)
                //break
            }
            
            //fails++
            //if(fails > 5){
            //    break
            //}
        //}
    }
    evaluate(dm,embarkingTargets)
    values2ByTime = dm.distmaps[x+'#'+y].alliegance.slice()
    for(var t in values2ByTime){
        values2ByTime[t] = values2ByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0
    }
    value2 = values2ByTime.reduce((a,b) => a+b, 0)
    
//    if(value2 == undefined || value2 <= value && !(score2 > score1 && value2 >= value)/* || lost*/){
    if(value2 == undefined || score2 <= score1 && !(value2 > value1 && score2 == score1)/* || lost*/){
        console.log('ech3',value2,value,color)
        for(var i in oldActionArrayUnits){
            oldActionArrayUnits[i].actions = oldActionArrayActions[i].map(x=>Object.assign(new Object(),x))
        }
        
        Object.assign(embarkingTargets,oldEmbarkingTargets)
        evaluate(dm,embarkingTargets)
        //setScoresAndAlliegances(dm,backup)
        return false
    }
        
    return true
    
}
function getScore(dm){
    var score = 0
    
    for(var j = 0;j<MAX_TURNS;j++){ score += Math.pow(1/2.1,dm.score[kolej][j]) }
    
    return score
}

function addEmbarking(unitaction,embarkingTargets,distmaps,hexcod,dm,oldActionArrayUnits,oldActionArrayActions,addedEmbarkigns,bark,oldEmbarkingCode,oldEmbarkingAction){
    var embarkingcode = unitaction.action[0].embarking.x + '#' + unitaction.action[0].embarking.y

    if(embarkingcode in embarkingTargets && embarkingTargets[embarkingcode] > 2){
        return null
    }
    
    var waiting = Infinity
    if(hexcod in distmaps && distmaps[hexcod].hex.heks.z > 0){ 
        var unitNeeded = unitaction.unit.il
        var satisfied = 0
        for(var j = 0;j<distmaps[hexcod].hex.units.length;j++){
            var unit = distmaps[hexcod].hex.units[j]
            if(szyt[unit.rodz] == 'w' && zast[unit.rodz] == 'x' && unit.rozb > 0){
                unitNeeded -= unit.il
                satisfied += unit.rozb + unit.il
            }
        }
        
        if(satisfied >= unit.il - 10){
            waiting = Math.max( 0, Math.ceil( unitNeeded / (distmaps[hexcod].hex.heks.z / 15) ) )
        }
        //if(Math.abs(unitNeeded) + Math.abs(satisfied) + Math.abs(waiting) > 0)
        //    console.log(unitNeeded, satisfied, waiting)

    }
    var goodEmbarkings = unitaction.potentialEmbarkings.filter(x=>x.embarking == embarkingcode && x.distmap in dm.distmaps && (dm.distmaps[x.distmap].hex.units[x.unitIndex].actions.length == 0 /*|| !(dm.distmaps[x.distmap].hex.units[x.unitIndex].actions[0].embarking in embarkingTargets)*/) && x.turn < waiting)
    
    //if(oldEmbarkingCode === undefined){
    //    console.log(hexcod)
    //    console.log(unitaction.potentialEmbarkings)
    //}
    var betterEmbarkings = goodEmbarkings.filter(x=>x.move[0].il >  unitaction.action[0].il-20)
                    .concat( goodEmbarkings.filter(x=>x.move[0].il <= unitaction.action[0].il-20) ).sort((a,b)=>a.turn-b.turn) 
                    
    var betterEmbarkings2 = []
    for(var j in betterEmbarkings){
        if(betterEmbarkings[j].distmap in dm.distmaps){
            var units = dm.distmaps[betterEmbarkings[j].distmap].hex.units
            var ok = true
            for(var k in units){
                var unit = units[k]
                if(k != betterEmbarkings[j].unitIndex && (szyt[unit.rodz] != 'w' || zast[unit.rodz] != 'x') && unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].embarking != null){
                    ok = false 
                    break
                }
            }
            if(ok)
                betterEmbarkings2.push(betterEmbarkings[j])
        }
    }
    betterEmbarkings = betterEmbarkings2


    if(betterEmbarkings.length > 0){
        bark = dm.distmaps[betterEmbarkings[0].distmap].hex.units[betterEmbarkings[0].unitIndex]
        oldEmbarkingAction = bark.actions
        oldEmbarkingCode = embarkingcode
        bark.actions = betterEmbarkings[0].move.map(x=>Object.assign(new Object(),x))
        //if(oldEmbarkingAction == undefined)
        //    console.log('added')
        betterEmbarkings[0].move.il = unitaction.action[0].il
        
        if(!(embarkingcode in embarkingTargets)){
            embarkingTargets[embarkingcode]++
        }
        
        oldActionArrayUnits.push(bark)
        oldActionArrayActions.push(oldEmbarkingAction)
        
        addedEmbarkigns.push(bark)
    }
    return {bark:bark,oldEmbarkingCode:oldEmbarkingCode,oldEmbarkingAction:oldEmbarkingAction}
}
function tryRemoveUnnecessaryPaths(dm,color,embarkingTargets){
    
    var distmaps = dm.distmaps
    var embarkingTargets = getEmbarkingTargets(dm,kolej)

    evaluate(dm,embarkingTargets)
    var destMap = {}
    for(var key in distmaps){
         var distmap = distmaps[key]
         //if(!distmap.frontline)
         //    continue
         
         if(distmap.hex.dru != color)
             continue
             
         for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            
            
            var path = getLeadedPath(distmap.hex.x,distmap.hex.y,unit.ruchk,unit.rucho)
            
            if(path == undefined)
                continue
                
            var oks = true
            var jhex = null
            var jndex = -1
            
            /*
                                var onland = hex.z != -1
                                var embarkingPossible = 0
                                var lastFieldX = distmap.hex.x
                                var lastFieldY = distmap.hex.y
                                var addEmbarkingPossibility = false
                                var embarkingOnPlace = false
                                for(var k=0;k<path.path.length-1;k++){
                                    
                                    if(unitAttackStrength2 <= 0)
                                        break
                                    
                                    var field = path.path[k]
                                    var code2 = field.x+'#'+field.y
                                        
                                    if(code2 in distmaps && distmaps[code2].hex.dru == -1 && distmaps[code2].hex.z <= 0)
                                        continue
                                        
                                    if(code2 in distmaps && distmaps[code2].hex.units.length == 4 && distmaps[code2].hex.dru == unit.d){
                                        unitAttackStrength2 = 0
                                        break
                                    }
                                    
                                    addEmbarkingPossibility = false
                                    embarkingOnPlace = false
                                    
                                    if(onland && heks[lastFieldX][lastFieldY].z != -1 && heks[field.x][field.y].z == -1){
                                        onland = false
                                        addEmbarkingPossibility = true
                                        if(heks[lastFieldX][lastFieldY].z > 0 && action.by != 'real' || field.x+'#'+field.y in embarkingTargets || lastFieldX+'#'+lastFieldY in embarkingTargets){
                                            console.log('delayed')
                                            embarkingDelay += 4
                                        } else {
                                            console.log('stopped')
                                            embarkingDelay = Infinity
                                        }
                                        
                                        if(heks[lastFieldX][lastFieldY].z > 0 && heks[field.x][field.y].z == -1){
                                            embarkingOnPlace = true
                                        }
                                    }
                                    if(!onland && heks[lastFieldX][lastFieldY].z == -1 && heks[field.x][field.y].z != -1)
                                        onland = true
             * */
            
            var lastx = distmap.hex.heks.x
            var lasty = distmap.hex.heks.y
            
            var onland = distmap.hex.heks.z != -1

            //console.log('eta:',embarkingTargets)
            for(var k in path.path){
                var hx = path.path[k]
                if(unit.actions.length > 0 && unit.actions[0].embarking != null && (unit.szyt == 'n' || unit.szyt == 'c' || unit.szyt == 'g')){
                    //console.log(lastx,lasty,hx.x,hx.y,onland,heks[lastx][lasty].z,heks[hx.x][hx.y].z)
                    if(onland && heks[lastx][lasty].z != -1 && heks[hx.x][hx.y].z == -1){
                        //console.log(1)
                        onland = false
                        
                        if(!(hx.x+'#'+hx.y in embarkingTargets) && !(lastx+'#'+lasty in embarkingTargets)){
                            //console.log(2)
                            oks = false
                        }
                    }
                    
                    if(!onland && heks[lastx][lasty].z == -1 && heks[hx.x][hx.y].z != -1)
                        onland = true
                }
                if(unit.actions.length > 0 && szyt[unit.rodz] == 'w' && zast[unit.rodz] == 'x' && hx.undr != unit.d && hx != -1){
                    oks = false
                }
                    
                if(k >= 0 && /*j < path.path.length-1 && */heks[hx.x][hx.y].unp > 3 && heks[hx.x][hx.y].undr == kolej){
                    oks = false
                    jhex = hx
                    break
                }
                lastx = hx.x
                lasty = hx.y
            }
            if(!oks){
                console.log('usunięte')
                var uni = heks[distmap.hex.heks.x][distmap.hex.heks.y].unt[j]
                var unit2 = unix[kolej][uni]
                if(zaznu != -1){
                    odzaznaj(false)
                    aktdroguj(kolej,zaznu)
                    unit2.sebix = unit2.x
                    unit2.sebiy = unit2.y
                    zaznu = -1
                    /*
                    zaznx = -1
                    zazny = -1
                    tx = -1
                    ty = -1*/
                }
                    
                
                unix[kolej][uni].sebix = unix[kolej][uni].x
                unix[kolej][uni].sebiy = unix[kolej][uni].y
                tx = -1
                ty = -1
                zaznu = -1
                zaznu = uni
                zaznaj(uni,false)
                odceluj(uni,kolej);
                oddroguj(uni,kolej,false);
                odzaznaj(false)
                aktdroguj(kolej,zaznu)
                unit.sebix = unit.x
                unit.sebiy = unit.y
                zaznu = -1
                
            }
         }
     }
}
function tryRemoveUnnecessaryBuilds(dm,color){
    
    var distmaps = dm.distmaps
    var embarkingTargets = getEmbarkingTargets(dm,kolej)

    evaluate(dm,embarkingTargets)
    var destMap = {}
    for(var key in distmaps){
         var distmap = distmaps[key]
         //if(!distmap.frontline)
         //    continue
         
         if(distmap.hex.dru != color)
             continue
             
         for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            
            
            var path = getLeadedPath(distmap.hex.x,distmap.hex.y,unit.ruchk,unit.rucho)
            
            if(path == undefined)
                continue
                
            var oks = true
            
            var hexes_to_remove = []
            for(var k in path.path){
                var hx = path.path[k]
                
                if(k > 0 && /*j < path.path.length-1 && */heks[hx.x][hx.y].unp > 3 && heks[hx.x][hx.y].undr == kolej){
                    oks = false
                    hexes_to_remove.push(hx)
                }
            }
            if(!oks){
                for(var k in hexes_to_remove){
                    var hex_to_remove = heks[hexes_to_remove[k].x][hexes_to_remove[k].y]
                    
                    for(var l=0;l<hex_to_remove.unp;l++){
                        if(unix[kolej][hex_to_remove.unt[l]].rozb > 0 && unix[kolej][hex_to_remove.unt[l]].il == 0){
                            hex_to_remove.usun(l)
                            l--
                        }
                    }
                }
            }
         }
     }
}

function prepareAllDestinies(dm){
    var destinymap = {}
    
    var distmaps = dm.distmaps
    for(var key in distmaps){
        var distmap = distmaps[key]
        
        
        for(var i in distmap.hex.units){
            var unit = distmap.hex.units[i]
            
            if(unit.actions.length > 0){
                
                for(var j in unit.actions){
                    var action = unit.actions[j]
                    if(action.type == 'move' && action.destination != undefined/* && j == unit.actions.length - 1*/ && zast[unit.rodz] != 'x'){
                        var code = action.destination[0]+'#'+action.destination[1]
                        
                        if(!(code in destinymap))
                            destinymap[code] = {}
                        destinymap[code][key] = true
                        /*
                        path = action.leadedPath
                        for(var k=0;k<path.path.length-1;k++){
                            
                        }*/
                    } else if(action.type == 'aim' && action.hex_x != null){
                        var code = action.hex_x+'#'+action.hex_y
                        
                        if(!(code in destinymap))
                            destinymap[code] = {}
                        destinymap[code][key] = true

                    }
                }
            }
        }
                                    
    }
    return destinymap
}

function addDestinies(alreadyAttacking,destinies,hexcod){
    if(hexcod in destinies){
        for(var key in destinies[hexcod]){
            alreadyAttacking[key] = true
        }
    }
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
        
        embarkingDestinations = {}
        
        for(var j in unix[kolej]){
            var unit = unix[kolej][j]
            if(unit.d != color || unit.x == -1)
                continue
                
            if(unit.rodz == 8){
                var cords = leadPath(unit.x,unit.y,unit.ruchk,unit.rucho)
                
                if(cords == undefined)
                    continue
                var cod = cords[0]+'#'+cords[1]
                if(!(cod in embarkingDestinations))
                    embarkingDestinations[cod] = 0
                embarkingDestinations[cod]+=unit.il
            }
        }
        for(var key in distmaps){
            var distmap = distmaps[key]
            //if(!distmap.frontline)
            //    continue
            
            var potentialEmbarkingSet = {}
            
            for(var i in distmap.potentialEmbarkings){
                var el = distmap.potentialEmbarkings[i]
                if(el.distmap in dm.distmaps){
                    if(!(el.embarking in potentialEmbarkingSet))
                        potentialEmbarkingSet[el.embarking] = 0
                    potentialEmbarkingSet[el.embarking] = Math.max(potentialEmbarkingSet[el.embarking], el.move[0].il)
                }
                
            }
            
                
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
                        unix[kolej][unid].rozb = 0
                        unid = divideUnit(unid,unit.il - properAction.il,false)
                        
                    }
                    if(unid != -1){
                                            //var pemb = {distmap:key, dru:unit.d, embarking:hexkey, unitIndex:j, turn:turn, move:move}

                        var dodajTratwe = putPath(unid,distmap,properAction.destination[0],properAction.destination[1],undefined,completely_used_passages)
                        if(dodajTratwe && unit.szyt != 'w' && unit.szyt != 'l'){
                            if(properAction.embarking != null && (!(properAction.embarking.x+'#'+properAction.embarking.y in potentialEmbarkingSet) || potentialEmbarkingSet[properAction.embarking.x+'#'+properAction.embarking.y] < Math.max(1,unit.il - 20))){
                                tratwa -= -properAction.il
                            } else
                                console.log('bbbbbbb')
                        }
                        unix[kolej][unid].rozb = 0
                        
                        if(tratwa == 0 && unit.szyt != 'w' && unit.szyt != 'l' && properAction.embarking != null && !(properAction.embarking.x+'#'+properAction.embarking.y in embarkingDestinations) && distance(properAction.embarking.x,properAction.embarking.y,distmap.hex.heks.x,distmap.hex.heks.y) <= 1){
                            tratwa -= -unit.il
                        }
                    }
                    

                } else if(unit.actions.length == 1 && unit.actions[0].type == 'aim'){
                    var action2 = unit.actions[0]
                    
                    var unid = unit.id
                    if(action2.il < unit.il){
                        unix[kolej][unid].rozb = 0
                        unid = divideUnit(unid,unit.il - action2.il,false)
//                        if(unid == -1)
//                            continue
                    }
                    if(unid != -1){
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
                            aktdroguj(kolej,zaznu);
                            zaznu = -1
                        }
                        zaznx = -1;zazny = -1;
                        tx = -1
                        ty = -1
                        unix[kolej][unid].rozb = 0
                    }


                } else if(unit.actions.length == 2 && unit.actions[0].type == 'move' && unit.actions[1].type == 'aim'){
                    var action1 = unit.actions[0]
                    var action2 = unit.actions[1]
                    
                    var unid = unit.id
                    if(action1.il < unit.il){
                        unix[kolej][unid].rozb = 0
                        unid = divideUnit(unid,unit.il - action1.il,false)
                    }
                    if(unid != -1){
                        var stopBefore = 1
                        if((zast[unit.rodz] == 'n' || zast[unit.rodz] == 'p' || zast[unit.rodz] == 'l') && zas[unit.rodz] > 1)
                            stopBefore = zas[unit.rodz]
                            
                        var dodajTratwe = putPath(unid,distmap,action1.destination[0],action1.destination[1],stopBefore,completely_used_passages)

                        //if(dodajTratwe && unit.szyt != 'w' && unit.szyt != 'l'/* && !(action1.embarking != null && action1.embarking.x+'#'+action1.embarking.y in distmap.potentialEmbarkings)*/)
                        //    tratwa -= -action1.il
                            
                        //{type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,destination:[distmap.hex.x,distmap.hex.y]},

                        if(dodajTratwe !== null){
                            zaznu = unid
                            //var cords = leadPath(distmap.hex.x,distmap.hex.y,action1.ruchk,action1.rucho,stopBefore)
                            tx = unix[kolej][zaznu].sebix
                            ty = unix[kolej][zaznu].sebiy
                            
                            if(distance(unix[kolej][zaznu].sebix,unix[kolej][zaznu].sebiy,unix[action2.celd][action2.celu].x,unix[action2.celd][action2.celu].y) <= zas[unix[kolej][zaznu].rodz]){
                                
                                if(zaznu!=-1){
                                    celuj(unix[kolej][zaznu].sebix,unix[kolej][zaznu].sebiy,action2.celd,action2.celu,false);
                                    
                                    heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana++;
                                    unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
                                    unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
                                    if(tx != -1)
                                        odzaznaj(false);
                                    aktdroguj(kolej,zaznu);
                                    zaznu = -1
                                    zaznx = -1
                                    zazny = -1
                                    tx = -1
                                    ty = -1
                                }
                                unix[kolej][unid].rozb = 0
                            }
                            
                        }
                    }
                }
                
                if(unit.actions.length == 0){
                    putPath(unit.id,distmap,unit.x,unit.y)
                    unix[kolej][unit.id].rozb = 0
                }
                if(tx != -1)
                odzaznaj(false)
                zaznu = -1;
                zaznx = -1;zazny = -1;
                tx = -1
                ty = -1
                unit.sebix = unit.x
                unit.sebiy = unit.y
                aktdroguj(kolej,zaznu)
                changeState(2)
            }
            if(tratwa > 0 && !bloknia[kolej][8]){
                //function dodai(unx,uny,ilo,typ,rosn){
                console.log('tratwa:',tratwa)
                if(heks[distmap.hex.x][distmap.hex.y].z >= 1){
                    var kv = -1
                    for(var i = 0;i<distmap.hex.unp;i++){
                        if(unix[kolej][heks[distmap.hex.x][distmap.hex.y].unt[i]].rodz != 8 && unix[kolej][heks[distmap.hex.x][distmap.hex.y].unt[i]].il == 0 && unix[kolej][heks[distmap.hex.x][distmap.hex.y].unt[i]].rozb > 0){
                            kv = i
                            unix[kolej][heks[distmap.hex.x][distmap.hex.y].unt[i]].rozb = 0
                        }
                    }
                    if(kv != -1)
                        heks[distmap.hex.x][distmap.hex.y].usun(kv)
                    const sustainable_tratwa_growth = 99//Math.min(99, Math.floor(distmap.hex.z * 2 / 4))
                    if(heks[distmap.hex.x][distmap.hex.y].unp == 4 && unix[kolej][heks[distmap.hex.x][distmap.hex.y].unt[3]].rodz != 8){
                        heks[distmap.hex.x][distmap.hex.y].usun(3)
                    }
                    dodai(distmap.hex.x,distmap.hex.y,0,8,Math.min(Math.floor(tratwa),sustainable_tratwa_growth))
                    heks[distmap.hex.x][distmap.hex.y].tasuj()
                }/* else {
                    for(var i = 0;i<distmap.hex.unp;i++){
                        unix[kolej][heks[distmap.hex.x][distmap.hex.y].unt[i]].rozb = 0
                    }
                    heks[distmap.hex.x][distmap.hex.y].zpl = 50 - distmap.hex.z
                    kupuj(distmap.hex.x,distmap.hex.y)
                }*/
            }
        }
        
    }
}

function unitActionDistant(action, unit){
    var dist = action[0].rucho.reduce((a,b)=>a+b,0)
                        
    var time = Math.ceil(dist/szy[unit.rodz])

    return time > 2
}

function tryGetFarUnitsToFront(realSfKeys, farFromFront, allowPaths, dfrou,failedvvals,realSfKeysOriginal){
    
    var fffdict = {}
//    farFromFront.sort((a,b)=>-a.il/Math.pow(2.1,a.time)+b.il/Math.pow(2.1,b.time))
    farFromFront.sort((a,b)=>a.time-b.time)
    
    var possibleUnitActions = {}
    for(var key in realSfKeysOriginal){
        possibleUnitActions[key] = []
    }
    
    var distmaps = dfrou.distmaps
    for(var i in farFromFront){
        var fff = farFromFront[i]
        fffdict[fff.code+'#'+fff.unitIx] = fff.time
        //farFromFront is {code:key,unitIx:i,time:mintime}

        if(fff.code in distmaps){
            var distmap = distmaps[fff.code]
            
            var unit = distmap.hex.units[fff.unitIx]
            
            if(unit.il < 40){
                continue
            }
            //console.log('b1',fff.code)
            if(zast[unit.rodz] == 'x' || zast[unit.rodz] == 'm'){
                continue
            }
            //console.log('b2',fff.code)
            
            if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                //if(unit.actions[0].by == 'speculation')
                    continue
                                
                /*
                var udistx2 = unit.actions[0].destination[0]
                var udisty2 = unit.actions[0].destination[1]
                var cod = udistx2+'#'+udisty2
                if(cod in distmaps && (distmaps[cod].alliegance[0] == kolej || distmaps[cod].alliegance[0] == -1 && distmaps[cod].hex.heks.z <= 0))
                    continue
                  */
            }/*
            if(unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].rucho.length / szy[unit.rodz] <= 2){
                continue
            }*/
            //console.log('b3',fff.code)
            
            var actionil = false
            
            if(distmap.hex.heks.z > 0){
                if(unit.actions.length > 0 && unit.actions[0].type == 'move' && distmap.hex.units[0] == unit && unit.actions[0].il > unit.il-10 && fff.unitIx == distmap.hex.units.length-1){
                    //console.log('c3.5',fff.code)
                    continue
                }
                var moving = 0
                for(var j in distmap.hex.units){
                    if(j != fff.unitIx && distmap.hex.units[j].actions.length != 0 && distmap.hex.units[j].actions[0].type == 'move' && distmap.hex.units[j].actions[0].il >= distmap.hex.units[j].il){
                        moving++
                    }
                }
                if(moving >= distmap.hex.units.length-1){
                    //console.log('c3.6',fff.code)
                    actionil = true
                }
            }
            //console.log('b4',fff.code)
                
                /*
            if(unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].rucho.length/szy[unit.rodz] <= 2)
                continue
                */
            //console.log('b5',fff.code)
             
            var udistx = distmap.hex.x
            var udisty = distmap.hex.y
            var udistx2 = distmap.hex.x
            var udisty2 = distmap.hex.y
            var time = 0
            if(unit.actions.length > 0 && unit.actions[0].type == 'move'){
                
                udistx2 = unit.actions[0].destination[0]
                udisty2 = unit.actions[0].destination[1]
            }
                
                var locked = heks[udistx][udisty].unp >= 4 && false
                
                if(!locked){
                    var dist = unit.actions.length > 0 && unit.actions[0].type == 'move' ? unit.actions[0].rucho.length : 0
                    var time = (dist/*-zas[unit.rodz]+1*/)/(szy[unit.rodz])
                    //if(time <= 1 && dist > 0)
                    //    continue
                        

                    var ok = true
                    var disttime,disttime2
                    for(var key in realSfKeysOriginal){
                        if(szyt[unit.rodz] != 'c' || heks[realSfKeysOriginal[key].hex.x][realSfKeysOriginal[key].hex.y].z != -2){
                            //console.log('czyjest',unit.actions[0].destination[0]+'#'+unit.actions[0].destination[1] in dfrou.distmaps)
                            var disttime = Math.max(0,distance(realSfKeysOriginal[key].hex.x,realSfKeysOriginal[key].hex.y,udistx,udisty)-Math.max(0,zas[unit.rodz]-1))/szy[unit.rodz]
                            var disttime2 = Math.max(0,distance(realSfKeysOriginal[key].hex.x,realSfKeysOriginal[key].hex.y,udistx2,udisty2)-Math.max(0,zas[unit.rodz]-1))/szy[unit.rodz]

                            if(disttime < 2 || disttime2-szy[unit.rodz] > disttime && dist > 0/* && unit.actions.length > 0 && unit.actions[0].type == 'move' && unit.actions[0].rucho.length > 0*/){
                                ok = false
                                break
                            }
                        }
                    }
                    if(!ok){
                        //console.log('onje', disttime, disttime2)
                        continue
                    }
                }
            //}
            
            //console.log('b6',fff.code)
            
            var possibleDestinations = {}
            for(var j in unit.legalActions){
                var lac = unit.legalActions[j]
                if(lac[0].type == 'move' && lac.length == 1 && lac[0].il >= unit.il-10){
                    var dest = lac[0].destination[0]+'#'+lac[0].destination[1]
                    if(dest in realSfKeysOriginal)
                        possibleDestinations[dest] = true
                }
            }
            var heavy = szyt[unit.rodz] == 'c'
            var possible = {}
            for(var key1 in realSfKeysOriginal){
                if(key1 in possibleDestinations){
                    possible[key1] = realSfKeysOriginal[key1]
                    for(var key2 in realSfKeysOriginal){
                        //console.log(key1, key2, dfrou.distmaps[key2].alliegance)
                        if(key2 in possibleDestinations && key1 != key2 && key2 in dfrou.distmaps && (szyt[unit.rodz] != 'c' || (heks[realSfKeysOriginal[key1].hex.x][realSfKeysOriginal[key1].hex.y].z != -2 && heks[realSfKeysOriginal[key2].hex.x][realSfKeysOriginal[key2].hex.y].z != -2))/* && dfrou.distmaps[key2].alliegance[MAX_TURNS-1] != -1/* && dfrou.distmaps[fff.code].alliegance[MAX_TURNS-1] != kolej*/){
                            var d1 = distmapsearch(dfrou,fff.code,key1,unit.rodz)
                            var d2 = distmapsearch(dfrou,fff.code,key2,unit.rodz)
                            var d3 = distmapsearch(dfrou,key1,key2,unit.rodz)

                            //console.log('uuokb',[d1,d2,d3,(d2+d3)*0.7,(d1+d3)*0.7])
                            if(d1 == null){
                                //delete possible[key1]
                                //break
                            }
                            if(d1 != null && d2 != null && d3 != null && d2 != -1 && d3 != -1 && d1 - szy[unit.rodz] > d2 && d1 > szy[unit.rodz] && d1 > (d2+d3) * 0.7 && !(d2 > (d1+d3) * 0.7)){
                                delete possible[key1]
                                break
                            }
                        }
                    }
                }
            }
            /*
            for(var key1 in possible){
                possible[key1] = possible[key1]
                for(var key2 in possible){
                    if(key1 != key2){
                        var d1 = distmapsearch(dfrou,fff.code,key1,unit.rodz)
                        var d2 = distmapsearch(dfrou,fff.code,key2,unit.rodz)
                        
                        if(d1 > d2/0.7){
                            delete possible[key1]
                            break
                        }
                    }
                }
            }*/
            //console.log('ulega',unit.legalActions)
            for(var j in unit.legalActions){
                var lac = unit.legalActions[j]
                if(lac[0].type == 'move' && lac.length == 1 && (lac[0].il < unit.il || !actionil)){
                    var dist = lac[0].rucho.length
                    var time = (dist-zas[unit.rodz])/(szy[unit.rodz])
                    /*
                    if(unit.actions.length > 0 && unit.actions[0].type == 'move' && dist > unit.actions[0].rucho.length){     
                        console.log('c6')                   
                        continue
                    }*//*
                    if(distmap.hex.units.length == 4 && lac[0].il < unit.il){
                        continue
                    }*/

                    var lade = lac[0].destination[0]+'#'+lac[0].destination[1]

                    var fcode = fff.code+'#'+fff.unitIx+'#'+lade
                    
                    //if(fcode in failedvvals){
                    //    continue
                    //}
                    
                    if(warnung(distmap,unit,lac,fff.unitIx,true)){
                        continue
                    }
                        
                    //if(!allowPaths[fff.code+'#'+lade])
                    //    continue

                    if(time >= 1 && lade in possible){
                        
                        if(lac[0].embarking != null && !((lade in dfrou.distmaps) && (dfrou.distmaps[lade].alliegance[MAX_TURNS-1] == kolej || dfrou.distmaps[lade].alliegance[MAX_TURNS-1] == -1))){
                            var cont = false
                            for(var ik = 1;ik<4;ik++){

                                if(lac[0].leadedPath.path.length - ik >= 0){
                                    //console.log(heks[lac[0].leadedPath.path[lac[0].leadedPath.path.length-1-ik].x][lac[0].leadedPath.path[lac[0].leadedPath.path.length-1-ik].y].z)
                                    if(heks[lac[0].leadedPath.path[lac[0].leadedPath.path.length-ik].x][lac[0].leadedPath.path[lac[0].leadedPath.path.length-ik].y].z == -1){
                                        cont = true
                                    }
                                }
                            }
                            if(cont)
                                continue
                        }
                        //console.log('ababababaggg',lade,lac[0].embarking,dfrou.distmaps[lade].alliegance[MAX_TURNS-1],dfrou.distmaps[lade].alliegance[MAX_TURNS-1])
                        /*
                        for(var key in realSfKeys){
                            if(key != lade){
                                
                            }
                        }*/
                        //console.log(['xle', fff.code, lade])
                        
                        possibleUnitActions[lade].push({hex_from:fff.code,hex_to:lade,unitIx:fff.unitIx,action:lac,time:time,unitrodz:unit.rodz})
                    } else if(lade in possible) {
                        //console.log(['xle2', time, fff.code, lade])
                        //console.log(time,lade,lade in possible)
                    }
                }
            }
        }
    }
    for(var key in possibleUnitActions){
        if(possibleUnitActions[key].length == 0)
            delete possibleUnitActions[key]
    }
    //console.log(possibleUnitActions)
    return possibleUnitActions
        /*
        for(var i in destinationmap[key]){
            var dmapelem = destinationmap[key][i]
            //if(!this.unitActionDistant(dmapelem.action,dmapelem.unit))
            //    continue
            var newkey = dmapelem.hex.x+'#'+dmapelem.hex.y
            
            console.log(newkey+'#'+dmapelem.ix, fffdict)
            if(newkey+'#'+dmapelem.ix in fffdict){
                var time = fffdict[newkey+'#'+dmapelem.ix]
                
                possibleUnitActions[key].push({dmapelem:dmapelem,time:time})
            }
        }
        */
    //    possibleUnitActions[key].sort((a,b)=>a.time-b.time)
        
    //}
    
}

function distmapsearch(dfrou,key1,key2,unitrodz){
    if(!(szyt[unitrodz] in dfrou.distmaps[key1].maps))
        return null
    var maps = dfrou.distmaps[key1].maps[szyt[unitrodz]].hexmap
    
    for(var i in maps){
        var hx = maps[i].hex
        if(hx.x+'#'+hx.y == key2){
            return maps[i].dist
        }
    }
    return null
}

function cutaction(action,unitrodz){
    var newAction = {}
    for(var key in action){
        newAction[key] = action[key]
    }
    var before = szy[unitrodz]//newAction.rucho.length - (Math.floor(newAction.rucho.length / szy[unitrodz] )-1) * szy[unitrodz]
    //before += (zas[unitrodz] > 1 ? zas[unitrodz]-1 : 0)
    before += (obrr[unitrodz] < 1 ? zas[unitrodz]-1 : 0)
    //console.log(before)
    if(before > 0){
        newAction.rucho = newAction.rucho.slice(0,-before)
        newAction.ruchk = newAction.ruchk.slice(0,-before)
    }
    newAction.destination = leadPath(newAction.from[0],newAction.from[1],newAction.ruchk,newAction.rucho)
    return newAction
}
/*
actionsDistance(actions){
    var ax = 0
    for(var t = 0;t<MAX_TURNS;t++){
        if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
            
        }
    }
}*/







