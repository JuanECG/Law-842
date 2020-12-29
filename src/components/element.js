import React from 'react';
import { Button, Collapse, Divider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/Element.css';


const { Panel } = Collapse;

const Element = (props) => {

    // if element has any child, render each one of them
    if (props.data.hasOwnProperty("child")) {
        { console.log(props.id); }
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

            // <Collapse >
            //     <Panel id="article" header="Título 1: Generalidades" key="1">
            //         <Collapse defaultActiveKey="1">
            //             <Panel header="Capítulo 1: Definición y alcances " key="1">
            //                 <p>Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.</p>
            //             </Panel>
            //         </Collapse>
            //     </Panel>
            // </Collapse>

        )
    }
}

export default Element;