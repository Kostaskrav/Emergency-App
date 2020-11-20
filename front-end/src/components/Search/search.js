import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import SearchBar from 'material-ui-search-bar';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';



import './search.css';



const MyStyles = makeStyles ({
  button:{
    background:"green",
  },

});
export default function Profile_page() {
    const classes = MyStyles();
    var value;
    return (
      <div>
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <Box>
            <Button
            className={classes.button}
            startIcon={<AddIcon />}
            >Προσθήκη χρήστη</Button>
          </Box>
        </Box>
        <Typography className="bar" variant='h3' align="center">Αναζήτηση χρήστη</Typography>
        <Box display="flex" className="s-box">
          <SearchBar className="searchbar"
             onChange={() => console.log('onChange')}
             onRequestSearch={() => console.log('onRequestSearch')}
           />
        </Box>
        <Grid container className="gridc">
          <Grid item xs={4}>
            <Typography  align="right">Όνομα-Επώνυμο</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography  align="center">Ειδικότητα </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography  align="left">Αριθμός-Μητρώου</Typography>
          </Grid>
        </Grid>
        <hr></hr>
      </div>
    );

}
