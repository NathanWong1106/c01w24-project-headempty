import fs from 'fs';


export function parseCSV(){

    const nameColumns = ["firstName",'lastName', 'province', 'licensingCollege', "licenceNumber"]

    const csvAsString = fs.readFileSync('Parx Sample Data.csv', 'binary');

    function parseToArray(csvString){
        //Split the array into rows, then split these rows into cells
        return csvString.split('\r\n').map(row => {
        return row.split(',')
        });
    }


    const result = [];

    const csvAsArray = parseToArray(csvAsString);


    for (let i = 1; i<csvAsArray.length; i++){
        const obj = {};

        for (let j = 0; j<nameColumns.length;j++){
            obj[nameColumns[j]] = csvAsArray[i][j];
        }

        result.push(obj);
    }

    return result;
}
