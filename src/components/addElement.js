import React from 'react';
import { useState } from "react";
import { Form, Radio, Upload, Input, Modal, Select, Button, Space } from 'antd';
import { InboxOutlined, MinusCircleOutlined, PlusOutlined, RetweetOutlined, RightOutlined } from '@ant-design/icons';
import Layout from 'antd/lib/layout/layout';


const AddElement = (props) => {

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  const childLayout = {
    wrapperCol: { offset: 5, span: 16 },
  };
  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const [content, setContent] = useState(true);
  const [upload, setUpload] = useState(true);
  const [url, setUrl] = useState(false);

  const changeMediaUploadType = (e) => {
    if (e.target.value === '1') {
      setUpload(true);
      setUrl(false);
    }
    else {
      setUpload(false);
      setUrl(true);
    }
  }

  return (

    <Modal
      title="Agregar Componente"
      centered
      visible={props.visible}
      // onOk={}
      onCancel={props.onClose}
      width={800}
    >
      <Form {...layout}>

        <Form.Item name="tipo" label="Tipo de componente">
          <Select
            onChange={value => 
              { (value === 'Artículo') ? setContent(false) : setContent(true) }}
          >
            <Select.Option value="Total de la ley">Total de la ley</Select.Option>
            <Select.Option value="Título">Título</Select.Option>
            <Select.Option value="Capítulo">Capítulo</Select.Option>
            <Select.Option value="Artículo">Artículo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="padre" label="Componente padre">
          <Select>
            <Select.Option value="prueba 2">prueba 2</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="nombre" label="Nombre del componente">
          <Input />
        </Form.Item>

        <Form.Item name="cuerpo" label="Cuerpo" hidden={content}>
          <Input.TextArea
            allowClear
            autoSize />
        </Form.Item>

        <Form.Item name="media" label="Media">
          <Radio.Group onChange={changeMediaUploadType} defaultValue="1">
            <Radio value="1">link</Radio>
            <Radio value="2">archivo</Radio>
          </Radio.Group>
        </Form.Item>


        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          hidden={upload}
          {...childLayout} >
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Arrastra archivos aquí</p>
            <p className="ant-upload-hint">
              O si lo prefieres haz click para subir uno
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.List name="links" hidden={url} >
          {(fields, { add, remove }) => (
            <>
              {fields.map(field => (
                <Space
                  hidden={url}
                  key={field.key}
                  //style={{ display: 'flex', marginBottom: 8 }}
                  style={{ marginBottom: 8, marginRight: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'first']}
                    fieldKey={[field.fieldKey, 'first']}
                    rules={[{ required: true, message: 'link requerido' }]}
                  >
                    <Input placeholder="Url" style={{ width:'200px' }}/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Form.Item {...childLayout}>
                <Button hidden={url} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Añadir Url
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

      </Form>
    </Modal>



  )
}

export default AddElement;