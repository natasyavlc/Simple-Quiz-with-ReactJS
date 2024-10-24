/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Progress } from "@material-tailwind/react";
// DUMMY DATA
import { question } from '../DummyData/question'
// STYLE
import './Survey.css'

function Survey() {
    const navigate = useNavigate();
    const questionTimer = 15
    // STATE
    const [number, setNumber] = useState(() => {
        const getAnswer = window.localStorage.getItem('answeredQuestion');
        const parsing = JSON.parse(getAnswer)
        return getAnswer !== null
            ? parsing.length + 1
            : 1;
    });
    // const [number, setNumber] = useState(1)
    const [completed, setCompleted] = useState(1);
    const [width, setWidth] = useState(0);
    const [selectedOption, setSelectedOption] = useState(() => {
        const getTempAnswer = window.localStorage.getItem('tempAnswer');
        return getTempAnswer !== null
            ? JSON.parse(getTempAnswer)
            : '';
    });
    // const [selectedOption, setSelectedOption] = useState('');
    const [answeredQuestion, setAnsweredQuestion] = useState(() => {
        const getAnswer = window.localStorage.getItem('answeredQuestion');
        return getAnswer !== null
            ? JSON.parse(getAnswer)
            : [];
    });

    const handleOptionChange = (event) => {
        if (typeof answeredQuestion[number - 1] == "undefined") {
            setSelectedOption(event.target.value);
        } else {
            setSelectedOption(event.target.value);
            if ((number - 1) !== -1) {
                const newestAnswer = answeredQuestion[number - 1] = event.target.value;
                setAnsweredQuestion([...answeredQuestion], newestAnswer)
            }
        }
        setTempAnswer(event.target.value);
    };

    function RenderListQuestion() {
        for (number; number <= question.length;) {
            return (
                <div className="cardQuestion">
                    <span className="number">Q{number}</span>
                    <p className="txtQuestion">{question[number - 1].question}</p>
                    {
                        question[number - 1].answer.map((option, index) => (
                            <label className="containerRadio" key={index}>
                                <input
                                    type="radio"
                                    value={option}
                                    checked={(answeredQuestion[number - 1] === option) || (selectedOption === option)}
                                    onChange={handleOptionChange}
                                />
                                {option}
                                <span className="checkmark"></span>
                            </label>
                        ))
                    }
                </div>
            )
        }
    }

    function RenderTimerBar() {
        const progress = question.map((data, index) => {
            if ((index + 1) === number) {
                return (
                    <div 
                        className="w-full bg-gray-200 rounded-full h-4"
                        style={{
                            width: width / question.length,
                            height: 10,
                            backgroundColor: 'white',
                            marginBottom: 32,
                            borderRadius: 10,
                            marginRight: 8
                        }}>
                        <div 
                            className="bg-blue-600 h-4 rounded-full" 
                            style={{ 
                                backgroundColor: 'purple', 
                                height: 10,  
                                width: 100 / questionTimer * (completed) 
                            }} 
                        />
                    </div>
                )
            } else if ((index + 1) < number) {
                return (
                    <div
                        key={index}
                        className="nonActiveBar"
                        style={{
                            width: width / question.length,
                            height: 10,
                            backgroundColor: '#7639bb',
                            opacity: 0.3,
                            marginBottom: 32,
                            borderRadius: 10,
                            marginRight: 12
                        }}
                    />
                )
            } else {
                return (
                    <div
                        key={index}
                        style={{
                            width: width / question.length,
                            height: 10,
                            backgroundColor: 'grey',
                            opacity: 0.3,
                            marginBottom: 32,
                            borderRadius: 10,
                            marginRight: 12
                        }}
                    />
                )
            }
        });
        return (
            <div
                className="timerWrapper"
                style={{ width: width - (64 * 2) }}
            >
                {progress}
            </div>
        )
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (number < question.length) {
                setNumber(number + 1)
                setCompleted(1)
            } else {
                navigate('/endsurvey')
                console.log('can not next', number);
            }
        }, questionTimer * 1000);
        return () => clearInterval(interval);
    }, [number]);

    useEffect(() => {
        const progress = setInterval(() => {
            if (completed < 14) {
                setCompleted(completed + 1)
            } else if (completed === 14 && !selectedOption) {
                if (number == question.length) {
                    saveAnswerToStorage(number, '')
                    finishSurvey()
                } else {
                    saveAnswerToStorage(number, '')
                }
            } else if (completed === 14 && selectedOption !== '') {
                setSelectedOption('')
                saveAnswerToStorage(number, '')
            } else {
                finishSurvey()
                console.log('can not add progress', number);
            }
        }, 1000);
        return () => clearInterval(progress);
    }, [completed]);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [setWidth])

    useEffect(() => {
        window.addEventListener("beforeunload", getLocalStorage());
        console.log('refresh page');
        return () => {
            window.removeEventListener("beforeunload", getLocalStorage());
        };
    }, []);

    function saveAnswerToStorage(index, data) {
        const saveAnswer = answeredQuestion?.splice((index - 1), 0, data);
        setAnsweredQuestion([...answeredQuestion], saveAnswer)
        setLocalStorage(answeredQuestion)
    }

    function setTempAnswer(data) {
        window.localStorage.setItem('tempAnswer', JSON.stringify(data));
    }

    const setLocalStorage = (savedData) => {
        if (answeredQuestion) {
            window.localStorage.setItem('answeredQuestion', JSON.stringify(savedData));
        }
    }

    const getLocalStorage = () => {
        const answer = window.localStorage.getItem('answeredQuestion');
        if (JSON.parse(answer) !== null) {
            setAnsweredQuestion(JSON.parse(answer))
        } else {
            console.log('data not found');
        }
    }

    const nextQuestion = () => {
        window.localStorage.removeItem("tempAnswer");
        if (number < question.length) {
            setNumber(number + 1)
            setCompleted(1)
            if (typeof answeredQuestion[number - 1] !== "undefined") {
                setLocalStorage(answeredQuestion)
                setSelectedOption('')
            } else {
                saveAnswerToStorage(number, String(selectedOption))
                setSelectedOption('')
            }
        } else if (number == question.length) {
            saveAnswerToStorage(number, String(selectedOption))
            setSelectedOption('')
            finishSurvey()
        } else {
            console.log('can not next question', number);
        }
    }

    function finishSurvey() {
        navigate("/endsurvey");
    }

    return (
        <div className='containerSurvey'>
            <RenderTimerBar />
            <RenderListQuestion />

            <div className='rowContainer'>
                <button
                    onClick={nextQuestion}
                    className="btnNext"
                    disabled={!selectedOption && !answeredQuestion[number - 1] ? true : false}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Survey