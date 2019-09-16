
				function rysuj(){
					przerw = true;
                                        ctx2.clearRect(0,0,cwidth,cheight);
					if(historia)
                                            pierw = true
					if(pierw){
						lewo=0,prawo=cwidth,gora=0,dol=cheight;
					} else {
						lewo=-1,prawo=-1,gora=-1,dol=-1;
					}
					if(historia){
                                            elpanel();
                                            rys2();
                                            ryss()
                                            return
					}
                                        var dd = zmien.length;
                                        var zimen = [];
                                        
                                        for(var i = 0;i<dd;i++){
                                                lewo=-1,prawo=-1,gora=-1,dol=-1;
                                                prawolewo(zmien[i]);
                                                zimen[i] = {l:lewo,p:prawo,g:gora,d:dol,zmieni:[zmien[i]]};
                                                for(var j = 0;j<granic.length;j++){
                                                    
                                                        if(granic[j].a==zmien[i] && zimen[i].zmieni.indexOf(granic[j].b)==-1){
                                                                zimen[i].zmieni[zimen[i].zmieni.length] = granic[j].b;
                                                                prawolewo(granic[j].b);
                                                        }
                                                        if(granic[j].b==zmien[i] && zimen[i].zmieni.indexOf(granic[j].a)==-1){
                                                                zimen[i].zmieni[zimen[i].zmieni.length] = granic[j].a;
                                                                prawolewo(granic[j].a);
                                                        }
                                                }
                                        }
                                        for(var i = 1;i<zimen.length;i++){
                                                for(var j = 0;j<i;j++){
                                                        var tl = Math.min(zimen[i].l,zimen[j].l);
                                                        var tp = Math.max(zimen[i].p,zimen[j].p);
                                                        var tg = Math.min(zimen[i].g,zimen[j].g);
                                                        var td = Math.max(zimen[i].d,zimen[j].d);
                                                        if((td-tg)*(tp-tl)<(zimen[i].p-zimen[i].l)*(zimen[i].d-zimen[i].g)+(zimen[j].p-zimen[j].l)*(zimen[j].d-zimen[j].g)){
                                                                zimen[j].l = tl;
                                                                zimen[j].p = tp;
                                                                zimen[j].g = tg;
                                                                zimen[j].d = td;
                                                                for(var k = 0;k<zimen[i].zmieni.length;k++){
                                                                        if(zimen[j].zmieni.indexOf(zimen[i].zmieni[k])==-1){
                                                                                zimen[j].zmieni[zimen[j].zmieni.length] = zimen[i].zmieni[k];
                                                                        }
                                                                }
                                                                zimen[i] = zimen[zimen.length-1];
                                                                zimen.length--;
                                                                j = i+1;
                                                                i--;
                                                        }
                                                }
                                        }
                                        
                                        
                                        for(var i = 0;i<zimen.length;i++){
                                                przerw = true;
                                                if(pierw){
                                                    lewo=0,prawo=cwidth,gora=0,dol=cheight;
                                                    pierw = false
                                                    ryss()
                                                    break
                                                } else {
                                                    lewo=zimen[i].l,prawo=zimen[i].p,gora=zimen[i].g,dol=zimen[i].d;
                                                    zmien = zimen[i].zmieni;
                                                    if(zmien.length>0)
                                                        ryss();
                                                    
                                                }
                                        }
                                        
                                        for(var i = 0;i<oddzialy.length;i++){
                                            if("toDelete" in oddzialy[i]){
                                                var inzazn = false
                                                for(var j in zazn){
                                                    if(zazn[j]==oddzialy[i]){
                                                        inzazn = true
                                                        zazn.length--
                                                    }
                                                    if(inzazn && j<zazn.length)
                                                        zazn[j] = zazn[j+1]
                                                }
                                                oddzialy[i] = oddzialy[oddzialy.length-1]
                                                oddzialy.length--
                                                i--;
                                            }
                                        }
                                        elpanel();
                                        przerw = false;
					rys2();
					
				}
				function elpanel(){
					if(stan<0){
						ctx.fillStyle="#ccc";
						ctx.fillRect(0,cheight,cwidth,40);
						if(stan<=-20){
							ctx.font="16pt Courier New";
							ctx.fillStyle="#000";
							ctx.textAlign = "center";
							ctx.fillText("Wybierz miasto lub oddział, by rozpocząć swoją przygodę...",cwidth/2,cheight+25);
						}
					} else {
						ctx.fillStyle=wybranykolor;
						ctx.fillRect(0,cheight,cwidth,40);
						if(zazn.length>0){
							ctx.strokeStyle = "#fff";
						if(zazn[0].rodz==1){
							ctx.fillStyle="#fff";
							ctx.globalAlpha=0.5;
							ctx.fillRect(zazt*40,cheight,40,40);
							ctx.globalAlpha=1;
							ctx.drawImage(i1,0,cheight);
							ctx.drawImage(i2,40,cheight);
							ctx.drawImage(i3,80,cheight);
							ctx.drawImage(i4,120,cheight);
							ctx.strokeRect(0,cheight,40,40);
							ctx.strokeRect(40,cheight,40,40);
							ctx.strokeRect(80,cheight,40,40);
							ctx.strokeRect(120,cheight,40,40);
							if(zazn.length==1 && zazn[0].typ==0){
                                                            ctx.drawImage(i5,160,cheight);
                                                            ctx.strokeRect(160,cheight,40,40);
							}
						} else if(zazn[0].rodz==0){

							ctx.fillStyle="#fff";
							ctx.globalAlpha=0.5;
							ctx.fillRect(zazn[0].rosn*40,cheight,40,40);
							ctx.globalAlpha=1;

							ctx.drawImage(i6,0,cheight);
							ctx.strokeRect(0,cheight,40,40);
							if(zazn[0].port!=null){
								ctx.drawImage(i7,40,cheight);
								ctx.strokeRect(40,cheight,40,40);
							}

						}
						} else if(pauza){
                                                    if(!historia){
                                                        ctx.strokeStyle = "#fff";
                                                        ctx.strokeRect(5,cheight+5,140,30);
                                                        ctx.font = "20px Courier New"
                                                        ctx.textAlign = "center"
                                                        ctx.fillStyle="#fff";
                                                        ctx.fillText("HISTORIA",75,cheight+25);
                                                    } else {
                                                        ctx.fillStyle="#fff";
                                                        ctx.fillRect(leftp,cheight+19,rightp-leftp,2)
                                                        ctx.fillRect(leftp-4+(rightp-leftp)*histmoment/hist.length,cheight+10,8,20)
                                                    }
						}
                                                ctx.strokeStyle = "#fff";
                                                ctx.strokeRect(cwidth-100,cheight,100,40);
						ctx.font = "25px Courier New"
						ctx.textAlign = "center"
                                                ctx.fillStyle="#fff";
                                                ctx.fillText(pauza?"WZNÓW":"PAUZA",cwidth-50,cheight+25);

						
					}
					ctx.fillStyle = "#000"
					ctx.fillRect(cwidth,0,80,cheight+40)
                                        ctx.drawImage(i8,cwidth,0);
                    var gr = getRanking()
					var rank = gr.zbior    // {kolor:"#b00",il:9001}
					for(var i in rank){
                                            var y = i*20+20
                                            ctx.fillStyle = rank[i].kolor
                                            ctx.fillRect(cwidth+40,y,40,20)
                                            if(rank[i].kolor == first){
                                                ctx.strokeStyle = "#ff0"
                                                ctx.fillStyle = "#ff0"
                                            } else {
                                                ctx.strokeStyle = "#000"
                                                ctx.fillStyle = "#000"
                                            }
                                            ctx.strokeRect(cwidth+40,y,40,20)
                                            ctx.textAlign="center";
                                            ctx.font="12pt Courier New";
                                            ctx.fillText(rank[i].il,cwidth+60,y+16)
                                            ctx.fillStyle = "#000"
                                            ctx.font="10pt Courier New";
                                            ctx.fillText(rank[i].kolor==wybranykolor?"H":ailevel[rank[i].kolor],cwidth+45,y+18)
					}
					var mrank = gr.mzbior    // {kolor:"#b00",il:9001}
					for(var i in mrank){
                                            var y = i*20+20
                                            ctx.fillStyle = mrank[i].kolor
                                            ctx.fillRect(cwidth,y,40,20)
                                            if(mrank[i].kolor == first){
                                                ctx.strokeStyle = "#ff0"
                                                ctx.fillStyle = "#ff0"
                                            } else {
                                                ctx.strokeStyle = "#000"
                                                ctx.fillStyle = "#000"
                                            }
                                            ctx.strokeRect(cwidth,y,40,20)
                                            ctx.textAlign="center";
                                            ctx.font="12pt Courier New";
                                            ctx.fillText(mrank[i].il,cwidth+20,y+16)
                                            ctx.fillStyle = "#000"
                                            ctx.font="10pt Courier New";
                                            ctx.fillText(mrank[i].kolor==wybranykolor?"H":ailevel[mrank[i].kolor],cwidth+5,y+18)
					}
                    /*
					var drank = gr.dzbior    // {kolor:"#b00",il:9001}
					for(var i in drank){
                                            var y = i*20+20
                                            ctx.fillStyle = drank[i].kolor
                                            ctx.fillRect(cwidth+80,y,40,20)
                                            if(drank[i].kolor == first){
                                                ctx.strokeStyle = "#ff0"
                                                ctx.fillStyle = "#ff0"
                                            } else {
                                                ctx.strokeStyle = "#000"
                                                ctx.fillStyle = "#000"
                                            }
                                            ctx.strokeRect(cwidth+80,y,40,20)
                                            ctx.textAlign="center";
                                            ctx.font="12pt Courier New";
                                            ctx.fillText(drank[i].il,cwidth+100,y+16)
                                            ctx.fillStyle = "#000"
                                            ctx.font="10pt Courier New";
                                            ctx.fillText(drank[i].kolor==wybranykolor?"H":ailevel[drank[i].kolor],cwidth+85,y+18)
					}*/
				}
