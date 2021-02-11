import React, { useState, useEffect } from 'react';
import { Select, Modal, Form, Button } from 'antd';
import axios from 'axios';
const FileDownload = require('js-file-download');


const Report = (props) => {

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };

    const [comp, setComp] = useState(true);

    const [items, setItems] = useState([]);

    useEffect(()=>{
        console.log(items);
    }, [items])

    const [form] = Form.useForm();

    return (
        <Modal
            title="Reporte"
            centered
            visible={props.visible}
            okText="Generar Reporte"
            cancelText="Cerrar"            
            onCancel={props.close}
            width={600}
            onOk={() => {
                form        
                    .validateFields()            
                    .then(async(values) => {
                        const response = await axios.post(`/api/report`,values);
                        FileDownload(response.data, 'report.pdf');              
                        form.resetFields();
                        props.close();
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}      
        >

            <Form {...layout} form={form}>

                <Form.Item name="type" label="Tipo de componente">
                    <Select
                        defaultValue="TODO"
                        onChange={async(value) => 
                            {
                                (value === 'TODO') ? setComp(true) : setComp(false);

                                if (value === 'TODO') setComp(true)
                                else {
                                    setComp(false);
                                    setItems((await axios(`/api/list/${value}`)).data)                                    
                                }                                                                                       
                            }}                        
                    >
                        <Select.Option value="TODO" >Total de la ley</Select.Option>
                        <Select.Option value="TÍTULO" >Título</Select.Option>
                        <Select.Option value="CAPÍTULO" >Capítulo</Select.Option>
                        <Select.Option value="ARTÍCULO" >Artículo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name="elements" label="Componentes a incluir" hidden={comp}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Seleccione los componentes"
                        //onChange={handleChange}
                    >
                        {items.map(item=>(
                            <Select.Option value={item._id}>{item.title}</Select.Option>
                        ))}
                        
                    </Select>
                </Form.Item>

            </Form>

        </Modal>

    )

}

export default Report;