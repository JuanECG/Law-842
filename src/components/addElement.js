import React from 'react';
import { useState } from "react";
import { Form, Dropdown, Button, Input, Modal } from 'antd';
import { DownOutlined, UserOutlined, SearchOutlined, RetweetOutlined, RightOutlined } from '@ant-design/icons';
import '../styles/Filter.css'

const AddElement = (props) => {


  return (

    <Modal
      title="Modal 1000px width"
      centered
      visible={props.visible}
      // onOk={}
      onCancel={props.onClose}
      width={1000}
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </Modal>


    // <Form>

    //   <Form.Item label="Address">
    //   <Input.Group compact>
    //     <Form.Item
    //       name={['address', 'province']}
    //       noStyle
    //       rules={[{ required: true, message: 'Province is required' }]}
    //     >
    //       <Select placeholder="Select province">
    //         <Option value="Zhejiang">Zhejiang</Option>
    //         <Option value="Jiangsu">Jiangsu</Option>
    //       </Select>
    //     </Form.Item>
    //     <Form.Item
    //       name={['address', 'street']}
    //       noStyle
    //       rules={[{ required: true, message: 'Street is required' }]}
    //     >
    //       <Input style={{ width: '50%' }} placeholder="Input street" />
    //     </Form.Item>
    //   </Input.Group>
    // </Form.Item>


    // </Form>
  )
}

export default AddElement;