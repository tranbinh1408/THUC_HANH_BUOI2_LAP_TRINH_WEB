import { ICauHoi, DoKho } from "../QuanLyCauHoi/type"

export interface IDeThi {
    id: number;
    ma_de: string
    ten_de: string
    ma_mon: string
    ngay_tao: string
    cac_cau_hoi: ICauHoi[]
    cau_truc: ICauTruc[]
}
export interface ICauTruc {
    do_kho: DoKho
    so_luong: number
}