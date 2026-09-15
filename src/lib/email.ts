import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================
// EMAIL VERIFICATION OTP
// ============================================================

export async function sendVerificationOtpEmail(
  email: string,
  otp: string
) {
  const { data, error } = await resend.emails.send({
    from: "Djador Family Store <no-reply@djadorfamilystore.com>",
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <h2 style="margin-bottom: 16px;">
          Verify your email address
        </h2>

        <p style="font-size: 16px; line-height: 1.6;">
          Use the verification code below to complete your registration.
        </p>

        <div
          style="
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            margin: 28px 0;
          "
        >
          ${otp}
        </div>

        <p style="font-size: 14px; line-height: 1.6;">
          This code expires in 5 minutes.
        </p>

        <p style="font-size: 14px; line-height: 1.6;">
          If you did not create an account, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend verification email error:", error);
    throw new Error("Failed to send verification email.");
  }

  return data;
}

// ============================================================
// PASSWORD RESET
// ============================================================

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  const { data, error } = await resend.emails.send({
    from: "Djador Family Store <no-reply@djadorfamilystore.com>",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <h2 style="margin-bottom: 16px;">
          Reset your password
        </h2>

        <p style="font-size: 16px; line-height: 1.6;">
          We received a request to reset your Djador Family Store password.
        </p>

        <p style="font-size: 16px; line-height: 1.6;">
          Click the button below to create a new password.
        </p>

        <div style="margin: 28px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              background: #0f172a;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 24px;
              border-radius: 10px;
              font-weight: 700;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
          This password reset link expires in 15 minutes.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
          If you did not request a password reset, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend password reset email error:", error);
    throw new Error("Failed to send password reset email.");
  }

  return data;
}

// ============================================================
// ORDER RECEIVED
// ============================================================

type OrderReceivedEmailItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  size?: string | null;
  color?: string | null;
};

type OrderReceivedEmailData = {
  email: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  items: OrderReceivedEmailItem[];
};

