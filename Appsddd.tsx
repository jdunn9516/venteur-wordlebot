import { Box, Button, CircularProgress, Container, TextField } from "@mui/material";
import Layout from "./src/components/Layout";
import Header from "./src/components/Header";
import { fetchWordleResult, WordleRequestItem } from "./src/api/api";
import { useEffect, useRef, useState } from "react";
import './App.css';

// Define the list of possible words
const wordsList = ['sport', 'apple', 'grape', 'prong', 'serai'];

// select user guess word
let wordForGuess = wordsList[1];

function App() {
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [userGuesses, setUserGuesses] = useState<string[][]>(Array(5).fill(Array(5).fill('')));
    const [gameGuess, setGameGuess] = useState<WordleRequestItem[]>([]);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [suggestions, setSuggestions] = useState('');

    useEffect(() => {
        fetchWordleResult([]).then(res => {
            setSuggestions(res.guess);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            setStatus({ type: 'error', message: err.message });
        });
    }, []);

    const handleGuessSubmit = (rowIndex: number, rowGuess: string[]) => {
        const userText = rowGuess.join('');
        const checkFeedback: string[] = [];

        for (let i = 0; i < userText.length; i++) {
            if (wordForGuess[i] === userText[i]) {
                checkFeedback.push('g');
            } else if (wordForGuess.includes(userText[i])) {
                checkFeedback.push('y');
            } else {
                checkFeedback.push('x');
            }
        }

        const newGuesses = [...userGuesses];
        newGuesses[rowIndex] = rowGuess;
        setUserGuesses(newGuesses);

        if (userText === wordForGuess) {
            setStatus({ type: 'win', message: 'Yay! You guessed the word!' });
        } else if (rowIndex === 4) {
            setStatus({ type: 'lose', message: 'Sorry, you have no more guesses left.' });
        } else {
            setGameGuess((prev) => [...prev, { word: userText, clue: checkFeedback.join('') }]);
        }
    };

    const submitHelp = () => {
        setIsFetching(true);
        fetchWordleResult([...gameGuess])
            .then(res => {
                setSuggestions(res.guess);
                setIsFetching(false);
            })
            .catch(err => {
                if (err.message === 'Invalid request: state leaves no remaining words in the dictionary') {
                    setSuggestions('');
                }
                setIsFetching(false);
                setStatus({ type: 'error', message: err.message });
            });
    }

    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                <div className="body">
                    {loading && <Box sx={{ display: 'flex' }}><CircularProgress /></Box>}
                    {!loading && (
                        <div>
                            <h1>Guess #{gameGuess.length}</h1>
                            <div className="flex item_center gap_4">
                                <h2>Word to Guess:</h2>
                                <BoxContainer word={Array(5).fill('')} text={suggestions} rowIndex={5} onSubmit={() => { }} />
                            </div>
                            <div className="box_container_main">
                                {userGuesses.map((guess, rowIndex) => (
                                    <BoxContainer
                                        key={rowIndex}
                                        word={guess}
                                        text={'tests'}
                                        rowIndex={rowIndex}
                                        onSubmit={handleGuessSubmit}
                                    />
                                ))}
                                <div className="flex item_end w_full">
                                    <Button variant="contained" disabled={loading || isFetching} onClick={submitHelp}>
                                        {isFetching ? <CircularProgress size={25} /> : 'Submit'}
                                    </Button>
                                </div>
                            </div>
                            {status.type === 'error' && <p className="error">Error: {status.message}</p>}
                            {status.type === 'win' && <p className="win">{status.message}</p>}
                            {status.type === 'lose' && <p className="lose">{status.message}</p>}
                        </div>
                    )}
                </div>
            </Container>
        </Layout>
    );
}

export default App;



const BoxContainer = ({ word, text, rowIndex, onSubmit }: { word: string[], text: string, rowIndex: number, onSubmit: (rowIndex: number, rowGuess: string[]) => void }) => {
    const [inputs, setInputs] = useState<string[]>(word);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        setInputs(word);
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

    return (
        <div className="box_container">
            {inputs.map((input, index) => (
                <TextField
                    key={index}
                    value={input}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e: any) => handleKeyDown(index, e)}
                    inputProps={{ maxLength: 1 }}
                    variant="outlined"
                    style={{ width: 40, marginRight: 4 }}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    disabled={rowIndex !== 0 && inputs.some(val => val === '')}
                />
            ))}
        </div>
    );
};