import React, {useState} from 'react';
import {DatePicker,Form, Input,Button,Select} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'; 
import timezone from 'dayjs/plugin/timezone.js';
import ReactDOM from 'react-dom/client'
import {optionTime,disabledDate} from '../../common/time.js'

dayjs.extend(utc);
dayjs.extend(timezone);
const URL=window.location.href

function First() {

    const [form] = Form.useForm();

    const [formData,setFormData] =useState({});
    const [res,setRes]=useState(null)

    const onFinish = () => { 
        const time=formData.date.slice(0,10)+"T"+formData.time+formData.date.slice(16);
      
        
        fetch(`${URL.toLowerCase()}api?name=${formData.name}&phone=${formData.phone}&time=${time.replace('+','%2B')}`, { method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            })
            .then(response => response.json())
            .then((data) => { console.log(data);setRes(data) })
            .catch((error) => { console.error('Error:', error)});
        };
    
       
   

    const handle= (key,value)=>{setFormData({...formData,[key]:value}) }

     
    return (<>
        <Form form={form} onFinish={onFinish}>
        <Form.Item label="name" name="name" onChange={(e)=>handle(e.target.id,e.target.value)} rules={[
            {required:true,message:"Please input a name"},
            {pattern:/^[\p{L} -']+$/iu,message:"Name not valid"},
            {max:40,message:"Name not valid"}]}>
            <Input/></Form.Item>
        <Form.Item label="phone" name="phone" onChange={(e)=>handle(e.target.id,e.target.value)} rules={[
            {required:true,message:"Please write a phone number"},
            {pattern:/^([0-9]+\-)?[0-9]+$/,message:"Phone number not valid"},
            {max:13,message:"Phone number not valid"}]}>
            <Input/></Form.Item>
        <div id="datetime">
        <Form.Item label="date" name="date" rules={[{required:true}]} >
        <DatePicker
       
        format="DD-MM-YYYY"    
        disabledDate={disabledDate}
      
       onChange={(dateString)=>handle('date',dayjs(dateString).tz(dayjs.tz.guess()).format())}
      
      /></Form.Item>
      <Form.Item label="time" name="time" rules={[{required:true}]} >
        <Select
        placeholder="Select Time"
        options={optionTime()}
        onChange={(option)=>{handle('time',option)}}
      /></Form.Item>
      </div>
      <Form.Item>   <Button type="primary" htmlType="submit">
          Submit
        </Button></Form.Item>
      </Form>
      {res && <div>{res.message}</div>}
      
      </>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 <React.StrictMode>
   <First />
 </React.StrictMode>
);