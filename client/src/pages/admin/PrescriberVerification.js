import {
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react"
import * as Excel from "exceljs";
import _ from "lodash";
import { getPrescriberStatuses } from "../../apiServices/verificationService";
import uploadSVG from "../../svgs/uploadSVG";
import { prescriberDataFields, prescriberDataField2prescriberDataInfo } from "../../apiServices/types/verificationServiceTypes";
import TableBody from "../../components/TableBody";

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
    const [status, setStatus] = useState("Upload File");
    const [dataType, setDataType] = useState(DatatypeEnum.excel);
    const [errors, setErrors] = useState([]);

    const handleFileChange = async (changeEvent) => {
        const eventFile = changeEvent.target.files[0];
        if (!eventFile) return;

        if (eventFile.name.endsWith(".xlsx") || eventFile.name.endsWith(".xls")){
            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(eventFile);
            setFile(workbook);
            setDataType(DatatypeEnum.excel);
        }
        else if (eventFile.name.endsWith(".csv")) {
            // TODO: csv
            setDataType(DatatypeEnum.csv);
        }
        else {
            console.error(`This should not happen. Invalid file type: ${eventFile.name}`);
            setStatus("Invalid file type.");
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

            return data;
        }
        else if (dataType === DatatypeEnum.csv) {
            // TODO: csv
            console.log();
        }
        else {
            console.error("This should not happen. Trying to parse invalid file.");
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
        const fileData = await parseFile();
        setStatus("Verifying Statuses");
        const { verified, invalid, error } = await getPrescriberStatuses(fileData);
        if (!verified.length && !invalid.length && !error.length) {
            setStatus("Something went wrong. Could not verify statuses. Try Again.");
            return;
        }
        setErrors(error);

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

    const createErrorRow = (prescriber) => {
        return (
            <tr key={prescriber['firstName'] + prescriber['lastName'] + prescriber['licenceNumber']}>
                {
                    prescriberDataFields.map(field => (
                        <td key={prescriber['firstName'] + prescriber['lastName'] + prescriber['licenceNumber'] + '_' + field} className="p-4">
                            <div className="flex items-center">
                                {
                                    prescriber[prescriberDataField2prescriberDataInfo[field]] ?
                                        prescriber[prescriberDataField2prescriberDataInfo[field]].toString() :
                                        prescriber[prescriberDataField2prescriberDataInfo[field]]
                                }
                            </div>
                        </td>
                    ))
                }
            </tr>
        )
    }

    const ErrorTable = () => {
        if (!errors.length) return null;
        return (
            <>
                <Typography variant="h4">Errors & Not Found</Typography>
                <TableBody 
                    cols={prescriberDataFields}
                    dataList={errors}
                    createRow={createErrorRow}
                />
            </>
        )
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">Prescriber Management</Typography>
            <input className="py-4" type="file" name="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button variant="gradient" className="flex items-center gap-3" onClick={verifyPrescribers}>
                {uploadSVG}
                Verify Prescribers
            </Button>
            <Typography variant="paragraph">Status: {status}</Typography>

            <ErrorTable/>
        </div>
    )
}

export default PrescriberVerification;