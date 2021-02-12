import React, { useState } from 'react';
import { Select, Modal, Form } from 'antd';
import FileSaver from 'file-saver';
import axios from 'axios';

const Report = (props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  };

  const [comp, setComp] = useState(true);

  const [items, setItems] = useState([]);

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
          .then((values) => {
            const headers = {
              Accept: 'application/pdf'
            };
            if (localStorage.getItem('auth-token'))
              headers['auth-token'] = localStorage.getItem('auth-token');
            console.log(headers);
            axios
              .post(`/api/report`, values, {
                responseType: 'arraybuffer',
                headers: headers
              })
              .then((response) => {
                FileSaver.saveAs(
                  new Blob([response.data], { type: 'application/pdf' }),
                  `report.pdf`
                );
              });

            form.resetFields();
            props.close();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form {...layout} form={form} initialValues={{ type: 'TODO' }}>
        <Form.Item name="type" label="Tipo de componente">
          <Select
            defaultValue="TODO"
            onChange={async (value) => {
              if (value === 'TODO') setComp(true);
              else {
                setComp(false);
                setItems((await axios(`/api/list/${value}`)).data);
              }
            }}
          >
            <Select.Option value="TODO">Total de la ley</Select.Option>
            <Select.Option value="TÍTULO">Título</Select.Option>
            <Select.Option value="CAPÍTULO">Capítulo</Select.Option>
            <Select.Option value="ARTÍCULO">Artículo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="elements" label="Componentes a incluir" hidden={comp}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Seleccione los componentes"
          >
            {items.map((item) => (
              <Select.Option value={item._id}>{item.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Report;
