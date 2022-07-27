import React, { useEffect, useState, useContext } from "react";
import st from "./styles/contributeNew.module.css";
import { Link,Redirect,useHistory } from "react-router-dom";
import {
  MdSearch,
  MdMenu,
  MdClose,
  MdKeyboardArrowLeft,
  MdOutlineFilterList,
  MdKeyboardArrowRight,
}
from "react-icons/md";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
}
from "react-icons/fa";
import $ from "jquery";
import { Power4 } from "gsap/dist/gsap";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import commafy from 'commafy';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin,Table, Tag, Space,Tooltip, Form, Button,Checkbox,Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { Header,Footer } from "../components";

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

const ContributeNew = (props) => {
  
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const history = useHistory();

  const checkAuth = (user) => {
    
     setLoading(true);
     
    //console.log(user)
    // check if the user and password matches the record
    const loadAccount = (tries) => {
      try {
        fetch(`/api/v1/data/login?email=${email}&pass=${password}`)
          .then(response => response.json())
          .then(data => {
            if (data.message == 'success') {
              window.user = data.user;
              // authenticated successfully
              setLoading(false);
              if (history.location.pathname == '/login' || history.location.pathname == '/') {
                history.replace('/account');
                
              }
            }
            else {
              localStorage.setItem('authenticatedUser', undefined);
              history.push('/')
              setLoading(false);
            }
          })
          .catch(error => {
            setTimeout(() => {
              loadAccount(tries + 1);
            }, 100)
  
          })
      }
      catch (e) {
        setTimeout(() => {
          loadAccount(tries + 1);
        }, 100)
      }
    }
    let email = '';
    let password = '';
    try {
      email = user.split(':')[0];
      password = user.split(':')[1];
      loadAccount(0)
    }catch(e){
      localStorage.setItem('authenticatedUser', undefined);
      history.push('/login')
      setLoading(false);
    }
  }

  useEffect(async() => {
    document.title = `iHelp | Login (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
    //document.getElementById("favicon").href = "/favicon.ico";
    
    if (localStorage.getItem('authenticatedUser') == "undefined" || localStorage.getItem('authenticatedUser') == null) {
      // setAttemptedPage(history.location.pathname + history.location.search)
      if (history.location.pathname != '/' && history.location.pathname != '/login') {
        history.replace('/login');
      }
    }
    else {
      var user = localStorage.getItem('authenticatedUser');
      checkAuth(user);
    }
    
  }, []);
  
  const onFinish = () => {
    
    setLoading(true);
    
    // check if the user and password matches the record
    fetch(`/api/v1/data/login?email=${user}&pass=${pass}`)
      .then(response => response.json())
      .then(data => {
        
        console.log(data);

        setTimeout(() => {
          
          setLoading(false);
          
          if (data.message == 'success') {
            
            localStorage.setItem('authenticatedUser', user+':'+pass);
            window.user = data;
            console.log('auth', window.user);
            history.push('/account')
            
          }
          else {
            // return to login screen wtih error
            if (data.message == 'password not correct') {
              //setPasswordErrorMessage(data.message);
            }
            else {
              //setEmailErrorMessage(data.message);
            }

            //authenticatedUser(email,password,data.message);
          }
        }, 300)

      });
    
    // if (user == 'ihelp' && pass == 'ihelp123') {
    //   history.push('/account')
    // }
    
  }

  return (
    <div id="app" className="app">

{/*
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}
      
      <Header {...props}/>
      
      <div className={st.contribute + " " + "section"}>
        <div className="box" style={{marginTop:'30px',marginBottom:'-10px',maxWidth:'700px'}}>
          <div className="sectionHeader">Charity Login</div>
          
           {loading ? (<Spin indicator={antIcon} />) :  
          
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
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
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" value={user} onChange={(e)=>{setUser(e.target.value)}}/>
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
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={pass} onChange={(e)=>{setPass(e.target.value)}}
              />
            </Form.Item>
            {/*<Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
      
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>*/}
      
            <Form.Item>
              <button className="grd-btn" htmlType="submit" style={{width:'100%'}}>
                Log in
              </button>
              
              {/*Or <a href="">register now!</a>*/}
            </Form.Item>
          </Form>
          
           }
          
        </div>
      </div>
      
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