function miastorysuj(){

                    ctx2.fillStyle = this.kolor;
        if(podsw==this || zazn.indexOf(this)>-1)
            ctx2.strokeStyle="#fff";
        else
            ctx2.strokeStyle="#000";
                    ctx2.beginPath();
                    ctx2.arc(this.x, this.y, Math.sqrt(this.size), 0, 2 * Math.PI, false);
                    ctx2.fill();ctx2.stroke();
                    if(this.port){
                        var xg = this.port.x;
                        var yg = this.port.y;
                        sx = Math.sqrt(this.size)*3;
                        sy = Math.sqrt(this.size)*3;
        ctx2.beginPath();
        ctx2.arc(xg, yg-sy*0.25, sy/10, 0, Math.PI*2, false);
        ctx2.closePath();
        ctx2.stroke();

        ctx2.beginPath();
        ctx2.moveTo(xg,yg-sy*0.15);
        ctx2.lineTo(xg,yg-sy*0.1);
        ctx2.lineTo(xg-sy*0.15,yg-sy*0.1);
        ctx2.lineTo(xg+sy*0.1,yg-sy*0.1);
        ctx2.lineTo(xg,yg-sy*0.15);
        ctx2.lineTo(xg,yg+sy*0.15);
        ctx2.stroke();

        ctx2.beginPath();
        ctx2.arc(xg-sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
        ctx2.lineTo(xg-sy*0.3, yg+sy*0.05);
        ctx2.stroke();

        ctx2.beginPath();
        ctx2.moveTo(xg-sy*0.3, yg+sy*0.05);
        ctx2.lineTo(xg-sy*0.4, yg+sy*0.2);
        ctx2.lineTo(xg-sy*0.3, yg+sy*0.05);
        ctx2.lineTo(xg-sy*0.2, yg+sy*0.2);
        ctx2.stroke();

        ctx2.beginPath();
        ctx2.arc(xg+sy*0.15, yg+sy*0.15, sy*0.15, 0, Math.PI, false);
        //btx.lineTo(xg+sy*0.3, yg+sy*0.05);
        ctx2.stroke();

        ctx2.beginPath();
        ctx2.moveTo(xg+sy*0.3, yg+sy*0.05);
        ctx2.lineTo(xg+sy*0.2, yg+sy*0.2);
        ctx2.lineTo(xg+sy*0.3, yg+sy*0.05);
        ctx2.lineTo(xg+sy*0.4, yg+sy*0.2);
        ctx2.stroke();

                    }
    }

function bord(piks){
    var tabl = [];
    if(piks.x>0){
        tabl[tabl.length] = tabela[piks.x-1][piks.y];
    }
    if(piks.x<cwidth-1){
        tabl[tabl.length] = tabela[piks.x+1][piks.y];
    }
    if(piks.y>0){
        tabl[tabl.length] = tabela[piks.x][piks.y-1];
    }
    if(piks.y<cheight-1){
        tabl[tabl.length] = tabela[piks.x][piks.y+1];
    }
    return tabl;
}
function bord2(piks){
    var tabl = [];
    if(piks.x>0){
        tabl[tabl.length] = tabela[piks.x-1][piks.y];
    }
    if(piks.x<cwidth-1){
        tabl[tabl.length] = tabela[piks.x+1][piks.y];
    }
    if(piks.y>0){
        tabl[tabl.length] = tabela[piks.x][piks.y-1];
    }
    if(piks.y<cheight-1){
        tabl[tabl.length] = tabela[piks.x][piks.y+1];
    }
    if(piks.x>0 && piks.y>0 && tabela[piks.x-1][piks.y].value==1 && tabela[piks.x][piks.y-1].value==1){
        tabl[tabl.length] = tabela[piks.x-1][piks.y-1];
    }
    if(piks.x<cwidth-1 && piks.y>0 && tabela[piks.x+1][piks.y].value==1 && tabela[piks.x][piks.y-1].value==1){
        tabl[tabl.length] = tabela[piks.x+1][piks.y-1];
    }
    if(piks.x>0 && piks.y<cheight-1 && tabela[piks.x-1][piks.y].value==1 && tabela[piks.x][piks.y+1].value==1){
        tabl[tabl.length] = tabela[piks.x-1][piks.y+1];
    }
    if(piks.x<cwidth-1 && piks.y<cheight-1 && tabela[piks.x+1][piks.y].value==1 && tabela[piks.x][piks.y+1].value==1){
        tabl[tabl.length] = tabela[piks.x+1][piks.y+1];
    }
    return tabl;
}
function odl(a,b){
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

					function ryss(){
                                           var kolormorza = hexToRgb("#0088ff");
                                           var dd = hexToRgb("#dddddd");
						przerw = false;
                                                //console.log(lewo+" "+prawo)
                                                
						for(var i=lewo+1;i<prawo-1;i++){
							for(var j=gora+1;j<dol-1;j++){
                                                                //atabela[i][j] = tabela[i][j].nalez
								if(tabela[i][j].value==1 && tabela[i][j].nalez == -1 && atabela[i][j]!=undefined){
									tabela[i][j].nalez = atabela[i][j];
								}
							}
						}
						
						
						var imgdata = ctx.getImageData(lewo,gora,prawo-lewo,dol-gora);
                                                var idata = imgdata.data
                                                
						for(var i=lewo;i<prawo;i++){
							var ost = gora;
							for(var j=gora;j<dol;j++){
                                                            //if(tabela[i][j].nalez==-1 || atabela[i][j]!=tabela[i][j].nalez)
								if(tabela[i][j].value==0){
										//if(j==dol-1 || tabela[i][j+1].value!=0){
											//ctx.fillRect(i,ost,1,j-ost+1);
                                                                                        drawPixel(idata,i-lewo,j-gora,kolormorza,prawo-lewo)
											//ost = j+1;
										//}
								} else {
                                                                    var fill
									if(tabela[i][j].nalez==-1){
                                                                                //drawPixel(idata,i,j,fill)
                                                                                fill = dd
										//ctx.fillStyle = "#dddddd";
									} else if(historia) {
										fill = tabela[i][j].nalez.hkolor;
                                                                            
									} else {
										fill = tabela[i][j].nalez.akolor;
                                                                                //drawPixel(idata,i,j,fill)
										//ctx.fillStyle = tabela[i][j].nalez.kolor;
									}

										//if(j==dol-1 || tabela[i][j+1].value==0 || tabela[i][j+1].nalez==-1 || (tabela[i][j].nalez!=-1 && tabela[i][j+1].nalez!=-1 && tabela[i][j+1].nalez.kolor!=tabela[i][j].nalez.kolor)){
											//ctx.fillRect(i,ost,1,j-ost+1);
                                                                        drawPixel(idata,i-lewo,j-gora,fill,prawo-lewo)

											//ost = j+1;
										//}
								}
                                                            atabela[i][j] = tabela[i][j].nalez
							}
						}
                                                narysowuj(idata);
                                                ctx.putImageData(imgdata, lewo, gora);
						
					}
					function hexToRgb(hex) {
                                            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                            return [
                                                parseInt(result[1], 16),
                                                parseInt(result[2], 16),
                                                parseInt(result[3], 16)
                                                ];
                                        }

					function drawPixel(data,x,y,rgbarr,prawo) {
                                            i = 4*(y*prawo+x);
                                            data[i] = rgbarr[0]; // Invert Red
                                            data[i+1] = rgbarr[1]; // Invert Green
                                            data[i+2] = rgbarr[2]; // Invert Blue
                                        }

					function rys2(){
                                            if(!historia){
						for(var i=0;i<miasta.length;i++){
							miasta[i].rysuj();
						}

						for(var i=0;!przerw && i<oddzialy.length;i++){
							oddzialy[i].rysuj();
						}
                                            } else {
                                                var moment = snaps[histmoment]
                                                
						for(var i=0;i<moment.miasta.length;i++){
							moment.miasta[i].rysuj();
							moment.miasta[i].self.hkolor = moment.miasta[i].akolor
							moment.miasta[i].self.hhkolor = moment.miasta[i].kolor
						}

						for(var i=0;!przerw && i<moment.oddzialy.length;i++){
							moment.oddzialy[i].rysuj();
						}
                                            }

                                        }
					function nanalez(a,b){
						if(a.nalez==-1 && b.nalez==-1){
							return false;
						} else if(a.nalez==-1 || b.nalez==-1){
							return true;
						} else if(a.nalez.pkolor()==b.nalez.pkolor() && !nanan(a,b)){
							return false;
						} else {
							return true;
						}
					}
					function nanan(a,b){
                                                if(a.nalez==-1 && b.nalez==-1){
							return false;
						} else if(a.nalez==-1 || b.nalez==-1){
							return true;
						} else {
                                                    return tabela[a.nalez.x][a.nalez.y].kolor!=tabela[b.nalez.x][b.nalez.y].kolor
						}
					}
					function narysowuj(idata){
                                           var k048 = hexToRgb("#004488");
                                           var k444 = hexToRgb("#444444");
                                           var k666 = hexToRgb("#666666");
                                           var kddd = hexToRgb("#dddddd");
						granic = [];
						zmien = [];
						for(var i=lewo;i<prawo;i++){
							for(var j=gora;j<dol;j++){
								if(tabela[i][j].value==0){
									var gry = bord(tabela[i][j]);
									var shore = false;
									for(var l = 0;l<gry.length;l++){
										if(gry[l].value == 1){
											shore = true;
											l = 4;
										}
									}
									if(shore){
                                                                                fill = k048
                                                                                drawPixel(idata,i-lewo,j-gora,fill,prawo-lewo)
                                                                                drawPixel(idata,i+1-lewo,j-gora,fill,prawo-lewo)
                                                                                drawPixel(idata,i-lewo,j+1-gora,fill,prawo-lewo)
                                                                                drawPixel(idata,i+1-lewo,j+1-gora,fill,prawo-lewo)
										//ctx.fillStyle = "#048";
										//ctx.fillRect(i,j,2,2);
									}
								} else {

										if(i>0 && (tabela[i-1][j].nalez!=tabela[i][j].nalez || nanan(tabela[i-1][j],tabela[i][j]))){
											if(nanalez(tabela[i-1][j],tabela[i][j])){
                                                                                            if(nanan(tabela[i-1][j],tabela[i][j])){
                                                                                                
                                                                                            fill = k666
                                                                                            drawPixel(idata,i-lewo,j-gora,fill,prawo-lewo)
                                                                                                drawPixel(idata,i+1-lewo,j-gora,fill,prawo-lewo)
                                                                                                drawPixel(idata,i-lewo,j+1-gora,fill,prawo-lewo)
                                                                                                drawPixel(idata,i+1-lewo,j+1-gora,fill,prawo-lewo)
                                                                                            } else {
                                                                                            fill = k444
                                                                                            drawPixel(idata,i-lewo,j-gora,fill,prawo-lewo)
                                                                                                
                                                                                            }
											}
											granic[granic.length] = {a:tabela[i-1][j].nalez,b:tabela[i][j].nalez};
											granic[granic.length] = {a:tabela[i][j].nalez,b:tabela[i-1][j].nalez};
										}
										if(j>0 && (tabela[i][j-1].nalez!=tabela[i][j].nalez || nanan(tabela[i-1][j],tabela[i][j]))){
											if(nanalez(tabela[i][j-1],tabela[i][j])){
                                                                                            if(nanan(tabela[i-1][j],tabela[i][j])){
                                                                                                
                                                                                                fill = k666
                                                                                            drawPixel(idata,i-lewo,j-gora,fill,prawo-lewo)
                                                                                                drawPixel(idata,i+1-lewo,j-gora,fill,prawo-lewo)
                                                                                                drawPixel(idata,i-lewo,j+1-gora,fill,prawo-lewo)
                                                                                                drawPixel(idata,i+1-lewo,j+1-gora,fill,prawo-lewo)
                                                                                            } else {
                                                                                                fill = k444
                                                                                            drawPixel(idata,i-lewo,j-gora,fill,prawo-lewo)
                                                                                                
                                                                                            }
											}
											granic[granic.length] = {a:tabela[i][j-1].nalez,b:tabela[i][j].nalez};
											granic[granic.length] = {a:tabela[i][j].nalez,b:tabela[i][j-1].nalez};
											/*ctx2.beginPath();
											ctx2.moveTo(granic[granic.length-1].a.x,granic[granic.length-1].a.y);
											ctx2.lineTo(granic[granic.length-1].b.x,granic[granic.length-1].b.y);
											ctx2.stroke();*/
										}
								}
							}
						}
						znalez = [];
					}