var keys=[keyboard(38),keyboard(40),keyboard(37),keyboard(39)];

var camera={"x":13830,"y":25810};

var canvas, ctx;
var iCanvas,iCtx;
var grid={"x":0,"y":0,"tiles":[[]]};

var player;

function setup() {
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.imageSmoothingEnabled=false;
    iCanvas=document.createElement("canvas");
    iCtx=iCanvas.getContext("2d");
    loadIsland(1,2);
    player=new Player(14630,26410);
    window.requestAnimationFrame(gameLoop);
}

function isIsland(x,y) {
    return (Math.sin(7*x+4*y)+Math.cos(8*x*y-9)+Math.sin(3*x-2*y*y)>2.2);
}

function loadIsland(x,y) {
    if (isIsland(x,y)) {
        RNG.setSeed(482457*x+349283*y+39148);
        var center={"x":300+RNG.get()%400,"y":300+RNG.get()%400};
        var rect={};
        var sizeClass=RNG.get()%3;
        rect.width=RNG.get()%97+200;
        rect.height=rect.width+RNG.get()%37-19;
        for (;sizeClass<2; sizeClass++) {
            rect.width=Math.floor(rect.width/2);
            rect.height=Math.floor(rect.height/2);
        }
        grid.x=center.x-Math.floor(rect.width/2);
        grid.y=center.y-Math.floor(rect.height/2);
        grid.tiles=makeIsland(x,y,rect.width,rect.height);
    } else {
        grid.tiles=[[]];
    }
    renderIsland();
}

function renderIsland() {
    iCanvas.width=grid.tiles.length*10;
    iCanvas.height=grid.tiles[0].length*10;
    if (iCanvas.width==0) {return;}
    iCtx.fillStyle="#00f";
    iCtx.fillRect(0,0,iCanvas.width,iCanvas.height);
    iCtx.fillStyle="#0f0";
    for (var x=0; x<grid.tiles.length; x++) {
        for (var y=0; y<grid.tiles[x].length; y++) {
            if (grid.tiles[x][y]==1) {
                iCtx.fillRect(x*10,y*10,10,10);
            } else if (grid.tiles[x][y]==2) {
                renderSand(x,y);
            }
        }
    }
    addStructures(grid.tiles);
    for (var x=0; x<grid.tiles.length; x++) {
        for (var y=1; y<grid.tiles[0].length; y++) {
            if (grid.tiles[x][y]==3&&grid.tiles[x][y-1]!=3) {
                iCtx.drawImage(textures[1],x*10,y*10);
            } else if (grid.tiles[x][y]>=4&&grid.tiles[x][y]<9) {
                iCtx.drawImage(textures[2],grid.tiles[x][y]*10-40,10,10,10,x*10,y*10,10,10);
            } else if (grid.tiles[x][y]>=9&&grid.tiles[x][y]<12) {
                iCtx.drawImage(textures[2],grid.tiles[x][y]*10-90,0,10,10,x*10,y*10,10,10);
            }
        }
    }
}

var sandTileIndices=[
    [4,0,1,8],
    [5,1,2,9],
    [6,2,3,10],
    [7,3,0,11]
]

function renderSand(x,y) {
    renderSandTile(x+0.5,y,grid.tiles[x][y-1],grid.tiles[x+1][y],0);
    renderSandTile(x+0.5,y+0.5,grid.tiles[x+1][y],grid.tiles[x][y+1],1);
    renderSandTile(x,y+0.5,grid.tiles[x][y+1],grid.tiles[x-1][y],2);
    renderSandTile(x,y,grid.tiles[x-1][y],grid.tiles[x][y-1],3);
}

function renderSandTile(x,y,tile1,tile2,type) {
    var row=0;
    if (tile1!=0&&tile2!=0) {
        row=5;
    }
    var column=0;
    if (tile1==2) {column+=2};
    if (tile2==2) {column++};
    iCtx.drawImage(textures[0],sandTileIndices[type][column]*5,row,5,5,x*10,y*10,5,5);
}

function getLocalX(x) {
    return Math.floor((x%10000)/10-grid.x);
}

function getLocalY(y) {
    return Math.floor((y%10000)/10-grid.y);
}

function getGlobalX(x) {
    return (camera.x-camera.x%10000)+(grid.x+x)*10;
}

function getGlobalY(y) {
    return (camera.y-camera.y%10000)+(grid.y+y)*10;
}

function getTile(x,y) {
    if (x<0||y<0||x>=grid.tiles.length||y>=grid.tiles[0].length) {
        return 0;
    } else {
        return grid.tiles[x][y];
    }
}

function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update() {
    player.update();
    camera.x=player.rect.getLeft()-395;
    camera.y=player.rect.getTop()-295;
}

var scale=3;

function render() {
    ctx.fillStyle="#00f";
    ctx.fillRect(0,0,800,600);
    ctx.drawImage(iCanvas,(-(camera.x%10000)+grid.x*10-400)*scale+400,(-(camera.y%10000)+grid.y*10-300)*scale+300,iCanvas.width*scale,iCanvas.height*scale);
    player.render(ctx,scale);
}