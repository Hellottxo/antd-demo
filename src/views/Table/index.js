import React from 'react';
import FlexTable from '../../components/FlexTable';
import { Row, Col } from 'antd';
import './index.less';

const initializeData = (count) => {
  const columns = [];
  const dataSource = new Array(count);
  const data = {};
  for (let i = 0; i < count; i++) {
    columns.push({ dataIndex: i, title: `列${i + 1}`, width: 100 });
    data[i] = i + 1;
  }
  dataSource.fill(data);
  return {
    columns, dataSource: dataSource.map((e, i) => ({ ...e, key: i }))
  };
}

const { columns, dataSource } = initializeData(10);

const TableDisplay = () => {
  return (
    <div className="table-display">
      <Row gutter={[16, 16]} className="row">
        <Col span={6}>
          <FlexTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </Col>
        <Col span={18}>
          <FlexTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </Col>
      </Row >
      <Row gutter={[16, 16]} className="row">
        <Col span={13}>
          <FlexTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </Col>
        <Col span={11}>
          <FlexTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </Col>
      </Row >
    </div>
  )
}

export default TableDisplay;
