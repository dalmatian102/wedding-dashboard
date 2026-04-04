"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Hotel,
  Utensils,
  MessageSquare,
  RefreshCw,
  Heart,
  Search,
} from "lucide-react";
import type { DashboardStats, GuestDetail } from "@/lib/types";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "bg-white",
  textColor = "text-gray-900",
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
  textColor?: string;
}) {
  return (
    <div className={`${color} rounded-xl shadow-sm border border-gray-200 p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${
            color === "bg-white" ? "bg-gray-100" : "bg-white/20"
          }`}
        >
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function GuestOfSection({
  name,
  data,
  color,
}: {
  name: string;
  data: {
    total: number;
    yes: number;
    no: number;
    hopefully: number;
    notResponded: number;
  };
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className={`w-5 h-5 ${color}`} />
        <h3 className="text-lg font-semibold capitalize">{name}'s Guests</h3>
        <span className="text-sm text-gray-500">({data.total} total)</span>
      </div>
      <ProgressBar
        label="Attending (Yes)"
        value={data.yes}
        total={data.total}
        color="bg-green-500"
      />
      <ProgressBar
        label="Not Attending (No)"
        value={data.no}
        total={data.total}
        color="bg-red-500"
      />
      <ProgressBar
        label="Maybe (Hopefully)"
        value={data.hopefully}
        total={data.total}
        color="bg-yellow-500"
      />
      <ProgressBar
        label="No Response"
        value={data.notResponded}
        total={data.total}
        color="bg-gray-400"
      />
    </div>
  );
}

type RsvpFilter = "all" | "yes" | "no" | "hopefully" | "no_response";
type GuestOfFilter = "all" | "johnny" | "laura";
type HotelFilter = "all" | "invited" | "staying" | "declined" | "pending";

const RSVP_FILTERS: { value: RsvpFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "yes", label: "Attending" },
  { value: "no", label: "Not Attending" },
  { value: "hopefully", label: "Hopefully" },
  { value: "no_response", label: "No Response" },
] as const;

const GUEST_OF_FILTERS: { value: GuestOfFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "johnny", label: "Johnny's" },
  { value: "laura", label: "Laura's" },
] as const;

const HOTEL_FILTERS: { value: HotelFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "invited", label: "Hotel Invited" },
  { value: "staying", label: "Staying" },
  { value: "declined", label: "Declined Hotel" },
  { value: "pending", label: "Hotel Pending" },
] as const;

function RsvpBadge({ status }: { status: string | null }) {
  switch (status) {
    case "yes":
      return (
        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Attending
        </span>
      );
    case "no":
      return (
        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
          <XCircle className="w-3 h-3" />
          Not Attending
        </span>
      );
    case "hopefully":
      return (
        <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full text-xs font-medium">
          <HelpCircle className="w-3 h-3" />
          Hopefully
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full text-xs font-medium">
          <Clock className="w-3 h-3" />
          No Response
        </span>
      );
  }
}

