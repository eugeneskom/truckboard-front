export type CarrierData = {
  id?: number;
  agent_id?: number;
  home_city: string;
  carrier_email: string;
  mc_number: string;
  company_name: string;
  company_phone: string;
  truck_type_spam: string;
  spam: boolean;
  driver_count?: number;
  truck_count?: number;
};

export type TruckData = {
  id: number;
  // truck_id: number;
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
  // search_number: number;
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
export interface RateItem {
  id: number;
  search_id: number;
  dead_head: number;
  min_miles: number;
  max_miles: number;
  RPM: number;
  min_rate: number;
  round_to: number;
  extra: number;
}


// export interface PostingTypes {
//   search_number: number;
//   dead_head: number | null;
//   min_miles: number | null;
//   max_miles: number | null;
//   rpm: number | null;
//   min_rate: number | null;
//   round_to: number | null;
//   extra: number | null;
//   truck_id: number;
//   pu_city: string;
//   destination: string;
//   late_pick_up: string;
//   pu_date_start: string;
//   pu_date_end: string;
//   del_date_start: string;
//   del_date_end: string;
//   carrier_number: number;
//   truck_type: string;
//   truck_dims: string;
//   payload: number;
//   accessories: string;
//   driver_number: number;
//   driver_name: string;
//   driver_lastname: string;
//   driver_phone: string;
//   driver_email: string;
//   perks: string;
//   agent_number: number;
//   home_city: string;
//   carrier_email: string;
//   mc_number: string;
//   company_name: string;
//   company_phone: string;
//   agent_name: string;
//   agent_email: string;
// }