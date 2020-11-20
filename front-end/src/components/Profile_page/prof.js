import React,{Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Logout from '../Logout/Logout.js';
import Badge from '@material-ui/core/Badge';
import Notification from './Notification';
import NotificationsIcon from '@material-ui/icons/Notifications';
import './prof.css';

class Profile_page extends Component {

  constructor(props){
    super(props);
    this.state = {
      showPopup: false,
      imageName : require('./best_picture_ever'),
      onoma:'',
      epitheto:"",
      upiresia:"",
      titlos:"",
      gender : "",
      email : "",
      phone : "",
      spotx : "",
      spoty : "",
      total_incedents:[],
      every_report:[],
      liveIncident : "",
      badge: 0,
      myVar : setInterval(this.checkLiveIncident, 1000)
    };
    
    
    this.change_email=this.change_email.bind(this);
    this.change_gender=this.change_gender.bind(this);
    this.change_phone=this.change_phone.bind(this);
    this.change_x=this.change_x.bind(this);
    this.change_y=this.change_y.bind(this);
    this.setProfile=this.setProfile.bind(this);
    this.handleClickOpen=this.handleClickOpen.bind(this);
    this.handleShow=this.handleShow.bind(this);
    this.gotorep=this.gotorep.bind(this);
  }

  change_email=(value)=> {
    if(value!==''  ||  value===null){
      this.setState({
        email : value
      });
    }
  }
  change_gender=(value)=> {
    if(value!==''  ||  value===null){
      this.setState({
        gender : value
      });
    }
  }
  change_phone=(value)=> {
    if(value!==''  ||  value===null){
      this.setState({
        phone : value
      });
    }
  }
  change_x=(value)=> {
    if(value!==''  ||  value===null){
      this.setState({
        spotx : value
      });
    }
  }
  change_y=(value)=> {
    if(value!==''  ||  value===null){
      this.setState({
        spoty : value
      });
    }
  }
  setProfile=(user)=>{
    this.state.onoma =   this.props.location.state.detail.firstName; //na ginei firstname
    this.state.epitheto =   this.props.location.state.detail.lastName;
    this.state.upiresia =   "user.agency";
    this.state.titlos =   this.props.location.state.detail.role;
    this.state.gender  =  this.props.location.state.detail.gender;
    this.state.email  =   this.props.location.state.detail.email;
    this.state.phone  =   "user.telephone";
    this.state.spotx  =   this.props.location.state.detail.x;
    this.state.spoty  =   this.props.location.state.detail.y;
//    this.checkLiveIncident2();
    
    // setInterval(() => this.checkLiveIncident2(), 5000);
    // return () => clearInterval(interval);
    //  this.timer = setInterval(()=> this.checkLiveIncident2(), 1000)
    //  clearInterval(this.interval);
    if(this.state.liveIncident.title){
      // console.log(true);
      this.state.badge = 1;
      
    } else{
      // console.log(false);
      this.state.badge = 0;
    }
  }
  handleClickOpen = (event) => {
    this.setState({  
      showPopup: !this.state.showPopup  
    });
  };

  handleShow=()=>{
    if(this.state.showPopup){
      return(<Notification inc={this.state.liveIncident} closePopup={this.handleClickOpen}></Notification>);
    }
    else{
      return null;
    }
  }
  checkLiveIncident = async () => {


    const data = await fetch('http://localhost:3001/control-center/api/incidents', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.location.state.detail.token
        }
    });
    if (data.status === 200) {
        const incidentData = await data.json();
        const liveIncidents = {};
        const agencyUser = this.props.location.state.detail.agency;
        
        incidentData.forEach(incedent => {
            let userInIncident = false;

            if((incedent.users).hasOwnProperty(agencyUser)){
            incedent.users[agencyUser].forEach(i => {
                if (i._id === this.props.location.state.detail.id) {
                    userInIncident = true;
                }
            })
            }
            if (incedent.isOpen && userInIncident) { //incident is OPEN("live") && userid took part
                this.setState({liveIncident:incedent});
            }
        });
        // console.log(this.state.liveIncident.title);
        // this.handleClickOpen();
        
       
    } else {
        console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
    }
  }
  // checkLiveIncident2 = async () => {
  //   console.log("edo arxizei");
  //   const data = await fetch('http://localhost:3001/control-center/api/incidents', {
  //       method: 'GET',
  //       headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //           'Authorization': 'Bearer ' + this.props.location.state.detail.token
  //       }
  //   });
  //   if (data.status === 200) {
  //       const incidentData = await data.json();
  //       const liveIncidents = {};
  //       const agencyUser = this.props.location.state.detail.agency;
  //       incidentData.forEach(incedent => {
  //           let userInIncident = false;
  //           if((incedent.users).hasOwnProperty(agencyUser)){
  //           incedent.users[agencyUser].forEach(i => {
  //               if (i._id === this.props.location.state.detail.id) {
  //                   userInIncident = true;
  //               }
  //           })
  //           }
  //           if (incedent.isOpen && userInIncident) { //incident is OPEN("live") && userid took part
  //               this.setState({liveIncident:incedent});
  //           }
  //       });
  //       console.log("edo mpainei");
       
  //       //this.handleClickOpen();
  //   } else {
  //     console.log("edo den tha eprepe alla mpainei");
  //       console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
  //   }
  // }
  // checkbadge= async()=>{
    
  // };

  gotorep= async()=>{
    // console.log(this.props.location.state.detail);
    
    this.props.history.push({
      pathname: '/Report_space',
      state: { detail: this.props.location.state.detail }
    })
  };

  render(){
  
    return (
      <div className="Profile">
        
        {/* {console.log(this.props.location.state.detail)} */}
        
        
        {this.setProfile(this.props.location.state.detail) }
        {/* {this.checkbadge} */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <img className= "image"  src={this.state.imageName} />
          </Grid>
          <Grid item xs={6} >

              <Box display="flex" flexDirection="row" justifyContent="flex-end">
                  <Box>
                  
                  <Badge color="secondary" badgeContent={this.state.badge}>
                    <Button
                    startIcon={<NotificationsIcon /> } onClick = {this.handleClickOpen} variant="contained">ΕΝΕΡΓΟ ΠΕΡΙΣΤΑΤΙΚΟ</Button>
                    </Badge>

                </Box>
                <Box>
                    <Button
                    startIcon={<NotificationsIcon /> } onClick = {this.gotorep} variant="contained">Μετάβαση στα Reports</Button>
                </Box>
                <Box>
                <Logout {...this.props} token={this.props.location.state.detail.token}></Logout>
                </Box>
              </Box>
          </Grid>
       
       
        </Grid>

        <Grid container spacing={2} >
          <Grid item xs={3}  xs zeroMinWidth>
          <div>
              <List>
                  <ListItemText primary={
                    <React.Fragment>
                      <Typography variant="body1" >
                        Όνομα: {this.state.onoma}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
                  <ListItemText primary={
                    <React.Fragment>
                      <Typography variant="body1">
                        Επίθετο: {this.state.epitheto}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
                  <ListItemText  primary={
                    <React.Fragment>
                      <Typography variant="body1">
                        Υπηρεσία: {this.state.titlos}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
              </List>
          </div>
          </Grid>
            <Divider orientation="vertical" variant="middle" flexItem />
          <Grid item xs={9}  zeroMinWidth>
          <Box>
                <Typography align="center" variant="h4"  >
                  <Box fontWeight="fontWeightBold">
                    Περισσότερες Πληροφορίες
                  </Box>
                </Typography>
                <Divider/>
                <List>
                  <ListItemText primary={
                    <React.Fragment>
                      <Typography variant="h5" display="inline" >
                        <Box fontWeight="fontWeightBold" display="inline" >
                          Email
                        </Box>
                      </Typography>
                      <Typography variant="h6" display="inline">
                        :     {this.state.email}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
                  <ListItemText  primary={
                    <React.Fragment>
                    <Typography variant="h5" display="inline" >
                      <Box fontWeight="fontWeightBold" display="inline" >
                        Φύλο
                      </Box>
                    </Typography>
                      <Typography variant="h6" display="inline">
                        :     {this.state.gender}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
                  {/* <ListItemText  primary={
                    <React.Fragment>
                    <Typography variant="h5" display="inline" >
                      <Box fontWeight="fontWeightBold" display="inline" >
                        Τηλέφωνο
                      </Box>
                    </Typography>
                      <Typography variant="h6"  display="inline">
                        :     {this.state.phone}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/> */}
                  <ListItemText  primary={
                    <React.Fragment>
                    <Typography variant="h5" display="inline" >
                      <Box fontWeight="fontWeightBold" display="inline" >
                        Τοποθεσία χ
                      </Box>
                    </Typography>
                      <Typography variant="h6"  display="inline">
                        :     {this.state.spotx}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
                  <ListItemText  primary={
                    <React.Fragment>
                    <Typography variant="h5" display="inline" >
                      <Box fontWeight="fontWeightBold" display="inline" >
                        Τοποθεσία ψ
                      </Box>
                    </Typography>
                      <Typography variant="h6"  display="inline">
                        :     {this.state.spoty}
                      </Typography>
                    </React.Fragment>
                  }/>
                  <Divider/>
                </List>
              </Box>
          </Grid>
        </Grid>
        {this.handleShow()}

      </div>
    );
  }
}
export default Profile_page;
