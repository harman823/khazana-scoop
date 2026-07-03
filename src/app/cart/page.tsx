import { CartCheckoutClient } from "@/components/cart-checkout-client";
import { PageChrome } from "@/components/page-chrome";
import { addOns, scoopTiers } from "@/lib/data";

export default function CartPage(): React.ReactElement {
  return (
    <PageChrome
      title="Shopping cart"
      subtitle="Review your scoop size and add-ons before moving into secure checkout."
    >
      <CartCheckoutClient addOns={addOns} mode="cart" tiers={scoopTiers} />
    </PageChrome>
  );
}
