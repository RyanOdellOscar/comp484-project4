const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
let originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
let textToType = ["The text to type is this one.", "This is the text you need to type.", "Type this text as fast as you can!", 
                    "Can you type this text quickly?", "Try to type this text as fast as possible!"];


// Add leading zero to numbers 9 or below (purely for aesthetics):
function addLeadingZero(time) {    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}


// Run a standard minute/second/hundredths timer:
count = 0;
seconds = 0;
minutes = 0;
timer = false;
function runTimer(){
    if (timer) {
        count++;

        if (count == 100){
            count = 0;
            seconds++;
        }
        if (seconds == 60){
            seconds = 0;
            minutes++;
        }
        
        theTimer.innerHTML = addLeadingZero(minutes) + ":" + addLeadingZero(seconds) + ":" + addLeadingZero(count);
        setTimeout(runTimer, 10);
    }
}


// Match the text entered with the provided text on the page:
errors = 0;
function checkText(){
    let textEntered = testArea.value;
    let originTextMatch = originText.substring(0,textEntered.length);
    if (textEntered == originText){
        timer = false;
        testWrapper.style.borderColor = "green";
        //display words per minute
        let wordsTyped = originText.split(" ").length;
        let timeInMinutes = (minutes + seconds / 60 + count / 6000);
        let wpm = Math.round(wordsTyped / timeInMinutes);
        testArea.value += "\n\nCongratulations !\nYour WPM: " + wpm;
        //display errors
        testArea.value += "\nErrors: " + errors;
        // Save the score when the user finishes typing
        saveScore(theTimer.innerHTML);
        displayScores();
        errors = 0;
    } else {
        if (textEntered == originTextMatch){
            testWrapper.style.borderColor = "blue";
        } else {
            testWrapper.style.borderColor = "red";
            errors++;
        }
    }
}


// Start the timer:
// The timer starts when you start typing, and only stops when you match this text exactly. Good Luck!
testArea.addEventListener("keypress", function(){
    timer = true;
    runTimer();
});



// Reset everything:
function reset(){
    timer = false
    theTimer.innerHTML = "00:00:00";
    count = 0;
    seconds = 0;
    minutes = 0;
    testArea.value = "";
    testWrapper.style.borderColor = "grey";
    // Randomly select a new text to type from the array and change origin text DOM node.
    randomIndex = Math.floor(Math.random() * textToType.length);
    originText = textToType[randomIndex];
    document.querySelector("#origin-text p").innerHTML = originText;
}


// Event listeners for keyboard input and the reset button:
testArea.addEventListener("input", checkText);
resetButton.addEventListener("click", reset);

// data persistance using local storage
// - Display the **Top Three Fastest Scores** on the page.
// - These scores must persist across browser refreshes using the `localStorage` API.
// - When a user finishes typing correctly, save their score and update the list of top scores if the score is higher that one of the top three scores

function saveScore(score) {
    let timeinSeconds = (minutes * 60) + seconds + (count / 100);
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push(timeinSeconds);
    scores.sort((a, b) => a - b); // Sort scores in ascending order
    scores = scores.slice(0, 3); // Keep only the top three scores
    localStorage.setItem("scores", JSON.stringify(scores));
}

function displayScores() {
    let scoreList = document.getElementById("score-list");
    scoreList.innerHTML = ""; // Clear existing scores
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.sort((a, b) => a - b);
    scores.forEach(score => {
        let listItem = document.createElement("li");
        listItem.textContent = score;
        scoreList.appendChild(listItem);
    });
}

// Call displayScores on page load to show existing scores
window.onload = displayScores;

function clearScores() {
    localStorage.removeItem("scores");
    displayScores();
}
resetButton.addEventListener("dblclick", clearScores);