export default function HrIndexPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Human Resources</h1>
      <ul className="space-y-2">
        <li>
          <a href="/hr/employees" className="text-blue-600 underline">
            Employees
          </a>
        </li>
        <li>
          <a href="/hr/departments" className="text-blue-600 underline">
            Departments
          </a>
        </li>
      </ul>
    </main>
  );
}
