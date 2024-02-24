import jsPDF from 'jspdf';

const prescriber_code = "CC-DD234"; // This should be change after we know unique code

function CustomizedPDF() {

  const handleDownload = async () => {
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
    doc.text("Prescription #:  " + prescriber_code + "  –  _________________  –  _________________", margin, 270);

    doc.setFontSize(10);
    doc.text("(YYMMDD)", margin+80, 275);
    doc.text("(Patient’s Initials)", margin+130, 275);
    doc.save("PaRx-" + prescriber_code + ".pdf");
  };

  return (
    <div>
      <h1>Download PDF</h1>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default CustomizedPDF;
