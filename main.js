import {quizObject} from "/question-data/questions.js"    
    
    async function fetchJsonData(json_path) {
    try {
        const response = await fetch(json_path)
        const jsonObject = await response.json()
        return jsonObject
    }
    catch(error) {
        console.error("Error fetching JSON:", error)
        return null
    }
}

const jsonObject = await fetchJsonData("question-data/data.json")

const QUIZ = new quizObject(jsonObject)


const quizBody = document.getElementById("quiz-body")

quizBody.appendChild(QUIZ.generateHTML(QUIZ.questions.getRandom()))

