export function cleanRecords(records){
    if(!records || !Array.isArray(records))return [];

    return records.map(row=>{
        const cleanedRow = {};
        for(let key in row){
            let value = row[key];

            //normalize header key
            let cleanKey= key.trim().replace(/\s+/g,"_").toLowerCase();

            //handle value cleaning
            if(typeof value==="string"){
                value=value.trim();
                if(!isNaN(value) && value!==""){
                    value=Number(value); //numeric conversion
                }else if(Date.parse(value)){//checks if it's a valid date
                    const date=new Date(value);
                    if(!isNaN(date.getTime())){
                        value=date;
                    }
                }
            }
            cleanedRow[cleanKey]=value;
        }
        return cleanedRow;
    });
}