import "antd/dist/antd.css";
import { useState} from "react";
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TopNavbar from './components/TopNavbar';
import Filter from './components/search';
import Element from './components/element';
import './styles/App.css';

const App = () => {

  const dummy = [
    {
      id: '1',
      type: 'título',
      
      title: 'GENERALIDADES',
      child: [
        {
          id: '1',
          type: 'capítulo',
      
          title: 'DEFINICIÓN Y ALCANCES',
          child: [
            {
              id: 1,
              type: 'artículo',
      
              title: 'CONCEPTO DE INGENIERÍA',
              content: 'Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.'
            }
          ]
        }

      ]
    },
    {
      id: '2',
      type: 'título',
      
      title: 'GENERALIDADES',
      child: [
        {
          id: '1',
          type: 'capítulo',
          
          title: 'DEFINICIÓN Y ALCANCES',
          child: [
            {
              id: 1,
              type: 'artículo',
          
              title: 'CONCEPTO DE INGENIERÍA',
              content: ' Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.'
            }
          ]
        }

      ]
    },
    {
      id: 3,
      type: 'artículo',
      
      title: 'CONCEPTO DE INGENIERÍA',
      content: ' Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.',
    }
  ]

  const [data, setData] = useState(dummy);

  return (
    <div>
      <TopNavbar />
      <Filter />
      <div className="content">

        <Button
          type="primary"
          shape="round"
          className="add"
          icon={<PlusCircleOutlined />} >
          Agregar Componentes
        </Button>


        {
        data.map(data=> (
          <Element 
          type={data.type} 
          title={data.title} 
          id={data.id}
          number={data.number}
          data={data}/>
        ))}

      </div>
    </div>
  );
}

export default App;
