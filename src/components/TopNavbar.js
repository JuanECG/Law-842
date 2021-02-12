import React from 'react';
import {
  FileSearchOutlined,
  BarChartOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Button, Typography } from 'antd';
import '../styles/TopNavbar.css';
const { Title } = Typography;

const TopNavbar = (props) => {
  return (
    <div className="top">
      <img className="logo" alt=""></img>
      <Button
        type="text"
        shape="round"
        className="title"
        size="large"
        onClick={props.triggerMain}
      >
        <Title level={1} className="subtitle">
          Aplicación Ley 842
        </Title>
      </Button>
      <Button
        type="primary"
        shape="round"
        className="buttonTop"
        size="large"
        onClick={props.triggerReport}
        icon={<FileSearchOutlined />}
      >
        Reporte
      </Button>
      {props.login && (
        <Button
          type="primary"
          shape="round"
          className="buttonTop"
          size="large"
          onClick={props.triggerStatistics}
          icon={<BarChartOutlined />}
        >
          Estadísticas
        </Button>
      )}

      {props.login ? (
        <Button
          type="primary"
          shape="round"
          className="buttonTop"
          size="large"
          onClick={props.logOut}
          icon={<LoginOutlined />}
        >
          Cerrar Sesión
        </Button>
      ) : (
        <Button
          type="primary"
          shape="round"
          className="buttonTop"
          size="large"
          onClick={props.triggerLog}
          icon={<LoginOutlined />}
        >
          Iniciar sesión
        </Button>
      )}
    </div>
  );
};

export default TopNavbar;
