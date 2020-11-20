import React ,{Component} from 'react';
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// import { TextField } from '@material-ui/core';
// import Box from '@material-ui/core/Box';
// import Container from '@material-ui/core/Container';
// import Grid from '@material-ui/core/Grid';
// import { Link } from 'react-router-dom';
import './Logout.css';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


class Logout extends Component{

    constructor(props){
        super(props);
        
        this.state = { 
          showLogoutMessage : false,
        };  
        
        this.LogoutUser=this.LogoutUser.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
        this.handleLogoutMessage=this.handleLogoutMessage.bind(this);
        this.handleLogMessage=this.handleLogMessage.bind(this);
        this.handleWrapper=this.handleWrapper.bind(this);
        
      }


      LogoutUser = async () => { 
     
        const data = await fetch('http://localhost:3001/control-center/api/logout', {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.token
          }
          // body: JSON.stringify(this.state)
        });
        if(data.status===200){
    
        //   const userData = await data.json();
          // console.log("Successful logout");
          
        }
        else if(data.status===400){
            console.log("Bad request");
        //   console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
        else if(data.status===401){
            console.log("Not Authorized for this operation");
            // console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
        else if(data.status===500){
            console.log("Internal server error");
            // console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
      }

      handleWrapper = () => {
        this.handleLogout();
        this.handleLogMessage();
      }

      handleLogout = async () => {
        
        // event.preventDefault();
        this.LogoutUser();
        this.props.history.push({
          pathname: '/Login'
        });
      }

      handleLogMessage = () => {
        this.setState({
          showLogoutMessage : true,
        })
      }

      handleLogoutMessage = (event,reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({  
            showLogoutMessage: false ,
          });
    
      }

      render(){
          return(
            <div>
                <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleWrapper}
              >
                  Logout
              </Button>
              {/* {console.log(this.state.showLogoutMessage+"EDWREFILARAKI")} */}
              <Snackbar open={this.state.showLogoutMessage} autoHideDuration={4000} onClose={this.handleLogoutMessage}>
                  <Alert onClose={this.handleLogoutMessage} variant="filled" severity="success">
                      Αποσυνδεθήκατε επιτυχώς.Καλή συνέχεια!
                  </Alert>
              </Snackbar> 
            </div>
          );
      }
}


export default Logout;
