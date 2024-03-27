import { useState } from "react";
import { patientField2PatientInfo } from "../apiServices/types/adminServiceTypes";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Tooltip,
    Input
} from "@material-tailwind/react";
import { ClosableAlert } from "./ClosableAlert";
import { patchAddress } from "../apiServices/patientService";
import { useDispatch } from "react-redux";

/**
 * Base Edit Dialog.
 */
export const ActionNeededDialog = ({ patient, headerText}) => {
    
    const patchFields = ["Address", "City", "Province"]
    const patchFieldMapping = patientField2PatientInfo
    const tooltipText = "Fill out address fields"
    
    // Set up a mapping of relevant fields
    const fieldMapping = {};
    patchFields.forEach(field => {
        fieldMapping[field] = useState(patient[patchFieldMapping[field]]);
    })

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);
    const dispatch = useDispatch();

    const buildPatchObj = () => {
        let obj = {};

        patchFields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[patchFieldMapping[field]] = state;
            obj["email"] = patient.email
        })

        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const res = await dispatch(patchAddress(buildPatchObj())).unwrap();
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }

    return (
        <>
            <Tooltip content={tooltipText}>
                <div className="cursor-pointer text-red-600" onClick={handleOpen}>
                    Action Needed
                </div>
            </Tooltip>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{headerText}</DialogHeader>
                <DialogBody className="overflow-y-auto max-h-[calc(100vh-157px)]">
                    <div className="flex flex-col justify-between gap-8">
                        {
                            patchFields.map(field => {
                                let [state, setState] = fieldMapping[field];
                                return (<Input label={field}
                                    key={`field_edit_${field}`}
                                    size="md"
                                    value={state}
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