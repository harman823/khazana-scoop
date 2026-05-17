import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bot, CalendarDays, Clock, Instagram, Mail, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Link } from "react-router";
import { askChatbot } from "../../lib/api";

type ChatRole = "bot" | "user";

type ServiceCard = {
  title: string;
  description: string;
  price: number;
  durationMin: number;
  slug: string;
};

type SlotGroup = {
  date: string;
  day: string;
  slots: Array<{ label: string; start: string; booked: boolean }>;
};

type ChatPayload = {
  services?: ServiceCard[];
  availability?: SlotGroup[];
  actions?: Array<{ label: string; href: string; kind: string }>;
  source?: "openai" | "fallback";
};

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
  payload?: ChatPayload;
};

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    role: "bot",
    text: "Hi, I am here to help gently and clearly. Ask me about services, weekday slots, booking steps, or how to reach the KosmicAlign team.",
  },
];

const quickPrompts = [
  "Show weekday slots",
  "Which service fits me?",
  "Explain prices",
  "Contact admin",
];

const historyFromMessages = (messages: ChatMessage[]) =>
  messages.slice(-8).map((message) => ({
    role: message.role === "bot" ? "assistant" as const : "user" as const,
    content: message.text,
  }));

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function ThinkingDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#7A7A7A]">Thinking</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-[#E84C3D]"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }}
          />
        ))}
      </span>
    </div>
  );
}

function MessageDetails({ payload }: { payload?: ChatPayload }) {
  if (!payload) return null;

  return (
    <div className="mt-3 space-y-3">
      {payload.availability && payload.availability.length > 0 && (
        <div className="space-y-2">
          {payload.availability.map((group) => (
            <div key={group.date} className="rounded-2xl border border-[#E5BE90]/30 bg-[#FFF5EA] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#585858]">
                <CalendarDays className="h-3.5 w-3.5 text-[#E84C3D]" />
                {group.day}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.slots.map((slot) => (
                  <span key={slot.start} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#585858] shadow-sm">
                    {slot.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {payload.services && payload.services.length > 0 && (
        <div className="grid gap-2">
          {payload.services.map((service) => (
            <div key={service.slug} className="rounded-2xl border border-[#E5BE90]/25 bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold text-[#585858]">{service.title}</h4>
                <span className="shrink-0 rounded-full bg-[#FFF5EA] px-2.5 py-1 text-[0.68rem] font-semibold text-[#E84C3D]">
                  {formatPrice(service.price)}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#7A7A7A]">{service.description}</p>
              <div className="mt-2 flex items-center gap-1 text-[0.68rem] font-medium text-[#7A7A7A]">
                <Clock className="h-3 w-3" /> {service.durationMin} minutes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(starterMessages.length + 1);
  const expanded = messages.length > 2 || isThinking;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const sendMessage = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const nextMessages = [...messages, { id: messageId.current++, role: "user" as const, text: trimmed }];
    setInput("");
    setMessages(nextMessages);
    setIsThinking(true);

    try {
      const response = await askChatbot({
        message: trimmed,
        history: historyFromMessages(messages),
      });
      const data = response.data || {};

      setMessages((current) => [
        ...current,
        {
          id: messageId.current++,
          role: "bot",
          text: data.message || "I am here with you. Could you ask that once more in a little more detail?",
          payload: data,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: messageId.current++,
          role: "bot",
          text: "I could not reach the assistant service just now. You can still use the booking page, WhatsApp, Instagram, or email below.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`mb-4 w-[calc(100vw-2rem)] overflow-hidden rounded-[1.25rem] border border-[#FFF5EA] bg-white shadow-[0_18px_70px_rgba(88,88,88,0.16)] transition-all duration-300 ${
              expanded ? "max-w-[40rem]" : "max-w-[28rem]"
            }`}
          >
            <div className="bg-[#E84C3D] p-4 text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold leading-tight">KosmicAlign Assistant</h3>
                    <p className="text-xs text-white/80">Calm guidance, live services, weekday slots</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className={`flex flex-col gap-4 overflow-y-auto bg-[#FFF5EA]/55 p-4 ${expanded ? "h-[30rem]" : "h-80"}`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    message.role === "bot"
                      ? "self-start rounded-tl-sm border border-[#E5BE90]/20 bg-white text-[#585858]"
                      : "self-end rounded-tr-sm bg-[#E84C3D] text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <MessageDetails payload={message.payload} />
                </div>
              ))}
              {isThinking && (
                <div className="self-start rounded-2xl rounded-tl-sm border border-[#E5BE90]/20 bg-white px-4 py-3 shadow-sm">
                  <ThinkingDots />
                </div>
              )}
            </div>

            <div className="border-t border-[#E5BE90]/20 bg-white px-4 pt-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full bg-[#FFF5EA] px-3 py-2 text-left text-xs font-medium text-[#585858] transition-colors hover:bg-[#FDEBD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E84C3D]/30"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="flex items-center gap-2 bg-white p-4"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-w-0 flex-1 rounded-full bg-[#FFF5EA] px-4 py-3 text-sm text-[#585858] outline-none transition-shadow focus:ring-2 focus:ring-[#E84C3D]/25"
                placeholder="Ask about services, slots, or booking..."
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E84C3D] text-white transition-colors hover:bg-[#C0392B] disabled:opacity-50"
                disabled={!input.trim() || isThinking}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="grid grid-cols-4 gap-2 bg-white px-4 pb-4">
              <Link to="/booking" onClick={() => setIsOpen(false)} className="rounded-full bg-[#E84C3D] px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#C0392B]">
                Book
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#FFF5EA] px-3 py-2 text-center text-xs font-semibold text-[#585858] transition-colors hover:bg-[#FDEBD0]">
                <MessageCircle className="mx-auto h-3.5 w-3.5" />
              </a>
              <a href="https://www.instagram.com/kosmicalign?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#FFF5EA] px-3 py-2 text-center text-xs font-semibold text-[#585858] transition-colors hover:bg-[#FDEBD0]">
                <Instagram className="mx-auto h-3.5 w-3.5" />
              </a>
              <a href="mailto:hello@kosmicalign.com" className="rounded-full bg-[#FFF5EA] px-3 py-2 text-center text-xs font-semibold text-[#585858] transition-colors hover:bg-[#FDEBD0]">
                <Mail className="mx-auto h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E84C3D] text-white shadow-[0_8px_32px_rgba(232,76,61,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#C0392B] active:scale-95 sm:h-16 sm:w-16"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
      </button>
    </div>
  );
}
