import { Form, Radio, Upload, Input, Modal, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';

const Edit = (props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  };

  const childLayout = {
    wrapperCol: { offset: 8, span: 16 }
  };

  const [form] = Form.useForm();
  const [upload, setUpload] = useState(true);
  const [url, setUrl] = useState(false);
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

  const normFile = function (e) {
    if (e.fileList.length > 1) return [e.fileList[1]];
    return e && e.fileList;
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

  useEffect(() => {
    form.setFieldsValue({
      nombre: props.edit.title,
      cuerpo: props.edit.content,
      nota: props.edit.note,
      url: props.edit.url
    });
    if (props.edit.paragraphs && props.edit.paragraphs.length > 0)
      form.setFieldsValue({ paragrafos: props.edit.paragrafos });
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
            const formData = new FormData();
            for (const item of Object.keys(values))
              formData.append(item, values[item]);
            // removing media file when empty field
            if (!values.media) formData.delete('media');
            else formData.set('media', values.media[0].originFileObj);
            if (!values.url) formData.delete('url'); // removing url when empty field
            if (!values.note) formData.delete('note'); // removing note when empty field
            if (values.paragrafos) {
              // removing paragraphs when empty field
              if (values.paragrafos.length === 0) formData.delete('paragrafos');
              else formData.set('paragrafos', values.paragrafos);
            } else formData.delete('paragrafos');
            console.log(
              await axios.put(url, formData, {
                headers: {
                  'auth-token': localStorage.getItem('auth-token')
                }
              })
            );
            message.success('¡Se ha editado el componente existosamente!');
            form.resetFields();
            setMedia([]);
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

        <Form.List
          name="paragrafos"
          hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Form.Item
                  key={field.key}
                  label="Parágrafo"
                  name={[field.name]}
                >
                  <Form.Item
                    {...field}
                    rules={[{ required: true, message: 'Parágrafo requerido' }]}
                    noStyle
                  >
                    <Input allowClear />
                  </Form.Item>
                  <Button
                    onClick={() => remove(field.name)}
                    style={{ marginTop: '4px' }}
                    danger
                  >
                    Borrar
                  </Button>
                </Form.Item>
              ))}
              <Form.Item {...childLayout}>
                <Button
                  hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Añadir Parágrafo
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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

export default Edit;
