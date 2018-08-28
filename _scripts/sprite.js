function Sprite(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.desenha = function(xCanvas,yCanvas){
        ctx.drawImage(img,this.x,this.y,this.width,this.height,xCanvas,yCanvas,this.width,this.height);
    }
}

var bg = new Sprite(0,0,600,600),
    spritepersonagem = new Sprite(601,0,90,88),
    perdeu = new Sprite(0,601,400,350),
    novo = new Sprite(430,650,310,80),
    spriterecord = new Sprite(440,785,400,90),
    spritefloor = new Sprite(400,950,600,50),
    jogar = new Sprite(601,250,400,350);