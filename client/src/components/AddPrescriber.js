import { PrescriberInfo, prescriberField2PrescriberInfo, prescriberAddFields } from "../apiServices/types/adminServiceTypes";
import { addPrescriber } from "../apiServices/adminService";
import { BaseAddPrescriber } from "./BaseAddPrescriber";

/**
 * The dialog for creating a stub for a new Prescriber.
 * 
 * @param {{open, setOpenNewPatient}} props
 */
export const AddPrescriber = ({ open, setOpenNewPrescriber }) => {

    return (
        <BaseAddPrescriber
            open={open}
            setOpen={setOpenNewPrescriber}
            fields={prescriberAddFields}
            passedFieldMapping={prescriberField2PrescriberInfo}
            doAdd={async (prescriber) => { return await addPrescriber(prescriber) }}
            headerText={`Add Prescriber`}
        />
    );
}