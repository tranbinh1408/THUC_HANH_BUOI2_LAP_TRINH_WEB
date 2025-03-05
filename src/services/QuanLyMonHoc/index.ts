import { getExam, saveExam } from '@/utils/localStorage/examManagement';
import { getQuestion, saveQuestion } from '@/utils/localStorage/questionManagement';
import { SUBJECT_KEY } from '@/utils/localStorage/subjectManagement';
import { IMonHoc } from './type';

export const getSubject = (): IMonHoc[] => {
	const subject = localStorage.getItem(SUBJECT_KEY);
	return subject ? JSON.parse(subject) : [];
};

export const saveSubject = (subject: IMonHoc[]): void => {
	localStorage.setItem(SUBJECT_KEY, JSON.stringify(subject));
};

export const addSubject = (subject: IMonHoc): void => {
	const subjectList = getSubject();
	subjectList.push(subject);
	saveSubject(subjectList);
};

export const updateSubject = (subject: IMonHoc): void => {
	const subjectList = getSubject();
	const index = subjectList.findIndex((s) => s.id === subject.id);
	if (index !== -1) {
		subjectList[index] = subject;
		saveSubject(subjectList);
	}
};

export const deleteSubject = (id: number): void => {
	const subjectList = getSubject();
	const filteredSubject = subjectList.filter((s) => s.id !== id);
	saveSubject(filteredSubject);

	const questionList = getQuestion();
	const subjectToDelete = subjectList.find((s) => s.id === id)?.ma_mon;
	if (subjectToDelete) {
		const filteredQuestion = questionList.filter((s) => s.ma_mon !== subjectToDelete);
		saveQuestion(filteredQuestion);

		const examList = getExam();
		const filteredExam = examList.filter((e) => e.ma_mon !== subjectToDelete);
		saveExam(filteredExam);
	}
};
