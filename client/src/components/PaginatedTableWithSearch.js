import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
} from "@material-tailwind/react";
import { useState } from "react";

const PaginatedTableWithSearch = ({ dataList, searchFn, searchForm, cols, createRow, pageSize }) => {

    // State to enable pagination
    const [page, setPage] = useState(1);
    const [nextEnabled, setNextEnabled] = useState(false);
    const [prevEnabled, setPrevEnabled] = useState(false);

    const afterSearch = (resultLen) => {
        setNextEnabled(resultLen === pageSize)
        setPrevEnabled(page > 1);
    }

    const nextPage = async () => {
        const nPage = page + 1;

        setPage(nPage);
        const resultLen = await searchFn(false, nPage);

        setNextEnabled(resultLen === pageSize)
        setPrevEnabled(nPage > 1);
    }

    const prevPage = async () => {
        const pPage = page - 1;

        setPage(pPage);
        const resultLen = await searchFn(false, pPage);

        setNextEnabled(resultLen === pageSize)
        setPrevEnabled(pPage > 1);
    }

    return (
        <Card className="h-5/6 w-11/12 mx-20 my-5">
            <CardHeader floated={false} shadow={false} className="m-0 px-6 pt-3 rounded-none h-1/6">
                <div className="flex flex-row">
                    {searchForm}
                    <div className="flex flex-grow flex-row-reverse w-1/6 items-center justify-center">
                        <Button size="md" className="w-1/2 h-1/2" onClick={async () => afterSearch(await searchFn())}>Search</Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll h-full px-0 py-0" >
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {cols.map(colName => (
                                <th key={colName} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {colName}
                                    </Typography>
                                </th>
                            ))}
                            {/* Below is the extra column for the edit button */}
                            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4" />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataList.map(data => createRow(data))
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
    )
}

export default PaginatedTableWithSearch;