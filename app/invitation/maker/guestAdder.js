"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import { fontSans, fontMono } from "@/config/fonts";

const defaultForm = {
  name: "",
  contact: "",
  familySide: "",
  relation: "",
  invitedFor: [],
  invitedGuests: "1",
  rsvpStatus: "pending",
  notes: "",
};

export default function AddGuestModal({
  isOpen,
  onClose,
  onAdd, // only onAdd, no onUpdate
  existingGuest,
}) {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (existingGuest) {
      setFormData(existingGuest);
    } else {
      setFormData(defaultForm);
    }
  }, [existingGuest]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleCheckboxChange = (key, values) => {
    setFormData({ ...formData, [key]: values });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData); // always call onAdd for both add & update
    onClose();
    setFormData(defaultForm);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent className="max-w-lg w-full">
        {(close) => (
          <form
            onSubmit={(e) => {
              handleSubmit(e);
              close();
            }}
            className={`${fontSans.className} border-none outline-none`}
          >
            <ModalHeader className="text-2xl">
              {existingGuest ? "Update Guest" : "Add New Guest"}
            </ModalHeader>
            <ModalBody>
              <Input
                isRequired
                label="Guest Name"
                placeholder="Enter guest name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="bordered"
                labelPlacement="outside-top"
                size="lg"
                classNames={{
                  input: "outline-none",
                }}
              />
              <Input
                label="Contact Info"
                placeholder="Enter phone or email"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                variant="bordered"
                size="lg"
                labelPlacement="outside-top"
                classNames={{
                  input: "outline-none",
                }}
              />

              <RadioGroup
                isRequired
                label="Family Side"
                orientation="horizontal"
                classNames={{ wrapper: "flex-wrap gap-4" }}
                value={formData.familySide}
                onValueChange={(val) => handleRadioChange("familySide", val)}
              >
                <Radio value="bride">Bride&apos;s Side</Radio>
                <Radio value="groom">Groom&apos;s Side</Radio>
              </RadioGroup>

              <RadioGroup
                isRequired
                label="Relation to Couple"
                orientation="horizontal"
                classNames={{ wrapper: "flex-wrap gap-4" }}
                value={formData.relation}
                onValueChange={(val) => handleRadioChange("relation", val)}
              >
                <Radio value="family">Family</Radio>
                <Radio value="colleague">Colleague</Radio>
                <Radio value="friend">Friend</Radio>
                <Radio value="other">Other</Radio>
              </RadioGroup>

              <CheckboxGroup
                label="Invited For"
                orientation="horizontal"
                classNames={{ wrapper: "flex-wrap gap-4" }}
                value={formData.invitedFor}
                onValueChange={(val) => handleCheckboxChange("invitedFor", val)}
                isRequired
              >
                <Checkbox value="registration">Registration</Checkbox>
                <Checkbox value="wedding">Wedding</Checkbox>
                <Checkbox value="reception">Reception</Checkbox>
              </CheckboxGroup>

              <Input
                type="number"
                label="Total Guests"
                labelPlacement="outside-top"
                placeholder="1"
                name="invitedGuests"
                min={1}
                value={formData.invitedGuests}
                onChange={handleChange}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "outline-none",
                }}
              />

              <RadioGroup
                label="RSVP Status"
                orientation="horizontal"
                classNames={{ wrapper: "flex-wrap gap-4" }}
                value={formData.rsvpStatus}
                onValueChange={(val) => handleRadioChange("rsvpStatus", val)}
              >
                <Radio value="pending">Pending</Radio>
                <Radio value="accepted">Accepted</Radio>
                <Radio value="declined">Declined</Radio>
                <Radio value="maybe">Maybe</Radio>
              </RadioGroup>

              <Textarea
                label="Notes (Optional)"
                placeholder="Enter any special notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "outline-none",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {existingGuest ? "Update Guest" : "Save Guest"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
