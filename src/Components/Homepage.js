import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Homepage.css'

const API_URL = process.env.REACT_APP_API_URL;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [magazines,setMagazines] = useState([]);
  const [authors,setAuthors] = useState([]);
  const [search, setSearch] = useState('');
  const [bookSearchResults, setBookSearchResults] = useState([]);
  const [magSearchResults, setMagSearchResults] = useState([]);
  const [allPublications,setAllPublications] = useState([]);
  const [allSearchResults,setAllSearchResults] = useState([]);
  const [sort, setSort] = useState('');
  const Navigate = useNavigate();

  useEffect(() => {
    // sending books request
     const getBooks = async ()=>{
       await axios.get(`${API_URL}/api/books`)
        .then(res => setBooks(res.data))
        .catch(err => console.log(err));
      }
      //sending magazines request
      const getMagazines = async()=> {
        await axios.get(`${API_URL}/api/magazines`)
        .then(res => setMagazines(res.data))
        .catch(err => console.log(err));
    }

    //sending authors list request
       const getAuthors = async()=>{
        await axios.get(`${API_URL}/api/authors`)
        .then(res=> setAuthors(res.data))
        .catch(err=>console.log(err))
       }
    getBooks()
    getMagazines() 
    getAuthors()
},[]);

    useEffect(()=>{
      //creating AllPublications by merging books and magazines
        setAllPublications([...books,...magazines])
       },[books,magazines])

 //Search fucntionalities      
const handleSearch = (e) => {

    //setting 'search term' in to the setSearch
    setSearch(e.target.value);
     
    //filtering books based on the 'search term'
    setBookSearchResults(
      books.filter(book => book.isbn.includes(e.target.value) ||
      book.authors.includes(e.target.value) || book.title.includes(e.target.value)));
      
      //filtering magazines based on the 'search term'
      setMagSearchResults(
        magazines.filter(mag => mag.isbn.includes(e.target.value) ||
         mag.authors.includes(e.target.value) || mag.title.includes(e.target.value)));
         
         //filtering allPublications based on the 'search term'
         setAllSearchResults(
            allPublications.filter(aps => aps.isbn.includes(e.target.value) ||
             aps.authors.includes(e.target.value) || aps.title.includes(e.target.value)));
         }

  const handleSort = (e) => {
      
    //setting the sort term
    setSort(e.target.value);
    
    // sorting seprerately based on 'search' is on or not for books, magazines & allPublications

    search ? setBookSearchResults(
        bookSearchResults.sort((a, b) => (a[e.target.value] > b[e.target.value]) ? 1 : -1),
     ) : setBooks(
      books.sort((a, b) => (a[e.target.value] > b[e.target.value]) ? 1 : -1),
      );

     search ? setMagSearchResults(
        magSearchResults.sort((a, b) => (a[e.target.value] > b[e.target.value]) ? 1 : -1)
     ) : setMagazines(
       magazines.sort((a, b) => (a[e.target.value] > b[e.target.value]) ? 1 : -1)
      );

      search ? setAllSearchResults(
        allSearchResults.sort((a, b) => (a[e.target.value] > b[e.target.value]) ? 1 : -1)
     ) : setAllPublications(
       allPublications.sort((a, b) => (a[e.target.value] > b[e.target.value]) ? 1 : -1)
      );
  }

  return (
    <div className='homePage'>
        <header>
        <h1>CSV READER</h1>
        <button onClick={()=>Navigate('/addcsv')}>Create New CSV</button>
        </header>
       
{/* // search bar and sort option bar */}
<span className='searchOptions'>
<input type="text" placeholder="Search by Title, Author or ISBN" onChange={handleSearch} />
<select onChange={handleSort}>
<option value="">Sort by</option>
<option value="title">Title</option>
<option value="authors">Author</option>
<option value="isbn">ISBN</option>
</select>
</span>

<div className='tables'>
      <h2>Books</h2>
     <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>ISBN</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {/* //mapping all the books based on the search */}
          {search ? bookSearchResults.map(book => (
            <tr key={book.isbn}>
              <td>{book.title}</td>
              <td>{book.authors}</td>
              <td>{book.isbn}</td>
              <td>{book.description}</td>
            </tr>
            
            // mapping all the books based on the result

          )) : books.map(book => (
            <tr key={book.isbn}>
              <td>{book.title}</td>
              <td>{book.authors}</td>
              <td>{book.isbn}</td>
              <td >{book.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
<h2>Magazines</h2>
<table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>ISBN</th>
            <th>Published At</th>
          </tr>
        </thead>
        <tbody>


        {/* //mapping all the magazines based on the search */}
        {search ? magSearchResults.map(magazine => (
            <tr key={magazine.isbn}>
              <td>{magazine.title}</td>
              <td>{magazine.authors}</td>
              <td>{magazine.isbn}</td>
              <td>{magazine.publishedAt}</td>
            </tr>
          
            // mapping all the magazines
          )) :  magazines.map(magazine => (
            <tr key={magazine.isbn}>
              <td>{magazine.title}</td>
              <td>{magazine.authors}</td>
              <td>{magazine.isbn}</td>
              <td >{magazine.publishedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
    <h2>All Publications</h2>

    <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>ISBN</th>
            
          </tr>
        </thead>
        <tbody>
        
        {/* //mapping allPublications based on the search */}

          {search ? allSearchResults.map(publication => (
            <tr key={publication.isbn}>
              <td>{publication.title}</td>
              <td>{publication.authors}</td>
              <td>{publication.isbn}</td>
              
            </tr>

           //mapping allPublications 
          )) :  allPublications.map(publication => (
            <tr key={publication.isbn}>
              <td>{publication.title}</td>
              <td>{publication.authors}</td>
              <td>{publication.isbn}</td>
             
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Authors</h2>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
          <tbody>
            {authors.map((author,index) =>(
              <tr key={index}>
              <td>{author.email}</td>
              <td>{author.firstname}</td>
              <td>{author.lastname}</td>
             </tr>
            )  )}
            
          </tbody>
        </table>
       </div>

    </div>
  );
};

export default Books;
