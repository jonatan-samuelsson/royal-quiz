

export class quizObject {

    quizData
    questions
    container
    currentRun
    

    constructor(jsonObject) {
        this.quizData = jsonObject
        this.container = document.getElementById("quiz_body")
        this.clearContainer()

    }

    run = (
        type
    ) => {
        this.setupQuestions()
        const _run = {
            type,
            "score": 0,
            "nextQuestion": () => {
                this.clearContainer()
                this.displayQuestion(this.questions.getRandom())
            }
        }
        return _run
    }

    newRun(type="practice") {
        this.container.classList.remove("hidden")
        this.currentRun = this.run(type)
        this.currentRun.nextQuestion()
    }
    setupQuestions() {
        this.questions = new questionsArray()
        this.setupListOfRulersQuestions(this.quizData.rulers)
    }

    clearContainer() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.lastChild)
        }
    }

    setupListOfRulersQuestions(rulers) {

        rulers.forEach(ruler => {
            const image = "/question-data/ruler-imgs/" + ruler.no.toString() + ".jpg"
           
            this.questions.add(
                `När regerade ${ruler.name}?`,
                "dateRange",
                [ruler.year_start, ruler.year_end],
                "",
                image 
            )
            this.questions.add(
                `Vilket år inleddes ${ruler.name}s regenttid?`,
                "year",
                ruler.year_start,
                "",
                image
            )
            if (ruler.no != 23) {
                this.questions.add(
                    `Vilket år slutade ${ruler.name}s regenttid?`,
                    "year",
                    ruler.year_end,
                    "",
                    image 
                )
            }
        })
    }

   
    displayQuestion(question) {
        this.container.appendChild(this.generateHTML(question))
    }

    generateHTML(question) {
       
        const questionBox = this.elementMaker("article", ["question_box"], "question_box", "question_box")
        

        const imageBox = this.elementMaker("div", ["question_img_box", "center_flex"])
        questionBox.appendChild(imageBox)

        const image = this.elementMaker("img", ["question_img"])
        image.addEventListener("error", (e) => {
            e.preventDefault()
            image.src = "/generic_q_img.png"
            image.classList.remove("king_img")
            image.classList.add("gen_img")
        })
        image.classList.add("king_img")
        image.src = question.image
        
        imageBox.appendChild(image)

        const questionText = this.elementMaker("p", ["question", "center_flex"])
        questionText.innerText = question.string
        questionBox.appendChild(questionText)

        const answerInput = this.elementMaker("div", ["input_div", "center_flex"])
        questionBox.appendChild(answerInput)

        const answerForm = this.getAnswerInput(question)
        answerInput.appendChild(answerForm)
        
        const submitBox = this.elementMaker("div", ["submit", "center_flex"])
        questionBox.appendChild(submitBox)

        const submitButton = this.elementMaker("button", ["submit_button"])
        submitButton.addEventListener("click", (e) => {
            e.preventDefault()
            this.displayCorrect(this.checkAnswer(question, answerForm), question.type)
        })
        submitButton.innerText = "Svara"
        submitBox.appendChild(submitButton)

        const nextButton = this.elementMaker("button", ["submit_button", "hidden"])
        nextButton.addEventListener("click", (e) => {
            e.preventDefault()
            this.currentRun.nextQuestion()
        })
        nextButton.innerText = "Nästa"
        submitBox.appendChild(nextButton)


        return questionBox

    }

    

    displayCorrect([is_correct, given_answer, correct_answer], type_of_question) {
        let gradingClass = "incorrect"
        
        const buttons = document.getElementsByClassName("submit_button")
        const correct_displays = Array.from(document.getElementsByClassName("answer_display"))
        if (is_correct) gradingClass = "correct"
        switch (type_of_question) {
            case "dateRange":
                const year_start_input = document.getElementById("year_start")
                const year_end_input = document.getElementById("year_end")
                
                const year_start_display = document.getElementById("correct_year_start")
                const year_end_display = document.getElementById("correct_year_end")

                year_start_display.innerText = given_answer.split("-")[0]
                year_end_display.innerText = given_answer.split("-")[1]

                year_start_input.classList.add("hidden")
                year_end_input.classList.add("hidden")
                correct_displays.forEach((disp) => {
                    disp.classList.add(gradingClass, "center_flex")
                    disp.classList.remove("hidden")
                })

                break
            
            case "year":
                const answer_input = document.getElementById("year")

                const correct_display = document.getElementById("answer_display")

                correct_display.innerText = given_answer
                
                answer_input.classList.add("hidden")
                correct_displays.forEach((disp) => {
                    disp.classList.add(gradingClass, "center_flex")
                    disp.classList.remove("hidden")
                })

                break


        }
        const display = document.getElementById("show_correct")
        if (!is_correct) {
            
            display.innerText = `Rätt svar: ${correct_answer}`
            
        } else {
            display.innerText = "Rätt!"
        }
        display.classList.remove("hidden")
        Array.from(buttons).forEach((btn) => {btn.classList.toggle("hidden")})
    }

    getAnswerInput(question) {
        const answerForm = this.elementMaker("form", ["answer_form"], "answer_form", "answer_form")
        answerForm.setAttribute("autocomplete", "off")
        const ifWrongDisplay = this.elementMaker("p", ["show_correct", "hidden", "center_flex"], "show_correct")
        switch(question.type) {
            case "dateRange":
                    const rangeDiv = this.elementMaker("div", ["date_range", "center_flex"])

                    const inputStartYear = this.elementMaker("input", ["range_input", "answer_input"], "year_start", "year_start", "text")
                    rangeDiv.appendChild(inputStartYear)

                    const correctStartYear = this.elementMaker("div", ["answer_display", "hidden"])
                    rangeDiv.appendChild(correctStartYear)

                    const corrSP = this.elementMaker("p",[], "correct_year_start", "correct_year_start")
                    correctStartYear.appendChild(corrSP)

                    const dashP = this.elementMaker("p")
                    dashP.innerText = "–"
                    rangeDiv.appendChild(dashP)

                    const inputEndYear = this.elementMaker("input", ["range_input", "answer_input"], "year_end", "year_end", "text")
                    rangeDiv.appendChild(inputEndYear)

                    const correctEndYear = this.elementMaker("div", ["answer_display", "hidden"], "correct_year_end", "correct_year_end")
                    rangeDiv.appendChild(correctEndYear)

                    const corrEP = this.elementMaker("p",[], "correct_year_end", "correct_year_end")
                    correctEndYear.appendChild(corrEP)

                    answerForm.appendChild(rangeDiv)

                    break
                
                case "year": 
                    const textDiv = this.elementMaker("div", ["text_answer", "center_flex"])
                    
                    const year = this.elementMaker("input", ["text_input", "answer_input"], "year", "year", "text")
                    textDiv.appendChild(year)

                    const correctYear = this.elementMaker("div", ["answer_display", "hidden"])
                    textDiv.appendChild(correctYear)

                    const corrY = this.elementMaker("p",[], "answer_display", "answer_display")
                    correctYear.appendChild(corrY)

                    answerForm.appendChild(textDiv)

                    break
                    
                
        }
        answerForm.appendChild(ifWrongDisplay)
        return answerForm
    }

    elementMaker(_type, _class_list = [], _id = "", _name = "", _input_type = "") {
        const result = document.createElement(_type)
        if (_class_list) {
            _class_list.forEach((_class) => result.classList.add(_class))
        }
        if (_id) result.id = _id
        if (_name) result.name = _name
        if (_input_type) result.type = _input_type
        return result
    }

    checkAnswer(_question, _form){
        
        const answer_data = Object.fromEntries(new FormData(_form))
        let answer
        let correct_answer
        switch (_question.type) {
            case "dateRange":
                
                answer = answer_data["year_start"].toLowerCase().trim() + "-" + answer_data["year_end"].toLowerCase().trim()
                correct_answer = _question.correctAnswer[0].toString().toLowerCase().trim() + "-" + _question.correctAnswer[1].toString().toLowerCase().trim()
                break
            case "year":
                answer = answer_data["year"].toLowerCase().trim()
                correct_answer = _question.correctAnswer.toString().toLowerCase().trim()
                break
        }
        return [answer == correct_answer, answer, correct_answer]
    }



}

class questionsArray {

    list = []
    
    constructor() {
        return
    }

    question = (
        string = "",
        type = "",
        correctAnswer,
        alternatives = [],
        image
    ) => {
        
        return {
            "id": this.list.length + 1,
            string,
            correctAnswer,
            type,
            alternatives,
            image,
        }

    }

    add(
        string = "",
        type = "",
        correctAnswer,        
        alternatives = [],
        image
    ) {
        
        this.list.push(this.question(string,type,correctAnswer,alternatives,image))
    }

    getRandom(_list = null) {
        if (!_list) _list = this.list
        let list_pos = Math.floor(Math.random() * this.list.length)
        const result = _list.splice(list_pos, 1)
        return  result[0]
    }

}
