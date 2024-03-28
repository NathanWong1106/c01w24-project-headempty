import {
    Input,
    Typography,
<<<<<<< HEAD
    Tooltip
=======
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
} from "@material-tailwind/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getPaginatedPatientPrescriptions } from "../../apiServices/patientService";
import { prescriptionField2PrescriptionInfo, prescriptionFields } from "../../apiServices/types/prescriptionTypes";
import PaginatedTableWithSearch from "../../components/PaginatedTableWithSearch";
<<<<<<< HEAD
import { PrescriptionLogForm } from "../../components/PrescriptionLogForm.js";
import { ActionNeededDialog } from "../../components/ActionNeededDialog.js";
=======
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7

const PAGE_SIZE = 20;

const PatientPrescriptions = () => {
    // List of all prescriptions on the current page
    const [prescriptionList, setPrescriptionList] = useState([]);
    // Search fields
    const [date, setDate] = useState("");
<<<<<<< HEAD
    const [initial, setInitials] = useState("");
=======
    const [initials, setInitials] = useState("");
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
    const [prescribed, setPrescribed] = useState("");
    const [status, setStatus] = useState("");
    // Search obj
    const [prevSearch, setPrevSearch] = useState({});

<<<<<<< HEAD
    const patient = useSelector(state => state.currentUser.auxInfo);
    const { email, address, province, city } = patient;
=======
    const email = useSelector(state => state.currentUser.auxInfo.email);
    const firstName = useSelector(state => state.currentUser.auxInfo.firstName);
    const lastName = useSelector(state => state.currentUser.auxInfo.lastName);
    const language = useSelector(state => state.currentUser.auxInfo.language);
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7

    const getSearchObj = () => {
        // Note: the empty string is falsy in js
        return {
            ...({ email: email }),
<<<<<<< HEAD
            ...(date && { date: date }),
            ...(initial && { initial: initial }),
=======
            ...({ firstName: firstName }),
            ...({ lastName: lastName }),
            ...({ language: language }),
            ...(date && { date: date }),
            ...(initials && { initials: initials }),
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
            ...(prescribed && { prescribed: prescribed }),
            ...(status && { status: status }),
        }
    }

    const prescriptionSearchForm = (
        <div className="flex flex-col w-5/6">
            <div className="flex items-start gap-8">
                <Input size="md" label="Date" value={date} onChange={el => setDate(el.target.value)} />
<<<<<<< HEAD
                <Input size="md" label="Patient Initials" value={initial} onChange={el => setInitials(el.target.value)} />
=======
                <Input size="md" label="Patient Initials" value={initials} onChange={el => setInitials(el.target.value)} />
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
            </div>
            <div className="mt-2 flex items-start gap-8">
                <Input size="md" label="Discovery Pass" value={prescribed} onChange={el => setPrescribed(el.target.value)} />
                <Input size="md" label="Prescription Status" value={status} onChange={el => setStatus(el.target.value)} />
            </div>
        </div>
    )

    const searchFn = async (searchPressed = true, searchPage = 1) => {
        // If search was pressed then get a new search object. Else use the last one.
        const searchObj = searchPressed ? getSearchObj() : prevSearch;

        // If search was pressed reset the state
        searchPressed && setPrevSearch(searchObj);

        const list = await getPaginatedPatientPrescriptions(searchPage, PAGE_SIZE, searchObj);

        list === null ? setPrescriptionList([]) : setPrescriptionList(list);
<<<<<<< HEAD

=======
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
        return list ? list.length : 0;
    }

    const createRow = (prescription) => {
        return (
            <tr key={prescription['providerCode'] + prescription['date']}>
                {
                    prescriptionFields.map(field => (
<<<<<<< HEAD
                        <td key={prescription['providerCode'] + prescription['date'] + '_' + field} className="p-4">
                            <div className="flex items-center">
                                { 
                                    prescription[prescriptionField2PrescriptionInfo[field]] !== null ?
                                        prescription[prescriptionField2PrescriptionInfo[field]].toString() :
                                        null
                                }
                            </div>
                        </td>
                    ))
                }
                {
                    (prescription.prescribed && (!address || !province || !city)) ? <td className="p-2">
                        <Tooltip content="Address Needed">
                            <ActionNeededDialog patient={patient} headerText={`Edit ${patient.firstName} ${patient.lastName} | ${patient.email}`}/>
                        </Tooltip>
                    </td> : <div></div>
=======
                            <td key={prescription['providerCode'] + prescription['date'] + '_' + field} className="p-4">
                                <div className="flex items-center">
                                    {
                                        prescription[prescriptionField2PrescriptionInfo[field]] !== null ?
                                            prescription[prescriptionField2PrescriptionInfo[field]].toString() :
                                            null
                                    }
                                </div>
                            </td>
                        )
                    )
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
                }
            </tr>
        )
    }

    return (
<<<<<<< HEAD
        <div className="flex flex-col h-screen">
            <div className="mt-12">
                <div className="flex justify-between">
                    {/* Column 1 */}
                    <div className="flex flex-col justify-center items-start ml-10">
                        <Typography variant="h4"> My Prescriptions </Typography>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-center items-end mr-10">
                        <PrescriptionLogForm/>
                    </div>
                </div>
            </div>
=======
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">My Prescriptions</Typography>
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
            <PaginatedTableWithSearch
                dataList={prescriptionList}
                searchFn={searchFn}
                searchForm={prescriptionSearchForm}
<<<<<<< HEAD
                cols={[...prescriptionFields, ""]}
=======
                cols={[...prescriptionFields]}
>>>>>>> 31c4c9ee3f8afe094a8aa16e0bf25898433159d7
                createRow={createRow}
                pageSize={PAGE_SIZE}
            />
        </div>
    )
}

export default PatientPrescriptions;