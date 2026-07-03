import { MarketingHome } from "@/components/marketing-home";
import { addOns, currentUser, demoOrders } from "@/lib/data";

export default function Home(): React.ReactElement {
  return (
    <MarketingHome
      addOns={addOns}
      currentUser={currentUser}
      orders={demoOrders}
    />
  );
}
