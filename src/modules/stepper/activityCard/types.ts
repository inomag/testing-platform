export interface Meeting {
  date: string;
}

export interface Location {
  name: string;
}

export interface MetaData {
  meeting: Meeting;
  location: Location;
}
