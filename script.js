document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const timerButton = document.getElementById('timer-button');
    const testButton = document.getElementById('test-button');
    const minuteButton = document.getElementById('minute-button');
    const stopButton = document.getElementById('stop-button');
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const statusMessage = document.getElementById('status-message');
    
    // Timer variables
    let countdown;
    let isRunning = false;
    let timeLeft = 3600; // 1 hour in seconds
    let alarmAudio = new Audio('assets/alarm1.wav');
    let isAlarmActive = false;
    let activeButton = null;
    
    // Update the timer display
    function updateDisplay(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        hoursDisplay.textContent = hours.toString().padStart(2, '0');
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = secs.toString().padStart(2, '0');
    }
    
    // Start the timer
    function startTimer(duration, button) {
        // If timer is already running, don't start a new one
        if (isRunning) return;
        
        timeLeft = duration;
        isRunning = true;
        activeButton = button;
        timerButton.disabled = true;
        testButton.disabled = true;
        minuteButton.disabled = true;
        statusMessage.textContent = 'Timer running...';
        
        countdown = setInterval(() => {
            timeLeft--;
            updateDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerComplete();
            }
        }, 1000);
    }
    
    // Timer complete
    function timerComplete() {
        isRunning = false;
        isAlarmActive = true;
        statusMessage.textContent = 'Timer complete! Press STOP to silence alarm.';
        
        // Play alarm sound in loop
        alarmAudio.loop = true;
        alarmAudio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
        
        // Show browser notification if supported
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Timer Complete', {
                    body: 'Your timer has finished!',
                    icon: 'https://img.icons8.com/color/48/000000/alarm-clock--v1.png'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
        }
    }
    
    // Stop the alarm and reset to starting state
    function stopAlarm() {
        // Stop any running timer
        if (isRunning) {
            clearInterval(countdown);
        }
        
        // Stop alarm if it's playing
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        
        // Reset all states
        isRunning = false;
        isAlarmActive = false;
        
        // Enable all timer buttons
        timerButton.disabled = false;
        testButton.disabled = false;
        minuteButton.disabled = false;
        
        // Reset timer display to 1 hour
        timeLeft = 3600;
        updateDisplay(timeLeft);
        statusMessage.textContent = 'Ready to start';
        activeButton = null;
    }
    
    // Event listeners
    timerButton.addEventListener('click', () => startTimer(3600, timerButton)); // 1 hour = 3600 seconds
    testButton.addEventListener('click', () => startTimer(900, testButton)); // 15 minutes = 900 seconds
    minuteButton.addEventListener('click', () => startTimer(60, minuteButton)); // 1 minute = 60 seconds
    stopButton.addEventListener('click', stopAlarm);
    
    // Initialize display
    updateDisplay(timeLeft);
});