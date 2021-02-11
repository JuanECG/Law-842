import "antd/dist/antd.css";

import { trackPromise } from 'react-promise-tracker';
import { useState, useEffect } from "react";
import axios from 'axios';

import AddElement from './components/addElement';
import Statistics from './components/statistic';
import TopNavbar from './components/TopNavbar';
import Filter from './components/filter';
import Report from './components/report';
import Edit from './components/edit';
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

  // clave token: auth-token val: post axios response...

  // main navbar useState variables
  const [report, setReport] = useState(false);

  const [main, setMain] = useState(true);

  const [log, setLog] = useState(false);

  const [url, setUrl] = useState('elements'); 

  const [login, setLogin] = useState(localStorage.getItem('auth-token')); 

  // body useState variables

  const [addElement, setAddElement] = useState(false);

  const [edit, setEdit] = useState({_id:'',type:'',visible:false});

  useEffect(() => {
    getResponse();
  }, [url]);

  const getResponseOld = async () => {
    const response = await trackPromise(fetch(`/api/${url}`));
    const data = await response.json();

    setData(data);
    console.log(url);
    console.log(data);
  };

  const getResponse = async () => {
    const response = await trackPromise(axios(`/api/${url}`));
    setData(response.data);
    console.log(response.data);
  }

  const triggerEdit = (_id,type) =>{
    //setEdit({_id:_id,type:type,visible:true});
  }

  //trackPromise(getResponse());  

  return (
    <div>

      <TopNavbar
        triggerMain={() => (setMain(true))}
        triggerStatistics={() => (setMain(false))}
        triggerReport={() => (setReport(true))}
        triggerLog={() => (setLog(true))}
        login = {login}
        logOut={()=> {
          localStorage.removeItem('auth-token');          
          setTimeout(() => {
            setLogin(false);  
          }, 1000);                    
        }}     
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
        login = {login}
        triggerEdit = {triggerEdit}
      />

      :<Statistics/>
      }


      {/* modals */}
      
      <AddElement
        visible={addElement}
        close={() => (setAddElement(false))}
        refresh={getResponse}
      />

      <Report
        visible={report}
        close={() => (setReport(false))}
      />

      <Log        
        visible={log}        
        setLogin = {() => (setLogin(true))}
        close={() => (setLog(false))}        
      />

      <Edit
        edit = {edit}
        visible={edit.visible}
        close={() => (setEdit({_id:'',type:'',visible:false}))}        
        refresh={getResponse}
      />

    </div>
  );
}

export default App;
