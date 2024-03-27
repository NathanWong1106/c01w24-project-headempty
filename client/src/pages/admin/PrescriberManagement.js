import {
    Input,
    Typography,
    Tooltip,
    Button
} from "@material-tailwind/react";
import { useState } from "react";
import { getPaginatedPrescribers } from "../../apiServices/adminService";
import { prescriberField2PrescriberInfo, prescriberFields } from "../../apiServices/types/adminServiceTypes";
import { EditPrescriberDialog } from "../../components/EditPrescriberDialog";
import PaginatedTableWithSearch from "../../components/PaginatedTableWithSearch";
import { AddPrescriber } from "../../components/AddPrescriber"

const PAGE_SIZE = 20;

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
    const [openNewPrescriber, setOpenNewPrescriber] = useState(false);

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

        const list = await getPaginatedPrescribers(searchPage, PAGE_SIZE, searchObj);
        setPrescriberList(list);
        return list ? list.length : 0;
    }

    const createRow = (prescriber) => {


        const copyToClipboard = async (path) => {
            const fullUrl = `${window.location.origin}${path}`;

            try {
                await navigator.clipboard.writeText(fullUrl);
                // Show a message or tooltip indicating success
                alert("Link copied to clipboard!"); // Consider using a more elegant solution like a tooltip or snackbar
            } catch (err) {
                console.error("Failed to copy!", err);
            }
        }

        return (
            <tr key={prescriber['providerCode']}>
                {
                    prescriberFields.map(field => (
                        <td key={prescriber['providerCode'] + '_' + field} className="p-4">
                            <div className="flex items-center">
                                {field === "Registration Link" ? (
                                    <Button size="sm" color="blue" onClick={() => copyToClipboard(`/register/${prescriber.id}`)}>
                                        Copy Registration Link
                                    </Button>
                                ) : (
                                    prescriber[prescriberField2PrescriberInfo[field]] !== null ?
                                        prescriber[prescriberField2PrescriberInfo[field]].toString() :
                                        null
                                )}
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
        <div className="flex flex-col h-screen">
            <div className="mt-12">
                <div className="flex justify-between">
                    {/* Column 1 */}
                    <div className="flex flex-col justify-center items-start ml-10">
                        <Typography variant="h4"> Prescriber Management </Typography>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-center items-end mr-10">
                        <Button className="mt-6 bg-moss-green border-2 border-moss-green" onClick={() => setOpenNewPrescriber(true)}>
                            Add Prescriber
                        </Button>
                        <AddPrescriber open={openNewPrescriber} setOpenNewPrescriber={setOpenNewPrescriber} />
                    </div>
                </div>
            </div>
            <PaginatedTableWithSearch
                dataList={prescriberList}
                searchFn={searchFn}
                searchForm={adminSearchForm}
                cols={[...prescriberFields, ""]}
                createRow={createRow}
                pageSize={PAGE_SIZE}
            />
        </div>
    )

}

export default PrescriberManagement;