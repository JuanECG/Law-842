import 'antd/dist/antd.css';

import { trackPromise } from 'react-promise-tracker';
import { useState, useEffect } from 'react';
import axios from 'axios';

import AddElement from './components/addElement';
import Statistics from './components/statistic';
import TopNavbar from './components/TopNavbar';
import FooterCont from './components/footer';
import Filter from './components/filter';
import Report from './components/report';
import Delete from './components/delete';
import Edit from './components/edit';
import Main from './components/main';
import Log from './components/log';
import './styles/App.css';

const App = () => {
  // backend useState variables
  const [data, setData] = useState([]);

  // clave token: auth-token val: post axios response...

  // main navbar useState variables
  const [report, setReport] = useState(false);

  const [main, setMain] = useState(true);

  const [log, setLog] = useState(false);

  const [url, setUrl] = useState('elements');

  const [login, setLogin] = useState(localStorage.getItem('auth-token'));

  // body useState variables

  const [addElement, setAddElement] = useState(false);

  const [edit, setEdit] = useState({
    _id: '',
    type: '',
    title: '',
    content: '',
    parent: '',
    note: '',
    url:'',
    paragraphs: [],
    visible: false
  });

  const [itemsEdit, setItemsEdit] = useState([]);

  const [del, setDel] = useState({_id:'', type:'', visible:false});

  useEffect(() => {
    getResponse();
  }, [url]);

  useEffect(() => {
    //console.log(edit);
    if (edit.type === 'CAPÍTULO')
      axios(`/api/list/TÍTULO`).then((response) => setItemsEdit(response.data));
    else if (edit.type === 'ARTÍCULO')
      axios(`/api/list/CAPÍTULO`).then((response) =>
        setItemsEdit(response.data)
      );
  }, [edit]);

  const getResponse = async () => {
    const response = await trackPromise(axios(`/api/${url}`));
    setData(response.data);    
  };

  return (
    <div>      
      <TopNavbar
        triggerMain={() => setMain(true)}
        triggerStatistics={() => setMain(false)}
        triggerReport={() => setReport(true)}
        triggerLog={() => setLog(true)}
        login={login}
        logOut={() => {
          localStorage.removeItem('auth-token');
          setTimeout(() => {
            setLogin(false);
          }, 1000);
        }}
      />
      <Filter triggerFilter={(url) => setUrl(url)} visible={main} />

      {/* show main content or statistics content depending on
          main variable status */}
         
      {main ? (
        <Main
          addElement={() => setAddElement(true)}
          data={data}
          login={login}
          setDel={setDel}
          setEdit={setEdit}
        />
      ) : (
        <Statistics />
      )}

      <FooterCont />

      {/* modals */}

      <AddElement
        visible={addElement}
        close={() => setAddElement(false)}
        refresh={getResponse}
      />

      <Report visible={report} close={() => setReport(false)} />

      <Log
        visible={log}
        setLogin={() => setLogin(true)}
        close={() => setLog(false)}
      />

      <Edit
        edit={edit}
        itemsEdit={itemsEdit}
        visible={edit.visible}
        close={() =>
          setEdit({
            _id: '',
            type: '',
            title: '',
            content: '',
            parent: '',
            note: '',
            url:'',
            paragraphs: [],
            visible: false
          })
        }
        refresh={getResponse}
      />

      <Delete
        del={del}
        visible={del.visible}
        close={()=> setDel({_id:'', type:'', visible: false})}
        refresh={getResponse}
      />
    </div>
  );
};

export default App;
