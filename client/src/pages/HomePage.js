import { useState, useEffect } from "react";
import { Typography, List, ListItem } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../apiServices/types/userServiceTypes";
import { ASSISTANT_LINKS, COORDINATOR_LINKS, PATIENT_LINKS, PRESCRIBER_LINKS } from "../routing/RouteConstants";

const HomePage = () => {
    const navigate = useNavigate();
    const accountType = useSelector(state => state.currentUser.accountType);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Sample list of nature images
    const natureImages = [
        "https://cdn.create.vista.com/api/media/small/228793812/stock-photo-banff-canada-june-2018-landscape-view-bow-river-which-flows",
        "https://cdn.create.vista.com/api/media/small/600630180/stock-photo-horseshoe-lake-jasper-canadian-rockies-alberta-canada-colorful-autumn-trees",
        "https://cdn.create.vista.com/api/media/small/306009178/stock-photo-two-red-adirondack-chairs-view-bonne-bay-tablelands",
        "https://cdn.create.vista.com/api/media/small/454433312/stock-photo-cabbage-island-british-columbia"
    ];

    // Function to change the image index
    const changeImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % natureImages.length);
    };

    useEffect(() => {
        // Change the image every 5 seconds
        const interval = setInterval(changeImage, 5000);

        return () => clearInterval(interval);
    }, []);

    const getLinksForAccountType = () => {
        switch (accountType) {
            case ACCOUNT_TYPE.COORDINATOR:
                return COORDINATOR_LINKS;
            case ACCOUNT_TYPE.ASSISTANT:
                return ASSISTANT_LINKS;
            case ACCOUNT_TYPE.PATIENT:
                return PATIENT_LINKS;
            case ACCOUNT_TYPE.PRESCRIBER:
                return PRESCRIBER_LINKS;
            default:
                console.log("Something went wrong. Invalid account type.");
                return [];
        }
    }

    return (
        <div className="flex flex-col justify-start items-center h-screen w-full">
            <Typography variant="h3" color="blue-gray" className="mt-10 mb-6">
                Welcome
            </Typography>
            <div className="w-full max-w-3xl">
                <img
                    src={natureImages[currentImageIndex]}
                    alt="Nature"
                    className={`w-full max-h-96 rounded-lg ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <List className="divide-y divide-gray-300 w-full max-w-3xl">
                {getLinksForAccountType().map(linkObj => (
                    linkObj.name !== "Home" && (
                        <ListItem key={linkObj.name} onClick={() => navigate(linkObj.link)} className="cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition duration-300 text-lg">
                            {linkObj.name}
                        </ListItem>
                    )
                ))}
            </List>
        </div>
    );
}

export default HomePage;
