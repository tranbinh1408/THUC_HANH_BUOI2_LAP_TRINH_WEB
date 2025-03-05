export interface ICauHoi {
	id: number;
	ma_mon: string;
	noi_dung: string;
	do_kho: DoKho;
}

export enum DoKho {
    De = 'DE',
    TrungBinh = 'TRUNG_BINH', 
    Kho = 'KHO'
}
