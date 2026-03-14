interface SubscriptionCancelledEmailProps {
  workspaceName: string;
  resubscribeUrl: string;
}

export function subscriptionCancelledEmail({
  workspaceName,
  resubscribeUrl,
}: SubscriptionCancelledEmailProps) {
  return {
    subject: "Your AgentFlow Pro subscription has ended",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <div style="margin-bottom: 24px;">
    <strong style="font-size: 18px; color: #2563eb;">AgentFlow</strong>
  </div>
  <p style="font-size: 16px; line-height: 1.6;">
    Your Pro subscription for <strong>${workspaceName}</strong> has been cancelled. Your workspace has been moved to the free plan.
  </p>
  <p style="font-size: 15px; line-height: 1.6; color: #374151;">
    Your existing canvases are still saved, but free plan limits now apply (3 canvases, 5 agents per canvas).
  </p>
  <a href="${resubscribeUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 16px 0;">
    Resubscribe to Pro
  </a>
  <p style="font-size: 13px; color: #6b7280; margin-top: 32px;">
    AgentFlow &middot; Visual canvas for Claude AI agents
  </p>
</body>
</html>`,
  };
}
