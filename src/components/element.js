import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Collapse, Divider, Result } from 'antd';
import '../styles/Element.css';


const { Panel } = Collapse;

const Element = (props) => {

    // if element has any child, render each one of them
    if (props.data.hasOwnProperty("child")) {
        return (
            <Collapse>
                <Panel                   
                    header={
                        props.type + ' ' +
                        props.id + ': ' +
                        props.title}
                    >

                    {props.login &&
                    <Button                                                    
                            type="link"
                            className="edit"
                            onClick={props.triggerEdit(props._id,props.type)}
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
                            _id={childData._id}
                            type={childData.type}
                            title={childData.title}
                            id={childData.id}
                            data={childData}
                            login={props.login}
                            triggerEdit = {props.triggerEdit} />
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
                        props.type + ' ' +
                        props.id + ': ' +
                        props.title}
                >
                    {props.login &&
                    <Button                                        
                            type="link"
                            className="edit"
                            onClick={props.triggerEdit(props._id,props.type)}
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