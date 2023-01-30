import Books from "./Components/Homepage";
import AddNewCsv from "./Components/AddNewCsv";
import {BrowserRouter, Routes,Route} from 'react-router-dom'


function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
       <Routes>

      <Route exact path="/" element={<Books/>}></Route>

      <Route path="/addcsv" element={<AddNewCsv/>}></Route>
       
       
       </Routes>
      </BrowserRouter>
     
    </div>
  );
}

export default App;
