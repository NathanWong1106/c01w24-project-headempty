import { useState } from "react";
import { Input, Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../apiServices/authService.js";
import { ACCOUNT_TYPE } from "../apiServices/types/userServiceTypes.js";
import { ClosableAlert } from "../components/ClosableAlert.js";
import { ROUTES } from "../routing/RouteConstants.js";

const RegistrationPage = () => {
    const [email, setEmail] = useState("")
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [initials, setInitials] = useState("")
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [password, setPassword] = useState("");
    const [retypepassword, setRetypePassword] = useState("");
    const [accountType, setAccountType] = useState("Patient");
    const [showAlert, setShowAlert] = useState(false);

    // Mapping of client string to api type
    const accountTypes = {
        "Prescriber": ACCOUNT_TYPE.PRESCRIBER,
        "Patient": ACCOUNT_TYPE.PATIENT,
        "Administrator": ACCOUNT_TYPE.ADMIN
    }

    const languages = ["English", "Spanish", "French", "German"]; // Sample list of languages

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const doLogin = async (email, password) => {
        const data = { email, password, accountType: accountTypes[accountType] }
        try {
            await dispatch(loginUser(data)).unwrap();
            navigate(ROUTES.HOME);
        } catch (err) {
            setShowAlert(true);
        }
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Card className="absolute w-1/2" color="transparent" shadow={false}>
                <Typography variant="h4">
                    Register
                </Typography>
                <form className="mt-8 mb-2 max-w-screen-lg ">
                    <div className="mb-1 flex flex-wrap gap-6 justify-center items-center">
                        <div className="flex flex-col w-full">
                            <Select value={accountType} onChange={el => { setAccountType(el) }} label="I am a(n)">
                                {<Option value={accountTypes.Patient} key={accountTypes.Patient}>{accountTypes.Patient}</Option>}
                            </Select>

                            <Typography variant="h6" className="-mb-1 mt-2">
                                Email
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className="!border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={email}
                                onChange={el => setEmail(el.target.value)}
                            />

                            <div className="flex gap-6 mb-1">
                                <div className="w-full">
                                    <Typography variant="h6" className="-mb-1 mt-2">
                                        First Name
                                    </Typography>
                                    <Input
                                        size="lg"
                                        placeholder="first name"
                                        className=" !border-rich-black focus:!border-t-dark-moss-green"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        value={fName}
                                        onChange={el => setFName(el.target.value)}
                                    />
                                </div>

                                <div className="w-full">
                                    <Typography variant="h6" className="-mb-1 mt-2">
                                        Last Name
                                    </Typography>
                                    <Input
                                        size="lg"
                                        placeholder="last name"
                                        className=" !border-rich-black focus:!border-t-dark-moss-green"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        value={lName}
                                        onChange={el => setLName(el.target.value)}
                                    />
                                </div>

                            </div>
                            <div className="flex gap-6 mb-1">
                                <div className="w-full">
                                    <Typography variant="h6" className="-mb-1 mt-2">
                                        Preferred Language
                                    </Typography>
                                    <Select
                                        value={preferredLanguage}
                                        onChange={el => setPreferredLanguage(el)}
                                        label=""
                                    >
                                        {languages.map(lang => (
                                            <Option value={lang} key={lang}>{lang}</Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="w-full">
                                    <Typography variant="h6" className="-mb-1 mt-2">
                                        Initials
                                    </Typography>
                                    <Input
                                        size="lg"
                                        placeholder="initials"
                                        className=" !border-rich-black focus:!border-t-dark-moss-green"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        value={initials}
                                        onChange={el => setInitials(el.target.value)}
                                    />
                                </div>

                            </div>
                            {/* Add more pairs of input fields and labels here */}
                            <Typography variant="h6" className="-mb-1 mt-2">
                                Address
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="address"
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={address}
                                onChange={el => setAddress(el.target.value)}
                            />
                            <Typography variant="h6" className="-mb-1 mt-2">
                                City
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="city"
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={city}
                                onChange={el => setCity(el.target.value)}
                            />
                            <Typography variant="h6" className="-mb-1 mt-2">
                                Province
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="province"
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={province}
                                onChange={el => setProvince(el.target.value)}
                            />

                            <div className="flex gap-6 mb-1">
                                <div className="w-full">
                                    <Typography variant="h6" className="-mb-1 mt-2">
                                        Password
                                    </Typography>
                                    <Input
                                        type="password"
                                        size="lg"
                                        placeholder="********"
                                        className=" !border-rich-black focus:!border-t-dark-moss-green"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        value={password}
                                        onChange={el => setPassword(el.target.value)}
                                    />
                                </div>

                                <div className="w-full">
                                    <Typography variant="h6" className="-mb-1 mt-2">
                                        Re-type Password
                                    </Typography>
                                    <Input
                                        type="password"
                                        size="lg"
                                        placeholder="********"
                                        className=" !border-rich-black focus:!border-t-dark-moss-green"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        value={retypepassword}
                                        onChange={el => setRetypePassword(el.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="mt-6 bg-moss-green" onClick={() => doLogin(email, password)} fullWidth>
                        Register
                    </Button>
                </form>
            </Card>
            <div className="mb-16 absolute bottom-0">
                <ClosableAlert text="Couldn't login. Check that all fields are correct, then try again." open={showAlert} onDismiss={() => setShowAlert(false)} />
            </div>
        </div>

    )
}

export default RegistrationPage;