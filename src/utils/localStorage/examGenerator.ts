import { DoKho, ICauHoi } from '@/services/QuanLyCauHoi/type';
import { ICauTruc } from '@/services/QuanLyDeThi/type';

export const generateExamQuestions = (allQuestions: ICauHoi[], structure: ICauTruc[]): ICauHoi[] => {
	const selectedQuestions: ICauHoi[] = [];

	structure.forEach((item) => {
		const eligibleQuestions = allQuestions.filter((q) => q.do_kho === item.do_kho && !selectedQuestions.includes(q));

		const shuffled = [...eligibleQuestions].sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, item.so_luong);

		selectedQuestions.push(...selected);
	});

	return selectedQuestions;
};

export const hasEnoughQuestions = (allQuestions: ICauHoi[], structure: ICauTruc[]): boolean => {
	// Log thông tin debug
	const byDifficulty = {
		[DoKho.De]: allQuestions.filter((q) => q.do_kho === DoKho.De).length,
		[DoKho.TrungBinh]: allQuestions.filter((q) => q.do_kho === DoKho.TrungBinh).length,
		[DoKho.Kho]: allQuestions.filter((q) => q.do_kho === DoKho.Kho).length,
	};
	console.log('Số câu hỏi theo độ khó:', byDifficulty);
	console.log('Cấu trúc đề thi:', structure);

	// Kiểm tra từng mức độ khó một
	for (const item of structure) {
		const availableCount = allQuestions.filter((q) => q.do_kho === item.do_kho).length;
		console.log(`Mức độ ${getDifficultyLabel(item.do_kho)}: cần ${item.so_luong}, có ${availableCount}`);

		if (availableCount < item.so_luong) {
			return false;
		}
	}

	return true;
};

export const getDifficultyLabel = (doKho: DoKho): string => {
	switch (doKho) {
		case DoKho.De:
			return 'Dễ';
		case DoKho.TrungBinh:
			return 'Trung bình';
		case DoKho.Kho:
			return 'Khó';
		default:
			return '';
	}
};
