"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";

const Dash = ({ guests }) => {
  const stats = {
    reception: { bride: 0, groom: 0, total: 0 },
    wedding: { bride: 0, groom: 0, total: 0 },
    registration: { bride: 0, groom: 0, total: 0 },
    rsvpStatus: { accepted: 0, pending: 0, declined: 0, total: guests.length },
  };

  guests.forEach((guest) => {
    const side = guest.familySide === "groom" ? "groom" : "bride";
    const count = guest.invitedGuests || 1;

    guest.invitedFor.forEach((event) => {
      if (stats[event]) {
        stats[event][side] += count;
        stats[event].total += count;
      }
    });

    const rsvp = guest.rsvpStatus?.toLowerCase();
    if (rsvp === "accepted") stats.rsvpStatus.accepted += 1;
    else if (rsvp === "pending") stats.rsvpStatus.pending += 1;
    else if (rsvp === "declined") stats.rsvpStatus.declined += 1;
  });

  const eventCards = [
    { title: "Reception", data: stats.reception },
    { title: "Wedding", data: stats.wedding },
    { title: "Registration", data: stats.registration },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {eventCards.map((event, idx) => (
        <Card key={idx} shadow="none" className="rounded-xl">
          <CardHeader>
            <h3 className="text-lg font-semibold">{event.title}</h3>
          </CardHeader>
          <CardBody className="space-y-1 text-sm ">
            <p>Bride Side: {event.data.bride}</p>
            <p>Groom Side: {event.data.groom}</p>
            <p>Total: {event.data.total}</p>
          </CardBody>
        </Card>
      ))}

      <Card
        shadow="none"
        className="rounded-xl md:col-span-2 xl:col-span-3"
      >
        <CardHeader>
          <h3 className="text-lg font-semibold">RSVP Summary</h3>
        </CardHeader>
        <CardBody className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ">
          <div>
            <p>Accepted:</p>
            <p className="font-medium">{stats.rsvpStatus.accepted}</p>
          </div>
          <div>
            <p>Pending:</p>
            <p className="font-medium">{stats.rsvpStatus.pending}</p>
          </div>
          <div>
            <p>Declined:</p>
            <p className="font-medium">{stats.rsvpStatus.declined}</p>
          </div>
          <div>
            <p>Total Names:</p>
            <p className="font-medium">{stats.rsvpStatus.total}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dash;
