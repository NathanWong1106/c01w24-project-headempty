import { useState } from "react";
import { Input, Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import { loginAndSetStore } from "../api_services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/currentUserSlice";

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const doLogin = async (email, password) => {
        const token = await loginAndSetStore();
        if (!token) {
            alert("Couldn't log in");
        } else {
            dispatch(login());
            navigate("/home");
        }
    }

    return (
        <div className="flex flex-row min-h-screen justify-center items-center">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4">
                    Login
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Select label="I am a(n)">
                            <Option>Prescriber</Option>
                            <Option>Patient</Option>
                            <Option>Administrator</Option>
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
            </Card>
        </div>
    )
}

export default LoginPage;