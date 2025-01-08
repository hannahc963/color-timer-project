import React, { useState, useEffect } from 'react';

const Timer = ({duration, colors}) => {
  const [time, setTime] = useState(duration); //time remaining, default is duration passed in
  const [running, setRunning] = useState(false); //default not running
  const [colorIndex, setColorIndex] = useState(0); //default color index 0

  const interval = Math.floor(duration/colors.length); //calculating time interval between switching colors

  useEffect(() => { //if duration or colors changes
    setTime(duration); //resets time
    setColorIndex(0); //resets color index
    document.body.style.backgroundColor = colors[0]; //sets bg color to beginning
  }, [duration, colors]);

  useEffect(() => { //if running, interval, or duration changes
    let timer; 
    if (running && time > 0) { //if running with time left
      timer = setInterval(() => { //interval that runs every 1000 milliseconds
        setTime(prevTime => { //passes in previous time state 
          const newTime = prevTime - 1; //decreasing time left by 1
          if (newTime >= 0) { //if time remaining
            const newColorIndex = Math.floor((duration-newTime)/interval)% colors.length; //calculate what color should be displayed based on time
            setColorIndex(newColorIndex);
          }
          if (newTime === 0) { //if out of time
            setRunning(false); //stops running
            setTimeout(() => alert("Time's up!"), 0); //delays alert until timer is stopped
            resetTimer(); //timer is reset
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer); //cleanup function
  }, [running, interval, duration]);

  useEffect(() => { //when colorIndex or colors array changes, bg color is changed
    document.body.style.backgroundColor = colors[colorIndex]; 
  }, [colorIndex, colors]);

  const startTimer = () => {
    setRunning(true);
  };

  const pauseTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => { 
    setRunning(false);
    setTime(duration); //reset time remaining
    setColorIndex(0); //back to first index
    document.body.style.backgroundColor = colors[0]; //changing bg color to first color
  };

  const minutes = Math.floor(time/ 60);
  const seconds = time% 60;

  return(
    <div>
      <h2 className='time'>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
      <button className="main-button" onClick={startTimer}>Start</button>
      <button className="main-button" onClick={pauseTimer}>Pause</button>
      <button className="main-button" onClick={resetTimer}>Reset</button>
    </div>
  );
};

export default Timer;
