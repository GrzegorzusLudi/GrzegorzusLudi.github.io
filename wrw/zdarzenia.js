
    function doMouseMove(event){
        var rect = c.getBoundingClientRect();
        var cx = Math.floor(event.clientX-rect.left);
        var cy = Math.floor(event.clientY-rect.top);
        podsw = null;
        for(var i = 0;i<oddzialy.length;i++){
            if(oddzialy[i].najedz(cx,cy)){
                podsw = oddzialy[i];
                var aux = oddzialy[oddzialy.length-1];
                oddzialy[oddzialy.length-1]=oddzialy[i];
                oddzialy[i]=aux;
                i = oddzialy.length;
                prawolewo({x:cx,y:cy});
            }
        }
        if(podsw==null){
            for(var i = 0;i<miasta.length;i++){
                if(miasta[i].najedz(cx,cy)){
                    podsw = miasta[i];
                    var aux = miasta[miasta.length-1];
                    miasta[miasta.length-1]=miasta[i];
                    miasta[i]=aux;
                    i = miasta.length;
                    prawolewo({x:cx,y:cy});
                }
            }
        }
                            if(wx != -1 && wy != -1 && historia && cy>cheight+5 && cy<cheight+30 && cx>leftp && cx<rightp){
                                prevmom = histmoment
                                histmoment = Math.round(hist.length*(cx-leftp)/(rightp-leftp))
                                if(prevmom!=histmoment)
                                    rysuj()
                            } else {
                                rys2();
        }
    }
    function doMouseDown(event){
        lapod = podsw;
        var rect = c.getBoundingClientRect();
        wx = Math.floor(event.clientX-rect.left);
        wy = Math.floor(event.clientY-rect.top);
        var miastt = false;

        if(stan<0){
            if(podsw!=null && !historia){
                wybranykolor = podsw.kolor;
                if(Math.random()<0.005){
                                                for(var i in oddzialy){
                                                    var o = oddzialy[i]
                                                    if(o.kolor!=wybranykolor && (i%20)<10){
                                                        o.kolor = "#ff0000"
                                                        o.licz = 20
                                                    } else {
                                                        o.licz = 200
                                                    }
                                                }
                }
                stan = 0;
                rysuj();
            }
        } else {
            if(wx<cwidth){
                if(wy<cheight && !historia){
                    if(podsw!=null){
                        if(zazn.length==0 || ((zazn[0].rodz!=1 || podsw == tabela[zazn[0].x][zazn[0].y].miasto) && zazn[0] != podsw)){
                            if(podsw.kolor==wybranykolor) {
                                zazn = [podsw];
                            }
                        } else if(zazn[0].rodz==1){
                            if(zazn.indexOf(podsw)>-1){
                                zazn = [];
                            } else if(podsw.rodz==0 || podsw.rodz==1){
                                makepath(zazn[0],podsw.x,podsw.y,zazt);
                                zazn = [];
                            }
                        } else if(zazn[0] == podsw) {
                                                                    zazn = [];
                        }
                    } else {
                        if(zazn[0].rodz==1){
                            makepath(zazn[0],wx,wy,zazt);
                            zazn = [];
                        } else {
                            zazn = [];
                        }
                    }
                    rysuj();
                } else {

                    if(zazn.length>0){
                        if(zazn[0].rodz==1){
                            if(wx<40*4){
                                zazt = Math.floor(wx/40);
                            } else if(wx<40*5 && zazn.length==1 && zazn[0].typ==0){
                                zazn[0].domiasta();
                            }
                        } else if(zazn[0].rodz==0){

                            if(wx<40*2){
                                zazn[0].rosn = Math.floor(wx/40);
                            }
                        }

                    } else if(pauza && !historia && wx>5 && wx<140 && wy>cheight+5 && wy<cheight+30){
                                                        historia = true
                                                        przedzialow = hist.length+1
                                                        histmoment = hist.length
                                                        snaps = hist.concat([getSnap()])
                                                        zazn = []
                    }
                    if(historia && wy>cheight+5 && wy<cheight+30 && wx>leftp && wx<rightp){
                                                        histmoment = Math.round(hist.length*(wx-leftp)/(rightp-leftp))
                                                        rysuj()
                    }
                    if(wx>cwidth-100 && wx<cwidth){
                                                        pauza = !pauza
                                                        historia = false
                                                        rysuj()
                    }
                    elpanel();
                }
            }
        }

    }
    function doMouseUp(event){
        var rect = c.getBoundingClientRect();
        var cx = Math.floor(event.clientX-rect.left);
        var cy = Math.floor(event.clientY-rect.top);

        wx = -1;
        wy = -1;
    }


function ukryj(){
    if(document.getElementById("ukryj").checked){
        document.getElementById("canv2").style.display = "none"
    } else {
        document.getElementById("canv2").style.display = "block"
    }
}