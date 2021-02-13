import React from 'react';
import { useEffect, useState } from 'react';
import { Form, Radio, Upload, Input, Modal, message, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const Edit = (props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
  };

  const childLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
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
      paragrafos: props.edit.paragraphs,
      url: props.edit.url
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
            const formData = new FormData();
            for (const item of Object.keys(values))
              formData.append(item, values[item]);
            formData.set('media', media[0]); // validation media file
            if (formData.get('url') === 'undefined') formData.delete('url'); // removing url when empty field
            if (values.paragrafos.length === 0) formData.delete('paragrafos');
            console.log(
              await axios.put(url, formData, {
                headers: { 'auth-token': localStorage.getItem('auth-token') }
              })
            );
            message.success('¡Se ha editado el componente existosamente!');
            form.resetFields();
            setMedia([]);
            props.refresh();
            props.close();
            // console.log(
            //   (
            //     await axios.put(url, values, {
            //       headers: { 'auth-token': localStorage.getItem('auth-token') }
            //     })
            //   ).data
            // );            
            // console.log(values);
            // 
            // form.resetFields();
            // props.refresh();
            // props.close();
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

          hidden={props.edit.type !== 'ARTÍCULO' ? true : false} >

          {(fields, { add, remove }) => (
            <>
              {fields.map(field => (
                // <Space
                //   hidden={props.edit.type !== 'ARTÍCULO' ? true : false}
                //   key={field.key}
                //   {...formItemLayout}
                //   style={{ marginLeft: 40, display: 'flex', justifyContent: 'space-around' }}
                //   //style={{ alignSelf:'flex-end' }}
                //   //style={{ marginBottom: 8, marginRight: 8 }}
                //   align="baseline"
                // >

                <Form.Item
                  key={field.key}
                  label="Parágrafo"
                  name={[field.name]}>
                  <Form.Item
                    {...field}
                    // key={field.key}
                    // label="Parágrafo"
                    // name={[field.name]}
                    rules={[{ required: true, message: 'Parágrafo requerido' }]}
                    noStyle
                  >

                    <Input allowClear />

                  </Form.Item>
                  <Button
                    onClick={() => remove(field.name)}
                    style={{ marginTop: '4px' }}
                    danger>
                    Borrar
                  </Button>

                </Form.Item>


                //  </Space>
              ))}
              <Form.Item {...childLayout}>
                <Button hidden={props.edit.type !== 'ARTÍCULO' ? true : false} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
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

        <Form.Item hidden={upload} {...childLayout} >
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
