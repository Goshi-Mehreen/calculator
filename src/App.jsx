
import React, { useState, useEffect } from "react";

function App() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [expression, setExpression] = useState("");

  const handleClick = (value) => {

    // Clear button
    if (value === "C") {
      setDisplay("0");
      setFirstNumber(null);
      setOperator(null);
      setWaitingForSecond(false);
      setExpression("");
      return;
    }

    // Delete button
    if (value === "DEL") {
      if (display === "Error" || waitingForSecond) {
        setDisplay("0");
        setWaitingForSecond(false);
      } else {
        setDisplay(
          display.length === 1 ? "0" : display.slice(0, -1)
        );
      }
      return;
    }

    // Number buttons
    if (["0", "00", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(value)) {

      if (display === "Error" || waitingForSecond) {
        setDisplay(value === "00" ? "0" : value);
        setWaitingForSecond(false);
      }
      else if (display === "0") {
        setDisplay(value === "00" ? "0" : value);
      }
      else {
        setDisplay(display + value);
      }

      return;
    }

    // Decimal button
    if (value === ".") {
      if (display === "Error" || waitingForSecond) {
        setDisplay("0.");
        setWaitingForSecond(false);
      } else if (!display.includes(".")) {
        setDisplay(display + ".");
      }
      return;
    }

    // Plus / Minus button
    if (value === "+/-") {
      if (display !== "0" && display !== "Error") {
        setDisplay(String(Number(display) * -1));
      }
      return;
    }

    // Operator buttons
    if (["+", "-", "*", "/"].includes(value)) {
      if (display === "Error") return;

      const number = Number(display);

      setFirstNumber(number);
      setOperator(value);
      setExpression(`${number} ${value}`);
      setDisplay("0");
      setWaitingForSecond(true);
      return;
    }

    // Equal button
    if (value === "=") {
      if (firstNumber === null || operator === null || waitingForSecond) {
        return;
      }

      const secondNumber = Number(display);
      let result;

      if (operator === "+") {
        result = firstNumber + secondNumber;
      } else if (operator === "-") {
        result = firstNumber - secondNumber;
      } else if (operator === "*") {
        result = firstNumber * secondNumber;
      } else if (operator === "/") {
        if (secondNumber === 0) {
          setDisplay("Error");
          setFirstNumber(null);
          setOperator(null);
          setExpression("");
          return;
        }

        result = firstNumber / secondNumber;
      }

      setExpression(`${firstNumber} ${operator} ${secondNumber} =`);
      setDisplay(String(Number(result.toFixed(8))));
      setFirstNumber(null);
      setOperator(null);
      setWaitingForSecond(true);
      return;
    }
  };

  // Keyboard functionality
  useEffect(() => {

    const handleKeyDown = (event) => {

      // Number buttons
      if (/^[0-9]$/.test(event.key)) {
        handleClick(event.key);
      }

      // Operators
      else if (["+", "-", "*", "/"].includes(event.key)) {
        handleClick(event.key);
      }

      // Decimal
      else if (event.key === ".") {
        handleClick(".");
      }

      // Enter key
      else if (event.key === "Enter") {
        event.preventDefault();
        handleClick("=");
      }

      // Backspace key
      else if (event.key === "Backspace") {
        event.preventDefault();
        handleClick("DEL");
      }

      // Escape key
      else if (event.key === "Escape") {
        handleClick("C");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [handleClick]);

  return (
    <div className="min-h-screen bg-yellow-100 flex justify-center items-center">

      <div className="bg-white w-80 p-5 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold text-center mb-5">
          Calculator
        </h1>

        <div className="bg-gray-100 p-4 rounded-lg text-right mb-4 overflow-hidden">

          <div className="text-sm text-gray-500 min-h-5">
            {expression}
          </div>

          <div className="text-2xl font-bold break-all">
            {display}
          </div>

        </div>

        <div className="grid grid-cols-4 gap-3">

          {[
            "C", "DEL", "/", "*",
            "7", "8", "9", "-",
            "4", "5", "6", "+",
            "1", "2", "3", "=",
            "0", "00", ".", "+/-"
          ].map((btn) => (

            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`p-3 rounded-lg text-xl font-bold hover:bg-yellow-300 ${
                ["C", "DEL", "=", "/", "*", "-", "+", "+/-"].includes(btn)
                  ? "bg-yellow-200"
                  : "bg-gray-200"
              }`}
            >
              {btn}
            </button>

          ))}

        </div>
      </div>
    </div>
  );
}

export default App;
