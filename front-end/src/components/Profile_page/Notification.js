import React ,{Component} from 'react';

import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


class Notification extends Component{

  constructor(props){
      super(props);
      this.state = {
        showPopup: false,
        notes:["report 1","report 2","report 3"],
        title :'ciao',
      };
      this.handleClose=this.handleClose.bind(this);
      this.event_handle=this.event_handle.bind(this);
      //this.gotorep=this.gotorep.bind(this);
  }


  handleClose = () => {
     return false;
   };
  event_handle=(e)=>{
    e.preventDefault();
    this.props.closePopup();
  };
  // gotorep= ()=>{
  //   console.log(this.props.ud );
  //   this.props.history.push({
  //     pathname: '/Report_space',
  //     state: { detail: this.props.ud }
  //   })
  // };
  

  render(){
      return(
        
        <Dialog open={true} onClose={this.props.closePopup2}  aria-labelledby="form-dialog-title">
          <form onSubmit={this.event_handle}>
          {this.props.inc.title ? (
            <DialogContent>
              <DialogContentText>
                  ΚΕΝΟΥΡΓΙΟ ΠΕΡΙΣΤΑΤΙΚΟ
              </DialogContentText>
              <React.Fragment>
                <List>
                    <ListItemText primary={
                      <React.Fragment>
                        <Typography variant="body1" >
                          Τίτλος: {this.props.inc.title}
                        </Typography>
                      </React.Fragment>
                    }/>
                    <Divider/>
                    <ListItemText primary={
                      <React.Fragment>
                        <Typography variant="body1">
                          Τοποθεσία X: {this.props.inc.x}
                        </Typography>
                      </React.Fragment>
                    }/>
                    <Divider/>
                    <ListItemText  primary={
                      <React.Fragment>
                        <Typography variant="body1">
                        Τοποθεσία Y: {this.props.inc.y}
                        </Typography>
                      </React.Fragment>
                    }/>
                    <Divider/>
                </List>
                
                {/* <ul className="list-group">

                  {this.state.notes.map(listitem => (
                    <li className="list-group-item list-group-item-primary">
                      <Button  color="secondary">
                      {this.props.inc.title}
                      </Button>
                    </li>
                  ))}

                </ul> */}
              </React.Fragment>
            </DialogContent>
          )
          : (
            <DialogContent>
              <DialogContentText>
                  Δεν υπάρχει ενεργό περιστατικό
              </DialogContentText>
            </DialogContent>
          )}
            <DialogActions>
              <Button type="submit" color="primary">
                  Πίσω
              </Button>
            </DialogActions>
          </form >
        </Dialog>

      )
  }
}
export default Notification;
