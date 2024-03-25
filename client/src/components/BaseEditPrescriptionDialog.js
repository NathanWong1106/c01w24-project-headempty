import { useEffect, useState, useCallback } from "react";
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
import { prescriptionFields } from "../apiServices/types/prescriptionTypes";

import { ClosableAlert } from "./ClosableAlert";
import pencilSVG from "../svgs/pencilSVG";

/**
 * Opens the edit dialog for the specified prescriber.
 * 
 * TODO: this can probably be split into a dialog component later for Patient Management.
 * 
 * @param {{prescription: PrescriberInfo}} props
 */
export const BaseEditPrescriptionDialog = ({ prescription, fieldMapping, prescriptionField2InfoMapping, textInputFields, getStatusOptions, patchPrescription }) => {
    const [prescribed, setPrescribed] = fieldMapping["Prescribed with Discovery Pass"];
    const [status, setStatus] = fieldMapping["Status"]

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);
    const [failureText, setFailureText] = useState("");
    const [successText, setSuccessText] = useState("");

    const [statusOptions, setStatusOptions] = useState([status]);

    const statusHelper = async () => {
        const statOps = await getStatusOptions();
        setStatusOptions(statOps);
    }

    const handleCheckbox = async (el) => {
        setPrescribed(el.target.checked);
        await statusHelper();
    }

    const buildPatchObj = () => {
        let obj = {};

        prescriptionFields.forEach(field => {
            const [state] = fieldMapping[field];
            obj[prescriptionField2InfoMapping[field]] = state;
        })

        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const [res, resBody] = await patchPrescription(prescription.providerCode, prescription.initial, prescription.date, prescribed, buildPatchObj());
            if (res) {
                await setSuccessText(resBody.message);
                setShowSuccess(true);
            }
            else {
                await setFailureText(resBody.error);
                setShowFailure(true);
            }
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
                        <Checkbox
                            defaultChecked={prescribed}
                            label="Prescribed with Discovery Pass"
                            onChange={handleCheckbox}
                        />
                        <Select
                            label="Status"
                            value={status}
                            onClick={statusHelper}
                            onChange={el => setStatus(el)}
                        >
                            {statusOptions.map((option) => (
                                <Option key={option} value={option}>{option}</Option>
                            ))}
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
                <ClosableAlert text={failureText} color="red" open={showAlertFailure} onDismiss={() => setShowFailure(false)} />
                <ClosableAlert text={successText} color="green" open={showAlertSuccess} onDismiss={() => setShowSuccess(false)} />
            </div>
        </>
    );
}