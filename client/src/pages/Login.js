import { useState } from "react";
import { Input, Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../apiServices/authService.js";
import { ACCOUNT_TYPE } from "../apiServices/types/userServiceTypes.js";
import { ClosableAlert } from "../components/ClosableAlert.js";
import { REGISTRATION_ROUTES, ROUTES } from "../routing/RouteConstants.js";

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("Patient");
    const [showAlert, setShowAlert] = useState(false);

    // Mapping of client string to api type
    const accountTypes = {
        "Prescriber": ACCOUNT_TYPE.PRESCRIBER,
        "Patient": ACCOUNT_TYPE.PATIENT,
        "Administrator": ACCOUNT_TYPE.ADMIN
    }
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
            <Card className="absolute justify-center items-center" color="transparent" shadow={false}>
                <Typography variant="h4">
                    Login
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Select value={accountType} onChange={el => { setAccountType(el) }} label="I am a(n)">
                            {Object.keys(accountTypes).map(str => <Option value={str} key={str}>{str}</Option>)}
                        </Select>
                        <Typography variant="h6" className="-mb-3">
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
                        <Typography variant="h6" className="-mb-3">
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
                    <Button className="mt-6 bg-moss-green" onClick={() => doLogin(email, password)} fullWidth>
                        Login
                    </Button>
                </form>
                {accountType === "Patient" && (
                    <Typography>
                        Are You a New Patient?
                        <a href={REGISTRATION_ROUTES.PATIENT_REGISTRATION} className="text-blue-500 hover:text-blue-600 ml-4">Make an Account Here</a>
                    </Typography>
                )}
            </Card>
            <div className="mb-16 absolute bottom-0">
                <ClosableAlert text="Couldn't login. Check that all fields are correct, then try again." open={showAlert} onDismiss={() => setShowAlert(false)} />
            </div>
        </div>
    )
}

export default LoginPage;