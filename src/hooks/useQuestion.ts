import { ICauHoi, DoKho } from '@/services/QuanLyCauHoi/type';
import { addQuestion, deleteQuestion, getQuestion, updateQuestion } from '@/utils/localStorage/questionManagement';
import { generateId } from '@/utils/utils';
import { useEffect, useState } from 'react';

export const useQuestion = () => {
	const [questions, setQuestions] = useState<ICauHoi[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadedQuestion = getQuestion();
		setQuestions(loadedQuestion);
		setLoading(false);
	}, []);

	const createQuestion = (ma_mon: string, noi_dung: string, do_kho: DoKho): ICauHoi => {
		const newQuestion: ICauHoi = {
			id: generateId(),
			ma_mon,
			noi_dung,
			do_kho,
		};

		addQuestion(newQuestion);
		setQuestions([...questions, newQuestion]);
		return newQuestion;
	};

	const updateExistingQuestion = (QuestionToUpdate: ICauHoi): void => {
		updateQuestion(QuestionToUpdate);
		setQuestions(questions.map((q) => (q.id === QuestionToUpdate.id ? QuestionToUpdate : q)));
	};

	const removeQuestion = (id: number): void => {
		deleteQuestion(id);
		setQuestions(questions.filter((q) => q.id !== id));
	};

	const filterQuestion = (ma_mon?: string, do_kho?: DoKho): ICauHoi[] => {
		return questions.filter((q) => {
			let match = true;
			if (ma_mon) match = match && q.ma_mon === ma_mon;
			if (do_kho) match = match && q.do_kho === do_kho;
			return match;
		});
	};

	return {
		questions,
		loading,
		createQuestion,
		updateQuestion: updateExistingQuestion,
		deleteQuestion: removeQuestion,
		filterQuestion,
	};
};
