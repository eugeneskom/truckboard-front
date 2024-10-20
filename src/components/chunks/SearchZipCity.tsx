"use client";
import { UsCity } from "@/types";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

const SearchZipCity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("zip");
  const [results, setResults] = useState<UsCity[]>([]);
  const [selectedResult, setSelectedResult] = useState<UsCity | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (term: string, type: string) => {
      if (term.length < 3) {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/search/${type}/${term}`);
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
    debouncedSearch(searchTerm, searchType);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, searchType, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedResult(null);
  };

  const handleSelectResult = (result: UsCity) => {
    setSelectedResult(result);
    setSearchTerm(searchType === 'zip' ? result.zip_codes : result.city);
    setResults([]);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleInputChange} placeholder={searchType === "zip" ? "Enter Zip Code" : "Enter City Name"} />
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="zip">Zip Code</option>
        <option value="city">City Name</option>
      </select>

      {results?.length > 0 && !selectedResult && (
        <ul>
          {results.map((result) => (
            <li key={result.id} onClick={() => handleSelectResult(result)}>
              {searchType === "zip" ? `${result.city}, ${result.state_short} (${result.zip_codes})` : `${result.city}, ${result.state_short} - ${result.zip_codes}`}
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
