import "antd/dist/antd.css";
import { useState, useEffect } from "react";
import { Button, Statistic } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TopNavbar from './components/TopNavbar';
import Filter from './components/filter';
import Main from './components/main';
import Statistics from './components/statistic';
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

  const [main, setMain] = useState(true);

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
        triggerMain={() => (setMain(true))}
        triggerStatistics={() => (setMain(false))}
        triggerReport={() => (setReport(true))}
        triggerLog={() => (setLog(true))}
      />

      <Filter visible={main}/>

      <Main
        addElement={()=>(setAddElement(true))}
        data={data}
        api={api}
        visible={main}
      />

      <Statistics isMainVisible={main}/>


      {/* modals */}
      
      <AddElement
        visible={addElement}
        onClose={() => (setAddElement(false))}
      />

      <Report
        visible={report}
        onClose={() => (setReport(false))}
      />

      <Log
        visible={log}
        onClose={() => (setLog(false))}
      />

    </div>
  );
}

export default App;
