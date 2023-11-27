class CalculadoraBasica {

    constructor() {
        this.basicOperationShape = new RegExp("(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?[\-\+\*\/])(([1-9][0-9]*|[0.])(.[0-9]*[1-9])?)");
        this.memoryRegister = 0;

        this.value1 = 0;
        this.operation = "";
        this.simple = false;
    }

    closeParenthesis() {
        var field = document.getElementById("displayBox").value;
        const openParenthesisIndex = field.indexOf("(");
        const closeParenthesisIndex = field.indexOf(")");
        this.value1 = field.slice(openParenthesisIndex + 1, closeParenthesisIndex);
    }

    printMemoryContents() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    subtractFromMemory() {
        this.memoryRegister -= this.solveOperation();
    }

    addToMemory() {
        this.memoryRegister += this.solveOperation();
    }

    writeToDisplay(data) {
        let legacy = document.getElementById("displayBox").value;
        if (data == ".") {
            legacy += data;
        } else {
            legacy = legacy == "0" ? data : legacy += data;
        }
        document.getElementById("displayBox").value = legacy;
    }

    writeOperatorToDisplay(operator) {
        this.simple = operator != ")";
        console.log("passou");
        let legacy = document.getElementById("displayBox").value;
        if (this.basicOperationShape.test(legacy)) {
            this.solveOperation();
        }
        this.writeToDisplay(operator);
    }

    clearDisplay() {
        document.getElementById("displayBox").value = "0";
    }

    solveOperation() {
        let operation = document.getElementById("displayBox").value;
        let result = 0;
        try {
            result = eval(operation);
        } catch (err) {
            alert("Syntax error");
            this.clearDisplay();
        }
        document.getElementById("displayBox").value = result;
        return result;
    }
}

class CalculadoraCientifica extends CalculadoraBasica {

    constructor() {
        super();
        this.inputList = new Array();
        this.operationString = "";
        this.justSolved = false;
        this.operationMap = {
            "sin(": "Math.sin(",
            "cos(": "Math.cos(",
            "tan(": "Math.tan(",
            "log(": "Math.log10(",
            "ln(": "Math.log(",
            "sqrt(": "Math.sqrt(",
            "PI": "Math.PI",
            "e": "Math.E"
        };
    }

    writeToDisplay(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += data;
        this.inputList.push(data);
    }

    writeOperatorToDisplay(operator) {
        this.simple = operator != ")";
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        this.operationString += operator;
        super.writeToDisplay(operator);
        this.inputList.push(operator);

        if(operator == ")"){
            super.closeParenthesis(operator);
        }
    }

    async solveOperation() {
        console.log(this.simple);
        let result = 0;
        try {
            if(this.simple){
                let operation = document.getElementById("displayBox").value;
                result = eval(operation);
            } else{
                var response = await fetch(`https://localhost:7003/calculadora/${this.operation}?value=${this.value1}`)
                var output = await response.json();
                console.log(output);
                result = output;
            }
            
        } catch (err) {
            result = "Syntax Error";
        }
        document.getElementById("displayBox").value = result;
        this.operationString = "";
        this.operationString += result;
        this.justSolved = true;
        return result;
    }

    clearDisplay() {
        super.clearDisplay();
        this.operationString = "";
    }

    toggleSign() {
        var displayBox = document.getElementById("displayBox");
        var displayContents = displayBox.value;
        if (displayContents == "Syntax Error") {
            super.clearDisplay();
        }
        if (displayContents == "0") {
            displayBox.value = "-";
            this.operationString += "-";
        } else {
            displayBox.value = "-" + displayBox.value;
            this.operationString = "-" + this.operationString;
        }
    }

    clearMemory() {
        super.subtractFromMemory(this.memoryRegister);
    }

    readMemory() {
        this.clearDisplay();
        this.writeToDisplay(this.memoryRegister);
    }

    saveToMemory() {
        this.memoryRegister = this.solveOperation();
    }

    eraseLastInput() {
        this.inputList.pop();
        var recreatedOperation = "";
        for (var each in this.inputList) {
            recreatedOperation += this.inputList[each];
        }
        document.getElementById("displayBox").value = recreatedOperation;
        for (var each in this.operationMap) {
            recreatedOperation = recreatedOperation.replace(each, this.operationMap[each]);
        }
        this.operationString = recreatedOperation;
    }

    writeMathFunction(data) {
        this.simple = false;
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);
    }

    sin(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);

        const openParenthesisIndex = string.indexOf("(");
        const closeParenthesisIndex = string.indexOf(")");
        const number = string.slice(openParenthesisIndex + 1, closeParenthesisIndex);

        this.operation = "sin";
        this.value1 = number;
    }

    tan(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);

        const openParenthesisIndex = string.indexOf("(");
        const closeParenthesisIndex = string.indexOf(")");
        const number = string.slice(openParenthesisIndex + 1, closeParenthesisIndex);

        this.operation = "tan";
        this.value1 = number;
    }

    cos(data) {
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);

        const openParenthesisIndex = data.indexOf("(");
        const closeParenthesisIndex = data.indexOf(")");
        const number = data.slice(openParenthesisIndex, closeParenthesisIndex);

        this.operation = "cos";
        this.value1 = number;
     }

     log(data) {
        this.simple = false;
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);

        const openParenthesisIndex = data.indexOf("(");
        const closeParenthesisIndex = data.indexOf(")");
        const number = data.slice(openParenthesisIndex + 1, closeParenthesisIndex);

        this.operation = "log";
        this.value1 = number;
     }

    log10(data) {
        this.simple = false;
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);

        const openParenthesisIndex = data.indexOf("(");
        const closeParenthesisIndex = data.indexOf(")");
        const number = data.slice(openParenthesisIndex + 1, closeParenthesisIndex);

        this.operation = "log10";
        this.value1 = number;
    }
    
    sqrt(data) {
        this.simple = false;
        if (document.getElementById("displayBox").value == "Syntax Error") {
            super.clearDisplay();
        }
        super.writeToDisplay(data);
        this.operationString += this.operationMap[data];
        this.inputList.push(data);
        this.operation = "sqrt";
    }

    async calculateFactorial() {
        this.simple = false;
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        var result = 0;
        try {
            var response = await fetch(`https://localhost:7003/calculadora/recursiveFactorial?value=${number}`)
            var output = await response.json()
            result = this.calculateRecursiveFactorial(output);
        } catch(err) {
            document.getElementById("displayBox").value = "That number is too big";
        }
        this.clearDisplay();
        document.getElementById("displayBox").value = result;
    }

    async nthTenPower() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        var response = await fetch("https://localhost:7003/calculadora/nthTenPower?value=" + number);
        var output = await response.json()
        console.log(output);
        document.getElementById("displayBox").value = parseInt(output);
    }

    async square() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        var response = await fetch(`https://localhost:7003/calculadora/square?value=${number}`);
        var output = await response.json();
        console.log(output)
        document.getElementById("displayBox").value = output;
    }

    async cube() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        var response = await fetch(`https://localhost:7003/calculadora/cube?value=${number}`)
        var output = await response.json();
        document.getElementById("displayBox").value = output;
    }

    async inverseNumber() {
        var number = parseInt(this.operationString.split(new RegExp("[^0-9]")));
        this.clearDisplay();
        var response = await fetch(`https://localhost:7003/calculadora/inverseNumber?value=${number}`);
        var output = await response.json();
        document.getElementById("displayBox").value = output;
    }

}

const calculadora = new CalculadoraCientifica();
