
import { DoKho } from "@/services/QuanLyCauHoi/type"
import { ICauTruc } from "@/services/QuanLyDeThi/type"
import { IMonHoc } from "@/services/QuanLyMonHoc/type"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, InputNumber, Select, Space, message } from "antd"
import { useState } from "react"

const { Option } = Select

interface IExamStructureFormProps {
  subjects: IMonHoc[]
  onSubmit: (name: string, subjectId: string, structure: ICauTruc[]) => void
}

const ExamStructureForm = ({ subjects, onSubmit }: IExamStructureFormProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")

  const handleSubmit = async (values: {
    ten_de: string
    ma_mon: string
    cau_truc: {
      do_kho: DoKho
      so_luong: number
    }[]
  }) => {
    try {
      setLoading(true)
      onSubmit(values.ten_de, values.ma_mon, values.cau_truc)
      form.resetFields()
      setSelectedSubject("")
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    form.setFieldsValue({ structure: [] })
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="ten_de" label="Tên đề thi" rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}>
        <Select placeholder="Nhập tên đề thi" showSearch allowClear>
          <Option value="Đề thi giữa kỳ">Đề thi giữa kỳ</Option>
          <Option value="Đề thi cuối kỳ">Đề thi cuối kỳ</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="ma_mon" label="Môn học">
        <Select onChange={handleSubjectChange}>
          {subjects.map((subject) => (
            <Option key={subject.id} value={subject.ma_mon}>
              {subject.ma_mon} - {subject.ten_mon}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.List
        name="cau_truc"
        rules={[
          {
            validator: async (_, structure) => {
              if (!structure || structure.length === 0) {
                return Promise.reject(new Error("Vui lòng thêm ít nhất một cấu trúc đề thi"))
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, "do_kho"]}
                  rules={[{ required: true, message: "Chọn mức độ khó" }]}
                >
                  <Select placeholder="Mức độ khó" style={{ width: 120 }}>
                    <Option value={DoKho.De}>Dễ</Option>
                    <Option value={DoKho.TrungBinh}>Trung bình</Option>
                    <Option value={DoKho.Kho}>Khó</Option>
                  </Select>
                </Form.Item>

                <Form.Item {...restField} name={[name, "so_luong"]} rules={[{ required: true, message: "Nhập số lượng" }]}>
                  <InputNumber min={1} placeholder="Số lượng" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} disabled={!selectedSubject}>
                Thêm cấu trúc đề thi
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo đề thi
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ExamStructureForm

