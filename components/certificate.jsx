"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Link,
} from "@heroui/react";

const certificateData = {
  documentHeader: {
    government: "Government of State",
    department: "Law Department",
    office: "Office of the Registrar General of Marriages",
    certificateTitle: "Certificate of Marriage",
    legalAct: "Under Section 13 of Act XLIII of 1954",
    certificateNumber: "XX********************-2025-******",
    issueDate: "01-01-2026",
    declarationText:
      "The following is the extract of SOLEMNISATION OF MARRIAGE between the parties who made declaration u/s 11 of the Act.",
  },
  parties: {
    groom: {
      name: "Groom Name",
      fatherName: "Father Name",
      motherName: "Mother Name",
      dateOfBirth: "DD-MM-YYYY",
      aadhaarNo: "********0000",
      presentAddress:
        "SAMPLE ADDRESS, CITY, DIST, STATE, INDIA, PIN-000000",
      permanentAddress:
        "SAMPLE ADDRESS, CITY, DIST, STATE, INDIA, PIN-000000",
      signatureDate: "DD-MM-YY",
    },
    bride: {
      name: "Bride Name",
      fatherName: "Father Name",
      motherName: "Mother Name",
      dateOfBirth: "DD-MM-YYYY",
      aadhaarNo: "********0000",
      presentAddress:
        "SAMPLE ADDRESS, CITY, DIST, STATE, INDIA, PIN-000000",
      permanentAddress:
        "SAMPLE ADDRESS, CITY, DIST, STATE, INDIA, PIN-000000",
      signatureDate: "DD-MM-YY",
    },
  },
  solemnizationDetails: {
    date: "DD-MM-YYYY",
    actualPlace:
      "SAMPLE VENUE NAME, ADDRESS, CITY, STATE, PIN-000000",
    noticeDetails: {
      serialNumber: "2025-******",
      date: "DD-MM-YYYY",
      section: "U/S-5",
    },
  },
  marriageOfficer: {
    name: "Officer Name",
    id: "XX********************",
    officeAddress:
      "SAMPLE OFFICE ADDRESS, CITY, STATE, PIN-000000",
    contact: {
      phone: "**********",
      email: "**********@example.com",
    },
  },
  witnesses: [
    {
      name: "Witness 1",
      relationshipDetails: "S/O Sample Name",
      address: "Sample Address, City, Pin-000000",
      signatureDate: "DD-MM-YYYY",
    },
    {
      name: "Witness 2",
      relationshipDetails: "S/O Sample Name",
      address: "Sample Address, City, Pin-000000",
      signatureDate: "DD-MM-YYYY",
    },
    {
      name: "Witness 3",
      relationshipDetails: "W/O Sample Name",
      address: "Sample Address, City, Pin-000000",
      signatureDate: "DD-MM-YYYY",
    },
  ],
  verificationAndAuthority: {
    issueStatement:
      "Issued under Seal of Authority on this day.",
    verificationStatement:
      "All the LTIs and Signatures are captured infront of me and those are duly verified by me.",
    systemNote: "System generated certificate & does not require signature.",
    contactEmails: ["support@example.gov"],
    verificationLink: "#",
  },
};

