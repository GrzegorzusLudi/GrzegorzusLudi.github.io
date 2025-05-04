function aktwok(vx,vy){
	var akt = 0;
	var h = heks[vx][vy];
	h.zmiana += 1;
	if(vy>0){
		h.border[0].zmiana += 1;
	}
	if((vy>0 || vx%2==1) && vx<scian){
		h.border[1].zmiana += 1;
	}
	if((vy<scian || vx%2==0) && vx<scian){
		h.border[2].zmiana += 1;
	}
	if(vy<scian){
		h.border[3].zmiana += 1;
	}
	if((vy<scian || vx%2==0) && vx>0){
		h.border[4].zmiana += 1;
	}
	if((vy>0 || vx%2==1) && vx>0){
		h.border[5].zmiana += 1;
	}
}
blokada = false
function anim(){
	if(!document.hidden){
		var previousLiczeb = liczeb.slice()
		try {
			
			if(!blokada){
				blokada = true
			szpak = 0.34; //xD

			
			var nsto = false
			if(stan == 4){
				if(oddid[kolej]>0 && uniwy == -1){
					uniwy = 0;
					nastepnyoddzial();nsto = true
					
				}
				//console.log(uniwy,ruchwkolejcen)
				if(uniwy<ruchwkolejcen && ruchwkolejcen!=0){
					if(jesio>=0){
						unix[kolej][ruchwkolejce[uniwy]].przes += szpak;
					} else {
						unix[kolej][ruchwkolejce[uniwy]].przes -= szpak;
					}
					var tax = unix[kolej][ruchwkolejce[uniwy]].x
					var tay = unix[kolej][ruchwkolejce[uniwy]].y
					aktwok(unix[kolej][ruchwkolejce[uniwy]].x,unix[kolej][ruchwkolejce[uniwy]].y);

					if(unix[kolej][ruchwkolejce[uniwy]].szyt=="l" && szyt[unix[kolej][ruchwkolejce[uniwy]].rodz]!="l" && unix[kolej][ruchwkolejce[uniwy]].wypax==unix[kolej][ruchwkolejce[uniwy]].x && unix[kolej][ruchwkolejce[uniwy]].wypay==unix[kolej][ruchwkolejce[uniwy]].y && unix[kolej][ruchwkolejce[uniwy]].przes>=0 && jesio>=0 && heks[unix[kolej][ruchwkolejce[uniwy]].wypax][unix[kolej][ruchwkolejce[uniwy]].wypay].unp<4){
						unix[kolej][ruchwkolejce[uniwy]].przes = 0;
						wyladuj(ruchwkolejce[uniwy]);
						czyscc(uniwy,unix[kolej][ruchwkolejce[uniwy]].wypax,unix[kolej][ruchwkolejce[uniwy]].wypay,kolej);
						unix[kolej][ruchwkolejce[uniwy]].wypax = -1;
						unix[kolej][ruchwkolejce[uniwy]].wypay = -1;
						unix[kolej][ruchwkolejce[uniwy]].przes -= szpak;
					} else if(unix[kolej][ruchwkolejce[uniwy]].przes>0 && unix[kolej][ruchwkolejce[uniwy]].rucho[0]==0 && jesio>=0){
						czyscc(uniwy,unix[kolej][ruchwkolejce[uniwy]].x,unix[kolej][ruchwkolejce[uniwy]].y,kolej);
						var ask = 0;
						while(ask<unix[kolej][ruchwkolejce[uniwy]].ruchy-1){
							unix[kolej][ruchwkolejce[uniwy]].rucho[ask] = unix[kolej][ruchwkolejce[uniwy]].rucho[ask+1];
							unix[kolej][ruchwkolejce[uniwy]].ruchk[ask] = unix[kolej][ruchwkolejce[uniwy]].ruchk[ask+1];
							ask++;
						}
						if(unix[kolej][ruchwkolejce[uniwy]].celd!=-1 && unix[kolej][ruchwkolejce[uniwy]].ruchy==0 && unix[kolej][ruchwkolejce[uniwy]].rucho[0]==0){
							unix[kolej][ruchwkolejce[uniwy]].kiero = unix[kolej][ruchwkolejce[uniwy]].celk;
						} else {
							unix[kolej][ruchwkolejce[uniwy]].kiero = unix[kolej][ruchwkolejce[uniwy]].ruchk[0];
						}
						unix[kolej][ruchwkolejce[uniwy]].ruchy--;

					}
					if(unix[kolej][ruchwkolejce[uniwy]].przes>=1 && jesio>=0 || unix[kolej][ruchwkolejce[uniwy]].celd>-1 && unix[kolej][ruchwkolejce[uniwy]].ruchy <= 0){
						if(unix[kolej][ruchwkolejce[uniwy]].przes>=1)
							unix[kolej][ruchwkolejce[uniwy]].przes -= 2;
							//if(jesio>0)
							jesio--;
							if(unix[kolej][ruchwkolejce[uniwy]].rucho[0]>0 || unix[kolej][ruchwkolejce[uniwy]].ruchy>0){
								var tanx = heks[unix[kolej][ruchwkolejce[uniwy]].x][unix[kolej][ruchwkolejce[uniwy]].y].border[unix[kolej][ruchwkolejce[uniwy]].ruchk[0]].x
								var tany = heks[unix[kolej][ruchwkolejce[uniwy]].x][unix[kolej][ruchwkolejce[uniwy]].y].border[unix[kolej][ruchwkolejce[uniwy]].ruchk[0]].y
								var tundr = heks[tanx][tany].undr
								var tunp = heks[tanx][tany].unp
								unix[kolej][ruchwkolejce[uniwy]].rucho[0]--;
								unix[kolej][ruchwkolejce[uniwy]].przenies(unix[kolej][ruchwkolejce[uniwy]].ruchk[0]);
								
								aktdroguj(kolej,uniwy);

								if(tundr > -1 && tunp > 0 || heks[tanx][tany].cel_rodz > -1 || tutorial)
									checkCelebration(previousLiczeb,kolej,tundr)
									
								if(!unix[kolej][ruchwkolejce[uniwy]].kosz){
									if(heks[unix[kolej][ruchwkolejce[uniwy]].x][unix[kolej][ruchwkolejce[uniwy]].y].z == -2 && unix[kolej][ruchwkolejce[uniwy]].szyt!="g" /*górski oddział*/ && unix[kolej][ruchwkolejce[uniwy]].szyt!="l" /*oddział latający*/){
										jesio = 0;
									}
									if(jesio == -1){
										unix[kolej][ruchwkolejce[uniwy]].rucho[0]++;
										unix[kolej][ruchwkolejce[uniwy]].przes += 2;
									}
								} else {
									console.log('a:',tanx,tany)
									czyscc(ruchwkolejce[uniwy],tanx,tany,kolej)
									jesio = 0;
								}
							} else if(unix[kolej][ruchwkolejce[uniwy]].celd>-1) {
								if(kolej==unix[kolej][ruchwkolejce[uniwy]].celd){
									if(unix[kolej][ruchwkolejce[uniwy]].rodz==unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].rodz){
										spoj(ruchwkolejce[uniwy],unix[kolej][ruchwkolejce[uniwy]].celu);
									} else if(unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].rodz==10) {
										zaladuj(ruchwkolejce[uniwy],unix[kolej][ruchwkolejce[uniwy]].celu);
									}

								} else if(unix[kolej][ruchwkolejce[uniwy]].celd>-1 && szyt[unix[kolej][ruchwkolejce[uniwy]].rodz]==unix[kolej][ruchwkolejce[uniwy]].szyt) {
									var cd = unix[kolej][ruchwkolejce[uniwy]].celd
									atakuj(ruchwkolejce[uniwy],heks[unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].x][unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].y],unix[kolej][ruchwkolejce[uniwy]].celd);
									
									checkCelebration(previousLiczeb,kolej,cd)
									
								}
							} else if(unix[kolej][ruchwkolejce[uniwy]].celd==-2){
								atakujmost(ruchwkolejce[uniwy],heks[unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].x][unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].y]);
							}
					}
					/*if((unix[kolej][uniwy].ruchy == 0 && jesio == 0) && unix[kolej][uniwy].przes>=0 && unix[kolej][uniwy].celd>-1 && !unix[kolej][uniwy].kosz){
						unix[kolej][uniwy].kiero = unix[kolej][uniwy].celk;
					}*/
					aktdroguj(kolej,uniwy);

					if(((unix[kolej][ruchwkolejce[uniwy]].ruchy == 0 || jesio == 0) && unix[kolej][ruchwkolejce[uniwy]].przes>0 && (unix[kolej][ruchwkolejce[uniwy]].celd==-1 || jesio == 0)) || (jesio==-1 && unix[kolej][ruchwkolejce[uniwy]].przes<0) || unix[kolej][ruchwkolejce[uniwy]].kosz){
						unix[kolej][ruchwkolejce[uniwy]].przes = 0;
						//czyscc(ruchwkolejce[uniwy],tax,tay,kolej);
						aktdroguj(kolej,ruchwkolejce[uniwy]);
						uniwy++;
						nastepnyoddzial();nsto = true
					}
				}
				if(uniwy>=ruchwkolejcen){
					a = 0;
					while(a<scian){
						b = 0;
						while(b<scian){
							/*if(heks[a][b].unp>0 && dohod(a,b)>0 && heks[a][b].podatpr>0){

							}*/
							if(heks[a][b].unp>0 && dohod(a,b)>0 && heks[a][b].podatpr>0){
								przekazk(a,b);
							}
							b++;
						}
						a++;
					}

				}
				if(uniwy>=ruchwkolejcen){
					a = 0;
					while(a<scian){
						b = 0;
						while(b<scian){
							if(heks[a][b].z>0 && heks[a][b].undr == kolej){
								heks[a][b].kasy-=(-dohod(a,b));
								heks[a][b].stali-=(-heks[a][b].hutn);
								rozwijaj(a,b);
								kupuj(a,b);
							}
							b++;
						}
						a++;
					}
					changeState(2);
					if(tx != -1)
						odzaznaj();

				}

			} else if((dru[kolej]>1 || dru[kolej] == -1) && stan>1 && stan != 6){
				pokap()
				switch(dru[kolej]){
					case -1:  dummyplayer();break;
					case 2:  ai1();break;
					case 3:  ai2();break;
					case 4:  ai3();break;
					case 5:  ai4();break;
					case 6:  ai5();break;
				}
			} else if(stan == 6){
				if(playing){
					if(playframe <= 0){
						historyMove(false,false,true,true);
						playframe = 4
					} else {
						playframe--
					}
				}
				pokap()
			}
			if(kotron<scian){
				a = 400/scian;
				while(a>0 && kotron<scian){
					b = 0;
					while(b<scian){
						heks[kotron][b].zmiana += 1;
						b++;
					}
					kotron++;
					a--;
				}
			}
				if(cac>2 && ccmm>-1){
					sprawdz(mousePositionByCanvas.x,mousePositionByCanvas.y);
					if(clicked){
						pox-=vox/3/magni*scian/7;
						poy-=voy/3/magni*scian/7;
					}
					redraw(true);
				} else {
					redraw(false);
				}
			a = 0;
			while(a<scian){
				b = 0;
				while(b<scian){
					//if(stan>0){
						if(heks[a][b].z>0){
							//cde = 0;
							sum = dohod(a,b);
							/*while(cde<heks[a][b].unp){
								sum+=unix[heks[a][b].undr][heks[a][b].unt[cde]].il;
								cde++;
							}*/
							if(heks[a][b].koli<sum*10 && heks[a][b].koli<100){
								heks[a][b].koli+=5;
							}
							if(heks[a][b].koli>sum*10 && heks[a][b].koli>0){
								heks[a][b].koli-=5;
							}
						}
						if(celebracja[heks[a][b].undr] > 0){
							heks[a][b].fajerwerktime++
							for(var ii in heks[a][b].fajerwerki){
								if(heks[a][b].fajerwerki[ii] <= 0 && heks[a][b].fajerwerktime > ii*10 && (ii < 2 || heks[a][b].z > 0))
									heks[a][b].fajerwerki[ii]++
							}
						} else {
							heks[a][b].fajerwerktime = 0
						}
						for(var ii in heks[a][b].fajerwerki){
							if(heks[a][b].fajerwerki[ii] > 0){
								heks[a][b].fajerwerki[ii]++
								heks[a][b].zmiana = 50
								if(b > 0){
									heks[a][b-1].zmiana = 50
									if(a % 2 == 0){
										if(a > 0){
											heks[a-1][b-1].zmiana = 50
										}
										if(a<scian-1){
											heks[a+1][b-1].zmiana = 50
										}
									}
								}
								if(a % 2 == 1){
									if(a > 0){
										heks[a-1][b].zmiana = 50
									}
									if(a<scian-1){
										heks[a+1][b].zmiana = 50
									}
								}
							}
							if(heks[a][b].fajerwerki[ii]>50)
								heks[a][b].fajerwerki[ii] = 0
						}
						if(heks[a][b].plum>0){
							heks[a][b].plumy+=0.5;
							if(heks[a][b].plumy>10){
								heks[a][b].plumy = 0;
								heks[a][b].plum = Math.floor(heks[a][b].plum/6);
								var io = 0;
								while(io<6){
									if(heks[a][b].border[io]!=null){
										heks[a][b].border[io].plum += Math.floor(heks[a][b].plum/6);
										heks[a][b].border[io].zmiana = 20;
									}
									io++;
								}
							}
						}
						for(var i = 0;i<6;i++){
							if(heks[a][b].buchy[i].stan<20)
								heks[a][b].buchy[i].stan++;
						}
					//}
					b++;
				}
				a++;
			}
			delaj--;

				blokada = false
				if(nsto){
					redrawCanvas(statisticsCanvasCtx);
					redrawCanvas(statisticsCanvasCtx2);
					//redrawCanvas(statisticsCanvasCtx3);
					historyDex.zapisz()
				}
			}
			

		} catch(e){
			throw e
		}
	}
			for(var i in celebracja){
				if(celebracja[i] > 0){
					celebracja[i] -= 1
				}
			}
    setTimeout(()=>anim(),aistan == 1.3 ? 25 : 25)
}
function dummyplayer(){
	if(aistan == 0){
		aistan = 1377.997
	} else {
		zaznx = -1
		zazny = -1
		tx = -1
		ty = -1
		zaznu = -1
		changeState(4);
		aistan = 0
	}
}
function nastepnyoddzial(){
    while(uniwy<ruchwkolejcen && (unix[kolej][ruchwkolejce[uniwy]]==null || unix[kolej][ruchwkolejce[uniwy]].kosz || (unix[kolej][ruchwkolejce[uniwy]].ruchy<=0 && unix[kolej][ruchwkolejce[uniwy]].celd==-1))){
        uniwy++;
    }
    if(uniwy<ruchwkolejcen){
            unix[kolej][ruchwkolejce[uniwy]].kiero = unix[kolej][ruchwkolejce[uniwy]].ruchk[0];
            unix[kolej][ruchwkolejce[uniwy]].przes += szpak;
            if(heks[unix[kolej][ruchwkolejce[uniwy]].x][unix[kolej][ruchwkolejce[uniwy]].y].z>0){
                    heks[unix[kolej][ruchwkolejce[uniwy]].x][unix[kolej][ruchwkolejce[uniwy]].y].zmiana = 20;
            }
            aktwok(unix[kolej][ruchwkolejce[uniwy]].x,unix[kolej][ruchwkolejce[uniwy]].y);
            jesio = unix[kolej][ruchwkolejce[uniwy]].szy;
            bitni = unix[kolej][ruchwkolejce[uniwy]].il;
    }
}
