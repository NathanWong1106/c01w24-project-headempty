import React from "react";
import { Alert } from "@material-tailwind/react";

export const ClosableAlert = ({ open, text, onDismiss, color="" }) => {
    return (
        <Alert
            variant="gradient"
            color={color}
            open={open}
            className="max-w-screen-md"
            onClose={onDismiss}
            animate={{
                mount: { y: 0 },
                unmount: { y: 20 },
            }}
        >
            {text}
        </Alert>
    );
}