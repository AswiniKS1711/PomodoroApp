const timer=document.querySelector('.timer');
const title=document.querySelector('.title');
const startBtn=document.querySelector('.startBtn');
const pauseBtn=document.querySelector('.pauseBtn');
const resumeBtn=document.querySelector('.resumeBtn');
const resetBtn=document.querySelector('.resetBtn');
const pomoCountsDisplay=document.querySelector('.pomoCountsDisplay');


//Maing variables
const WORK_TIME = 25 * 60;  // this will have time period in seconds now
const BREAK_TIME = 5 * 60;
let timerID=null;
let oneRoundCompleted = false;  // one round = work time + break time = 30 minutes
let totalCount = 0;
let paused=false;


// Function to update title
const updateTitle = (msg) => {
    title.textContent = msg;
}


// Function to save pomodoro count to LOCAL STOARGE
const saveLocalCounts = () => {
    let counts = JSON.parse(localStorage.getItem("pomoCounts"));

    counts !== null ? counts++ : counts=1;

    localStorage.setItem("pomoCounts", JSON.stringify(counts));
}


// Arrow Function to countdown
const countDown = (time) => {
    
    
    return () => {

        const mins = Math.floor(time/60).toString().padStart(2, '0');
        const secs = Math.floor(time % 60).toString().padStart(2, '0');;
        
        // timer.textContent=time;
        timer.textContent = `${mins}:${secs}`;
        time--;

        if(time < 0)
        {
            stopTimer();
            // As soon as 25 minutes end, start the break timer
            // and start the break time only when one round is not completed
            if(!oneRoundCompleted)
            {
                timerID = startTimer(BREAK_TIME);
                oneRoundCompleted=true;
                updateTitle("It's Break Time!");
            }
            else
            {
                updateTitle("Completed 1 round of Pomodoro!");
                setTimeout(() => updateTitle("Start Timer Again"), 3000);
                totalCount++;
                saveLocalCounts();
                // console.log(totalCount);
                showPomoCounts();
            }
        }
    }
}

// Arrow Function to start the timer
const startTimer = (startTime) => {
    if(timerID != null)
    {
        stopTimer();
    }
    return setInterval(countDown(startTime), 1000);
}

//Arrow function to stop timer
const stopTimer = () => {
    clearInterval(timerID);
    timerID = null;
}

//Arrow function to get time in seconds
const getTimeInSeconds = (timeString) => {

    //array-destructuring concept used
    const[minutes, seconds] = timeString.split(":");

    return parseInt(minutes*60) + parseInt(seconds);
}


// Adding event listener to start button
startBtn.addEventListener('click', ()=>{
    timerID = startTimer(WORK_TIME);
    updateTitle("It's Work Time!");
});


//Adding event listener to reset button
resetBtn.addEventListener('click', ()=>{
    stopTimer();
    timer.textContent = "25:00";
    updateTitle("Click Start to start timer");
});


//Adding event listener to pause button
pauseBtn.addEventListener('click', ()=>{
    stopTimer();
    paused=true;
    updateTitle("Timer Paused!")
});


//Adding event listener to resume button
resumeBtn.addEventListener('click', ()=>{
    
    if(paused)
    {
        const currentTime = getTimeInSeconds(timer.textContent);
        timerID = startTimer(currentTime);
        paused=false;
        (!oneRoundCompleted) ? updateTitle("It's Work Time!") : updateTitle("It's Break Time!")
    }
    
});


// Function to show completed pomo counts from local storage
const showPomoCounts = () => {
    const counts = JSON.parse(localStorage.getItem("pomoCounts"));
    if(counts > 0)
    {
        pomoCountsDisplay.style.display = "flex";
    }

    //first element child will be the span  element here
    pomoCountsDisplay.firstElementChild.textContent = counts;
}

showPomoCounts();


