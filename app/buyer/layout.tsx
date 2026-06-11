import BuyerNav from "@/components/layout/navbars/buyernav";
import SellerBuyerFooter from "@/components/layout/footers/SellerBuyerFooter";


export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BuyerNav />
      <main>{children}</main>
      <SellerBuyerFooter />
    </>
  );
}