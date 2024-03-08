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

/* This is a pretty scuffed way to get this svg, but it works */
const pencilSVG = (<svg fill="#000000" width="15px" height="15px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <path className="clr-i-solid clr-i-solid-path-1" d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"></path><path className="clr-i-solid clr-i-solid-path-2" d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"></path>
    <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
</svg>)

/**
 * Opens the edit dialog for the specified prescriber
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
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm Changes</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}