import { auth } from "@clerk/nextjs/server";
import Valuation from "./Valuation";

export default async function ValuationPage() {
    const { userId } = await auth();
    return <Valuation sellerClerkId={userId ?? undefined} />;
}