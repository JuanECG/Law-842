import React from 'react';
import { Row, Col } from 'antd';



const Statsitics = () => {


  return (
    <div className="content">
      <Row gutter={[8, 8]}>
        <Col span={12} className="column">
          first
        </Col>
        <Col span={12} className="column">
          second
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col span={12} className="column">
          third
        </Col>
        <Col span={12} className="column">
          fourth
        </Col>
      </Row>
    </div>
  )

}

export default Statsitics;




