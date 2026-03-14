interface WelcomeEmailProps {
  dashboardUrl: string;
}

export function welcomeEmail({ dashboardUrl }: WelcomeEmailProps) {
  return {
    subject: "Welcome to AgentFlow",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <div style="margin-bottom: 24px;">
    <strong style="font-size: 18px; color: #2563eb;">AgentFlow</strong>
  </div>
  <p style="font-size: 16px; line-height: 1.6;">
    Welcome to AgentFlow! You can now build Claude agent configurations visually &mdash; drag nodes, connect them, and export portable YAML.
  </p>
  <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 16px 0;">
    Open your dashboard
  </a>
  <p style="font-size: 13px; color: #6b7280; margin-top: 32px;">
    AgentFlow &middot; Visual canvas for Claude AI agents
  </p>
</body>
</html>`,
  };
}
