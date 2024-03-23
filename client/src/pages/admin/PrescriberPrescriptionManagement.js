import {
    Input,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { prescriptionField2PrescriptionInfo, prescriptionFields } from "../../apiServices/types/prescriptionTypes";
import PaginatedTableWithSearch from "../../components/PaginatedTableWithSearch";

import { getAdminPaginatedPrescriberPrescriptions } from "../../apiServices/adminService";
import { EditPrescriptionDialog } from "../../components/EditPrescriptionDialog";

const PAGE_SIZE = 20;

const AdminPrescriberPrescriptions = () => {
    // List of all prescriptions on the current page
    const [prescriptionList, setPrescriptionList] = useState([]);
    // Search fields
    const [providerCode, setProviderCode] = useState("");
    const [date, setDate] = useState("");
    const [initials, setInitials] = useState("");
    const [prescribed, setPrescribed] = useState("");
    const [status, setStatus] = useState("");
    // Search obj
    const [prevSearch, setPrevSearch] = useState({});

    const getSearchObj = () => {
        // Note: the empty string is falsy in js
        return {
            ...(providerCode && { providerCode: providerCode }),
            ...(date && { date: date }),
            ...(initials && { initials: initials }),
            ...(prescribed && { prescribed: prescribed }),
            ...(status && { status: status }),
        }
    }

    const prescriptionSearchForm = (
        <div className="flex flex-col w-5/6">
            <div className="flex items-start gap-8">
                <Input size="md" label="Provider Code" value={providerCode} onChange={el => setProviderCode(el.target.value)} />
                <Input size="md" label="Date" value={date} onChange={el => setDate(el.target.value)} />
                <Input size="md" label="Patient Initials" value={initials} onChange={el => setInitials(el.target.value)} />
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

        const list = await getAdminPaginatedPrescriberPrescriptions(searchPage, PAGE_SIZE, searchObj);

        list === null ? setPrescriptionList([]) : setPrescriptionList(list);
        return list ? list.length : 0;
    }

    const createRow = (prescription) => {
        return (
            <tr key={prescription['providerCode'] + prescription['date']}>
                {
                    prescriptionFields.map(field => (
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
                }
                <td className="p-2">
                    <Tooltip content="Edit Prescription">
                        <EditPrescriptionDialog prescription={prescription} />
                    </Tooltip>
                </td>
            </tr>
        )
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">Prescriptions</Typography>
            <PaginatedTableWithSearch
                dataList={prescriptionList}
                searchFn={searchFn}
                searchForm={prescriptionSearchForm}
                cols={[...prescriptionFields]}
                createRow={createRow}
                pageSize={PAGE_SIZE}
            />
        </div>
    )
}

export default AdminPrescriberPrescriptions;