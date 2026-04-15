// function to load the quizzes
async function loadQuiz(filename) {
    // Reaches out to the specific json file selected
    const response = await fetch(filename);
    const data = await response.json();
    
    // Your JSON files have the questions inside a "questions" array, so we return that
    return data.questions; 
}

// Function to show a barebones topic selector
async function topicSelector() {
    // Create the container for the selector
    const selectorDiv = document.createElement('div');
    selectorDiv.style.textAlign = 'center';
    selectorDiv.style.margin = '20px';

    const select = document.createElement('select');

    // Default placeholder
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "-- Select a Quiz Topic --";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Array of your JSON files
    const topics = [
        { name: "Math", file: "math.json" },
        { name: "Science", file: "science.json" },
        { name: "History", file: "history.json" }
    ];

    // Loop through topics and add them to the dropdown
    topics.forEach(t => {
        const option = document.createElement('option');
        option.value = t.file;
        option.textContent = t.name;
        select.appendChild(option);
    });

    selectorDiv.appendChild(select);

    // Listen for when the user picks a topic
    select.addEventListener('change', async (e) => {
        const selectedFile = e.target.value;
        
        // Fetch the data and overwrite the global quizData variable
        quizData = await loadQuiz(selectedFile);
        
        // Restart the quiz with the new data
        initQuiz();
    });

    // Add selector to the top of the page
    document.body.prepend(selectorDiv);
}

// Run on start
topicSelector();


// written by Johnathan

// review page javascript example
const container = document.getElementById("review-container");

// Load saved quizzes
const pastResults = JSON.parse(localStorage.getItem("quizResults")) || [];

if (pastResults.length === 0) {
    container.innerHTML = "<p>No past quizzes yet.</p>";
} else {
    pastResults.forEach((quiz, index) => {
        const quizDiv = document.createElement("div");
        quizDiv.classList.add("review-quiz");

        quizDiv.innerHTML = `
            <h3>${quiz.topic} - ${quiz.date}</h3>
        `;

        quiz.questions.forEach(q => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("review-question");

            const isCorrect = q.userAnswer === q.correctAnswer;

            questionDiv.innerHTML = `
                <p><strong>${q.question}</strong></p>
                <p>Your answer: 
                    <span class="${isCorrect ? 'correct' : 'incorrect'}">
                        ${q.choices[q.userAnswer]}
                    </span>
                </p>
                ${!isCorrect ? `
                    <p>Correct answer: 
                        <span class="correct">
                            ${q.choices[q.correctAnswer]}
                        </span>
                    </p>
                ` : ""}
            `;

            quizDiv.appendChild(questionDiv);
        });

        container.appendChild(quizDiv);
    });
}
