"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  Divider,
  Button,
  Link,
  Image,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
} from "@heroui/react";

import { fontCursive, fontSans } from "@/config/fonts";
import { MapPinIcon } from "@/components/icons";

const transportHubs = [
  {
    name: "From Howrah Station",
    details:
      "Take any 'Bandel Local' or 'Burdwan Local' from Howrah Station. Serampore is about a 30-40 minute journey.",
    icon: "🚆",
  },
  {
    name: "By Road (Kolkata)",
    details:
      "Serampore is roughly 25km from Central Kolkata via the Grand Trunk (GT) Road or the Delhi Road.",
    icon: "🚗",
  },
  {
    name: "Local Transport",
    details:
      "Auto-rickshaws and Totomod (E-rickshaws) are the lifeline here. They are available 24/7 at the stations.",
    icon: "🛺",
  },
];

const stayOptions = [
  {
    name: "The Denmark Tavern",
    distance: "Heritage Stay",
    type: "Premium / Historic",
    desc: "A beautifully restored 230-year-old Danish tavern overlooking the Hooghly river.",
    href: "https://www.denmarktavern.com/",
  },
  {
    name: "Avenue Plaza",
    distance: "3 mins from Station",
    type: "Convenient",
    desc: "Located right next to the Serampore station, perfect for guests coming by train.",
    href: "https://www.goibibo.com/hotels/avenue-plaza-hotel-in-serampore-6841243141434114141/",
  },
  {
    name: "The Peerless Inn",
    distance: "20 km (Kolkata)",
    type: "Luxury",
    desc: "If you prefer staying in the heart of Kolkata and traveling for the events.",
    href: "https://www.peerlesshotels.com/",
  },
];

const highlights = [
  {
    title: "St. Olav's Church",
    desc: "A stunning piece of Danish architecture from 1800, restored to its former glory.",
    img: "https://static.toiimg.com/photo/52947147/.jpg",
  },
  {
    title: "Serampore College",
    desc: "One of the oldest Western university institutions in Asia, established in 1818.",
    img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "The Riverfront",
    desc: "Take a peaceful walk along the Hooghly river during sunset for a magical view.",
    img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=600",
  },
];

const foodSpots = [
  {
    name: "Mahesh Chandra Dutta",
    special: "Gutka Sandesh",
    type: "Legendary Sweets",
    desc: "Over 160 years old! You must try their signature Gutka Sandesh.",
  },
  {
    name: "Denmark Tavern",
    special: "Heritage Dining",
    type: "Restaurant",
    desc: "Great for a colonial-style lunch by the river.",
  },
  {
    name: "Mukherjee's",
    special: "Fish Fry & Mughlai",
    type: "Bengali Cuisine",
    desc: "A local favorite for authentic Bengali snacks and meals.",
  },
];

