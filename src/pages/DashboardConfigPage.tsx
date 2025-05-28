import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import AddWidgetModal from '../components/dashboard/AddWidgetModal';
import CompanySelect from '../components/database/CompanySelect';

const DashboardConfigPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('home');
  const [selectedType, setSelectedType] = useState<'all' | 'card' | 'lista' | 'grafico'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveWidget = () => {
    setIsModalOpen(false);
    // Recarregar widgets
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Configuração de Dashboards</h1>
        </div>
        <CompanySelect />
      </div>

      <Tabs 
        defaultValue="home" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start border border-dark-700/50 mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="analise">Análise</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="tabelas">Tabelas</TabsTrigger>
        </TabsList>

        {['home', 'vendas', 'analise', 'graficos', 'tabelas'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Dashboard {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </h2>
                  <p className="text-gray-400">
                    Configure os elementos visuais que serão exibidos na página {tab}.
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Novo Widget
                </button>
              </div>

              <div className="bg-dark-900/95 backdrop-blur-sm rounded-xl border border-dark-800 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative md:w-1/3">
                    <input
                      type="text"
                      placeholder="Buscar widgets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedType === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setSelectedType('card')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedType === 'card'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      onClick={() => setSelectedType('grafico')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedType === 'grafico'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      Gráficos
                    </button>
                    <button
                      onClick={() => setSelectedType('lista')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedType === 'lista'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      Listas
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStatus('all')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedStatus === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setSelectedStatus('active')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedStatus === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      Ativos
                    </button>
                    <button
                      onClick={() => setSelectedStatus('inactive')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedStatus === 'inactive'
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
                <div className="text-center py-8 text-gray-400">
                  Nenhum widget configurado para esta página.
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWidget}
        pagina={selectedTab}
      />
    </div>
  );
};

export default DashboardConfigPage;