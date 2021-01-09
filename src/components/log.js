import React, { useState } from 'react';
import { Input, Modal, Form, Button } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';


const Log = (props) => {

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };

    return (
        <Modal
            title={props.title}
            centered
            visible={props.visible}
            // onOk={}
            onCancel={props.onClose}
            footer={[
                <Button
                    key="back"
                    onClick={props.onClose}
                >
                    Cerrar
                </Button>,
                <Button
                    key="login"
                    type="primary"
                // onClick={this.handleOk}
                >
                    Login
                </Button>,
            ]}
            width={400}
        >

            <Form {...layout}>

                <Form.Item name="username" label="Usuario">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Contraseña">
                    <Input.Password
                        placeholder="*********"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

            </Form>

        </Modal>

    )

}

export default Log;