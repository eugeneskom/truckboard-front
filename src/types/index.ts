export type CarrierData = {
  carrier_number: string;
  agent_number: string;
  home_city: string;
  carrier_email: string;
  mc_number: string;
  company_name: string;
  company_phone: string;
  truck_type_spam: string;
  spam: boolean;
};

export type TruckData = {
  id: number;
  truck_number: number;
  carrier_number: number;
  truck_type: "VH" | "SB";
  truck_dims: string;
  payload: number;
  accessories: string | string[];
  driver_number: number;
  Driver_name: string;
};


export interface DriverData {
  id: number;
  driver_number: number;
  carrier_number: number;
  driver_name: string;
  driver_lastname: string;
  driver_phone: string;
  driver_email: string;
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

export interface RateItem {
  id: number;
  rate_number: number,
  search_number: string;
  dead_head: number;
  min_miles: number;
  max_miles: number;
  RPM: number;
  min_rate: number;
  round_to: number;
  extra: number;
}