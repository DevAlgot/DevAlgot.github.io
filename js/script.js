/**
 * Se detta som en grund att utgå ifrån.
 * Det är helt fritt att ändra och ta bort kod om ni
 * önskar lösa problemen med andra metoder.
 */

let secret = false

let lcd = null; // displayen

let memory = 0; // Lagrat/gamlat värdet från display
let arithmetic = null; // Vilken beräkning som skall göras +,-, x eller /

let main = null;
let info_op = null;

function init() {
    lcd = document.getElementById('lcd');
    let keyBoard = document.getElementById('keyBoard')
    keyBoard.onclick = buttonClick;

    clearLCD();

    main = document.body.children[0]; //tar "main"

    var secretButton = document.createElement('button');
    secretButton.id = "secretButton";
    secretButton.innerHTML = "";
    main.appendChild(secretButton);

    secretButton.onclick = function(){
        secret = !secret;

        //for the keyboard buttons
        for (let i = 0; i < keyBoard.children.length; i++) {
            keyBoard.children[i].classList.toggle("secret");
        }

        //body
        document.body.classList.toggle("secret");

        //lcd
        lcd.classList.toggle("secret");
    };
    
}

/**
 * Händelsehanterare för kalkylatorns tangentbord
 */
function buttonClick(e) {
    let btn = e.target.id; //id för den tangent som tryckte ner

    // kollar om siffertangent är nedtryckt
    if (btn.substring(0, 1) === 'b') {
        //om det är en 0:a byts den ut med digit, 
        //men om man lägger till komma borde 0:an vara kvar
        if(lcd.value == 0 && !lcd.value.includes(".")) { lcd.value = ""; } 
        let digit = btn.substring(1, 2); // plockar ut siffran från id:et
        addDigit(digit)

    } else { // Inte en siffertangent, övriga tangenter.
        //går igenom vilken knapp som trycktes, och kollar vilket ID den har  
        
        switch (btn) {
            case 'add':
                !secret ? setOperator('+') : addDigit("+");
                break;
            case 'sub':
                !secret ? setOperator('-') : addDigit("-");
                break;
            case 'mul':
                !secret ? setOperator('*') : addDigit("*");
                break;
            case 'div':
                !secret ? setOperator('/') : addDigit("/");
                break;
            case 'clear':
                memClear();
                break;
            case 'enter':
                if(arithmetic || secret)
                    calculate();
                break;
            case 'comma':
                addComma();
                break;
        }
    }   
}

/**
 *  Lägger till siffra på display.
 */
function addDigit(digit) {
    lcd.value += digit;
}

/**
 * Lägger till decimaltecken
 */
function addComma() {
    if (!lcd.value.includes('.') || secret) { // kollar om decimaltecken redan finns
        lcd.value += '.';
    }
}

/**
 * Sparar operator.
 * +, -, *, /
 */
function setOperator(operator){
    arithmetic = operator;
    memory = parseFloat(lcd.value); // sparar värdet i minnet
    clearLCD();

}

/**
 * Beräknar ovh visar resultatet på displayen.
 */
function calculate() {
    let result;

    //switchar operator och räknar ut vad det blir
    if(!secret){
        switch (arithmetic) {
            case '+':
                result = memory + parseFloat(lcd.value);
                break;
            case '-':
                result = memory - parseFloat(lcd.value);
                break;
            case '*':
                result = memory * parseFloat(lcd.value);
                break;
            case '/':
                result = memory / parseFloat(lcd.value);
                break;
        }
    }
    else {
        //för lite mer avancerade uträkningar
        result = eval(lcd.value)
    }
    console.log(result);

    lcd.value = result; // visar resultatet på displayen
    memory = result; // sparar resultatet i minnet
    //arithmetic = null; // nollställer operator
}

/** Rensar display */
function clearLCD() {
    lcd.value = 0; //tycker 0 är bättre än ingenting
    isComma = false;
}

/** Rensar allt, reset */
function memClear(){
    memory = 0;
    arithmetic = null;
    clearLCD();
}


window.onload = init;