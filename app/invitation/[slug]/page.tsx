"use client";

import { useEffect, useState, use } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Card,
  CardBody,
  Divider,
  Tabs,
  Tab,
  Button,
  Spinner,
  Accordion,
  AccordionItem,
  Input,
  RadioGroup,
  Radio,
  addToast,
} from "@heroui/react";
import { Link } from "@heroui/link";
import { motion, AnimatePresence } from "framer-motion";

import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import firebaseApp from "@/config/firebase";
import { MapPinIcon, CalendarIcon, ClockIcon, CheckIcon } from "@/components/icons";

export default function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState<any>(null);

  // RSVP States
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    attending: "yes",
    guests: 1,
    food: "non-veg",
    note: "",
    captcha: "",
  });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [hasEmailReminder, setHasEmailReminder] = useState(false);

  const handleRSVP = async () => {
    if (rsvpData.captcha.trim() !== "10") {
      addToast({
        title: "Security Check",
        description: "Please answer correctly (Hint: 10).",
        color: "warning",
      });

      return;
    }

    setRsvpLoading(true);
    try {
      const db = getFirestore(firebaseApp());

      await addDoc(collection(db, "rsvps"), {
        guestId: slug,
        guestName: guest.name,
        ...rsvpData,
        timestamp: serverTimestamp(),
      });
      setHasRSVPed(true);
      addToast({
        title: "RSVP Received",
        description: "Thank you for confirming!",
        color: "success",
      });
    } catch (err) {
      console.error("RSVP error", err);
      addToast({
        title: "Error",
        description: "Failed to send RSVP. Please try again.",
        color: "danger",
      });
    } finally {
      setRsvpLoading(false);
    }
  };

  const translateContent = async () => {
    if (translatedData) {
      setTranslatedData(null);

      return;
    }

    if (!guest) return;

    setIsTranslating(true);

    try {
      // Simulate network delay for effect
      await new Promise((resolve) => setTimeout(resolve, 600));

      const relationMap: Record<string, string> = {
        family: "আত্মীয়",
        friend: "বন্ধু",
        colleague: "সহকর্মী",
        other: "শুভাকাঙ্ক্ষী",
      };

      setTranslatedData({
        guestName: guest.name || "অতিথি",
        familySide: guest.familySide,
        relation: relationMap[guest.relation?.toLowerCase()] || guest.relation || "শুভাকাঙ্ক্ষী",
      });
    } catch (error) {
      console.error("Translation error:", error);
      addToast({
        title: "অনুবাদ ব্যর্থ হয়েছে",
        description: "দুঃখিত, অনুবাদ করার সময় একটি সমস্যা হয়েছে।",
        color: "danger",
      });
      setTranslatedData(null);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(firebaseApp());
        const docRef = doc(db, "invitation", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const guestData = docSnap.data();

          setGuest(guestData);

          // Check for existing email reminders
          const remindersQuery = query(
            collection(db, "email-reminders"),
            where("guestId", "==", slug),
          );
          const remindersSnap = await getDocs(remindersQuery);

          if (!remindersSnap.empty) {
            setHasEmailReminder(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const events: any = {
    registration: {
      title: translatedData ? "শুভ আংটি বদল" : "Engagement Ceremony",
      date: translatedData ? "২৩শে নভেম্বর, ২০২৫" : "23rd November 2025",
      venue: translatedData ? "শ্রীরামপুর" : "Srerampore",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229.96354422747754!2d88.34617843336005!3d22.749911773448982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89b1ee7f14647%3A0xe44dfacd65bb5f48!2sMohan%20Joyti%20Banquet%20Hall!5e0!3m2!1sen!2sin!4v1758679491438!5m2!1sen!2sin",
      mapHref: "https://maps.app.goo.gl/diSeycey1hyqqtAu8",
      time: translatedData ? "সকাল ১০:০০টা" : "10:00 AM",
      direction: translatedData ? "বটতলার কাছে" : "Near Battala",
    },
    wedding: {
      title: translatedData ? "শুভ বিবাহ" : "Wedding Ceremony",
      date: translatedData ? "২৩শে জানুয়ারি, ২০২৬" : "23rd January 2026",
      venue: translatedData ? "শ্রীরামপুর" : "Serampore",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.3779465759876!2d88.33077587399126!3d22.75135112639763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89b287ddfb39b%3A0xc67348083f7cea9d!2sAnandamayee%20Bhawan!5e0!3m2!1sen!2sin!4v1765848206729!5m2!1sen!2sin",
      mapHref: "https://maps.app.goo.gl/G5R3bkcTwwa2d54R8",
      time: translatedData ? "সন্ধ্যা ০৬:০০টা" : "06:00 PM",
      direction: translatedData ? "বেল্টিং বাজারের কাছে" : "Near Belting Bazar",
    },
    reception: {
      title: translatedData ? "প্রীতিভোজ" : "Reception Celebration",
      date: translatedData ? "২৫শে জানুয়ারি, ২০২৬" : "25th January 2026",
      venue: translatedData ? "কোন্নগর" : "Konnagar",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.8284397695707!2d88.35295167398938!3d22.697429628386114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89c85a91d38fd%3A0x19dcd2c61895f79f!2sKonnagar%20Friends%20Union%20Club%20Community%20Centre%2FGangadhar%20Chatterjee%20Bhaban!5e0!3m2!1sen!2sin!4v1765848530552!5m2!1sen!2sin",
      mapHref: "https://maps.app.goo.gl/ubdTsy6tnYMsvSSXA",
      time: translatedData ? "সন্ধ্যা ০৬:০০টা" : "06:00 PM",
      direction: translatedData ? "জি.টি. রোডের কাছে" : "Near GT Road",
    },
  };

  const renderEventDetails = (event: any) => (
    <div className="pt-4 md:pt-8 grid md:grid-cols-2 gap-6 md:gap-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Details */}
      <div className="space-y-6 bg-default-50 dark:bg-default-100/10 p-6 rounded-2xl border border-default-100 dark:border-default-700">
        <div className="flex items-start gap-4">
          <CalendarIcon className="w-6 h-6 text-wedding-pink-500 mt-1" />
          <div>
            <p className="font-bold text-default-800 dark:text-white">Date</p>
            <p className="text-default-600 dark:text-gray-300">{event.date}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <ClockIcon className="w-6 h-6 text-wedding-gold-500 mt-1" />
          <div>
            <p className="font-bold text-default-800 dark:text-white">Time</p>
            <p className="text-default-600 dark:text-gray-300">{event.time}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPinIcon className="w-6 h-6 text-indigo-500 mt-1" />
          <div>
            <p className="font-bold text-default-800 dark:text-white">Venue</p>
            <p className="text-default-600 dark:text-gray-300 font-medium">
              {event.venue}
            </p>
            <p className="text-default-500 text-sm mt-1">{event.direction}</p>
          </div>
        </div>

        <Button
          isExternal
          as={Link}
          className="w-full bg-wedding-pink-100 text-wedding-pink-700 font-semibold hover:bg-wedding-pink-200 dark:bg-wedding-pink-900/30 dark:text-wedding-pink-200 mt-4"
          href={event.mapHref}
          startContent={<MapPinIcon className="w-4 h-4" />}
        >
          Open in Google Maps
        </Button>
      </div>

      {/* Map Embed */}
      <div className="h-64 md:h-auto rounded-2xl overflow-hidden shadow-lg border border-default-200 dark:border-default-700">
        <iframe
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
          src={event.map}
          title={`${event.title} Map`}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner color="danger" size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className={`${fontCursive.className} text-4xl text-default-800`}>
          Invitation Not Found
        </h1>
        <p className="text-default-600">
          We couldn&apos;t find an invitation for this link.
        </p>
        <Button as={Link} color="primary" href="/" variant="flat">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-10 px-4 flex items-center justify-center">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-wedding-gold-200 dark:border-wedding-gold-800 shadow-2xl overflow-visible">
          {/* Header Section */}
          <div className="relative h-40 md:h-64 bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 rounded-t-xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/corner1-01.svg')] opacity-20 bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <p
                className={`${fontCursive.className} text-4xl md:text-7xl font-bold drop-shadow-md px-2`}
              >
                Groom & Bride
              </p>
              <p
                className={`${fontMono.className} mt-2 md:mt-4 text-[10px] md:text-base uppercase tracking-widest opacity-90 px-4`}
              >
                Request the honor of your presence
              </p>
            </div>
            {/* Translation Button */}
            <Button
              className="absolute bottom-2 right-2 bg-white/20 text-white backdrop-blur-md border border-white/30 text-[10px] h-7 px-2"
              isLoading={isTranslating}
              size="sm"
              variant="flat"
              onPress={translateContent}
            >
              {translatedData ? "See English" : "বাংলায় দেখুন"}
            </Button>
          </div>

          <CardBody className="px-4 py-8 md:px-12 md:py-14 text-center">
            {/* Guest Personalization */}
            <div className="mb-8 md:mb-10">
              <p
                className={`${fontCursive.className} text-3xl md:text-5xl text-wedding-pink-600 dark:text-wedding-pink-400 mb-4 md:mb-6`}
              >
                {translatedData ? "প্রিয়" : "Dear"}{" "}
                {translatedData?.guestName || guest.name}
                {guest.invitedGuests > 1 && (
                  <span className="text-xl md:text-3xl ml-2">
                    {translatedData ? "& পরিবার" : "& Family"}
                  </span>
                )}
                ,
              </p>

              <div
                className={`${fontSans.className} text-base md:text-xl text-default-700 dark:text-gray-200 leading-relaxed space-y-4 md:space-y-6 max-w-2xl mx-auto`}
              >
                <p>
                  {translatedData ? (
                    <>
                      {translatedData.welcomeNote ||
                        `${translatedData.familySide === "bride" ? "কনে" : "বর"}-র পক্ষ থেকে একজন প্রিয় ${translatedData.relation} হিসেবে আপনার উপস্থিতি আমাদের কাছে অনেক গুরুত্বপূর্ণ।`}
                    </>
                  ) : (
                    <>
                      As a cherished {guest.relation.toLowerCase()} from the{" "}
                      <span className="font-semibold text-wedding-gold-600 dark:text-wedding-gold-400">
                        {guest.familySide === "bride" ? "Bride's" : "Groom's"}
                      </span>{" "}
                      side, your presence would mean the world to us as we begin
                      this beautiful new chapter.
                    </>
                  )}
                </p>
                <p>
                  {translatedData
                    ? "আমরা আপনাকে নিম্নলিখিত অনুষ্ঠানে যোগ দেওয়ার জন্য সাদর আমন্ত্রণ জানাচ্ছি:"
                    : `We warmly invite you to join us for the following celebration${guest.invitedFor.length > 1 ? "s" : ""}:`}
                </p>
              </div>
            </div>

            {/* Event Tabs / Accordion */}
            <div className="w-full">
              {/* Desktop Tabs */}
              <div className="hidden md:block">
                <Tabs
                  aria-label="Wedding Events"
                  classNames={{
                    tabList:
                      "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-wedding-pink-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent:
                      "group-data-[selected=true]:text-wedding-pink-500 font-medium text-lg",
                  }}
                  color="danger"
                  variant="underlined"
                >
                  {guest.invitedFor.map((eventKey: string) => (
                    <Tab key={eventKey} title={events[eventKey].title}>
                      {renderEventDetails(events[eventKey])}
                    </Tab>
                  ))}
                </Tabs>
              </div>

              {/* Mobile Accordion */}
              <div className="md:hidden text-left">
                <Accordion
                  className="px-0"
                  defaultExpandedKeys={guest.invitedFor}
                  selectionMode="multiple"
                  variant="splitted"
                >
                  {guest.invitedFor.map((eventKey: string) => (
                    <AccordionItem
                      key={eventKey}
                      aria-label={events[eventKey].title}
                      className="bg-default-50 dark:bg-default-100/5 border border-default-100 dark:border-default-800 rounded-xl shadow-sm mb-4"
                      title={
                        <span className="font-bold text-wedding-pink-600 dark:text-wedding-pink-400">
                          {events[eventKey].title}
                        </span>
                      }
                    >
                      {renderEventDetails(events[eventKey])}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <Divider className="my-10 opacity-50" />

            {/* RSVP Section */}
            <div className="mb-10 px-0 md:px-10">
              <AnimatePresence mode="wait">
                {hasRSVPed ? (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 p-6 md:p-8 rounded-3xl border border-green-100 dark:border-green-800/30 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                  >
                    <p
                      className={`${fontCursive.className} text-2xl md:text-3xl text-green-600 dark:text-green-400 mb-2`}
                    >
                      Thank You!
                    </p>
                    <p className="text-sm md:text-green-700 dark:text-green-300 font-medium">
                      We have received your RSVP and can&apos;t wait to see you.
                    </p>
                  </motion.div>
                ) : !showRSVP ? (
                  <Button
                    className="bg-wedding-pink-500 text-white font-bold h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-full shadow-lg shadow-wedding-pink-500/30 w-full md:w-auto"
                    onPress={() => setShowRSVP(true)}
                  >
                    RSVP / Confirm Attendance
                  </Button>
                ) : (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 md:space-y-8 text-left bg-default-50 dark:bg-zinc-900/50 p-5 md:p-10 rounded-[24px] md:rounded-[32px] border border-default-200 dark:border-default-800"
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3
                        className={`${fontSans.className} text-xl md:text-2xl font-bold text-default-800 dark:text-white`}
                      >
                        RSVP Details
                      </h3>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setShowRSVP(false)}
                      >
                        ✕
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      <RadioGroup
                        classNames={{
                          label:
                            "text-wedding-pink-600 font-bold mb-1 text-sm md:text-base",
                        }}
                        label="Will you attend?"
                        value={rsvpData.attending}
                        onValueChange={(val) =>
                          setRsvpData({ ...rsvpData, attending: val })
                        }
                      >
                        <Radio classNames={{ label: "text-sm" }} value="yes">
                          Yes, I&apos;ll be there!
                        </Radio>
                        <Radio classNames={{ label: "text-sm" }} value="no">
                          Sorry, I can&apos;t make it
                        </Radio>
                      </RadioGroup>

                      {rsvpData.attending === "yes" && (
                        <RadioGroup
                          classNames={{
                            label:
                              "text-wedding-pink-600 font-bold mb-1 text-sm md:text-base",
                          }}
                          label="Food Preference"
                          value={rsvpData.food}
                          onValueChange={(val) =>
                            setRsvpData({ ...rsvpData, food: val })
                          }
                        >
                          <Radio
                            classNames={{ label: "text-sm" }}
                            value="non-veg"
                          >
                            Non-Vegetarian
                          </Radio>
                          <Radio classNames={{ label: "text-sm" }} value="veg">
                            Vegetarian
                          </Radio>
                        </RadioGroup>
                      )}
                    </div>

                    <div className="space-y-5 md:space-y-6">
                      <Input
                        classNames={{
                          label:
                            "text-wedding-pink-600 font-bold text-xs md:text-sm",
                          inputWrapper: "border-wedding-pink-100",
                          input: "outline-none text-sm",
                        }}
                        label="Number of Guests"
                        labelPlacement="outside-top"
                        type="number"
                        value={String(rsvpData.guests)}
                        variant="bordered"
                        onChange={(e) =>
                          setRsvpData({
                            ...rsvpData,
                            guests: Number(e.target.value),
                          })
                        }
                      />
                      <Input
                        classNames={{
                          label:
                            "text-wedding-pink-600 font-bold text-xs md:text-sm",
                          inputWrapper: "border-wedding-pink-100",
                          input: "outline-none text-sm",
                        }}
                        label="Special Note / Allergies"
                        labelPlacement="outside-top"
                        value={rsvpData.note}
                        variant="bordered"
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, note: e.target.value })
                        }
                      />

                      <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/10 rounded-xl border border-wedding-pink-100 dark:border-wedding-pink-800/30">
                        <p className="text-[9px] font-black text-wedding-pink-600 uppercase tracking-widest mb-1">
                          Bot Protection
                        </p>
                        <Input
                          isRequired
                          classNames={{
                            label: "text-[10px] md:text-xs",
                            input: "font-bold outline-none",
                          }}
                          label="How many years have we been together?"
                          labelPlacement="outside-top"
                          placeholder="Answer in numbers"
                          value={rsvpData.captcha}
                          variant="underlined"
                          onChange={(e) =>
                            setRsvpData({
                              ...rsvpData,
                              captcha: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 text-white font-black h-12 md:h-14 text-base md:text-lg rounded-full"
                        isLoading={rsvpLoading}
                        onPress={handleRSVP}
                      >
                        Confirm RSVP
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Divider className="my-8 md:my-10 opacity-50" />

            {/* Email Reminder Section */}
            <div className="mb-10 px-0 md:px-10">
              <div className="bg-default-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-default-200 dark:border-default-800">
                <h3 className={`${fontSans.className} text-xl font-bold text-default-800 dark:text-white mb-4`}>
                  Get Event Reminders
                </h3>
                {hasEmailReminder && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-center justify-center gap-2">
                    <CheckIcon className="w-4 h-4 text-blue-500" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      Email reminder already set for your invitation.
                    </p>
                  </div>
                )}
                <p className="text-default-600 dark:text-gray-400 text-sm mb-6">
                  Leave your email to receive a reminder before the event starts.
                </p>
                <form
                  action={async (formData) => {
                    const { sendEmailReminder } = await import("../actions");

                    formData.append("slug", slug);
                    await sendEmailReminder(formData);
                    setHasEmailReminder(true);
                    addToast({
                      title: "Reminder Set",
                      description: "We will notify you before the event!",
                      color: "success",
                    });
                  }}
                  className="flex flex-col sm:flex-row gap-4 items-end"
                >
                  <Input
                    isRequired
                    className="flex-1"
                    classNames={{
                      input: "outline-none",
                      inputWrapper: "bg-white dark:bg-zinc-900",
                    }}
                    name="email"
                    placeholder="john@example.com"
                    type="email"
                    aria-label="Email Address"
                  />
                  <Button
                    className="w-full sm:w-auto bg-wedding-pink-500 text-white font-semibold shadow-md"
                    type="submit"
                  >
                    Notify Me
                  </Button>
                </form>
              </div>
            </div>

            <Divider className="my-8 md:my-10 opacity-50" />
            <div className="space-y-6">
              <p
                className={`${fontCursive.className} text-3xl md:text-4xl text-default-800 dark:text-white`}
              >
                With Love & Anticipation,
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <Button
                  as={Link}
                  className="bg-wedding-gold-500 text-white shadow-lg hover:bg-wedding-gold-600 font-semibold w-full sm:w-auto"
                  href="/couple"
                  size="lg"
                >
                  Meet the Couple
                </Button>
                <Button
                  as={Link}
                  className="bg-wedding-pink-500 text-white shadow-lg hover:bg-wedding-pink-600 font-semibold w-full sm:w-auto"
                  href="/game"
                  size="lg"
                >
                  Play Couple Quiz
                </Button>
                <Button
                  as={Link}
                  className="border-wedding-pink-500 text-wedding-pink-500 hover:bg-wedding-pink-50 dark:hover:bg-wedding-pink-900/20 font-semibold w-full sm:w-auto"
                  href="/sagun"
                  size="lg"
                  variant="bordered"
                >
                  Send Wishes
                </Button>
              </div>
            </div>

            {/* Discreet Registry Link */}
            <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <Link
                href={`/registry/${slug}`}
                className={`${fontMono.className} text-[10px] uppercase tracking-[0.2em] text-wedding-pink-600 dark:text-wedding-pink-400 font-bold`}
              >
                Building our home together • Gift Registry
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
