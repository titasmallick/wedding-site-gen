"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  User,
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";
import firebaseApp from "@/config/firebase";
import { fontMono } from "@/config/fonts";

const db = getFirestore(firebaseApp());

export default function RSVPViewer({ guests }) {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Sort States
  const [foodFilter, setFoodFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const q = query(collection(db, "rsvps"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rsvpData = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Match with the master guest list to get more details (side, relation)
        const masterGuest = guests.find(g => g.id === data.guestId);
        return {
          id: doc.id,
          ...data,
          familySide: masterGuest?.familySide || "Unknown",
          relation: masterGuest?.relation || "Guest",
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
        };
      });
      setRsvps(rsvpData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [guests]);

  const processedRsvps = useMemo(() => {
    let result = [...rsvps];

    // Filter by Food
    if (foodFilter !== "all") {
      result = result.filter((item) => item.food === foodFilter);
    }

    // Filter by Attendance
    if (attendanceFilter !== "all") {
      result = result.filter((item) => item.attending === attendanceFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === "newest") return b.timestamp - a.timestamp;
      if (sortOption === "oldest") return a.timestamp - b.timestamp;
      if (sortOption === "guests_high") return b.guests - a.guests;
      if (sortOption === "guests_low") return a.guests - b.guests;
      return 0;
    });

    return result;
  }, [rsvps, foodFilter, attendanceFilter, sortOption]);

  const columns = [
    { name: "GUEST", uid: "guest" },
    { name: "ATTENDING", uid: "attending" },
    { name: "FOOD", uid: "food" },
    { name: "GUESTS", uid: "count" },
    { name: "NOTE", uid: "note" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-default-800 dark:text-white">Live RSVP Responses</h2>
          <Chip variant="flat" color="secondary" size="sm" className={fontMono.className}>
            Total: {processedRsvps.length}
          </Chip>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
          <Select 
            label="Attendance" 
            variant="bordered"
            size="sm"
            labelPlacement="inside"
            className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
            selectedKeys={[attendanceFilter]}
            onSelectionChange={(e) => setAttendanceFilter(Array.from(e)[0])}
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="yes">Attending</SelectItem>
            <SelectItem key="no">Declined</SelectItem>
          </Select>

          <Select 
            label="Food" 
            variant="bordered"
            size="sm"
            labelPlacement="inside"
            className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
            selectedKeys={[foodFilter]}
            onSelectionChange={(e) => setFoodFilter(Array.from(e)[0])}
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="veg">Veg</SelectItem>
            <SelectItem key="non-veg">Non-Veg</SelectItem>
          </Select>

          <Select 
            label="Sort By" 
            variant="bordered"
            size="sm"
            labelPlacement="inside"
            className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
            selectedKeys={[sortOption]}
            onSelectionChange={(e) => setSortOption(Array.from(e)[0])}
          >
            <SelectItem key="newest">Newest First</SelectItem>
            <SelectItem key="oldest">Oldest First</SelectItem>
            <SelectItem key="guests_high">Most Guests</SelectItem>
            <SelectItem key="guests_low">Fewest Guests</SelectItem>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
      <Table aria-label="RSVP Response Table" shadow="sm" className="bg-white dark:bg-zinc-900/50 min-w-[600px]">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} className="bg-default-50 dark:bg-zinc-800 font-bold">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={processedRsvps} emptyContent={"No RSVPs match your filters."} isLoading={loading}>
          {(item) => (
            <TableRow key={item.id} className="border-b border-default-100 last:border-none">
              <TableCell>
                <User
                  name={item.guestName}
                  description={`${item.familySide === "bride" ? "Bride's" : "Groom's"} ${item.relation}`}
                  avatarProps={{
                    size: "sm",
                    className: item.familySide === "bride" ? "bg-wedding-pink-100 text-wedding-pink-600" : "bg-wedding-gold-100 text-wedding-gold-600",
                    name: item.guestName.charAt(0)
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  color={item.attending === "yes" ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                  className="font-bold uppercase"
                >
                  {item.attending === "yes" ? "Attending" : "Declined"}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip color={item.food === "veg" ? "success" : "warning"} variant="dot" size="sm">
                  {item.food === "veg" ? "Vegetarian" : "Non-Veg"}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="font-mono font-bold text-lg">{item.guests}</span>
              </TableCell>
              <TableCell>
                <Tooltip content={item.note || "No special note"}>
                  <p className="text-xs text-default-500 truncate max-w-[150px] italic">
                    {item.note || "—"}
                  </p>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
