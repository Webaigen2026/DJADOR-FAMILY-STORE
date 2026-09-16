import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type SearchProductsArgs = {
  query?: string;
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  limit?: number;
};

type ToolOutput = {
  type: "function_call_output";
  call_id: string;
  output: string;
};

const PRODUCT_SEARCH_TOOL: OpenAI.Responses.FunctionTool = {
  type: "function",
  name: "search_products",
  description:
    "Search the real DJADOR Family Store catalog. Use this whenever the customer asks what products DJADOR has, asks about a named product, category, brand, price, availability, stock, size, color, variants, or asks for shopping recommendations that depend on the current catalog.",
  strict: false,

  parameters: {
    type: "object",

    properties: {
      query: {
        type: "string",
        description:
          "Product search text such as blue gown, shoes, handbag, shirt, baby essentials, or part of a product name.",
      },

      category: {
        type: "string",
        description:
          "Optional category requested by the customer.",
      },

      brand: {
        type: "string",
        description:
          "Optional brand requested by the customer.",
      },

      color: {
        type: "string",
        description:
          "Optional product variant color.",
      },

      size: {
        type: "string",
        description:
          "Optional product variant size.",
      },

      minPrice: {
        type: "number",
        description:
          "Optional minimum displayed product price in dollars.",
      },

      maxPrice: {
        type: "number",
        description:
          "Optional maximum displayed product price in dollars.",
      },

      inStockOnly: {
        type: "boolean",
        description:
          "Whether only products currently in stock should be returned.",
      },

      limit: {
        type: "integer",
        minimum: 1,
        maximum: 12,
        description:
          "Maximum number of products to return.",
      },
    },

    additionalProperties: false,
  },
};

