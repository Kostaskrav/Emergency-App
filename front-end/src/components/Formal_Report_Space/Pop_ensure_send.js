import React ,{Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


class Pop_ensure_send extends Component{
    constructor(props){
        super(props);
        
        this.state = { 
            email: '' 
          }; 

        this.handle_Email_change=this.handle_Email_change.bind(this);
        
        this.event_handle=this.event_handle.bind(this);
    }

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
            <Dialog
                
                open={true}
                onClose={this.props.closePopup}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Είστε σίγουρος ότι θέλετε να στείλετε το Report \""+this.props.report_name+"\";"}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Υπενθυμίζουμε πως μόλις το Report αποσταλεί δεν είναι δυνατή η όποια επιθυμητή αλλαγή.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={this.props.closePopup} color="primary">
                    Ακύρωση
                </Button>
                <Button onClick={(event)=>{this.props.showSuccessSend(event,this.props.tab_num)}} color="primary" autoFocus>
                    Επιβεβαίωση
                </Button>
                </DialogActions>
            </Dialog>
            // <Dialog open={true}   aria-labelledby="form-dialog-title">
            //     <DialogTitle id="form-dialog-title">Ξεχάσατε τον κωδικό σας?</DialogTitle>
            //     <form onSubmit={this.event_handle}>
            //         <DialogContent>
            //         <DialogContentText>
            //             Συμπληρώστε το email σας για να μπορέσετε να αλλάξετε τον κωδικό.
            //         </DialogContentText>
                
            //         <TextField
            //             autoFocus
            //             margin="dense"
            //             id="name"
            //             label="Ηλεκτρονική Διεύθυνση"
            //             type="email"
            //             fullWidth
            //             value={this.state.email}
            //             onChange={this.handle_Email_change}
                        
            //         />
            //         </DialogContent>
            //         <DialogActions>
            //         <Button type="button" onClick={this.props.closePopup} color="primary">
            //             Ακύρωση
            //         </Button>
            //         <Button type="submit" onClick={this.props.submit_handler} color="primary">
            //             Αποστολή
            //         </Button>
            //         </DialogActions>
            //     </form>
                
            // </Dialog>
        );
    }


}


export default Pop_ensure_send;