import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TopNavbar from './components/TopNavbar';
import Filter from './components/filter';
import Element from './components/element';
import AddElement from './components/addElement';
import Report from './components/report';
import Log from './components/log';
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

  // backend useState variables
  const [data, setData] = useState(dummy);

  const [api, setApi] = useState("");
  
  // main navbar useState variables
  const [report, setReport] = useState(false);

  const [statistics, setStatistics] = useState(false);

  const [log, setLog] = useState(false);  

  // body useState variables
  const [addElement, setAddElement] = useState(false);

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
        triggerStatistics={() => (setStatistics(true))}
        triggerReport={() => (setReport(true))}
        triggerLog={()=>(setLog(true))}
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
          onClick={() => (setAddElement(true))}
          icon={<PlusCircleOutlined />} >
          Agregar Componente
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
        visible={addElement}
        onClose={() => (setAddElement(false))}
      />

      <Report
        visible={report}
        onClose={() => (setReport(false))}
      />

      <Log
        title="log(in?out?)"
        visible={log}
        onClose={() => (setLog(false))}
      />

    </div>
  );
}

export default App;
