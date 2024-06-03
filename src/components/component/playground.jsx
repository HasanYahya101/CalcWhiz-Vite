import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Playground() {

    const [expression, setExpression] = useState("");

    const handleButtonClick = (value) => {
        // If the entered value is an operator and the expression is empty, don't append it
        if ("+-*/".includes(value) && expression === "") {
            return;
        }

        // If the entered value is zero and the expression is empty, directly append it
        if (value === "0" && expression === "") {
            setExpression(expression + value);
            return;
        }

        // If the entered value is zero and the last character is an operator, directly append it
        if (value === "0" && "+-*/".includes(expression.slice(-1))) {
            setExpression(expression + value);
            return;
        }

        // If the entered value is zero and the last character is not an operator, check if it's a valid number
        if (value === "0" && !isNaN(parseFloat(expression.slice(-1)))) {
            setExpression(expression + value);
            return;
        }

        // If the last character is a zero and the current value is not an operator, remove the zero before appending
        if (expression.slice(-1) === "0" && !"+-*/".includes(value)) {
            setExpression(expression.slice(0, -1) + value);
            return;
        }

        // Otherwise, directly append the entered value
        setExpression(expression + value);
    }

    const EqualClick = () => {
        try {
            const result = eval(expression);
            if (isNaN(result) || !isFinite(result)) {
                setExpression("Error");
            } else {
                setExpression(result.toString());
            }
        } catch (error) {
            setExpression("Error");
        }
    }

    const handleNegate = () => {
        if (expression === "") return;
        if (expression.charAt(0) === "-") {
            setExpression(expression.slice(1));
        } else {
            setExpression("-" + expression);
        }
    }

    const handlePercentage = () => {
        const result = eval(expression + "/100");
        setExpression(result.toString());
    }

    return (
        (<div
            className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="mb-4">
                    <Input value={expression} onChange={(e) => setExpression(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                        type="text" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Button onClick={() => setExpression("")}
                        className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        AC
                    </Button>
                    <Button onClick={handleNegate}
                        className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        +/-
                    </Button>
                    <Button onClick={handlePercentage}
                        className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        %
                    </Button>
                    <Button onClick={() => handleButtonClick("/")}
                        className="text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700 font-bold"
                        variant="outline">
                        ÷
                    </Button>
                    <Button onClick={() => handleButtonClick("7")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        7
                    </Button>
                    <Button onClick={() => handleButtonClick("8")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        8
                    </Button>
                    <Button onClick={() => handleButtonClick("9")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        9
                    </Button>
                    <Button onClick={() => handleButtonClick("*")}
                        className="text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700 font-bold"
                        variant="outline">
                        x
                    </Button>
                    <Button onClick={() => handleButtonClick("4")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        4
                    </Button>
                    <Button onClick={() => handleButtonClick("5")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        5
                    </Button>
                    <Button onClick={() => handleButtonClick("6")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        6
                    </Button>
                    <Button onClick={() => handleButtonClick("-")}
                        className="text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700 font-bold"
                        variant="outline">
                        -
                    </Button>
                    <Button onClick={() => handleButtonClick("1")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        1
                    </Button>
                    <Button onClick={() => handleButtonClick("2")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        2
                    </Button>
                    <Button onClick={() => handleButtonClick("3")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        3
                    </Button>
                    <Button onClick={() => handleButtonClick("+")}
                        className="text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-700 font-bold"
                        variant="outline">
                        +
                    </Button>
                    <Button onClick={() => handleButtonClick("0")}
                        className="col-span-2 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        0
                    </Button>
                    <Button onClick={() => handleButtonClick(".")}
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                        variant="outline">
                        .
                    </Button>
                    <Button onClick={EqualClick}
                        className="text-white bg-orange-500 dark:bg-orange-400 hover:bg-orange-600 dark:hover:bg-orange-500 font-bold"
                        variant="outline">
                        =
                    </Button>
                </div>
            </div>
        </div>)
    );
}
