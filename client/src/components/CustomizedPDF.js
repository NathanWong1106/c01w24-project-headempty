import jsPDF from 'jspdf';

/*
  On page, include this component as:
  <CustomizedPDF auxInfo={useSelector(state => state.currentUser.auxInfo)} ></CustomizedPDF>
*/

function CustomizedPDF( auxInfo ) {

  const handleDownload = async () => {
    const { accountType, providerCode } = auxInfo.auxInfo;

    /* May require backend verification for type. */
    if (accountType === "patient"){
        alert("Patient cannot download customized PDF.");
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
    <div>
      <button onClick={handleDownload}>Download Customized PDF</button>
    </div>
  );
}

export default CustomizedPDF;
