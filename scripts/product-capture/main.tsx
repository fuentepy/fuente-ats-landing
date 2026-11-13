// UI real del ATS; únicamente sus fuentes de datos se sustituyen en capture-product.mjs.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Postulaciones from '@/pages/Postulaciones';
import '@ats-styles';

const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}>
    <MemoryRouter><main><Postulaciones /></main></MemoryRouter>
  </QueryClientProvider>,
);
