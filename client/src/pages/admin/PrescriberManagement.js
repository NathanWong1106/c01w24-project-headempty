import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import { getPaginatedPrescribers } from "../../apiServices/adminService";
import { prescriberField2PrescriberInfo, prescriberFields } from "../../apiServices/types/adminServiceTypes";
import { EditPrescriberDialog } from "../../components/EditPrescriberDialog";

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
    
    // State to enable pagination
    const [page, setPage] = useState(1);
    const [prevSearch, setPrevSearch] = useState({});
    const [nextEnabled, setNextEnabled] = useState(false);
    const [prevEnabled, setPrevEnabled] = useState(false);

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

    const search = async (searchPressed = true) => {
        const searchObj = searchPressed ? getSearchObj() : prevSearch;
        const searchPage = searchPressed ? 1 : page;

        // If search was pressed reset the state
        searchPressed && setPage(1);
        searchPressed && setPrevSearch(searchObj);

        const list = await getPaginatedPrescribers(searchPage, 20, searchObj);

        if (list) {
            setPrescriberList(list);
            setNextEnabled (list.length == 20);
        } else {
            setNextEnabled (false);
        }
        setPrevEnabled (false);
    }

    const nextPage = async () => {
        setPage(page + 1);
        await search(false);
        setPrevEnabled (page > 1);
    }

    const prevPage = async () => {
        setPage(page - 1);
        await search(false);
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Typography variant="h3">Prescriber Management</Typography>
            <Card className="h-5/6 w-11/12 mx-20 my-5">
                <CardHeader floated={false} shadow={false} className="m-0 px-6 pt-3 rounded-none h-1/6">
                    <div className="flex flex-row">
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
                        <div className="flex flex-grow flex-row-reverse w-1/6 items-center justify-center">
                            <Button size="md" className="w-1/2 h-1/2" onClick={search}>Search</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll h-full px-0 py-0" >
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {prescriberFields.map(head => (
                                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                                {/* Below is the extra column for the edit button */}
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {
                                prescriberList.map(prescriber => (
                                    <tr key={prescriber['providerCode']}>
                                        {
                                            prescriberFields.map(field => (
                                                <td key={prescriber['providerCode'] + '_' + field} className="p-4">
                                                    <div className="flex items-center">
                                                        {prescriber[prescriberField2PrescriberInfo[field]]}
                                                    </div>
                                                </td>
                                            ))
                                        }
                                        <td className="p-2">
                                            <Tooltip content="Edit Prescriber">
                                                <EditPrescriberDialog prescriber={prescriber}/>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </CardBody>
                <div className="flex flex-grow flex-col-reverse">
                    <CardFooter className="flex flex-row-reverse border-t gap-3 p-4">
                        <Button disabled={!nextEnabled} onClick={nextPage} size="sm" className="p-3 px-7">
                            Next
                        </Button>
                        <Button disabled={!prevEnabled} onClick={prevPage} size="sm">
                            Previous
                        </Button>
                    </CardFooter>
                </div>
            </Card>
        </div>
    )
}

export default PrescriberManagement;