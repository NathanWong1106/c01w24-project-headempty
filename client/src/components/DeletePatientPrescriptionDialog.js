import { useEffect, useState } from "react";
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
    Option,
    Checkbox
} from "@material-tailwind/react";
import { PrescriberPrescription, prescriptionFields, prescriptionField2PrescriptionInfo } from "../apiServices/types/prescriptionTypes";

import { ClosableAlert } from "./ClosableAlert";
import trashSVG from "../svgs/trashSVG";
import { PRESCRIBER_PRESCRIPTION_STATUS } from "../apiServices/types/prescriptionTypes";
import { deletePrescriberPrescription, getAdminSinglePatientPrescription, patchPrescriberPrescription } from "../apiServices/adminService";
import { PatientInfo } from "../apiServices/types/adminServiceTypes";
import { deletePatientPrescription } from "../apiServices/coordinatorService";

/**
 * Opens the delete confirm dialog for the specified prescription.
 * 
 * @param {{prescription: PatientInfo}} props
 */
export const DeletePatientPrescriptionDialog = ({ prescription }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);

    const handleDeletion = async () => {
        try {
            const res = await deletePatientPrescription({
                providerCode: prescription.providerCode,
                initial: prescription.initial,
                date: prescription.date
            });
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }
        handleOpen();
    }

    return (
        <>
            <Tooltip content="Delete Prescription">
                <IconButton variant="text" onClick={handleOpen}>
                    {trashSVG}
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Delete Prescription</DialogHeader>
                <DialogBody>
                    {
                        `Delete prescription with:
                        Provider Code: ${prescription.providerCode},
                        Patient Initial: ${prescription.initial},
                        Date: ${prescription.date}`
                    }
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="green" onClick={handleOpen}>
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        onClick={handleDeletion}
                        className="mr-1"
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
            <div className="fixed flex flex-col items-center left-0 bottom-10 w-screen z-50">
                <ClosableAlert text="Failed delete prescription. Please try again later." color="red" open={showAlertFailure} onDismiss={() => setShowFailure(false)} />
                <ClosableAlert text="Success! Refresh the list to see your changes." color="green" open={showAlertSuccess} onDismiss={() => setShowSuccess(false)} />
            </div>
        </>
    )
}