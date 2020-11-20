import React ,{Component} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';


import './Report_tabs.css';
import { Grid } from '@material-ui/core';


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


class Report_tabs extends Component{

    constructor(props){
        super(props);

        this.state={
            writers : [],
            texts : [],
            titles : [],
            value:0,
            
        }

        this.handleClickOpen=this.handleClickOpen.bind(this);
        this.Report_title=this.Report_title.bind(this);
        
    }

    handleClickOpen = (event,newValue) => {
        this.setState({  
            value: newValue 
        });
      };

    Report_title=(name)=>{
        return(
            "Report "+name
        );
    }

    componentDidMount(){
      const writ = [];
      const tex = [];
      const tit = [];
     this.props.reports.forEach(element => {
       //show only the closed reports
       if(!element.isOpen){
        writ.push(element.writer);
        tex.push(element.text);
        tit.push(element.title);
        // console.log(element.writer)
        // console.log(element.id);
       }
     });
     this.setState({
       writers : writ,
       texts : tex,
       titles : tit
     })
    }

    

    render(){
        return(
            <div>
                <Grid container>
                    <Grid item xs={3}>
                        <Tabs 
                            value={this.state.value}
                            onChange={this.handleClickOpen}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            orientation="vertical"
                            aria-label="Vertical tabs example"
                            >
                            {this.state.writers.map((item,index_num) =>                     
                                <Tab key={index_num} label={this.Report_title(index_num+1)} {...a11yProps(index_num)} />
                                
                            )}                    
                        </Tabs>
                    </Grid>
                    <Grid item xs={9}>
                        {this.state.texts.map((item,index_num)=>
                            <TabPanel className="tabpanel_fix" key={index_num} value={this.state.value} index={index_num}>
                                <TextField
                                    id="standard-disabled"
                                    defaultValue={ "Report id : " + this.state.titles[index_num] +"\ncomments : " +item}
                                    multiline
                                    fullWidth
                                    rows={2}
                                    rowsMax={4}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    />
                                        
                                    
                                {/* {console.log(index_num)} */}
                            </TabPanel>
                        )}
                        <hr></hr>
                        
                    </Grid>
                </Grid>
                
                    
                
                
                
            </div>
        );
    }

}



export default Report_tabs;