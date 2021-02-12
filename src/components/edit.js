import React from 'react';
import { useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
import axios from 'axios';

const Edit = (props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  };

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      nombre: props.edit.title,
      cuerpo: props.edit.content,
      nota: props.edit.note
    });
  }, [props.edit]);

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
          .then(async (values) => {
            let url;
            switch (props.edit.type) {
              case 'TÍTULO':
                url = `/api/title/${props.edit._id}`;
                break;
              case 'CAPÍTULO':
                url = `/api/chapter/${props.edit._id}`;
                break;
              case 'ARTÍCULO':
                url = `/api/article/${props.edit._id}`;
                break;
              default:
                break;
            }
            console.log(
              (
                await axios.put(url, values, {
                  headers: { 'auth-token': localStorage.getItem('auth-token') }
                })
              ).data
            );
            form.resetFields();
            props.refresh();
            props.close();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      width={800}
    >
      <Form {...layout} form={form}>
        <Form.Item
          name="nombre"
          label="Nombre del componente"
          rules={[
            { required: true, message: 'Digite el nombre del componente' }
          ]}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          name="cuerpo"
          label="Cuerpo"
          hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
          rules={[
            {
              required: props.edit.type !== 'ARTÍCULO' ? false : true,
              message: 'Digite el cuerpo del artículo'
            }
          ]}
        >
          <Input.TextArea allowClear autoSize />
        </Form.Item>

        <Form.Item
          name="nota"
          label="Nota"
          hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
        >
          <Input.TextArea allowClear autoSize />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Edit;
