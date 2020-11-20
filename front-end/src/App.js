import React,{Component} from 'react';
import Login from './components/Login_card/Login_card';
import Footer from './components/footer/footer';
import Profile_page from './components/Profile_page/prof';
import Filters from './components/Statistics/Filters';
import Header from './components/Header/Header';
import Syntonisths_Form from './components/syntonisths_forma/Syntonistis_Page';
import {BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import Main_user from './components/Main_user/Main_user';
import Report_space_main_page from './components/Report_space/Report_space_main_page/Report_space_main_page';
import Notification from './components/Profile_page/Notification';
import './App.css';


class App extends Component{
    constructor(props){
      super(props);
      
    }

    render(){
      console.log("HELLO");
      return (
        <Router>
          <div className="App">
            {/* <Header pathname={window.location.pathname}></Header> */}
            <Route component={Header}></Route>
            <Switch>
              <Route path="/Profile_page" component={Profile_page}></Route>
              <Route path="/Notification" component={Notification}></Route>
              <Route path="/Syntonisths" component={Syntonisths_Form}></Route>
              <Route path="/Login" component={Login}></Route>
              <Route path="/Main_user" component={Main_user}></Route>
              <Route path="/Report_space" component={Report_space_main_page}></Route>
              <Route path="/Statistics" component={Filters}></Route>
              <Route exact path="/" component={Login}></Route>
              
            </Switch>
            <Footer></Footer>
          </div>
        </Router>
      );
    }
    
  
  
}


export default App;
