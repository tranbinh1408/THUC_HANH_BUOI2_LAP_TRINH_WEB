import { EXAM_KEY } from '@/utils/localStorage/examManagement';
import { IDeThi } from './type';

export const getExam = (): IDeThi[] => {
	const exam = localStorage.getItem(EXAM_KEY);
	return exam ? JSON.parse(exam) : [];
};

export const saveExam = (exam: IDeThi[]): void => {
	localStorage.setItem(EXAM_KEY, JSON.stringify(exam));
};

export const addExam = (exam: IDeThi): void => {
	const examList = getExam();
	examList.push(exam);
	saveExam(examList);
};

export const updateExam = (exam: IDeThi): void => {
	const examList = getExam();
	const index = examList.findIndex((e) => e.id === exam.id);
	if (index !== -1) {
		examList[index] = exam;
		saveExam(examList);
	}
};

export const deleteExam = (id: number): void => {
	const examList = getExam();
	const filteredExam = examList.filter((e) => e.id !== id);
	saveExam(filteredExam);
};
