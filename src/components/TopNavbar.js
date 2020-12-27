import React from 'react';
import { Button } from 'antd';
import { FileSearchOutlined, BarChartOutlined, LoginOutlined } from '@ant-design/icons';
import '../styles/TopNavbar.css'

const TopNavbar = () => {
    return (

        <div className='top'>
            <img className="logo"alt=""></img>
            <h1 className="title">Aplicación Ley 842</h1>
            <Button
                type="primary"
                shape="round"
                className="buttonTop"
                icon={<FileSearchOutlined />} >
                Reporte
            </Button>
            <Button
                type="primary"
                shape="round"
                className="buttonTop"
                icon={<BarChartOutlined />} >
                Estadísticas
            </Button>
            <Button
                type="primary"
                shape="round"
                className="buttonTop"
                icon={<LoginOutlined />} >
                Iniciar/cerrar sesión
            </Button>

        </div>

    )
}

export default TopNavbar;