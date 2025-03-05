import { useState } from "react"
import { Form, Input, Button, InputNumber, message } from "antd"
import { IMonHoc } from "@/services/QuanLyMonHoc/type"

interface ISubjectFormProps {
  initialValues?: IMonHoc
  onSubmit: (ma_mon: string, ten_mon: string, so_tin: number) => void
}

const SubjectForm = ({ initialValues, onSubmit }: ISubjectFormProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { ma_mon: string; ten_mon: string; so_tin: number }) => {
    try {
      setLoading(true)
      onSubmit(values.ma_mon, values.ten_mon, values.so_tin)
      if (!initialValues) {
        form.resetFields()
      }
      message.success(`Môn học đã được ${initialValues ? "cập nhật" : "tạo"} thành công`)
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" initialValues={initialValues || { so_tin: 3 }} onFinish={handleSubmit}>
      <Form.Item name="ma_mon" label="Mã môn học" rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}>
        <Input placeholder="Ví dụ: INT1307" />
      </Form.Item>

      <Form.Item name="ten_mon" label="Tên môn học" rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}>
        <Input placeholder="Ví dụ: Lập trình web" />
      </Form.Item>

      <Form.Item name="so_tin" label="Số tín chỉ" rules={[{ required: true, message: "Vui lòng nhập số tín chỉ" }]}>
        <InputNumber min={1} max={10} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Cập nhật" : "Tạo môn học"}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SubjectForm

