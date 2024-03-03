import jsPDF from 'jspdf';
import { useState } from "react";
import { ACCOUNT_TYPE } from "../apiServices/types/userServiceTypes.js";
import { ClosableAlert } from "./ClosableAlert.js";

/*
  Requirement on page: 
  import {useSelector} from "react-redux";
  import CustomizedPDF from "../components/CustomizedPDF.js";  
  
  On page, include this component as:
  <CustomizedPDF auxInfo={useSelector(state => state.currentUser.auxInfo)} ></CustomizedPDF>
*/

function CustomizedPDF( auxInfo ) {

  const [showAlert, setShowAlert] = useState(false);
  const [errMessage, seterrMessage] = useState('default');

  const messages = {
    default: "System error",
    permission: "Sorry, you do not have permission to generate a customized PDF.",
    error: "System error"
  };

  const getMessage = (type) => {
    return messages[type] || messages.default;
  }

  const handleDownload = async () => {
    if (auxInfo === null){
        seterrMessage('error');
        setShowAlert(true);
        return;
    }

    const { accountType, providerCode } = auxInfo.auxInfo;

    // Verify user type
    if (accountType === ACCOUNT_TYPE.PATIENT){
        seterrMessage('permission');
        setShowAlert(true);
        return;
    }

    // Create Customized PDF
    const doc = new jsPDF();
    const margin = 10;
    doc.setFontSize(14);
    doc.text("Name _______________________________________", margin, 40);

    doc.text("Date ________________________________________", margin, 60);

    doc.text("My Outdoor Activity Plan:", margin, 80);
    
    doc.text("________________________________________", margin, 250);

    doc.setFontSize(10);
    doc.text("Health Professional’s Signature", margin, 255);

    doc.setFontSize(14);
    doc.text("Prescription #:  " + providerCode + "  –  _________________  –  _________________", margin, 270);

    doc.setFontSize(10);
    doc.text("(YYMMDD)", margin+80, 275);
    doc.text("(Patient’s Initials)", margin+130, 275);
    doc.save("PaRx-" + providerCode + ".pdf");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button  
        className='mt-6 bg-moss-green text-white px-4 py-2 rounded'
        onClick={handleDownload}>
        <u>Download Customized PDF</u></button>
      <div className="mb-16 absolute bottom-0">
                <ClosableAlert text={getMessage(errMessage)} open={showAlert} onDismiss={() => setShowAlert(false)} />
      </div>
    </div>
  );
}

export default CustomizedPDF;
