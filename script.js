const objetoCanvas = document.querySelector("canvas");
const contexto = objetoCanvas.getContext("2d");

const larguraLinha = 15;
const margem = 10;

const mouse = {
    x: 0,
    y: 0
}

function fimDeJogo(win) {
    alert(`Fim de jogo! O vencedor é ${win}`);
    placar.jogador = 0;
    placar.cpu = 0;
    raqueteDireita.velocidade = 2.5;
    bola.x = 50;
    bola.y = 0;
    bola.raio = 20;
    bola.velocidade = 6;
    bola.direcaoX = 1;
    bola.direcaoY = 1;
}

const campo = {
    largura: window.innerWidth,
    altura: window.innerHeight,
    draw: function () {
        contexto.fillStyle = "#286047";
        contexto.fillRect(0, 0, this.largura, this.altura);
    }
}

const logo = {
    img: document.getElementById("logo"),
    x: campo.largura / 2 - 150,
    y: campo.altura / 2 - 175,
    largura: 300,
    altura: 350,
    draw: function () {
        contexto.drawImage(this.img, this.x, this.y, this.largura, this.altura);
    }
}

const linhaCentral = {
    x: campo.largura / 2 - larguraLinha / 2,
    y: 0,
    largura: larguraLinha,
    altura: campo.altura,
    draw: function () {
        contexto.fillStyle = "#ffffff";
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

const copyrights = {
    draw: function () {
        contexto.fillStyle = "#000000";
        contexto.font = "bold 14px roboto";
        contexto.textAlign = "center";
        contexto.textBaseline = "bottom";
        contexto.fillText("© Marçal Santarém - 2022", campo.largura / 2, campo.altura);
    }
}

const raqueteEsquerda = {
    x: margem,
    y: 0,
    largura: larguraLinha,
    altura: 200,
    _move: function () {
        this.y = mouse.y - this.altura / 2;
    },
    draw: function () {
        contexto.fillStyle = "#ffffff";
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
        this._move();
    }
}

const raqueteDireita = {
    x: campo.largura - larguraLinha - margem,
    y: 0,
    largura: larguraLinha,
    altura: 200,
    velocidade: 2.5,
    _move: function () {
        if (this.y + this.altura / 2 < bola.y + bola.raio) {
            this.y += this.velocidade;
        } else {
            this.y -= this.velocidade;
        }
    },
    incrementaVelocidade: function (x) {
        this.x = campo.largura - larguraLinha - margem,
            this.y = campo.altura / 2 - this.altura / 2;
        if (x == "jogador") {
            this.velocidade *= 1.25;
        }
    },
    draw: function () {
        contexto.fillStyle = "#ffffff";
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
        this._move();
    }
}

const placar = {
    jogador: 0,
    cpu: 0,
    pontoJogador: function () {
        this.jogador++;
    },
    pontoCpu: function () {
        this.cpu++;
    },
    draw: function () {
        contexto.fillStyle = "#01341D";
        contexto.font = "bold 72px Arial";
        contexto.textAlign = "center";
        contexto.textBaseline = "top";
        contexto.fillText("JOGADOR", campo.largura / 4, 40);
        contexto.fillText(this.jogador, campo.largura / 4, 120);
        contexto.fillText("CPU", campo.largura / 4 + campo.largura / 2, 40);
        contexto.fillText(this.cpu, campo.largura / 4 + campo.largura / 2, 120);
    }
}

const bola = {
    x: 50,
    y: 0,
    raio: 20,
    velocidade: 6,
    direcaoX: 1,
    direcaoY: 1,
    _calcPosition: function () {
        if (this.x > campo.largura - this.raio - raqueteDireita.largura - margem) {
            if (this.y + this.raio > raqueteDireita.y &&
                this.y - this.raio < raqueteDireita.y + raqueteDireita.altura) {
                this._inverteX();
            } else {
                placar.pontoJogador();
                if (placar.jogador == 10) {
                    fimDeJogo("o Jogador");
                } else {
                    this._reiniciaBola("jogador");
                }
            }
        }
        if (this.x < this.raio + raqueteEsquerda.largura + margem) {
            if (this.y + this.raio > raqueteEsquerda.y &&
                this.y - this.raio < raqueteEsquerda.y + raqueteEsquerda.altura) {
                this._inverteX();
            } else {
                placar.pontoCpu();
                if (placar.cpu == 10) {
                    fimDeJogo("a CPU");
                } else {
                    this._reiniciaBola("cpu");
                }
            }
        }

        if ((this.y - this.raio < 0 && this.direcaoY < 0) ||
            (this.y > campo.altura - this.raio && this.direcaoY > 0)) {
            this._inverteY();
        }
    },
    _inverteX: function () {
        this.direcaoX = this.direcaoX * -1;
    },
    _inverteY: function () {
        this.direcaoY = this.direcaoY * -1;
    },
    _move: function () {
        this.x += this.direcaoX * this.velocidade;
        this.y += this.direcaoY * this.velocidade;
    },
    _incrementaVelocidade: function () {
        this.velocidade *= 1.1;
    },
    _reiniciaBola: function (x) {
        raqueteDireita.incrementaVelocidade(x);
        this._incrementaVelocidade();
        this._inverteX();
        this.x = campo.largura / 2;
        this.y = campo.altura / 2;
    },
    draw: function () {
        contexto.fillStyle = "#ffffff";
        contexto.beginPath();
        contexto.arc(this.x, this.y, this.raio, 0, 2 * Math.PI, false);
        contexto.fill();
        this._calcPosition();
        this._move();
    }
}

function setup() {
    objetoCanvas.width = window.innerWidth;
    contexto.width = window.innerWidth;
    objetoCanvas.height = window.innerHeight;
    contexto.height = window.innerHeight;
}

function draw() {
    campo.draw();
    // logo.draw(); OBS Manter comentado por enquanto
    linhaCentral.draw();
    copyrights.draw();
    raqueteEsquerda.draw();
    raqueteDireita.draw();
    placar.draw();
    bola.draw();
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        }
    )
})();

function main() {
    animateFrame(main);
    draw();
}

setup();
main();


    objetoCanvas.addEventListener("ontouchstart",  function (e) {
        alert("ON TOUCH START DETECTADO! e.pageX: " + e.pageX + " e.pageY: " + e.pageY);
    })

    objetoCanvas.addEventListener("ontouchend",  function (e) {
        alert("ON TOUCH END DETECTADO! e.pageX: " + e.pageX + " e.pageY: " + e.pageY);
    })

    
    objetoCanvas.addEventListener("ontouchcancel",  function (e) {
        alert("ON TOUCH CANCEL DETECTADO! e.pageX: " + e.pageX + " e.pageY: " + e.pageY);
    })

    objetoCanvas.addEventListener("ontouchmove",  function (e) {
        alert("ON TOUCH MOVE DETECTADO! e.pageX: " + e.pageX + " e.pageY: " + e.pageY);
    })
    objetoCanvas.addEventListener("mousemove", function (e) {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    })