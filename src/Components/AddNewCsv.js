import React, { useState } from "react"
import axios from "axios";
import './AddNewCsv.css';


const API_URL = process.env.REACT_APP_API_URL;

const CreateCSV = () => {
  const [data, setData] = useState([{}]);
  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState([{ id: "", title: "" },{ id: "", title: "" },{ id: "", title: "" }]);
  
 
  
  
  //adding new row
  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.id] = "";
    });
    setData([...data, newRow]);
  };
  
  //removing one from existing row
  const handleRemoveRow = index => {
    setData(data.filter((row, i) => i !== index));
  };

  //storing data entered in individual input bars in value section
  const handleChange = (e, rowIndex, colName) => {
    const newData = [...data];
    newData[rowIndex][colName] = e.target.value;
    setData(newData);
  };
 
  //adding new columns
  const handleAddColumn = () => {
    setColumns([...columns, { id: "", title: "" }]);
  };

  //removing a column from the existing columns
  const handleRemoveColumn = colIndex => {
    setColumns(columns.filter((col, i) => i !== colIndex));
    setData(data.map(row => {
      const newRow = { ...row };
      delete newRow[columns[colIndex].id];
      return newRow;
    }));
  };
   
  //storing data entered in the header input bars according to type, ie , id & title
  const handleColumnChange = (e, colIndex, type) => {
    const newColumns = [...columns];
    newColumns[colIndex][type] = e.target.value;
    setColumns(newColumns);
  };
  
  //sending data to backend and getting back file as response for download
  const handleDownload = async(e) => {
     e.preventDefault()
    const csvData = {
        fileName : fileName,
        headers : columns,
         data   : data
    }

      try {

    //sending data to backend
    const response = await axios.post(`${API_URL}/api/createCsv`,
    csvData,{ responseType: 'blob', 
    headers : {"Content-Type" : 'application/json'}
    })
    //creating a url with response file
    const url = window.URL.createObjectURL(new Blob([response.data]));

    //creating an anchor element 
    const link = document.createElement('a');

    //assigning url to anchor element 
    link.href = url;

    // setting the download attribut of the link
    link.setAttribute('download','data.csv');

    //appending link to the body
    document.body.appendChild(link);
    
    //simulating a click event
    link.click();
  
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = "";
    });
     setData([{}]);
     setFileName("");
     setColumns([{ id: "", title: "" },{ id: "", title: "" },{ id: "", title: "" }]);
    
} catch (error) {
     console.log(error)
    }
};

  return (
    <form onSubmit={handleDownload}>
    <div className="csvCreate">
        
        <h1>Create CSV</h1>
           
        <header>
        <label>File Name:</label>
        <input
          type="text"
          required
          value={fileName}
          onChange={e => setFileName(e.target.value)}
        />
      </header>

     <section>
        
      <table>
        <thead>
          <tr>

            {columns.map((col, colIndex) => (
              <th key={colIndex}>
                
                <div>
                  <input
                    type="text"
                    placeholder="ID"
                    value={col.id}
                    required
                    onChange={e => handleColumnChange(e, colIndex, "id")}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    required
                    value={col.title}
                    onChange={e => handleColumnChange(e, colIndex, "title")}
                  />
                </div>

                <button onClick={() => handleRemoveColumn(colIndex)}>Remove Column</button>
      </th> ))}
  
      <th>
      <button onClick={handleAddColumn}>Add Column</button>
       </th>
     </tr>
     </thead>

       <tbody> 
        {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
        {columns.map((col, colIndex) => (
        <td key={colIndex}>
        <input type="text" placeholder="value" required value={row[col.id]} 
        onChange={e => handleChange(e, rowIndex, col.id)}/> </td>))
        }
    
     <td>
       <button onClick={() => handleRemoveRow(rowIndex)}>Remove Row</button>
     </td>
      </tr>))}
     </tbody>
      </table>

        <div className="addrowdiv">
             <button onClick={handleAddRow}>Add Row</button> </div>

          <div> <button type="submit"  className="createButton">
            Download CSV</button></div>
            
       
        </section>
        
      </div>
      </form>);
};

export default CreateCSV;
