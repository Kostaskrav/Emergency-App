import React,{Component} from 'react';

import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
// import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
// import Checkbox from '@material-ui/core/Checkbox';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

// import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import InputAdornment from '@material-ui/core/InputAdornment';
import PhoneIcon from '@material-ui/icons/Phone';
import PropTypes from 'prop-types';

// import WhatshotIcon from '@material-ui/icons/Whatshot';
// import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
// import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';
// import SecurityIcon from '@material-ui/icons/Security';

import CloseIcon from '@material-ui/icons/Close';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';


// import Fab from '@material-ui/core/Fab';
// import AddIcon from '@material-ui/icons/Add';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// import SimpleDialog from './SimpleDialog.js';
import Staff_handling from './Staff_handling.js';

import './syntonisths_forma.css';
import './Open_incidents.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component={'div'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

class Open_incidents extends Component{
    constructor(props){
        super(props);

        this.state={
            value:0,
            Close_inc_popup:false,
            open:false,
            open_modal:[false,false,false,false],
            selectedValue:"Σπίτι Κακαβά",
            list_of_incidents:[],
            

        }        
        this.handleClickValue=this.handleClickValue.bind(this);
        this.handleClickOpen_modal=this.handleClickOpen_modal.bind(this);
        this.handleClose_modal=this.handleClose_modal.bind(this);
        this.handleClickOpen=this.handleClickOpen.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.closeIncident=this.closeIncident.bind(this);
        this.handleCloseIncidentOpen=this.handleCloseIncidentOpen.bind(this);
        this.handleCloseIncidentClose=this.handleCloseIncidentClose.bind(this);
        this.SpecialhandleCloseIncidentClose=this.SpecialhandleCloseIncidentClose.bind(this);
        
    }

    handleClickValue = (event,newValue) => {
        this.setState({  
            value: newValue 
        });
    }

    handleClickOpen_modal = (index) => {
        var joined=this.state.open_modal;
        joined[index]=true;
        this.setState({  
            open_modal: joined 
        });
      };

    handleClose_modal = (index) => {
        var joined=this.state.open_modal;
        joined[index]=false;
        this.setState({  
            open_modal: joined,
        });
    // setSelectedValue(value);
    };
    
    handleClickOpen = () => {
        this.setState({  
            open: true 
        });
      };

    handleClose = (value) => {
        this.setState({  
            open: false,
            selectedValue:value
        });
    // setSelectedValue(value);
    };

    handleCloseIncidentOpen = () => {
        this.setState({
            Close_inc_popup:true,
        });
    }

    handleCloseIncidentClose = () => {
        this.setState({
            Close_inc_popup:false,
        });
    }

    SpecialhandleCloseIncidentClose = (event,tablenum) => { 
        event.preventDefault();
        let newVal = 0
        // if(this.state.value === 0 && this.state.list_of_incidents.length>0){newVal = 1;}
        //  this.setState({
        //      value:newVal
        //  });
        this.closeIncident(tablenum);
        var joined=this.state.list_of_incidents;
        joined.splice(tablenum,1);
        // console.log(joined);
        this.setState(()=> ({
           list_of_incidents : joined,
            value:newVal,
            Close_inc_popup:false
        }));    
    }

