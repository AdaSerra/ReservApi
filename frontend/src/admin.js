import React, {useState,useCallback} from 'react';
import ReactDOM from 'react-dom/client';
import {Table,Button,Space,Input,DatePicker,Select} from 'antd'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'; 
import timezone from 'dayjs/plugin/timezone.js';
import {optionTime,disabledDate,optionsDate} from '../../common/time.js'

dayjs.extend(utc);
dayjs.extend(timezone);
const URL=window.location.href

function Main() {

    const [dataForm,setDataForm] = useState(window.__INITIAL_DATA__)
    const [editRecord, setEditRecord] = useState({row:-1,editing:false,original:{}})
    const [res,setRes] =useState(null)
    

    const addRow = useCallback(() => { 
      
      const newRow = { 
        _id:null,
        name:null,
        phone:null,
        date:dayjs().format() }; 
        setEditRecord({row:dataForm.length,editing:true,original:newRow})
         setDataForm([...dataForm,newRow]);
         
         }, []);

    function restoreRecord(index){
      const newDataForm=[...dataForm];
          newDataForm[index] = editRecord.original
          setDataForm(newDataForm)
    }

    function logout() {
      fetch(`${URL.toLowerCase().replace('admin','logout')}`)
      .then(response=> {window.location.href = response.url})
      .catch(err => {console.error('Error: ', err)})
    }

    function createRecord(index) {
      fetch(`${URL.toLowerCase().replace('admin','api')}?name=${dataForm[index].name}&phone=${dataForm[index].phone}&time=${dataForm[index].date.replace('+','%2B')}`, 
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, })
      .then(response => { 
        if (response.status !=200){restoreRecord(index)}
        else {setEditRecord({row:-1,editing:false,original:{}})}
        return response.json()})
      .then(data=>{console.log(data);setRes(data)})
      .catch(err => {console.error('Error: ', err)})

    }

    function updateRecord(index) {

      if (!dataForm[index]._id) {createRecord(index)}
      else if(dataForm[index] == editRecord.original) {setEditRecord({row:-1,editing:false,original:{}})}
      else {
      fetch(`${URL.toLowerCase().replace('admin','api')}?id=${dataForm[index]._id}&name=${dataForm[index].name}&phone=${dataForm[index].phone}&time=${dataForm[index].date.replace('+','%2B')}`, 
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, })
        .then(response => {
          if (response.status !=200) {restoreRecord(index)}
          else {setEditRecord({row:-1,editing:false,original:{}})}
          return response.json()})
        .then(data=>{console.log(data);setRes(data)})
        .catch(err=>{console.error('Error: ',err);restoreRecord(index)})
        }
    }


    function deleteRecord (index) {

      if(!dataForm[index]._id) {const newData = dataForm.slice(0,index).concat(dataForm.slice(index+1));setDataForm(newData)} 
      else {      
        fetch(`${URL.toLowerCase().replace('admin','api')}?id=${dataForm[index]._id}`, 
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, })
          .then(response => response.json())
          .then((data) => { console.log(data);setDataForm(dataForm.slice(0,index).concat(dataForm.slice(index+1)));setRes(data) })
          .catch((error) => { console.error('Error:', error); })}
        };
    
    const column = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width:300,   
        render: (text,record,index) => { 
          return index==editRecord.row ? (
          <Input value={text} onChange={(e)=>{
            const newDataForm = [...dataForm]; 
            newDataForm[index] = { ...newDataForm[index], name: e.target.value }; 
            setDataForm(newDataForm);
          }}></Input>) : text
        }
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width:150,
        render:(text,record,index) => {
          return editRecord.row >= 0 && index==editRecord.row ? (
          <Input value={text} onChange={(e)=>{
            const newDataForm = [...dataForm]; 
            newDataForm[index] = { ...newDataForm[index], phone: e.target.value }; 
            setDataForm(newDataForm);
          }}></Input>) : text
        }
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width:500,
        render:(text,record,index) => {
          return index==editRecord.row ? (<>
          <DatePicker
           format="DD-MM-YYYY"
           value={dayjs(text)}
           disabledDate={disabledDate}
           onChange={(dateString)=>{
            const newDataForm = [...dataForm];
            newDataForm[index] = { ...newDataForm[index], date: dayjs(dateString).tz(dayjs.tz.guess()).format()||null };
            setDataForm(newDataForm)
           }}></DatePicker>
          <Select
          placeholder="Select Time"
          options={optionTime()}
          value={text.slice(11,16)}
          onChange={(option)=>{
            const newDataForm = [...dataForm];
            const newDate=dataForm[index].date.slice(0,10)+"T"+option+dataForm[index].date.slice(16) || null;
            newDataForm[index] = {...newDataForm[index],date:newDate}
            setDataForm(newDataForm)
          }}></Select>

          </>) :new Date(text).toLocaleDateString('en-EN',optionsDate) || null
        }
      },
      {
        title: 'Action',
        key: 'action',
        dateIndex: 'action',
       render:(text, record,index)=>(<Space size='middle'>
       
        <Button type='dashed' size='small' onClick={(editRecord.row >= 0 && index==editRecord.row && editRecord.editing)?
          ()=>updateRecord(index) :
          ()=>setEditRecord({row:index,editing:true,original:dataForm[index]})}>
            {editRecord.row >= 0 && index==editRecord.row? editRecord.editing ===true ? "Save" :"Edit" :"Edit"}</Button>
        <Button type='danger' danger size='small' onClick={()=>deleteRecord(index)}>Delete</Button></Space>)
       }
        
      ,]
    return (
        <div>
            <div class='top'>
              <Button type='primary' onClick={addRow}>Add Reserve</Button>
              <div id='message'> {res && res.message}</div>
              <Button type='primary' onClick={logout}>Logout</Button>
            </div>
           <Table dataSource={dataForm} columns={column}></Table>
        </div>
    )
}





const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 <React.StrictMode>
   <Main />
 </React.StrictMode>
);