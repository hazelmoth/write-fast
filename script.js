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
let typingInterval = 9000;
let warningInterval = 4000;
let countdownInterval;
let remainingTime = 0;
let timerRunning = false;
let highestCharacterCount = 0;

function updateLastTypedTime() {
    lastTypedTime = Date.now();
    warning.style.opacity = 0;
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
            warning.classList.remove('timeWarning');
            warning.textContent = "Time's up!";
            warning.style.opacity = 1;
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

writingArea.addEventListener('keydown', (event) => {
    // Capture tabs
    if (event.key === 'Tab') {
        event.preventDefault();
        const tabStart = writingArea.selectionStart;
        const text = writingArea.value;
        writingArea.value = text.substring(0, tabStart) + '\t' + text.substring(tabStart);
        writingArea.selectionStart = writingArea.selectionEnd = tabStart + 4;
    }

    setTimeout(handleTextChange, 0);
});

function handleTextChange() {
    const characterCount = writingArea.value.length;
    if (characterCount > highestCharacterCount) {
        highestCharacterCount = characterCount;
        updateLastTypedTime();
    }

    updateWordCount();
}

startTimerButton.addEventListener('click', startTimer);

function checkTyping() {
    const currentTime = Date.now();
    if (timerRunning) {
        if (currentTime - lastTypedTime >= typingInterval) {
            const text = writingArea.value;
            if (text.length > 0) {
                writingArea.value = text.substring(0, text.length - 3);
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), 300);
            }
            highestCharacterCount = writingArea.value.length; // Reset highest character count when text is destroyed
            updateWordCount(); // Ensure word count updates after destruction
            warning.classList.add('timeWarning');
            warning.textContent = "Keep typing or your text will start to disappear!";
            warning.style.opacity = 1;
        } else if (currentTime - lastTypedTime >= warningInterval) {
            warning.classList.add('timeWarning');
            warning.textContent = "Keep typing or your text will start to disappear!";
            warning.style.opacity = 1;
        } else {
            warning.style.opacity = 0;
        }
    } else {
    }
}

updateLastTypedTime();
updateWordCount();
setInterval(checkTyping, 1000);