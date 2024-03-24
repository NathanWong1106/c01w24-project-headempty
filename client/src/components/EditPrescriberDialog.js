import { PrescriberInfo, prescriberField2PrescriberInfo, prescriberPatchFields } from "../apiServices/types/adminServiceTypes";
import { patchPrescriber } from "../apiServices/adminService";
import { BaseEditDialog } from "./BaseEditDialog";

/**
 * The edit dialog for the specified prescriber.
 * 
 * @param {{prescriber: PrescriberInfo}} props
 */
export const EditPrescriberDialog = ({ prescriber }) => {

    return (
        <BaseEditDialog 
            objToPatch={prescriber}
            patchFields={prescriberPatchFields}
            patchFieldMapping={prescriberField2PrescriberInfo}
            doPatch={async (patchObj) => await patchPrescriber(prescriber.providerCode, patchObj)}
            headerText={`Edit ${prescriber.firstName} ${prescriber.lastName} | ${prescriber.providerCode}`}
            tooltipText="Edit Prescriber"
        />
    );
}