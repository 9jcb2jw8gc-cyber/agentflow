interface PaymentFailedEmailProps {
  workspaceName: string;
  updatePaymentUrl: string;
}

export function paymentFailedEmail({
  workspaceName,
  updatePaymentUrl,
}: PaymentFailedEmailProps) {
  return {
    subject: "Your AgentFlow payment failed",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <div style="margin-bottom: 24px;">
    <strong style="font-size: 18px; color: #2563eb;">AgentFlow</strong>
  </div>
  <p style="font-size: 16px; line-height: 1.6;">
    We couldn't process the payment for your <strong>${workspaceName}</strong> workspace. Please update your payment method to keep your Pro features active.
  </p>
  <a href="${updatePaymentUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 16px 0;">
    Update payment method
  </a>
  <p style="font-size: 13px; color: #6b7280; margin-top: 32px;">
    AgentFlow &middot; Visual canvas for Claude AI agents
  </p>
</body>
</html>`,
  };
}
