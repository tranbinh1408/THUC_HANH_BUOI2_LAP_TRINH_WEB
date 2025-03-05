import { ICauHoi } from "@/services/QuanLyCauHoi/type"
import { getExam, saveExam } from "./examManagement"

export const QUESTION_KEY = "cau-hoi"

export const getQuestion = (): ICauHoi[] => {
  const question = localStorage.getItem(QUESTION_KEY)
  return question ? JSON.parse(question) : []
}

export const saveQuestion = (question: ICauHoi[]): void => {
  localStorage.setItem(QUESTION_KEY, JSON.stringify(question))
}

export const addQuestion = (question: ICauHoi): void => {
  const questionList = getQuestion()
  questionList.push(question)
  saveQuestion(questionList)
}

export const updateQuestion = (question: ICauHoi): void => {
  const questionList = getQuestion()
  const index = questionList.findIndex((q) => q.id === question.id)
  if (index !== -1) {
    questionList[index] = question
    saveQuestion(questionList)
  }
}

export const deleteQuestion = (id: number): void => {
  const questionList = getQuestion()
  const filteredQuestion = questionList.filter((q) => q.id !== id)
  saveQuestion(filteredQuestion)

  const examList = getExam()
  const updatedDeThi = examList.map((exam) => {
    return {
      ...exam,
      cac_cau_hoi: exam.cac_cau_hoi.filter((q) => q.id !== id),
    }
  })
  saveExam(updatedDeThi)
}

