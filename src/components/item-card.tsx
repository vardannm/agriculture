import Image from 'next/image';

import { Item } from '@/lib/types';

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="card">
      <div className="imageWrap">
        <Image src={item.imageUrl} alt={item.name} fill className="image" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="content">
        <p className="category">{item.category}</p>
        <h3>{item.name}</h3>
        <p className="description">{item.description}</p>
        <p className="price">${item.price.toFixed(2)}</p>
        <div className="contactActions">
          <a href={`tel:${item.phone}`} className="button primary">
            Call to Order
          </a>
          <a
            href={`mailto:${item.email}?subject=Inquiry about ${encodeURIComponent(item.name)}`}
            className="button secondary"
          >
            Email Inquiry
          </a>
        </div>
      </div>
    </article>
  );
}
