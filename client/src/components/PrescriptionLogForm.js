import { useState } from "react";
import {
    Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Checkbox
} from "@material-tailwind/react";
import { PrescriberInfo, prescriberField2PrescriberInfo, prescriberPatchFields } from "../apiServices/types/adminServiceTypes";
import { visiblePrescFields, prescriptionFields, prescriptionField2PrescriptionInfo } from "../apiServices/types/prescriberServiceTypes";
import { postPrescription } from "../apiServices/prescriberService";
import { ClosableAlert } from "./ClosableAlert";

/**
 * Opens a dialog to log a new prescription.
 * 
 * To be used for both pateints and prescribers.
 * 
 * @param {{prescriber: PrescriberInfo}} props
 */
export const PrescriptionLogForm = ({ prescriber }) => {


    // Set up a mapping of relevant fields
    const fieldMapping = {};
    const typeMapping = {};
    prescriptionFields.forEach(field => {
        // fieldMapping[field] = useState(prescriber[prescriptionField2PrescriptionInfo[field]]);
        fieldMapping[field] = useState(prescriptionField2PrescriptionInfo[field][0]);
        typeMapping[field] = prescriptionField2PrescriptionInfo[field][1];
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
            const res = await postPrescription(prescriber.providerCode,  buildPostObj());
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }

    function formatDate(value) {
        //@TODO: FIGURE OUT HOW TO ADD YEAR REGEX
        return value
          .replace(/[^0-9]/g, "")
          .replace(/^([2-9])$/g, "0$1")
          .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
          .replace(/^0{1,}/g, "0")
          .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1/$2")
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
                        {
                            prescriptionFields.map(field => {
                                let [state, setState] = fieldMapping[field];
                                let type = typeMapping[field];
                                
                                if (type === "date") {
                                    return (<Input label={field}
                                        maxLength={10}
                                        key={`field_edit_${field}`}
                                        size="md"
                                        value={state ? formatDate(state) : ""}
                                        placeholder="MM/DD/YYYY"
                                        onChange={el => setState(el.target.value)} />);
                                }
                                if (type === "checkbox") {
                                    return (<Checkbox label={field}
                                        key={`field_edit_${field}`}
                                        size="md"
                                        value={state}
                                        onChange={el => setState(el.target.value)} />);
                                }
                                return (<Input label={field}
                                    key={`field_edit_${field}`}
                                    size="md"
                                    value={state ? state : ""}
                                    onChange={el => setState(el.target.value)} />);
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