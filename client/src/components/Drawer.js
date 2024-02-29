import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { logoutUser } from "../store/slices/currentUserSlice";
import { useNavigate } from "react-router-dom";

export function DrawerWithNavigation() {
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Fragment>
      <button className="rounded-none bg-transparent absolute" onClick={openDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg"
          className="p-2 h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="black"
          strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      <Drawer className="flex flex-col" open={open} onClose={closeDrawer}>
        <div className="mb-2 flex items-center justify-between p-4">
          <Typography variant="h5" color="blue-gray">
            PaRx Portal
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div className="flex flex-col flex-grow overflow-auto justify-between">
          <List>
            <ListItem>
              <ListItemPrefix>
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                  strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </ListItemPrefix>
              Some Link
            </ListItem>
          </List>
          <div className="flex flex-grow flex-col-reverse">
            <Button className="mb-4 mx-5 py-3 bg-rich-black" size="sm" onClick={() => {
              dispatch(logoutUser());
              navigate("/login");
              closeDrawer();
            }}>
              Log Out
            </Button>
          </div>
        </div>
      </Drawer>
    </Fragment >
  );
}