import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/emails/send";
import { paymentFailedEmail } from "@/lib/emails/payment-failed";
import { subscriptionCancelledEmail } from "@/lib/emails/subscription-cancelled";

// Use service role client for webhook (no user session)
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const workspaceId = session.metadata?.workspaceId;

        if (!workspaceId) {
          console.error("[webhook] No workspaceId in checkout session metadata");
          break;
        }

        await supabase
          .from("workspaces")
          .update({
            plan: "pro",
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", workspaceId);

        console.log(`[webhook] Workspace ${workspaceId} upgraded to pro`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const workspaceId = subscription.metadata?.workspaceId;

        if (subscription.status === "active" && workspaceId) {
          await supabase
            .from("workspaces")
            .update({ plan: "pro" })
            .eq("id", workspaceId);
        }

        if (subscription.status === "past_due") {
          // Find workspace by subscription ID and send email
          const { data: workspace } = await supabase
            .from("workspaces")
            .select("id, name")
            .eq("stripe_subscription_id", subscription.id)
            .single();

          if (workspace) {
            const customer = await stripe.customers.retrieve(
              subscription.customer as string
            );
            if (!customer.deleted && customer.email) {
              const appUrl =
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
              const email = paymentFailedEmail({
                workspaceName: workspace.name,
                updatePaymentUrl: `${appUrl}/settings/billing`,
              });
              await sendEmail({
                to: customer.email,
                subject: email.subject,
                html: email.html,
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: workspace } = await supabase
          .from("workspaces")
          .select("id, name")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (workspace) {
          await supabase
            .from("workspaces")
            .update({
              plan: "free",
              stripe_subscription_id: null,
            })
            .eq("id", workspace.id);

          // Send cancellation email
          const customer = await stripe.customers.retrieve(
            subscription.customer as string
          );
          if (!customer.deleted && customer.email) {
            const appUrl =
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const email = subscriptionCancelledEmail({
              workspaceName: workspace.name,
              resubscribeUrl: `${appUrl}/pricing`,
            });
            await sendEmail({
              to: customer.email,
              subject: email.subject,
              html: email.html,
            });
          }
        }

        console.log(
          `[webhook] Subscription ${subscription.id} cancelled, workspace downgraded`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted && customer.email) {
          const { data: workspace } = await supabase
            .from("workspaces")
            .select("name")
            .eq("stripe_customer_id", customerId)
            .single();

          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

          // Get hosted invoice URL for payment update
          const updatePaymentUrl =
            invoice.hosted_invoice_url || `${appUrl}/settings/billing`;

          const email = paymentFailedEmail({
            workspaceName: workspace?.name ?? "your workspace",
            updatePaymentUrl,
          });
          await sendEmail({
            to: customer.email,
            subject: email.subject,
            html: email.html,
          });
        }
        break;
      }

      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`[webhook] Error handling ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
