const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const clearBtn = document.getElementById('clear-btn');
const downloadBtn = document.getElementById('download-btn');
const playBtn = document.getElementById('play-btn'); // New Play Button
const result = document.getElementById('result');
const statusDisplay = document.getElementById('status');
const languageSelect = document.getElementById('language-select');

let recognition;
let lastTranscript = ''; // Variable to store the last recognized speech

// Check if browser supports Web Speech API
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Set to true for continuous listening
    recognition.interimResults = false;

    // Set default language
    recognition.lang = languageSelect.value;

    startBtn.addEventListener('click', () => {
        recognition.lang = languageSelect.value; // Update language based on user selection
        recognition.start();
        statusDisplay.textContent = 'Listening...';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    });

    stopBtn.addEventListener('click', () => {
        recognition.stop();
        statusDisplay.textContent = 'Stopped recording.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    recognition.onresult = function (event) {
        const transcript = event.results[event.resultIndex][0].transcript;
        lastTranscript = transcript; // Store the last transcript
        result.textContent = 'You said: ' + transcript;
        downloadBtn.disabled = false; // Enable download button after result
        playBtn.disabled = false; // Enable play button after result
    };

    recognition.onerror = function (event) {
        statusDisplay.textContent = 'Error occurred: ' + event.error;
    };

    recognition.onend = function () {
        statusDisplay.textContent = 'Recording stopped.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
} else {
    statusDisplay.textContent = 'Speech Recognition API not supported in this browser.';
}

// Clear result functionality
clearBtn.addEventListener('click', () => {
    result.textContent = ''; // Clear the recognized text
    downloadBtn.disabled = true; // Disable the download button
    playBtn.disabled = true; // Disable the play button
});

// Download transcription
downloadBtn.addEventListener('click', () => {
    const blob = new Blob([result.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt'; // Specify the name of the downloaded file
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
});

// Play back the last recognized speech
playBtn.addEventListener('click', () => {
    const speech = new SpeechSynthesisUtterance(lastTranscript); // Create a SpeechSynthesisUtterance
    window.speechSynthesis.speak(speech); // Speak the last transcript
});
