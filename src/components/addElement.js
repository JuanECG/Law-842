import {
  Form,
  Radio,
  Upload,
  Input,
  Modal,
  Select,
  Button,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';

const AddElement = (props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  };

  const childLayout = {
    wrapperCol: { offset: 8, span: 16 }
  };

  const [content, setContent] = useState(true);
  const [parent, setParent] = useState(true);
  const [items, setItems] = useState([]);
  const [upload, setUpload] = useState(true);
  const [url, setUrl] = useState(false);
  const [form] = Form.useForm();
  const [media, setMedia] = useState([]);

  const changeMediaUploadType = (e) => {
    if (e.target.value === '1') {
      setUpload(true);
      setUrl(false);
    } else {
      setUpload(false);
      setUrl(true);
    }
  };

  const uploadProps = {
    name: 'media',
    multiple: false,
    showUploadList: {
      showDownloadIcon: false
    },
    onRemove: () => {
      setMedia([]);
    },
    beforeUpload: (file) => {
      setMedia([file]);
      return false;
    },
    media
  };

  const normFile = function (e) {
    if (e.fileList.length > 1) return [e.fileList[1]];
    return e && e.fileList;
  };

  return (
    <Modal
      title="Agregar Componente"
      centered
      okText="Agregar"
      cancelText="Cerrar"
      visible={props.visible}
      onCancel={props.close}
      width={800}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const formData = new FormData();
            for (const item of Object.keys(values))
              formData.append(item, values[item]);
            if (values.media) {
              if (values.media[0] && values.media[0] !== 'undefinied')
                formData.set('media', values.media[0]);
              else formData.delete('media'); // removing media file when empty field
            } else formData.delete('media'); // removing media file when empty field
            if (!values.url) formData.delete('url'); // removing url when empty field
            console.log(
              await axios.post('/api/elements', formData, {
                headers: { 'auth-token': localStorage.getItem('auth-token') }
              })
            );
            message.success('¡Se ha creado el componente existosamente!');
            form.resetFields();
            setMedia([]);
            props.refresh();
            props.close();
          })
          .catch((info) => {
            // add alert
            console.log('Validate Failed:', info);
            message.error('¡Error!, el elemento tiene elementos hijos');
          });
      }}
    >
      <Form {...layout} form={form}>
        <Form.Item
          name="tipo"
          label="Tipo de componente"
          rules={[{ required: true, message: 'Seleccione tipo de componente' }]}
        >
          <Select
            onChange={async (value) => {
              value !== 'TÍTULO' ? setParent(false) : setParent(true);

              if (value === 'CAPÍTULO')
                setItems((await axios(`/api/list/TÍTULO`)).data);

              if (value === 'ARTÍCULO') {
                setContent(false);
                setItems((await axios(`/api/list/CAPÍTULO`)).data);
              } else setContent(true);
            }}
          >
            <Select.Option value="TÍTULO">Título</Select.Option>
            <Select.Option value="CAPÍTULO">Capítulo</Select.Option>
            <Select.Option value="ARTÍCULO">Artículo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="padre"
          label="Componente padre"
          hidden={parent}
          rules={[
            { required: !parent, message: 'Seleccione el componente padre' }
          ]}
        >
          <Select>
            {items.map((item) => (
              <Select.Option value={item._id}>{item.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>

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
          hidden={content}
          rules={[
            { required: !content, message: 'Digite el cuerpo del artículo' }
          ]}
        >
          <Input.TextArea allowClear autoSize />
        </Form.Item>

        <Form.Item label="Media">
          <Radio.Group onChange={changeMediaUploadType} defaultValue="1">
            <Radio value="1">link</Radio>
            <Radio value="2">archivo</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          hidden={upload}
          {...childLayout}
          getValueFromEvent={normFile}
          valuePropName="fileList"
          name="media"
        >
          <Upload {...uploadProps} listType="picture">
            <Button icon={<PlusOutlined />}>Seleccione archivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="url" hidden={url} label="Link Media">
          <Input allowClear defaultValue="" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddElement;
