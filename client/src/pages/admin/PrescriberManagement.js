import {
    Input,
    Typography,
    Tooltip
} from "@material-tailwind/react";
import { useState } from "react";
import { getPaginatedPrescribers } from "../../apiServices/adminService";
import { prescriberField2PrescriberInfo, prescriberFields } from "../../apiServices/types/adminServiceTypes";
import { EditPrescriberDialog } from "../../components/EditPrescriberDialog";
import PaginatedTableWithSearch from "../../components/PaginatedTableWithSearch";

const PrescriberManagement = () => {
    // List of all prescribers on the current page
    const [prescriberList, setPrescriberList] = useState([]);

    // Search fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [providerCode, setProviderCode] = useState("");
    const [licensingCollege, setlicensingCollege] = useState("");
    const [licenceNumber, setLicenceNumber] = useState("");

    // Search obj
    const [prevSearch, setPrevSearch] = useState({});

    const getSearchObj = () => {
        // Note: the empty string is falsy in js
        return {
            ...(firstName && { firstName: firstName }),
            ...(lastName && { lastName: lastName }),
            ...(email && { email: email }),
            ...(providerCode && { providerCode: providerCode }),
            ...(licensingCollege && { licensingCollege: licensingCollege }),
            ...(licenceNumber && { licenceNumber: licenceNumber })
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
                <Input size="md" label="Provider Code" value={providerCode} onChange={el => setProviderCode(el.target.value)} />
                <Input size="md" label="Licensing College" value={licensingCollege} onChange={el => setlicensingCollege(el.target.value)} />
                <Input size="md" label="Licence Number" value={licenceNumber} onChange={el => setLicenceNumber(el.target.value)} />
            </div>
        </div>
    )

    const searchFn = async (searchPressed = true, searchPage = 1) => {
        // If search was pressed then get a new search object. Else use the last one.
        const searchObj = searchPressed ? getSearchObj() : prevSearch;

        // If search was pressed reset the state
        searchPressed && setPrevSearch(searchObj);

        const list = await getPaginatedPrescribers(searchPage, 20, searchObj);
        setPrescriberList(list);
        return list ? list.length : 0;
    }

    const createRow = (prescriber) => {
        return (
            <tr key={prescriber['providerCode']}>
                {
                    prescriberFields.map(field => (
                        <td key={prescriber['providerCode'] + '_' + field} className="p-4">
                            <div className="flex items-center">
                                {
                                    prescriber[prescriberField2PrescriberInfo[field]] ?
                                        prescriber[prescriberField2PrescriberInfo[field]].toString() :
                                        prescriber[prescriberField2PrescriberInfo[field]]
                                }
                            </div>
                        </td>
                    ))
                }
                <td className="p-2">
                    <Tooltip content="Edit Prescriber">
                        <EditPrescriberDialog prescriber={prescriber} />
                    </Tooltip>
                </td>
            </tr>
        )
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">Prescriber Management</Typography>
            <PaginatedTableWithSearch
                dataList={prescriberList}
                searchFn={searchFn}
                searchForm={adminSearchForm}
                cols={[...prescriberFields, ""]}
                createRow={createRow}
                pageSize={20}
            />
        </div>
    )

}

export default PrescriberManagement;