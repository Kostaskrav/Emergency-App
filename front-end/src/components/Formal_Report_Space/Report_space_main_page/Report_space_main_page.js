import React ,{Component} from 'react';

import Incedents_tabs from '../Incedents_tabs/Incedents_tabs.js'

import './Report_space_main_page.css';




class Report_space_main_page extends Component{

    constructor(props){
        super(props);

        this.state={
            re_render:setInterval(this.fetchFormals,2000),
            total_incedents:[],
            every_report:[],
            my_formal_reports:[],
            
        }

        this.change_total_incedents=this.change_total_incedents.bind(this);
        this.change_every_report=this.change_every_report.bind(this);
        this.change_my_formal_reports=this.change_my_formal_reports.bind(this);
        this.fetchFormals=this.fetchFormals.bind(this);
        this.fetchIncidents=this.fetchIncidents.bind(this);
        this.fetchReports=this.fetchReports.bind(this);
        this.call_tabs=this.call_tabs.bind(this);
      }

        fetchFormals = async () => { 
          const data = await fetch('http://localhost:3001/control-center/api/formal-reports/user/'+this.props.detail.id, {
            method: 'GET',
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.props.detail.token
            }
          });
          if(data.status===200){
      
            const Formal_reports_Data = await data.json();
            const formal_reports = [];
            //const agencyUser = this.props.detail.agency;
            Formal_reports_Data.forEach((formal,index) => {
                formal_reports.push(formal);

               
                
            });
            this.setState({
              my_formal_reports: formal_reports
             });
            this.fetchIncidents(formal_reports);
          }else{
            console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
          }
          
        }

    fetchIncidents = async (formal_reports) => { 
        const data = await fetch('http://localhost:3001/control-center/api/incidents', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.detail.token
          }
        });
        if(data.status===200){
    
          const incidentData = await data.json();
          const liveIncidents = [];
          const agencyUser = this.props.detail.agency;
          
          formal_reports.forEach(f_report => {
            let userInIncident = false;
            
            
              var id_flag=false;
              incidentData.forEach(incedent=>{
                // console.log("userID= "+f_report.incidentId);
                // console.log("EGV EIMAI= "+incedent._id);
                if(f_report.incidentId===incedent._id){
                  if(!incedent.isOpen ){ //incident is closed && userid took part
                    liveIncidents.push(incedent);
                  }
                  return;
                }
              })
              if(id_flag){
                userInIncident = true;
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
            'Authorization': 'Bearer ' + this.props.detail.token
          }
        });
        if(data.status===200){
          const reportData = await data.json();
          const liveReports=[];
          var  liveIncidentsL = [...liveIncidents];
         
          liveIncidents.map((incident,index) => {
             let reportObj = [];
            reportData.map((report) => {

                if((report.incidentId === incident._id) ){
                    //check if the rerpot has been modified 
                    // if(report.isOpen)
                    // { //means it wasnt modified 
                    reportObj.push({
                         text : report.comments,
                         writer : report.userId,
                         id : report._id,
                         isOpen : report.isOpen,
                         title : report.title ,
                         incId : report.incidentId
                    });
                  // }
                    // else{//it was modified 
                    //   //pop it from the liveincidents 
                    //   console.log(liveIncidentsL)
                    //   liveIncidentsL.map((i,ind)=>{
                    //     if(incident._id === i._id){
                    //       liveIncidentsL.splice(ind,1);
                    //       liveReports.splice(ind,1);
                    //     }
                    //   });
                      
                    //   console.log(liveIncidentsL)
                    //   console.log(index)

                    // }
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
        this.fetchFormals();
        // this.fetchIncidents();
       
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

    change_my_formal_reports=(index)=>{        
      var joined=this.state.my_formal_reports;
      joined.splice(index,1);
          this.setState({
            my_formal_reports:joined,
          });
      }

     

    call_tabs=()=>{
      if(this.state.my_formal_reports.length>0){
        return <Incedents_tabs state={this.state} 
        token={this.props.detail.token} 
        uId={this.props.detail.id} 
        change_my_formal_reports={this.change_my_formal_reports} 
        change_total_incedents={this.change_total_incedents} 
        change_every_report={this.change_every_report}></Incedents_tabs>
      }
    }

    render(){
        return(
            <div>
              {/* {console.log("EDW")}
              {console.log(this.state.my_formal_reports)}
              {console.log("total_incidents")}
              {console.log(this.state.total_incedents)}
              {console.log("every_report")}
                {console.log(this.state.every_report)} */}
                {this.call_tabs()}
                
            </div>
        );
    }

}



export default Report_space_main_page;