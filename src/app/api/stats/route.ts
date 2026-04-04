import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Guest, RsvpResponse, DashboardStats, GuestDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch all guests
    const { data: guests, error: guestsError } = await supabase
      .from("guests")
      .select("*");

    if (guestsError) {
      return NextResponse.json({ error: guestsError.message }, { status: 500 });
    }

    // Fetch all RSVP responses
    const { data: responses, error: responsesError } = await supabase
      .from("rsvp_responses")
      .select("*");

    if (responsesError) {
      return NextResponse.json(
        { error: responsesError.message },
        { status: 500 }
      );
    }

    const guestsList = (guests || []) as Guest[];
    const responsesList = (responses || []) as RsvpResponse[];

    // Create a map of guest_id to response for quick lookup
    const responseMap = new Map<string, RsvpResponse>();
    responsesList.forEach((r) => {
      responseMap.set(r.guest_id, r);
    });

    // Calculate overall stats
    const totalGuests = guestsList.length;
    const totalResponses = responsesList.length;

    const rsvpYes = responsesList.filter((r) => r.rsvp_status === "yes").length;
    const rsvpNo = responsesList.filter((r) => r.rsvp_status === "no").length;
    const rsvpHopefully = responsesList.filter(
      (r) => r.rsvp_status === "hopefully"
    ).length;
    const notResponded = totalGuests - totalResponses;

    // Calculate by guest_of (case-insensitive comparison)
    const johnnyGuests = guestsList.filter(
      (g) => g.guest_of?.toLowerCase() === "johnny"
    );
    const lauraGuests = guestsList.filter(
      (g) => g.guest_of?.toLowerCase() === "laura"
    );

    const johnnyResponses = responsesList.filter(
      (r) => r.guest_of?.toLowerCase() === "johnny"
    );
    const lauraResponses = responsesList.filter(
      (r) => r.guest_of?.toLowerCase() === "laura"
    );

    const byGuestOf = {
      johnny: {
        total: johnnyGuests.length,
        yes: johnnyResponses.filter((r) => r.rsvp_status === "yes").length,
        no: johnnyResponses.filter((r) => r.rsvp_status === "no").length,
        hopefully: johnnyResponses.filter((r) => r.rsvp_status === "hopefully")
          .length,
        notResponded: johnnyGuests.length - johnnyResponses.length,
      },
      laura: {
        total: lauraGuests.length,
        yes: lauraResponses.filter((r) => r.rsvp_status === "yes").length,
        no: lauraResponses.filter((r) => r.rsvp_status === "no").length,
        hopefully: lauraResponses.filter((r) => r.rsvp_status === "hopefully")
          .length,
        notResponded: lauraGuests.length - lauraResponses.length,
      },
    };

    // Calculate hotel stats
    const hotelInvitedGuests = guestsList.filter((g) => g.hotel_invited);
    const hotelInvitedResponses = responsesList.filter((r) => r.hotel_invited);

    const hotel = {
      invited: hotelInvitedGuests.length,
      accepted: hotelInvitedResponses.filter((r) => r.hotel_stay === true)
        .length,
      declined: hotelInvitedResponses.filter((r) => r.hotel_stay === false)
        .length,
      notResponded:
        hotelInvitedGuests.length -
        hotelInvitedResponses.filter((r) => r.hotel_stay !== null).length,
    };

    // Build full guest list with merged response data
    const allGuests: GuestDetail[] = guestsList.map((g) => {
      const response = responseMap.get(g.id);
      return {
        guest_name: g.guest_name,
        party_name: g.party_name,
        guest_of: g.guest_of,
        hotel_invited: g.hotel_invited,
        rsvp_status: response?.rsvp_status ?? null,
        hotel_stay: response?.hotel_stay ?? null,
      };
    });

    // Calculate dietary stats
    const withRestrictions = responsesList.filter(
      (r) => r.has_dietary_restrictions
    );
    const dietary = {
      hasRestrictions: withRestrictions.length,
      vegetarian: withRestrictions.filter((r) => r.dietary_type === "vegetarian")
        .length,
      vegan: withRestrictions.filter((r) => r.dietary_type === "vegan").length,
      allergies: withRestrictions.filter((r) => r.dietary_type === "allergies")
        .length,
      other: withRestrictions.filter((r) => r.dietary_type === "other").length,
    };

    // Collect custom messages
    const customMessages = responsesList
      .filter((r) => r.custom_message && r.custom_message.trim() !== "")
      .map((r) => ({
        party_name: r.party_name,
        guest_name: r.guest_name,
        message: r.custom_message!,
      }));

    const stats: DashboardStats = {
      totalGuests,
      totalResponses,
      rsvpYes,
      rsvpNo,
      rsvpHopefully,
      notResponded,
      byGuestOf,
      hotel,
      allGuests,
      dietary,
      customMessages,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
