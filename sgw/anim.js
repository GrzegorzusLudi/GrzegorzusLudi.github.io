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
async function anim(){
    if(!blokada){
        blokada = true
	szpak = 0.34; //xD
	if(stan == 4){
		if(oddid[kolej]>0 && uniwy == -1){
			uniwy = 0;
			nastepnyoddzial();
		}
		if(uniwy<ruchwkolejcen && ruchwkolejcen!=0){
			if(jesio>=0){
				unix[kolej][ruchwkolejce[uniwy]].przes += szpak;
			} else {
				unix[kolej][ruchwkolejce[uniwy]].przes -= szpak;
			}
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
			if(unix[kolej][ruchwkolejce[uniwy]].przes>=1 && jesio>=0){
					unix[kolej][ruchwkolejce[uniwy]].przes -= 2;
					//if(jesio>0)
					jesio--;
					if(unix[kolej][ruchwkolejce[uniwy]].rucho[0]>0 || unix[kolej][ruchwkolejce[uniwy]].ruchy>0){
						unix[kolej][ruchwkolejce[uniwy]].rucho[0]--;
						unix[kolej][ruchwkolejce[uniwy]].przenies(unix[kolej][ruchwkolejce[uniwy]].ruchk[0]);
						if(!unix[kolej][ruchwkolejce[uniwy]].kosz){
							if(heks[unix[kolej][ruchwkolejce[uniwy]].x][unix[kolej][ruchwkolejce[uniwy]].y].z == -2 && unix[kolej][ruchwkolejce[uniwy]].szyt!="g" /*górski oddział*/ && unix[kolej][ruchwkolejce[uniwy]].szyt!="l" /*oddział latający*/){
								jesio = 0;
							}
							if(jesio == -1){
								unix[kolej][ruchwkolejce[uniwy]].rucho[0]++;
								unix[kolej][ruchwkolejce[uniwy]].przes += 2;
							}
						} else {
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

							atakuj(ruchwkolejce[uniwy],heks[unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].x][unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].y],unix[kolej][ruchwkolejce[uniwy]].celd);
						}
					} else if(unix[kolej][ruchwkolejce[uniwy]].celd==-2){
						atakujmost(ruchwkolejce[uniwy],heks[unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].x][unix[unix[kolej][ruchwkolejce[uniwy]].celd][unix[kolej][ruchwkolejce[uniwy]].celu].y]);
					}
			}
			/*if((unix[kolej][uniwy].ruchy == 0 && jesio == 0) && unix[kolej][uniwy].przes>=0 && unix[kolej][uniwy].celd>-1 && !unix[kolej][uniwy].kosz){
				unix[kolej][uniwy].kiero = unix[kolej][uniwy].celk;
			}*/
			if(((unix[kolej][ruchwkolejce[uniwy]].ruchy == 0 || jesio == 0) && unix[kolej][ruchwkolejce[uniwy]].przes>0 && (unix[kolej][ruchwkolejce[uniwy]].celd==-1 || jesio == 0)) || (jesio==-1 && unix[kolej][ruchwkolejce[uniwy]].przes<0) || unix[kolej][ruchwkolejce[uniwy]].kosz){
				unix[kolej][ruchwkolejce[uniwy]].przes = 0;
				//czyscc(uniwy,unix[kolej][uniwy].x,unix[kolej][uniwy].y);
				//aktdroguj(kolej,uniwy);
				uniwy++;
				nastepnyoddzial();
			}
		}
		if(uniwy>=ruchwkolejcen){
			a = 0;
			while(a<scian){
				b = 0;
				while(b<scian){
					if(heks[a][b].unp>0 && dohod(a,b)>0 && heks[a][b].podatpr>0){

					}
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

		}

	} else if(dru[kolej]>1 && stan>1){
		switch(dru[kolej]){
			case 2: await ai1();break;
			case 3: await ai2();break;
			case 4: await ai3();break;
			case 5: await ai4();break;
			case 6: await ai5();break;
		}
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
			pox-=vox/3/magni*scian/10;
			poy-=voy/3/magni*scian/10;
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
