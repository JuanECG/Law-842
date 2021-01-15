import { useState, useEffect } from "react";
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import Element from './element';


const Main = (props) => {

    if (!props.visible) {
        return null;
    }

    return (
        <div className="content">

            <Button
                type="primary"
                shape="round"
                className="add"
                size="large"
                icon={<PlusCircleOutlined />} >
                {props.api}
            </Button>

            <Button
                type="primary"
                shape="round"
                className="add"
                size="large"
                onClick={props.addElement}
                icon={<PlusCircleOutlined />} >
                Agregar Componente
        </Button>

            {
                props.data.map(data => (
                    <Element
                        type={data.type}
                        title={data.title}
                        id={data.id}
                        number={data.number}
                        data={data} />
                ))}

        </div>



    )



}

export default Main