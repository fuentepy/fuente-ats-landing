// Datos totalmente ficticios. Sin SDK, sesiones, credenciales ni llamadas de red.
const stages = [
  { id: 'revision', name: 'Revisión CV', color: '#60a5fa', position: 0 },
  { id: 'entrevista', name: 'Entrevista', color: '#c084fc', position: 1 },
  { id: 'oferta', name: 'Oferta', color: '#fbbf24', position: 2 },
  { id: 'contratado', name: 'Contratado', color: '#4ade80', position: 3 },
];
const client = { id: 'cliente-demo', name: 'Empresa de ejemplo' };
const job = { id: 'vacante-demo', title: 'Analista administrativo', status: 'active', client_id: client.id, clients: client };
const people = [
  ['Camila', 'Rojas', 'revision'], ['Mateo', 'Duarte', 'revision'], ['Sofía', 'Vera', 'revision'],
  ['Lucía', 'López', 'entrevista'], ['Diego', 'Ortiz', 'entrevista'],
  ['Elena', 'Acosta', 'oferta'], ['Tomás', 'Benítez', 'contratado'],
];
const applications = people.map(([first_name, last_name, stage_id], i) => ({
  id: `postulacion-demo-${i}`, candidate_id: `persona-demo-${i}`, job_id: job.id,
  stage_id, score: null, screening_passed: null, candidates: { first_name, last_name }, jobs: job,
}));
const ready = (data: unknown) => ({ data, isLoading: false, isError: false, refetch: async () => ({ data }) });
export const useApplications = () => ready(applications);
export const usePipelineStages = () => ready(stages);
export const useJobs = () => ready([job]);
export const useClients = () => ready([client]);
export const useAuth = () => ({ userRole: 'owner', tenantId: 'empresa-demo', clientId: null });
export const useCurrentStageDaysMap = () => ready(Object.fromEntries(applications.map((a, i) => [a.id, i % 3 + 2])));
export const useDaysInCurrentStage = () => 1;
export const useMoveApplication = () => ({ mutate: () => { throw new Error('Captura de solo lectura'); } });
export const prefetchCandidate = () => {};
export const prefetchCandidateDetailRoute = () => {};
