export interface IGirlModel {
  uuid?: string;
  name?: string;
  age?: number;
  home?: string;
  introduction?: string;
  photos?: string[];
  rates?: IDateRate[];
  availabilities?: IAvilability[];
  status?: GirlStatus;
  created_at?: number;
  updated_at?: number;
  
  // extra fiels
  admin_id?: string;
}

export interface IDateRate {
  hours?: number;
  description?: string;
  rate?: number;
}

export interface IAvilability  {
  days?: string;
  times?: string;
  description?: string;
}

export enum GirlStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}
