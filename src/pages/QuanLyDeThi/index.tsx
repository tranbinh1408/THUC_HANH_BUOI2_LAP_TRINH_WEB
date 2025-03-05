
import { useQuestion } from "@/hooks/useQuestion"
import { useSubject } from "@/hooks/useSubject"
import { ICauTruc, IDeThi } from "@/services/QuanLyDeThi/type"
import { getDifficultyLabel, hasEnoughQuestions } from "@/utils/localStorage/examGenerator"
import { DeleteOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Card, Collapse, Modal, Popconfirm, Space, Table, Tabs, Tag, Typography, message } from "antd"
import { useState } from "react"
import ExamStructureForm from "./components/form"
import { useExam } from "@/hooks/useExam"
import { DoKho, ICauHoi } from "@/services/QuanLyCauHoi/type"

const { TabPane } = Tabs
const { Panel } = Collapse
const { Title, Text } = Typography

const QuanLiDeThi = () => {
  const { subjects } = useSubject()
  const { questions } = useQuestion()
  const { exams, loading, createExam, deleteExam, regenerateExamQuestions } = useExam(questions)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [viewingExam, setViewingExam] = useState<IDeThi | null>(null)
  const [activeTab, setActiveTab] = useState<string>("1")

  const handleExamCreate = (name: string, subjectId: string, structure: ICauTruc[]) => {
    const subjectQuestions = questions.filter((q) => q.ma_mon === subjectId)
    if (!hasEnoughQuestions(subjectQuestions, structure)) {
      message.error("Không đủ câu hỏi để tạo đề thi theo cấu trúc này")
      return
    }

    const exam = createExam(name, name, subjectId, structure)
    if (exam) {
      message.success("Đề thi đã được tạo thành công")
      setActiveTab("1")
    } else {
      message.error("Không thể tạo đề thi. Vui lòng thử lại.")
    }
  }

  const handleRegenerateExam = (id: number) => {
    const exam = regenerateExamQuestions(id)
    if (exam) {
      message.success("Đề thi đã được tạo lại thành công")
    } else {
      message.error("Không thể tạo lại đề thi. Vui lòng thử lại.")
    }
  }

  const examColumns = [
    {
      title: "Tên đề thi",
      dataIndex: "ten_de",
      key: "ten_De",
    },
    {
      title: "Môn học",
      key: "ma_mon",
      render: (text: string, record: IDeThi) => {
        const subject = subjects.find((s) => s.ma_mon === record.ma_mon)
        return subject ? `${subject.ma_mon} - ${subject.ten_mon}` : "N/A"
      },
    },
    {
      title: "Ngày tạo",
      key: "ngay_tao",
      render: (text: string, record: IDeThi) => {
        const date = new Date(record.ngay_tao)
        return date.toLocaleDateString("vi-VN")
      },
    },
    {
      title: "Số câu hỏi",
      key: "so_luong",
      render: (text: string, record: IDeThi) => record.cac_cau_hoi.length,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text: string, record: IDeThi) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingExam(record)
              setIsModalVisible(true)
            }}
          >
            Xem
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => handleRegenerateExam(record.id)}>
            Tạo lại
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đề thi này?"
            onConfirm={() => deleteExam(record.id)}
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

  const renderExamStructure = (cau_truc: ICauTruc[]) => {
    function getDifficultyLabel(do_kho: any): string | number | boolean | {} | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactNodeArray | import("react").ReactPortal | null | undefined {
      throw new Error("Function not implemented.")
    }

    return (
      <div>
        <Title level={5}>Cấu trúc đề thi:</Title>
        <ul>
          {cau_truc.map((item, index) => (
            <li key={index}>
              <Text>
                {getDifficultyLabel(item.do_kho)}: {item.so_luong} câu
              </Text>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const renderExamQuestions = (questions: ICauHoi[]) => {
    return (
      <Collapse>
        {questions.map((question, index) => {

          return (
            <Panel
              header={`Câu ${index + 1}: ${question.noi_dung.substring(0, 50)}...`}
              key={question.id}
              extra={
                <Tag
                  color={
                    question.do_kho === DoKho.De
                      ? "green"
                      : question.do_kho === DoKho.TrungBinh
                        ? "blue"
                        : question.do_kho === DoKho.Kho
                          ? "orange"
                          : "red"
                  }
                >
                  {getDifficultyLabel(question.do_kho)}
                </Tag>
              }
            >
              <p>
                <strong>Nội dung:</strong> {question.noi_dung}
              </p>
            </Panel>
          )
        })}
      </Collapse>
    )
  }

  return (
    <div>
      <Card title="Quản lý đề thi">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Danh sách đề thi" key="1">
            <Table columns={examColumns} dataSource={exams} rowKey="id" loading={loading} />
          </TabPane>
          <TabPane tab="Tạo đề thi mới" key="2">
            <ExamStructureForm subjects={subjects} onSubmit={handleExamCreate} />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={`Đề thi: ${viewingExam?.ten_de}`}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setViewingExam(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsModalVisible(false)
              setViewingExam(null)
            }}
          >
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {viewingExam && (
          <>
            <div style={{ marginBottom: 16 }}>
              <p>
                <strong>Môn học:</strong> {(() => {
                  const subject = subjects.find((s) => s.ten_mon === viewingExam.ma_mon)
                  return subject ? `${subject.ma_mon} - ${subject.ten_mon}` : "N/A"
                })()}
              </p>
              <p>
                <strong>Ngày tạo:</strong> {new Date(viewingExam.ngay_tao).toLocaleDateString("vi-VN")}
              </p>
            </div>

            {renderExamStructure(viewingExam.cau_truc)}

            <Title level={5} style={{ marginTop: 16 }}>
              Danh sách câu hỏi:
            </Title>
            {renderExamQuestions(viewingExam.cac_cau_hoi)}
          </>
        )}
      </Modal>
    </div>
  )
}

export default QuanLiDeThi

