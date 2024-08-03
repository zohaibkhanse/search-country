import { useEffect, useState } from "react";

export default function App(){
    const [search, setSearch] = useState('');
    const [country, setCountry]  = useState('');
    const [countriesList , setCountriesList] = useState([]);
    const [selectSearch, setSelectSearch] = useState('');
    const [isSelected, setIsSelected] = useState(false);

    
    useEffect(function(){
      async function countryFun(){
        try{
            setCountriesList([]);
            setIsSelected(false)
            const res = await fetch(`https://restcountries.com/v2/name/${search}`);
            if(!res.ok) throw new Error("Country not found");
            const data = await res.json();
            data.map(el => setCountriesList((contry) => [...contry, el.name]))
          }catch(error){
            console.error(error);
          }
        }
          countryFun();
        
      }, [search])
      
      function handleSelectSearch(id){
        setSelectSearch(countriesList[id]);
        setIsSelected(true);
        
    }
  
    function handleSearchInput(e){
      setSelectSearch('');
      setSearch(e.target.value)
    }

    async function handleSubmitSearch(e){
      e.preventDefault();

        try{
          setCountriesList([]);
          const res = await fetch(`https://restcountries.com/v2/name/${selectSearch}`);
          if(!res.ok) throw new Error("Country not found");
          const [data] = await res.json();
          setCountry(data);
          console.log(data);
        }catch(error){
          console.error(error);
        }
      
    }
  
  // JSX
  return (
    <div className="container">
        <form className="search-bar" onSubmit={handleSubmitSearch}>
           <input value={selectSearch || search} onChange={handleSearchInput} type="text" placeholder="Search New Country"/>
            <button className="search-btn" type="submit" >Search</button>
           { isSelected ? null : <SearchList countriesList={countriesList} onSelectCountry={handleSelectSearch} />}
        </form>
        {country ? <Country  country={country}/> : <h2 className="initial-message">Search new country</h2>}
    </div>
  );
}




function SearchList({countriesList, onSelectCountry}){
  return (
    <ul className="search-list">
        {countriesList.length === 0 ?
         <li>country not found</li> : 
          countriesList.map((country, i) => 
          <li onClick={() => onSelectCountry(i)} key={i}>{country}</li>)
        }
    </ul>
  )
}






function Country({country}){
  return (
    <div className="country">
        <img src={country?.flag} alt="Flage" />
        <h2>Name: {country?.name}</h2>
        <p>Currency: <i>{country?.currencies?.[0]?.code}</i></p>
    </div>
  );
}