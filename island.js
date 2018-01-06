var RNG={};
RNG.seed=0;
RNG.setSeed=function(seed) {
    RNG.seed=seed;
}
RNG.get=function() {
    return Math.floor(RNG.getFloat()*1000000);
}
RNG.getFloat=function() {
    var x=Math.sin(RNG.seed++)*10000;
    return x-Math.floor(x);
}
RNG.getChance=function(prob) {
    return RNG.getFloat()<prob;
}

getSeed=function(x,y) {
    var seed=(593847*x+349281*y+492582+492583*x*y)%1000000;
    if (seed<0) {
        seed+=1000000;
    }
    return seed;
}

border=function(grid,x,y,tile) {
    for (var X=-1; X<=1; X++) {
        for (var Y=-1; Y<=1; Y++) {
            if (get(grid,x+X,y+Y)==tile) {
                return true;
            }
        }
    }
    return false;
}

tile=function(grid) {
    for (var x=0; x<grid.length; x++) {
        for (var y=0; y<grid[x].length; y++) {
            if (grid[x][y]>0.04) {
                grid[x][y]=1;
                if (Math.pow(x-grid.length/2,2)+Math.pow(y-grid[0].length/2,2)>grid.length*grid.length/4) {
                    grid[x][y]=0;
                }
            } else {
                grid[x][y]=0;
            }
        }
    }
    for (var x=0; x<grid.length; x++) {
        for (var y=0; y<grid[x].length; y++) {
            if (grid[x][y]==1&&border(grid,x,y,0)) {
                grid[x][y]=2;
            }
        }
    }
    for (var x=0; x<grid.length; x++) {
        for (var y=0; y<grid[x].length; y++) {
            if (grid[x][y]==2&&!border(grid,x,y,1)) {
                grid[x][y]=0;
            }
        }
    }
    return grid;
}

var houseTemplates=[
    [
        [9,10,11],
        [4,5,6]
    ],
    [
        [9,10,10,11],
        [4,8,5,6]
    ]
]

addStructures=function(grid) {
    if (RNG.getChance(0)) {return;}
    var dockPoint={"x":Math.floor(grid.length/2),"y":Math.floor(grid[0].length/2)};
    dockPoint.y+=RNG.get()%7;
    dockPoint.y-=3;
    var dx=(RNG.getChance(0.5))?-1:1;
    while (grid[dockPoint.x][dockPoint.y]==1||grid[dockPoint.x][dockPoint.y+1]==1) {
        dockPoint.x+=dx;
    }
    for (var i=0; i<7; i++) {
        if (grid[dockPoint.x][dockPoint.y]==1||grid[dockPoint.x][dockPoint.y+1]==1) {
            return;
        }
        dockPoint.x+=dx;
    }
    for (var i=0; i<7; i++) {
        dockPoint.x-=dx;
        grid[dockPoint.x][dockPoint.y]=3;
        grid[dockPoint.x][dockPoint.y+1]=3;
    }
    var rect={"x":0,"y":0,"width":8,"height":6}
    var suitable=false;
    for (var i=0; i<120; i++) {
        rect.x=RNG.get()%grid.length;
        rect.y=RNG.get()%grid[0].length;
        suitable=true;
        for (var x=rect.x; x<rect.x+rect.width; x++) {
            for (var y=rect.y; y<rect.y+rect.height; y++) {
                if (grid[x][y]!=1) {
                    suitable=false;
                    break;
                }
            }
            if (!suitable) {break;}
        }
        if (suitable) {
            var template=RNG.get()%houseTemplates.length;
            var X=Math.floor(rect.x+rect.width/2-houseTemplates[template][0].length/2);
            var Y=Math.floor(rect.y+rect.height/2-houseTemplates[template].length/2);
            for (var y=0; y<houseTemplates[template].length; y++) {
                for (var x=0; x<houseTemplates[template][y].length; x++) {
                    grid[x+X][y+Y]=houseTemplates[template][y][x];
                }
            }
        }
    }
}

get=function(grid,x,y) {
    if (x>=0&&y>=0&&x<grid.length&&y<grid[x].length) {
        return grid[x][y];
    } else {
        return null;
    }
}

randomAvg=function(nums) {
    var sum=0;
    var weights=0;
    for (var i=0; i<nums.length; i++) {
        if (nums[i]!=null) {
            var w=RNG.getFloat();
            sum+=nums[i]*w;
            weights+=w;
        }
    }
    return sum/weights;
}

makeIsland=function(x,y,width,height) {
    RNG.setSeed(getSeed(x,y));
    tileGrid=[];
    for (var X=0; X<width; X++) {
        tileGrid.push([]);
        for (var Y=0; Y<height; Y++) {
            tileGrid[X].push(RNG.getFloat()-0.5);
        }
    }
    for (var i=0; i<width*height/480; i++) {
        if (i==0||RNG.getChance(0.14)) {
            var point={"x":width/2+width/3*(RNG.getFloat()-0.5),"y":height/2+height/3*(RNG.getFloat()-0.5)};
            var radius=Math.pow(RNG.getFloat()*width/12+width/16,2);
            var loss=2*(radius*3.14*0.5)/(2*width+2*height);
            for (x=0; x<width; x++) {
                for (y=0; y<height; y++) {
                    if (Math.pow(x-point.x,2)+Math.pow(y-point.y,2)<radius) {
                        tileGrid[x][y]+=0.5;
                    } else if (x==0||x==width-1||y==0||y==height-1) {
                        tileGrid[x][y]-=loss;
                    }
                }
            }
        }
    }
    for (var i=0; i<4; i++) {
        for (x=0; x<width; x++) {
            for (y=0; y<height; y++) {
                tileGrid[x][y]=randomAvg([get(tileGrid,x-1,y-1),get(tileGrid,x+1,y-1),get(tileGrid,x+1,y+1),get(tileGrid,x-1,y+1)]);
            }
        }
        for (x=0; x<width; x++) {
            for (y=0; y<height; y++) {
                tileGrid[x][y]=randomAvg([get(tileGrid,x-1,y),get(tileGrid,x+1,y),tileGrid[x][y-1],tileGrid[x][y+1]]);
            }
        }
    }
    return tile(tileGrid);
}