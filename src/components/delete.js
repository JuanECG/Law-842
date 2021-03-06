import React from 'react';
import { Modal, message } from 'antd';
import axios from 'axios';

const Delete = (props) => {
  return (
    <Modal
      title="Borrar Componente"
      centered
      okText="Borrar"
      cancelText="Cerrar"
      visible={props.visible}
      onCancel={props.close}
      onOk={async () => {
        let url;
        switch (props.del.type) {
          case 'TÍTULO':
            url = `/api/title/${props.del._id}`;
            break;
          case 'CAPÍTULO':
            url = `/api/chapter/${props.del._id}`;
            break;
          case 'ARTÍCULO':
            url = `/api/article/${props.del._id}`;
            break;
          default:
            break;
        }
        try {
          console.log(
            await axios.delete(url, {
              headers: { 'auth-token': localStorage.getItem('auth-token') }
            })
          );
          message.success('¡Se ha eliminado el componente existosamente!');
          props.refresh();
        } catch (error) {
          if (error.response.data === 'Error: Title has child') {
            console.log('Error: Título tiene elementos hijos');
            message.error('¡Error!, el Título tiene elementos hijos');
          } else if (error.response.data === 'Error: Chapter has child') {
            console.log('Error: Capítulo tiene elementos hijos');
            message.error('¡Error!, el Capítulo tiene elementos hijos');
          } else console.log(error.response);
        } finally {
          props.close();
        }
      }}
      width={800}
    >
      <p>Está acción no se puede deshacer, ¿Está seguro?</p>
    </Modal>
  );
};
export default Delete;
