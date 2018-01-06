var textures=[];
var loadStatus=[];

var srcs=["images/tiles/sand.png","images/tiles/dock.png","images/tiles/house.png"];

var numImages=3;
var loaded=0;

var hasSetup=false;

function load() {
    for (var i=0; i<numImages; i++) {
        textures.push(null);
        loadStatus.push(0);
    }
    requestLoad(0);
    requestLoad(1);
    requestLoad(2);
}

function requestLoad(id) {
    if (loadStatus[id]==0) {
        textures[id]=loadImage(srcs[id],id);
    } else if (loadStatus[id]==3) {
        loadStatus[id]=2;
    }
}

function deallocate(id) {
    textures[id]=null;
    loadStatus[id]=0;
}

function loadImage(src,id) {
    loaded++;
    loadStatus[id]=1;
    var obj=new Image();
    obj.src=src;
    obj.onload=function() {incrementLoad(id);};
    return obj;
}

function incrementLoad(id) {
    loaded--;
    if (id!=null) {
        loadStatus[id]=2;
    }
    if (loaded<=0&&!hasSetup) {
        hasSetup=true;
        setup();
    }
}

function loadJSON(filename,callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filename, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }