import React, { useState } from 'react';
import { Input, Modal, Form, Button } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';


const Log = (props) => {

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };

    const getToken = async (data) => {      
        const response = await axios.post('/api/user/login', data);
        localStorage.setItem('auth-token', response.data );  
        props.setLogin();      
    }

    const [form] = Form.useForm();
    return (
        <Modal
            title="Iniciar Sesión"
            centered
            okText="Login"
            cancelText="Cerrar"
            visible={props.visible}
            onCancel={props.close}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        getToken(values);
                        props.close();
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}            
            width={400}
        >

            <Form {...layout} form={form}>

                <Form.Item name="email" label="Usuario">
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