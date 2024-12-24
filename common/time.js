const disabledDate = (current) => { 
        
    return current && (current < Date.now() || current.day() === 0 || current.day() === 6); };

const optionTime = () => { 
   
        const hours = []; 
        for (let i = 8; i < 18; i++) { 
            
            const numbString = i<10? `0${i}:00` : `${i}:00`
            hours.push({value:numbString,label:numbString});  
      } 
            return hours; 
      ; 
   };

const optionsDate = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',hour:'2-digit',minute:'2-digit' };
const optionsTime = { hour: '2-digit', minute: '2-digit' };

export {optionTime,disabledDate,optionsDate}