function HotelBadge({ guest }: { guest: GuestDetail }) {
  if (!guest.hotel_invited) {
    return <span className="text-gray-400 text-xs">Not invited</span>;
  }
  if (guest.hotel_stay === true) {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3" />
        Staying
      </span>
    );
  }
  if (guest.hotel_stay === false) {
    return (
      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
        <XCircle className="w-3 h-3" />
        Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full text-xs font-medium">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
}

function FilterToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-[#590102] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function GuestTable({ guests }: { guests: GuestDetail[] }) {
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>("all");
  const [guestOfFilter, setGuestOfFilter] = useState<GuestOfFilter>("all");
  const [hotelFilter, setHotelFilter] = useState<HotelFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (rsvpFilter !== "all") {
        if (rsvpFilter === "no_response" && g.rsvp_status !== null) return false;
        if (rsvpFilter !== "no_response" && g.rsvp_status !== rsvpFilter) return false;
      }
      if (guestOfFilter !== "all" && g.guest_of?.toLowerCase() !== guestOfFilter) return false;
      if (hotelFilter !== "all") {
        switch (hotelFilter) {
          case "invited":
            if (!g.hotel_invited) return false;
            break;
          case "staying":
            if (g.hotel_stay !== true) return false;
            break;
          case "declined":
            if (!g.hotel_invited || g.hotel_stay !== false) return false;
            break;
          case "pending":
            if (!g.hotel_invited || g.hotel_stay !== null) return false;
            break;
        }
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !g.guest_name.toLowerCase().includes(q) &&
          !g.party_code.toLowerCase().includes(q) &&
          !g.party_name.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [guests, rsvpFilter, guestOfFilter, hotelFilter, searchQuery]);

  const clearFilters = () => {
    setRsvpFilter("all");
    setGuestOfFilter("all");
    setHotelFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    rsvpFilter !== "all" || guestOfFilter !== "all" || hotelFilter !== "all" || searchQuery !== "";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#590102]" />
          <h3 className="text-lg font-semibold">All Guests</h3>
          <span className="text-sm text-gray-500">
            ({filteredGuests.length} of {guests.length})
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#590102] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#590102]/20 focus:border-[#590102]"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-20 shrink-0">RSVP</span>
          <FilterToggle options={RSVP_FILTERS} value={rsvpFilter} onChange={setRsvpFilter} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-20 shrink-0">Guest Of</span>
          <FilterToggle options={GUEST_OF_FILTERS} value={guestOfFilter} onChange={setGuestOfFilter} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-medium text-gray-500 w-20 shrink-0">Hotel</span>
          <FilterToggle options={HOTEL_FILTERS} value={hotelFilter} onChange={setHotelFilter} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[48rem]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-2 pr-4 font-medium text-gray-500">Guest Name</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">Party Code</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">Party</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">Guest Of</th>
              <th className="pb-2 pr-4 font-medium text-gray-500">RSVP Status</th>
              <th className="pb-2 font-medium text-gray-500">Hotel</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No guests match the current filters
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2.5 pr-4 text-gray-900 font-medium">{guest.guest_name}</td>
                  <td className="py-2.5 pr-4 text-gray-500 font-mono text-xs">{guest.party_code}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{guest.party_name}</td>
                  <td className="py-2.5 pr-4 capitalize text-gray-600">{guest.guest_of}</td>
                  <td className="py-2.5 pr-4"><RsvpBadge status={guest.rsvp_status} /></td>
                  <td className="py-2.5"><HotelBadge guest={guest} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pt-3 border-t border-gray-200 mt-2 text-sm text-gray-600 font-medium">
        Total: {filteredGuests.length} guest{filteredGuests.length !== 1 ? "s" : ""}
        {hasActiveFilters && ` (of ${guests.length})`}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#590102]" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-[#590102] text-white rounded-lg hover:bg-[#590102]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const responseRate =
    stats.totalGuests > 0
      ? ((stats.totalResponses / stats.totalGuests) * 100).toFixed(0)
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#590102]">
              Wedding RSVP Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Johnny & Laura's Wedding Guest Tracking
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {lastUpdated && (
              <span className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#590102] text-white rounded-lg hover:bg-[#590102]/90 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Guests"
            value={stats.totalGuests}
            subtitle={`${responseRate}% response rate`}
            icon={Users}
          />
          <StatCard
            title="Attending"
            value={stats.rsvpYes}
            subtitle="Confirmed yes"
            icon={CheckCircle}
            color="bg-green-50"
            textColor="text-green-700"
          />
          <StatCard
            title="Not Attending"
            value={stats.rsvpNo}
            subtitle="Confirmed no"
            icon={XCircle}
            color="bg-red-50"
            textColor="text-red-700"
          />
          <StatCard
            title="Maybe"
            value={stats.rsvpHopefully}
            subtitle="Hoping to attend"
            icon={HelpCircle}
            color="bg-yellow-50"
            textColor="text-yellow-700"
          />
        </div>

        {/* Guest Of Breakdown */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Responses by Guest Of
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <GuestOfSection
            name="Johnny"
            data={stats.byGuestOf.johnny}
            color="text-blue-600"
          />
          <GuestOfSection
            name="Laura"
            data={stats.byGuestOf.laura}
            color="text-pink-600"
          />
        </div>

        {/* Hotel & Dietary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Hotel Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-5 h-5 text-[#590102]" />
              <h3 className="text-lg font-semibold">Hotel Accommodations</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.hotel.invited}
                </p>
                <p className="text-sm text-gray-500">Invited</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">
                  {stats.hotel.accepted}
                </p>
                <p className="text-sm text-green-600">Accepted</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">
                  {stats.hotel.declined}
                </p>
                <p className="text-sm text-red-600">Declined</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-700">
                  {stats.hotel.notResponded}
                </p>
                <p className="text-sm text-orange-600">Pending</p>
              </div>
            </div>
          </div>

          {/* Dietary Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-[#590102]" />
              <h3 className="text-lg font-semibold">Dietary Requirements</h3>
              <span className="text-sm text-gray-500">
                ({stats.dietary.hasRestrictions} guests)
              </span>
            </div>
            {stats.dietary.hasRestrictions > 0 ? (
              <div className="space-y-2">
                <ProgressBar
                  label="Vegetarian"
                  value={stats.dietary.vegetarian}
                  total={stats.dietary.hasRestrictions}
                  color="bg-green-500"
                />
                <ProgressBar
                  label="Vegan"
                  value={stats.dietary.vegan}
                  total={stats.dietary.hasRestrictions}
                  color="bg-emerald-500"
                />
                <ProgressBar
                  label="Allergies"
                  value={stats.dietary.allergies}
                  total={stats.dietary.hasRestrictions}
                  color="bg-orange-500"
                />
                <ProgressBar
                  label="Other"
                  value={stats.dietary.other}
                  total={stats.dietary.hasRestrictions}
                  color="bg-purple-500"
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No dietary restrictions reported yet
              </p>
            )}
          </div>
        </div>

        {/* Custom Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#590102]" />
            <h3 className="text-lg font-semibold">Messages from Guests</h3>
            <span className="text-sm text-gray-500">
              ({stats.customMessages.length} messages)
            </span>
          </div>
          {stats.customMessages.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.customMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-[#590102] pl-4 py-2"
                >
                  <p className="text-gray-700 italic">"{msg.message}"</p>
                  <p className="text-sm text-gray-500 mt-1">
                    — {msg.guest_name}, {msg.party_name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No custom messages yet
            </p>
          )}
        </div>

        {/* All Guests Table */}
        <GuestTable guests={stats.allGuests} />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Auto-refreshes every 30 seconds
        </div>
      </div>
    </main>
  );
}
