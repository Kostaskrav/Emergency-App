import React ,{Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';


class Pop_forgot_pass extends Component{
    constructor(props){
        super(props);
        
        this.state = { 
            email: '' 
          }; 

        this.handle_Email_change=this.handle_Email_change.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.event_handle=this.event_handle.bind(this);
    }

     handleClose = () => {
        return false;
      };

      handle_Email_change= event =>{
        this.setState({
            email:event.target.value
        })
      };

      event_handle=(e)=>{
        this.props.closePopup();
        alert(this.state.email);
      };

    render(){
        return(
            <Dialog open={true} onClose={this.props.closePopup}  aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Ξεχάσατε τον κωδικό σας?</DialogTitle>
                <form onSubmit={this.event_handle}>
                    <DialogContent>
                    <DialogContentText>
                        Συμπληρώστε το email σας για να μπορέσετε να αλλάξετε τον κωδικό.
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
                    </DialogContent>
                    <DialogActions>
                    <Button type="button" onClick={this.props.closePopup} color="primary">
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


export default Pop_forgot_pass;