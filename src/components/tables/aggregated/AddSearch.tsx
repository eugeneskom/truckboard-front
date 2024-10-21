"use client"
import React, {  useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { 
  // DriverData, 
  SearchRateType } from '@/types';

interface AddSearchProps {
  setDrivers: React.Dispatch<React.SetStateAction<{ id: number; name: string; lastname: string }[]>>;
  setCarriers: React.Dispatch<React.SetStateAction<{ id: number; company_name: string; }[]>>;
  setLocalData: React.Dispatch<React.SetStateAction<SearchRateType[]>>;
  localData: SearchRateType[];
  carriers: { id: number; company_name: string; }[];
  drivers: { id: number; name: string; lastname: string }[];
}

function AddSearch({setDrivers, setCarriers, setLocalData, localData, carriers, drivers}: AddSearchProps) {
  const [newSearchData, setNewSearchData] = useState<Partial<SearchRateType>>({});
  
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [carrierSearch, setCarrierSearch] = useState("");
  const [isCarrierDropdownOpen, setIsCarrierDropdownOpen] = useState(false);


  const filteredCarriers = useMemo(() => {
    if (!carrierSearch.trim()) return carriers;
    return carriers.filter((carrier) => carrier.company_name.toLowerCase().includes(carrierSearch.toLowerCase()));
  }, [carriers, carrierSearch]);

  const fetchDrivers = async (carrierId: number) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/drivers`, {
        params: { carrierId },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}api/carriers`);
      setCarriers(response.data);
    } catch (error) {
      console.error("Error fetching carriers:", error);
    }
  };

  const handleCarrierChange = (carrier: { id: number; company_name: string }) => {
    setSelectedCarrier(carrier.id);
    setNewSearchData({ ...newSearchData, carrier_id: carrier.id, driver_id: undefined });
    fetchDrivers(carrier.id);
    setCarrierSearch(carrier.company_name);
    setIsCarrierDropdownOpen(false);
  };

  const handleDriverChange = (value: string) => {
    setNewSearchData({ ...newSearchData, driver_id: parseInt(value) });
  };

  const handleAddSearch = async () => {
    // const params = {...newSearchData, agent_id: user?.id}
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/searches`, newSearchData);
      const updatedData = [...localData, response.data];
      setLocalData(updatedData);
      // setData(updatedData);
      setNewSearchData({});
      setSelectedCarrier(null);
      setDrivers([]);
    } catch (error) {
      console.error("Error creating new search:", error);
    }
  };

 


  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button onClick={fetchCarriers}>New Search</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Search</DialogTitle>
      </DialogHeader>
      <div className="relative">
        <Input placeholder="Search for a carrier" 
        value={carrierSearch} onChange={(e) => 
        setCarrierSearch(e.target.value)} 
        onFocus={() => setIsCarrierDropdownOpen(true)} 
        onBlur={() => setTimeout(() => setIsCarrierDropdownOpen(false), 200)} />
        {isCarrierDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
            {filteredCarriers.map((carrier) => (
              <div key={carrier.id} className="p-2 hover:bg-gray-100 cursor-pointer" onMouseDown={() => handleCarrierChange(carrier)}>
                {carrier.company_name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Select onValueChange={handleDriverChange} disabled={!selectedCarrier}>
        <SelectTrigger>
          <SelectValue placeholder={selectedCarrier ? "Select a driver" : "Select a carrier first"} />
        </SelectTrigger>
        <SelectContent>
          {drivers.map((driver) => (
            <SelectItem key={driver.id} value={driver.id.toString()}>{`${driver.name} ${driver.lastname}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input placeholder="Pickup City" onChange={(e) => setNewSearchData({ ...newSearchData, pu_city: e.target.value })} />
      <Input placeholder="Destination" onChange={(e) => setNewSearchData({ ...newSearchData, destination: e.target.value })} />
      <Button onClick={handleAddSearch}>Create Search</Button>
    </DialogContent>
  </Dialog>
  )
}

export default AddSearch