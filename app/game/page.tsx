"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";

import { HeartFilledIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  fact: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: "Where did the couple first meet?",
    options: [
      "In the Mountains",
      "During College",
      "At a Coffee Shop",
      "At a Wedding",
    ],
    correctIndex: 1,
    fact: "They were college classmates before they became soulmates!",
  },
  {
    question: "How many years of beautiful journey have they shared so far?",
    options: ["5 Years", "7 Years", "10 Years", "12 Years"],
    correctIndex: 2,
    fact: "They have shared a decade of laughter and love!",
  },
  {
    question: "What is one thing both of them deeply love?",
    options: ["The Mountains", "The Ocean", "City Life", "Desert Safaris"],
    correctIndex: 0,
    fact: "They both share a deep love for the mountains.",
  },
  {
    question: "How did their story begin?",
    options: [
      "As Neighbors",
      "As Colleagues",
      "As College Classmates",
      "Through Friends",
    ],
    correctIndex: 2,
    fact: "Their journey started right in the classrooms of their college.",
  },
  {
    question: "Which of these describes their relationship perfectly?",
    options: [
      "Love at first sight",
      "College classmates to soulmates",
      "Met through a dating app",
      "Childhood friends",
    ],
    correctIndex: 1,
    fact: "They truly grew together from college friends to life partners!",
  },
  {
    question: "What is the theme of their next chapter?",
    options: [
      "Starting a business",
      "Moving to a new city",
      "Writing a new chapter as one",
      "Going back to college",
    ],
    correctIndex: 2,
    fact: "After 10 years, they are finally becoming one!",
  },
  {
    question: "What environment do they prefer for their adventures?",
    options: [
      "Tropical Beaches",
      "Snowy Mountains",
      "Bustling Cities",
      "Forest Camping",
    ],
    correctIndex: 1,
    fact: "Their shared love for the mountains often leads them to snowy peaks!",
  },
  {
    question: "What brings the most laughter to their journey?",
    options: [
      "Watching Movies",
      "Shared Laughter & Stories",
      "Working together",
      "Competitive Gaming",
    ],
    correctIndex: 1,
    fact: "A decade of laughter and shared stories is the foundation of their love.",
  },
];

export default function GamePage() {
  const [currentStep, setCurrentStep] = useState<"start" | "quiz" | "result">(
    "start",
  );
  const [quizSet, setQuizSet] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startQuiz = () => {
    // Pick 5 random questions from the pool
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());

    setQuizSet(shuffled.slice(0, 5));

    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentStep("quiz");
    setShowFeedback(false);
    setSelectedOption(null);
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;

    setSelectedOption(index);
    if (index === quizSet[currentQuestionIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizSet.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
      setSelectedOption(null);
    } else {
      setCurrentStep("result");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-[70vh]">
      <div className="inline-block max-w-lg text-center justify-center mb-8">
        <h1 className={title({ color: "pink" })}>The Couple Quiz&nbsp;</h1>
        <p className={subtitle({ className: "mt-4" })}>
          How well do you know the couple?
        </p>
      </div>

      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {currentStep === "start" && (
            <motion.div
              key="start"
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 p-8 bg-wedding-pink-50/50 dark:bg-white/5 rounded-3xl border border-wedding-pink-100 dark:border-white/10 text-center"
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
            >
              <HeartFilledIcon className="text-wedding-pink-500 w-16 h-16" />
              <h3 className="text-2xl font-semibold">
                Ready to test your knowledge?
              </h3>
              <p className="text-default-600">
                We&apos;ll pick 5 random questions about our 10-year journey.
                Can you get them all right?
              </p>
              <Button
                className="bg-wedding-pink-500 shadow-lg px-12"
                color="primary"
                radius="full"
                size="lg"
                onClick={startQuiz}
              >
                Start Quiz
              </Button>
            </motion.div>
          )}

          {currentStep === "quiz" && quizSet.length > 0 && (
            <motion.div
              key="quiz"
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6 p-6 md:p-8 bg-white dark:bg-default-50 rounded-3xl shadow-xl border border-wedding-pink-100 dark:border-white/5"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-wedding-pink-500 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of {quizSet.length}
                </span>
                <span className="text-sm text-default-400">Score: {score}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-default-800 dark:text-default-900">
                {quizSet[currentQuestionIndex].question}
              </h3>

              <div className="flex flex-col gap-3">
                {quizSet[currentQuestionIndex].options.map((option, idx) => {
                  let buttonColor: "default" | "success" | "danger" = "default";

                  if (showFeedback) {
                    if (idx === quizSet[currentQuestionIndex].correctIndex) {
                      buttonColor = "success";
                    } else if (idx === selectedOption) {
                      buttonColor = "danger";
                    }
                  }

                  return (
                    <Button
                      key={idx}
                      className={`justify-start text-left h-auto py-4 px-6 text-base whitespace-normal ${
                        !showFeedback ? "hover:border-wedding-pink-400" : ""
                      }`}
                      color={buttonColor}
                      disabled={showFeedback}
                      variant={selectedOption === idx ? "solid" : "bordered"}
                      onClick={() => handleAnswer(idx)}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>

              {showFeedback && (
                <motion.div
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-default-100 rounded-2xl"
                  initial={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sm italic text-default-700">
                    <span className="font-bold mr-2">Did you know?</span>
                    {quizSet[currentQuestionIndex].fact}
                  </p>
                  <Button
                    className="mt-4 w-full bg-wedding-pink-500 text-white shadow-md"
                    onClick={nextQuestion}
                  >
                    {currentQuestionIndex < quizSet.length - 1
                      ? "Next Question"
                      : "See Results"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "result" && (
            <motion.div
              key="result"
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 p-8 bg-wedding-gold-50/50 dark:bg-white/5 rounded-3xl border border-wedding-gold-100 dark:border-white/10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative">
                <HeartFilledIcon className="text-wedding-pink-500 w-20 h-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{score}</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold">
                {score === quizSet.length
                  ? "True Soulmate Friend!"
                  : score >= 3
                    ? "Great Job!"
                    : "Thanks for Playing!"}
              </h3>

              <p className="text-lg text-default-600">
                You scored{" "}
                <span className="text-wedding-pink-600 font-bold">{score}</span>{" "}
                out of {quizSet.length}
              </p>

              <div className="flex gap-4 w-full">
                <Button className="flex-1" variant="flat" onClick={startQuiz}>
                  Play Again
                </Button>
                <Button
                  as="a"
                  className="flex-1 bg-wedding-gold-600"
                  color="primary"
                  href="/"
                >
                  Back Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}