import SellerNav from "@/components/layout/navbars/sellernav";
import SellerBuyerFooter from "@/components/layout/footers/SellerBuyerFooter";


export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SellerNav />
      <main>{children}</main>
      <SellerBuyerFooter />
    </>
  );
}