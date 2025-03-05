import { useQuestion } from "@/hooks/useQuestion"
import { useSubject } from "@/hooks/useSubject"
import { DoKho, ICauHoi } from "@/services/QuanLyCauHoi/type"
import { getDifficultyLabel } from "@/utils/localStorage/examGenerator"
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table } from "antd"
import { useState } from "react"
import QuestionForm from "./components/form"

const { Option } = Select

const QuanLyCauHoi = () => {
  const { subjects } = useSubject()
  const { questions, loading, createQuestion, updateQuestion, deleteQuestion } = useQuestion()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<ICauHoi | null>(null)

  const [filterSubjectId, setFilterSubjectId] = useState<string | undefined>(undefined)
  const [filterDoKho, setFilterDoKho] = useState<DoKho | undefined>(undefined)
  const [searchText, setSearchText] = useState<string>("")

  const handleQuestionSubmit = (subjectId: string, content: string, do_kho: DoKho) => {
    if (editingQuestion) {
      updateQuestion({
        ...editingQuestion,
        ma_mon: subjectId,
        noi_dung: content,
        do_kho: do_kho,
      })
    } else {
      createQuestion(subjectId, content, do_kho)
    }
    setIsModalVisible(false)
    setEditingQuestion(null)
  }

  const filteredQuestions = questions
    .filter((q) => !filterSubjectId || q.ma_mon === filterSubjectId)
    .filter((q) => !filterDoKho || q.do_kho === filterDoKho)
    .filter((q) => !searchText || q.noi_dung.toLowerCase().includes(searchText.toLowerCase()))

  console.log("Subjects:", subjects);
  console.log("Questions:", questions);

  const hasInvalidSubject = questions.some((q) => !subjects.find((m) => m.ma_mon === q.ma_mon));
  if (hasInvalidSubject) {
    console.log("Có câu hỏi với ma_mon không hợp lệ!");
  }

  const columns = [
    {
      title: "Môn học",
      key: "ma_mon",
      render: (text: string, record: ICauHoi) => {
        const mon = subjects.find((m) => m.ma_mon === record.ma_mon)
        return mon ? `${mon.ma_mon} - ${mon.ten_mon}` : "N/A"
      },
    },
    {
      title: "Mức độ khó",
      dataIndex: "do_kho",
      key: "do_kho",
      render: (text: DoKho) => getDifficultyLabel(text),
    },
    {
      title: "Nội dung câu hỏi",
      dataIndex: "noi_dung",
      key: "noi_dung",
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text: string, record: ICauHoi) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingQuestion(record)
              setIsModalVisible(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa câu hỏi này?"
            onConfirm={() => deleteQuestion(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card title="Quản lý câu hỏi">
        <Card title="Tìm kiếm và lọc" style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item label="Môn học">
              <Select
                placeholder="Chọn môn học"
                style={{ width: 200 }}
                allowClear
                value={filterSubjectId}
                onChange={setFilterSubjectId}
              >
                {subjects.map((mon) => (
                  <Option key={mon.ma_mon} value={mon.ma_mon}>
                    {mon.ma_mon} - {mon.ten_mon}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Mức độ khó">
              <Select
                placeholder="Chọn mức độ khó"
                style={{ width: 150 }}
                allowClear
                value={filterDoKho}
                onChange={setFilterDoKho}
              >
                <Option value={DoKho.De}>Dễ</Option>
                <Option value={DoKho.TrungBinh}>Trung bình</Option>
                <Option value={DoKho.Kho}>Khó</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tìm kiếm">
              <Input
                placeholder="Nhập nội dung câu hỏi"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
        </Card>

        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingQuestion(null)
              setIsModalVisible(true)
            }}
          >
            Thêm câu hỏi
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredQuestions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingQuestion ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingQuestion(null)
        }}
        footer={null}
        width={700}
      >
        <QuestionForm
          subjects={subjects}
          initialValues={editingQuestion ? {
            ma_mon: editingQuestion.ma_mon,
            noi_dung: editingQuestion.noi_dung,
            do_kho: editingQuestion.do_kho
          } : undefined}
          onSubmit={handleQuestionSubmit}
        />
      </Modal>
    </div>
  )
}

export default QuanLyCauHoi