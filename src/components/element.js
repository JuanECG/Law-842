import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider, Result } from 'antd';
import '../styles/Element.css';
import React from 'react';


const { Panel } = Collapse;

const Element = (props) => {

    // if element has any child, render each one of them
    if (props.data.hasOwnProperty("child")) {
        return (
            <Collapse>
                <Panel
                    header={
                        props.data.type + ' ' +
                        props.data.id + ': ' +
                        props.data.title}
                >

                    {props.login &&
                        <Button
                            type="link"
                            className="edit"
                            onClick={() => {
                                props.setEdit({
                                    _id: props.data._id, type: props.data.type, title: props.data.title,
                                    content: props.data.content, parent: props.data.parent,
                                    note: props.data.note, visible: true
                                })
                            }}
                            icon={<EditOutlined />} >
                            Editar
                    </Button>
                    }

                    {props.login &&
                        <Button
                            type="link"
                            className="delete"
                            danger
                            icon={<DeleteOutlined />} >
                            Eliminar
                    </Button>
                    }

                    {props.data['child'].map(childData => (
                        <Element                           
                            data={childData}
                            login={props.login}
                            setEdit={props.setEdit} />
                    ))}

                    <p>{props.data.content}</p>
                </Panel>
            </Collapse>
        )
    }
    else {
        // render a single element
        return (

            <Collapse>
                <Panel
                    header={
                        props.data.type + ' ' +
                        props.data.id + ': ' +
                        props.data.title}
                >
                    {props.login &&
                        <Button
                            type="link"
                            className="edit"
                            onClick={() => {
                                props.setEdit({
                                    _id: props.data._id, type: props.data.type, title: props.data.title,
                                    content: props.data.content, parent: props.data.parent,
                                    note: props.data.note, visible: true
                                })
                            }}
                            icon={<EditOutlined />} >
                            Editar
                    </Button>
                    }

                    {props.login &&
                        <Button
                            type="link"
                            className="delete"
                            danger
                            icon={<DeleteOutlined />} >
                            Eliminar
                    </Button>
                    }
                    <Divider className="dividier" />

                    <p>{props.data.content}</p>


                    {props.data.note &&
                        <div>
                            <hr />
                            <p style={{ "font-style": "italic" }}>
                                NOTA: {props.data.note}
                            </p>
                        </div>
                    }
                    {props.data.paragraphs &&
                        <div>
                            {props.data.paragraphs.map((paragraph, index) => (
                                <div>
                                    <hr />
                                    <p>Parágrafo {index + 1}: {paragraph} </p>
                                </div>
                            ))}
                        </div>
                    }

                </Panel>

            </Collapse >

        )
    }

}

export default Element;