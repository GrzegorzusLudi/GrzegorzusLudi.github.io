
				function makepath(u,cx,cy,zaz,map){
                                        var zaza = zaz/4;
                                        if(zaz>0 && Math.floor(u.licz*zaza)>0){
                                                oddzialy[oddzialy.length] = new oddzial(u.x,u.y,u.kolor,Math.floor(u.licz*zaza),0);
                                                u.licz-=Math.floor(u.licz*zaza);
                                        }

                                        var tat = map==undefined?distmap(u):map;
                                        var px = Math.floor((cx-2)/5);
                                        var py = Math.floor((cy-2)/5);
                                        var pth = [];
                                        var i = 0
                                        while(tat.map[px][py].prevx!=null){
                                                var dx = tat.map[px][py].prevx;
                                                var dy = tat.map[px][py].prevy;
                                                pth[pth.length] = {x:px*5+2,y:py*5+2};
                                                if(i>100 && pth.filter(e=>(e.x==px*5+2 && e.y==py*5+2)).length>0)
                                                    return undefined
                                                px = dx;
                                                py = dy;
                                                i++
                                        }
                                        pth.reverse();
                                        if(pth.length>0){
                                                pth[pth.length] = {x:cx,y:cy};
                                        }
                                        u.path = pth;
				}
				/*
				@@@@@  @@  @  @  @@   @@
				@   @  @ @ @  @  @ @ @ @
				@@@@@  @ @ @  @  @ @ @ @
				@   @  @ @ @  @  @ @ @ @
				@   @  @  @@  @  @  @  @
				*/
				function getUnit(miasto){
                                    for(var i = 0;i<oddzialy.length;i++){
                                        if(oddzialy[i].x==miasto.x && oddzialy[i].y==miasto.y)
                                            return oddzialy[i];
                                    }
				}
				function getRanking(){
                                    
                                    var mranking = {}
                                    
                                    var mia = historia?snaps[histmoment].miasta:miasta
                                    for(var i in mia){
                                        if(!(mia[i].kolor in mranking))
                                            mranking[mia[i].kolor] = mia[i].size
                                        else
                                            mranking[mia[i].kolor] += mia[i].size
                                    }
                                    var mzbior = []
                                    for(var k in mranking){
                                        mzbior.push({kolor:k,il:mranking[k]})
                                    }
                                    mzbior = mzbior.sort((x,y)=>(y.il-x.il))
                                    
                                    var odi = historia?snaps[histmoment].oddzialy:oddzialy
                                    
                                    var ranking = {}
                                    for(var i in odi){
                                        if(!odi[i].toDelete)
                                            if(!(odi[i].kolor in ranking))
                                                ranking[odi[i].kolor] = odi[i].licz
                                            else
                                                ranking[odi[i].kolor] += odi[i].licz
                                    }
                                    var zbior = []
                                    for(var k in ranking){
                                        zbior.push({kolor:k,il:ranking[k]})
                                    }
                                    zbior = zbior.sort((x,y)=>(y.il-x.il))
                                    
                                    var dranking = {}
                                    for(var k in mranking){
                                        if(k in mranking && mranking[k]>0){
                                            dranking[k] = Math.min(9,Math.ceil(ranking[k]/mranking[k]))
                                        }
                                    }
                                    var dzbior = []
                                    for(var k in dranking){
                                        dzbior.push({kolor:k,il:dranking[k]})
                                    }
                                    dzbior = dzbior.sort((x,y)=>(y.il-x.il))
                    
                                    var sumofall = zbior.map(x=>x.il).reduce((x,y)=>(x+y),0)
                                    var msumofall = mzbior.map(x=>x.il).reduce((x,y)=>(x+y),0)
                                    return {ranking:ranking,zbior:zbior,mranking:mranking,mzbior:mzbior,sumofall:sumofall,dranking:dranking,dzbior:dzbior}
                                    
				}
				function komploop(){
                                    if(!pauza){
                                        var rank = getRanking()
                                        var density = rank.dzbior//.filter(x => rank.ranking[x.kolor]>=rank.sumofall/initmiast)
                                        var maxdens = density.length>0 ? density[0].il : 0
                                        var meddens = density.length>0 ? density[density.length >> 1].il : 0
                                        
                                        
                                        ranking = rank.ranking
                                        zbior = rank.zbior
                                        sumofall = rank.sumofall
                                        //console.log(sumofall+' '+zbior[0].kolor+' '+zbior[0].il)
                                        
                                        var alert = 0.25
                                        if(firsttime == 0 && zbior[0].il>sumofall*alert){
                                            first = zbior[0].kolor
                                            firsttime = 200
                                            resetRevenge()
                                        } else if(firsttime>0) {
                                            firsttime--
                                            if(miasta.filter(x=>x.kolor==first).length==0){
                                                firsttime = 0
                                                first = null
                                            }
                                        } else {
                                            first = null
                                        }
                                        
                                        var proportion = 0.5
                                        var proportion2 = 1.4
                                        
                                        
                                        var filterodd = x=>(ailevel[x.kolor] < 4 || maxdens<2 || !(x.kolor in rank.dranking) || ranking[x.kolor]>=sumofall*0.35 || (first != null && first != x.kolor && ranking[first]>=sumofall*alert) || (rank.dranking[x.kolor] >= meddens*proportion2 || rank.dranking[x.kolor] >= maxdens * proportion))
                                        
                                        //wybór oddziałów
                                        var noddzialy = oddzialy.filter(x=>filterodd(x) || x.licz >= maxlicz*0.8)
                                        
                                        /*
                                        if(fourconsidered){
                                            console.log(maxdens+" "+meddens+" "+(meddens/maxdens))
                                        }*/
                                            
                                        if(noddzialy.length > 0){
                                            var odd = noddzialy[Math.floor(Math.random()*noddzialy.length)];
                                            var dru = noddzialy.filter(x=>(x.kolor == odd.kolor && noddzialy.sort((a,b)=>-(Math.abs(a.x-b.x)+Math.abs(a.y-b.y))).slice(0,20).filter(y=>(y.kolor!=x.kolor)).length>0 )).sort((a,b)=>(b.licz-a.licz))
                                            var ile = dru.map(x=>Math.pow(x.licz,1.5))
                                            var sum = ile.reduce((x,y)=>(x+y),0)
                                            var los = Math.random()*sum
                                            var ss = 0
                                            var j = 0
                                            for(var i in ile){
                                                if(ss<los){
                                                    ss += ile[i]
                                                    j++
                                                }
                                            }
                                            j--
                                            if(dru[j])
                                                komp(dru[j],undefined,filterodd(dru[j]))
                                        }
                                    }
                                    setTimeout(komploop,Math.max(resetas,0)*100+100);
                                    resetas = 5;
				}
				function komp(odd,escape,sparesome){
                                        if(sparesome == undefined)
                                            sparesome = false
                                        resetas--
					if(wybranykolor!=-1 && odd.kolor!=wybranykolor && (!escape || ailevel[odd.kolor]>=3)){
						var kolo = odd.kolor;
						if(odd.path.length==0){
							//if(odd.licz>20){
                                                                odd.useless = true;
								var map = distmap(odd,10,10);
								tat = map.mist
								if(kolo==first || first==null)
                                                                    tat = tat.filter(x=>(x.m.kolor!=kolo)).slice(0,10).concat(tat.filter(x=>(x.m.kolor==kolo)).slice(0,10)).sort((a,b)=>(a.dist-b.dist))
								else
                                                                    tat = tat.filter(x=>(x.m.kolor==first || revenge[kolo][x.m.kolor] > 0)).slice(0,10).concat(tat.filter(x=>(x.m.kolor==kolo)).slice(0,10)).sort((a,b)=>(a.dist-b.dist))
                                                                    
								var maxscore = 0;
								var maxcity = null;
								var garrison = 0
								var anyfriend = null;
								odd.averageenemy = escape!=undefined?escape:0
								odd.averageenemyodl = escape!=undefined?5:Infinity
								var enemies = 0;
								var potential = []
								for(var j = 0;j<Math.min(tat.length,20);j++){
                                                                    //if(revenge[kolo][tat[j].m.kolor] > 0 && tat[j].m.kolor != first && kolo != first)
                                                                        //console.log(kolo,tat[j].m.kolor,revenge[kolo][tat[j].m.kolor])
                                                                    if(escape==undefined)
                                                                        if(tat[j].m.kolor!=kolo && (first==null || odd.kolor == first || tat[j].m.kolor==first || revenge[kolo][tat[j].m.kolor] > 0)){
                                                                                //makepath(odd,tat[j].m.x,tat[j].m.y,2);
                                                                                var unitHere = getUnit(tat[j].m)
                                                                                if(unitHere!=null){
                                                                                    
                                                                                    //if(odd.averageenemy<unitHere.licz){
                                                                                        odd.averageenemy += unitHere.licz
                                                                                        if(odd.averageenemyodl==Infinity)
                                                                                            odd.averageenemyodl = 0
                                                                                        odd.averageenemyodl += tat[j].dist
                                                                                        enemies++
                                                                                    //}
                                                                                    var score = tat[j].m.size/tat[j].dist
                                                                                    if(score>maxscore && ((odd.licz>unitHere.licz && ailevel[odd.kolor]==1) || (odd.licz*0.75>unitHere.licz && ailevel[odd.kolor]>=2))){
                                                                                        maxscore = score;
                                                                                        garrison = unitHere.licz
                                                                                        maxcity = tat[j].m
                                                                                    }
                                                                                }
                                                                        }
                                                                    if(enemies>0){
                                                                        odd.averageenemy/=enemies
                                                                        odd.averageenemyodl/=enemies
                                                                    }
                                                                    if(tat[j].m.kolor==kolo){
                                                                        var unitHere = getUnit(tat[j].m)
                                                                        if(unitHere!=null && unitHere.useless){
                                                                            potential.push(unitHere)
                                                                        }
                                                                        if(unitHere && (anyfriend == null || unitHere.licz>anyfriend.licz)){
                                                                            anyfriend = unitHere
                                                                        }
                                                                    }
								}
								if(maxcity!=null && odd.averageenemy/2<odd.licz){
                                                                    odd.useless = false
                                                                    if(!tabela[odd.x][odd.y].miasto)
                                                                        makepath(odd,maxcity.x,maxcity.y,0,map);
                                                                    else if(odd.licz*0.25*0.75>garrison)
                                                                        makepath(odd,maxcity.x,maxcity.y,3,map);
                                                                    else if(odd.licz*0.5*0.75>garrison)
                                                                        makepath(odd,maxcity.x,maxcity.y,2,map);
                                                                    else if(sparesome)
                                                                        makepath(odd,maxcity.x,maxcity.y,1,map);
								} else {
                                                                    if(!tabela[odd.x][odd.y].miasto && anyfriend != null){
                                                                        makepath(odd,anyfriend.x,anyfriend.y,4,map);
                                                                    } else {
                                                                        odd.useless = true
                                                                    }
								}
								if(odd.useless && tabela[odd.x][odd.y].miasto){
                                                                    for(var i in potential){
                                                                        var u = potential[i]
                                                                        if(u!=odd){
                                                                            if(odd.averageenemy>0 &&  u.averageenemyodl>=odd.averageenemyodl){
                                                                                makepath(u,odd.x,odd.y,2);
                                                                            }
                                                                        }
                                                                    }
                                                                    for(var i in oddzialy){
                                                                        var o = oddzialy[i]
                                                                        if(!tabela[o.x][o.y] && Math.abs(o.x-odd.x)+Math.abs(o.y-odd.y)<200){
                                                                            makepath(o,odd.x,odd.y,2,map);
                                                                        }
                                                                    }
                                                                    odd.useles = false
								}
								if(escape && escape>odd.licz){
                                                                    if(anyfriend){
                                                                        makepath(odd,anyfriend.x,anyfriend.y,0,map);
                                                                    }
								}
							//}
						}
					}
				}
				function anim(){
					if(stan<0){
						stan--;
						if(stan==-20)
							elpanel();
						if(stan<=-40){
							stan = -1;
							elpanel();
						}

					} else if(!pauza) {
						stan++;
						if(stan%5==0){
						var spr = false;
							for(var i = 0;i<oddzialy.length;i++){
								var o = oddzialy[i];
								
                                                            if(tabela[oddzialy[i].x][oddzialy[i].y].miasto!=null){
                                                                    var mm = tabela[oddzialy[i].x][oddzialy[i].y].miasto
                                                                    if(mm.kolor!=oddzialy[i].kolor){
                                                                        mm.kolor = oddzialy[i].kolor;
                                                                        mm.akolor = hexToRgb(mm.kolor)
                                                                        zmien.push(tabela[mm.x][mm.y])
                                                                    }
                                                            }
                                                            if(!o.toDelete && o.kolor!=wybranykolor && o.path.length>2 && first!=null && o.kolor!=first && revenge[o.kolor][tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto.kolor] <= 0 && tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto!=null && tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto.kolor!=first && tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto.kolor!=o.kolor){
                                                                o.path = []
                                                                komp(o)
                                                            }
								if(!o.toDelete && o.path.length>0){
                                                                        o.fromMove = 3;
									spr = true;
									var stop = false;
									//if(tabela[o.x][o.y].miasto!=null)
										//zmien[zmien.length]=tabela[o.x][o.y].miasto;
									for(var j = 0;j<oddzialy.length;j++){
										if(!oddzialy[j].toDelete && odl(oddzialy[i],oddzialy[j])<10){
											if(oddzialy[j].kolor!=oddzialy[i].kolor || (oddzialy[i].path.length==1 && oddzialy[j].path.length==0)){
												stop = true;
												walka(oddzialy[i],oddzialy[j]);
												if(oddzialy[j].licz<=0){
                                                                                                        //zmien[zmien.length]=oddzialy[j];
													if(tabela[oddzialy[j].x][oddzialy[j].y].miasto!=null){
														var mm = tabela[oddzialy[j].x][oddzialy[j].y].miasto
														if(mm.kolor!=oddzialy[i].kolor){
                                                                        revenge[mm.kolor][oddzialy[i].kolor] += mm.size
                                                                        revenge[oddzialy[i].kolor][mm.kolor] -= mm.size
                                                                        
                                                                        //if(mm.kolor != first && oddzialy[i].kolor != first)
                                                                        //console.log(mm.kolor," <= ",oddzialy[i].kolor, revenge[mm.kolor][oddzialy[i].kolor], revenge[oddzialy[i].kolor][mm.kolor])

                                                                                                                    mm.kolor = oddzialy[i].kolor;
                                                                                                                    mm.akolor = hexToRgb(mm.kolor)
                                                                                                                    zmien.push(mm)
                                                                                                                }
													}
                                                                                                        oddzialy[j].toDelete = true
													/*oddzialy[j] = oddzialy[oddzialy.length-1];
													oddzialy.length--;*/
													if(i==oddzialy.length-1){
														i = j;
													}
												}
												if(o.licz<=0){
                                                                                                    oddzialy[j].fromMove = 3;
                                                                                                    //zmien[zmien.length]=oddzialy[j];
												}
											} else {
                                                                                            
											}
										}
									}
									if(!stop){
                                                                            o.x = o.path[0].x;
                                                                            o.y = o.path[0].y;
                                                                            for(var j = 0;j<o.path.length-1;j++){
                                                                                    o.path[j] = o.path[j+1];
                                                                            }
                                                                            o.path.length--;
                                                                            //zmien[zmien.length] = o;
									}
									if(o.licz<=0){
                                                                                //setTimeout(komp(oddzialy[i]),1000)
                                                                                /*if(tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto!=null)
                                                                                    zmien[zmien.length]=tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto;
										*/
										
										oddzialy[i].toDelete = true
										//oddzialy[i] = oddzialy[oddzialy.length-1];
										//oddzialy.length--;
										//i--;
									}
									if(o.licz>20 && !o.toDelete && o.path.length == 0){
                                                                            komp(o)
									}
                                                                    if(o.path.length == 5 && tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto){
                                                                        var tamten = getUnit(tabela[o.path[o.path.length-1].x][o.path[o.path.length-1].y].miasto)
                                                                        if(tamten!=null && tamten.kolor!=o.kolor && tamten.licz<o.licz){
                                                                            komp(tamten,o.licz)
                                                                        }
                                                                    }
								} else if(!o.toDelete) {
                                                                    if(o.fromMove>0){
                                                                        o.fromMove--;
                                                                        //if(tabela[oddzialy[i].x][oddzialy[i].y].miasto!=null)
                                                                        //    zmien[zmien.length] = o;
                                                                    } else {
									for(var z = 0;z<oddzialy.length;z++){
										if(z!=i && !oddzialy[z].toDelete && odl(oddzialy[i],oddzialy[z])<10 && oddzialy[z].kolor==oddzialy[i].kolor && oddzialy[z].path.length==0){
                                                                                            walka(oddzialy[i],oddzialy[z]);
                                                                                        
                                                                                }
                                                                        }
                                                                    }
								}
							}
							if(spr){
								var uupt = [];
								for(var i = 0;i<oddzialy.length;i++){
									uupt[i] = oddzialy[i];
								}
								uupt.sort(function(a,b){
									return a.x-b.x;
								});
							}
							//zmien = zmien.filter(x=>(x.licz === undefined || (x.licz>0 && !x.toDelete)))
						}
						if(stan%10==0){
							var szyb = 40;
							for(var i = 0;i<miasta.length;i++){
								miasta[i].wyprod+=miasta[i].size/szyb-Math.floor(miasta[i].size/szyb);
								miasta[i].znajd[0] = false;
								miasta[i].znajd[1] = false;
							}
							for(var i = 0;i<oddzialy.length;i++){
								var o = oddzialy[i];
								if(o.path.length>0){
								} else {
								if(tabela[o.x][o.y].miasto!=null && tabela[o.x][o.y].miasto.rosn==0){
									tabela[o.x][o.y].miasto.znajd[0] = true;
									if(o.licz<200){
										o.licz+=Math.floor(tabela[o.x][o.y].miasto.size/szyb)+Math.floor(tabela[o.x][o.y].miasto.wyprod);
										if(tabela[o.x][o.y].miasto.wyprod>=1){
											tabela[o.x][o.y].miasto.wyprod--;
										}
										/*if(o.licz>200)
											o.licz=200;*/
									}
								}
								if(tabela[o.x][o.y].port!=null && tabela[o.x][o.y].port.rosn==1){
									tabela[o.x][o.y].port.znajd[1] = true;
									if(o.licz<200){
										o.licz+=Math.floor(tabela[o.x][o.y].port.size/szyb)+Math.floor(tabela[o.x][o.y].port.wyprod);
										/*if(o.licz>200)
											o.licz=200;*/
									}
								}
								}
							}
							for(var i = 0;i<miasta.length;i++){
								if(Math.floor(miasta[i].size/szyb)+Math.floor(miasta[i].wyprod)>0){

										if(miasta[i].wyprod>=1){
											miasta[i].wyprod--;
										}
									if(miasta[i].rosn==0 && !miasta[i].znajd[0]){
										oddzialy[oddzialy.length] = new oddzial(miasta[i].x,miasta[i].y,miasta[i].kolor,Math.floor(miasta[i].size/szyb)+Math.floor(miasta[i].wyprod),0);
									}
									if(miasta[i].rosn==1 && !miasta[i].znajd[1]){
										oddzialy[oddzialy.length] = new oddzial(miasta[i].port.x,miasta[i].port.y,miasta[i].kolor,Math.floor(miasta[i].size/szyb)+Math.floor(miasta[i].wyprod),1);
									}
								}
							}
                                                            var stoj = true
                                                            var mkolor = null
                                                            for(var i in miasta){
                                                                if(mkolor==null){
                                                                    mkolor = miasta[i].kolor
                                                                    if(mkolor == wybranykolor){
                                                                        stoj = false
                                                                        break
                                                                    }
                                                                } else if(miasta[i].kolor!=mkolor){
                                                                    stoj = false
                                                                    break
                                                                }
                                                            }
                                                            if(stoj){
                                                                for(var i in oddzialy){
                                                                    oddzialy[i].path = []
                                                                }
                                                            }
						}
						if(stan%30==0){
                                                    hist.push(getSnap())
						}
						if(stan%5==0){
							rysuj();
						}
						if(stan==100){

							stan = 0;
						}
					}
					
									setTimeout(anim,50);
				}
				function walka(a,b){
					if(a.kolor==b.kolor){
						b.licz+=a.licz;
						a.licz = 0;
						a.toDelete = true;
					} else {
						if(a.licz<b.licz){
							var vs = a.licz;
							a.licz-=Math.ceil(b.licz/3);
							b.licz-=Math.ceil(vs/3);
						} else {
							var vs = a.licz;
							a.licz-=Math.ceil(b.licz/3);
							b.licz-=Math.ceil(vs/3);
						}
					}
				}
				function prawolewo(obj){
							if(lewo==-1){
								lewo = Math.max(0,obj.x-maxodl);
								prawo = Math.min(cwidth-1,obj.x+maxodl);
								gora = Math.max(0,obj.y-maxodl);
								dol = Math.min(cheight-1,obj.y+maxodl);
							} else {
								if(obj.x-maxodl<lewo){
									lewo = Math.max(0,obj.x-maxodl);
								}
								if(obj.x+maxodl>prawo){
									prawo = Math.min(cwidth-1,obj.x+maxodl);
								}
								if(obj.y-maxodl<gora){
									gora = Math.max(0,obj.y-maxodl);
								}
								if(obj.y+maxodl>dol){
									dol = Math.min(cheight-1,obj.y+maxodl);
								}
							}
				}
			function distmap(unit,_swoi,_oni){
				var dis = [];
				var miest = [];
				var oddz = [];
				swoi = 0
				oni = 0
				for(var i = 2;i<cwidth;i+=5){
					dis[(i-2)/5] = [];
					for(var j = 2;j<cheight;j+=5){
						dis[(i-2)/5][(j-2)/5] = {x:(i-2)/5,y:(j-2)/5,prevx:null,prevy:null,dist:cwidth*cheight,miasto:null,oddz:null};
					}
				}
				for(var i = 0;i<miasta.length;i++){
					var lf = (miasta[i].x-Math.floor(Math.sqrt(miasta[i].size)+5));
					var rt = (miasta[i].x+Math.floor(Math.sqrt(miasta[i].size)+5));
					var tp = (miasta[i].y-Math.floor(Math.sqrt(miasta[i].size)+5));
					var bt = (miasta[i].y+Math.floor(Math.sqrt(miasta[i].size)+5));
					for(var x = Math.floor((lf-2)/5);x<Math.floor((rt-2)/5);x++){
						for(var y = Math.floor((tp-2)/5);y<Math.floor((bt-2)/5);y++){
							dis[x][y].miasto = miasta[i];
						}
					}
				}
				for(var i = 0;i<oddzialy.length;i++){
					var lf = (oddzialy[i].x-5);
					var rt = (oddzialy[i].x+5);
					var tp = (oddzialy[i].y-5);
					var bt = (oddzialy[i].y+5);
					for(var x = Math.floor((lf-2)/5);x<Math.floor((rt-2)/5);x++){
						for(var y = Math.floor((tp-2)/5);y<Math.floor((bt-2)/5);y++){
							dis[x][y].oddz = oddzialy[i];
						}
					}
				}
				var us = dis[Math.floor((unit.x-2)/5)][Math.floor((unit.y-2)/5)];
				us.dist = 0;
				var tabl = [us];
				while(tabl.length>0 && (_oni==undefined || oni<_oni)){
					var tb = [];
					for(var i = 0;i<tabl.length;i++){
						var t = ts(tabl[i].x,tabl[i].y);
						for(var j = 0;j<8;j++){
							if(t[j].x>=0 && t[j].x<Math.floor((cwidth-2)/5) && t[j].y>=0 && t[j].y<Math.floor((cheight-2)/5)){
								if(dis[t[j].x][t[j].y].dist>=cwidth*cheight && kosztprz(tabl[i].x,tabl[i].y,j,dis,unit)<cwidth*cheight){
									tb[tb.length] = dis[t[j].x][t[j].y];
									dis[t[j].x][t[j].y].dist--;
								} else if((dis[t[j].x][t[j].y].miasto==null || (dis[t[j].x][t[j].y].miasto==tabl[i].miasto) || dis[t[j].x][t[j].y].miasto.kolor==unit.kolor)/* && (dis[t[j].x][t[j].y].oddz==null || dis[t[j].x][t[j].y].oddz.kolor==unit.kolor)*/ && dis[t[j].x][t[j].y].dist+kosztprz(tabl[i].x,tabl[i].y,j,dis,unit)<tabl[i].dist){

									tabl[i].dist = dis[t[j].x][t[j].y].dist+kosztprz(tabl[i].x,tabl[i].y,j,dis,unit);
									tabl[i].prevx = t[j].x;
									tabl[i].prevy = t[j].y;
									if(dis[t[j].x][t[j].y].miasto!=null){
										var ps = true;
										for(var k = 0;ps&&k<miest.length;k++){
											if(miest[k].m==dis[t[j].x][t[j].y].miasto)
												ps = false;
										}
										if(ps){
                                                                                    var mia = dis[t[j].x][t[j].y].miasto
                                                                                    if(mia.kolor == unit.kolor)
                                                                                        swoi++
                                                                                    if((first!=null && mia.kolor == first && unit.kolor!=first) || ((first==null || first==unit.kolor || revenge[unit.kolor][mia.kolor]>0) && mia.kolor != unit.kolor))
                                                                                        oni++
                                                                                    miest[miest.length] = {m:dis[t[j].x][t[j].y].miasto,dist:tabl[i].dist};
										}
									}
								}
							}
						}
					}
					//console.log(tb.length);
					tabl = tb;
				}
				miest.sort(function(a,b){
					return a.dist-b.dist;
				});
				return {map:dis,mist:miest};
			}
			function kosztprz(x,y,kier,dm,unit){
				var kox = ts(0,0)[kier].x;
				var koy = ts(0,0)[kier].y;
				var pocz = tabela[2+x*5][2+y*5].value;
				var wod = 0;
				for(var i = 1;i<=5;i++){
					//if(pocz==1){
						if(tabela[(2+x*5)+kox*i][(2+y*5)+koy*i].value==0){
							wod++;
						}
					//}
				}
				if(pocz==0){
					if(tabela[(2+x*5)+kox*5][(2+y*5)+koy*5].value==0 && wod>=5){
						return 5*Math.sqrt(kox*kox+koy*koy);
					} else if(dm[x+kox][y+koy].miasto!=null && dm[x+kox][y+koy].miasto.kolor==unit.kolor){
						return 5*Math.sqrt(kox*kox+koy*koy)*(unit.licz/10);
					} else {
						if(dm[x][y].miasto!=null)
							return 5*Math.sqrt(kox*kox+koy*koy);
						else
							return cwidth*cheight;
					}
				}/* else if(wod>2){
					if(dm[x][y].miasto!=null && dm[x][y].miasto.kolor==unit.kolor){
						return 5*Math.sqrt(kox*kox+koy*koy)*(unit.licz/10);
					} else {
						return cwidth*cheight;
					}
				}*/ else if(wod>0) {
					return 5*Math.sqrt(kox*kox+koy*koy)*(unit.licz/10);
				} else {
					return 5*Math.sqrt(kox*kox+koy*koy);
				}
			}
			function ts(xx,yy){
				return [{x:0+xx,y:-1+yy,d:1},{x:1+xx,y:-1+yy,d:Math.sqrt(2)},{x:1+xx,y:0+yy,d:1},{x:1+xx,y:1+yy,d:Math.sqrt(2)},{x:0+xx,y:1+yy,d:1},{x:-1+xx,y:1+yy,d:Math.sqrt(2)},{x:-1+xx,y:0+yy,d:1},{x:-1+xx,y:-1+yy,d:Math.sqrt(2)}];
			}
            