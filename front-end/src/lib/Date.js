class Date_Time{
    constructor(full_date_time) {
        var split_date_time=full_date_time.split("T");
        var date_split=split_date_time[0].split("-");
        var time_split=split_date_time[1].split(":");
        console.log(date_split);
        console.log(time_split);
        this.year = date_split[0];
        this.month = date_split[1];
        this.day = date_split[2];

        this.hours = time_split[0];
        this.minutes = time_split[1];
    }
      
    show_Date(){
        return this.year+"-"+this.month+"-"+this.day;
    }
    show_Time(){
        return this.hours+":"+this.minutes;
    }

    show_Date_Time(){
        return this.show_Date()+"T"+this.show_Time();
    }

}

export default Date_Time;