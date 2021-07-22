import React, { useState, useRef } from "react";
import Exercise from "../exercise/Exercise";
import './ProgressBarStyles.scss'

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution breakpoints={[25, 50, 75]} />}
        specsUrl="https://github.com/SpiffInc/spiff_react_exercises/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------

const Solution = (props) => {
  const [barWidth, setBarWidth] = useState(0);
  const [barOpacity, setBarOpacity] = useState(100);
  const [finishButtonClicked, setFinishButtonClicked] = useState(false);
  const [ignoreBreakpoints, setIgnoreBreakpoints] = useState(false);

  const intervalRef = useRef();

  const INITIAL_PROGRESS_RATE = 166.66; //15s
  const STOP_AT = 90; //In %
  const FINISH_RATE = 1000 //in ms
  const FADE_BAR_TIME_DELAY = 3000 //inms

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

  const incrementProgressBar = (progressRate, finishProgress, ignoreBreakpoints) => {
    const interval = setInterval(() => {
      intervalRef.current = interval
      setBarWidth((prevState) => {
        const isBarNearBreakpoint = props.breakpoints.some((breakpoint) => {
          return prevState <= breakpoint + 5 && prevState >= breakpoint - 5
        })
          if(finishProgress && prevState >= 100) {
            fadeBar();
            clearInterval(intervalRef.current);
            return prevState
          }
          else if(!finishProgress && !ignoreBreakpoints && isBarNearBreakpoint) {
            return prevState + 0.5;
          }
          else if(!finishProgress && prevState >= STOP_AT) {
            clearInterval(intervalRef.current);
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
  clearInterval(intervalRef.current)
  setFinishButtonClicked(true)
  incrementProgressBar(FINISH_RATE / (100 - barWidth), true);
}
const handleIgnoreBreakpoints = () => {
  clearInterval(intervalRef.current)
  incrementProgressBar(INITIAL_PROGRESS_RATE, false, !ignoreBreakpoints)
  setIgnoreBreakpoints(!ignoreBreakpoints);
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
      <button className={'requestButton'} onClick={handleIgnoreBreakpoints}>{ignoreBreakpoints ? 'Allow' : 'Ignore'} Breakpoints</button>
      <button style={finishBtnStyles} className={'finishButton loadingButton'} onClick={handleFinishClick}>
        Finish
      </button>
    </>
  );
};
