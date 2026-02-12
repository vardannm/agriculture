'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { Item } from '@/lib/types';

type ItemForm = Omit<Item, 'id'>;

const emptyForm: ItemForm = {
  name: '',
  category: '',
  description: '',
  price: 0,
  imageUrl: '',
  phone: '',
  email: ''
};

export default function AdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');

  async function loadItems() {
    setLoading(true);
    const response = await fetch('/api/items', { cache: 'no-store' });
    const data = (await response.json()) as Item[];
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  const submitLabel = useMemo(() => (editingId ? 'Update Item' : 'Add Item'), [editingId]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus('Saving...');

    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...form, id: editingId } : form;

    const response = await fetch('/api/items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      setStatus(errorData.message ?? 'Could not save item.');
      return;
    }

    setStatus(editingId ? 'Item updated.' : 'Item added.');
    resetForm();
    await loadItems();
  }

  async function handleDelete(id: string) {
    setStatus('Deleting...');
    const response = await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      setStatus(errorData.message ?? 'Could not delete item.');
      return;
    }

    setStatus('Item deleted.');
    await loadItems();
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      phone: item.phone,
      email: item.email
    });
    setStatus(`Editing "${item.name}"`);
  }

  return (
    <section className="adminPage">
      <h1>Admin Panel</h1>
      <p>Add, edit, or remove agriculture catalog items without touching code.</p>

      <form className="adminForm" onSubmit={handleSubmit}>
        <div className="formGrid">
          <label>
            Item Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Category
            <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label>
            Price (USD)
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </label>
          <label>
            Image URL
            <input required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </label>
          <label>
            Phone
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="formActions">
          <button type="submit" className="button primary">
            {submitLabel}
          </button>
          {editingId && (
            <button type="button" className="button secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {status && <p className="statusText">{status}</p>}

      <h2>Current Items</h2>
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="adminList">
          {items.map((item) => (
            <article className="adminItem" key={item.id}>
              <div>
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="adminItemActions">
                <button className="button secondary" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button className="button danger" onClick={() => handleDelete(item.id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
