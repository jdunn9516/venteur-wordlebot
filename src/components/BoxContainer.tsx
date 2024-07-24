import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const BoxContainer = ({ word, rowIndex, onSubmit, userCurrentState, wordForGuess }: { word: string[], rowIndex: number, onSubmit: (rowIndex: number, rowGuess: string[]) => void, userCurrentState: number, wordForGuess: string }) => {
    const [inputs, setInputs] = useState<string[]>(word);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (word?.[0]) {
            setInputs(word);
        } else {
            setInputs(['', '', '', '', ''])
        }
    }, [word]);

    const handleChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);

        if (value.length === 1 && index < inputs.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && inputs[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            const allFilled = inputs.every(input => input !== '');
            if (index === 4 && allFilled) {
                onSubmit(rowIndex, inputs);
            }
        }
    };

    const getColor = (index: number, input: string) => {
        if (!word?.[0]) {
            return 'white';
        }
        if (rowIndex > 5) {
            return 'white';
        }
        if (inputs[index] === wordForGuess[index]) {
            return 'green';
        }
        if (wordForGuess.includes(input)) {
            return 'yellow';
        }
        return 'white';
    }

    return (
        <div className="box_container" title="Press enter key to check your guess!">
            {inputs.map((input, index) => (
                <TextField
                    key={index}
                    value={input}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e: any) => handleKeyDown(index, e)}
                    inputProps={{ maxLength: 1 }}
                    variant="outlined"
                    style={{
                        width: 40,
                        marginRight: 4,
                        borderRadius: '4px',
                        backgroundColor: getColor(index, input),
                    }}
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                            textTransform: 'uppercase'
                        },
                        "& .MuiInputBase-input": {
                            WebkitTextFillColor: "#000000",
                            textTransform: 'uppercase',
                            border: 'none',
                            outline: 'none'
                        },
                    }}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    disabled={rowIndex > 5 ? true : rowIndex !== userCurrentState ? true : false}
                />
            ))}
        </div>
    );
};

export default BoxContainer
