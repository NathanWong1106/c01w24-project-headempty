import { useState, useEffect} from "react";
import { Input, Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { callEndpoint } from "../../apiServices/utils/apiUtils.js";
import { SERVER_PATHS } from "../../apiServices/utils/constants.js";
import { registerPrescriber } from "../../apiServices/registrationService.js";
import { useParams } from "react-router-dom";
import { ClosableAlert } from "../../components/ClosableAlert.js";
import { ROUTES } from "../../routing/RouteConstants.js";
import { languages } from "../../constants.js";
import { validateEmail, validatePassword} from "./utils.js";

const PrescriberRegistration = () => {
    
    const { prescriberId } = useParams();

    const navigate = useNavigate();

    const [prescriber, setPrescriber] = useState({firstName: "", lastName: "", licenceNumber: "", error: "Loading"})
    const [canBeRegistered, setCanBeRegistered] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const fetchPrescriber = async () => {
        let res = await callEndpoint(`${SERVER_PATHS.PRESCRIBER_REGISTRATION}/${prescriberId}`, 'GET',);
        let resBody = await res.json();
        setPrescriber(resBody);
        setCanBeRegistered(res.status == 200);
    }
    
    useEffect(() => {
        fetchPrescriber();
    },[])

    const doRegistration = async () => {
        setShowAlert(false);
        let error = "";

        if (!email || !password || !retypePassword || !preferredLanguage) {
            error = "Please fill in the following fields: ";
            if (!email) error += "Email, "
            if (!password) error += "Password, ";
            if (!retypePassword) error += "Re-type Password, ";
            if (!preferredLanguage) error += "Preferred Language, ";
            error = error.slice(0, -2); // Remove the last comma and space
        }
        else if (!validateEmail(email)) {
            error = "Email must be in correct email format"
        }
        else if (!validatePassword(password)) {
            error = "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.";
        }
        else if (password !== retypePassword) {
            error = "Passwords do not match."; // Error message for mismatched passwords
        }

        if (error) {
            setErrorMessage(error);
            setShowAlert(true);
            return;
        }

        const data = { _id: prescriberId, email:email, password: password, language: preferredLanguage }
        try {
            const result = await registerPrescriber(data)
            const res = await result.json();
            if (!res.error) {
                setErrorMessage("Account Created Successfully. Redirecting you to the login page.")
                setShowAlert(true);
                setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            }
            else {
                setErrorMessage(res.error)
                setShowAlert(true);
            }
        } catch (err) {
            setErrorMessage("Failed to Register Account: " + err.error)
            setShowAlert(true);
        }
    }

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            {canBeRegistered ? (
                <Card className="absolute" color="transparent" shadow={false}>
                    <Typography variant="h4">
                        Complete Registration
                    </Typography>
                    <form className="mt-5 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <Typography variant="h6" className="-mb-4">
                                First Name
                            </Typography>
                            <Input
                                size="lg"
                                disabled={true}
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={prescriber.firstName}
                            />
                            <Typography variant="h6" className="-mb-4">
                                Last Name
                            </Typography>
                            <Input
                                size="lg"
                                disabled={true}
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={prescriber.lastName}
                            />
                            <Typography variant="h6" className="-mb-4">
                                Licence Number
                            </Typography>
                            <Input
                                size="lg"
                                disabled={true}
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={prescriber.licenceNumber}
                            />
                            <Typography variant="h6" className="-mb-4">
                                Your Email
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={email}
                                onChange={el => setEmail(el.target.value)}
                            />
                            <Typography variant="h6" className="-mb-4">
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
                            <p id="floating_helper_text" className=" -mt-4 text-xs text-gray-500 dark:text-gray-400">Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character. </p>
                            <Typography variant="h6" className="-mb-4">
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
                                value={retypePassword}
                                onChange={el => setRetypePassword(el.target.value)}
                            />
                            <Typography variant="h6" className="-mb-4 mt-2">
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
                            <Button className="mt-6 bg-moss-green" onClick={async() => doRegistration()} fullWidth>
                                Complete Registration
                            </Button>
                        </form>
                </Card>
            ) : (
                <Card className="absolute" color="transparent" shadow={false}>
                    <Typography variant="h4">
                        {prescriber.error}
                    </Typography>
                    <form className="mt-5 mb-2 justify-center flex">
                        <Button className="bg-moss-green" onClick={() => navigate(ROUTES.LOGIN)}>
                            Proceed to Login
                        </Button>
                    </form>
                </Card>
            )}
            <div className="mb-16 absolute bottom-0">
                <ClosableAlert text={errorMessage} open={showAlert} onDismiss={() => setShowAlert(false)} />
            </div>
        </div>
    )
}

export default PrescriberRegistration