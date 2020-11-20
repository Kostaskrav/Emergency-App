import React ,{Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';



class Change_prof extends Component{
    constructor(props){
        super(props);

        this.state = {
            gender : '',
            email : '',
            phone : '',
            spotx : '',
            spoty : '',
          };

        this.handle_Email_change=this.handle_Email_change.bind(this);
        this.handle_gender_change=this.handle_gender_change.bind(this);
        this.handle_phone_change=this.handle_phone_change.bind(this);
        this.handle_x_change=this.handle_x_change.bind(this);
        this.handle_y_change=this.handle_y_change.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.event_handle=this.event_handle.bind(this);
    }

    fetchUser = async () => { 
        const data = await fetch('http://localhost:3001/control-center/api/profile', {
            method: 'GET',
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.props.location.state.detail.token

            }
        });
        if(data.status===200){
    
          const userData = await data.json();
          console.log(userData);
         
        }
        else{
          console.log("Unauthorized");
        }
      }

     handleClose = () => {
        return false;
      };

      handle_Email_change= event =>{
        this.setState({
            email:event.target.value
        })
      };
      handle_gender_change= event =>{
        this.setState({
            gender:event.target.value
        })
      };
      handle_phone_change= event =>{
        this.setState({
            phone:event.target.value
        })
      };
      handle_x_change= event =>{
        this.setState({
            spotx:event.target.value
        })
      };
      handle_y_change= event =>{
        this.setState({
            spoty:event.target.value
        })
      };

      event_handle=(e)=>{
        e.preventDefault();
        this.props.email2(this.state.email);
        this.props.gender2(this.state.gender);
        this.props.phone2(this.state.phone);
        this.props.x2(this.state.spotx);
        this.props.y2(this.state.spoty);
        this.props.closePopup();

      };

    render(){
          
       
        return(

           
          <Dialog open={true} onClose={this.props.closePopup}  aria-labelledby="form-dialog-title">
           
              <form onSubmit={this.event_handle}>
                  <DialogContent>
                  <DialogContentText>
                      Συμπληρώστε τις πληροφορίες που επιθυμήτε να αλλάξετε
                  </DialogContentText>
                  <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Ηλεκτρονική Διεύθυνση"
                      type="email"
                      fullWidth
                      value={this.state.email}
                      onChange={this.handle_Email_change}

                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Φύλο"
                      type="text"
                      fullWidth
                      value={this.state.gender}
                      onChange={this.handle_gender_change}

                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Τηλέφωνο"
                      type="text"
                      fullWidth
                      value={this.state.phone}
                      onChange={this.handle_phone_change}

                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Τοποθεσία Χ"
                      type="text"
                      fullWidth
                      value={this.state.spotx}
                      onChange={this.handle_x_change}

                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Τοποθεσία Y"
                      type="text"
                      fullWidth
                      value={this.state.spoty}
                      onChange={this.handle_y_change}

                  />
                  </DialogContent>
                  <DialogActions>
                  <Button type="button" color="primary">
                      Ακύρωση
                  </Button>
                  <Button type="submit"  color="primary">
                      Αποστολή
                  </Button>
                  </DialogActions>
              </form>

          </Dialog>

        );
    }


}


export default Change_prof;
