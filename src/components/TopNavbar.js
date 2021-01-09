import React from 'react';
import { Button, Typography } from 'antd';
import { FileSearchOutlined, BarChartOutlined, LoginOutlined } from '@ant-design/icons';
import '../styles/TopNavbar.css'
const { Title } = Typography;


const TopNavbar = (props) => {
    return (

        <div className='top'>
            <img className="logo" alt=""></img>
            <Button
                type="text"
                shape="round"
                className="title"
                size="large"
                onClick={props.triggerMain}
            // icon={<FileSearchOutlined />}
            >
                <Title level={1} className="subtitle">Aplicación Ley 842</Title>

            </Button>
            <Button
                type="primary"
                shape="round"
                className="buttonTop"
                size="large"
                onClick={props.triggerReport}
                icon={<FileSearchOutlined />} >
                Reporte
            </Button>
            <Button
                type="primary"
                shape="round"
                className="buttonTop"
                size="large"
                onClick={props.triggerStatistics}
                icon={<BarChartOutlined />} >
                Estadísticas
            </Button>
            <Button
                type="primary"
                shape="round"
                className="buttonTop"
                size="large"
                onClick={props.triggerLog}
                icon={<LoginOutlined />} >
                Iniciar sesión
            </Button>

        </div>

    )
}

export default TopNavbar;