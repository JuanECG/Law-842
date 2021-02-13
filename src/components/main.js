import { usePromiseTracker } from 'react-promise-tracker';
import { PlusCircleOutlined } from '@ant-design/icons';
import Loader from 'react-loader-spinner';
import { Button, Result } from 'antd';
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
    );
  } else if (promiseInProgress) {
    return (
      <div
        style={{
          width: '100%',
          marginTop: '100px',
          height: '100',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Loader type="MutatingDots" color="#1b40e4" height="100" width="100" />
      </div>
    );
  } else {
    return (
      <div className="content">
        {props.login && (
          <Button
            type="primary"
            shape="round"
            className="add"
            size="large"
            onClick={props.addElement}
            icon={<PlusCircleOutlined />}
          >
            Agregar Componente
          </Button>
        )}
        {props.data.map((data) => (
          <Element
            data={data}
            login={props.login}
            setEdit={props.setEdit}
            setDel={props.setDel}
          />
        ))}
      </div>
    );
  }
};

export default Main;
