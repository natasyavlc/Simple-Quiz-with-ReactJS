import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
// DUMMY DATA
import { question } from '../DummyData/question'
// STYLE
import './Survey.css'

function Survey() {
    const navigate = useNavigate();
    // STATE
    const [number, setNumber] = useState(1);
    const [completed, setCompleted] = useState(0);
    const [width, setWidth] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
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
            setSelectedOption(event.target.value)
            if ((number - 1) !== -1) {
                const newestAnswer = answeredQuestion[number - 1] = event.target.value;
                setAnsweredQuestion([...answeredQuestion], newestAnswer)
            }
        }
    };

    function RenderListQuestion() {
        for (number; number <= question.length;) {
            return (
                <div className="cardQuestion">
                    <span className="number">Q{number}</span>
                    <p className="txtQuestion">{question[number - 1].question}</p>
                    {
                        question[number - 1].answer.map((option, index) => (
                            <label class="containerRadio" key={index}>
                                <input
                                    type="radio"
                                    value={option}
                                    checked={(answeredQuestion[number - 1] === option) || (selectedOption === option)}
                                    onChange={handleOptionChange}
                                />
                                {option}
                                <span class="checkmark"></span>
                            </label>
                        ))
                    }
                </div>
            )
        }
    }

    function RenderTimerBar() {
        const progress = question.map((data, index) => {
            if ((index + 1) == number) {
                return (
                    <div
                        key={index}
                        style={{
                            width: `${completed / (width / 10)}%`,
                            height: 10,
                            backgroundColor: '#7639bb',
                            marginBottom: 32,
                            borderRadius: 10,
                            marginRight: 8,
                            transition: 'width 1s ease-in-out',
                            animationName: ''
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
                            backgroundColor: 'gray',
                            opacity: 0.3,
                            marginBottom: 32,
                            borderRadius: 10,
                            marginRight: 8,
                        }}
                    />
                )
            }
        });
        return <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: width,
            }}>
            {progress}
        </div>
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (number < question.length) {
                setNumber(number + 1)
            } else {
                console.log('can not next', number);
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [number]);

    // useEffect(() => {
    //     const progress = setInterval(() => {
    //         if (completed < 15) {
    //             setCompleted(completed + 1)
    //         } else {
    //             console.log('can not add progress', number);
    //         }
    //     }, 1000);
    //     return () => clearInterval(progress);
    // }, [completed]);

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

    const setLocalStorage = (savedData) => {
        if (answeredQuestion) {
            window.localStorage.setItem('answeredQuestion', JSON.stringify(savedData));
        }
    }

    const getLocalStorage = () => {
        const answer = window.localStorage.getItem('answeredQuestion');
        console.log('ini isi local storage', JSON.parse(answer));
        if (JSON.parse(answer) !== null) {
            setAnsweredQuestion(JSON.parse(answer))
        } else {
            console.log('data not found');
        }
    }

    const nextQuestion = () => {
        if (number < question.length) {
            setNumber(number + 1)
            if (typeof answeredQuestion[number - 1] !== "undefined") {
                setLocalStorage(answeredQuestion)
            } else {
                const saveAnswer = answeredQuestion?.splice((number - 1), 0, String(selectedOption));
                setAnsweredQuestion([...answeredQuestion], saveAnswer)
                setLocalStorage(answeredQuestion)
                setSelectedOption('')
            }
            console.log(answeredQuestion, 'updated answer');
        } else if (number == question.length) {
            const saveAnswer = answeredQuestion?.splice((number - 1), 0, String(selectedOption));
            setAnsweredQuestion([...answeredQuestion], saveAnswer)
            setLocalStorage(answeredQuestion)
            setSelectedOption('')
        } else {
            console.log('can not next question', number);
        }
    }

    function handleClick(event) {
        event.preventDefault();
        window.location.assign('/endsurvey');
    }

    return (
        <div className='container'>
            {/* <RenderTimerBar /> */}
            <RenderListQuestion />

            <div className='rowContainer'>
                <button
                    // onClick={nextQuestion}
                    // onClick={handleClick}
                    className="btnNext"
                >
                    Restart
                </button>
                <button
                    onClick={nextQuestion}
                    // onClick={handleClick}
                    className="btnNext"
                    disabled={selectedOption == "" && answeredQuestion[number - 1] == undefined ? true : false}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Survey