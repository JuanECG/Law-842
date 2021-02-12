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
    _id: '', type: '', title: '',
    content: '', parent: '', note: '',
    visible: false
  });

  const [itemsEdit, setItemsEdit] = useState([]);

  const [parentEdit, setParentEdit] = useState('');

  useEffect(() => {
    getResponse();
  }, [url]);

  useEffect(async () => {
    //console.log(edit);
    if (edit.type === 'CAPÍTULO') {
      axios(`/api/list/TÍTULO`).then(
        data => {
          setItemsEdit(data);
          console.log(itemsEdit);
        }
      )
      // setItemsEdit((await axios(`/api/list/TÍTULO`)).data);
    }  
    else if (edit.type === 'ARTÍCULO'){
      axios(`/api/list/CAPÍTULO`).then(
        data => {
          setItemsEdit(data);
          console.log(itemsEdit);
        }
      )
    }
    // else if (edit.type === 'ARTÍCULO') setItemsEdit((await axios(`/api/list/CAPÍTULO`)).data); 
  }, [edit]);

useEffect(() => {
  setParentEdit(edit.parent);
  console.log(edit.parent);
  console.log(itemsEdit);
}, [itemsEdit])

const getResponse = async () => {
  const response = await trackPromise(axios(`/api/${url}`));
  setData(response.data);
  console.log(response.data);
}

const triggerEdit = (_id, type) => {
  //setEdit({_id:_id,type:type,visible:true});
}

return (
  <div>

    <TopNavbar
      triggerMain={() => (setMain(true))}
      triggerStatistics={() => (setMain(false))}
      triggerReport={() => (setReport(true))}
      triggerLog={() => (setLog(true))}
      login={login}
      logOut={() => {
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
      ? <Main
        addElement={() => (setAddElement(true))}
        data={data}
        login={login}
        setEdit={setEdit}
      />

      : <Statistics />
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
      setLogin={() => (setLogin(true))}
      close={() => (setLog(false))}
    />

    <Edit
      edit={edit}
      itemsEdit={itemsEdit}
      visible={edit.visible}
      parent={parentEdit}
      close={() => (setEdit({
        _id: '', type: '', title: '',
        content: '', parent: '', note: '',
        visible: false
      }))}
      refresh={getResponse}
    />

  </div>
);
}

export default App;
