export default function ShoppingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      {children}
    </div>
  );
}
