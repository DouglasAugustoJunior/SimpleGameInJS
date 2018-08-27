
#[Douglas Augusto](http://github.com/DouglasAugustoJunior)- Outros projetos. # 
 
 
![VERSÃO DO SW](https://img.shields.io/badge/Version-1.0-blue.svg)
 
![LINGUAGEM FINALIDADE](https://img.shields.io/badge/JavaScript-game-orange.svg)
 
O **Game em JS** é um projeto simples que utilizei para inciar meus conhecimentos em JS.

![Imagem](https://github.com/DouglasAugustoJunior/SimpleGameInJS/blob/master/images/Game.PNG?raw=true)


 
Desenvolvido em HTML5,CSS3 e JS, ele traz diversas situações interessantes para utilizar diversos recursos.
 
## Interação com o usuário
 
O evento do clique, aciona as funções de pulo e play do jogo:    ``    enter code here

function click(event){}

 

 
##                                                                                                                                                                                                                                                                         Record
 
Ao ultrapassar o record, o bloco para gravar é chamado dessa forma:

    if (this.score>record){// verifica se o score é maior que o record
        localStorage.setItem("record",this.score);// seta valor do score no localstorage record
        record = this.score;
    }

 
## Plugin para contador de Pts
 
 

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

 
 
Para mais informações acesse [meus repositórios](http://github.com/DouglasAugustoJunior).