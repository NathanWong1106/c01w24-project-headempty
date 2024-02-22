const PORT = 4000;
const path = 'http://localhost:' + PORT; // Need to change this after we know corresponding path
const provider_code = 'BB-CC234'; // This should be change after we know unique code


function CustomizedPDF() {

  const handleDownload = async () => {
    try {
      // Create Customized PDF
      await fetch(path + "/customizedPDF/createcustomized", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rewrite: provider_code })
      });

      // Download Customized PDF
      const response = await fetch(`${path}/customizedPDF/downloadCustomized`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "PaRx-" + provider_code + '.pdf');
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);

      // Remove Customized PDF 
      await fetch(`${path}/customizedPDF/removeCustomized`, {method: "DELETE"});
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while downloading the file.');
    }
  };

  return (
    <div>
      <h1>Download PDF</h1>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

export default CustomizedPDF;