    //make a request to the server to close the incident 
    closeIncident = async (val) => { 
            const data = await fetch('http://localhost:3001/control-center/api/reports', {
              method: 'POST',
              headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.bearerToken
              },
              body: JSON.stringify({id : this.state.list_of_incidents[val]._id})
            });
            if(data.status===200){
        
            //  console.log("deleted the incident")
             
            }else{
                // console.log(data.status);
            }
    }

    fetchIncidents = async () => { 
        const data = await fetch('http://localhost:3001/control-center/api/incidents', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.bearerToken
          }
        });
        if(data.status===200){
    
          const incidentData = await data.json();
          const liveIncidents = [];
          incidentData.forEach(incident => {
              if(incident.isOpen){
                  liveIncidents.push(incident);
              }
          });         
          this.setState(()=> ({
                list_of_incidents:liveIncidents
          }));
        }else{
          console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
      }
      componentDidMount(){
        this.fetchIncidents();

      }
    //   componentDidUpdate(){
    //     this.fetchIncidents();

    //   }
  
    

    render(){
        const Services=["Medics","FireFighters","Cops","BoatFighters"];
        return(
            <div>
                <Grid container className="open_incidents_gr">
                    <Grid item xs={3} className="incidents_Col"> {/* Για το column με τα περιστατικά */}
                        
                            <Tabs
                                    variant="scrollable"
                                    value={this.state.value}
                                    onChange={this.handleClickValue}
                                    orientation="vertical"
                                    aria-label="Vertical tabs example"
                            >
                                {this.state.list_of_incidents.map((item,index_num) =>                     
                                    <Tab key={index_num} label={item.title} {...a11yProps(index_num)} />
                                )}    
                            </Tabs> 
                        
                    </Grid>

                    <Grid item xs={8} className="open_incident_info">
                        {/* {console.log(this.state.list_of_incidents[0])} */}
                        {this.state.list_of_incidents.map((item,index_num) =>
                            <TabPanel value={this.state.value} key={index_num} index={index_num}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="standard-disabled"
                                            value={item.title}
                                            multiline
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                                }}
                                        >
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Grid container justify="flex-end">
                                            <Button onClick={this.handleCloseIncidentOpen} className="fuckyou"variant="contained" startIcon={<CloseIcon />}>
                                                ΚΛΕΙΣΙΜΟ ΠΕΡΙΣΤΑΤΙΚΟΥ
                                            </Button>
                                            <Dialog
                                                open={this.state.Close_inc_popup}
                                                onClose={this.handleCloseIncidentClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">{"Επιβεβαίωση κλεισίματος Περιστατικού"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        Είστε σίγουρος ότι θέλετε να κλείσετε το περιστατικό ? Δεν υπάρχει επιστροφή αν πατήσετε
                                                        επιβεβαίωση.
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={this.handleCloseIncidentClose} color="primary">
                                                        ΑΚΎΡΩΣΗ 
                                                    </Button>
                                                    <Button onClick={(event) => {this.SpecialhandleCloseIncidentClose(event,this.state.value)}}  color="primary">
                                                        ΕΠΙΒΕΒΑΊΩΣΗ
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <TextField
                                            // className=""
                                            id="input-with-icon-textfield"
                                            label="Τοποθεσία"
                                            value=
                                            {   "lat: " + item.x +
                                                " - lon: " + item.y
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOnIcon></LocationOnIcon>
                                                    </InputAdornment>
                                                ),
                                                readOnly : true,
                                            }}
                                        >
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6} className="change_location">
                                        {/* <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                                            Αλλαγή τοποθεσίας
                                        </Button> */}
                                        
                                        {/* <SimpleDialog moreimp={this.state.list_of_incidents} 
                                        important={this.state.list_of_incidents} 
                                        position={this.state.list_of_incidents[this.state.value].x} 
                                        pvalue={this.state.value}
                                        selectedValue={this.state.selectedValue} 
                                        open={this.state.open} onClose={this.handleClose} /> */}

                                    </Grid>
                                    <Grid item xs={7}>
                                            <TextField
                                                // className={classes.margin}
                                                id="input-with-icon-textfield"
                                                label="Τηλέφωνο"
                                                defaultValue={item.telephone}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIcon></PhoneIcon>
                                                        </InputAdornment>
                                                    ),
                                                    readOnly : true,
                                                }}
                                            >
                                            </TextField>
                                        </Grid>
                                </Grid>
                                <Grid container className="services_titles" direction="row">
                                {Services.map((item,index_num)=>{ 
                                  //  console.log(item);
                                   return(
                                    <Grid item xs={3} value={this.state.value} key={index_num} index={index_num}>
                                            <Staff_handling Service={item}
                                            index={index_num}
                                            // setList_Of_Incidents={this.props.setList_Of_Incidents}
                                            handleClickOpen_modal={this.handleClickOpen_modal}
                                            handleClose_modal={this.handleClose_modal}
                                            open_modal={this.state.open_modal}
                                            list_of_incidents={this.state.list_of_incidents}
                                            users = {this.state.list_of_incidents[this.state.value].users}
                                            agencies = {this.props.agencies}
                                            value={this.state.value}>
                                            </Staff_handling>
                                            {/* {console.log("----")} */}

                                    </Grid>
                                   );
                                })}
                                    
                                </Grid>
                            </TabPanel>

                        )}
                        

                        
                    </Grid>
                </Grid>
            
            </div>
        );
    }

}

export default Open_incidents;