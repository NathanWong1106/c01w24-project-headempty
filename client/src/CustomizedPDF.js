const PORT = 4000;
const path = 'http://localhost:' + PORT;
const provider_code = 'AA-BB123'; // This should be change after we know unique code


function CustomizedPDF() {

  const handleDownload = async () => {
    try {
      // Create Customized PDF
      await fetch(path + "/createcustomized", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rewrite: provider_code })
      });

      // Download Customized PDF, then remove
      const response = await fetch(`${path}/downloadCustomized`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', provider_code + '.pdf');
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);

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
