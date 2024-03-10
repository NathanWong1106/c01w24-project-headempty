import { useState, useEffect, useRef } from "react";
import { Input, Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { callEndpoint } from "../apiServices/utils/apiUtils";
import { SERVER_PATHS } from "../apiServices/utils/constants";
import { registerPrescriber } from "../apiServices/prescriberRegistrationService";
import { useParams } from "react-router-dom";
import { ClosableAlert } from "../components/ClosableAlert";
import { ROUTES } from "../routing/RouteConstants";

const PrescriberRegistrationPage = () => {
    
    const { prescriberId } = useParams();

    const languages = ["English", "Spanish", "French", "German"]; // Sample list of languages

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [prescriber, setPrescriber] = useState({email: "", firstName: "", lastName: "", licenceNumber: "", error: "Loading"})
    const [canBeRegistered, setCanBeRegistered] = useState(false);
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const fetchPrescriber = async () => {
        let res = await callEndpoint(SERVER_PATHS.PRESCRIBER_REGISTRATION + "/" + prescriberId, 'GET',);
        let resBody = await res.json();
        setPrescriber(resBody);
        console.log(SERVER_PATHS.PRESCRIBER_REGISTRATION + "/" + prescriberId)
        console.log(resBody);
        setCanBeRegistered(res.status == 200);
    }
    
    useEffect(() => {
        fetchPrescriber();
    },[])

    const validatePassword = (password) => {
        // Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/;

        return passwordRegex.test(password);
    }

    const doRegistration = async () => {
        setShowAlert(false);
        let error = "";

        if (!password || !retypePassword || !preferredLanguage) {
            error = "Please fill in the following fields: ";
            if (!password) error += "Password, ";
            if (!retypePassword) error += "Re-type Password, ";
            if (!preferredLanguage) error += "Preferred Language, ";
            error = error.slice(0, -2); // Remove the last comma and space
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
            console.log("Error:", error);
            return;
        }

        const data = { _id: prescriberId, password: password, language: preferredLanguage }
        try {
            const result = await dispatch(registerPrescriber(data)).unwrap();
            console.log(result);

            setErrorMessage("Account Created Successfully. Redirecting you to the login page.")
            setShowAlert(true);
            setTimeout(() => navigate(ROUTES.LOGIN), 3000);
        } catch (err) {
            console.log(err);
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
                                Your Email
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
                                disabled={true}
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={prescriber.email}
                            />
                            <Typography variant="h6" className="-mb-4">
                                First Name
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="name@mail.com"
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
                                placeholder="name@mail.com"
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
                                placeholder="name@mail.com"
                                disabled={true}
                                className=" !border-rich-black focus:!border-t-dark-moss-green"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={prescriber.licenceNumber}
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
                                    <Option value={lang} key={lang}>{lang}</Option>
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

export default PrescriberRegistrationPage