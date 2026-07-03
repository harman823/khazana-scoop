import { CheckoutBagClient } from "@/components/checkout-bag-client";
import { PageChrome } from "@/components/page-chrome";

export default function CheckoutPage(): React.ReactElement {
  return (
    <PageChrome
      title="Checkout"
      subtitle="Review your shopping bag, add delivery details, and continue to secure payment."
    >
      <CheckoutBagClient />
    </PageChrome>
  );
}
