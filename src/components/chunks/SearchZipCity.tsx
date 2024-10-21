"use client";
import { UsCity } from "@/types";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

const SearchZipCity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UsCity[]>([]);
  const [selectedResult, setSelectedResult] = useState<UsCity | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 3) {
        setResults([]);
        return;
      }

      const searchType = /^\d+$/.test(term) ? "zip" : "city";

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/search/${searchType}/${term}`);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error(error);
        setResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedResult(null);
  };

  const handleSelectResult = (result: UsCity) => {
    setSelectedResult(result);
    setSearchTerm(/^\d+$/.test(searchTerm) ? result.zip_codes : result.city);
    setResults([]);
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={handleInputChange} 
        placeholder="Enter Zip Code or City Name" 
      />

      {results?.length > 0 && !selectedResult && (
        <ul>
          {results.map((result) => (
            <li key={result.id} onClick={() => handleSelectResult(result)}>
              {`${result.city}, ${result.state_short} - ${result.zip_codes}`}
            </li>
          ))}
        </ul>
      )}

      {selectedResult && (
        <div>
          <h3>{selectedResult.city}</h3>
          <p>Zip Codes: {selectedResult.zip_codes}</p>
          <p>
            State: {selectedResult.state_full} ({selectedResult.state_short})
          </p>
          <p>City Alias: {selectedResult.city_alias}</p>
        </div>
      )}
    </div>
  );
};

export default SearchZipCity;