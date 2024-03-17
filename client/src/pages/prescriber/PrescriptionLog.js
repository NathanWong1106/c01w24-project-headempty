
import { useState } from "react";
import { useSelector } from 'react-redux';
import { Input, Button, Card, Typography, Select, Option, Form, Modal, FormGroup, Dialog, Checkbox, DialogHeader,DialogBody,DialogFooter, } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { ClosableAlert } from "../../components/ClosableAlert.js";
import { PRESCRIBER_ROUTES } from "../../routing/RouteConstants.js";
import { PrescriptionForm } from "./PrescriptionForm.js";
import { PrescriptionList } from "../../components/PrescriptionList.js";
import { PrescriptionLogForm } from "../../components/PrescriptionLogForm.js";

const PrescriptionLog = () => {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const prescriber = useSelector(state => state.currentUser);

    // List of all prescriotion on the current page
    const [prescriptionList, setPrescriptionList] = useState([]);

    // const openForm = () => {
    //     navigate(PRESCRIBER_ROUTES.PRESC_FORM);
    // }

    const openForm = () => {
        <PrescriptionForm open={open} handleOpen={handleOpen} />
    }

    
    const prescriptions = ['Prescription 1', 'Prescription 2', 'Prescription 3'];

    return (
        <div className="flex flex-col h-screen ml-10 mr-10">
            <div className="mt-12">
                <div className="flex justify-between">
                    {/* Column 1 */}
                    <div className="flex flex-col justify-center items-start">
                        <Typography variant="h4"> My Prescriptions </Typography>
                    </div>
                    
                    {/* Column 2 */}
                    <div className="flex flex-col justify-center items-end">   
                            <PrescriptionLogForm prescriber={prescriber} />
                    </div>
                </div>
            </div>
            <div className="flex flex-row h-screen justify-center mt-10">
                <PrescriptionList prescriber={prescriber}/>
            </div>
        </div>
    );
};

export default PrescriptionLog;