export default function CertificatePage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-black/80 font-sans print:shadow-none print:border-none">
          {/* Verification Badge */}
          <div className="relative md:absolute md:top-4 md:right-4 mx-auto md:mx-0 mt-6 md:mt-0 w-fit bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full shadow-lg border border-blue-200/50 flex items-center gap-2 z-10 print:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>

            <span className="text-xs font-bold text-blue-600 dark:text-blue-300 tracking-wide">
              VERIFIED
            </span>
          </div>

          <CardBody className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase">
                {certificateData.documentHeader.government}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-800 dark:text-gray-200 mt-2">
                {certificateData.documentHeader.certificateTitle}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {certificateData.documentHeader.legalAct}
              </p>
              <p className="text-xs text-gray-400 mt-4 italic max-w-2xl mx-auto border-t border-b border-gray-100 dark:border-gray-800 py-2">
                "{certificateData.documentHeader.declarationText}"
              </p>
            </div>

            {/* Parties */}
            <div className="grid md:grid-cols-2 gap-8 my-8 border-t border-b border-gray-100 dark:border-gray-800 py-8">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">
                  Groom
                </p>
                <h2 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-200 break-words">
                  {certificateData.parties.groom.name}
                </h2>
                <div className="text-xs text-gray-500/80 mt-2 space-y-1">
                  <p>S/O {certificateData.parties.groom.fatherName}</p>
                  <p>& {certificateData.parties.groom.motherName}</p>
                  <p>Born: {certificateData.parties.groom.dateOfBirth}</p>
                  <p>Aadhaar: {certificateData.parties.groom.aadhaarNo}</p>
                </div>
                <p className="text-xs text-gray-500/80 mt-2">
                  <strong className="font-semibold">Address:</strong>{" "}
                  {certificateData.parties.groom.presentAddress}
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">
                  Bride
                </p>
                <h2 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-200 break-words">
                  {certificateData.parties.bride.name}
                </h2>
                <div className="text-xs text-gray-500/80 mt-2 space-y-1">
                  <p>D/O {certificateData.parties.bride.fatherName}</p>
                  <p>& {certificateData.parties.bride.motherName}</p>
                  <p>Born: {certificateData.parties.bride.dateOfBirth}</p>
                  <p>Aadhaar: {certificateData.parties.bride.aadhaarNo}</p>
                </div>
                <p className="text-xs text-gray-500/80 mt-2">
                  <strong className="font-semibold">Address:</strong>{" "}
                  {certificateData.parties.bride.presentAddress}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-3 gap-8 text-sm text-default-600 dark:text-default-300">
              {/* Solemnization Details */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-wider uppercase">
                  Solemnization
                </h3>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">Date:</strong>{" "}
                  {certificateData.solemnizationDetails.date}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">Place:</strong>{" "}
                  {certificateData.solemnizationDetails.actualPlace}
                </p>
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Notice Details</p>
                  <p className="text-xs">No: {certificateData.solemnizationDetails.noticeDetails.serialNumber}</p>
                  <p className="text-xs">Date: {certificateData.solemnizationDetails.noticeDetails.date}</p>
                  <p className="text-xs">Sec: {certificateData.solemnizationDetails.noticeDetails.section}</p>
                </div>

                <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-wider uppercase mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  Marriage Officer
                </h3>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">Name:</strong> {certificateData.marriageOfficer.name}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">ID:</strong> {certificateData.marriageOfficer.id}
                </p>
                <p className="text-xs text-gray-600 dark:text-default-400 mt-1">
                  {certificateData.marriageOfficer.officeAddress}
                </p>
                <div className="mt-1 text-xs text-gray-500 dark:text-default-500">
                  <p>Ph: {certificateData.marriageOfficer.contact.phone}</p>
                  <p>Email: {certificateData.marriageOfficer.contact.email}</p>
                </div>
              </div>

              {/* Witnesses */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 tracking-wider uppercase border-b border-gray-100 dark:border-gray-800 pb-2">
                  Witnesses
                </h3>
                <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
                  {certificateData.witnesses.map((witness, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-bold text-gray-800 dark:text-gray-100">
                        {witness.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-default-500 italic">
                        {witness.relationshipDetails}
                      </p>
                      <p className="text-[10px] leading-relaxed text-gray-600 dark:text-default-400">
                        {witness.address}
                      </p>
                      <p className="text-[10px] font-mono text-blue-500/70 dark:text-blue-400/80">
                        Signed: {witness.signatureDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>

          <Divider className="my-0" />

          <CardFooter className="bg-gray-50 dark:bg-black/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs print:hidden">
            <div className="text-center md:text-left">
              <p className="font-mono text-gray-500/80">
                {certificateData.documentHeader.certificateNumber}
              </p>
              <p className="text-gray-500 mt-1">
                {certificateData.verificationAndAuthority.issueStatement}
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                as={Link}
                href={certificateData.verificationAndAuthority.verificationLink}
                isExternal
                size="sm"
                color="primary"
                variant="flat"
              >
                Verify Certificate
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}