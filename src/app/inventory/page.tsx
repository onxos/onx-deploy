export default function InventoryIndexPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <ul className="space-y-2">
        <li>
          <a href="/inventory/items" className="text-blue-600 underline">
            Items
          </a>
        </li>
        <li>
          <a href="/inventory/categories" className="text-blue-600 underline">
            Categories
          </a>
        </li>
      </ul>
    </main>
  );
}
