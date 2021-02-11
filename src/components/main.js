import { usePromiseTracker } from "react-promise-tracker";
import { PlusCircleOutlined } from '@ant-design/icons';
import Loader from 'react-loader-spinner';
import { Button, Result } from 'antd';
import { useState } from "react";
import Element from './element';


const Main = (props) => {

    const data = props.data.length;

    const { promiseInProgress } = usePromiseTracker();

    if (!promiseInProgress && data === 0) {
        return (
            <Result
                status="warning"
                title="No se han encontrado elementos que coincidan con su búsqueda."
            />
        )
    }

    else if (promiseInProgress) {
        return(
        <div
            style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Loader type="MutatingDots" color="#1b40e4" height="100" width="100" />
        </div>)
    }

    else {
        return(
        <div className="content">

            <Button
                type="primary"
                shape="round"
                className="add"
                size="large"
                onClick={props.addElement}
                icon={<PlusCircleOutlined />} >
                Agregar Componente
            </Button>

            {props.data.map(data => (
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

    
}

export default Main