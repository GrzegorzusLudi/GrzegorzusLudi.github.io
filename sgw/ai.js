function loadStats(){
	//strategical values for each type of unit and for each terrain type
	//
	//each row represents each unit, numbered as in
	//1st column is attack value on land, 2nd row is defense value on land
	//3rd and 4th columns are values on water
	//5th and 6th columns are values in the air
	aistratvals = [["1","1","0","0","0","0"],
	["4","4","0","0","0","0"],
	["1","5","0","0","0","0"],
	["1.5","0.8","0","0","0","0"],
	["1","1.5","0","0","0","5"],
	["0.5","4","0","0","0","0"],
	["1","1.2","1","1","0","0"],
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
	for(var i = 0;i<mista;i++){
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
                g.test = num
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
                g.test = num
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
        mist[i].test = mist[i].value()
        //lands.push(new Land(mist[i],params))
    }
}

//function which controls the --easiest-- default ai
async function ai1(){
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
                        heks[a][b].test = ''
						mist[mista] = heks[a][b];
						mistdefval[a][b] = {la:0,ld:0,wa:0,wd:0,aa:0,ad:0,blisk:0};
						mista++;
                        if(heks[a][b].undr == kolej)
                            exists = true
					}
					if(heks[a][b].unp > 0 && heks[a][b].undr == kolej){
                        exists = true
                    }
				}
			}
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
                    if(unit1 != undefined && unix[kolej][unit1.id].x != -1 && unit1.rodz == 8 && unit1.rozb > 0)
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
                            if(zaznu > -1)
                                odzaznaj(false)
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
                    oddroguj(hex.unt[i],kolej,false);
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
            evaluate(dfrou,2)
            legalActions(dfrou)
            ulepszyns = 8
            aistan = 1.2
            //distmap = aidistmap()
            //checkDistmapDistance(distmap)
            generate_areas(mist,params)
        break
        case 1.2:
            
            dbetter = copyDistmaps(dfrou)
            evaluate(dbetter,2)
            //legalActions(dbetter)
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
                if(distmap.hex.heks.undr == kolej && distmap.hex.units.length > 0){
                    myHexes++
                    for(var movement_type in distmap.maps){
                        var dmap = distmap.maps[movement_type].hexmap

                        var dmap = dmap.sort((a,b)=>a.dist-b.dist)
                        var lvlok = 2
                        var foundFrontline = false
                        for(var i in dmap){
                            var obj = dmap[i]
                            if(obj.hex.heks.undr != kolej && (obj.hex.units.length > 0 || obj.hex.z > 0)){
                                
                                if(f.dist > lvlok + 3 && foundFrontline){
                                    continue
                                }
                                if(addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] == undefined){
                                    addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] = obj.dist
                                    possible_targets.push(obj)
                                } else if(obj.dist < addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y]){
                                    addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] = obj.dist
                                    possible_targets.push(obj)
                                }
                                
                                if((!foundFrontline || lvlok > obj.dist) && obj.hex.heks.undr != -1){
                                    foundFrontline = true
                                    lvlok = obj.dist
                                }
                                    
                                    
                            }
                        }
                        
                        var rmap = distmap.maps[movement_type].rangemap

                        var rmap = rmap.sort((a,b)=>a.dist-b.dist)
                        for(var i in rmap){
                            var obj = rmap[i]
                            if(obj.hex.heks.undr != kolej && obj.hex.units.length > 0){
                                
                                if(addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] == undefined){
                                    addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] = obj.dist
                                    possible_targets.push(obj)
                                }/* else if(obj.dist < addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y]){
                                    addedHexes[obj.hex.heks.x + '#' + obj.hex.heks.y] = obj.dist
                                    possible_targets.push(obj)
                                }*/
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
                    possible_targets2.push(pt)
                    pt.hex.heks.test = pt.dist
                }
            }
            possible_targets = possible_targets2
            //possible_targets.sort((x,y)=>(x.hex.units.reduce((a,b)=>a+evalUnitDefense(b),0) -x.hex.il) * Math.pow(0.5,x.dist) - (y.hex.units.reduce((a,b)=>a+evalUnitDefense(b),0) - y.hex.il) * Math.pow(0.5,y.dist))
            possible_targets.sort((a,b)=>(a.dist - b.dist))
            //console.log(possible_targets)
            //possible_targets = possible_targets.filter(x => x.distanceMap)
            possible_targets = possible_targets.slice(0,myHexes+1)
            aistan = 1.3
        break
        case 1.3:
            if(possible_targets_ix >= possible_targets.length){
                if(ulepszyns > 0){
                    ulepszyns--
                    dfrou = copyDistmaps(dbetter)
                    evaluate(dfrou,2)
                    //legalActions(dfrou)
                    aistan = 1.2
                } else {
                    dfrou = dbetter
                    
                    aistan = 1.4
                }
            } else {
                for(var i = 0;i<10;i++){
                    var tested_target = possible_targets[possible_targets_ix]
                    var checkedTurn = 1
                    var checkedTurn2 = MAX_TURNS-1
                    var newDistmap = copyDistmaps(dfrou)
                    evaluate(newDistmap,2)
                    //legalActions(newDistmap)
                    tryPutUnderAttack(newDistmap,tested_target.hex.x,tested_target.hex.y,kolej)

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
                        
                        if(dbetter == null || score1[checkedTurn][kolej] > score2[checkedTurn][kolej] || score1[checkedTurn][kolej] >= score2[checkedTurn][kolej]*0.8 && score1[checkedTurn2][kolej] > score2[checkedTurn2][kolej])
                            dbetter = newDistmap
                    //}
                    //if(maxBetter > minBetter)
                    //    dbetter = newDistmap
                    
                    possible_targets_ix++
                    if(possible_targets_ix >= possible_targets.length)
                        break
                }
            }
        break
        case 1.4:
            actionsToReal(dfrou,kolej)
            aistan = 4
        break
		case 2:
                    //aistan = 3
            //dfrou=distmapsFromUnit()
            //evaluate(dfrou,2)
            //legalActions(dfrou)
            
                    
			while(miastkol<mista && mist[miastkol].undr==-1)
				miastkol++;

			if(miastkol<mista && mist[miastkol].undr==kolej){
				var k = mistdefval[mist[miastkol].x][mist[miastkol].y].blisk=checknearest(mist[miastkol]);
                                mist[miastkol].test = k
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
                    
		break;
		case 4:
			while(miastkol<mista && mist[miastkol].undr==-1)
				miastkol++;
			if(miastkol<mista && mist[miastkol].undr==kolej){
                sellSteelXY(100,mist[miastkol].x,mist[miastkol].y)
				var v = mist[miastkol].z*(100-mist[miastkol].podatpr);
				var p = Math.min(mist[miastkol].prod,mist[miastkol].hutn);
				for(var i = 0;i<mist[miastkol].trybutariuszy;i++){
					v+=mist[miastkol].trybutariusze[i].z;
				}
				var okej = -1
				for(var i = 0;i<mist[miastkol].unp;i++){
                    if(unix[kolej][mist[miastkol].unt[i]].ruchy == 0 && unix[kolej][mist[miastkol].unt[i]].celu == -1){
                        okej = i
                        break
                    }
                }
                //console.log(okej)
                if(okej == -1){
                    miastkol++
                    return
                } else if(unix[kolej][mist[miastkol].unt[mist[miastkol].unp-1]].ruchy != 0 || unix[kolej][mist[miastkol].unt[mist[miastkol].unp-1]].celu != -1) {
                    mist[miastkol].tasuj()
                }
				if(v>0){
					var needed = 0;		//todo
					
                    var wb = waterbodies.filter(a => a.hexes.filter(h => h.x == mist[miastkol].x && h.y == mist[miastkol].y).length > 0)
                    wb = wb.length > 0 ? wb[0] : null
                    if(wb && wb.cities.length < wb.hexes.length){
                        var neededToShip = 0
                        for(var i in wb.cities){
                            var city = wb.cities[i]
                            if(city.undr == -1){
                                neededToShip += 15
                            } else if(city.undr != kolej) {
                                neededToShip += evaluateAttackStrength(city)[1]
                            } else {
                                var isShip = false
                                for(var j = 0;j<city.unp;j++){
                                    if(city.unt[j].szyt == 'w' && zast[city.unt[j].rodz] == 'n'){
                                        neededToShip -= city.unt[j].il+city.unt[j].rozb
                                        isShip = true
                                    }
                                }
                                if(isShip)
                                    neededToShip -= 50

                            }
                        }
                        if(neededToShip > 0){
                            needed = 6
                        }
                        //console.log(mist[miastkol].x,mist[miastkol].y,wb)
                    }
					var creat = -1;
					for(var i = 0;i<mist[miastkol].unp;i++){
						if(unix[kolej][mist[miastkol].unt[i]].rodz==needed && unix[kolej][mist[miastkol].unt[i]].il<80)
							creat = i;
                        if(unix[kolej][mist[miastkol].unt[i]].rozb > 0)
                            creat = i
					}
					if(creat>-1){
						unix[kolej][mist[miastkol].unt[creat]].rozb=99-unix[kolej][mist[miastkol].unt[creat]].il;
					}
					if(mist[miastkol].unp>=4){
					} else if(creat==-1 && mist[miastkol].unp > 0) {
						dodai(mist[miastkol].x,mist[miastkol].y,0,needed,99);
                        odzaz();
					}
				}
			}
			miastkol++;
			if(miastkol>=mista){
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
            tx = -1
            ty = -1
            zaznu = -1
			changeState(4);
		break;
	}
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
    return hexdistmap.map( x => new Object({ hex: hekstable[x.hex.x][x.hex.y], dist: x.dist, water : x.waterdist, from: x.from == null ? null : hekstable[x.from.x][x.from.y] }))
}
function copyHexrangemap(hexrangemap,hekstable){
    //{ hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  }
    return hexrangemap.map( x => new Object({ hex: hekstable[x.hex.x][x.hex.y], dist: x.dist}))
}

