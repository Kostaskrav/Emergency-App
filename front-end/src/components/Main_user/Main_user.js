import React ,{Component} from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import PhoneIcon from '@material-ui/icons/Phone';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';


import './Main_user.css';


class Main_user extends Component{
    constructor(props){
        super(props);
        this.state={
            open:true,
        }
        this.handleClose=this.handleClose.bind(this);
        this.handle_new_notif=this.handle_new_notif.bind(this);
    }

    handle_new_notif = () =>{
        if(this.state.open===false){
            return(<Grid container className="Grid_position" justify="center">
            <Grid item xs={6}>
                <Paper className="Paper_css" elevation={3}>
                    Δεν υπάρχει καμία νέα ειδοποίση για επείγον περιστατικό
                </Paper>
            </Grid>
            </Grid>);
           
        }
    };

    handleClose = () => {
        this.setState({  
            open:false, 
          });
      };

    render(){
        return(
            <div>
                {this.handle_new_notif()}
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">
                        <Grid container>
                            <Grid item xs={2}>
                                <WarningIcon style={{ fontSize: 40}}></WarningIcon>
                            </Grid>
                            <Grid item xs={7}>
                                ΝΕΑ ΠΕΡΙΣΤΑΤΙΚΟ
                            </Grid>
                        </Grid>
                        
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container align="center" spacing={3}>
                            <Grid  item xs={6}>
                                <PersonIcon></PersonIcon>
                                <Typography>
                                    Μιχάλης Μήτσιος    
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                            <LocationOnIcon/> 
                                <Typography>
                                    Μεταμόρφωση   
                                </Typography> 
                            </Grid>
                            <Grid item xs={6}>
                                <PriorityHighIcon/>
                                <Typography>
                                    Level 3   
                                </Typography>
                                    
                            </Grid>
                            <Grid item xs={6}>
                            <PhoneIcon/>    
                            <Typography>
                                6972132836   
                            </Typography>                               
                            </Grid>
                        </Grid>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Απόρριψη
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                        Αποδοχή
                    </Button>
                    </DialogActions>
                </Dialog>
    
            </div>
        );
    }

}

export default Main_user; 