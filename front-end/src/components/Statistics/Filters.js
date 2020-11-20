import React ,{Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Statistics from '../Statistics/Statistics';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Date_Time from '../../lib/Date';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import './Filters.css';

class Filters extends Component {	
    constructor(props){
        super(props);
        this.state={
            // re_render:setInterval(this.fetchFormalsReports,5000),
            show_charts:false,
            Filter_date_from:null,
            Filter_date_to:null,
            deaths_checked:false,
            injuries_checked:false,
            units_checked:false,
            Level_1:false,
            Level_2:false,
            Level_3:false,
            Level_all:false,
            List_of_incidens:[],
            all_info:false,
        };
        
        this.fetchFormalsReports=this.fetchFormalsReports.bind(this);
        this.change_deaths_checked=this.change_deaths_checked.bind(this);
        this.change_injuries_checked=this.change_injuries_checked.bind(this);
        this.change_Level_1=this.change_Level_1.bind(this);
        this.change_Level_2=this.change_Level_2.bind(this);
        this.change_Level_3=this.change_Level_3.bind(this);
        this.change_Level_all=this.change_Level_all.bind(this);
        this.change_Filter_date_from=this.change_Filter_date_from.bind(this);
        this.change_Filter_date_to=this.change_Filter_date_to.bind(this);
        this.Filters_submit_handler=this.Filters_submit_handler.bind(this);
        this.show_Charts=this.show_Charts.bind(this);
        this.Handle_from_date_time=this.Handle_from_date_time.bind(this);
        this.Handle_to_date_time=this.Handle_to_date_time.bind(this);
        this.change_all_info=this.change_all_info.bind(this);
    }

    
     


    fetchFormalsReports = async () => { 
        const data = await fetch('http://localhost:3001/control-center/api/formal-reports', {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.location.state.detail.token
          }
        });
        if(data.status===200){
    
          const Formal_reports_Data = await data.json();
          const formal_reports = [];
          //const agencyUser = this.props.detail.agency;
          Formal_reports_Data.forEach((formal,index) => {
              if(!formal.isOpen){
                formal_reports.push(formal);
              }
              
            
          });
          this.setState({
            List_of_incidens: formal_reports
           });
        }else{
          console.log("Error Code : " + data.status + "\nError Message : " + data.statusText);
        }
        
      }

    change_deaths_checked=()=>{
        // event.preventDefault();
        // console.log("MPLA MAPL AMP "+this.state.deaths_checked);
        this.setState({
            deaths_checked:!this.state.deaths_checked
        });
    }
    change_injuries_checked=()=>{
        // event.preventDefault();
        this.setState({
            injuries_checked:!this.state.injuries_checked
        });
    }
    change_units_checked=()=>{
        // event.preventDefault();
        this.setState({
            units_checked:!this.state.units_checked
        });
    }
    change_all_info=()=>{
        // event.preventDefault();
        console.log("MPLA MAPL AMP "+this.state.all_info);
        this.setState({
            all_info:!this.state.all_info
        });
    }

    change_Level_1=(event)=>{
        this.setState({
            Level_1:!this.state.Level_1
        });
    }
    change_Level_2=(event)=>{
        this.setState({
            Level_2:!this.state.Level_2
        });
    }
    change_Level_3=(event)=>{
        this.setState({
            Level_3:!this.state.Level_3
        });
    }
    change_Level_all=(event)=>{
        if(this.state.Level_all===true){
            this.setState({
                Level_1:false,
                Level_2:false,
                Level_3:false,
                Level_all:!this.state.Level_all
            });
        }
        else{
            this.setState({
                Level_1:true,
                Level_2:true,
                Level_3:true,
                Level_all:!this.state.Level_all
            });
        }
        
    }


    change_Filter_date_from=(event)=>{
        this.setState({
            Filter_date_from:new Date(event.target.value)
        });
        

    }

    change_Filter_date_to=(event)=>{
        
        this.setState({
            Filter_date_to:new Date(event.target.value)
        });
    }


    Filters_submit_handler=(event)=>{
        event.preventDefault();
        // console.log(this.state.Filter_date_from.toISOString());
        // console.log(this.state.Filter_date_to.toISOString());
        this.setState({
            show_charts:true
        });
    }

    show_Charts=()=>{
        if(this.state.show_charts){
            return(<Statistics detail={this.props.location.state.detail} prev_state={this.state} set_prev_state={this.setState}/>);
          }
          else{
            return null;
          }
    }

    Handle_to_date_time=()=>{
        if(this.state.Filter_date_from!==null){
            // console.log("-from "+this.state.Filter_date_from.toISOString());
           return(
            <TextField
                // value={this.state.Filter_date_to.toISOString()}
                required 
                id="datetime-local"
                label="Εως"
                type="datetime-local"
                // defaultValue="2017-05-24T10:30"
                InputProps={{inputProps: { min: this.state.Filter_date_from.toISOString().slice(0,16)} }}
                onChange={this.change_Filter_date_to}
                InputLabelProps={{
                shrink: true,
            }}/>
           ); 
        }
        else{
            return(
                <TextField
                    required 
                    id="datetime-local"
                    label="Εως"
                    type="datetime-local"
                    // defaultValue="2017-05-24T10:30"
                    // InputProps={{inputProps: { min:this.state.Filter_date_from.show_Date_Time()} }}
                    onChange={this.change_Filter_date_to}
                    InputLabelProps={{
                    shrink: true,
                }}/>
               ); 
        }
    }

    componentDidMount(){
        this.fetchFormalsReports();
        // this.fetchIncidents();
       
      }

    Handle_from_date_time=()=>{
        if(this.state.Filter_date_to!==null){
            // console.log("MALAKIAto"+this.state.Filter_date_to.toISOString());
           return(
            <TextField
                required
                id="datetime-local"
                label="Από"
                type="datetime-local"
                // defaultValue="2017-05-24T10:30"
                InputProps={{inputProps: { max:this.state.Filter_date_to.toISOString().slice(0,16)} }}
                onChange={this.change_Filter_date_from}
                InputLabelProps={{
                shrink: true,
            }}/>
           ); 
        }
        else{
            return(
                <TextField
                    required
                    id="datetime-local"
                    label="Από"
                    type="datetime-local"
                    // defaultValue="2017-05-24T10:30"
                    // InputProps={{inputProps: { min:this.state.Filter_date_to.show_Date_Time()} }}
                    onChange={this.change_Filter_date_from}
                    InputLabelProps={{
                    shrink: true,
                }}/>
               ); 
        }
    }

	render() {
		// const Levels = [
        //     { title: 'Level 1' },
        //     { title: 'Level 2' },
        //     { title: 'Level 3' },
        //     { title: 'All Levels' },
        // ]
		return (
		<div>
            {console.log("EDW")}
            {console.log(this.state.List_of_incidens)}
            <Grid container spacing={2}>
                <Grid  item xs={3}>
                    <Grid container spacing={2}>
                    <Grid  item xs={3}>
                        <h2>Φίλτρα</h2>
                    </Grid>    
                    <form onSubmit={this.Filters_submit_handler}>
                        <Box  border={1} borderRadius={10} className="Filters_box">
                            <Grid container alignContent='center' spacing={3}>
                            <Grid  item xs={12}>
                                {/* <TextField
                                    id="datetime-local"
                                    label="Από"
                                    type="datetime-local"
                                    // defaultValue="2017-05-24T10:30"
                                    onChange={this.change_Filter_date_from}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}/> */}
                                {this.Handle_from_date_time()}
                                {this.Handle_to_date_time()}    
                                {/* <TextField
                                    id="datetime-local"
                                    label="Εως"
                                    type="datetime-local"
                                    // defaultValue="2017-05-24T10:30"
                                    InputProps={{inputProps: { min:this.state.Filter_date_from.show_Date_Time()} }}
                                    onChange={this.change_Filter_date_to}
                                    InputLabelProps={{
                                    shrink: true,
                                }}/> */}
                            </Grid>
                            <Grid  item xs={12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.deaths_checked}
                                    onChange={this.change_deaths_checked}
                                    name="deaths_checked"
                                    color="primary"
                                />
                                }
                                label="Θάνατοι"
                            />
                            </Grid>
                            <Grid  item xs={12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.injuries_checked}
                                    onChange={this.change_injuries_checked}
                                    name="injuries_checked"
                                    color="primary"
                                />
                                }
                                label="Τραυματίες"
                            />
                            </Grid>
                            <Grid  item xs={12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.units_checked}
                                    onChange={this.change_units_checked}
                                    name="deaths_checked"
                                    color="primary"
                                />
                                }
                                label="Όργανα Υπηρεσίας"
                            />
                            </Grid>
                            <Grid  item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid  item xs={12}>
                                        <h4>Επίπεδο Σημαντικότητας</h4>
                                    </Grid>
                                    <Grid  item xs={12}>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.Level_1}
                                            onChange={this.change_Level_1}
                                            name="Level_1"
                                            color="primary"
                                        />
                                        }
                                        label="Επίπεδο 1"
                                    />
                                    </Grid>
                                    <Grid  item xs={12}>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.Level_2}
                                            onChange={this.change_Level_2}
                                            name="Level_2"
                                            color="primary"
                                        />
                                        }
                                        label="Επίπεδο 2"
                                    />
                                    </Grid>
                                    <Grid  item xs={12}>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.Level_3}
                                            onChange={this.change_Level_3}
                                            name="Level_3"
                                            color="primary"
                                        />
                                        }
                                        label="Επίπεδο 3"
                                    />
                                    </Grid>
                                    <Grid  item xs={12}>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.Level_all}
                                            onChange={this.change_Level_all}
                                            name="Level_all"
                                            color="primary"
                                        />
                                        }
                                        label="Όλα τα Επίπεδο"
                                    />
                                    </Grid>
                                </Grid>
                            </Grid>
                            
                            
                            {/* <Grid  item xs={12}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={Levels}
                                getOptionLabel={(option) => option.title}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                            />
                            </Grid> */}
                            {/* <Grid  item xs={12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.all_info}
                                    onChange={this.change_all_info}
                                    name="all_info"
                                    color="primary"
                                />
                                }
                                label="Όλες οι πληροφορίες"
                            />
                            </Grid> */}
                            <Grid  item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Αναζήτηση
                            </Button>
                            </Grid>
                            
                            </Grid>
                        </Box>
                    </form>
                    
                    </Grid>
                    
                    
                </Grid>
                <Grid item xs={8}>
                    <h2>Στατιστικά</h2>
                    {/* <Statistics prev_state={this.state} set_prev_state={this.setState}/> */}
                    {this.show_Charts()}
                </Grid>
            </Grid>
			
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}
 
export default Filters;