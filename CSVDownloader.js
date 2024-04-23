const CSVDownloader = (function() {

    function downloadCSV(csvString, filename = 'data.csv') {
        // Create a Blob object from the CSV string
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        // Create a link element
        const link = document.createElement('a');

        // Set the link's attributes
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', filename);

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the DOM
        document.body.removeChild(link);
    }

    // Expose the downloadCSV function publicly
    return {
        downloadCSV: downloadCSV
    };

})();

// Example usage:
// const csvData = "Name,Age,City\nJohn Doe,30,New York\nJane Smith,25,Los Angeles";
// CSVDownloader.downloadCSV(csvData, 'example.csv');
