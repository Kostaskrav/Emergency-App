import React ,{Component} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Pop_forgot_pass from './Pop_forgot_pass';
import './Login_card.css';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';



class Login extends Component{

  constructor(props){
    super(props);
    
    this.state = { 
      showPopup: false ,
      username:'',
      password:'',
      showErrorMessage: false,
    };  
    
    this.handleClickOpen=this.handleClickOpen.bind(this);
    this.handleShow=this.handleShow.bind(this);
    this.change_password=this.change_password.bind(this);
    this.change_username=this.change_username.bind(this);
    this.submit_handler=this.submit_handler.bind(this);
    this.fetchUser=this.fetchUser.bind(this);
    this.handleLoginError=this.handleLoginError.bind(this);
  }
  
  handleClickOpen = (event) => {
    this.setState({  
      showPopup: !this.state.showPopup  
    });
  };

  handleShow=()=>{
    if(this.state.showPopup){
      return(<Pop_forgot_pass closePopup={this.handleClickOpen}></Pop_forgot_pass>);
    }
    else{
      return null;
    }
  }

  change_username=(event)=>{
    this.setState({
      username:event.target.value
    });
  }

  /* LOGIN ERROR MESSAGE */

  handleLoginError = (temp) => {
    if (temp === 400) {
      this.setState({
        showErrorMessage : true,
      })
    }
  }

  handleCloseSnackBar = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    this.setState({  
        showErrorMessage: false ,
      });   
}

   handleChange(event){
    // const { name, value } = event.target;
    // setCredentials(items => {
    //   return {
    //     ...items,
    //     [name]: value
    //   };
    // });
  }

//    requestOptions = {
//     method: 'POST',
//     headers: { 
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(this.state)
// };


   fetchUser = async () => { 
     
    const data = await fetch('http://localhost:3001/control-center/api/login', {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });
    if(data.status===200){

      const userData = await data.json();
      // console.log(userData);
      if(userData.role==="coordinator"){
       this.props.history.push({
         pathname: '/Syntonisths',
         state: { detail: userData }
       })
      }
      else if(userData.isHeadOfAgency){ // write the formal report
        //for the head of agencies 
        this.props.history.push({
          pathname: '/Statistics',
          state: { detail: userData }
        })
      }
      else{ //for the users that get in to write a report
        this.props.history.push({
          pathname: '/Profile_page',
          state: { detail: userData }
        })
      }
    }
    else{
      this.handleLoginError(data.status);
      console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
    }

  }


  change_password=(event)=>{
    this.setState({
      password:event.target.value
    });
  }

  submit_handler=(event)=>{
    event.preventDefault();
    // alert("username: "+this.state.username + " password: "+this.state.password);
    // console.log(this.state.username+" "+this.state.password);
    this.fetchUser();
    
  }

  render(){
    // const [open, setOpen] = React.useState(false);
    
    return (
      <div className="Login">
        <Container maxWidth="xs">
          <Box>
            <form className="Login_form" onSubmit={this.submit_handler}>
              <Typography align="center" variant="h4" gutterBottom>Πληκτρολογήστε τα στοιχεία σας!</Typography>
              <TextField required variant="outlined" label="ONOMA" fullWidth margin="normal" onChange={this.change_username}>
                
              </TextField>
              <TextField required type="password" className="red_cls" variant="outlined" label="ΚΩΔΙΚΟΣ" fullWidth margin="normal" onChange={this.change_password}>
                
              </TextField>
              {/* <Link to="/Main_user" className="connectStyle"> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleLoginError}
              >
                  Συνδεση
              </Button> 
              <Snackbar open={this.state.showErrorMessage} autoHideDuration={4000} onClose={this.handleCloseSnackBar}>
                  <Alert onClose={this.handleCloseSnackBar} variant="filled" severity="error">
                      Τα στοιχεία που δώσατε δεν μπορούν να επιβεβαιωθούν.Ελέξτε τις πληροφορίες που εισάγατε.
                  </Alert>
              </Snackbar>
              {/* </Link>         */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
  
                </Grid>
                <Grid item xs={6}>
                  <Link to="/" onClick={this.handleClickOpen} variant="body2">
                    Ξεχάσατε τον κωδικό σας?
                  </Link>
                </Grid>
                <Grid item className="grid_area" xs={6}>
                  {/* <Link className="right_text" href="#" variant="body2">
                    Wanna buy Dildo?
                  </Link> */}
                  
                </Grid>
              </Grid> 
            </form>
  
           
            </Box>
        </Container> 
        
        {/* {this.state.showPopup ?
          <Pop_forgot_pass closePopup={this.handleClickOpen}></Pop_forgot_pass>
          : null
        } */}
        {this.handleShow()}
        
      </div>
    );
  }
}

export default Login;


