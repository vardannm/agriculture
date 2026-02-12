import { ItemCard } from '@/components/item-card';
import { readItems } from '@/lib/items-store';

export default async function Home() {
  const items = await readItems();

  return (
    <section>
      <div className="hero">
        <h1>Agriculture Items Catalog</h1>
        <p>
          Browse available farming products below. Purchases are handled offline only — call or email us using each
          item&apos;s contact buttons.
        </p>
      </div>

      <div className="grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
