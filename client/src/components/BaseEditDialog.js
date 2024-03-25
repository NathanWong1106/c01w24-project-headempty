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
import { ClosableAlert } from "./ClosableAlert";
import pencilSVG from "../svgs/pencilSVG";

/**
 * Base Edit Dialog.
 */
export const BaseEditDialog = ({ objToPatch, patchFields, patchFieldMapping, doPatch, headerText, tooltipText }) => {

    // Set up a mapping of relevant fields
    const fieldMapping = {};
    patchFields.forEach(field => {
        fieldMapping[field] = useState(objToPatch[patchFieldMapping[field]]);
    })

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);

    const buildPatchObj = () => {
        let obj = {};

        patchFields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[patchFieldMapping[field]] = state;
        })

        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const res = await doPatch(buildPatchObj());
            res ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }

    return (
        <>
            <Tooltip content={tooltipText}>
                <IconButton variant="text" onClick={handleOpen}>
                    {pencilSVG}
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{headerText}</DialogHeader>
                <DialogBody className="h-[42rem] overflow-scroll">
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