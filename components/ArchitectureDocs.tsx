
import React from 'react';
import { FileCode, Database, Server } from 'lucide-react';
import { SQL_SCHEMA_DOCS } from '../types';
import { PYTHON_LOGIC_DOCS } from '../utils/estimation';

const CodeBlock = ({ title, code, icon: Icon }: { title: string, code: string, icon: any }) => (
  <div className="bg-white border border-nexus-border rounded-xl overflow-hidden mb-8 shadow-sm">
    <div className="bg-nexus-bg px-4 py-3 border-b border-nexus-border flex items-center gap-2">
      <Icon className="w-4 h-4 text-nexus-primary" />
      <h3 className="text-sm font-bold text-nexus-dark font-sans">{title}</h3>
    </div>
    <div className="p-4 overflow-x-auto bg-slate-50">
      <pre className="text-xs text-nexus-slate font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  </div>
);

const ArchitectureDocs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-nexus-dark mb-2">Arquitetura do Sistema</h2>
        <p className="text-nexus-slate font-medium">
          Detalhamento técnico dos entregáveis de Backend e Banco de Dados.
        </p>
      </div>

      <CodeBlock 
        title="1. Estrutura de Dados (PostgreSQL / Supabase)" 
        code={SQL_SCHEMA_DOCS}
        icon={Database}
      />

      <CodeBlock 
        title="2. Lógica de Backend (Python / Web Scraping)" 
        code={PYTHON_LOGIC_DOCS}
        icon={Server}
      />

       <div className="bg-white border border-nexus-border rounded-xl p-6 shadow-sm">
          <h3 className="text-nexus-dark font-bold mb-2 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-nexus-slate" />
            3. Integrações & Stack
          </h3>
          <ul className="list-disc list-inside text-sm text-nexus-slate space-y-2 ml-2">
            <li><strong className="text-nexus-dark">Google Custom Search API:</strong> Usada para descoberta de domínios corporativos.</li>
            <li><strong className="text-nexus-dark">Gemini 2.5 Flash:</strong> Utilizado para enriquecimento de dados e extração de Horários de Funcionamento via Maps.</li>
          </ul>
       </div>
    </div>
  );
};

export default ArchitectureDocs;
