"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Headphones,
  MessageCircle,
  PackageSearch,
  RotateCcw,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const QUICK_ACTIONS = [
  {
    label: "Find a product",
    description: "Search products and categories",
    icon: Search,
  },
  {
    label: "Track my order",
    description: "Check order and delivery status",
    icon: PackageSearch,
  },
  {
    label: "Returns & refunds",
    description: "Returns, eligibility and refunds",
    icon: RotateCcw,
  },
  {
    label: "Account help",
    description: "Profile, addresses and account",
    icon: UserRound,
  },
];

function renderAssistantText(text: string) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return (
            <div
              key={`space-${lineIndex}`}
              className="h-1"
            />
          );
        }

        const isBullet =
          trimmed.startsWith("- ") ||
          trimmed.startsWith("• ");

        const content = isBullet
          ? trimmed.slice(2)
          : line;

        const parts = content.split(
          /(\[[^\]]+\]\([^)]+\)|\*\*[^\*]+\*\*)/g
        );

        const renderedParts = parts.map(
          (part, partIndex) => {
            const boldMatch = part.match(
              /^\*\*(.+)\*\*$/
            );

            if (boldMatch) {
              return (
                <strong
                  key={`${lineIndex}-${partIndex}`}
                  className="font-bold text-slate-900"
                >
                  {boldMatch[1]}
                </strong>
              );
            }

            const linkMatch = part.match(
              /^\[([^\]]+)\]\(([^)]+)\)$/
            );

            if (linkMatch) {
              const label = linkMatch[1];
              const href = linkMatch[2];

              const isSafeLink =
                href.startsWith("/") ||
                href.startsWith("https://") ||
                href.startsWith("http://");

              if (!isSafeLink) {
                return (
                  <span
                    key={`${lineIndex}-${partIndex}`}
                  >
                    {label}
                  </span>
                );
              }

              return (
                <a
                  key={`${lineIndex}-${partIndex}`}
                  href={href}
                  target={
                    href.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="font-bold text-amber-700 underline decoration-amber-300 underline-offset-2 transition hover:text-amber-800"
                >
                  {label}
                </a>
              );
            }

            return (
              <span
                key={`${lineIndex}-${partIndex}`}
              >
                {part}
              </span>
            );
          }
        );

        if (isBullet) {
          return (
            <div
              key={`line-${lineIndex}`}
              className="flex items-start gap-2"
            >
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />

              <div className="min-w-0">
                {renderedParts}
              </div>
            </div>
          );
        }

        return (
          <div key={`line-${lineIndex}`}>
            {renderedParts}
          </div>
        );
      })}
    </div>
  );
}

export default function DjadorAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  const [messages, setMessages] = useState<
    Message[]
  >([
    {
      id: 1,
      role: "assistant",
      text: "Hi! How can I help with your shopping today?",
    },
  ]);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const inputRef =
    useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  async function sendMessage(text: string) {
    const value = text.trim();

    if (!value || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: value,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
          history: messages
            .filter(
              (message) => message.id !== 1
            )
            .slice(-12)
            .map((message) => ({
              role: message.role,
              text: message.text,
            })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to contact DJADOR Assistant."
        );
      }

      if (
        typeof data?.reply !== "string" ||
        !data.reply.trim()
      ) {
        throw new Error(
          "DJADOR Assistant returned an empty response."
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.reply.trim(),
        },
      ]);
    } catch (error) {
      console.error(
        "DJADOR Assistant error:",
        error
      );

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Sorry, I’m having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);

      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <>
      {/* Closed launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open DJADOR shopping assistant"
          title="Need help?"
          className="group fixed bottom-6 right-6 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-white shadow-[0_10px_30px_-8px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_14px_35px_-8px_rgba(15,23,42,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 max-sm:bottom-4 max-sm:right-4"
        >
          <MessageCircle className="h-5 w-5" />

          {/* Online indicator */}
          <span className="absolute right-[7px] top-[7px] h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />

          {/* Hover label */}
          <span className="pointer-events-none absolute right-[58px] whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            Need help?
          </span>
        </button>
      )}

      {/* Open chatbot */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="DJADOR shopping assistant"
          className="fixed bottom-5 right-5 z-[80] flex h-[590px] w-[370px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_70px_-18px_rgba(15,23,42,0.40)] max-sm:bottom-0 max-sm:right-0 max-sm:h-[100dvh] max-sm:w-full max-sm:rounded-none"
        >
          {/* Brand accent */}
          <div className="h-[3px] shrink-0 bg-gradient-to-r from-slate-950 via-amber-500 to-slate-950" />

          {/* Header */}
          <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image
                    src="/images/logo/DJADORWTOBG.png"
                    alt="DJADOR"
                    width={70}
                    height={70}
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-[14px] font-extrabold tracking-tight text-slate-950">
                    DJADOR Assistant
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <span className="text-[11px] font-medium text-slate-500">
                      Online · Shopping support
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  aria-label="Minimize assistant"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <ChevronDown className="h-[18px] w-[18px]" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  aria-label="Close assistant"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          {/* Conversation */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/50">
            <div className="px-4 py-4 pb-6">
              {messages.length === 1 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-600">
                    Welcome to DJADOR
                  </p>

                  <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-950">
                    How can we help?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Get help with products,
                    orders, returns, and your
                    account.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[84%] whitespace-pre-wrap px-3.5 py-2.5 text-[13px] leading-5 ${
                        message.role === "user"
                          ? "rounded-2xl rounded-br-sm bg-slate-950 text-white"
                          : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
                      }`}
                    >
                      {message.role ===
                      "assistant"
                        ? renderAssistantText(
                            message.text
                          )
                        : message.text}
                    </div>
                  </div>
                ))}
              </div>

              {isLoading && (
                <div className="mt-3 flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />

                      <span className="ml-1 text-[11px] font-medium text-slate-500">
                        DJADOR Assistant is
                        typing
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 &&
                !isLoading && (
                  <div className="mt-5">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                      Popular topics
                    </p>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      {QUICK_ACTIONS.map(
                        (action, index) => {
                          const Icon =
                            action.icon;

                          return (
                            <button
                              key={
                                action.label
                              }
                              type="button"
                              onClick={() => {
                                void sendMessage(
                                  action.label
                                );
                              }}
                              disabled={
                                isLoading
                              }
                              className={`group flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-amber-50/60 disabled:cursor-not-allowed disabled:opacity-60 ${
                                index !==
                                QUICK_ACTIONS.length -
                                  1
                                  ? "border-b border-slate-100"
                                  : ""
                              }`}
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-amber-100 group-hover:text-amber-700">
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-[12px] font-bold text-slate-900">
                                  {
                                    action.label
                                  }
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                                  {
                                    action.description
                                  }
                                </p>
                              </div>

                              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-amber-600" />
                            </button>
                          );
                        }
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-1.5">
                      <CircleHelp className="h-3.5 w-3.5 text-slate-400" />

                      <p className="text-[10px] text-slate-400">
                        Or ask us anything
                        about your shopping
                      </p>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white p-1.5 transition focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-amber-500/10"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                disabled={isLoading}
                rows={1}
                placeholder={
                  isLoading
                    ? "DJADOR Assistant is responding..."
                    : "Ask about products, orders or returns..."
                }
                className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-[12px] text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  isLoading
                }
                aria-label="Send message"
                className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-center gap-1.5">
              <Headphones className="h-3 w-3 text-slate-400" />

              <span className="text-[9px] font-medium text-slate-400">
                DJADOR Family Store customer
                assistance
              </span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}