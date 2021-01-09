import React, { useState } from 'react';
import { Select, Modal, Form, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';


const Report = (props) => {

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };

    const [comp, setComp] = useState(true);

    return (
        <Modal
            title="Reporte"
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
                    key="generate"
                    type="primary"
                    // onClick={this.handleOk}
                >
                    Login
                </Button>,
            ]}
            width={600}
        >

            <Form {...layout}>

                <Form.Item name="tipo" label="Tipo de componente">
                    <Select
                        defaultValue="Total de la ley"
                        onChange={value => 
                            { (value === 'Total de la ley') ? setComp(true) : setComp(false) }}
                        
                    >
                        <Select.Option value="Total de la ley">Total de la ley</Select.Option>
                        <Select.Option value="Título">Título</Select.Option>
                        <Select.Option value="Capítulo">Capítulo</Select.Option>
                        <Select.Option value="Artículo">Artículo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="componente" label="Componentes a incluir" hidden={comp}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Seleccione los componentes"
                        //onChange={handleChange}
                    >
                        <Select.Option value="prueba 1">prueba 1</Select.Option>
                        <Select.Option value="prueba 2">prueba 2</Select.Option>
                        <Select.Option value="prueba 3">prueba 3</Select.Option>
                    </Select>
                </Form.Item>

            </Form>

        </Modal>

    )

}

export default Report;