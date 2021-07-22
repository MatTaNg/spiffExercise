import React, { useState } from "react";
import Exercise from "../exercise/Exercise";
import './ProgressBarStyles.scss'

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution />}
        specsUrl="https://github.com/SpiffInc/spiff_react_exercises/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------

const Solution = () => {
  const [barWidth, setBarWidth] = useState(0);
  const [barOpacity, setBarOpacity] = useState(100);
  const [finishButtonClicked, setFinishButtonClicked] = useState(false);

  const INITIAL_PROGRESS_RATE = 166.66; //15s
  const STOP_AT = 90; //In %
  const FINISH_RATE = 1000 //in ms
  const FADE_BAR_TIME_DELAY = 3000 //inms

  const incrementProgressBar = (progressRate, finishProgress) => {
    const fadeBar = () => {
      const interval = setInterval(() => {
        setBarOpacity((prevState) => {
          if(prevState <= 0) {
            clearInterval(interval)
            return prevState
          }
          return prevState - 1;
        })
    }, FADE_BAR_TIME_DELAY / 100)
  }
    const currentInterval = setInterval(() => {
      setBarWidth((prevState) => {
        if(finishProgress && prevState >= 100) {
          fadeBar();
          clearInterval(currentInterval);
          return prevState
        }
        else if(!finishProgress && prevState >= STOP_AT) {
          clearInterval(currentInterval);
          return prevState
        }
        return prevState + 1
      })
    }, progressRate)
  }

  const handleOnClick = () => {
    incrementProgressBar(INITIAL_PROGRESS_RATE, false);
  }

const handleFinishClick = () => {
  setFinishButtonClicked(true)
  incrementProgressBar(FINISH_RATE / (100 - barWidth), true);
}
const progressBarStyles = {
  opacity: `${barOpacity}%`,
  backgroundImage: `linear-gradient(to right, red ${barWidth}%, orange ${barWidth}%)`
}
const finishBtnStyles = finishButtonClicked ? {border: '3px solid red'} : {}
return (
    <>
      <div style={progressBarStyles} className="progressBar"></div>
      {barWidth === 0 && <button className={'requestButton'} onClick={handleOnClick}>Start Request</button>}
      {barWidth > 0 && <button className={'loadingButton'}>Loading...</button>}
      <button style={finishBtnStyles} className={'finishButton loadingButton'} onClick={handleFinishClick}>
        Finish
      </button>
    </>
  );
};
