export interface Guest {
  id: string;
  party_code: string;
  party_name: string;
  guest_name: string;
  guest_of: "johnny" | "laura";
  hotel_invited: boolean;
  created_at: string;
}

export interface RsvpResponse {
  id: string;
  guest_id: string;
  guest_of: "johnny" | "laura";
  party_name: string;
  guest_name: string;
  rsvp_status: "yes" | "no" | "hopefully";
  has_dietary_restrictions: boolean;
  dietary_type: "vegetarian" | "vegan" | "allergies" | "other" | null;
  dietary_notes: string | null;
  hotel_invited: boolean;
  hotel_stay: boolean | null;
  custom_message: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface GuestDetail {
  guest_name: string;
  party_code: string;
  party_name: string;
  guest_of: string;
  hotel_invited: boolean;
  rsvp_status: "yes" | "no" | "hopefully" | null;
  hotel_stay: boolean | null;
}

export interface DashboardStats {
  totalGuests: number;
  totalResponses: number;
  rsvpYes: number;
  rsvpNo: number;
  rsvpHopefully: number;
  notResponded: number;
  byGuestOf: {
    johnny: {
      total: number;
      yes: number;
      no: number;
      hopefully: number;
      notResponded: number;
    };
    laura: {
      total: number;
      yes: number;
      no: number;
      hopefully: number;
      notResponded: number;
    };
  };
  hotel: {
    invited: number;
    accepted: number;
    declined: number;
    notResponded: number;
  };
  allGuests: GuestDetail[];
  dietary: {
    hasRestrictions: number;
    vegetarian: number;
    vegan: number;
    allergies: number;
    other: number;
  };
  customMessages: Array<{
    party_name: string;
    guest_name: string;
    message: string;
  }>;
}
