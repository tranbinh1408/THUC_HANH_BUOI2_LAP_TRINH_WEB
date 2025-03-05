import { IMonHoc } from '@/services/QuanLyMonHoc/type';
import { addSubject, deleteSubject, getSubject, updateSubject } from '@/utils/localStorage/subjectManagement';
import { useEffect, useState } from 'react';

export const useSubject = () => {
	const [subjects, setSubjects] = useState<IMonHoc[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadedSubject = getSubject();
		setSubjects(loadedSubject);
		setLoading(false);
	}, []);

	const createSubject = (ma_mon: string, ten_mon: string, so_tin: number): IMonHoc => {
		const newSubject: IMonHoc = {
			id: Math.floor(Math.random() * 1000000),
			ma_mon,
			ten_mon,
			so_tin,
		};

		addSubject(newSubject);
		setSubjects([...subjects, newSubject]);
		return newSubject;
	};

	const updateExistingSubject = (subjectToUpdate: IMonHoc): void => {
		updateSubject(subjectToUpdate);
		setSubjects(subjects.map((s) => (s.id === subjectToUpdate.id ? subjectToUpdate : s)));
	};

	const removeSubject = (id: number): void => {
		deleteSubject(id);
		setSubjects(subjects.filter((s) => s.id !== id));
	};

	return {
		subjects,
		loading,
		createSubject,
		updateSubject: updateExistingSubject,
		deleteSubject: removeSubject,
	};
};
