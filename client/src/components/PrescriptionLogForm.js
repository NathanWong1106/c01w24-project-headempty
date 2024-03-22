import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Checkbox, Popover, PopoverHandler, PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { visiblePrescFields, prescriptionFields, prescriptionField2PrescriptionInfo } from "../apiServices/types/prescriptionTypes";
import { postPrescription, getMatchingPrescriberPrescription } from "../apiServices/prescriberService";
import { ClosableAlert } from "./ClosableAlert";
import { set } from "lodash";

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
    const typeMapping = {};
    const [prscn_date, setPrscn_date] = useState(new Date());
    const [patientInit, setPatientInit] = useState("");
    const providerCode = useSelector(state => state.currentUser.auxInfo.providerCode);
    prescriptionFields.forEach(field => {
        // fieldMapping[field] = useState(prescriber[prescriptionField2PrescriptionInfo[field]]);
        // fieldMapping[field] = useState(prescriptionField2PrescriptionInfo[field][0]);
        if (prescriptionField2PrescriptionInfo[field][0] === "providerCode") {
            fieldMapping[field] = useState(providerCode);
        } else if (prescriptionField2PrescriptionInfo[field][0] === "prescribed") {
            fieldMapping[field] = useState(false);
        } else {
            fieldMapping[field] = useState("");
        }
        typeMapping[field] = prescriptionField2PrescriptionInfo[field][1];
    })
    


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [showAlertFailure, setShowFailure] = useState(false);
    const [showAlertSuccess, setShowSuccess] = useState(false);

    const buildPostObj = () => {
        let obj = {};
        prescriptionFields.forEach(field => {
            if (field === "Patient Initials") {
                setPatientInit(fieldMapping[field]);
            }
            const [state] = fieldMapping[field];
            console.log(state);
            obj[prescriptionField2PrescriptionInfo[field][0]] = state;
        })
        console.log(obj);
        return obj;
    }

    const handleConfirmChanges = async () => {
        try {
            const res = await postPrescription(providerCode, buildPostObj());
            // const stat = await getMatchingPatientPrescription(providerCode, prscn_date, patientInit);
            res ? setShowSuccess(true) : setShowFailure(true);
            // stat ? setShowSuccess(true) : setShowFailure(true);
        } catch (err) {
            setShowFailure(true);
        }

        handleOpen();
    }

    function formatDate(field) {
        
        return field
        .replace(/[^0-9]/g, "")
        .replace(/^([2-9])$/g, "0$1")
        .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
        .replace(/^0{1,}/g, "0")
        .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1/$2")

        // const [date, setDate] = useState(new Date());
        
        // return (
        //     <div className="p-24">
        //       <Popover placement="bottom">
        //         <PopoverHandler>
        //           <Input
        //             label="Select a Date"
        //             onChange={() => null}
        //             value={date ? format(date, "PPP") : ""}
        //           />
        //         </PopoverHandler>
        //         <PopoverContent>
        //           <DayPicker
        //             mode="single"
        //             selected={date}
        //             onSelect={setDate}
        //             showOutsideDays
        //             className="border-0"
        //             classNames={{
        //               caption: "flex justify-center py-2 mb-4 relative items-center",
        //               caption_label: "text-sm font-medium text-gray-900",
        //               nav: "flex items-center",
        //               nav_button:
        //                 "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
        //               nav_button_previous: "absolute left-1.5",
        //               nav_button_next: "absolute right-1.5",
        //               table: "w-full border-collapse",
        //               head_row: "flex font-medium text-gray-900",
        //               head_cell: "m-0.5 w-9 font-normal text-sm",
        //               row: "flex w-full mt-2",
        //               cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        //               day: "h-9 w-9 p-0 font-normal",
        //               day_range_end: "day-range-end",
        //               day_selected:
        //                 "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
        //               day_today: "rounded-md bg-gray-200 text-gray-900",
        //               day_outside:
        //                 "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
        //               day_disabled: "text-gray-500 opacity-50",
        //               day_hidden: "invisible",
        //             }}
        //             components={{
        //               IconLeft: ({ ...props }) => (
        //                 <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
        //               ),
        //               IconRight: ({ ...props }) => (
        //                 <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
        //               ),
        //             }}
        //           />
        //         </PopoverContent>
        //       </Popover>
        //     </div>
        //   );
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

                                if (field === "Status") {
                                    return(null);
                                }
                     
                                if (type === "date") {
                                    const handleDate = (date) => {
                                        setState(date);
                                        setPrscn_date(date);
                                    }

                                        return (<Input label={field}
                                        maxLength={10}
                                        key={`field_edit_${field}`}
                                        size="md"
                                        value={state ? formatDate(state) : ""}
                                        placeholder="MM/DD/YYYY"
                                        onChange={el => handleDate(el.target.value)} />);
                                }

                                if (type === "checkbox") {
                                    // const [checked, setChecked] = useState(false);
                                    const handleCheckbox = () => {
                                        // setChecked(!checked);
                                        setState(!state);
                                    }
                                    return (<Checkbox label={field}
                                        key={`field_edit_${field}`}
                                        size="md"
                                        value={state}
                                        onChange={handleCheckbox} />);
                                }
                                
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