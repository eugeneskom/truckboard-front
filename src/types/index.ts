export type CarrierData = {
  id?: number;
  user_id?: number;
  home_city: string;
  carrier_email: string;
  mc_number: string;
  company_name: string;
  company_phone: string;
  truck_type_spam: "" | "VH" | "SB";
  spam: boolean;
  driver_count?: number;
  truck_count?: number;
};

export type TruckData = {
  id: number;
  carrier_id: number;
  type: "VH" | "SB" | "";
  dims: string;
  payload: number;
  accessories: string | string[];
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
  search_id: number;
  truck_id: number;
  PU_City: string;
  Destination: string;
  Late_pick_up: string;
  pu_date_start: string | null;
  pu_date_end: string | null;
  del_date_start: string | null;
  del_date_end: string | null;
}

export interface UserData {
  id: number;
  name: string;
  lastname: string;
  role: string;
}