
// AJAX - CARREGAR PAGINAS
const request = obj => {
    const xhr = new XMLHttpRequest();
    xhr.open(obj.method, obj.url, true);

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300){
            obj.success(xhr.responseText);
        } else {
            obj.error(xhr.statusText);
        }  
    });
    xhr.send();
}

document.addEventListener('click', e => {
    const el = e.target;
    const tag = el.tagName.toLowerCase();
    if (tag === 'a'){
        e.preventDefault();
        carregaPagina(el);
    };
});

function carregaPagina(el){
    const href = el.getAttribute('href');
    const obj = {
        method: 'GET',
        url: href,
        success(response){
            carregaResultado(response);
        },
        error(err){
            console.log(err);
        }

        }
    request(obj);
};

function carregaResultado(response){
    const pagina = document.querySelector('.pagina');
    pagina.innerHTML = response;


    if (pagina.querySelector('.form')) {
        envioDeImc();
    }
    if (pagina.querySelector('#jurosSimples')) {
        jurosSimples();
    }
    if (pagina.querySelector('.formCompostos')) {
        jurosCompostos();
    }
    if (pagina.querySelector('.timer')) {
        cronometro();
    }
    if (pagina.querySelector('#resultado')) {
        const calculadora = new Calculadora();
        calculadora.inicia();
    };
};


// CÁLCULO IMC
function envioDeImc(){
const form = document.querySelector('.form');
const resultado = document.querySelector('.resultado');

    form.addEventListener('submit', function(evento){
        evento.preventDefault();

        const peso = Number(evento.target.querySelector('.peso').value);
        const altura = Number(evento.target.querySelector('.altura').value);
        const imc = peso / (altura * altura);

        let mensagem = "";

        if(!peso || !altura){
            resultado.innerHTML = "Digite um valor válido";
            return;
        }

        if (imc < 18.5){
            mensagem += `Seu imc é ${imc.toFixed(2)} por isso está abaixo do peso`;
        } else if (imc >= 18.5 && imc <= 24.9) {
            mensagem += `Seu imc é ${imc.toFixed(2)} por isso é normal`;
        } else if (imc >= 25 && imc <= 29.9) {
            mensagem += `Seu imc é ${imc.toFixed(2)} por isso está com sobrepeso`;   
        } else if (imc >= 30 && imc <= 34.5) {
            mensagem += `Seu imc é ${imc.toFixed(2)} por isso está com obesidade grau 1`; 
        } else if (imc >= 35 && imc <= 39.9) {
            mensagem += `Seu imc é ${imc.toFixed(2)} por isso está com obesidade grau 2`; 
        } else if (imc >= 40){
            mensagem += `Seu imc é ${imc.toFixed(2)} por isso está com obesidade grau 3`;
        } else{
            mensagem += "digite um valor válido";
        };

        resultado.innerHTML = mensagem;
        resultado.classList.add('dados');
    });
};

//juros simples

function jurosSimples(){
    const form = document.querySelector('#jurosSimples');
    const resultado = document.querySelector('#resultadoDoJurosSimples');
    form.addEventListener('submit', function(evento){
        evento.preventDefault();
        const capital = Number(evento.target.querySelector('#capital1').value);
        const taxa = Number(evento.target.querySelector('#taxa1').value);
        const tempo = Number(evento.target.querySelector('#tempo1').value);

        if(!capital || !taxa || !tempo){
            resultado.innerHTML = "Digite um valor válido";
            return;
        };

        const juros = (capital * taxa * tempo) / 100;
        const montante = capital + juros;
        
        resultado.innerHTML = `Seu juros é ${juros.toFixed(2)}, e o seu montante  é ${montante.toFixed(2)}.`
        resultado.classList.add('dados');
    });
};

// CÁLCULO JUROS COMPOSTOS

function jurosCompostos(){
    const form = document.querySelector(".formCompostos");
    const resultado = document.querySelector('#resultadoCompostos');

    form.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const capital = Number(evento.target.querySelector('#capitalCompostos').value);
        const taxa = Number(evento.target.querySelector('#taxaCompostos').value);
        const tempo = Number(evento.target.querySelector('#tempoCompostos').value);

        if (!capital || !taxa || !tempo) {
            resultado.innerHTML = "Digite um valor válido";
            return;
        }

        const montante = capital * (1 + taxa/100) ** tempo;
        const juros = montante - capital;

        resultado.innerHTML = `Seu juros é ${juros.toFixed(2)} e seu montante é ${montante.toFixed(2)}`;
        resultado.classList.add('dados');
    });
};

// Cronômetro
function cronometro(){

    function horario(data){
        hora = new Date(data * 1000);
        return hora.toLocaleTimeString("pt-BR", {
            hour12: false,
            timeZone: "UTC"
        });
    }
    const timer = document.querySelector('.timer')
    const iniciar = document.querySelector("#iniciar");
    const pausar = document.querySelector("#pausar");
    const zerar = document.querySelector("#zerar");

    let segundos = 0;
    let tempo;
    function coracaoDoCrono(){
        tempo = setInterval(function(){ 
            segundos++; 
            timer.innerHTML = horario(segundos); 
        }, 1000)
    };

    iniciar.addEventListener('click',() => {
        clearInterval(tempo);
        coracaoDoCrono();
    });
     
    pausar.addEventListener('click', () =>{
        clearInterval(tempo);
    });

    zerar.addEventListener('click', () => {
        clearInterval(tempo)
        timer.innerHTML = '00:00:00';
        segundos = 0;
    });
};

// Calculadora

function Calculadora() {
    this.resultado = document.querySelector('#resultado');

    this.inicia = () => {
        this.capturaCliques();
        this.capturaEnter();
    };
    
    this.capturaEnter = () => {
        document.addEventListener('keyup', e => {
            if (e.keyCode === 13){
                this.realizaConta();
            };
        });
    };

    this.capturaCliques = () => {
        document.addEventListener('click', (event) => {
            const el = event.target;
            if (el.classList.contains('btn-num')) this.addNumero(el);
            if (el.classList.contains('btn-clear')) this.c();
            if (el.classList.contains('btn-del')) this.del();
            if (el.classList.contains('btn-eq')) this.realizaConta();
        });
    };


    this.realizaConta = () => {
        try {
            const conta = eval (this.resultado.value);
            this.resultado.value = conta;
            if (!conta) {
                alert('Conta inválida');
                return;
            };
        } catch(e) {
            alert('Conta inválida');
            return;
        };
    };

    this.addNumero = el => {
        this.resultado.value += el.innerText;
        this.resultado.focus();
    };
    this.c = () => this.resultado.value = '';
    this.del = () => this.resultado.value = this.resultado.value.slice(0, -1);

};
