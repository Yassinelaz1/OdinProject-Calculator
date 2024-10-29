// Get the text field element from the document
let textField = document.getElementById("text");

// Function to append a value to the text field
function addtotext(value) {
    textField.value += value; // Concatenate the new value to the existing text
}

// Function to clear the text field
function del() {
    textField.value = ""; // Set the text field value to an empty string
}

// Function to calculate the expression entered in the text field
function calc() {
    try {
        // Evaluate the expression and set the result in the text field
        const result = evaluateExpression(textField.value);
        textField.value = result; // Update the text field with the calculated result
    } catch (error) {
        // If an error occurs during evaluation, display "Error"
        textField.value = "Error";
    }
}

// Function to evaluate a mathematical expression
function evaluateExpression(expression) {
    // Tokenize the expression into numbers and operators
    let tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\(|\))/g);

    // Helper function to apply an operator to the values
    function applyOperator(operators, values) {
        let operator = operators.pop(); // Get the last operator
        let b = values.pop(); // Get the last two values
        let a = values.pop();
        // Perform the operation based on the operator
        switch (operator) {
            case '+': values.push(a + b); break; // Addition
            case '-': values.push(a - b); break; // Subtraction
            case '*': values.push(a * b); break; // Multiplication
            case '/': 
                if (b === 0) throw new Error("Division by zero"); // Prevent division by zero
                values.push(a / b); // Division
                break;
        }
    }

    let values = []; // Stack for numbers
    let operators = []; // Stack for operators
    let precedence = { '+': 1, '-': 1, '*': 2, '/': 2 }; // Operator precedence

    // Process each token in the expression
    for (let token of tokens) {
        if (!isNaN(token)) {
            values.push(Number(token)); // If token is a number, push it to values stack
        } else if (token === '(') {
            operators.push(token); // Push '(' to operators stack
        } else if (token === ')') {
            // Process operators until '(' is found
            while (operators[operators.length - 1] !== '(') {
                applyOperator(operators, values);
            }
            operators.pop(); // Remove the '(' from the stack
        } else {
            // Process operators based on precedence
            while (
                operators.length &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                applyOperator(operators, values);
            }
            operators.push(token); // Push the current operator to the stack
        }
    }

    // Apply remaining operators
    while (operators.length) {
        applyOperator(operators, values);
    }

    return values[0]; // Return the final result
}