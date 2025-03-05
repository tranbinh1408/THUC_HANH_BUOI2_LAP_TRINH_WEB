import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Space, List, Tag } from 'antd';
import { ScissorOutlined, FileOutlined, StopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const choices = ['Kéo', 'Búa', 'Bao'];

const OanTuTi: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<string>('');
  const [computerChoice, setComputerChoice] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<Array<{ player: string; computer: string; result: string }>>([]);

  const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player: string, computer: string) => {
    if (player === computer) return 'Hòa';
    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }
    return 'Thua';
  };

  const handleChoice = (choice: string) => {
    const computerMove = getComputerChoice();
    setPlayerChoice(choice);
    setComputerChoice(computerMove);
    const gameResult = determineWinner(choice, computerMove);
    setResult(gameResult);
    setHistory([
      { player: choice, computer: computerMove, result: gameResult },
      ...history,
    ]);
  };

  const getIcon = (choice: string) => {
    switch (choice) {
      case 'Kéo':
        return <ScissorOutlined />;
      case 'Búa':
        return <StopOutlined />;
      case 'Bao':
        return <FileOutlined />;
      default:
        return null;
    }
  };

  const getResultTag = (result: string) => {
    switch (result) {
      case 'Thắng':
        return <Tag color="success">{result}</Tag>;
      case 'Thua':
        return <Tag color="error">{result}</Tag>;
      default:
        return <Tag color="warning">{result}</Tag>;
    }
  };

  return (
    <Card bordered={false}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Trò Chơi Oẳn Tù Tì
      </Title>

      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card>
              <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                {choices.map((choice) => (
                  <Button
                    key={choice}
                    type="primary"
                    size="large"
                    icon={getIcon(choice)}
                    onClick={() => handleChoice(choice)}
                  >
                    {choice}
                  </Button>
                ))}
              </Space>
            </Card>

            {playerChoice && (
              <Card>
                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                  <Text strong>
                    Bạn chọn: {playerChoice} {getIcon(playerChoice)}
                  </Text>
                  <Text strong>
                    Máy chọn: {computerChoice} {getIcon(computerChoice)}
                  </Text>
                  <div>
                    Kết quả: {getResultTag(result)}
                  </div>
                </Space>
              </Card>
            )}

            <Card title="Lịch sử đấu">
              <List
                size="small"
                dataSource={history}
                renderItem={(item, index) => (
                  <List.Item>
                    <Space>
                      <Tag>{index + 1}</Tag>
                      <Text>Bạn: {item.player}</Text>
                      <Text>Máy: {item.computer}</Text>
                      {getResultTag(item.result)}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OanTuTi; 