export async function sendOrderReceivedEmail({
  email,
  orderId,
  customerName,
  totalAmount,
  shippingAddress,
  shippingCity,
  shippingState,
  shippingZip,
  items,
}: OrderReceivedEmailData) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const orderUrl = `${appUrl}/account/orders/${orderId}`;

  const orderNumber = orderId.slice(-8).toUpperCase();

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding: 20px 0;
              border-bottom: 1px solid #e5e7eb;
              vertical-align: top;
            "
          >
            <div
              style="
                font-size: 15px;
                line-height: 22px;
                font-weight: 700;
                color: #111827;
              "
            >
              ${item.productName}
            </div>

            <div
              style="
                margin-top: 5px;
                font-size: 13px;
                line-height: 20px;
                color: #6b7280;
              "
            >
              Quantity: ${item.quantity}
            </div>

            ${
              item.size || item.color
                ? `
                  <div
                    style="
                      margin-top: 2px;
                      font-size: 13px;
                      line-height: 20px;
                      color: #6b7280;
                    "
                  >
                    ${item.size ? `Size: ${item.size}` : ""}
                    ${item.size && item.color ? "&nbsp;&nbsp;•&nbsp;&nbsp;" : ""}
                    ${item.color ? `Color: ${item.color}` : ""}
                  </div>
                `
                : ""
            }
          </td>

          <td
            style="
              padding: 20px 0;
              border-bottom: 1px solid #e5e7eb;
              vertical-align: top;
              text-align: right;
              white-space: nowrap;
              font-size: 15px;
              line-height: 22px;
              font-weight: 700;
              color: #111827;
            "
          >
            $${(item.unitPrice * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: "Djador Family Store <no-reply@djadorfamilystore.com>",
    to: email,
    subject: `We received your order #${orderNumber}`,
    html: `
      <!doctype html>
      <html>
        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background-color: #f3f4f6;"
          >
            <tr>
              <td align="center" style="padding: 32px 16px;">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width: 100%;
                    max-width: 640px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                  "
                >

                  <!-- HEADER -->
                  <tr>
                    <td
                      style="
                        padding: 24px 32px;
                        background-color: #ffffff;
                        border-bottom: 1px solid #e5e7eb;
                      "
                    >
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td
                            style="
                              font-size: 22px;
                              line-height: 28px;
                              font-weight: 800;
                              letter-spacing: 0.5px;
                              color: #111827;
                            "
                          >
                            DJADOR
                          </td>

                          <td
                            align="right"
                            style="
                              font-size: 12px;
                              line-height: 18px;
                              color: #6b7280;
                            "
                          >
                            FAMILY STORE
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ORDER STATUS -->
                  <tr>
                    <td style="padding: 34px 32px 24px 32px;">
                      <div
                        style="
                          display: inline-block;
                          padding: 7px 12px;
                          border-radius: 999px;
                          background-color: #ecfdf5;
                          color: #047857;
                          font-size: 12px;
                          line-height: 16px;
                          font-weight: 700;
                          letter-spacing: 0.4px;
                        "
                      >
                        ✓ ORDER RECEIVED
                      </div>

                      <h1
                        style="
                          margin: 20px 0 8px 0;
                          font-size: 26px;
                          line-height: 34px;
                          color: #111827;
                        "
                      >
                        Thank you for your order, ${customerName}
                      </h1>

                      <p
                        style="
                          margin: 0;
                          font-size: 15px;
                          line-height: 24px;
                          color: #4b5563;
                        "
                      >
                        We've received your order and will keep you updated as it progresses.
                      </p>
                    </td>
                  </tr>

                  <!-- ORDER INFORMATION -->
                  <tr>
                    <td style="padding: 0 32px 28px 32px;">
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                          background-color: #f9fafb;
                          border: 1px solid #e5e7eb;
                          border-radius: 10px;
                        "
                      >
                        <tr>
                          <td style="padding: 16px 18px;">
                            <div
                              style="
                                font-size: 11px;
                                line-height: 16px;
                                font-weight: 700;
                                letter-spacing: 0.7px;
                                color: #6b7280;
                              "
                            >
                              ORDER NUMBER
                            </div>

                            <div
                              style="
                                margin-top: 4px;
                                font-size: 15px;
                                line-height: 22px;
                                font-weight: 700;
                                color: #111827;
                              "
                            >
                              #${orderNumber}
                            </div>
                          </td>

                          <td
                            align="right"
                            style="padding: 16px 18px;"
                          >
                            <div
                              style="
                                font-size: 11px;
                                line-height: 16px;
                                font-weight: 700;
                                letter-spacing: 0.7px;
                                color: #6b7280;
                              "
                            >
                              STATUS
                            </div>

                            <div
                              style="
                                margin-top: 4px;
                                font-size: 15px;
                                line-height: 22px;
                                font-weight: 700;
                                color: #047857;
                              "
                            >
                              Order received
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- ORDER SUMMARY -->
                  <tr>
                    <td style="padding: 0 32px;">
                      <h2
                        style="
                          margin: 0;
                          padding-bottom: 8px;
                          font-size: 18px;
                          line-height: 26px;
                          color: #111827;
                        "
                      >
                        Order summary
                      </h2>

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tbody>
                          ${itemsHtml}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <!-- TOTAL -->
                  <tr>
                    <td style="padding: 20px 32px 30px 32px;">
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td
                            style="
                              padding-top: 4px;
                              font-size: 18px;
                              line-height: 26px;
                              font-weight: 800;
                              color: #111827;
                            "
                          >
                            Order Total
                          </td>

                          <td
                            align="right"
                            style="
                              padding-top: 4px;
                              font-size: 20px;
                              line-height: 28px;
                              font-weight: 800;
                              color: #111827;
                            "
                          >
                            $${totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- SHIPPING -->
                  <tr>
                    <td style="padding: 0 32px 30px 32px;">
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                          background-color: #f9fafb;
                          border: 1px solid #e5e7eb;
                          border-radius: 10px;
                        "
                      >
                        <tr>
                          <td style="padding: 20px;">
                            <div
                              style="
                                margin-bottom: 10px;
                                font-size: 12px;
                                line-height: 18px;
                                font-weight: 800;
                                letter-spacing: 0.6px;
                                color: #374151;
                              "
                            >
                              DELIVERING TO
                            </div>

                            <div
                              style="
                                font-size: 14px;
                                line-height: 22px;
                                color: #4b5563;
                              "
                            >
                              <strong style="color: #111827;">
                                ${customerName}
                              </strong>
                              <br />
                              ${shippingAddress}
                              <br />
                              ${shippingCity}, ${shippingState} ${shippingZip}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- VIEW ORDER BUTTON -->
                  <tr>
                    <td
                      align="center"
                      style="padding: 0 32px 36px 32px;"
                    >
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td
                            align="center"
                            style="
                              background-color: #111827;
                              border-radius: 8px;
                            "
                          >
                            <a
                              href="${orderUrl}"
                              style="
                                display: inline-block;
                                padding: 14px 28px;
                                font-size: 14px;
                                line-height: 20px;
                                font-weight: 700;
                                color: #ffffff;
                                text-decoration: none;
                              "
                            >
                              View Your Order
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- HELP -->
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 24px 32px;
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          font-size: 13px;
                          line-height: 21px;
                          color: #6b7280;
                        "
                      >
                        We'll keep you updated as your order progresses.
                      </p>

                      <p
                        style="
                          margin: 8px 0 0 0;
                          font-size: 13px;
                          line-height: 21px;
                          color: #6b7280;
                        "
                      >
                        Need help? Visit your account for order details and support.
                      </p>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 24px 32px;
                        background-color: #111827;
                      "
                    >
                      <div
                        style="
                          font-size: 16px;
                          line-height: 22px;
                          font-weight: 800;
                          color: #ffffff;
                        "
                      >
                        DJADOR
                      </div>

                      <div
                        style="
                          margin-top: 3px;
                          font-size: 10px;
                          line-height: 16px;
                          letter-spacing: 1.4px;
                          color: #9ca3af;
                        "
                      >
                        FAMILY STORE
                      </div>

                      <p
                        style="
                          margin: 14px 0 0 0;
                          font-size: 11px;
                          line-height: 18px;
                          color: #9ca3af;
                        "
                      >
                        This is an automated transactional email regarding your order.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend order received email error:", error);
    throw new Error("Failed to send order received email.");
  }

  return data;
}