import { patchPatient } from "../apiServices/coordinatorService";
import { PatientInfo, patientField2PatientInfo, patientPatchFields } from "../apiServices/types/adminServiceTypes";
import { BaseEditDialog } from "./BaseEditDialog";

/**
 * The edit dialog for the specified patient.
 * 
 * @param {{patient: PatientInfo}} props
 */
export const EditPatientDialog = ({ patient }) => {

    return (
        <BaseEditDialog
            objToPatch={patient}
            patchFields={patientPatchFields}
            patchFieldMapping={patientField2PatientInfo}
            doPatch={async (patchObj) => await patchPatient(patient.email, patchObj)}
            headerText={`Edit ${patient.firstName} ${patient.lastName} | ${patient.email}`}
            tooltipText="Edit Patient"
        />
    );
}