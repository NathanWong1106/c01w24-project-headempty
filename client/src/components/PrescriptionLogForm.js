import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Checkbox,
} from "@material-tailwind/react";
import { prescriptionFields, prescriptionField2PrescriptionInfo, PATIENT_PRESCRIPTION_STATUS, PRESCRIBER_PRESCRIPTION_STATUS } from "../apiServices/types/prescriptionTypes";
import { postPrescription, getMatchingPrescriberPrescription, patchPatientPrescriptionStatus } from "../apiServices/prescriberService";
import { ClosableAlert } from "./ClosableAlert";
import { DatePicker } from "./DatePicker";

/**
 * Opens a dialog to log a new prescription.
 * 
 * To be used for both pateints and prescribers.
 * 
 * 
 */
export const PrescriptionLogForm = () => {


    // Set up a mapping of relevant fields
    const fieldMapping = {};
    const [prscn_date, setPrscn_date] = useState(new Date());
    const [patientInit, setPatientInit] = useState("");
    const [checked, setChecked] = useState(false);
    const [pat_status, setPatStatus] = useState("");
    const providerCode = useSelector(state => state.currentUser.auxInfo.providerCode);
    prescriptionFields.forEach(field => {
        if (prescriptionField2PrescriptionInfo[field] === "providerCode") {
            fieldMapping[field] = useState(providerCode);
        } else if (prescriptionField2PrescriptionInfo[field] === "prescribed") {
            fieldMapping[field] = useState(false);
        } else {
            fieldMapping[field] = useState("");
        }
    })
    


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);

    const buildPostObj = () => {
        let obj = {};
        prescriptionFields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[prescriptionField2PrescriptionInfo[field]] = state;
        })
        return obj;

    }

    const handleConfirmChanges = async () => {
        try {
            //checking if the prescription is already logged by patient
            const ret = await getMatchingPrescriberPrescription(providerCode, prscn_date, patientInit);
            if ((ret)['bool'] === true){
                if (checked) {
                    fieldMapping["Status"][0] = PRESCRIBER_PRESCRIPTION_STATUS.LOGGED;
                    setPatStatus(PATIENT_PRESCRIPTION_STATUS.LOGGED);
                } else {
                    fieldMapping["Status"][0] = PRESCRIBER_PRESCRIPTION_STATUS.COMPLETE;
                    setPatStatus(PATIENT_PRESCRIPTION_STATUS.COMPLETE);
                }
                //call patchPrescription for corresponding Patient with updated status
                const stat = await patchPatientPrescriptionStatus(ret['id'], pat_status);
            }
            //call for posting prescription
            const res = await postPrescription(providerCode, buildPostObj());
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }


    return (
        <>
            <Button className="mt-6 bg-moss-green" onClick={handleOpen}>
                Create New Prescription
            </Button> 
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Log New Prescription</DialogHeader>
                <DialogBody className="h-[42rem] overflow-scroll">


                    <div className="flex flex-col justify-between gap-8">
                        
                         <DatePicker field={"Date"}/>
                        
                        {
                            prescriptionFields.map(field => {
                                let [state, setState] = fieldMapping[field];

                                if (prescriptionField2PrescriptionInfo[field] === "status") {
                                    return(null);
                                }
                     
                                if (prescriptionField2PrescriptionInfo[field] === "date") {
                                    const handleDate = (date) => {
                                        setState(date);
                                        setPrscn_date(date);
                                    }
                                    return (<Input label={field}
                                    maxLength={10}
                                    key={`field_edit_${field}`}
                                    size="md"
                                    value={state}
                                    placeholder="YYYY-MM-DD"
                                    onChange={el => handleDate(el.target.value)}/>);
                                }

                                if (prescriptionField2PrescriptionInfo[field] === "prescribed") {
                                    const handleCheckbox = () => {
                                        setChecked(!checked);
                                        setState(!state);
                                    }
                                    return (<Checkbox label={field}
                                        key={`field_edit_${field}`}
                                        size="md"
                                        value={state}
                                        onChange={handleCheckbox} />);
                                }
                                const handleInput = (value) => {
                                    if (field === "Patient Initials") {
                                        setPatientInit(value);
                                    }
                                    setState(value);
                                }
                                
                                return (<Input label={field}
                                    key={`field_edit_${field}`}
                                    size="md"
                                    value={state}
                                    onChange={el => handleInput(el.target.value)} />);
                            })
                        }
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