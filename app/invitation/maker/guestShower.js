"use client";

import {
  Chip,
  Button,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Link,
  Input,
} from "@heroui/react";
import { fontSans, fontMono } from "@/config/fonts";
import { useState, useMemo } from "react";

const familyChipColor = {
  bride: "primary",
  groom: "secondary",
};

const rsvpChipColor = {
  accepted: "success",
  declined: "danger",
  maybe: "warning",
  pending: "default",
};

const rsvpBorderColor = {
  accepted: "border-success",
  declined: "border-danger",
  maybe: "border-warning",
  pending: "border-default",
};

const invitedForColor = {
  registration: "success",
  reception: "danger",
  wedding: "warning",
};

export default function GuestTable({ guests, onEdit, onDelete, onAdd }) {
  const [filters, setFilters] = useState({
    familySide: "all",
    invitedFor: "all",
    relation: "all",
    rsvpStatus: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const nameMatch = guest.name?.toLowerCase().includes(lowerTerm);
        const contactMatch = guest.contact?.toLowerCase().includes(lowerTerm);
        
        if (!nameMatch && !contactMatch) return false;
      }

      if (
        filters.familySide !== "all" &&
        guest.familySide !== filters.familySide
      )
        return false;
      if (
        filters.invitedFor !== "all" &&
        !guest.invitedFor.includes(filters.invitedFor)
      )
        return false;
      if (filters.relation !== "all" && guest.relation !== filters.relation)
        return false;
      if (
        filters.rsvpStatus !== "all" &&
        guest.rsvpStatus !== filters.rsvpStatus
      )
        return false;
      return true;
    });
  }, [guests, filters, searchTerm]);

  return (
    <div className={`${fontSans.className}`}>
      {/* FILTER SECTION */}
      <Card className="mb-4 w-full shadow-sm bg-transparent">
        <CardBody className="p-4 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="w-full sm:max-w-md">
              <Input
                label="Search Guests"
                placeholder="Search by name or contact..."
                labelPlacement="outside-top"
                value={searchTerm}
                onValueChange={setSearchTerm}
                variant="bordered"
                size="md"
                classNames={{
                  input: "outline-none",
                }}
              />
            </div>
            <Button
              onPress={onAdd}
              color="primary"
              className="w-full sm:w-auto"
              size="lg"
            >
              Add Guest
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 w-full justify-start border-t dark:border-white/10 pt-4">
            <Select
              label="Family Side"
              variant="bordered"
              size="sm"
              labelPlacement="inside"
              className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
              selectedKeys={[filters.familySide]}
              onSelectionChange={(e) =>
                handleFilterChange("familySide", Array.from(e)[0])
              }
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="bride">Bride</SelectItem>
              <SelectItem key="groom">Groom</SelectItem>
            </Select>

            <Select
              label="Invited For"
              variant="bordered"
              size="sm"
              labelPlacement="inside"
              className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
              selectedKeys={[filters.invitedFor]}
              onSelectionChange={(e) =>
                handleFilterChange("invitedFor", Array.from(e)[0])
              }
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="registration">Registration</SelectItem>
              <SelectItem key="wedding">Wedding</SelectItem>
              <SelectItem key="reception">Reception</SelectItem>
            </Select>

            <Select
              label="Relation"
              variant="bordered"
              size="sm"
              labelPlacement="inside"
              className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
              selectedKeys={[filters.relation]}
              onSelectionChange={(e) =>
                handleFilterChange("relation", Array.from(e)[0])
              }
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="friend">Friend</SelectItem>
              <SelectItem key="family">Family</SelectItem>
              <SelectItem key="colleague">Colleague</SelectItem>
              <SelectItem key="other">Other</SelectItem>
            </Select>

            <Select
              label="RSVP"
              variant="bordered"
              size="sm"
              labelPlacement="inside"
              className="min-w-[140px] max-w-[160px] flex-1 [&_label]:!pb-1.5 [&_[data-slot=value]]:!pt-1.5"
              selectedKeys={[filters.rsvpStatus]}
              onSelectionChange={(e) =>
                handleFilterChange("rsvpStatus", Array.from(e)[0])
              }
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="accepted">Accepted</SelectItem>
              <SelectItem key="declined">Declined</SelectItem>
              <SelectItem key="maybe">Maybe</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* CARD VIEW (ALL SCREENS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredGuests.map((guest, index) => (
          <Card
            key={index}
            className={`flex text-left flex-col justify-between mb-2 border-t-4 ${rsvpBorderColor[guest.rsvpStatus]} shadow-md h-full`}
          >
            <CardHeader className="flex justify-between items-center px-4 pt-4 pb-2 gap-2">
              <div>
                <p className="font-bold text-base">{guest.name}</p>
                <p className="text-sm capitalize">
                  {guest.relation} •{" "}
                  <span className="capitalize">{guest.familySide}</span>
                </p>
              </div>
              <Chip
                size="sm"
                color={familyChipColor[guest.familySide]}
                variant="flat"
                className="capitalize"
              >
                {guest.familySide}
              </Chip>
            </CardHeader>

            <CardBody className="px-4 py-2 space-y-2 text-sm grow">
              <p>
                <strong>Contact:</strong>{" "}
                {guest.contact?.length >= 2
                  ? `${guest.contact.charAt(0)}${"*".repeat(
                      guest.contact.length - 2
                    )}${guest.contact.charAt(guest.contact.length - 1)}`
                  : guest.contact}
              </p>
              <section>
                <strong>Invited For:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {guest.invitedFor.map((item, i) => (
                    <Chip
                      key={i}
                      variant="flat"
                      size="sm"
                      color={invitedForColor[item.toLowerCase()]}
                      className={fontMono.className}
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </section>
              <p>
                <strong>Guests Count:</strong> {guest.invitedGuests}
              </p>
              {guest.notes && (
                <p>
                  <strong>Notes:</strong> {guest.notes}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                <Link
                  color="foreground"
                  showAnchorIcon
                  href={`./${guest.id}`}
                  className="bg-yellow-500 text-black dark:text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  invitation
                </Link>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Wedding Invitation",
                          text: `Join us! Here’s your invitation link:`,
                          url: `${window.location.origin}/invitation/${guest.id}`,
                        })
                        .catch((error) =>
                          console.error("Error sharing", error)
                        );
                    } else {
                      alert("Sharing is not supported in this browser.");
                    }
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Share
                </button>
                {guest.contact && (
                  <a
                    href={`https://wa.me/${guest.contact.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hi! You are invited to Titas & Sukanya's wedding. Here's your invitation link: ${window.location.origin}/invitation/${guest.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </CardBody>

            <CardFooter className="flex justify-end gap-2 px-4 pb-4 pt-2">
              <Button
                size="sm"
                variant="bordered"
                color="primary"
                onPress={() => onEdit(guest)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="bordered"
                color="danger"
                onPress={() => onDelete(guest)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
