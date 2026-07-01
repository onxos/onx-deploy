export default function CrmIndexPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">CRM</h1>
      <ul className="space-y-2">
        <li>
          <a href="/crm/clients" className="text-blue-600 underline">
            Clients
          </a>
        </li>
        <li>
          <a href="/crm/pets" className="text-blue-600 underline">
            Pets
          </a>
        </li>
      </ul>
    </main>
  );
}
