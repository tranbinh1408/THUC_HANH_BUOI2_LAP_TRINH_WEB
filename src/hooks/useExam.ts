
import { ICauHoi } from "@/services/QuanLyCauHoi/type"
import { getExam, addExam, updateExam, deleteExam } from "@/services/QuanLyDeThi"
import { IDeThi, ICauTruc } from "@/services/QuanLyDeThi/type"
import { generateExamQuestions } from "@/utils/localStorage/examGenerator"
import { useState, useEffect } from "react"

export const useExam = (allCauHoi: ICauHoi[]) => {
  const [exams, setExams] = useState<IDeThi[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadedExam = getExam()
    setExams(loadedExam)
    setLoading(false)
  }, [])

  const createExam = (ma_de: string, ten_de: string, ma_mon: string, cau_truc: ICauTruc[]): IDeThi | null => {
    const cac_cau_hoi = generateExamQuestions(
      allCauHoi.filter((c) => c.ma_mon === ma_mon),
      cau_truc,
    )

    if (cac_cau_hoi.length < cau_truc.reduce((sum, item) => sum + item.so_luong, 0)) {
      return null
    }

    const newExam: IDeThi = {
      id: Math.floor(Math.random() * 1000000),
      ma_de,
      ten_de,
      ma_mon,
      ngay_tao: new Date().toISOString(),
      cac_cau_hoi,
      cau_truc,
    }

    addExam(newExam)
    setExams([...exams, newExam])
    return newExam
  }

  const updateExistingExam = (examsToUpdate: IDeThi): void => {
    updateExam(examsToUpdate)
    setExams(exams.map((d) => (d.id === examsToUpdate.id ? examsToUpdate : d)))
  }

  const removeExam = (id: number): void => {
    deleteExam(id)
    setExams(exams.filter((d) => d.id !== id))
  }

  const regenerateExamQuestions = (id: number): IDeThi | null => {
    const examsToUpdate = exams.find((d) => d.id === id)
    if (!examsToUpdate) return null

    const cac_cau_hoi = generateExamQuestions(
      allCauHoi.filter((c) => c.ma_mon === examsToUpdate.ma_mon),
      examsToUpdate.cau_truc,
    )

    if (cac_cau_hoi.length < examsToUpdate.cau_truc.reduce((sum, item) => sum + item.so_luong, 0)) {
      return null
    }

    const updatedExam = {
      ...examsToUpdate,
      cac_cau_hoi,
      ngay_tao: new Date().toISOString(),
    }

    updateExam(updatedExam)
    setExams(exams.map((d) => (d.id === id ? updatedExam : d)))
    return updatedExam
  }

  return {
    exams,
    loading,
    createExam,
    updateExam: updateExistingExam,
    deleteExam: removeExam,
    regenerateExamQuestions,
  }
}

