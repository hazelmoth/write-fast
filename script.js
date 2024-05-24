const writingArea = document.getElementById('writingArea'); 
const warning = document.getElementById('warning');
const timerInput = document.getElementById('timerInput');
const startTimerButton = document.getElementById('startTimerButton');
const timerOrSetting = document.getElementById('timerOrSetting');
const timeRemainingDisplay = document.getElementById('timeRemaining');
const wordCountDisplay = document.getElementById('wordCount');
const timerSetting = document.getElementById('timerSetting');
const timerDisplay = document.getElementById('timerDisplay');

let lastTypedTime;
let typingInterval = 5000;
let warningInterval = 2000;
let countdownInterval;
let remainingTime = 0;
let timerRunning = false;
let highestCharacterCount = 0;

function updateLastTypedTime() {
    lastTypedTime = Date.now();
    warning.style.visibility = 'hidden';
}

function updateWordCount() {
    const wordCount = writingArea.value.split(/\s+/).filter(word => word.length > 0).length;
    wordCountDisplay.textContent = `Word count: ${wordCount}`;
    wordCountDisplay.classList.toggle('low', writingArea.value.length < highestCharacterCount);
}

function startTimer() {
    clearInterval(countdownInterval);
    remainingTime = parseInt(timerInput.value) * 60;
    timerSetting.classList.add('hidden');
    timerDisplay.classList.remove('hidden');
    timerDisplay.classList.add('show');
    timeRemainingDisplay.textContent = formatTime(remainingTime);
    timerRunning = true;
    highestCharacterCount = writingArea.value.length;
    updateLastTypedTime();
    countdown();
}

function countdown() {
    countdownInterval = setInterval(() => {
        remainingTime--;
        timeRemainingDisplay.textContent = formatTime(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            timerRunning = false;
            highestCharacterCount = writingArea.value.length; // Reset highest character count when time's up
            timeRemainingDisplay.textContent = "00:00";
            timerDisplay.classList.remove('show');
            timerDisplay.classList.add('hidden');
            timerSetting.classList.remove('hidden');
            warning.style.color = '#F0E68C';
            warning.textContent = "Time's up!";
            warning.style.visibility = 'visible';
            // setTimeout(() => {
            //     warning.style.visibility = 'hidden';
            // }, 3000);
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

writingArea.addEventListener('keydown', (event) => {
    const isDeleteKey = event.key === 'Delete' || event.key === 'Backspace';
    setTimeout(updateWordCount, 0);
    if (timerRunning && !isDeleteKey) {
        const currentCharacterCount = writingArea.value.length + 1;
        if (currentCharacterCount > highestCharacterCount) {
            highestCharacterCount = currentCharacterCount;
            updateLastTypedTime();
        }
    }
});

startTimerButton.addEventListener('click', startTimer);

function checkTyping() {
    const currentTime = Date.now();
    if (timerRunning) {
        if (currentTime - lastTypedTime >= typingInterval) {
            const text = writingArea.value;
            if (text.length > 0) {
                writingArea.value = text.substring(0, text.length - 3);
                highestCharacterCount = writingArea.value.length; // Reset highest character count when text is destroyed
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), 300);
            }
            updateWordCount(); // Ensure word count updates after destruction
            warning.style.color = 'red';
            warning.textContent = "Keep typing or your text will start to disappear!";
            warning.style.visibility = 'visible';
        } else if (currentTime - lastTypedTime >= warningInterval) {
            warning.style.color = 'red';
            warning.textContent = "Keep typing or your text will start to disappear!";
            warning.style.visibility = 'visible';
        } else {
            warning.style.visibility = 'hidden';
        }
    } else {
        //warning.style.visibility = 'hidden';
    }
}

updateLastTypedTime();
updateWordCount();
setInterval(checkTyping, 1000);