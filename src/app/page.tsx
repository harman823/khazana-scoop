import { MarketingHome } from "@/components/marketing-home";
import { getStorefrontCatalogHomeData } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Home(): Promise<React.ReactElement> {
  const homeData = await getStorefrontCatalogHomeData();

  return <MarketingHome homeData={homeData} />;
}