async function searchProducts(
  args: SearchProductsArgs
) {
  const query =
    typeof args.query === "string"
      ? args.query.trim()
      : "";

  const category =
    typeof args.category === "string"
      ? args.category.trim()
      : "";

  const brand =
    typeof args.brand === "string"
      ? args.brand.trim()
      : "";

  const color =
    typeof args.color === "string"
      ? args.color.trim()
      : "";

  const size =
    typeof args.size === "string"
      ? args.size.trim()
      : "";

  const minPrice =
    typeof args.minPrice === "number" &&
    Number.isFinite(args.minPrice)
      ? Math.max(0, args.minPrice)
      : undefined;

  const maxPrice =
    typeof args.maxPrice === "number" &&
    Number.isFinite(args.maxPrice)
      ? Math.max(0, args.maxPrice)
      : undefined;

  const limit =
    typeof args.limit === "number" &&
    Number.isInteger(args.limit)
      ? Math.min(
          Math.max(args.limit, 1),
          12
        )
      : 8;

  const products =
    await prisma.product.findMany({
      where: {
        isActive: true,

        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  brand: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  category: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  subCategory: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
                {
                  variants: {
                    some: {
                      isActive: true,

                      OR: [
                        {
                          color: {
                            contains: query,
                            mode:
                              "insensitive" as const,
                          },
                        },
                        {
                          size: {
                            contains: query,
                            mode:
                              "insensitive" as const,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),

        ...(category
          ? {
              AND: [
                {
                  OR: [
                    {
                      category: {
                        contains: category,
                        mode:
                          "insensitive" as const,
                      },
                    },
                    {
                      subCategory: {
                        contains: category,
                        mode:
                          "insensitive" as const,
                      },
                    },
                  ],
                },
              ],
            }
          : {}),

        ...(brand
          ? {
              brand: {
                contains: brand,
                mode: "insensitive" as const,
              },
            }
          : {}),

        ...(minPrice !== undefined ||
        maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined
                  ? {
                      gte: Math.round(
                        minPrice
                      ),
                    }
                  : {}),

                ...(maxPrice !== undefined
                  ? {
                      lte: Math.round(
                        maxPrice
                      ),
                    }
                  : {}),
              },
            }
          : {}),

        ...(color || size
          ? {
              variants: {
                some: {
                  isActive: true,

                  ...(color
                    ? {
                        color: {
                          contains: color,
                          mode:
                            "insensitive" as const,
                        },
                      }
                    : {}),

                  ...(size
                    ? {
                        size: {
                          contains: size,
                          mode:
                            "insensitive" as const,
                        },
                      }
                    : {}),

                  ...(args.inStockOnly
                    ? {
                        stock: {
                          gt: 0,
                        },
                      }
                    : {}),
                },
              },
            }
          : {}),

        ...(!color &&
        !size &&
        args.inStockOnly
          ? {
              AND: [
                {
                  OR: [
                    {
                      stock: {
                        gt: 0,
                      },
                    },
                    {
                      variants: {
                        some: {
                          isActive: true,

                          stock: {
                            gt: 0,
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            }
          : {}),
      },

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        originalPrice: true,
        brand: true,
        category: true,
        subCategory: true,
        imageUrl: true,
        stock: true,

        images: {
          select: {
            url: true,
          },

          take: 3,
        },

        variants: {
          where: {
            isActive: true,
          },

          select: {
            id: true,
            size: true,
            color: true,
            sku: true,
            price: true,
            stock: true,
            imageUrl: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,
    });

  return {
    count: products.length,

    products: products.map(
      (product) => {
        const availableVariants =
          product.variants.filter(
            (variant) =>
              variant.stock > 0
          );

        const totalVariantStock =
          product.variants.reduce(
            (total, variant) =>
              total + variant.stock,
            0
          );

        const availableSizes = [
          ...new Set(
            availableVariants
              .map(
                (variant) =>
                  variant.size
              )
              .filter(
                (
                  value
                ): value is string =>
                  typeof value ===
                    "string" &&
                  value.length > 0
              )
          ),
        ];

        const availableColors = [
          ...new Set(
            availableVariants
              .map(
                (variant) =>
                  variant.color
              )
              .filter(
                (
                  value
                ): value is string =>
                  typeof value ===
                    "string" &&
                  value.length > 0
              )
          ),
        ];

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description:
            product.description,
          price: product.price,
          originalPrice:
            product.originalPrice,
          brand: product.brand,
          category:
            product.category,
          subCategory:
            product.subCategory,

          imageUrl:
            product.imageUrl ??
            product.images[0]?.url ??
            null,

          stock: product.stock,
          totalVariantStock,

          inStock:
            product.stock > 0 ||
            totalVariantStock > 0,

          availableSizes,
          availableColors,

          variants:
            product.variants.map(
              (variant) => ({
                id: variant.id,
                size: variant.size,
                color: variant.color,
                sku: variant.sku,

                price:
                  variant.price !==
                  null
                    ? variant.price
                    : product.price,

                stock:
                  variant.stock,

                inStock:
                  variant.stock > 0,

                imageUrl:
                  variant.imageUrl,
              })
            ),
        };
      }
    ),
  };
}

function safeParseArguments(
  value: string
): SearchProductsArgs {
  try {
    const parsed: unknown =
      JSON.parse(value);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as SearchProductsArgs;
    }

    return {};
  } catch {
    return {};
  }
}

export async function POST(
  request: Request
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error:
            "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        {
          error:
            "Message is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const history: ChatMessage[] =
      Array.isArray(body?.history)
        ? body.history
            .filter(
              (
                item: unknown
              ): item is ChatMessage => {
                if (
                  !item ||
                  typeof item !==
                    "object"
                ) {
                  return false;
                }

                const candidate =
                  item as Partial<ChatMessage>;

                return (
                  (candidate.role ===
                    "user" ||
                    candidate.role ===
                      "assistant") &&
                  typeof candidate.text ===
                    "string" &&
                  candidate.text
                    .trim()
                    .length > 0
                );
              }
            )
            .slice(-12)
            .map(
              (
                item: ChatMessage
              ) => ({
                role: item.role,
                text: item.text
                  .trim()
                  .slice(0, 2000),
              })
            )
        : [];

    const conversation: OpenAI.Responses.ResponseInput =
      [
        ...history.map(
          (item) => ({
            role: item.role,
            content: item.text,
          })
        ),

        {
          role: "user",
          content: message,
        },
      ];

    let response =
      await openai.responses.create({
        model: "gpt-5.6-luna",

        instructions: `
You are DJADOR Assistant, the professional AI shopping and customer-support assistant for DJADOR Family Store.

Your goal is to help customers naturally, accurately, and efficiently.

PRODUCT AND SHOPPING RULES

- You have access to the real DJADOR product catalog through search_products.
- Whenever a customer asks whether DJADOR has a product, asks for products, mentions a product name, asks about price, stock, availability, size, color, brand, category, budget, recommendations, comparisons, or variants, use search_products before answering.
- Never say DJADOR "may" have a product when the catalog can be searched.
- Never invent products, prices, stock, colors, sizes, variants, brands, categories, descriptions, or availability.
- If search_products returns zero products, say you could not find a matching active product in the current catalog.
- When products are found, answer using only the returned catalog data.
- Product prices returned by the store are the application's displayed dollar amounts. Format them as USD. For example, 49 becomes $49.00.
- If a variant has its own price, use that variant price when discussing that exact variant.
- A product is in stock only when the tool reports inStock true.
- A particular size or color is available only when the returned variant data supports it.
- Do not include product URLs, product links, or "View Product" links in responses.
- Prefer a small relevant selection rather than overwhelming the customer.

CONVERSATION RULES

- Use the supplied conversation context to understand follow-up messages such as "yes", "that one", "the blue one", "what sizes?", "is it in stock?", and similar references.
- Do not ask the customer to repeat information already available in the conversation.
- If a reference is genuinely ambiguous, ask one short clarifying question.
- Be concise, friendly, natural, and professional.
- Do not pretend to have checked something unless you actually used the appropriate store tool.

ORDERS AND ACCOUNT RULES

- Product catalog information is public.
- You do not yet have an authenticated customer-order tool in this version.
- If the customer asks for actual private order status, tracking number, cancellation eligibility, return eligibility, wishlist, addresses, or other private account information, explain briefly that secure account lookup is not available through the assistant yet.
- Never ask customers to provide passwords, authentication codes, payment card numbers, or other secrets.
- Never expose or guess another customer's information.
- Never invent order status or tracking information.

PAYMENT

- Payment functionality is not currently available through the assistant.
- Never claim that an order has been paid unless verified by store data.
- Never claim that you processed a payment, refund, cancellation, return, or account change unless the store system explicitly confirms the action.

STORE INFORMATION

- Never invent DJADOR policies, shipping promises, return windows, contact details, or other store rules that were not provided through a trusted store source.

Answer the customer's actual question directly.
`,

        input: conversation,

        tools: [
          PRODUCT_SEARCH_TOOL,
        ],
      });

    for (
      let round = 0;
      round < 4;
      round++
    ) {
      const functionCalls =
        response.output.filter(
          (
            item
          ): item is OpenAI.Responses.ResponseFunctionToolCall =>
            item.type ===
            "function_call"
        );

      if (
        functionCalls.length === 0
      ) {
        break;
      }

      const toolOutputs: ToolOutput[] =
        [];

      for (
        const call of functionCalls
      ) {
        if (
          call.name !==
          "search_products"
        ) {
          toolOutputs.push({
            type:
              "function_call_output",
            call_id:
              call.call_id,

            output:
              JSON.stringify({
                error:
                  "Unsupported tool.",
              }),
          });

          continue;
        }

        const args =
          safeParseArguments(
            call.arguments
          );

        try {
          const result =
            await searchProducts(
              args
            );

          toolOutputs.push({
            type:
              "function_call_output",

            call_id:
              call.call_id,

            output:
              JSON.stringify(
                result
              ),
          });
        } catch (error) {
          console.error(
            "DJADOR product search error:",
            error
          );

          toolOutputs.push({
            type:
              "function_call_output",

            call_id:
              call.call_id,

            output:
              JSON.stringify({
                error:
                  "The product catalog could not be searched right now.",
              }),
          });
        }
      }

      response =
        await openai.responses.create({
          model:
            "gpt-5.6-luna",

          instructions: `
Continue as DJADOR Assistant.

Use the DJADOR store tool results to answer the customer's question accurately.

Never invent catalog information.

Never claim an unavailable product is available.

Never claim an out-of-stock variant is available.

Format product prices as USD.

Do not include product URLs, product links, or "View Product" links in responses.

Keep the answer concise, natural, and useful.
`,

          previous_response_id:
            response.id,

          input:
            toolOutputs as OpenAI.Responses.ResponseInput,

          tools: [
            PRODUCT_SEARCH_TOOL,
          ],
        });
    }

    const reply =
      response.output_text?.trim();

    if (!reply) {
      return NextResponse.json(
        {
          error:
            "The assistant did not return a response.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error(
      "DJADOR chat error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "DJADOR Assistant is temporarily unavailable. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}