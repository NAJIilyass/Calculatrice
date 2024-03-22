import { useEffect, useState } from "react";

const Calc = () => {
    const ch1 = ["(", ")", "ans", "del", "clear"];
    const ch2 = [7, 8, 9, "%", "√"];
    const ch3 = [4, 5, 6, "x", "÷"];
    const ch4 = [1, 2, 3, "+", "-"];
    const ch5 = [".", 0, "±", "ENTER"];
    const [value, setValue] = useState("0");
    const [line, setLine] = useState("0");
    const [firstZero, setFirstZero] = useState(false);
    const [ans, setAns] = useState("0");
    const [ans1, setAns1] = useState("0"); //For ans button
    const [click, setClick] = useState(false); //Si value est vide, number s'écrit directement dans value
    const [clickNumber, setClickNumber] = useState(false); //Je fait dans le code le fait que if(value===ans) pour traiter le cas quand user change le symbole (entre + et - par exemple), clickNumber pour le cas de si user a créer sur un nombre egal à ans
    const [syntaxeError, setSyntaxeError] = useState(false);
    const [clickParenthesis, setClickParenthesis] = useState(0); //Array for couting value where we click ")", the first is the number and the second is the index

    useEffect(() => {
        if (value.length > 11) {
            setValue(value.substring(0, 12));
        }
    }, [value]);

    useEffect(
        () => {
            if (line.includes("/0") || line.includes("%0")) {
                setLine(line.substring(0, line.length - 2));
                setAns1(0);
                setSyntaxeError(true);
            }
            let myP = document.getElementById("forScrolling");
            if (myP) {
                myP.scrollBy(myP.scrollWidth + 100000, 0);
            }
        },
        [line, ans],
        clickParenthesis
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "*") {
                handleClick("x");
            } else if (e.key === "/") {
                handleClick("÷");
            } else if (e.key === "Backspace") {
                handleClick("del");
            } else if (e.key === "Enter") {
                handleClick("ENTER");
            } else if (/^\d$/.test(e.key)) {
                handleClick(Number(e.key));
            } else {
                handleClick(e.key);
            }
            console.log(e.key);
        };

        // Add event listener when component mounts
        window.addEventListener("keydown", handleKeyDown);

        // Remove event listener when component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    const handleClick = (ch) => {
        if (Number.isInteger(ch)) {
            if (!click) {
                if (line.charAt(line.length - 1) === ")") {
                    setLine("0");
                }
                if (value.toString().includes(".")) {
                    var [integerPart, decimalPart] = value.split(".");
                    if (firstZero) {
                        decimalPart = ch;
                        setFirstZero(false);
                    } else {
                        decimalPart = decimalPart + ch;
                    }
                    setValue(integerPart + "." + decimalPart);
                } else {
                    setValue((parseInt(value * 10) + ch).toString());
                }
            } else {
                setValue(ch.toString());
                setClick(false);
            }
            setClickNumber(true);
        } else if (ch === ".") {
            if (!value.toString().includes(".")) {
                setFirstZero(true);
                setValue(value + ".0");
            }
        } else if (ch === "±") {
            setValue(-value);
        } else if (ch === "del") {
            const splitValue = value.toString().split(".");
            if (
                splitValue &&
                splitValue.length > 0 &&
                splitValue[1] &&
                splitValue[1].length === 1
            ) {
                setValue(
                    value.toString().substring(0, value.toString().length - 2)
                );
            } else if (
                value.toString().length === 1 ||
                (value.toString().length === 2 &&
                    value.toString().charAt(0) === "-")
            ) {
                setValue("0");
            } else {
                setValue(
                    value.toString().substring(0, value.toString().length - 1)
                );
            }
        } else if (ch === "clear") {
            setLine("0");
            setValue("0");
            setAns("0");
            setClickParenthesis(0);
            setSyntaxeError(false);
        } else if (ch === "ans") {
            setValue(ans1);
            setClick(true);
            setClickNumber(false);
        } else if (ch === "(") {
            if (
                line === "0" ||
                (line && line.charAt(line.length - 1) === "=")
            ) {
                if (value === "0" || !clickNumber) {
                    setLine(ch);
                } else {
                    setLine(value + "*" + ch);
                }
            } else {
                if (value === ans && !clickNumber) {
                    setLine(line + ch);
                } else {
                    setLine(line + value + "*" + ch);
                }
            }
            setClickParenthesis(clickParenthesis + 1);
            setClick(true);
        } else if (ch === ")") {
            if (clickParenthesis > 0) {
                if (line.charAt(line.length - 1) === "(") {
                    setLine(line + "0" + ch);
                } else if (line.charAt(line.length - 1) === ")") {
                    setLine(line + ch);
                } else {
                    setLine(line + value + ch);
                }
                setClickParenthesis(clickParenthesis - 1);
            }
            setClick(true);
        } else if (ch === "+" || ch === "-" || ch === "%") {
            if (line === "0") {
                setLine(value + ch);
                setAns(
                    eval(
                        (value + ch).substring(0, (value + ch).length - 1)
                    ).toString()
                );
                setValue(
                    eval(
                        (value + ch).substring(0, (value + ch).length - 1)
                    ).toString()
                );
            } else if (value === ans && !clickNumber && !line.endsWith(")")) {
                setLine(line.substring(0, line.length - 1) + ch);
            } else if (line.charAt(line.length - 1) === "=") {
                setLine(ans + ch);
            } else if (value === ans && !clickNumber && !line.endsWith(")")) {
                setLine(line.substring(0, line.length - 1) + ch);
            } else if (line.charAt(line.length - 1) === "=") {
                setLine(ans + ch);
            } else {
                if (clickParenthesis > 0) {
                    setLine(line + value + ch);
                } else if (line.charAt(line.length - 1) === ")") {
                    if (line.includes("√")) {
                        setLine(line + ch);
                        setAns(eval(line.replace("√", "Math.sqrt").toString()));
                        setValue(
                            eval(line.replace("√", "Math.sqrt").toString())
                        );
                    } else {
                        setLine(line + ch);
                        setAns(eval(line).toString());
                        setValue(eval(line).toString());
                    }
                } else {
                    if (line.includes("√")) {
                        setLine(line + value + ch);
                        setAns(
                            eval(
                                (
                                    line.replace("√", "Math.sqrt") +
                                    value +
                                    ch
                                ).substring(
                                    0,
                                    (
                                        line.replace("√", "Math.sqrt") +
                                        value +
                                        ch
                                    ).length - 1
                                )
                            ).toString()
                        );
                        setValue(
                            eval(
                                (
                                    line.replace("√", "Math.sqrt") +
                                    value +
                                    ch
                                ).substring(
                                    0,
                                    (
                                        line.replace("√", "Math.sqrt") +
                                        value +
                                        ch
                                    ).length - 1
                                )
                            ).toString()
                        );
                    } else {
                        setLine(line + value + ch);
                        setAns(
                            eval(
                                (line + value + ch).substring(
                                    0,
                                    (line + value + ch).length - 1
                                )
                            ).toString()
                        );
                        setValue(
                            eval(
                                (line + value + ch).substring(
                                    0,
                                    (line + value + ch).length - 1
                                )
                            ).toString()
                        );
                    }
                }
            }
            setClick(true);
            setClickNumber(false);
        } else if (ch === "x") {
            if (line === "0") {
                setLine(value + "*");
                setAns(
                    eval(
                        (value + "*").substring(0, (value + "*").length - 1)
                    ).toString()
                );
                setValue(
                    eval(
                        (value + "*").substring(0, (value + "*").length - 1)
                    ).toString()
                );
            } else if (value === ans && !clickNumber && !line.endsWith(")")) {
                setLine(line.substring(0, line.length - 1) + "*");
            } else if (line.charAt(line.length - 1) === "=") {
                setLine(ans + "*");
            } else {
                if (clickParenthesis > 0) {
                    setLine(line + value + "*");
                } else if (line.charAt(line.length - 1) === ")") {
                    if (line.includes("√")) {
                        setLine(line + "*");
                        setAns(eval(line.replace("√", "Math.sqrt").toString()));
                        setValue(
                            eval(line.replace("√", "Math.sqrt").toString())
                        );
                    } else {
                        setLine(line + "*");
                        setAns(eval(line).toString());
                        setValue(eval(line).toString());
                    }
                } else {
                    if (line.includes("√")) {
                        setLine(line + value + "*");
                        setAns(
                            eval(
                                (
                                    line.replace("√", "Math.sqrt") +
                                    value +
                                    "*"
                                ).substring(
                                    0,
                                    (
                                        line.replace("√", "Math.sqrt") +
                                        value +
                                        "*"
                                    ).length - 1
                                )
                            ).toString()
                        );
                        setValue(
                            eval(
                                (
                                    line.replace("√", "Math.sqrt") +
                                    value +
                                    "*"
                                ).substring(
                                    0,
                                    (
                                        line.replace("√", "Math.sqrt") +
                                        value +
                                        "*"
                                    ).length - 1
                                )
                            ).toString()
                        );
                    } else {
                        setLine(line + value + "*");
                        setAns(
                            eval(
                                (line + value + "*").substring(
                                    0,
                                    (line + value + "*").length - 1
                                )
                            ).toString()
                        );
                        setValue(
                            eval(
                                (line + value + "*").substring(
                                    0,
                                    (line + value + "*").length - 1
                                )
                            ).toString()
                        );
                    }
                }
                setClick(true);
                setClickNumber(false);
            }
        } else if (ch === "÷") {
            if (line === "0") {
                setLine(value + "/");
                setAns(
                    eval(
                        (value + "/").substring(0, (value + "/").length - 1)
                    ).toString()
                );
                setValue(
                    eval(
                        (value + "/").substring(0, (value + "/").length - 1)
                    ).toString()
                );
            } else if (value === ans && !clickNumber && !line.endsWith(")")) {
                setLine(line.substring(0, line.length - 1) + "/");
            } else if (line.charAt(line.length - 1) === "=") {
                setLine(ans + "/");
            }else{
                if(clickParenthesis>0){
                    setLine(line+value+ch)
                }else if(line.charAt(line.length-1)===')'){
                    if(line.includes("√")){
                        setLine(line+"/")
                        setAns(eval(line.replace("√", "Math.sqrt").toString()))
                        setValue(eval(line.replace("√", "Math.sqrt").toString()))
                    }else{
                        setLine(line+"/")
                        setAns(eval(line).toString())
                        setValue(eval(line).toString())
                    }
                }else{
                    if(line.includes("√")){
                        setLine(line+value+"/")
                        setAns(eval((line.replace("√", "Math.sqrt")+value+"/").substring(0,(line.replace("√", "Math.sqrt")+value+"/").length-1)).toString())
                        setValue(eval((line.replace("√", "Math.sqrt")+value+"/").substring(0,(line.replace("√", "Math.sqrt")+value+"/").length-1)).toString())
                    }else{
                        setLine(line+value+"/")
                        setAns(eval((line+value+"/").substring(0,(line+value+"/").length-1)).toString())
                        setValue(eval((line+value+"/").substring(0,(line+value+"/").length-1)).toString())
                    }
                }
            }
        }
    };

    return <div>Calc</div>;
};

export default Calc;
