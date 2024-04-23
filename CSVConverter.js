// Define a JavaScript module
const CSVConverter = (function() {

    // Function to convert array of objects to CSV string
    function arrayToCSV(data) {
        // Extract headers from the first object in the array
        const headers = Object.keys(data[0]);

        // Convert each object into a CSV row
        const rows = data.map(obj =>
            headers.map(header =>
                // Escape double quotes and add double quotes if the value contains a comma
                `"${String(obj[header]).replace(/"/g, '""')}"`)
            .join(',')
        );

        // Join the headers and rows, and return the CSV string
        return [headers.join(','), ...rows].join('\n');
    }

    // Expose the arrayToCSV function publicly
    return {
        arrayToCSV: arrayToCSV
    };

})();

// Example usage:
// const data = [
//     { name: "John Doe", age: 30, city: "New York" },
//     { name: "Jane Smith", age: 25, city: "Los Angeles" },
//     { name: "Bob Johnson", age: 40, city: "Chicago" }
// ];

// const csvString = CSVConverter.arrayToCSV(data);
// console.log(csvString);