export default function TravelGuidePage() {
  const [activeVenue, setActiveVenue] = useState<string>("wedding");

  const venueData: any = {
    wedding: {
      name: "Anandamayee Bhawan",
      location: "Serampore",
      address: "54A, G.T. Road, Serampore, W.B.",
      transport: [
        {
          name: "Serampore Station",
          details:
            "3 mins by Auto/Toto from the station. Located on the main G.T. Road.",
          icon: "🚆",
        },
        {
          name: "Parking",
          details:
            "Limited parking available near the banquet hall. We recommend using local transport.",
          icon: "🅿️",
        },
        {
          name: "Landmark",
          details: "Near Belting Bazar / Serampore Court area.",
          icon: "📍",
        },
      ],
      stay: stayOptions.filter((s) => s.name !== "The Peerless Inn"),
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.3779465759876!2d88.33077587399126!3d22.75135112639763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89b287ddfb39b%3A0xc67348083f7cea9d!2sAnandamayee%20Bhawan!5e0!3m2!1sen!2sin!4v1765848206729!5m2!1sen!2sin",
    },
    reception: {
      name: "Friends Union Club",
      location: "Konnagar",
      address: "Gangadhar Chatterjee Bhaban, Konnagar, W.B.",
      transport: [
        {
          name: "Konnagar Station",
          details: "5-7 mins by Toto from Konnagar station (East side).",
          icon: "🚆",
        },
        {
          name: "By Road",
          details:
            "Accessible via G.T. Road. Look for the Friends Union Club signage.",
          icon: "🚗",
        },
        {
          name: "Landmark",
          details: "Near Konnagar Ferry Ghat / G.T. Road junction.",
          icon: "📍",
        },
      ],
      stay: [
        stayOptions[2],
        {
          name: "Konnagar Guest Houses",
          distance: "Local",
          type: "Budget",
          desc: "Basic local stays available nearby.",
        },
      ],
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.8284397695707!2d88.35295167398938!3d22.697429628386114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89c85a91d38fd%3A0x19dcd2c61895f79f!2sKonnagar%20Friends%20Union%20Club%20Community%20Centre%2FGangadhar%20Chatterjee%20Bhaban!5e0!3m2!1sen!2sin!4v1765848530552!5m2!1sen!2sin",
    },
  };

  const renderTransport = () => (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 py-4 px-1">
      {venueData[activeVenue].transport.map((hub: any, i: number) => (
        <Card
          key={i}
          className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-default-100 dark:border-default-800 p-5 md:p-6 shadow-sm"
        >
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">{hub.icon}</div>
          <h3 className="text-lg md:text-xl font-bold text-default-900 dark:text-white mb-2">
            {hub.name}
          </h3>
          <p className="text-default-500 text-xs md:text-sm leading-relaxed">
            {hub.details}
          </p>
        </Card>
      ))}
    </div>
  );

  const renderStay = () => (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 py-4 px-1">
      {venueData[activeVenue].stay.map((stay: any, i: number) => (
        <Card
          key={i}
          className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-wedding-gold-200/50 dark:border-wedding-gold-800/50 p-5 md:p-6 shadow-md hover:border-wedding-pink-400 transition-colors"
        >
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <span className="bg-wedding-gold-100 dark:bg-wedding-gold-900/30 text-wedding-gold-700 text-[8px] md:text-[10px] px-2 py-1 rounded-full font-black uppercase">
              {stay.type}
            </span>
            <span className="text-[8px] md:text-[10px] text-default-400 font-mono italic">
              {stay.distance}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-default-900 dark:text-white mb-2">
            {stay.name}
          </h3>
          <p className="text-xs md:text-sm text-default-500 mb-4 md:mb-6 flex-grow">
            {stay.desc}
          </p>
          {stay.href && (
            <Button
              isExternal
              as={Link}
              className="w-full font-bold"
              color="danger"
              href={stay.href}
              size="sm"
              variant="flat"
            >
              Book Now
            </Button>
          )}
        </Card>
      ))}
    </div>
  );

  const renderExplore = () => (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 py-4 px-1">
      {highlights.map((item, i) => (
        <Card
          key={i}
          className="h-full border-none shadow-xl overflow-hidden group"
        >
          <div className="relative h-40 md:h-48 overflow-hidden">
            <Image
              removeWrapper
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={item.img}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="absolute bottom-3 left-3 text-white font-bold text-lg">
              {item.title}
            </h3>
          </div>
          <CardBody className="p-4 bg-white dark:bg-zinc-900">
            <p className="text-default-500 text-xs md:text-sm italic leading-relaxed">
              {item.desc}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const renderFood = () => (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8 py-4 px-1">
      {foodSpots.map((spot, i) => (
        <Card
          key={i}
          className="bg-wedding-pink-50/30 dark:bg-wedding-pink-900/10 border-2 border-dashed border-wedding-pink-200 p-5 md:p-6"
        >
          <span className="text-[8px] md:text-[9px] font-black bg-wedding-pink-500 text-white px-2 py-0.5 rounded-full w-fit mb-2 md:mb-3">
            {spot.type}
          </span>
          <h3 className="text-lg md:text-xl font-bold text-wedding-pink-700 dark:text-wedding-pink-300 mb-1">
            {spot.name}
          </h3>
          <p className="text-[10px] md:text-xs font-bold text-wedding-gold-600 mb-2 md:mb-3 underline decoration-wedding-gold-200">
            Try: {spot.special}
          </p>
          <p className="text-default-500 text-xs md:text-sm leading-relaxed">
            {spot.desc}
          </p>
        </Card>
      ))}
    </div>
  );

  const renderTips = () => (
    <div className="space-y-10 py-4 px-1">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-10">
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-blue-100 dark:border-blue-800">
            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2 text-sm md:text-base">
              ❄️ Winter in Bengal
            </h4>
            <p className="text-xs md:text-sm text-default-600 dark:text-gray-300 leading-relaxed">
              January is the peak of winter. Temperatures can drop to 12°C at
              night.
              <strong> We recommend packing light woolens</strong> for the
              evening ceremonies.
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-amber-100 dark:border-amber-800">
            <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2 text-sm md:text-base">
              🛺 Auto Estimates
            </h4>
            <ul className="text-xs md:text-sm text-default-600 dark:text-gray-300 space-y-1">
              <li>• Station to Venue (Reserved): ₹40 - ₹60</li>
              <li>• Station to Venue (Shared): ₹10 - ₹15</li>
            </ul>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-default-200">
          <h4 className="font-bold text-default-800 dark:text-white mb-4 flex items-center gap-2 text-sm md:text-base">
            🗣️ Bengali 101
          </h4>
          <div className="space-y-3 md:space-y-4">
            {[
              { en: "Hello/Greetings", bn: "Nomoshkar" },
              { en: "Thank You", bn: "Dhanyabaad" },
              { en: "How are you?", bn: "Kemon achen?" },
              { en: "Very Good", bn: "Khub bhalo" },
            ].map((p, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-default-100 pb-2 last:border-none"
              >
                <span className="text-xs md:text-sm text-default-500">
                  {p.en}
                </span>
                <span
                  className={`${fontSans.className} font-bold text-wedding-pink-600 text-sm md:text-base`}
                >
                  {p.bn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider className="my-8 md:my-10 opacity-50" />

      {/* History, Legal & Bengal Context Section */}
      <motion.div
        className="bg-wedding-gold-50/50 dark:bg-wedding-gold-900/10 p-6 md:p-12 rounded-[32px] md:rounded-[40px] border border-wedding-gold-200/50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-2">
            <h3
              className={`${fontSans.className} text-2xl md:text-3xl font-black text-default-800 dark:text-white uppercase tracking-tight leading-tight`}
            >
              Our Union: A Secular & Social Milestone
            </h3>
            <p className="text-wedding-pink-600 dark:text-wedding-pink-400 font-mono text-[9px] md:text-xs uppercase tracking-widest font-bold">
              United under the Special Marriage Act, 1954
            </p>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10 text-xs md:text-sm leading-relaxed text-default-600 dark:text-gray-300">
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-bold text-default-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                <span className="text-xl">⚖️</span> Legal Equality
              </h4>
              <p>
                Our marriage is solemnized under{" "}
                <strong>Section 13 of Act XLIII of 1954</strong>. In a country
                where marriage is often tied to religious conversion, the
                Special Marriage Act (SMA) provides a truly secular alternative.
                It allows individuals from different religious backgrounds—like
                ours—to unite as equal partners under the law,{" "}
                <strong>
                  without the need for conversion or the renunciation of
                  one&apos;s own faith.
                </strong>
              </p>
              <p>
                This legal framework ensures that our 10-year journey of love is
                recognized by the state as a civil union, prioritizing mutual
                consent and individual rights above all else.
              </p>
            </div>
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-bold text-default-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                <span className="text-xl">🌾</span> The Bengal Legacy
              </h4>
              <p>
                West Bengal has long been a beacon of progressive thought and
                communal harmony in India. In the land of{" "}
                <strong>Rabindranath Tagore and Kazi Nazrul Islam</strong>, our
                union finds its natural home. Bengal&apos;s rich history of
                syncretism—often called the <em>Ganga-Jamuni Tehzeeb</em>
                —celebrates the beauty of diverse cultures coexisting.
              </p>
              <p>
                A profound detail of our marriage is the role of our fathers—
                <strong>Hasir Mallick</strong> and{" "}
                <strong>Subhasis Saha</strong>—who stood together as legal
                witnesses. Their presence and signatures represent more than
                just a formality; they symbolize the inclusive and secular
                spirit of our families, proving that love and respect transcend
                all religious boundaries.
              </p>
            </div>
          </div>
          <div className="pt-4 md:pt-6 border-t border-wedding-gold-200/30 text-center">
            <p className="text-[10px] md:text-xs italic text-default-400">
              &quot;Our union is a small part of a larger story—one where modern
              India embraces love as the ultimate bridge between different
              worlds.&quot;
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-6 md:pt-10 px-4 max-w-full overflow-x-hidden">
      {/* Header */}
      <section className="text-center mb-10 md:mb-16 space-y-4 max-w-full">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="bg-wedding-pink-50 dark:bg-wedding-pink-900/20 w-fit px-4 py-1 rounded-full mx-auto mb-2 border border-wedding-pink-200"
          initial={{ opacity: 0, scale: 0.9 }}
        >
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-wedding-pink-600 dark:text-wedding-pink-400">
            Visitor&apos;s Companion
          </span>
        </motion.div>
        <h1
          className={`${fontCursive.className} text-5xl md:text-8xl text-wedding-pink-600 dark:text-wedding-pink-400 py-2 leading-tight`}
        >
          Travel Guide
        </h1>
      </section>

      {/* Venue Selector - High Level */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex flex-col items-center mb-6 text-center space-y-2">
          <h2
            className={`${fontSans.className} text-xl md:text-2xl font-black text-default-800 dark:text-white uppercase tracking-tight`}
          >
            Which event are you attending?
          </h2>
          <p className="text-xs text-default-400 italic">
            Information will update based on your selection
          </p>
        </div>
        <Tabs
          fullWidth
          aria-label="Venue Selector"
          classNames={{
            tabList:
              "p-1 rounded-xl bg-default-100 dark:bg-zinc-900 border border-default-200 dark:border-zinc-800 shadow-sm",
            cursor: "bg-white dark:bg-zinc-800 shadow-md rounded-lg",
            tab: "h-12",
            tabContent:
              "font-bold text-default-600 group-data-[selected=true]:text-wedding-pink-600",
          }}
          color="danger"
          selectedKey={activeVenue}
          variant="solid"
          onSelectionChange={(key) => setActiveVenue(key as string)}
        >
          <Tab key="wedding" title="Wedding Ceremony" />
          <Tab key="reception" title="Reception Party" />
        </Tabs>
      </div>

      <motion.div
        key={activeVenue}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-16"
        initial={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.4 }}
      >
        {/* Map Section Integrated */}
        <section className="px-2 md:px-0">
          <Card className="w-full h-[350px] md:h-[500px] border-none shadow-2xl rounded-[32px] md:rounded-[40px] overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-wedding-gold-200 flex items-center gap-2">
              <MapPinIcon className="text-wedding-pink-500" size={16} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-wedding-gold-600 leading-none mb-1">
                  Destination
                </span>
                <span className="text-xs font-bold text-default-800 dark:text-white leading-none">
                  {venueData[activeVenue].name}
                </span>
              </div>
            </div>
            <iframe
              allowFullScreen
              className="w-full h-full border-none"
              loading="lazy"
              src={venueData[activeVenue].map}
              title={`${venueData[activeVenue].name} Location Map`}
            />
          </Card>
        </section>

        {/* Dynamic Content: Tabs for Desktop, Accordion for Mobile */}
        <div className="hidden md:block">
          <Tabs
            fullWidth
            aria-label="Guide Categories"
            classNames={{
              tabList:
                "gap-8 w-full relative rounded-none p-0 border-b border-divider mb-12",
              cursor: "w-full bg-wedding-pink-500",
              tab: "px-0 h-12",
              tabContent:
                "group-data-[selected=true]:text-wedding-pink-500 font-bold text-lg",
            }}
            color="danger"
            variant="underlined"
          >
            <Tab key="transport" title="Travel Tips">
              {renderTransport()}
            </Tab>
            <Tab key="stay" title="Nearby Stay">
              {renderStay()}
            </Tab>
            <Tab key="explore" title="Highlights">
              {renderExplore()}
            </Tab>
            <Tab key="food" title="Food">
              {renderFood()}
            </Tab>
            <Tab key="tips" title="Other Tips">
              {renderTips()}
            </Tab>
          </Tabs>
        </div>

        <div className="md:hidden">
          <Accordion
            defaultExpandedKeys={["transport"]}
            selectionMode="multiple"
            variant="splitted"
          >
            <AccordionItem
              key="transport"
              aria-label="Travel Tips"
              title={
                <span className="font-bold text-wedding-pink-600">
                  Travel Tips
                </span>
              }
            >
              {renderTransport()}
            </AccordionItem>
            <AccordionItem
              key="stay"
              aria-label="Nearby Stay"
              title={
                <span className="font-bold text-wedding-pink-600">
                  Nearby Stay
                </span>
              }
            >
              {renderStay()}
            </AccordionItem>
            <AccordionItem
              key="explore"
              aria-label="Highlights"
              title={
                <span className="font-bold text-wedding-pink-600">
                  Highlights
                </span>
              }
            >
              {renderExplore()}
            </AccordionItem>
            <AccordionItem
              key="food"
              aria-label="Food"
              title={
                <span className="font-bold text-wedding-pink-600">Food</span>
              }
            >
              {renderFood()}
            </AccordionItem>
            <AccordionItem
              key="tips"
              aria-label="Other Tips"
              title={
                <span className="font-bold text-wedding-pink-600">
                  Other Tips
                </span>
              }
            >
              {renderTips()}
            </AccordionItem>
          </Accordion>
        </div>
      </motion.div>

      {/* Support Section */}
      <motion.div
        className="mt-20 md:mt-32 bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 p-[1px] rounded-[32px] md:rounded-[40px] shadow-2xl shadow-wedding-pink-500/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="bg-white dark:bg-zinc-950 p-8 md:p-16 rounded-[31px] md:rounded-[39px] text-center space-y-6">
          <div className="bg-wedding-pink-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPinIcon className="text-wedding-pink-500 w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h2
            className={`${fontCursive.className} text-4xl md:text-5xl text-default-900 dark:text-white`}
          >
            Need a hand with your travel?
          </h2>
          <p className="text-default-500 max-w-xl mx-auto text-sm md:text-lg leading-relaxed">
            If you need any assistance with local bookings, station pickups, or
            have special requirements, the groom is just a message away.
          </p>
          <div className="pt-4 md:pt-6 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button
              as={Link}
              className="font-bold text-white px-8 md:px-10 h-12 md:h-14"
              color="success"
              href="https://wa.me/91**********"
              radius="full"
              size="lg"
              variant="shadow"
            >
              WhatsApp Groom
            </Button>
            <Button
              as={Link}
              className="font-bold px-8 md:px-10 h-12 md:h-14"
              color="default"
              href="/"
              radius="full"
              size="lg"
              variant="flat"
            >
              Return Home
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
