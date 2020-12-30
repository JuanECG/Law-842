import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TopNavbar from './components/TopNavbar';
import Filter from './components/filter';
import Element from './components/element';
import AddElement from './components/addElement';
import './styles/App.css';

const App = () => {

  const dummy = [
    {
      id: '1',
      type: 'TÍTULO',

      title: 'GENERALIDADES',
      child: [
        {
          id: '1',
          type: 'CAPÍTULO',

          title: 'DEFINICIÓN Y ALCANCES',
          child: [
            {
              id: 1,
              type: 'ARTÍCULO',

              title: 'CONCEPTO DE INGENIERÍA',
              content: 'Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.'
            }
          ]
        }

      ]
    },
    {
      id: '2',
      type: 'TÍTULO ',

      title: 'GENERALIDADES',
      child: [
        {
          id: '1',
          type: 'CAPÍTULO',

          title: 'DEFINICIÓN Y ALCANCES',
          child: [
            {
              id: 1,
              type: 'ARTÍCULO',

              title: 'CONCEPTO DE INGENIERÍA',
              content: ' Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.'
            }
          ]
        }

      ]
    },
    {
      id: 3,
      type: 'ARTÍCULO',

      title: 'CONCEPTO DE INGENIERÍA',
      content: ' Se entiende por ingeniería toda aplicación de las ciencias físicas, químicas y matemáticas; de la técnica industrial y en general, del ingenio humano, a la utilización e invención sobre la materia.',
    }
  ]

  const [data, setData] = useState(dummy);

  const [api, setApi] = useState("");

  const [statistics, setStatistics] = useState(false);

  const [report, setReport] = useState(false);

  useEffect(() => {
    getResponse();
  }, [api]);
  
  const getResponse = async () => {
    const response = await fetch(`/api`);
    const data = await response.text();

    setApi(data);
    console.log(data);
  };

 
  return (
    <div>
      <TopNavbar
        triggerStatistics={()=> (setStatistics(!statistics))}
        triggerReport={()=>(setReport(true))}
      />
      <Filter />
      
      <div className="content">

        <Button
          type="primary"
          shape="round"
          className="add"
          size="large"
          icon={<PlusCircleOutlined />} >
          {api}
        </Button>

        <Button
          type="primary"
          shape="round"
          className="add"
          size="large"
          icon={<PlusCircleOutlined />} >
          Agregar Componentes
        </Button>

        {
          data.map(data => (
            <Element
              type={data.type}
              title={data.title}
              id={data.id}
              number={data.number}
              data={data} />
          ))}

      </div>

      <AddElement
        visible={report}
        onClose={()=> (setReport(false))}
      />

    </div>
  );
}

export default App;
