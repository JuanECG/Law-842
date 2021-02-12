import React from 'react';
import { useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
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
                //console.log(props.del);   
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
                    console.log((await axios.delete(url, { headers: { 'auth-token': localStorage.getItem('auth-token') } })))
                    props.refresh();
                    props.close();
                } catch (error) {
                    console.log(error);
                }
                finally {
                    props.refresh();
                    props.close();
                }

            }}
            width={800}
        >
            <p>Está acción no se puede deshacer, ¿Está seguro?</p>
        </Modal>
    )

}
export default Delete;