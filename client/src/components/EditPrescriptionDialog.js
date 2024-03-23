import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Tooltip,
    Input,
    Select,
    Option
} from "@material-tailwind/react";
import { PrescriberPrescription, prescriptionFields, prescriptionField2PrescriptionInfo } from "../apiServices/types/prescriptionTypes";

import { ClosableAlert } from "./ClosableAlert";
import pencilSVG from "../svgs/pencilSVG";
import { PRESCRIBER_PRESCRIPTION_STATUS } from "../apiServices/types/prescriptionTypes";
import { patchPrescriberPrescription } from "../apiServices/adminService";


/**
 * Opens the edit dialog for the specified prescriber.
 * 
 * TODO: this can probably be split into a dialog component later for Patient Management.
 * 
 * @param {{prescription: PrescriberInfo}} props
 */
export const EditPrescriptionDialog = ({ prescription }) => {

    // Set up a mapping of relevant fields
    const fieldMapping = {};
    prescriptionFields.forEach(field => {
        fieldMapping[field] = useState(prescription[prescriptionField2PrescriptionInfo[field]]);
    })
    const [prescribed, setPrescribed] = fieldMapping["Prescribed with Discovery Pass"];
    const [status, setStatus] = fieldMapping["Status"]
    const textInputFields = ["Provider Code", "Date", "Patient Initials"];

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);

    const buildPatchObj = () => {
        let obj = {};

        prescriptionFields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[prescriptionField2PrescriptionInfo[field]] = state;
        })

        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const res = await patchPrescriberPrescription(prescription.providerCode, prescription.initial, prescription.date, buildPatchObj());
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }

    return (
        <>
            <Tooltip content="Edit Prescription">
                <IconButton variant="text" onClick={handleOpen}>
                    {pencilSVG}
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{`Edit Prescription ${prescription.providerCode} | ${prescription.initial} | ${prescription.date}`}</DialogHeader>
                <DialogBody className="h-[42rem] overflow-scroll">
                    <div className="flex flex-col justify-between gap-8">
                        {
                            textInputFields.map(field => {
                                let [state, setState] = fieldMapping[field];
                                return (<Input label={field}
                                    key={`field_edit_${field}`}
                                    size="md"
                                    value={state}
                                    onChange={el => setState(el.target.value)} />);
                            })
                        }
                        <Select
                            label="Prescribed with Discovery Pass" 
                            value={prescribed}
                            onChange={el => setPrescribed(el.target.value)}
                        >
                            <Option>true</Option>
                            <Option>false</Option>
                        </Select>
                        <Select
                            label="Status"
                            value={status}
                            onChange={el => setStatus(el.target.value)}    
                        >
                            <Option>{PRESCRIBER_PRESCRIPTION_STATUS.NOT_LOGGED}</Option>
                            <Option>{PRESCRIBER_PRESCRIPTION_STATUS.LOGGED}</Option>
                            <Option>{PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE}</Option>
                            <Option>{PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE_WITH_DISCOVERY_PASS}</Option>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleConfirmChanges}>
                        <span>Confirm Changes</span>
                    </Button>
                </DialogFooter>
            </Dialog>
            <div className="fixed flex flex-col items-center left-0 bottom-10 w-screen z-50">
                <ClosableAlert text="Failed to make changes. Please try again later." color="red" open={showAlertFailure} onDismiss={() => setShowFailure(false)} />
                <ClosableAlert text="Success! Refresh the list to see your changes." color="green" open={showAlertSuccess} onDismiss={() => setShowSuccess(false)} />
            </div>
        </>
    );
}