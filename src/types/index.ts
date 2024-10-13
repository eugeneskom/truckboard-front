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


export interface SearchRateType {
  search_id: number;
  pu_city: string;
  destination: string;
  late_pick_up: string;
  pu_date_start: string;
  pu_date_end: string;
  del_date_start: string;
  del_date_end: string;
  dead_head: number;
  min_miles: number;
  max_miles: number;
  rpm: number;
  min_rate: number;
  round_to: number;
  extra: number;
  // Carrier fields
  company_name: string;
  carrier_id: number;
  home_city: string;
  carrier_email: string;
  mc_number: string;
  company_phone: string;
  // Agent fields
  agent_id: number;
  agent_name: string;
  agent_email: string;
  // Truck fields
  truck_id: number;
  truck_type: string;
  truck_dims: string;
  payload: number;
  accessories: string;
  // Driver fields
  driver_id: number;
  driver_name: string;
  driver_lastname: string;
  driver_phone: string;
  driver_email: string;
  perks: string;
}


export interface TruckTypeData {
  type: "" | "VH" | "SB";
}


//  input types:
type InputTypes =
  | "text"
  | "date"
  | "email"
  | "number"
  | "readonly"
  | "phone"
  | "truckDims"
  | "checkbox"
  | { type: "select"; options: string[] }
  | { type: "truckTypeSelect"; options: string[] }
  | { type: "carrierSelect"; options: { id: number; name: string }[] }
  | { type: "driverSelect"; options: { id: number; name: string }[] }
  | { type: "latePickupSelect"; options: string[] };



// the structure for column definitions
export interface ColumnDef {
  key: keyof SearchRateType | keyof CarrierData | keyof TruckData | keyof DriverData | keyof RateItem;
  type: InputTypes;
  label: string;
}


export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}