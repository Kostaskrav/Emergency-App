import React ,{Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Report_tabs from '../Report_tabs/Report_tabs.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Pop_ensure_send from '../Pop_ensure_send';

import './Incedents_tabs.css';



function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
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
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  

class Incedents_tabs extends Component{

    constructor(props){
        super(props);

        this.state={
            value:0,
            showSuccessSend:false,
            showPopup: false ,
            all_reports:this.props.state.every_report,
            comments_text:[],
            deaths:[],
            injuries:[],
            units:[]
        }



        this.handleClickOpen=this.handleClickOpen.bind(this);
        this.change_report_deaths=this.change_report_deaths.bind(this);
        this.change_report_injuries=this.change_report_injuries.bind(this);
        this.change_report_units=this.change_report_units.bind(this);
        this.change_report_text=this.change_report_text.bind(this);
        this.submit_handler=this.submit_handler.bind(this);
        this.handleOpenPopUp=this.handleOpenPopUp.bind(this);
        this.handleSuccessSend=this.handleSuccessSend.bind(this);
        this.submit_Pop_up_check=this.submit_Pop_up_check.bind(this);
        this.patchReport=this.patchReport.bind(this);
        this.handleShow=this.handleShow.bind(this);
        this.init_comments_text=this.init_comments_text.bind(this);
        this.init_injuries=this.init_injuries.bind(this);
        this.init_deaths=this.init_deaths.bind(this);
        this.init_units=this.init_units.bind(this);

    }

    handleClickOpen = (event,newValue) => {
        this.setState({  
            value: newValue 
        });
      };

      change_report_deaths=(event,index)=>{        
      
        let newVal = event.target.value;   
        const onlyNums2 = /^[0-9\b]+$/;
        if (newVal === '' || onlyNums2.test(newVal)) { 
          var joined=this.state.deaths;
          joined[index]=newVal;    
          this.setState({
            deaths:joined
          });
        }
      }
      change_report_injuries=(event,index)=>{        
      
        let newVal = event.target.value;    
        const onlyNums2 = /^[0-9\b]+$/;
        if (newVal === '' || onlyNums2.test(newVal)) { 
          var joined=this.state.injuries;
          joined[index]=newVal;    
          this.setState({
            injuries:joined
          });
        }
      }

      change_report_units=(event,index)=>{        
      
        let newVal = event.target.value; 
        const onlyNums2 = /^[0-9\b]+$/;
        if (newVal === '' || onlyNums2.test(newVal)) {    
          var joined=this.state.units;
          joined[index]=newVal;    
          this.setState({
            units:joined
          });
          // this.setState({
          //   units : newVal
          // });
        }
      }

      change_report_text=(event,index)=>{        
        
        let newVal = event.target.value;  
        var joined=this.state.comments_text;
        joined[index]=newVal;    
          this.setState({
            comments_text:joined
          });
      }

      submit_Pop_up_check=(event)=>{
        event.preventDefault();
        this.setState({  
          showPopup:true, 
        });
      }

      submit_handler=(event,index_num)=>{
        event.preventDefault();
        if(this.state.comments_text[index_num]===""  || this.state.comments_text[index_num]==null){
          this.setState({  
            showPopup: false,
          });
          alert("To Report ήταν κενό!");
          return null;
        }
        // console.log("SE POIO INDEX EIMAI");
        // console.log(index_num);
        //add the comments the user added to the report ! 
        this.patchReport(index_num);

        this.props.change_total_incedents(index_num);
        this.props.change_every_report(index_num);  
        this.props.change_my_formal_reports(index_num);  
        this.setState({  
          showPopup: false,
          showSuccessSend: true ,
          all_reports:this.props.state.every_report,
          value : 0,
          // deaths:0,
          // injuries:0,
          // units:0
        });    
      }

      handleOpenPopUp=()=>{
        this.setState({  
          showPopup: false  
        });

      }

     patchReport=async(index_num)=>{
       let id = "";
      //   await this.props.state.my_formal_reports.map((item)=>{
      //   console.log(item);
      //   //  if(item.writer === this.props.uId && item.incId === this.props.state.total_incedents[this.state.value]._id ){
      //     //  console.log("found the report");
      //     //  id = item.id;
      //   //  }
               
      // })
      id=this.props.state.my_formal_reports[index_num]._id;
      const data = await fetch('http://localhost:3001/control-center/api/formal-reports/' + id , {
        method: 'PATCH',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.props.token
        },
        body: JSON.stringify({
          "comments" : this.state.comments_text[index_num],
          "casualties": this.state.deaths[index_num],
          "injuries": this.state.injuries[index_num],
          "unitsDeployed": this.state.units[index_num]
        })
      });
      if(data.status === 200){
        console.log("updated");
        var joined=this.state.comments_text;
        joined.splice(index_num,1);
        var joined_u=this.state.units;
        joined_u.splice(index_num,1);
        var joined_d=this.state.deaths;
        joined_d.splice(index_num,1);
        var joined_i=this.state.injuries;
        joined_i.splice(index_num,1);
        this.setState({
          deaths:joined_d,
          injuries:joined_i,
          units:joined_u,
          comments_text:joined
        })
        
      
      }else{
        console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
      }
     }

     init_comments_text(index_num){
      if(this.state.comments_text[index_num]== null){
        var joined=this.state.comments_text;
        joined[index_num]="";
        this.setState({
          comments_text:joined
        })
      }
    }
    
    init_deaths(index_num){
      if(this.state.deaths[index_num]== null){
        var joined=this.state.deaths;
        joined[index_num]=0;
        this.setState({
          deaths:joined
        })
      }
    }

    init_injuries(index_num){
      if(this.state.injuries[index_num]== null){
        var joined=this.state.injuries;
        joined[index_num]=0;
        this.setState({
          injuries:joined
        })
      }
    }

    init_units(index_num){
      if(this.state.units[index_num]== null){
        var joined=this.state.units;
        joined[index_num]=0;
        this.setState({
          units:joined
        })
      }
    }

      handleSuccessSend=()=>{
        this.setState({  
          showSuccessSend: true  
        });
      }
      handleShow=()=>{
        if(this.state.showPopup){
          return(<Pop_ensure_send report_name={this.props.state.total_incedents[this.state.value].title} tab_num={this.state.value} showSuccessSend={this.submit_handler} closePopup={this.handleOpenPopUp}></Pop_ensure_send>);
        }
        else{
          return null;
        }
      }

    render(){     
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({  
          showSuccessSend: false 
        });
        
      };
        return(
            <div>
                <AppBar position="static" color="default">
                    <Tabs
                    value={this.state.value}
                    onChange={this.handleClickOpen}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    >
                    {this.props.state.total_incedents.map((item,index_num) =>
                        
                        <Tab key={index_num}
                       
                         label={item.title} 
                         {...a11yProps(index_num)} />
                        
                    )}
                                        
                    </Tabs>
                </AppBar>
                
                {this.props.state.total_incedents.map((item,index_num)=>
                    <TabPanel key={index_num} value={this.state.value} index={index_num}>

                        {/* //edo einai ta report tabs pou eipame pos tha mpoune sto formal report ! */}
                        {/* {console.log("ALITHINA SXOLIA")}
                        {console.log(this.props.state.every_report[index_num])}
                        {console.log(this.props.state.comments_text[index_num])}
                        {console.log(this.state.all_reports[index_num])} */}
                        {/* {console.log("MPLAAAAAAA")}
                        {console.log(this.state.comments_text)} */}
                        <Report_tabs reports={this.props.state.every_report[index_num]} ></Report_tabs>


                        {this.init_comments_text(index_num)}
                        {this.init_deaths(index_num)}
                        {this.init_injuries(index_num)}
                        {this.init_units(index_num)}
                        <form onSubmit={(event)=>{this.submit_Pop_up_check(event,this.state.value)}}>
                        <TextField
                            required
                            value={this.state.deaths[this.state.value]}
                            id="standard-number"
                            label="Deaths"
                            type="number"
                            variant="outlined"
                            onChange={(e)=>{ this.change_report_deaths(e,index_num)}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />    
                          <TextField
                            required
                            value={this.state.injuries[this.state.value]}
                            id="standard-number"
                            label="Injuries"
                            type="number"
                            variant="outlined"
                            onChange={(e)=>{ this.change_report_injuries(e,index_num)}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <TextField
                            required
                            value={this.state.units[this.state.value]}
                            id="standard-number"
                            label="unitsDeployed"
                            type="number"
                            variant="outlined"
                            onChange={(e)=>{ this.change_report_units(e,index_num)}}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />                      
                          
                          <TextField
                            required
                            id="standard-disabled"
                            multiline
                            fullWidth
                            rows={5}
                            rowsMax={10}
                            variant="outlined"
                            value={this.state.comments_text[this.state.value]}
                            onChange={(e)=>{ this.change_report_text(e,this.state.value)}}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              type="submit"
                            >
                              Αποστολή
                            </Button>
                        </form>
                        
                    </TabPanel>
                )}
                <Snackbar open={this.state.showSuccessSend} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  To Report εστάλει επιτυχώς!
                </Alert>
                </Snackbar>
                {this.handleShow()}
                {/* {this.state.showPopup ?
                  <Pop_ensure_send tab_num={this.state.value} showSuccessSend={this.submit_handler} closePopup={this.handleOpenPopUp}></Pop_ensure_send>
                  : null
                } */}
            </div>
        );
    }

}



export default Incedents_tabs;