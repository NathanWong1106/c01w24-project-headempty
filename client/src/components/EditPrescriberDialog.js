import { useState } from "react";
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
import { PrescriberInfo, prescriberField2PrescriberInfo, prescriberPatchFields } from "../apiServices/types/adminServiceTypes";
import { patchPrescriber } from "../apiServices/adminService";
import { ClosableAlert } from "./ClosableAlert";
import pencilSVG from "../svgs/pencilSVG";

/**
 * Opens the edit dialog for the specified prescriber.
 * 
 * TODO: this can probably be split into a dialog component later for Patient Management.
 * 
 * @param {{prescriber: PrescriberInfo}} props
 */
export const EditPrescriberDialog = ({ prescriber }) => {

    // Set up a mapping of relevant fields
    const fieldMapping = {};
    prescriberPatchFields.forEach(field => {
        fieldMapping[field] = useState(prescriber[prescriberField2PrescriberInfo[field]]);
    })

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);

    const buildPatchObj = () => {
        let obj = {};

        prescriberPatchFields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[prescriberField2PrescriberInfo[field]] = state;
        })

        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const res = await patchPrescriber(prescriber.providerCode, buildPatchObj());
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }

    return (
        <>
            <Tooltip content="Edit Prescriber">
                <IconButton variant="text" onClick={handleOpen}>
                    {pencilSVG}
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{`Edit ${prescriber.firstName} ${prescriber.lastName} | ${prescriber.providerCode}`}</DialogHeader>
                <DialogBody className="h-[42rem] overflow-scroll">
                    <div className="flex flex-col justify-between gap-8">
                        {
                            prescriberPatchFields.map(field => {
                                let [state, setState] = fieldMapping[field];
                                return (<Input label={field}
                                    key={`field_edit_${field}`}
                                    size="md"
                                    disabled={field === 'Provider Code'}
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