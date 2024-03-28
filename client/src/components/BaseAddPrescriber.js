import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { ClosableAlert } from "./ClosableAlert";


export const BaseAddPrescriber = ({ open, setOpen, fields, passedFieldMapping, doAdd, headerText }) => {

    // Set up a mapping of relevant fields
    const fieldMapping = {};
    fields.forEach(field => {
        fieldMapping[field] = useState("");
    });

    const handleOpen = () => {
        setOpen(!open);

        // Reset all field states to their initial values
        Object.keys(fieldMapping).forEach(field => {
            const initialValue = "";
            const [, setState] = fieldMapping[field];
            setState(initialValue);
        });
    }

    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);
    const [errMessage, setErrMessage] = useState("");

    const buildPatchObj = () => {
        let obj = {};

        fields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[passedFieldMapping[field]] = state;
        })

        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const res = await doAdd(buildPatchObj());
            if (res.data) {
                setShowSuccess(true);
                setErrMessage("");
            } else {
                setShowFailure(true);
                setErrMessage(res.error);
            }
        } catch (err) {
            setShowFailure(true);
            setErrMessage(err);
        }

        handleOpen();
    }

    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>{headerText}</DialogHeader>
                <DialogBody className="overflow-y-auto max-h-[calc(100vh-157px)]">
                    <div className="flex flex-col justify-between gap-8">
                        {
                            fields.map(field => {
                                let [state, setState] = fieldMapping[field];
                                return (
                                    <Input
                                        label={field}
                                        key={`field_edit_${field}`}
                                        size="md"
                                        value={state}
                                        onChange={el => setState(el.target.value)}
                                    />
                                );

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
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
            <div className="fixed flex flex-col items-center left-0 bottom-10 w-screen z-50">
                <ClosableAlert text={errMessage} color="red" open={showAlertFailure} onDismiss={() => setShowFailure(false)} />
                <ClosableAlert text="Success!" color="green" open={showAlertSuccess} onDismiss={() => setShowSuccess(false)} />
            </div>
        </>
    );
}