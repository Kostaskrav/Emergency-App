import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PolicyRoundedIcon from '@material-ui/icons/PolicyRounded';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import SearchIcon from '@material-ui/icons/Search';
// import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
// import HelpRoundedIcon from '@material-ui/icons/HelpRounded';
import { Link } from 'react-router-dom';


import './Header.css';



const MyStyles = theme=> ({
    titleStyle: {
        fontSize:"200%",
        fontStyle:"italic",
        fontWeight:"bold",
        textAlign:"center",
        color:"white",
    },
    iconStyle: {
        fontSize:"225%",
        fontWeight:"bold",
        color:"white",
    },
});



class Header extends Component {

    constructor(props){
        super(props);

        this.state = {
            pathname:'',
            
        };
        

    }

    
    render(){
        const {classes} = this.props;
        // const [show, setShow] = useState(false);
        // const get_paths=()=>{
        //     if(window.location.pathname!=="/Login" && window.location.pathname!=="/"){
        //         setShow(true);
        //     }
        // }
        // const currentPath = window.location.pathname;
        // const icon_handler=()=>{      
        //         // console.log("HELLO"); 
        //         // console.log(currentPath);          
        //         if(currentPath!=="/Login" && currentPath!=="/"){
        //             return(

        //                 <Box className="icon_color" display="flex" flexDirection="row" justifyContent="flex-end" >
        //                     <Box mx={3}>
        //                         <SearchIcon  fontSize='large'></SearchIcon>
        //                     </Box>
        //                     <Box mx={3}>
        //                     <Link to="/Profile_page" className={classes.iconStyle}>
        //                         <AccountCircleSharpIcon  fontSize='large'></AccountCircleSharpIcon>
        //                     </Link>

        //                     </Box>
        //                     <Box mx={3}>
        //                         <HelpRoundedIcon  fontSize='large' onClick = {this.handleClickOpen} ></HelpRoundedIcon>
        //                     </Box>
        //                 </Box>
        //         );
        //         }

        //     return;
        // }
        return(
            <div className="Top_Footer">
                {/* <Container maxWidth='md'>
                          <Paper className={classes.paper}>xs=6</Paper>
                    <Typography className={classes.titleStyle}
                     align='center'variant='h1'>999 ΚΈΝΤΡΟ ΕΛΈΓΧΟΥ</Typography>
                </Container> */}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Link to="/Login"  >
                            <PolicyRoundedIcon className={classes.iconStyle} fontSize='large'></PolicyRoundedIcon>
                        </Link>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.titleStyle}
                        align='center'variant='h4' fontWeight="bold">999 ΚΕΝΤΡΟ ΕΛΕΓΧΟΥ</Typography>
                    </Grid>
                    <Grid item xs={12}>
                    {/* {icon_handler()} */}
                    </Grid>
                </Grid>
            </div>
        );
    }

}


export default withStyles(MyStyles)(Header);
