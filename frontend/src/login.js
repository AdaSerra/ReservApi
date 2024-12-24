import React, {useState} from 'react';
import ReactDOM from 'react-dom/client'
import { Button, Form, Input } from 'antd';
let URL=window.location.href

const Login = () => {
   const [res,setRes] =useState(null)

  const onFinish = (values) => {
    
    fetch(`${URL.toLowerCase()}`, { method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(values)})
         .then(response =>{
            if (response.redirected) {
              window.location.href = response.url;
            }
            else { 
              return response.json().then(data => { response.status==500 ?
                setRes(data.message): setRes("Wrong credential")  });

         } })
       
    };
  
  return (<>
    <Form
      name="login"
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 500,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input  placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input type="password" placeholder="Password" />
      </Form.Item>
    
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Log in
        </Button>
       
      </Form.Item>
    </Form>
    {<div>{res}</div>}
    </>
  );
};


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 <React.StrictMode>
   <Login />
 </React.StrictMode>
);