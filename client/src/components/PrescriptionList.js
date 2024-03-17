import {
    List,
    ListItem,
    ListItemSuffix,
    Chip,
    Card,
  } from "@material-tailwind/react";

import { useState } from "react";
import { PrescriberInfo, prescriberField2PrescriberInfo, prescriberPatchFields } from "../apiServices/types/adminServiceTypes";
import { visiblePrescFields, prescriptionFields, prescriptionField2PrescriptionInfo } from "../apiServices/types/prescriberServiceTypes";
import { postPrescription } from "../apiServices/prescriberService";
import { ClosableAlert } from "./ClosableAlert";
   
  export const PrescriptionList = ({ prescriber }) => {
    return (
      <Card className="w-full">
        <List>
          <ListItem>
            Prescription 1
            <ListItemSuffix>
              <Chip
                value="PA Logged"
                variant="ghost"
                size="sm"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem>
          <ListItem>
            Prescription 2 
            <ListItemSuffix>
              <Chip
                value="Complete"
                variant="ghost"
                size="sm"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem>
          <ListItem>
            Prescription 3
            <ListItemSuffix>
              <Chip
                value="pa not logged"
                variant="ghost"
                size="sm"
                className="rounded-full"
              />
            </ListItemSuffix>
          </ListItem>
        </List>
      </Card>
    );
  }
  