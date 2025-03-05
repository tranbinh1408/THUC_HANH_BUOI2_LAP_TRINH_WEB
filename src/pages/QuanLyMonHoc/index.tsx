import { useSubject } from "@/hooks/useSubject"
import { IMonHoc } from "@/services/QuanLyMonHoc/type"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Modal, Popconfirm, Space, Table, Tabs } from "antd"
import { useState } from "react"
import SubjectForm from "./components/form"

const { TabPane } = Tabs

const QuanLyMonHoc = () => {
  const { subjects, loading, createSubject, updateSubject, deleteSubject } =
    useSubject()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSubject, setEditingSubject] = useState<IMonHoc | null>(null)
  const [activeTab, setActiveTab] = useState<string>("1")

  const handleSubjectSubmit = (ma_mon: string, ten_mon: string, so_tin: number) => {
    if (editingSubject) {
      updateSubject({
        ...editingSubject,
        ma_mon,
        ten_mon,
        so_tin
      })
    } else {
      createSubject(ma_mon, ten_mon, so_tin)
    }
    setIsModalVisible(false)
    setEditingSubject(null)
  }

  const subjectColumns = [
    {
      title: "Mã môn",
      dataIndex: "ma_mon",
      key: "ma_mon",
    },
    {
      title: "Tên môn học",
      dataIndex: "ten_mon",
      key: "ten_mon",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "so_tin",
      key: "so_tin",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text: string, record: IMonHoc) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSubject(record)
              setIsModalVisible(true)
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa môn học này?"
            onConfirm={() => deleteSubject(record.id)}
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
      <Card title="Quản lý môn học">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Danh sách môn học" key="1">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSubject(null)
                  setIsModalVisible(true)
                }}
              >
                Thêm môn học
              </Button>
            </div>
            <Table columns={subjectColumns} dataSource={subjects} rowKey="id" loading={loading} />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingSubject ? "Sửa môn học" : "Thêm môn học mới"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingSubject(null)
        }}
        footer={null}
      >
        <SubjectForm initialValues={editingSubject || undefined} onSubmit={handleSubjectSubmit} />
      </Modal>
    </div>
  )
}

export default QuanLyMonHoc

