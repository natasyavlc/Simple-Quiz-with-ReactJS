import React from 'react'
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router';
import Checklist from '../asset/animation/checklist.json';

//STYLE
import './EndSurvey.css'

function EndSurvey() {
  const navigate = useNavigate()

  // OPTION FOR LOTTIE
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Checklist,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  function restartSurvey() {
    localStorage.removeItem("answeredQuestion");
    navigate("/");
}


  return (
    <div className="containerEnd">
      <h2 className="title">
        You have completed this survey !
      </h2>
      <p className="subTitle">
        Thank you for your participation
      </p>

      <Lottie options={defaultOptions} height={400} width={400} />

      <button
        onClick={restartSurvey}
        className="btnRestart"
      >
        Restart
      </button>
    </div>
  )
}

export default EndSurvey