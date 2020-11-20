import React ,{Component} from 'react';
import Incedents_tabs from '../Incedents_tabs/Incedents_tabs.js'
import './Report_space_main_page.css';
import PersonIcon from '@material-ui/icons/Person';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Formal_report from '../../Formal_Report_Space/Report_space_main_page/Report_space_main_page.js'

class Report_space_main_page extends Component{

    constructor(props){
        super(props);

        this.state={
            re_render:setInterval(this.fetchIncidents,2000),
            total_incedents:[],
            every_report:[],
            
            // formal_report_id:[]
        }

        this.change_total_incedents=this.change_total_incedents.bind(this);
        this.change_every_report=this.change_every_report.bind(this);
        this.fetchIncidents=this.fetchIncidents.bind(this);
        this.gotoprof=this.gotoprof.bind(this);
        this.fetchReports=this.fetchReports.bind(this);
        this.call_tabs=this.call_tabs.bind(this);
      }

    fetchIncidents = async () => { 
        const data = await fetch('http://localhost:3001/control-center/api/incidents', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.location.state.detail.token
          }
        });
        if(data.status===200){
    
          const incidentData = await data.json();
          const liveIncidents = [];
          const agencyUser = this.props.location.state.detail.agency;
          
          incidentData.forEach(incedent => {
            let userInIncident = false;
            if((incedent.users).hasOwnProperty(agencyUser)){
            incedent.users[agencyUser].forEach(i => {
              if(i._id === this.props.location.state.detail.id){
                userInIncident = true;
              }
            })}
              if(!incedent.isOpen && userInIncident ){ //incident is closed && userid took part
                
                  liveIncidents.push(incedent);
              }
          });         
          this.fetchReports(liveIncidents); //fetch the reports for each incident
          
        }else{
          console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
      }

      fetchReports = async (liveIncidents) => { 
        const data = await fetch('http://localhost:3001/control-center/api/reports', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.location.state.detail.token
          }
        });
        if(data.status===200){
          const reportData = await data.json();
          const liveReports=[];
          var  liveIncidentsL = [...liveIncidents];
         
          liveIncidents.map((incident,index) => {
             let reportObj = [];
            reportData.map((report) => {
                if((report.incidentId === incident._id) && (report.userId === this.props.location.state.detail.id) ){
                    //check if the rerpot has been modified 
                    if(report.isOpen)
                    { //means it wasnt modified 
                    reportObj.push({
                         text : report.comments,
                         writer : report.userId,
                         id : report._id,
                         isOpen : report.isOpen,
                         title : report.title ,
                         incId : report.incidentId
                    });
                  }
                    else{//it was modified 
                      //pop it from the liveincidents 
                      // console.log(liveIncidentsL)
                      liveIncidentsL.map((i,ind)=>{
                        if(incident._id === i._id){
                          liveIncidentsL.splice(ind,1);
                          liveReports.splice(ind,1);
                        }
                      });
                      
                      // console.log(liveIncidentsL)
                      // console.log(index)

                    }
                }
            });
            if(reportObj.length > 0){
                liveReports.push(reportObj);
            }
            
          });
         if(liveReports.length > 0){
            this.setState({
             every_report: liveReports,
             total_incedents:liveIncidentsL
            });
        }else{
              this.setState({
                total_incedents:liveIncidentsL
               });
            }
         
          
        }else{
          console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
      }

      componentDidMount(){
        this.fetchIncidents();
       
      }

    change_total_incedents=(index)=>{        
        var joined=this.state.total_incedents;
        
        joined.splice(index,1);
          this.setState({
            total_incedents:joined,
          });
      }

    change_every_report=(index)=>{        
    var joined=this.state.every_report;
    joined.splice(index,1);
        this.setState({
            every_report:joined,
        });
    }

    gotoprof= async()=>{
      // console.log(this.props.location.state.detail);
      
      this.props.history.push({
        pathname: '/Profile_page',
        state: { detail: this.props.location.state.detail }
      })
    };

    
    call_tabs=()=>{
      if(this.state.every_report.length>0){
        return <Incedents_tabs state={this.state} 
        token={this.props.location.state.detail.token} 
        uId={this.props.location.state.detail.id} 
        change_total_incedents={this.change_total_incedents}
        change_every_report={this.change_every_report}></Incedents_tabs>
      }
    }
    
    render(){
        return(
            <div>
                <Box display="flex" flexDirection="row" justifyContent="flex-end">
                  <Box>
                      <Button
                      startIcon={<PersonIcon /> } onClick = {this.gotoprof} variant="contained">Προφίλ</Button>
                  </Box>
                </Box>
                {/* {console.log(this.state.total_incedents)}
                {console.log(this.state.every_report)} */}
                {this.call_tabs()}
                {/* <Incedents_tabs state={this.state} token={this.props.location.state.detail.token} uId={this.props.location.state.detail.id} change_total_incedents={this.change_total_incedents} change_every_report={this.change_every_report}></Incedents_tabs> */}
                <Formal_report detail={this.props.location.state.detail}></Formal_report>
            </div>
        );
    }

}



export default Report_space_main_page;