import Moment from 'moment';
import { Button,Label } from 'flowbite-react';


export default function DateViewChooser ({baseDay,view,setBaseDay}){

    const decrement=()=>{
        console.log('decrement');
       
        let newDate;
        if(view==='day'){
          newDate= Moment(baseDay).subtract(1, 'days');}
          else if(view==="week"){
            newDate= Moment(baseDay).subtract(1, 'week');}
          else if(view==="month"){
            newDate= Moment(baseDay).subtract(1, 'month');}
          
        setBaseDay((prev)=>{
          return newDate;
      });
      }
    
      const increment=()=>{
        console.log('increment');
        let newDate;
        if(view==='day'){
          newDate= Moment(baseDay).add(1, 'days');}
          else if(view==="week"){
            newDate= Moment(baseDay).add(1, 'week');}
          else if(view==="month"){
            newDate= Moment(baseDay).add(1, 'month');}
    
        setBaseDay((prev)=>{
          return newDate
      });
      }

      const DateDisplay=()=>{
        let displayElement;
    
        if(view==='day'){
          displayElement= <Button color='gray'>{baseDay.format('dddd DD/MM/YY')}</Button>}
          else if(view==="week"){
            displayElement= <span>Week {baseDay.week()}</span>}
          else if(view==="month"){
            displayElement= <span>{baseDay.format('MMMM')}</span>}
    
            return displayElement;
      }


    return(
      <Button.Group>
         <Button  color="gray" onClick={()=>{decrement()}}>&lt;&lt;</Button> 
         <DateDisplay/>
         <Button  color="gray" onClick={()=>{increment()}}>&gt;&gt;</Button>
        </Button.Group>
    )
}