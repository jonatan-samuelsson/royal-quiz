

export class quizObject {

    quizData
    questions

    constructor(jsonObject) {
        this.quizData = jsonObject
        this.questions = new questionsArray()
        this.setupListOfRulersQuestions(this.quizData.rulers)

    }


    setupListOfRulersQuestions(rulers) {

        rulers.forEach(ruler => {
            this.questions.add(
                `När regerade ${ruler.name}?`,
                "dateRange",
                (ruler.year_start, ruler.year_end),
                "",
                ruler.image
            )
            this.questions.add(
                `Vilket år inleddes ${ruler.name}s regenttid?`,
                "year",
                ruler.year_start,
                "",
                ruler.image
            )
            this.questions.add(
                `Vilket år slutade ${ruler.name}s regenttid?`,
                "year",
                ruler.year_end,
                "",
                ruler.image
            )
        })
    }

    generateHTML(question) {

        var _img 
        if (!question.image) _img = "generic_q_img.png"; else _img = question.img

        

        

        const questionBox = this.elementMaker("article", ["question_box"], "question_box", "question_box")
        

        const imageBox = this.elementMaker("div", ["question_img_box"])
        questionBox.appendChild(imageBox)

        const image = this.elementMaker("img", ["question_img"])
        image.src = _img
        imageBox.appendChild(image)

        const questionText = this.elementMaker("p", ["question"])
        questionText.innerText = question.string
        questionBox.appendChild(questionText)

        const answerInput = this.elementMaker("div", ["answer_input"])
        questionBox.appendChild(answerInput)

        const answerForm = this.getAnswerInput(question)
        answerInput.appendChild(answerForm)
        
        const submitBox = this.elementMaker("div", ["submit"])
        questionBox.appendChild(submitBox)

        const submitButton = this.elementMaker("button", ["submit_button"])
        submitButton.addEventListener("click", (e) => {
            if (this.checkAnswer(question, answerForm)) {
                alert("KORREKT")
            }
            else {
                alert("FEL")
            }
        })
        submitButton.innerText = "Svara"
        submitBox.appendChild(submitButton)


        return questionBox

    }

    getAnswerInput(question) {
        const answerForm = this.elementMaker("form", ["answer_form"], "answer_form", "answer_form")
        switch(question.type) {
            case "dateRange":
                    const rangeDiv = this.elementMaker("div", ["date_range"])

                    const startYear = this.elementMaker("input", ["range_input"], "year_start", "year_start", "text")
                    rangeDiv.appendChild(startYear)

                    const dashP = this.elementMaker("p")
                    dashP.innerText = "–"
                    rangeDiv.appendChild(dashP)

                    const endYear = this.elementMaker("input", ["range_input"], "year_end", "year_end", "text")
                    rangeDiv.appendChild(endYear)

                    answerForm.appendChild(rangeDiv)

                return answerForm
                
                case "year": 
                    const textDiv = this.elementMaker("div", ["text_answer"])
                    
                    const year = this.elementMaker("input", ["text_input"], "year", "year", "text")
                    textDiv.appendChild(year)
                    
                    answerForm.appendChild(textDiv)
                    
                return answerForm
        }
    }

    elementMaker(_type, _class_list = [], _id = "", _name = "", _input_type = "") {
        const result = document.createElement(_type)
        if (_class_list) {
            _class_list.forEach((_class) => result.classList.add(_class))
        }
        if (_id) result.id = _id
        if (_name) result.name = _name
        if (_type) result.type = _input_type
        return result
    }

    checkAnswer(_question, _form){
        
        const answer_data = Object.fromEntries(new FormData(_form))
        let answer = ""
        let correct_answer = ""
        switch (_question.type) {
            case "dateRange":
                
                answer = answer_data["year_start"].toLowerCase().trim() + answer_data["year_end"].toLowerCase().trim()
                correct_answer = _question.correctAnswer[0].toString().toLowerCase().trim() + _question.correctAnswer[1].toString().toLowerCase().trim()
                break
            case "year":
                answer = answer_data["year"].toLowerCase().trim()
                correct_answer = _question.correctAnswer.toString().toLowerCase().trim()
                break
        }
        
        return answer == correct_answer
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
            image
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
        return  _list[list_pos]
    }


}
