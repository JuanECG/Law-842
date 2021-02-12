import React, { useState } from 'react';
import { Input, Modal, Form, Select, } from 'antd';
import axios from 'axios';

const Edit = (props) => {

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 }
    };

    const [form] = Form.useForm();

    return (
        <Modal
            title="Editar Componente"
            centered
            okText="Editar"
            cancelText="Cerrar"
            visible={props.visible}
            onCancel={props.close}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        console.log(values);
                        form.resetFields();
                        props.refresh();
                        props.close();
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
            width={800}
        >
            <Form {...layout} form={form} >

                <Form.Item
                    name="padre"
                    label="Componente padre"
                    hidden={props.edit.type !== 'TÍTULO' ? false : true}
                    rules={[{
                        required: props.edit.type !== 'TÍTULO' ? true : false,
                        message: "Seleccione el componente padre"
                    }]}
                >
                    <Select
                        // value={
                        //     props.itemsEdit.find((item) => (
                        //         item._id === props.edit.parent
                        //     ))._id
                        // }
                        options={
                            props.itemsEdit.map((item) => (
                                { label: item.title, value: item._id }
                            ))
                        }>
                        {/* {props.itemsEdit.map((item) => (                            
                            <Select.Option value={item._id}>{item.title}</Select.Option>
                        ))} */}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="nombre"
                    label="Nombre del componente"
                    rules={[{ required: true, message: "Digite el nombre del componente" }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="cuerpo"
                    label="Cuerpo"
                    hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
                    rules={[{
                        required: props.edit.type !== 'ARTÍCULO' ? false : true,
                        message: "Digite el cuerpo del artículo"
                    }]}>
                    <Input.TextArea
                        allowClear
                        autoSize />
                </Form.Item>

                <Form.Item
                    name="nota"
                    label="Nota"
                    hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
                >
                    <Input.TextArea
                        allowClear
                        autoSize />
                </Form.Item>

            </Form>

        </Modal>
    )
}


export default Edit;