import { PrescriberInfo, prescriberField2PrescriberInfo, prescriberAddFields } from "../apiServices/types/adminServiceTypes";
import { addPrescriber } from "../apiServices/adminService";
import { BaseAddPrescriber } from "./BaseAddPrescriber";

/**
 * The edit dialog for the specified prescriber.
 * 
 * @param {{prescriber: PrescriberInfo}} props
 */
export const AddPrescriber = ({ open, setOpenNewPatient }) => {

    return (
        <BaseAddPrescriber
            open={open}
            setOpen={setOpenNewPatient}
            fields={prescriberAddFields}
            passedFieldMapping={prescriberField2PrescriberInfo}
            // doAdd={async (patchObj) => await patchPrescriber(prescriber.providerCode, patchObj)}
            doAdd={async (prescriber) => { return await addPrescriber(prescriber) }}
            headerText={`Add Perscriber`}
        />
    );
}