import { Button, Collapse, Divider, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
import '../styles/Element.css';
import React from 'react';

const { Panel } = Collapse;

const Element = (props) => {
  // if element has any child, render each one of them
  if (props.data.hasOwnProperty('child')) {
    return (
      <Collapse>
        <Panel
          header={
            props.data.type + ' ' + props.data.id + ': ' + props.data.title
          }
        >
          {props.login && (
            <Button
              type="link"
              className="edit"
              onClick={() => {
                props.setEdit({
                  _id: props.data._id,
                  type: props.data.type,
                  title: props.data.title,
                  content: props.data.content,
                  parent: props.data.parent,
                  note: props.data.note,
                  url: props.data.url,
                  paragraphs: props.data.paragraphs,
                  visible: true
                });
              }}
              icon={<EditOutlined />}
            >
              Editar
            </Button>
          )}

          {props.login && (
            <Button
              type="link"
              className="delete"
              danger
              onClick={() => {
                props.setDel({
                  _id: props.data._id,
                  type: props.data.type,
                  visible: true
                });
              }}
              icon={<DeleteOutlined />}
            >
              Eliminar
            </Button>
          )}

          <p>{props.data.content}</p>

          <div className="contentParent" style={{ justifyContent: 'center' }}>
            {props.data.media && (
              <Image
                width={200}
                style={{
                  flexGrow: 1,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: '10px'
                }}
                src={props.data.media}
              />
            )}
            {props.data.url && (
              <ReactPlayer
                url={props.data.url}
                width="420px"
                height="200px"
                style={{ marginBottom: '10px' }}
              />
              // marginLeft="auto" marginRight="auto"
            )}
          </div>
          {props.data['child'].map((childData) => (
            <Element
              data={childData}
              login={props.login}
              setEdit={props.setEdit}
              setDel={props.setDel}
            />
          ))}
        </Panel>
      </Collapse>
    );
  } else {
    // render a single element
    return (
      <Collapse>
        <Panel
          header={
            props.data.type + ' ' + props.data.id + ': ' + props.data.title
          }
        >
          {props.login && (
            <Button
              type="link"
              className="edit"
              onClick={() => {
                props.setEdit({
                  _id: props.data._id,
                  type: props.data.type,
                  title: props.data.title,
                  content: props.data.content,
                  parent: props.data.parent,
                  note: props.data.note,
                  paragraphs: props.data.paragraphs,
                  url: props.data.url,
                  visible: true
                });
              }}
              icon={<EditOutlined />}
            >
              Editar
            </Button>
          )}
          {props.login && (
            <Button
              type="link"
              className="delete"
              danger
              onClick={() => {
                props.setDel({
                  _id: props.data._id,
                  type: props.data.type,
                  visible: true
                });
              }}
              icon={<DeleteOutlined />}
            >
              Eliminar
            </Button>
          )}
          <Divider className="dividier" />
          <div className="contentParent">
            <div className="content">
              <p>{props.data.content}</p>

              {props.data.note && (
                <div>
                  <hr />
                  <p style={{ 'font-style': 'italic' }}>
                    NOTA: {props.data.note}
                  </p>
                </div>
              )}
              {props.data.paragraphs && (
                <div>
                  {props.data.paragraphs.map((paragraph, index) => (
                    <div>
                      <hr />
                      <p>
                        Parágrafo {index + 1}: {paragraph}{' '}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {props.data.media && (
              <Image
                width={200}
                style={{ flexGrow: 1 }}
                src={props.data.media}
              />
            )}
            {props.data.url && (
              <ReactPlayer url={props.data.url} width="420px" height="300px" />

              //<iframe src={props.data.url} width='420'></iframe>
              //   <Paragraph  copyable>{props.data.url}</Paragraph >
              // <div style={{ display: 'flex', flexDirection: 'column' }}>
              //   <Button>
              //     <p>Abrir link</p>
              //   </Button>
              // </div>
            )}
          </div>
        </Panel>
      </Collapse>
    );
  }
};

export default Element;