function hexdistmap(x,y,water,mountain,air,heavy,hekstable){
    if(hekstable == undefined)
        hekstable = heks
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
    
    var step = 1
    while(tocheck.length > 0){
        for(var i in tocheck){
            var hexfrom = tocheck[i]
            for(var j = 0;j<6;j++){
                if(tocheck[i].border[j] != null && tocheck[i].border[j].x < scian && tocheck[i].border[j].y < scian && (checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist == -1 || checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist > checkedGrid[tocheck[i].x][tocheck[i].y].dist + step/* || checkedGrid[tocheck[i].x][tocheck[i].y].water + 1 < checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water*/)){
                    var hexto = tocheck[i].border[j]
                    
                    var step = 1
                    var pluswater = 0
                    
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
                    }
                    var dist = checkedGrid[hexfrom.x][hexfrom.y].dist + step + pluswater*2
                    var waterdist = checkedGrid[hexfrom.x][hexfrom.y].water + pluswater
                    
                    //console.log(dist)
                    tocheck2.push(tocheck[i].border[j])
                    checkedList.push( { hex: tocheck[i].border[j], dist: dist, water : waterdist, from: hexfrom  } )
                    checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].dist = dist
                    checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].water = waterdist
                    checkedGrid[tocheck[i].border[j].x][tocheck[i].border[j].y].from = hexfrom
                    
                    //heks[tocheck[i].border[j].x][tocheck[i].border[j].y].test = dist    //debug
                }
            }
        }
        tocheck = tocheck2
        tocheck2 = []
        step++
    }
    return checkedList
}
function hexrangemap(x,y,water,mountain,air,heavy,hekstable){
    if(hekstable == undefined)
        hekstable = heks
        
    var LARGEST_DIST = zas.reduce((a,b)=>Math.max(a,b),0)
    console.log(LARGEST_DIST)
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
        var nmiasta = miasta.map(m=>[hexdistmap(m.x,m.y,false,false,false,false).filter(x=>x.dist <= 2*l),m]).map(([distmap,m])=>[distmap,m,distmap.map(x=>cityscore(x.hex)).reduce((a,b)=>a+b,0)]).sort((a,b)=>-a[2]+b[2])
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
        for(var j in newLevel.land){
            if(l > 1){
                newLevel.land[j].addBelonging(levels[l-1].land)
                if(newLevel.land[j].subordinates.length > 1)
                    heks[newLevel.land[j].x][newLevel.land[j].y].test = l
            } else {
                heks[newLevel.land[j].x][newLevel.land[j].y].test = 1
            }
        }
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
            heks[area.x][area.y].test = level+'#'+(maxeval * 2 - allAreaValues)
            heks[area.x][area.y].testColor = evalcolor
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

function putPath(uni, hex_x, hex_y, stopBefore){
    //szyt = ["n","c","c","n","g","c","w","w","w","l","l","n"];
    //zast = ["n","n","n","n","n","p","n","n","x","l","x","m"];

    if(!(uni in unix[kolej]))
        return
        
    var unit = unix[kolej][uni]
    unit.rozb = 0
    
    var unitDistMap = hexdistmap(unit.x,unit.y,unit.szyt == 'w',unit.szyt == 'g',unit.szyt == 'l',unit.szyt == 'c')
    
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
    
    return path.length > 0 && unit.szyt != 'w' && unit.szyt != 'l' && heks[unit.x][unit.y].z > 0 && heks[path[0].x][path[0].y].z == -1        
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
                fields[key] = obj[key]
                if(fields[key] instanceof Array)
                    fields[key] = fields[key].slice()
            } else {
                fields[key] = undefined
            }
        }
        return fields
    }
    setFields(fields){
        for(var key in fields){
            this[key] = fields[key] 
            if(this[key] instanceof Array)
                this[key] = this[key].slice()
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
        super(['d','il','id','rodz','ata','atakt','celd','celu','ruchk','ruchy','rucho','zalad','rozb','kolor','szyt','atakt'])
        
        //this.unit = unit
        this.setFields(this.getFields(unit))
        this.actions = []   //np. {type:'przenies',size:'10',x:4,y:6}
        this.legalActions = []
        if(unit.actions != undefined){
            this.actions = unit.actions.map(dict => copyDict(dict))
            this.legalActions = unit.legalActions.map(array => array.map(dict => copyDict(dict)))
        } else {
            var rucho = this.rucho.slice(0,this.ruchy)
            var ruchk = this.ruchk.slice(0,this.ruchy)
            if(this.ruchy > 0){
                this.actions.push({type:'move',by:'real',rucho:rucho,ruchk:ruchk,il:unit.il,destination:leadPath(hex.x,hex.y,ruchk,rucho)})
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
function pathIsThroughCrowdedCity(dm,x,y,ruchk,rucho){
    var he = heks[x][y]
    for(var i in ruchk){
        for(var j = 0;j<rucho[i];j++){
            he = he.border[ruchk[i]]
            if(he == undefined)
                break
        }
        if(he == undefined)
            break
        if(i > 0 && i < ruchk.length-1 && (dm != undefined && he.x+'#'+he.y in dm.distmaps && dm.distmaps[he.x+'#'+he.y].hex.units.length == 4 || dm == undefined && heks[he.x][he.y].unp == 4))
            return true
    }
    
    return false
}
class BoardHex extends Copyable {
    constructor(x,y,oldheks){
        super(['most','z','hutn','prod','zpl','hutnpl','prodpl','kasy','stali','zmiana'])
        
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
        for(var j in bhex.units){
            var unit = bhex.units[j]
            var szybt = unit.szyt
            if(!(szybt in newDistmaps[code])){
                newDistmaps[code].maps[szybt] = {hexmap:copyHexdistmap(distmaps[code].maps[szybt].hexmap,board), rangemap:copyHexrangemap(distmaps[code].maps[szybt].rangemap,board)}//{hexmap:hexdistmap(bhex.x,bhex.y,szybt == 'w',szybt == 'g',szybt == 'l',szybt == 'c',board)}
            }
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
            var szybt = unit.szyt
            if(!(szybt in distmaps[code])){
                distmaps[code].maps[szybt] = {hexmap:hexdistmap(bhex.x,bhex.y,szybt == 'w',szybt == 'g',szybt == 'l',szybt == 'c',board),rangemap:hexrangemap(bhex.x,bhex.y,szybt == 'w',szybt == 'g',szybt == 'l',szybt == 'c',board)}
            }
            
        }
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
function evalUnitAttack(unit,actions){
    var il = unit.il
    
    var fromFar = 1
    if(actions != undefined && actions[actions.length-1].type == 'aim' && (zast[unit.rodz] == 'n' || zast[unit.rodz] == 'l') && zas[unit.rodz] > 1)
        fromFar = 2
    return fromFar * at[unit.rodz] * (0.5+obrr[unit.rodz]) * exponentiel(unit.il)
}
function evalUnitDefense(unit){
    return at[unit.rodz] * (0.5+obrr[unit.rodz]) * exponentiel(unit.il)
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
            distmaps[key].fromenemy = allMoves()
            distmaps[key].fromally = allMoves()
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
            
            var max = scian*scian
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
            distmaps[key].frontline = false
            
        }
    }
    for(var key in distmaps){
        var distmap = distmaps[key]
        
        var hex = distmap.hex
        var peoplePotential = hex.z / ced[0]    //produkcja piechoty
        var productionPotential = Math.min(hex.z / ced[1], Math.min(hex.prod / ces[1], hex.hutn / ces[1]))    //produkcja czougów
        var maxdef = Math.max(peoplePotential, productionPotential * 4)
        for(var t = 0;t<MAX_TURNS;t++){
            for(var i in distmap.hex.units){
                var unit = distmap.hex.units[i]
                var unitAttackStrength = evalUnitAttack(unit)
                var unitDefenseStrength = evalUnitDefense(unit)
                
                distmap.defence[t][unit.d] -= -maxdef * t
                
                if(unit.actions.length > 0){
                    for(var j in unit.actions){
                        var action = unit.actions[j]
                        if(action.type == 'move' && action.destination != undefined/* && j == unit.actions.length - 1*/){
                            var code = action.destination[0]+'#'+action.destination[1]
                            var dist = action.rucho.reduce((a,b)=>a+b,0)
                            var unitAttackStrength = evalUnitAttack(unit)

                            if(true || !pathIsThroughCrowdedCity(dm,distmap.hex.x,distmap.hex.y,action.ruchk,action.rucho))
                                if(code in distmaps && szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= dist){
                                    //console.log(szy[unit.rodz] * t + zas[unit.rodz], dist, unitAttackStrength)
                                    var unitAttackStrength2 = evalUnitAttack(unit, [action])
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
                
                if(unit.szyt != movement_type/* || unit.actions.length > 0*/)
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
                        
                        var unitAttackStrength = evalUnitAttack(unit)
                        
                        var potential = 0
                        for(var t = 0;t<MAX_TURNS;t++){
                            if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
                                if(potentialMoves && unit.actions.length == 0)
                                    distmaps[hexkey].potentialtocome[t][unit.d] -= (-Number(unitAttackStrength) - potential * maxdef) // hexesCheckedInTurn[t]
                                //console.log(hex.hex.dru, unit.d, hexkey in distmaps, distmaps[hexkey].fromenemy)
                                if(hex.hex.dru != unit.d && hex.hex.dru != -1 && hexkey in distmaps && distmaps[hexkey].fromenemy[movement_type] > t)
                                    distmaps[hexkey].fromenemy[movement_type] = t
                                if(hex.dist > 0 && hex.hex.dru == unit.d && hexkey in distmaps && distmaps[hexkey].fromally[movement_type] > t)
                                    distmaps[hexkey].fromally[movement_type] = t
                                    
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
            var fromenemy = Math.min(distmap.fromenemy['n'],Math.min(distmap.fromenemy['c'],distmap.fromenemy['g']))
            var fromally = Math.min(distmap.fromally['n'],Math.min(distmap.fromally['c'],distmap.fromally['g']))
            var frontline = fromenemy <= 2 || fromally >= fromenemy
            distmap.frontline = frontline
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
                var factor = distmap.frontline ? 1 : 1
                dm.score[t][biggestpowercolor] += distmap.hex.z + (distmap.hex.stali + Math.min(distmap.hex.prod,distmap.hex.stali)) * 2 * factor
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

function legalActions(dm){
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
                if(unit.szyt != movement_type/* || unit.actions.length > 0*/)
                    continue
                    
                for(var i in hexesToCheck){
                    var hex = hexesToCheck[i]
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    
                    if(hex.hex.units.length == 0 && hex.hex.z <= 0)
                        continue
                    
                    //if(!distmaps[hexkey].frontline)
                    //    continue
                    
                    var potential = 0
                    //for(var t = 0;t<MAX_TURNS;t++){
                        //if(szy[unit.rodz] * t + (zas[unit.rodz] <= 1 || t == 0 ? 0 : zas[unit.rodz]) >= hex.dist){
                            //if(hexkey in distmaps && ( distmaps[hexkey].frontline || distmaps[hexkey].units.length == 0 ||  )){
                                //unit.legalActions.push({type:'move',rucho:rucho,ruchk:ruchk,destination:leadPath(hex.x,hex.y,ruchk,rucho)})
                                    
                    var hToCheck = map_of_movement_type.filter(h => h.hex.x == hex.hex.x && h.hex.y == hex.hex.y)[0]
                    var ruchk = []
                    while(hToCheck.from != null){
                        var hfrom = hToCheck.from
                        var goodkier = -1
                        for(var k = 0;k<6;k++){
                            if(hfrom.border[k] != undefined && hfrom.border[k].x == hToCheck.hex.x && hfrom.border[k].y == hToCheck.hex.y){
                                goodkier = k
                                break
                            }
                        }
                        ruchk.push(goodkier)
                        var hToCheck = map_of_movement_type.filter(h => h.hex.x == hfrom.x && h.hex.y == hfrom.y)[0]
                    }
                    ruchk = ruchk.reverse()
                    rucho = ruchk.map(a => 1)
                    //console.log([hex.hex.x,hex.hex.y,ruchk,rucho])
                    
                    if(true || !pathIsThroughCrowdedCity(dm,distmap.hex.x,distmap.hex.y,ruchk,rucho)){
                        unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il,destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                        if(unit.il > 10 && distmap.hex.units.length <= 3)
                            unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il-10,destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                        if(unit.il > 20 && distmap.hex.units.length <= 2 && distmap.frontline)
                            unit.legalActions.push([{type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:Math.floor(unit.il/2),destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk,rucho)}])
                        
                        if(hex.hex.units.length > 0/* && distmap.frontline*/){
                            if(hex.hex.units.length > 0){
                                var aimedunit = hex.hex.units[hex.hex.units.length-1]
                                //tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"
                                if(aimedunit != null && aimedunit.d != unit.d && miaruj(unit,aimedunit,hex.hex)){
                                    rucho2 = rucho//.slice(0,rucho.length - zas[unit.rodz])
                                    ruchk2 = ruchk//.slice(0,ruchk.length - zas[unit.rodz])
                                    unit.legalActions.push([
                                        {type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il,destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)},
                                        {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,destination:[distmap.hex.x,distmap.hex.y]},
                                    ])
                                    if(unit.il > 10 && distmap.hex.units.length <= 3)
                                        unit.legalActions.push([
                                            {type:'move',by:'speculation',rucho:rucho,ruchk:ruchk,il:unit.il-10,destination:leadPath(distmap.hex.x,distmap.hex.y,ruchk2,rucho2)},
                                            {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il-10,destination:[distmap.hex.x,distmap.hex.y]},
                                        ])

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
                                
                for(var i in range_hexesToCheck){
                    var hex = range_hexesToCheck[i]
                    var hexkey = hex.hex.x + '#' + hex.hex.y
                    
                    if(hex.hex.units.length == 0)
                        continue
                    if(hex.hex.units.length > 0){
                        var aimedunit = hex.hex.units[hex.hex.units.length-1]
                        //tprh.unp>0 && lookedUpUnit.d==kolej && lookedUpUnit.rodz==10 && tprh.unt[tprh.unp-1]!=aimingUnit.id && aimingUnit.szyt!="w" && aimingUnit.szyt!="c" && aimingUnit.szyt!="l"
                        if(aimedunit != null && aimedunit.d != unit.d && miaruj(unit,aimedunit,hex.hex) && hex.dist <= zas[unit.rodz]){
                            unit.legalActions.push([
                                {type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,il:unit.il,destination:[hex.hex.x,hex.hex.y]},
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
                    unit.actions = []
                }
            }
        }
    }
    
    evaluate(dm)
}
function tryPutUnderAttack(dm, x, y, color){
    var distmaps = dm.distmaps
    
    var hexUnderAttack = distmaps[x+'#'+y].hex
    //var interestingUnits = {'c':[],'n':[],'l':[],'g':[],'w':[]}
    var interestingUnits = []
    for(var key in distmaps){
        var distmap = distmaps[key]
        //if(!distmap.frontline)
        //    continue
        
        /*
        for(var movement_type in distmap.maps){
            var map_of_movement_type = distmap.maps[movement_type].hexmap
            
            for(var j in distmap.hex.units){
                var unit = distmap.hex.units[j]
                if(unit.d != color)
                    continue
                
                if(unit.szyt != movement_type)
                    continue
                    
                var hex_to_find = map_of_movement_type.filter(h => h.hex.x == x && h.hex.y == y)
                if(hex_to_find.length >= 1)
                    interestingUnits[movement_type].push({unit:unit,hex:distmap})
                
            }
        }*/
        var smallestUnit = -1
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            if(smallestUnit == -1 || unit.il < distmap.hex.units[smallestUnit].il){
                smallestUnit = j
            }
        }
        for(var j in distmap.hex.units){
            var unit = distmap.hex.units[j]
            if(unit.d != color || unit.rozb > 20 && unit.il < 80 && (unit.legalActions.length == 0 || unit.legalActions[0].type == 'move' && heks[unit.legalActions[0].destination[0]][unit.legalActions[0].destination[0]].undr != -1)/* || unit.actions.filter(x => x.type == 'move').length > 0 && !distmap.frontline*/ || unit.actions.filter(x => x.type == 'move' && x.by == 'speculation').length > 0)
                continue
                
                /*
            if(unit.actions.length > 0 && unit.actions[0].type == 'move' && distmap.hex.units[0] == unit && unit.actions[0].il > unit.il-10)
                continue*/
                
            
            //console.log(unit.legalActions.length)
            var bestAction = null
            var populateAction = null
            for(var i in unit.legalActions){
                var legalAction = unit.legalActions[i]

                if(legalAction.length >= 1 && (legalAction[0].type == 'move' || legalAction[0].type == 'aim') && legalAction[0].destination != undefined && legalAction[0].destination[0] == x && legalAction[0].destination[1] == y){
                    var properAction = legalAction[0]

                    if(/*distmap.alliegance[2] == unit.d && */distmap.hex.z > 0 && properAction.il > unit.il-10 && (j == distmap.hex.units.length-1 || distmap.hex.units.length == 1)){
                        continue
                    }
                    if(/*distmap.alliegance[2] == unit.d && */distmap.hex.z > 0 && properAction.il < unit.il-10 && distmap.hex.units.length == 4){
                        continue
                    }
                    if(/*distmap.alliegance[2] == unit.d && */distmap.hex.z <= 0 && properAction.il < unit.il-10){
                        continue
                    }
                    if(/*distmap.alliegance[2] == unit.d && */distmap.alliegance[0] != -1 && distmap.hex.z <= 0 && unit.il <= 10){
                        continue
                    }
                    
                    if(legalAction[0].type == 'aim'){
                        console.log(legalAction[0].destination,[x,y])
                        console.log(evalUnitAttack(unit,legalAction), evalUnitAttack(unit,bestAction))
                    }
                    if(bestAction == null || evalUnitAttack(unit,legalAction) > evalUnitAttack(unit,bestAction)){
                        //if(legalAction.length >= 2)
                        //    console.log('c'+(evalUnitAttack(unit,legalAction) + ',' + evalUnitAttack(unit,bestAction)))
                        
                        bestAction = legalAction
                    }
                }
            }
            if(bestAction != null && bestAction.length >= 1){
                interestingUnits.push({unit:unit, action:bestAction, hex:distmap.hex})
            }
        }
    }
    interestingUnits.sort((a,b) => (a.hex.dist/(a.unit.il+100) - b.hex.dist/(b.unit.il+100)))
    //console.log(interestingUnits)
    
    evaluate(dm)
    var postęp = 0
    var valuesByTime = dm.distmaps[x+'#'+y].alliegance
    for(var t in valuesByTime){
        valuesByTime[t] = valuesByTime[t] == color ? 1/Math.pow(2.1,t+1) : 0
    }
    var value = valuesByTime.reduce((a,b) => a+b, 0)
    
    var value2
    for(var i in interestingUnits){
        var unitaction = interestingUnits[i]
        
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
    }
    if(value2 == undefined || value2 <= value)
        return []
        
    return interestingUnits
    
}

function actionsToReal(dm,color){
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
                    tratwa -= unit.il
                if(unit.actions.length == 1 && unit.actions[0].type == 'move'){
                    var properAction = unit.actions[0]
                    
                    var unid = unit.id
                    if(properAction.il < unit.il){
                        unid = divideUnit(unid,unit.il - properAction.il,false)
                        if(unid == -1)
                            continue
                    }
                    var dodajTratwe = putPath(unid,properAction.destination[0],properAction.destination[1])
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
                    if((zast[unit.rodz] == 'n' || zast[unit.rodz] == 'p' || zast[unit.rodz] == 'l') && zas[unit.rodz] > 1)
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
                        odzaznaj(false);
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
                        
                    var dodajTratwe = putPath(unid,action1.destination[0],action1.destination[1],stopBefore)
                    if(dodajTratwe && unit.szyt != 'w' && unit.szyt != 'l')
                        tratwa += action1.il
                        
                    //{type:'aim',by:'speculation',celu:aimedunit.id,celd:aimedunit.d,destination:[distmap.hex.x,distmap.hex.y]},

                    zaznu = unid
                    var cords = leadPath(distmap.hex.x,distmap.hex.y,action1.ruchk,action1.rucho,stopBefore)
                    console.log(distmap.hex.x,distmap.hex.y,cords[0],cords[1],stopBefore)
                    tx = cords[0]
                    ty = cords[1]
                    celuj(cords[0],cords[1],action2.celd,action2.celu,false);

                    if(zaznu!=-1){
                        heks[unix[kolej][zaznu].x][unix[kolej][zaznu].y].zmiana++;
                        unix[kolej][zaznu].sebix = unix[kolej][zaznu].x;
                        unix[kolej][zaznu].sebiy = unix[kolej][zaznu].y;
                        odzaznaj(false);
                    }
                }
                if(unit.actions.length == 0){
                    putPath(unit.id,unit.x,unit.y)
                }
                zaznu = -1;
                zaznx = -1;zazny = -1;
                tx = -1
                ty = -1
                changeState(4)
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







