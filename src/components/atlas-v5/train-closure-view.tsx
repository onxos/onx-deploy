import type { AtlasTrainId } from "@/lib/atlas-v5/execution-records";
import {
  atlasV5ExecutionRecords,
  getAtlasTrain,
  getAtlasV5ProgramSummary,
} from "@/lib/atlas-v5/execution-records";

interface TrainClosureViewProps {
  trainId?: AtlasTrainId;
  title?: string;
}

export function TrainClosureView({ trainId, title }: TrainClosureViewProps) {
  const selectedTrain = trainId ? getAtlasTrain(trainId) : undefined;
  const trains = selectedTrain ? [selectedTrain] : atlasV5ExecutionRecords;
  const summary = getAtlasV5ProgramSummary();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Atlas V5</p>
            <h1 className="text-3xl font-semibold text-slate-950">
              {title ?? selectedTrain?.title ?? "Execution Closure Console"}
            </h1>
          </div>
          <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {summary.acceptancePassed}/{summary.acceptanceTotal} AC PASS
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Metric
            label="Trains"
            value={`${summary.trainsClosed}/${summary.trainsTotal}`}
          />
          <Metric
            label="Work Packages"
            value={`${summary.workPackagesPassed}/${summary.workPackagesTotal}`}
          />
          <Metric label="Program" value={summary.status} />
          <Metric label="Evidence Root" value={summary.evidenceRoot} />
        </div>
      </section>

      {trains.map((train) => (
        <section
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          key={train.id}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-emerald-700">
                Train {train.id} · {train.status}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                {train.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {train.objective}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Dependencies: {train.dependencies}
              </p>
            </div>
            <div className="min-w-64 rounded-md border border-slate-200 p-4 text-sm">
              <p className="font-semibold text-slate-900">Closure Language</p>
              <p className="mt-2 text-slate-600">
                Residual risk: {train.residualRisk}
              </p>
              <p className="mt-2 text-slate-600">Next step: {train.nextStep}</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-md border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">WP</th>
                  <th className="px-4 py-3 font-semibold">Workflow</th>
                  <th className="px-4 py-3 font-semibold">Route</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">AC</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {train.workPackages.map((wp) => (
                  <tr className="border-t border-slate-100" key={wp.id}>
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {wp.id}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="block font-medium text-slate-900">
                        {wp.title}
                      </span>
                      <span className="mt-1 block text-slate-500">
                        {wp.summary}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{wp.route}</td>
                    <td className="px-4 py-3 text-slate-600">{wp.owner}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {wp.acceptancePassed}/{wp.acceptanceTotal}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {wp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}
