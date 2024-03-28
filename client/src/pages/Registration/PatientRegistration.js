import { useState} from "react";
import { Input, Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { registerPatient, registerPrescriber } from "../../apiServices/registrationService.js";
import { ClosableAlert } from "../../components/ClosableAlert.js";
import { ROUTES } from "../../routing/RouteConstants.js";
import { languages } from "../../constants.js"
import { validateEmail, validatePassword} from "./utils.js";

const PatientRegistration = () => {
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
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const doRegistration = async () => {
        setShowAlert(false);
        let error = '';

        // Check if any of the required fields are empty
        if (!email || !fName || !lName || !initials || !preferredLanguage || !password || !retypepassword) {
            // Construct the error message
            error = "Please fill in the following fields: ";
            if (!email) error += "Email, ";
            if (!fName) error += "First Name, ";
            if (!lName) error += "Last Name, ";
            if (!initials) error += "Initials, ";
            if (!preferredLanguage) error += "Preferred Language, ";
            if (!password) error += "Password, ";
            if (!retypepassword) error += "Re-type Password, ";
            error = error.slice(0, -2);
        }
        else if (!validateEmail(email)) {
            error = "Please enter a valid email address.";
        }
        else if (password !== retypepassword) {
            error = "Passwords do not match.";
        }
        else if (!validatePassword(password)) {
            error = "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.";
        }

        if (error) {
            setErrorMessage(error);
            setShowAlert(true);
            return;
        }

        const data = { email, password, accountType: "patient", fName, lName, initials, address, city, province, preferredLanguage }
        try {
            const result = await registerPatient(data);
            console.log(result);
            if (!result.error) {
                setErrorMessage("Account Created Successfully. Redirecting you to the login page.")
                setShowAlert(true);
                setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            } else {
                console.log(result.error.error);
                setErrorMessage("Failed to Create Account: " + result.error.error)
                setShowAlert(true);
            }
        } catch (err) {
            console.log(err);
            setErrorMessage("Failed to Create Account: " + err.error)
            setShowAlert(true);
        }
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <Card className="absolute w-1/2 justify-center items-center" color="transparent" shadow={false}>
                <Typography variant="h4">
                    Patient Registration
                </Typography>
                <form className="mt-8 mb-2 max-w-screen-lg ">
                    <div className="mb-1 flex flex-wrap gap-6 justify-center items-center">
                        <div className="flex flex-col w-full">
                            <Typography variant="h6" className="mb-1 mt-2">
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
                                    <Typography variant="h6" className="mb-1 mt-2">
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
                                    <Typography variant="h6" className="mb-1 mt-2">
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
                                    <Typography variant="h6" className="mb-1 mt-2">
                                        Preferred Language
                                    </Typography>
                                    <Select
                                        value={preferredLanguage}
                                        onChange={el => setPreferredLanguage(el)}
                                        label=""
                                    >
                                        {languages.map(lang => (
                                            <Option value={lang.code} key={lang.name}>{lang.name} ({lang.code})</Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="w-full">
                                    <Typography variant="h6" className="mb-1 mt-2">
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
                            <Typography variant="h6" className="mb-1 mt-2">
                                Address (optional)
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
                            <Typography variant="h6" className="mb-1 mt-2">
                                City (optional)
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
                            <Typography variant="h6" className="mb-1 mt-2">
                                Province (optional)
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
                                    <Typography variant="h6" className="mb-1 mt-2">
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
                                    <Typography variant="h6" className="mb-1 mt-2">
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
                    <Button className="mt-6 bg-moss-green" onClick={async () => await doRegistration()} fullWidth>
                        Register
                    </Button>
                </form>
                <Typography>
                    Already have an account?
                    <a href={ROUTES.LOGIN} className="text-blue-500 hover:text-blue-600 ml-4">Login here</a>
                </Typography>


            </Card>
            <div className="mb-16 absolute bottom-0">
                <ClosableAlert text={errorMessage} open={showAlert} onDismiss={() => setShowAlert(false)} />
            </div>
        </div>

    )
}

export default PatientRegistration;