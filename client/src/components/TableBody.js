import {
    Typography,
    CardBody,
} from "@material-tailwind/react";

const TableBody = ({cols, dataList, createRow}) => {
    return (
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
                    </tr>
                </thead>
                <tbody>
                    {
                        dataList.map(data => createRow(data))
                    }
                </tbody>
            </table>
        </CardBody>
    )
}

export default TableBody;