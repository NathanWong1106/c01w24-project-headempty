import {
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react"
import * as Excel from "exceljs";
import _ from "lodash";
import { getPrescriberStatuses } from "../../apiServices/verificationService";

const ColumnEnum = {
    firstName: 1,
    lastName: 2,
    province: 3,
    licensingCollege: 4,
    licenceNumber: 5,
    status: 6,
}

const StatusEnum = {
    verified: "VERIFIED",
    invalid: "INACTIVE",
    error: "NOT FOUND",
}

const DatatypeEnum = {
    excel: "EXCEL",
    csv: "CSV",
}

const PrescriberVerification = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("Upload File");
    const [dataType, setDataType] = useState(DatatypeEnum.excel);
    const [errors, setErrors] = useState([]);

    // const reader = new FileReader();

    // Just use <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
    // const isValidFile = (filename) => {
    //     return [".xlsx", ".xlsm", ".xls", ".csv"].some((ele) => filename.endsWith(ele));
    // }

    const handleFileChange = async (changeEvent) => {
        const eventFile = changeEvent.target.files[0];
        if (!eventFile) return;

        if (eventFile.name.endsWith(".xlsx") || eventFile.name.endsWith(".xls")){
            const workbook = new Excel.Workbook();
            // await workbook.xlsx.load(reader.readAsArrayBuffer(eventFile));
            await workbook.xlsx.load(eventFile);
            setFile(workbook);
            setDataType(DatatypeEnum.excel);
        }
        else {
            // TODO: csv
            console.log();
            setDataType(DatatypeEnum.csv);
        }
          
    }

    const parseFile = async () => {
        if (dataType === DatatypeEnum.excel) {
            const worksheet = file.worksheets[0];
            const data = [];

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
                const rowData = {
                    firstName: row.getCell(ColumnEnum.firstName).value,
                    lastName: row.getCell(ColumnEnum.lastName).value,
                    province: row.getCell(ColumnEnum.province).value,
                    licensingCollege: row.getCell(ColumnEnum.licensingCollege).value,
                    licenceNumber: row.getCell(ColumnEnum.licenceNumber).value,
                };
                data.push(rowData);
            });

            setData(data);
        }
        else if (dataType === DatatypeEnum.csv) {
            // TODO: csv
            console.log();
        }
    }

    const updateInputFile = async (verified, invalid, error) => {
        const vLen = verified.length;
        const iLen = invalid.length;
        const eLen = error.length;
        let vIdx = 0;
        let iIdx = 0;
        let eIdx = 0;
        
        if (dataType === DatatypeEnum.excel) {
            const worksheet = file.worksheets[0];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.getCell(ColumnEnum.status).value = "Status";
                    return
                }

                const rowData = {
                    firstName: row.getCell(ColumnEnum.firstName).value,
                    lastName: row.getCell(ColumnEnum.lastName).value,
                    province: row.getCell(ColumnEnum.province).value,
                    licensingCollege: row.getCell(ColumnEnum.licensingCollege).value,
                    licenceNumber: row.getCell(ColumnEnum.licenceNumber).value,
                };
                if (vIdx < vLen && _.isEqual(rowData, verified[vIdx])) {
                    row.getCell(ColumnEnum.status).value = StatusEnum.verified;
                    vIdx++;
                }
                else if (iIdx < iLen && _.isEqual(rowData, invalid[iIdx])) {
                    row.getCell(ColumnEnum.status).value = StatusEnum.invalid;
                    iIdx++;
                }
                else if (eIdx < eLen && _.isEqual(rowData, error[eIdx])){
                    row.getCell(ColumnEnum.status).value = StatusEnum.error;
                    eIdx++;
                }
                else {
                    console.error("Critical Error, this should not happen.");
                    console.error(rowData);
                }
            });
            setFile(file);
        }
        else if (dataType === DatatypeEnum.csv) {
            // TODO:
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
        setStatus("Updating File");
        await updateInputFile(verified, invalid, error);
        setStatus("Done");
        await downloadUpdatedFile();
    }

    const downloadUpdatedFile = async () => {
        if (file && dataType === DatatypeEnum.excel) {
            const buffer = await file.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'PaRx_Prescriber_Verification.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        }
        else if (file && dataType === DatatypeEnum.csv) {
            // TODO:
        }
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">Prescriber Management</Typography>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
            <Button variant="gradient" className="flex items-center gap-3" onClick={verifyPrescribers}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
                </svg>
                Verify Prescribers
            </Button>
            <Typography variant="paragraph">{status}</Typography>
        </div>
    )
}

export default PrescriberVerification;