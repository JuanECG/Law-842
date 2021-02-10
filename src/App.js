import "antd/dist/antd.css";

import { trackPromise } from 'react-promise-tracker';
import { useState, useEffect } from "react";

import AddElement from './components/addElement';
import Statistics from './components/statistic';
import TopNavbar from './components/TopNavbar';
import Filter from './components/filter';
import Report from './components/report';
import Main from './components/main';
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
  const [data, setData] = useState([]);

  // const [api, setApi] = useState("");

  // main navbar useState variables
  const [report, setReport] = useState(false);

  const [main, setMain] = useState(true);

  const [log, setLog] = useState(false);

  const [url, setUrl] = useState('elements');

  // body useState variables
  const [addElement, setAddElement] = useState(false);

  useEffect(() => {
    getResponse();
  }, [url]);

  const getResponse = async () => {
    const response = await trackPromise(fetch(`/api/${url}`));
    const data = await response.json();

    setData(data);
    console.log(url);
    console.log(data);
  };

  //trackPromise(getResponse());  

  return (
    <div>

      <TopNavbar
        triggerMain={() => (setMain(true))}
        triggerStatistics={() => (setMain(false))}
        triggerReport={() => (setReport(true))}
        triggerLog={() => (setLog(true))}
      />

      <Filter
      triggerFilter={(url) => (setUrl(url))}
      visible={main} />

      {/* show main content or statistics content depending on
          main variable status */}
      {main
      ?<Main
        addElement={()=>(setAddElement(true))}
        data={data}
      />

      :<Statistics/>
      }


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
        title="Iniciar Sesión"
        visible={log}
        onClose={() => (setLog(false))}
      />

    </div>
  );
}

export default App;
