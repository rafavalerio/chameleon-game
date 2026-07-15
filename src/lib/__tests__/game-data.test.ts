import { describe, it, expect } from "vitest";
import { FlaskConical } from "lucide-react";
import {
  topics,
  getTopicById,
  getRandomWord,
  getRandomQuestions,
  getTopicWords,
  Topic,
} from "../game-data";

const testTopic: Topic = {
  id: "test-topic",
  name: "Test Topic",
  icon: FlaskConical,
  description: "A topic for tests",
  words: ["Alpha", "Beta", "Gamma", "Delta"],
  questions: ["Question A?", "Question B?", "Question C?"],
};

describe("topics data integrity", () => {
  it("every topic has a non-empty words and questions array", () => {
    topics.forEach((topic) => {
      expect(topic.words.length).toBeGreaterThan(0);
      expect(topic.questions.length).toBeGreaterThan(0);
    });
  });

  it("every topic has a unique id", () => {
    const ids = topics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getTopicById", () => {
  it("finds an existing topic", () => {
    const first = topics[0];
    expect(getTopicById(first.id)).toBe(first);
  });

  it("returns undefined for an unknown id", () => {
    expect(getTopicById("does-not-exist")).toBeUndefined();
  });
});

describe("getRandomWord", () => {
  it("always returns a word from the topic", () => {
    for (let i = 0; i < 20; i++) {
      expect(testTopic.words).toContain(getRandomWord(testTopic));
    }
  });
});

describe("getRandomQuestions", () => {
  it("returns the requested number of unique questions", () => {
    const questions = getRandomQuestions(testTopic, 2);
    expect(questions).toHaveLength(2);
    expect(new Set(questions).size).toBe(2);
    questions.forEach((q) => expect(testTopic.questions).toContain(q));
  });

  it("caps at the topic's question count when count exceeds it", () => {
    const questions = getRandomQuestions(testTopic, 999);
    expect(questions).toHaveLength(testTopic.questions.length);
  });
});

describe("getTopicWords", () => {
  it("returns a copy of the topic's words", () => {
    const words = getTopicWords(testTopic);
    expect(words).toEqual(testTopic.words);
    expect(words).not.toBe(testTopic.words);
  });
});
