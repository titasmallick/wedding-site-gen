"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Avatar,
  ScrollShadow,
  Badge,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import { HeartFilledIcon } from "./icons";

import { fontCursive } from "@/config/fonts";

interface Message {
  role: "user" | "bot";
  text: string;
}

const ConciergeBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Namaste! I am your Wedding Concierge. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) throw new Error("API Key missing");

      const systemInstruction = `
        You are an elegant and helpful Wedding Concierge for a wedding celebration. 
        Your tone is warm, respectful, and slightly formal (Indian hospitality style).
        
        Key Info:
        - Couple: Groom & Bride (married after 10 years of love).
        - Engagement: 23rd Nov 2025 at Venue Name (10:00 AM).
        - Wedding: 23rd Jan 2026 at Venue Name (06:00 PM).
        - Reception: 25th Jan 2026 at Venue Name (06:00 PM).
        - Story: They were college classmates who became soulmates. They love the mountains.
        
        Instructions:
        - Keep answers concise and polite.
        - If you don't know something, suggest they check the specific pages on the site.
        - Use "Namaste" or "Greetings" occasionally.
        - IMPORTANT: Provide responses in PLAIN TEXT ONLY. Do not use Markdown, bolding (**), or any other special formatting symbols.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: systemInstruction }] },
              ...messages.map((m) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.text }],
              })),
              { role: "user", parts: [{ text: userMsg }] },
            ],
            generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        console.error("Gemini API Error Detail:", data.error);
        throw new Error(data.error.message);
      }

      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, I'm having trouble connecting. Please try again soon!";

      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    } catch (error: any) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `I'm having a small technical issue: ${error.message || "Please try again later."}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end max-w-full">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-3 w-[calc(100vw-32px)] sm:w-[350px] md:w-[380px] shadow-2xl overflow-hidden"
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <Card className="border-none bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl h-[400px] md:h-[500px] max-h-[70vh] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="bg-white/20"
                    size="sm"
                    src="/love-birds.png"
                  />
                  <div>
                    <p
                      className={`${fontCursive.className} text-xl leading-none`}
                    >
                      Wedding Assistant
                    </p>
                    <p className="text-[10px] uppercase tracking-widest opacity-80">
                      Online & Ready
                    </p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  className="text-white min-w-0"
                  size="sm"
                  variant="light"
                  onPress={() => setIsOpen(false)}
                >
                  ✕
                </Button>
              </CardHeader>

              <CardBody className="p-0">
                <ScrollShadow ref={scrollRef} className="h-full p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? "bg-wedding-pink-500 text-white rounded-tr-none"
                            : "bg-default-100 dark:bg-zinc-800 text-default-800 dark:text-zinc-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-default-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-default-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </span>
                      </div>
                    </div>
                  )}
                </ScrollShadow>
              </CardBody>

              <CardFooter className="p-4 pt-2">
                <form
                  className="flex w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Input
                    className="flex-1"
                    classNames={{
                      inputWrapper:
                        "border-wedding-pink-100 focus-within:!border-wedding-pink-500",
                      input: "outline-none",
                    }}
                    placeholder="Ask me anything..."
                    size="sm"
                    value={input}
                    variant="bordered"
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    isIconOnly
                    className="bg-wedding-pink-500"
                    color="danger"
                    size="sm"
                    onPress={handleSend}
                  >
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      width="16"
                    >
                      <line x1="22" x2="11" y1="2" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        isIconOnly
        className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-wedding-pink-500 to-wedding-gold-500 shadow-wedding-pink-500/30 shadow-2xl group transition-transform hover:scale-110 active:scale-95"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Badge
          className="border-2 border-white dark:border-zinc-900 min-w-0 h-2.5 w-2.5"
          color="success"
          content=""
          placement="top-right"
          shape="circle"
        >
          <HeartFilledIcon
            className={`text-white w-4 h-4 md:w-6 md:h-6 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
          />
        </Badge>
      </Button>
    </div>
  );
};

export default ConciergeBot;
