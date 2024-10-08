export type CarrierData = {
  id?: string;
  agent_id: number;
  home_city: string;
  carrier_email: string;
  mc_number: string;
  company_name: string;
  company_phone: string;
  truck_type_spam: string;
  spam: boolean;
  driver_count: number;
  truck_count: number;
};

export type TruckData = {
  id: number;
  // truck_number: number;
  carrier_id: number;
  type: "VH" | "SB" | "";
  dims: string;
  payload: number;
  accessories: string | string[];
  // driver_number: number;
  // Driver_name: string;
};


export interface DriverData {
  id: number;
  carrier_id: number;
  truck_id: number;
  lastname: string;
  name: string;
  phone: string;
  email: string;
  perks: string;
}

export interface SearchData {
  id: number;
  search_number: number;
  truck_number: number;
  PU_City: string;
  Destination: string;
  Late_pick_up: string;
  pu_date_start: string;
  pu_date_end: string;
  del_date_start: string;
  del_date_end: string;
}

export interface UserData {
  id: number;
  name: string;
  lastname: string;
  role: string;
}