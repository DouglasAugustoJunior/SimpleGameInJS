//Variáveis gerais do game
            var canvas,ctx,HEIGHT, WIDTH, frames = 0,maxPulos = 3,velocidade=6,estadoAtual,record,img,ptsNovafase=[5,10,15,20,25,35,45],
                faseAtual=0,
                labelNovaFase = { // label que aparece ao mudar de fase
                    text:"",
                    opacity:0.0,
                    fadeIn:function(dt){
                        var fadeInId = setInterval(function(){// setinterval cria uma espécie de tread para repetir
                            if (labelNovaFase.opacity<1.0){
                                labelNovaFase.opacity+=0.01; // 1% a mais de opacidade
                            }else{
                                clearInterval(fadeInId);
                            }
                        },10*dt);// 10 miliseg para completar 100%
                    },
                    fadeOut:function(dt){
                        var fadeOutId = setInterval(function(){// setinterval cria uma espécie de tread para repetir
                            if (labelNovaFase.opacity>0.0){
                                labelNovaFase.opacity-=0.01; // 1% a menos de opacidade
                            }else{
                                clearInterval(fadeOutId);
                            }
                        },10*dt);// 10 miliseg para completar 100%
                    }},
                estados = {
                    jogar:0,
                    jogando:1,
                    perdeu:2
                },
                floor = {
                x:50,
                y:550,
                height:50,
                //color:"#4d2600",
                desenha:function(){
                    //ctx.fillStyle = this.color;// pega cor do objeto e adiciona ao seu contexto
                    //ctx.fillRect(0,this.y,WIDTH,this.height);// desenha objeto
                    spritefloor.desenha(this.x,this.y);// cria objeto com a imagem
                    spritefloor.desenha(this.x+spritefloor.width,this.y);// da movimento do chão
                },
                atualiza:function(){
                   this.x-=velocidade;// movimento do chão
                    if (this.x<=-180){// testa se o chão passou da margem
                        this.x=0;// volta o chão
                    } 
                }
            },
                block = {
                x:50,
                y:0,
                height:spritepersonagem.height,
                width:spritepersonagem.width,
                //color:"#cc0000",
                gravidade:1.6,
                velocidade:0,
                forcaDoPulo:23.6,// pulo de altura 23.6
                qtdePulos:0, // quantidade de pulos disponiveis
                score:0,
                rotacao:0,
                vidas:3,
                colidindo: false,
                atualiza: function(){ // faz bloco cair
                    this.velocidade+= this.gravidade; // atribui gravidade a velocidade
                    this.y+= this.velocidade;// movimento de descida do bloco
                    this.rotacao+= Math.PI/180 * velocidade; // soma 1 grau e gira
                    if (this.y > floor.y - this.height && estadoAtual != estados.perdeu){ // testa se o bloco chegou ao chão
                        this.y = floor.y - this.height; // mantém o bloco no chão
                        this.qtdePulos = 0; // zera qtdePulos para poder pular novamente
                        this.velocidade = 0; // zera velocidade quando chega ao chão
                    }
                },
                desenha: function(){
                    //ctx.fillStyle = this.color;// pega cor do objeto e adiciona ao seu contexto
                    //ctx.fillRect(this.x,this.y,this.height,this.width);// desenha objeto com posição passada
                    
                    //rotação
                    ctx.save();
                    ctx.translate(this.x+this.width/2,this.y+this.height/2);
                    ctx.rotate(this.rotacao);
                    spritepersonagem.desenha(-this.width/2,-this.height/2);
                    ctx.restore();
                    //spritepersonagem.desenha(this.x,this.y);
                },
                pula: function(){
                    if (this.qtdePulos < maxPulos){
                    this.velocidade = -this.forcaDoPulo; // tira gravidade para o bloco subir
                    this.qtdePulos++; //registra mais um pulo
                    }
                },
                reset: function(){
                    this.y = 0;
                    this.velocidade = 0;
                    if (this.score>record){// verifica se o score é maior que o record
                        localStorage.setItem("record",this.score);// seta valor do score no localstorage record
                        record = this.score;
                    }
                    this.score = 0;
                    this.vidas =3;
                    velocidade=6;
                    faseAtual=0;
                    block.gravidade = 1.6;
                }
            },
                obstaculos = {
                _obs:[],
                _scored:false,
                colors:["#000099","#660066","#800000","#666633","#006600","#ffff00","#99ff99"],
                tempoInsere:0,
                inserir: function(){// inserir obstaculos
                    this._obs.push({ // push adiciona
                        x: WIDTH, // x no final da canvas
                        //width: 30+Math.floor(21*Math.random()), // gera uma largura aleatória para o obstáculo com minimo 30 e até 50
                        width:50,
                        height:30+Math.floor(120*Math.random()),// gera altura aleatória com minimo 30 e máximo 150
                        color: this.colors[Math.floor(7*Math.random())]// gera aleatória de inteiros com n° de cores
                        });
                    this.tempoInsere=30+ Math.floor(21*Math.random()); // espaço aleatório
                },
                atualiza: function(){
                    if (this.tempoInsere==0){ // testa se o tempo de espaço terminou
                        this.inserir();
                    }else{
                        this.tempoInsere--; // se não terminou ele decrementa
                    }
                    for (var i=0,tam = this._obs.length;i<tam;i++){
                        var obs = this._obs[i];
                        obs.x-=velocidade;// velocidade com que o obstaculo se movimenta em direção ao bloco
                        
                        
                        if (!block.colidindo &&
                            block.x < obs.x+obs.width &&
                            block.x + block.width>= obs.x &&
                            block.y + block.height>= floor.y-obs.height){ // se colidir perdeu
                            
                            block.colidindo=true; // seta colidindo com objeto

                            setTimeout(
                                function(){
                                    block.colidindo = false;
                                },500); // muda colidindo para false após 500 ms

                            if (block.vidas>=1){ // verifica se ainda há vidas
                                block.vidas--;
                            }else{
                                estadoAtual = estados.perdeu;
                            }
                        }else if (obs.x <= 0 && !obs._scored){// verifica se o objeto já pontuou com o scored
                            block.score++;
                            obs._scored=true;// muda scored para true para parar de pontuar 
                            if (faseAtual<ptsNovafase.length && block.score == ptsNovafase[faseAtual]){// verifica se a pontuação chegou a uma nova fase
                                passaDeFase();
                            }
                        }else if(obs.x <= -obs.width){// verifica se a posição x do elemento é menor que a largura (se já saiu da tela)
                            this._obs.splice(i,1); // deleta um objeto na posição i
                            tam --; // volta o for porque esse elemento foi excluido
                            i--; // volta o for porque esse elemento foi excluido
                        }
                    }    
                },
                limpa: function(){
                    this._obs = [];
                },
                desenha: function(){
                    for (var i =0, tam = this._obs.length;i<tam;i++){// cria duas variáveis i e tam, e roda até cehgar ao fim do vetor _obs
                        var obs = this._obs[i]; // recebe objeto a ser criado
                        ctx.fillStyle = obs.color; //seleciona cor aleatória para o objeto
                        ctx.fillRect(obs.x,floor.y - obs.height,obs.width,obs.height);// cria objeto colocando ele no chão
                    }
                }
            };
            
            function main(){
                HEIGHT = window.innerHeight; // pega a altura da tela
                WIDTH = window.innerWidth; // pega largura da tela
                
                // testa se a tela é mais larga que 500px, se for padroniza tela do jogo.
                if (WIDTH>=500){
                    WIDTH = 600;
                    HEIGHT = 600;
                }
                
                // cria elemento CANVAS
                canvas = document.createElement("canvas");
                canvas.width = WIDTH;
                canvas.height = HEIGHT;
                canvas.style.border = "1px solid #000"; // cria borda black do canvas
                ctx = canvas.getContext("2d"); // contexto em 2d
                document.body.appendChild(canvas); // adiciona canvas ao html/body
                
                
                document.addEventListener("mousedown", click); // verifica se o usuário clicou e chama método click()
                
                record = localStorage.getItem("record");// atribui a variavel valor do localstorage record
                if (record == null){
                    record = 0;
                }
                
                img = new Image();
                img.src = "images/picture.png"; // pega imagem que contém toda a aparência do game
                
                estadoAtual = estados.jogar; // passa estado ao estado atual antes de iniciar
                rodar();
            }
            
            function click(event){
                if (estadoAtual == estados.jogando){// se estiver jogando pula
                    block.pula();
                }else if(estadoAtual == estados.jogar){// se estiver para jogar muda para jogando
                    estadoAtual = estados.jogando;
                }else if(estadoAtual == estados.perdeu && block.y >= 2* HEIGHT){// se perder volta para jogar
                    estadoAtual = estados.jogar;
                    obstaculos.limpa();// limpa vetor de obstáculos
                    block.reset();
                } 
            }
            
            function rodar(){
                atualizar();
                desenhar();
                window.requestAnimationFrame(rodar);// repete função infinitamente
            }
            
            function atualizar(){
                //frames++; //soma um frame
                floor.atualiza();
                block.atualiza();
                if (estadoAtual== estados.jogando){
                    obstaculos.atualiza();
                }
            }
            
            function desenhar(){
                //ctx.fillRect(0,0,HEIGHT,WIDTH); // começa do canto 0 0 e vai até o fim da tela
                bg.desenha(0,0);
                ctx.fillStyle = "#fff"; // cor da fonte
                ctx.font = "50px Arial"; // tamanho e tipo
                ctx.fillText("Score:"+block.score,30,60); // texto alinhado no canto superior esquerdo
                ctx.fillText("Vidas:"+block.vidas,420,60);
                ctx.fillStyle="rgba(0, 0, 0, "+labelNovaFase.opacity+")"; // define a opacidade
                ctx.fillText(labelNovaFase.text,canvas.width / 2 - ctx.measureText(labelNovaFase.text).width/2,canvas.height/3);
               /* if (estadoAtual== estados.jogar){
                    ctx.fillStyle = "green";
                    ctx.fillRect(WIDTH/2-50,HEIGHT/2-50,100,100); // cria menu de 100x100 no meio do canvas
                }else if (estadoAtual==estados.perdeu){
                    ctx.fillStyle = "red";
                    ctx.fillRect(WIDTH/2-50,HEIGHT/2-50,100,100); // cria menu de 100x100 no meio do canvas vermelho
                    ctx.save(); // salva contexto
                    ctx.translate(WIDTH/2,HEIGHT/2);
                    ctx.fillStyle= "#fff";
                    
                    if (block.score > record){
                        ctx.fillText("Novo record!",-150,-65);// seta texto acima do record
                    }else if (record<10){
                        ctx.fillText("Record:"+record,-99,-65); // alinha texto com score de 1 digito
                    }else if (record>=10 && record<100){
                        ctx.fillText("Record:"+record,-112,-65);// alinha texto com score de 2 digitos
                    }else{
                        ctx.fillText("Record:"+record,-125,-65);// alinha texto com score de 3 digitos
                    }
                    
                    if (block.score <10){ // alinha numero até 1 digito
                        ctx.fillText(block.score,-13,19); // alinha score no meio do bloco vermelho
                    }else if (block.score>= 10 && block.score <100){// 2 digitos
                        ctx.fillText(block.score,-26,19);
                    }else if (block.score>=100){// 3 digitos
                        ctx.fillText(block.score,-39,19);
                    }
                    
                    ctx.restore();// restaura contexto
                }else*/ 
                if (estadoAtual == estados.jogando){
                    obstaculos.desenha(); // antes do bloco para ficar atrás || só desenha obstáculos se estiver jogando
                }
                floor.desenha();// cria chão
                block.desenha();// cria bloco
                if (estadoAtual==estados.jogar){
                    jogar.desenha(WIDTH/2- jogar.width/2,HEIGHT/2- jogar.height/2); // desenha tela com botão play
                }
                if (estadoAtual== estados.perdeu){
                    perdeu.desenha(WIDTH/2- perdeu.width/2,HEIGHT/2- perdeu.height/2- spriterecord.height/2);// desenha tela GAME OVER
                    spriterecord.desenha(WIDTH/2- spriterecord.width/2,HEIGHT/2+perdeu.height/2-spriterecord.height/2-10);// desenha tela RECORD
                    ctx.fillStyle = "#fff"; // cor da fonte
                    ctx.fillText(block.score,325,400);
                    if (block.score> record){// se bateu o record
                        novo.desenha(WIDTH/2 -180,HEIGHT/2 +30);// desenha botão novo acima do record
                        ctx.fillStyle = "#fff"; // cor da fonte
                        ctx.fillText(block.score,345,480); // mostra o score
                    }else{
                        ctx.fillStyle = "#fff"; // cor da fonte
                        ctx.fillText(record,345,480);// mostra o record
                    }
                } 
            }
            
            function passaDeFase(){
                velocidade++;
                faseAtual++;
                block.vidas++;
                labelNovaFase.text="Level "+faseAtual;
                labelNovaFase.fadeIn(0.4);
                setTimeout(function(){
                    labelNovaFase.fadeOut(0.4);
                },600);// settimeout espera o intervalo definido(800) para executar,assim não conflita
            }
            
            //inicia o game
            main();