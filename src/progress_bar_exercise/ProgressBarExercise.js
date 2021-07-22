import React, { useState, useRef, useEffect } from "react";
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
  const [timer, setTimer] = useState(0);
  
  const intervalRef = useRef();
  const initialTimer = useRef() 

  const INITIAL_PROGRESS_RATE = 166.66; //15s
  const STOP_AT = 90; //In %
  const FINISH_RATE = 1000 //in ms
  const FADE_BAR_TIME_DELAY = 3000 //inms

  useEffect(() => {
    if(barWidth > 0 && !initialTimer.current) {
      initialTimer.current = new Date().getTime();
    }
    if(barWidth > 0) {
      setTimer((new Date().getTime() - initialTimer.current) / 1000 || 0)
    }
  }, [barWidth])

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

const shouldBarSlowDown = (barWidth, ignoreBreakpoints, finishProgress) => !finishProgress && !ignoreBreakpoints && props.breakpoints.some((breakpoint) => {
  return barWidth <= breakpoint + 5 && barWidth >= breakpoint - 5
})
const shouldBarStop = (barWidth, finishProgress) => !finishProgress && barWidth >= STOP_AT;

  const incrementProgressBar = (progressRate, finishProgress, ignoreBreakpoints) => {
    const interval = setInterval(() => {
      intervalRef.current = interval
      setBarWidth((prevState) => {
          if(prevState >= 100) {
            fadeBar();
            clearInterval(intervalRef.current);
            return prevState
          }
          else if(shouldBarSlowDown(prevState, ignoreBreakpoints, finishProgress)) {
            return prevState + 0.5;
          }
          else if(shouldBarStop(prevState, finishProgress)) {
            clearInterval(intervalRef.current);
            return prevState
          }
          return prevState + 1
      })
    }, progressRate)
  }

  const handleOnClick = () => {
    incrementProgressBar(INITIAL_PROGRESS_RATE, false, ignoreBreakpoints);
  }

const handleFinishClick = () => {
  clearInterval(intervalRef.current)
  setFinishButtonClicked(true)
  incrementProgressBar(FINISH_RATE / (100 - barWidth), true);
}
const handleIgnoreBreakpoints = () => {
  clearInterval(intervalRef.current)
  intervalRef.current && incrementProgressBar(INITIAL_PROGRESS_RATE, false, !ignoreBreakpoints)
  setIgnoreBreakpoints(!ignoreBreakpoints);
}

const barColor = shouldBarSlowDown(barWidth, ignoreBreakpoints, finishButtonClicked) ? 'black' : 'red';
const progressBarStyles = {
  opacity: `${barOpacity}%`,
  backgroundImage: `linear-gradient(to right, ${barColor} ${barWidth}%, orange ${barWidth}%)`
}
const finishBtnStyles = finishButtonClicked ? {border: '3px solid red'} : {}

const renderProgressBar = () => {
  return <> 
    <div style={{opacity: `${barOpacity}%`}}>{timer}</div>
    <div style={progressBarStyles} className="progressBar"></div>
  </>
}

const renderStartButton = () => {
  return <>
    {barWidth === 0 && <button className={'requestButton'} onClick={handleOnClick}>Start Request</button>}
    {barWidth > 0 && <button className={'loadingButton'}>Loading...</button>}
  </>
}
const renderBreakpointButton = () => <button className={'requestButton'} onClick={handleIgnoreBreakpoints}>{ignoreBreakpoints ? 'Allow' : 'Ignore'} Breakpoints</button>
const renderFinishButton = () => (
  <button style={finishBtnStyles} className={'finishButton loadingButton'} onClick={handleFinishClick}>
  Finish
  </button>
)
return (
    <>
      {renderProgressBar()}
      {renderStartButton()}
      {renderBreakpointButton()}
      {renderFinishButton()}
    </>
  );
};
