import React from 'react';
import { useState } from "react";
import { Menu, Dropdown, Button, Input, Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import '../styles/Element.css';
import Password from 'antd/lib/input/Password';

const { Panel } = Collapse;

const Element = (props) => {

    let hasChildElements = false;
    let childData;

    

    if (props.data.hasOwnProperty("child")) {
        {console.log(props.id);}
        return (
            <Collapse>
                <Panel
                    id={props.type}
                    header={props.title}
                    id={props.id}>
                    
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
        return (
            
            <Collapse>
                <Panel
                    id={props.type}
                    header={props.type + props.id + props.title}
                    id={props.id}>
                        <p>{props.data.content}</p>
                </Panel>
            </Collapse>

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