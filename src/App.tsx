import React from 'react'
import './App.css';
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Header from "./components/Header";
import { Box, Button, CircularProgress, Container } from '@mui/material';
import { fetchWordleResult } from './api/api';
import BoxContainer from './components/BoxContainer';
import { getRandomWord } from './lib/helper';

const wordsList = ['sport', 'apple', 'grape', 'prong', 'serai'];

const App = () => {
    const [wordForGuess, setWordForGuess] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [suggestions, setSuggestions] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [userGuessInput, setUserGuessInput] = useState(['', '', '', '', '', '']);
    const [userCurrentState, setUserCurrentState] = useState(0);
    const [userCurrentStateShow, setUserCurrentStateShow] = useState(1);

    useEffect(() => {
        setWordForGuess(getRandomWord(wordsList))
        fetchWordleResult([]).then(res => {
            setSuggestions(res.guess);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            setStatus({ type: 'error', message: err.message });
        });
    }, []);


    const handleGuessSubmit = (rowIndex: number, rowGuess: string[]) => {
        const userGuess = rowGuess.join('');
        if (wordForGuess === userGuess) {
            setStatus({ type: 'win', message: 'Yay! You guessed the word!' });
            setUserCurrentState(9)
        } else if (rowIndex === 5) {
            setStatus({ type: 'lose', message: 'Sorry, you have no more guesses left.' });
            setUserCurrentState(9)
        }
        setUserCurrentState(old => old + 1);
        setUserCurrentStateShow(old => old + 1);
        const data = [...userGuessInput];
        data[rowIndex] = userGuess;
        setUserGuessInput(data);
    }

    const submitHelp = () => {
        const userText = !!userGuessInput[userCurrentState - 1] ? userGuessInput[userCurrentState - 1] : 'empty';
        setIsFetching(true);
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
        /* istanbul ignore next */
        fetchWordleResult([{ word: wordForGuess, clue: checkFeedback.join('') }])
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
                            <h1>Guess #{userCurrentStateShow}</h1>
                            <div className="flex item_center gap_4">
                                <h2>Word to Guess:</h2>
                                <BoxContainer word={suggestions.split('')} rowIndex={6} onSubmit={() => { }} userCurrentState={0} wordForGuess={wordForGuess} />
                            </div>
                            <div className="box_container_main">
                                <h2>What response did you get back?</h2>
                                <p>Press the 'Enter' key after inputting your word guess to check it!</p>
                                {userGuessInput.map((guess, rowIndex) => (
                                    <BoxContainer
                                        key={rowIndex}
                                        word={guess.split('')}
                                        rowIndex={rowIndex}
                                        onSubmit={handleGuessSubmit}
                                        userCurrentState={userCurrentState}
                                        wordForGuess={wordForGuess}
                                    />
                                ))}
                                <div className="flex item_end w_full">
                                    <Button data-testid={'submit'} variant="contained" disabled={loading || isFetching || userCurrentState > 6} onClick={submitHelp}>
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
    )
}

export default App



