import { useState } from "react"
import * as Excel from "exceljs";
import { getPrescriberStatuses } from "../../apiServices/verificationService";

const PrescriberVerification = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("Upload File");
    const [dataType, setDataType] = useState("");
    const [errors, setErrors] = useState([]);

    // const reader = new FileReader();

    // Just use <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
    // const isValidFile = (filename) => {
    //     return [".xlsx", ".xlsm", ".xls", ".csv"].some((ele) => filename.endsWith(ele));
    // }

    const onFileChange = async (changeEvent) => {
        const eventFile = changeEvent.target.files[0];
        if (!eventFile) return;

        if (eventFile.name.endsWith(".xlsx") || eventFile.name.endsWith(".xls")){
            const workbook = new Excel.Workbook();
            // await workbook.xlsx.load(reader.readAsArrayBuffer(eventFile));
            await workbook.xlsx.load(eventFile);
            setFile(workbook);
            setDataType("excel");
        }
        else {
            // TODO: csv
            console.log();
            setDataType("csv");
        }
          
    }

    const parseFile = async () => {
        if (dataType === "excel") {
            const worksheet = file.worksheets[0];
            const data = [];

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
                const rowData = {
                    firstName: row.getCell(1).value,
                    lastName: row.getCell(2).value,
                    province: row.getCell(3).value,
                    licensingCollege: row.getCell(4).value,
                    licenceNumber: row.getCell(5).value,
                };
                data.push(rowData);
            });

            setData(data);
        }
        else if (dataType === "csv") {
            // TODO: csv
            console.log();
        }
    }

    const verifyPrescribers = async () => {
        setStatus("Parsing File");
        await parseFile();
        setStatus("Verifying Statuses");
        const prescriberStatuses = await getPrescriberStatuses(data);
        if (!prescriberStatuses) {
            setStatus("Something went wrong. Could not verify statuses. Try Again.");
            return;
        }

        const { verified, invalid, error } = prescriberStatuses;
    }

    return (
        <div></div>
    )
}

export default PrescriberVerification;