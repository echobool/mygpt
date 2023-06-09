
export function StandardTime(timeStr: string = ''){
    let date 
    if (timeStr == '') {
         date = new Date();
    }else{
         date = new Date(timeStr);
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds = date.getSeconds();

    const shortTime = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    return shortTime
}


export function formatDateByTimestamp(nS:string):string{
     return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');  
}