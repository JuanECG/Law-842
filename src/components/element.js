import React from 'react';
import { Button, Collapse, Divider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/Element.css';


const { Panel } = Collapse;

const Element = (props) => {

    // if element has any child, render each one of them
    if (props.data.hasOwnProperty("child")) {
        return (
            <Collapse>
                <Panel
                    id={props.type}
                    header={
                        props.type + ' ' +
                        props.id + ': ' +
                        props.title}
                    id={props.id}>

                    <Button
                        type="link"                    
                        className="edit"
                        icon={<EditOutlined />} >
                        Editar
                    </Button>

                    <Button
                        type="link"
                        className="delete"
                        danger
                        icon={<DeleteOutlined />} >
                        Eliminar
                    </Button>

                    {props.data['child'].map(childData => (
                        <Element
                            type={childData.type}
                            title={childData.title}
                            id={childData.id}
                            data={childData} />
                    ))}

                    <p>{props.data.content}</p>
                </Panel>
            </Collapse>
        )
    } else {
        // render a single element
        return (

            <Collapse>
                <Panel
                    id={props.type}
                    header={
                        props.type + ' ' +
                        props.id + ': ' +
                        props.title}
                    id={props.id}>

                    <Button
                        type="link"                        
                        className="edit"
                        icon={<EditOutlined />} >
                        Editar
                    </Button>

                    <Button
                        type="link"                        
                        className="delete"
                        danger
                        icon={<DeleteOutlined />} >
                        Eliminar
                    </Button>
                    
                    <Divider className="dividier"/>
                    
                    <p>{props.data.content}</p>

                </Panel>

            </Collapse >

        )
    }
}

export default Element;