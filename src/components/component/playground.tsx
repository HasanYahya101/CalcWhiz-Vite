import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function Playground() {
    const [display, setDisplay] = useState("0");
    const [memory, setMemory] = useState(0);
    const [angleUnit, setAngleUnit] = useState("deg");
    const [history, setHistory] = useState<string[]>([]);
    const [rpnStack, setRpnStack] = useState<number[]>([]);
    const [isRpnMode, setIsRpnMode] = useState(false);
    const [graphData, setGraphData] = useState<{ x: number; y: number }[]>([]);
    const [graphRange, setGraphRange] = useState({ min: -10, max: 10 });

    const handleButtonClick = useCallback((value: string) => {
        if (isRpnMode) {
            if (!isNaN(parseFloat(value))) {
                setRpnStack((prev) => [...prev, parseFloat(value)]);
            } else {
                setDisplay(value);
            }
        } else {
            setDisplay((prev) => (prev === "0" ? value : prev + value));
        }
    }, [isRpnMode]);

    const handleClear = useCallback(() => {
        setDisplay("0");
        if (isRpnMode) {
            setRpnStack([]);
        }
    }, [isRpnMode]);

    const handleCalculate = useCallback(() => {
        try {
            let result;
            if (isRpnMode) {
                result = calculateRPN();
            } else {
                const processedDisplay = display
                    .replace(/π/g, 'Math.PI')
                    .replace(/e/g, 'Math.E')
                    .replace(/\^/g, '**')
                    .replace(/√/g, 'Math.sqrt')
                    .replace(/log(\d+)$$(.+?)$$/g, (_, base, num) => `Math.log(${num}) / Math.log(${base})`)
                    .replace(/ln/g, 'Math.log');

                result = eval(processedDisplay);
            }

            if (typeof result === 'number') {
                if (!Number.isInteger(result) && Math.abs(result) < 1e-10) {
                    result = 0;
                }
                result = parseFloat(result.toPrecision(12));
            }

            setDisplay(result.toString());
            setHistory((prev) => [...prev, `${display} = ${result}`]);
        } catch (error) {
            setDisplay("Error");
        }
    }, [display, isRpnMode]);

    const calculateRPN = () => {
        if (rpnStack.length < 2) {
            throw new Error("Not enough operands");
        }
        const b = rpnStack.pop()!;
        const a = rpnStack.pop()!;
        let result;
        switch (display) {
            case "+": result = a + b; break;
            case "-": result = a - b; break;
            case "*": result = a * b; break;
            case "/": result = a / b; break;
            case "^": result = Math.pow(a, b); break;
            default: throw new Error("Unknown operator");
        }
        setRpnStack((prev) => [...prev, result]);
        return result;
    };

    const handleScientificFunction = useCallback((func: string) => {
        try {
            let result;
            const x = isRpnMode ? rpnStack[rpnStack.length - 1] : parseFloat(display);
            const toRadians = (angleUnit === "deg") ? (x: number) => x * (Math.PI / 180) : (x: number) => x;
            const toDegrees = (x: number) => x * (180 / Math.PI);

            switch (func) {
                case 'sin':
                case 'cos':
                case 'tan':
                    result = Math[func](toRadians(x));
                    break;
                case 'asin':
                case 'acos':
                case 'atan':
                    result = angleUnit === "deg" ? toDegrees(Math[func](x)) : Math[func](x);
                    break;
                case 'log':
                    result = Math.log10(x);
                    break;
                case 'ln':
                    result = Math.log(x);
                    break;
                case 'sqrt':
                    result = Math.sqrt(x);
                    break;
                case 'cbrt':
                    result = Math.cbrt(x);
                    break;
                case 'x^2':
                    result = Math.pow(x, 2);
                    break;
                case 'x^3':
                    result = Math.pow(x, 3);
                    break;
                case '10^x':
                    result = Math.pow(10, x);
                    break;
                case 'e^x':
                    result = Math.exp(x);
                    break;
                case '1/x':
                    result = 1 / x;
                    break;
                case 'abs':
                    result = Math.abs(x);
                    break;
                case 'floor':
                    result = Math.floor(x);
                    break;
                case 'ceil':
                    result = Math.ceil(x);
                    break;
                case 'round':
                    result = Math.round(x);
                    break;
                case 'fact':
                    result = factorial(x);
                    break;
                default:
                    throw new Error("Unknown function");
            }
            if (isRpnMode) {
                setRpnStack((prev) => [...prev.slice(0, -1), result]);
            } else {
                setDisplay(result.toString());
            }
        } catch (error) {
            setDisplay("Error");
        }
    }, [display, angleUnit, isRpnMode, rpnStack]);

    const handleMemoryFunction = useCallback((func: string) => {
        const x = isRpnMode ? rpnStack[rpnStack.length - 1] : parseFloat(display);
        switch (func) {
            case 'M+':
                setMemory((prev) => prev + x);
                break;
            case 'M-':
                setMemory((prev) => prev - x);
                break;
            case 'MR':
                if (isRpnMode) {
                    setRpnStack((prev) => [...prev, memory]);
                } else {
                    setDisplay(memory.toString());
                }
                break;
            case 'MC':
                setMemory(0);
                break;
        }
    }, [display, memory, isRpnMode, rpnStack]);

    const factorial = (n: number): number => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        return n * factorial(n - 1);
    };

    const handleUnitConversion = useCallback((from: string, to: string) => {
        const value = parseFloat(display);
        let result: number;

        const conversions: { [key: string]: { [key: string]: number | ((x: number) => number) } } = {
            length: {
                m: 1,
                km: 0.001,
                cm: 100,
                mm: 1000,
                in: 39.3701,
                ft: 3.28084,
                yd: 1.09361,
                mi: 0.000621371
            },
            mass: {
                kg: 1,
                g: 1000,
                mg: 1e6,
                lb: 2.20462,
                oz: 35.274
            },
            temperature: {
                C: (x: number) => x,
                F: (x: number) => (x * 9 / 5) + 32,
                K: (x: number) => x + 273.15
            }
        };

        if (from === to) {
            result = value;
        } else if (from in conversions.temperature && to in conversions.temperature) {
            const toCelsius = {
                C: (x: number) => x,
                F: (x: number) => (x - 32) * 5 / 9,
                K: (x: number) => x - 273.15
            };
            result = (conversions.temperature[to as keyof typeof conversions.temperature] as (x: number) => number)(toCelsius[from as keyof typeof toCelsius](value));
        } else {
            const category = Object.keys(conversions).find(cat => from in conversions[cat] && to in conversions[cat]);
            if (category) {
                const fromConversion = conversions[category][from];
                const toConversion = conversions[category][to];
                const fromValue = typeof fromConversion === 'function' ? fromConversion(value) : value * fromConversion;
                const toValue = typeof toConversion === 'function' ? toConversion(1) : toConversion;
                result = fromValue / toValue;
            } else {
                throw new Error("Incompatible units");
            }
        }

        setDisplay(result.toString());
    }, [display]);

    const handleComplexOperation = useCallback((operation: string) => {
        const [real, imag] = display.split('+');
        const a = parseFloat(real);
        const b = parseFloat(imag);
        let result: string;

        switch (operation) {
            case 'abs':
                result = Math.sqrt(a * a + b * b).toString();
                break;
            case 'conj':
                result = `${a}${b >= 0 ? '-' : '+'}${Math.abs(b)}i`;
                break;
            default:
                result = "Error";
        }

        setDisplay(result);
    }, [display]);

    const solveEquation = useCallback(() => {
        try {
            const equation = display.replace('=', '-');
            const f = (x: number) => eval(equation.replace(/x/g, `(${x})`));
            let x0 = 0, x1 = 1;
            const tolerance = 1e-7;
            const maxIterations = 100;

            for (let i = 0; i < maxIterations; i++) {
                const fx0 = f(x0);
                if (Math.abs(fx0) < tolerance) {
                    setDisplay(`x = ${x0}`);
                    return;
                }
                const fx1 = f(x1);
                const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
                x0 = x1;
                x1 = x2;
            }
            setDisplay("No solution found");
        } catch (error) {
            setDisplay("Error");
        }
    }, [display]);

    const plotGraph = useCallback(() => {
        const f = (x: number) => eval(display.replace(/x/g, `(${x})`));
        const data = [];
        for (let x = graphRange.min; x <= graphRange.max; x += 0.1) {
            try {
                const y = f(x);
                if (!isNaN(y) && isFinite(y)) {
                    data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
                }
            } catch (error) {
                // Skip points where the function is undefined
            }
        }
        setGraphData(data);
    }, [display, graphRange]);

    const ButtonGrid = ({ buttons }: { buttons: string[][] }) => (
        <div className="grid grid-cols-5 gap-1">
            {buttons.flat().map((btn) => (
                <Button
                    key={btn}
                    onClick={() => {
                        if (btn === '=') handleCalculate();
                        else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'x^2', 'x^3', '10^x', 'e^x', '1/x', 'abs', 'floor', 'ceil', 'round', 'fact'].includes(btn)) handleScientificFunction(btn);
                        else if (['M+', 'M-', 'MR', 'MC'].includes(btn)) handleMemoryFunction(btn);
                        else if (btn === 'C') handleClear();
                        else handleButtonClick(btn);
                    }}
                    className="h-12 text-sm font-medium"
                    variant={['=', 'C'].includes(btn) ? "default" : "outline"}
                >
                    {btn}
                </Button>
            ))}
        </div>
    );

    const { setTheme } = useTheme();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 overflow-x-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="fixed top-6 right-6 z-50">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl min-w-[520px]">
                <Input
                    value={isRpnMode ? rpnStack.join(' ') : display}
                    className="w-full px-4 py-2 text-right text-2xl font-bold mb-4 bg-gray-100 dark:bg-gray-700"
                    readOnly
                />
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4 ml-2 gap-4">
                        <Select value={angleUnit} onValueChange={setAngleUnit}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Angle Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="deg">Degrees</SelectItem>
                                <SelectItem value="rad">Radians</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="rpn-mode"
                                checked={isRpnMode}
                                onCheckedChange={setIsRpnMode}
                            />
                            <Label htmlFor="rpn-mode">RPN Mode</Label>
                        </div>
                    </div>
                    <div className="text-sm font-medium mr-3">
                        Memory: {memory}
                    </div>
                </div>
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-6 mb-4 gap-1.5 dark:border dark:border-gray-900">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="scientific">Scientific</TabsTrigger>
                        <TabsTrigger value="complex">Complex</TabsTrigger>
                        <TabsTrigger value="graph">Graph</TabsTrigger>
                        <TabsTrigger value="convert">Convert</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic">
                        <ButtonGrid
                            buttons={[
                                ['7', '8', '9', '/', 'C'],
                                ['4', '5', '6', '*', '('],
                                ['1', '2', '3', '-', ')'],
                                ['0', '.', 'π', '+', '='],
                                ['M+', 'M-', 'MR', 'MC', '%'],
                            ]}
                        />
                    </TabsContent>
                    <TabsContent value="scientific">
                        <ButtonGrid
                            buttons={[
                                ['sin', 'cos', 'tan', 'log', 'ln'],
                                ['asin', 'acos', 'atan', '10^x', 'e^x'],
                                ['sqrt', 'cbrt', 'x^2', 'x^3', '1/x'],
                                ['abs', 'floor', 'ceil', 'round', 'fact'],
                                ['(', ')', '^', 'π', 'e'],
                                ['M+', 'M-', 'MR', 'MC', 'C'],
                                ['7', '8', '9', '/', '='],
                                ['4', '5', '6', '*', '%'],
                                ['1', '2', '3', '-', 'EXP'],
                                ['0', '.', '×10^', '+', 'Ans'],
                            ]}
                        />
                    </TabsContent>
                    <TabsContent value="complex">
                        <div className="grid grid-cols-2 gap-4">
                            <Button onClick={() => handleComplexOperation('abs')}>|z| (Absolute)</Button>
                            <Button onClick={() => handleComplexOperation('conj')}>z* (Conjugate)</Button>
                            <Button onClick={solveEquation}>Solve Equation</Button>
                            <Button onClick={() => handleButtonClick('i')}>i (Imaginary Unit)</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="graph">
                        <div className="flex flex-col space-y-4">
                            <div className="flex space-x-4">
                                <Input
                                    placeholder="Enter function of x"
                                    value={display}
                                    onChange={(e) => setDisplay(e.target.value)}
                                />
                                <Button onClick={plotGraph}>Plot</Button>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Label>Range:</Label>
                                <Input
                                    type="number"
                                    value={graphRange.min}
                                    onChange={(e) => setGraphRange((prev) => ({ ...prev, min: parseFloat(e.target.value) }))}
                                    className="w-20"
                                />
                                <Input
                                    type="number"
                                    value={graphRange.max}
                                    onChange={(e) => setGraphRange((prev) => ({ ...prev, max: parseFloat(e.target.value) }))}
                                    className="w-20"
                                />
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="x" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                    <TabsContent value="convert">
                        <div className="grid grid-cols-3 gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">Length</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Convert Length</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Choose units to convert between
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="from">From</Label>
                                                <Select onValueChange={(value) => handleUnitConversion(value, 'to')}>
                                                    <SelectTrigger id="from">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="m">Meters</SelectItem>
                                                        <SelectItem value="km">Kilometers</SelectItem>
                                                        <SelectItem value="cm">Centimeters</SelectItem>
                                                        <SelectItem value="mm">Millimeters</SelectItem>
                                                        <SelectItem value="in">Inches</SelectItem>
                                                        <SelectItem value="ft">Feet</SelectItem>
                                                        <SelectItem value="yd">Yards</SelectItem>
                                                        <SelectItem value="mi">Miles</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="to">To</Label>
                                                <Select onValueChange={(value) => handleUnitConversion('from', value)}>
                                                    <SelectTrigger id="to">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="m">Meters</SelectItem>
                                                        <SelectItem value="km">Kilometers</SelectItem>
                                                        <SelectItem value="cm">Centimeters</SelectItem>
                                                        <SelectItem value="mm">Millimeters</SelectItem>
                                                        <SelectItem value="in">Inches</SelectItem>
                                                        <SelectItem value="ft">Feet</SelectItem>
                                                        <SelectItem value="yd">Yards</SelectItem>
                                                        <SelectItem value="mi">Miles</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">Mass</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Convert Mass</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Choose units to convert between
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="from">From</Label>
                                                <Select onValueChange={(value) => handleUnitConversion(value, 'to')}>
                                                    <SelectTrigger id="from">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="kg">Kilograms</SelectItem>
                                                        <SelectItem value="g">Grams</SelectItem>
                                                        <SelectItem value="mg">Milligrams</SelectItem>
                                                        <SelectItem value="lb">Pounds</SelectItem>
                                                        <SelectItem value="oz">Ounces</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="to">To</Label>
                                                <Select onValueChange={(value) => handleUnitConversion('from', value)}>
                                                    <SelectTrigger id="to">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="kg">Kilograms</SelectItem>
                                                        <SelectItem value="g">Grams</SelectItem>
                                                        <SelectItem value="mg">Milligrams</SelectItem>
                                                        <SelectItem value="lb">Pounds</SelectItem>
                                                        <SelectItem value="oz">Ounces</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">Temperature</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Convert Temperature</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Choose units to convert between
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="from">From</Label>
                                                <Select onValueChange={(value) => handleUnitConversion(value, 'to')}>
                                                    <SelectTrigger id="from">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="C">Celsius</SelectItem>
                                                        <SelectItem value="F">Fahrenheit</SelectItem>
                                                        <SelectItem value="K">Kelvin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="to">To</Label>
                                                <Select onValueChange={(value) => handleUnitConversion('from', value)}>
                                                    <SelectTrigger id="to">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="C">Celsius</SelectItem>
                                                        <SelectItem value="F">Fahrenheit</SelectItem>
                                                        <SelectItem value="K">Kelvin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </TabsContent>
                    <TabsContent value="history">
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            {history.map((item, index) => (
                                <div key={index} className="text-sm">{item}</div>
                            ))}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}