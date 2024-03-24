import {
    Input,
    Typography,
    Tooltip
} from "@material-tailwind/react";
import { useState } from "react";
import { patientField2PatientInfo, patientFields } from "../../apiServices/types/adminServiceTypes";
import { EditPrescriberDialog } from "../../components/EditPrescriberDialog";
import PaginatedTableWithSearch from "../../components/PaginatedTableWithSearch";
import { getPaginatedPatients } from "../../apiServices/coordinatorService";
import { EditPatientDialog } from "../../components/EditPatientDialog";

const PAGE_SIZE = 20;

const PatientManagement = () => {
    // List of all prescribers on the current page
    const [patientList, setPatientList] = useState([]);

    // Search fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    // Search obj
    const [prevSearch, setPrevSearch] = useState({});

    const getSearchObj = () => {
        // Note: the empty string is falsy in js
        return {
            ...(firstName && { firstName: firstName }),
            ...(lastName && { lastName: lastName }),
            ...(email && { email: email }),
            ...(province && { province: province }),
            ...(city && { city: city }),
            ...(address && { address: address }),
        }
    }

    const adminSearchForm = (
        <div className="flex flex-col w-5/6">
            <div className="flex items-start gap-8">
                <Input size="md" label="First Name" value={firstName} onChange={el => setFirstName(el.target.value)} />
                <Input size="md" label="Last Name" value={lastName} onChange={el => setLastName(el.target.value)} />
                <Input size="md" label="Email" value={email} onChange={el => setEmail(el.target.value)} />
            </div>
            <div className="mt-2 flex items-start gap-8">
                <Input size="md" label="Province" value={province} onChange={el => setProvince(el.target.value)} />
                <Input size="md" label="City" value={city} onChange={el => setCity(el.target.value)} />
                <Input size="md" label="Address" value={address} onChange={el => setAddress(el.target.value)} />
            </div>
        </div>
    )

    const searchFn = async (searchPressed = true, searchPage = 1) => {
        // If search was pressed then get a new search object. Else use the last one.
        const searchObj = searchPressed ? getSearchObj() : prevSearch;

        // If search was pressed reset the state
        searchPressed && setPrevSearch(searchObj);

        const list = await getPaginatedPatients(searchPage, PAGE_SIZE, searchObj);
        setPatientList(list);
        return list ? list.length : 0;
    }

    const createRow = (patient) => {
        return (
            <tr key={patient['email']}>
                {
                    patientFields.map(field => (
                        <td key={patient['email'] + '_' + field} className="p-4">
                            <div className="flex items-center">
                                {
                                    patient[patientField2PatientInfo[field]] !== null ?
                                        patient[patientField2PatientInfo[field]].toString() :
                                        null
                                }
                            </div>
                        </td>
                    ))
                }
                <td className="p-2">
                    <Tooltip content="Edit Patient">
                        <EditPatientDialog patient={patient} />
                    </Tooltip>
                </td>
            </tr>
        )
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">Patient Management</Typography>
            <PaginatedTableWithSearch
                dataList={patientList}
                searchFn={searchFn}
                searchForm={adminSearchForm}
                cols={[...patientFields, ""]}
                createRow={createRow}
                pageSize={PAGE_SIZE}
            />
        </div>
    )

}

export default PatientManagement;