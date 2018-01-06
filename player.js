class Rectangle {
    constructor(x,y,width,height) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
    
    translate(dx,dy) {
        this.x+=dx;
        this.y+=dy;
    }
    
    moveTo(x,y) {
        this.x=x;
        this.y=y;
    }
    
    getLeft() {
        return this.x;
    }
    
    getRight() {
        return this.x+this.width;
    }
    
    getTop() {
        return this.y;
    }
    
    getBottom() {
        return this.y+this.height;
    }
    
    intersects(rect) {
        return (this.getRight()>rect.x&&rect.getRight()>this.x&&this.getBottom()>rect.y&&rect.getBottom()>this.y);
    }
}

class Entity {
    constructor(x,y,width,height) {
        this.rect=new Rectangle(x,y,width,height);
    }
    
    update() {
        
    }
    
    ejectFromTiles() {
        var tile=new Rectangle(0,0,10,10);
        for (var x=getLocalX(this.rect.getLeft()); x<=getLocalX(this.rect.getRight()); x++) {
            for (var y=getLocalY(this.rect.getTop()); y<=getLocalY(this.rect.getBottom()); y++) {
                if (getTile(x,y)==0) {
                    tile.moveTo(getGlobalX(x),getGlobalY(y));
                    this.ejectFromRect(tile);
                }
            }
        }
    }
    
    ejectFromRect(rect) {
        if (!this.rect.intersects(rect)) {return;}
        var overlaps=[];
        overlaps.push(this.rect.getBottom()-rect.getTop());
        overlaps.push(rect.getBottom()-this.rect.getTop());
        overlaps.push(this.rect.getRight()-rect.getLeft());
        overlaps.push(rect.getRight()-this.rect.getLeft());
        var smallest=0;
        for (var i=1; i<4; i++) {
            if (overlaps[i]<overlaps[smallest]) {
                smallest=i;
            }
        }
        if (smallest==0) {
            this.rect.translate(0,-overlaps[0]);
        } else if (smallest==1) {
            this.rect.translate(0,overlaps[1]);
        } else if (smallest==2) {
            this.rect.translate(-overlaps[2],0);
        } else {
            this.rect.translate(overlaps[3],0);
        }
    }
    
    render(ctx,scale) {
        ctx.fillStyle="#000";
        ctx.fillRect((this.rect.x-camera.x-400)*scale+400,(this.rect.y-camera.y-300)*scale+300,this.rect.width*scale,this.rect.height*scale);
    }
}

class Player extends Entity {
    constructor(x,y) {
        super(x,y,10,10);
        this.dx=0;
        this.dy=0;
        this.speed=2;
    }
    
    update() {
        if (keys[0].isDown) {
            this.dy=-this.speed;
        } else if (keys[1].isDown) {
            this.dy=this.speed;
        } else {
            this.dy=0;
        }
        if (keys[2].isDown) {
            this.dx=-this.speed;
        } else if (keys[3].isDown) {
            this.dx=this.speed;
        } else {
            this.dx=0;
        }
        this.rect.translate(this.dx,0);
        this.ejectFromTiles();
        this.rect.translate(0,this.dy);
        this.ejectFromTiles();
    }
}