import { DoKho } from "@/services/QuanLyCauHoi/type"
import { IMonHoc } from "@/services/QuanLyMonHoc/type"
import { Button, Form, Input, Select, message } from "antd"
import { useState } from "react"

const { TextArea } = Input
const { Option } = Select

interface IQuestionFormProps {
    subjects: IMonHoc[]
    initialValues?: {
        ma_mon: string
        noi_dung: string
        do_kho: DoKho
    }
    onSubmit: (ma_mon: string, noi_dung: string, do_kho: DoKho) => void
}

const QuestionForm = ({ subjects, initialValues, onSubmit }: IQuestionFormProps) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState<string>(initialValues?.ma_mon || "")

    const handleSubmit = async (values: {
        ma_mon: string
        noi_dung: string
        do_kho: DoKho
    }) => {
        try {
            setLoading(true)
            onSubmit(values.ma_mon, values.noi_dung, values.do_kho)
            if (!initialValues) {
                form.resetFields(["noi_dung"])
            }
            message.success(`Câu hỏi đã được ${initialValues ? "cập nhật" : "tạo"} thành công`)
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        form.setFieldsValue({ ma_mon: value })
    }

    return (
        <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
            <Form.Item name="ma_mon" label="Môn học" rules={[{ required: true, message: "Vui lòng chọn môn học" }]}>
                <Select placeholder="Chọn môn học" onChange={handleSubjectChange}>
                    {subjects.map((subject) => (
                        <Option key={subject.id} value={subject.ma_mon}>  
                            {subject.ma_mon} - {subject.ten_mon}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="do_kho"
                label="Mức độ khó"
                rules={[{ required: true, message: "Vui lòng chọn mức độ khó" }]}
            >
                <Select placeholder="Chọn mức độ khó">
                    <Option value={DoKho.De}>Dễ</Option>
                    <Option value={DoKho.TrungBinh}>Trung bình</Option>
                    <Option value={DoKho.Kho}>Khó</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="noi_dung"
                label="Nội dung câu hỏi"
                rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi" }]}
            >
                <TextArea rows={4} placeholder="Nhập nội dung câu hỏi" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {initialValues ? "Cập nhật" : "Tạo câu hỏi"}
                </Button>
            </Form.Item>
        </Form>
    )
}

export default QuestionForm

