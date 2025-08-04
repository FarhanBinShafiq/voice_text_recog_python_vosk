const questions = [
    { text: "Which fruit is red?", options: ["apple", "banana", "orange", "grape"], correct: "apple" },
    { text: "Which fruit is yellow and curved?", options: ["banana", "apple", "mango", "pear"], correct: "banana" },
    { text: "Which fruit is orange in color?", options: ["orange", "grape", "kiwi", "apple"], correct: "orange" },
    { text: "Which fruit is used in pies?", options: ["apple", "banana", "pineapple", "mango"], correct: "apple" },
    { text: "Which fruit grows in bunches?", options: ["banana", "orange", "pear", "kiwi"], correct: "banana" }
];
let currentQuestion = 0;
let score = 0;

function updateQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('question').textContent = `Question ${currentQuestion + 1}: ${q.text}`;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = q.options.map(opt =>
        `<button onclick="selectAnswer('${opt}')">${opt.charAt(0).toUpperCase() + opt.slice(1)}</button>`
    ).join('');
    document.getElementById('result').textContent = '';
    document.getElementById('score').textContent = `Score: ${score}/${questions.length}`;
}

function startRecognition() {
    const micButton = document.getElementById('mic');
    micButton.textContent = '🎤 Listening...';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        micButton.textContent = '🎤 Speak';
        alert("Speech recognition not supported in this browser");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        micButton.textContent = '🎤 Speak';
        onVoiceResult(text);
    };
    recognition.onerror = (event) => {
        micButton.textContent = '🎤 Speak';
        console.error("Speech recognition error: " + event.error);
        alert("Error during speech recognition. Try again.");
    };
    recognition.onend = () => {
        micButton.textContent = '🎤 Speak';
    };

    recognition.start();
}

function selectAnswer(answer) {
    const q = questions[currentQuestion];
    document.querySelectorAll('#options button').forEach(btn => btn.classList.remove('selected'));
    const selectedButton = Array.from(document.querySelectorAll('#options button'))
        .find(btn => btn.textContent.toLowerCase() === answer);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
    const result = document.getElementById('result');
    if (q.options.includes(answer)) {
        if (answer === q.correct) {
            score++;
            result.textContent = "Correct!";
        } else {
            result.textContent = "Wrong";
        }
    } else {
        alert("No choice here");
        result.textContent = "";
    }
    document.getElementById('score').textContent = `Score: ${score}/${questions.length}`;
    currentQuestion++;
    if (currentQuestion < questions.length) {
        setTimeout(updateQuestion, 1000);
    } else {
        setTimeout(() => {
            result.textContent = `Quiz complete! Final score: ${score}/${questions.length}`;
            document.getElementById('mic').disabled = true;
        }, 1000);
    }
}

function onVoiceResult(text) {
    if (!text) {
        alert("No choice here");
        return;
    }
    selectAnswer(text);
}

updateQuestion();