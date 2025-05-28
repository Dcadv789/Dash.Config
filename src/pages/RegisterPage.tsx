import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import CompanyList from '../components/companies/CompanyList';
import CompanyFilter from '../components/companies/CompanyFilter';
import CompanyModal from '../components/companies/CompanyModal';
import PartnersModal from '../components/companies/PartnersModal';
import DeactivateModal from '../components/companies/DeactivateModal';
import ClientList from '../components/clients/ClientList';
import ClientModal from '../components/clients/ClientModal';
import { Company } from '../types/company';
import { Client } from '../types/client';
import { companyService } from '../services/companyService';
import { clientService } from '../services/clientService';
import { Plus } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('empresas');
  
  // Estados para Empresas
  const [isCompanyModalOpen, setIsCompanyModalOpen] = React.useState(false);
  const [isPartnersModalOpen, setIsPartnersModalOpen] = React.useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = React.useState(false);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = React.useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [companySearchTerm, setCompanySearchTerm] = React.useState('');
  const [companyStatusFilter, setCompanyStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

  // Estados para Clientes
  const [isClientModalOpen, setIsClientModalOpen] = React.useState(false);
  const [selectedClientCompanyId, setSelectedClientCompanyId] = React.useState<string>('');
  const [clients, setClients] = React.useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = React.useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = React.useState('');
  const [clientActiveFilter, setClientActiveFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
  
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [companiesData, clientsData] = await Promise.all([
        companyService.getCompanies(),
        clientService.getClients()
      ]);
      
      setCompanies(companiesData);
      setFilteredCompanies(companiesData);
      setClients(clientsData);
      setFilteredClients(clientsData);

      if (companiesData.length > 0) {
        setSelectedClientCompanyId(companiesData[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers para Empresas
  const handleCompanySearch = (term: string) => {
    setCompanySearchTerm(term);
    filterCompanies(term, companyStatusFilter);
  };

  const handleCompanyStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setCompanyStatusFilter(status);
    filterCompanies(companySearchTerm, status);
  };

  const filterCompanies = (searchTerm: string, status: 'all' | 'active' | 'inactive') => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.nome_fantasia && company.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase())) ||
        company.cnpj.includes(searchTerm)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(company => 
        status === 'active' ? company.ativo : !company.ativo
      );
    }

    setFilteredCompanies(filtered);
  };

  // Handlers para Clientes
  const handleClientSearch = (term: string) => {
    setClientSearchTerm(term);
    filterClients();
  };

  const filterClients = () => {
    let filtered = clients;

    if (selectedClientCompanyId) {
      filtered = filtered.filter(client => client.empresa_id === selectedClientCompanyId);
    }

    if (clientActiveFilter !== 'all') {
      filtered = filtered.filter(client => 
        clientActiveFilter === 'active' ? client.ativo : !client.ativo
      );
    }

    if (clientSearchTerm) {
      const term = clientSearchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.razao_social.toLowerCase().includes(term) ||
        (client.nome_fantasia && client.nome_fantasia.toLowerCase().includes(term)) ||
        client.cnpj.includes(term) ||
        client.codigo.toLowerCase().includes(term)
      );
    }

    setFilteredClients(filtered);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Cadastros</h1>
        <p className="text-gray-300">
          Gerencie os cadastros do sistema.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border border-dark-700/50 mb-6">
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="empresas">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="w-full">
              <CompanyFilter 
                onSearch={handleCompanySearch}
                onStatusFilter={handleCompanyStatusFilter}
              />
            </div>
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              <Plus size={20} className="mr-2" />
              Nova Empresa
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800">
              <div className="text-gray-400">Carregando...</div>
            </div>
          ) : (
            <CompanyList
              companies={filteredCompanies}
              onEdit={(company) => {
                setSelectedCompany(company);
                setIsCompanyModalOpen(true);
              }}
              onDelete={async (id) => {
                if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
                try {
                  await companyService.deleteCompany(id);
                  await loadData();
                } catch (error) {
                  console.error('Erro ao excluir empresa:', error);
                }
              }}
              onManagePartners={(company) => {
                setSelectedCompany(company);
                setIsPartnersModalOpen(true);
              }}
              onToggleActive={(company) => {
                if (company.ativo) {
                  setSelectedCompany(company);
                  setIsDeactivateModalOpen(true);
                } else {
                  handleActivateCompany(company.id);
                }
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="clientes">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Clientes</h2>
              <p className="text-gray-400">Gerencie os clientes cadastrados no sistema.</p>
            </div>
            <button 
              onClick={() => setIsClientModalOpen(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Cliente
            </button>
          </div>

          <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative md:w-1/2">
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={clientSearchTerm}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>

              <select
                value={selectedClientCompanyId}
                onChange={(e) => setSelectedClientCompanyId(e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Todas as empresas</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.razao_social}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setClientActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    clientActiveFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setClientActiveFilter('active')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    clientActiveFilter === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  Ativos
                </button>
                <button
                  onClick={() => setClientActiveFilter('inactive')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    clientActiveFilter === 'inactive'
                      ? 'bg-red-600 text-white'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  Inativos
                </button>
              </div>
            </div>
          </div>

          <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Carregando clientes...</p>
              </div>
            ) : (
              <ClientList 
                clients={filteredClients}
                onEdit={(client) => {
                  setSelectedClient(client);
                  setIsClientModalOpen(true);
                }}
                onDelete={async (id) => {
                  if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
                  try {
                    await clientService.deleteClient(id);
                    await loadData();
                  } catch (error) {
                    console.error('Erro ao excluir cliente:', error);
                  }
                }}
                onToggleActive={async (client) => {
                  try {
                    await clientService.toggleClientActive(client.id, !client.ativo);
                    await loadData();
                  } catch (error) {
                    console.error('Erro ao alterar status do cliente:', error);
                  }
                }}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modais de Empresa */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setSelectedCompany(null);
        }}
        onSave={loadData}
        company={selectedCompany}
      />

      {selectedCompany && (
        <>
          <PartnersModal
            isOpen={isPartnersModalOpen}
            onClose={() => {
              setIsPartnersModalOpen(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
          />
          <DeactivateModal
            isOpen={isDeactivateModalOpen}
            onClose={() => {
              setIsDeactivateModalOpen(false);
              setSelectedCompany(null);
            }}
            onConfirm={loadData}
            company={selectedCompany}
          />
        </>
      )}

      {/* Modal de Cliente */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
        onSave={loadData}
        selectedCompanyId={selectedClientCompanyId}
        client={selectedClient}
      />
    </div>
  );
};

export default RegisterPage;