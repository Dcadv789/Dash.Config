import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  pagina: string;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onSave, pagina }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Buscar a maior ordem existente para a página
      const { data: existingConfigs } = await supabase
        .from('config_visualizacoes')
        .select('ordem')
        .eq('pagina', pagina)
        .order('ordem', { ascending: false })
        .limit(1);

      const nextOrder = existingConfigs && existingConfigs.length > 0 
        ? existingConfigs[0].ordem + 1 
        : 1;

      const { error } = await supabase
        .from('config_visualizacoes')
        .insert({
          pagina,
          nome_exibicao: formData.get('nome_exibicao'),
          tipo_visualizacao: formData.get('tipo_visualizacao'),
          fonte_dados: formData.get('fonte_dados'),
          ordem: nextOrder,
          ativo: true
        });

      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Erro ao salvar widget:', error);
      setError('Erro ao salvar widget. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">Novo Widget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome do Widget *
            </label>
            <input
              type="text"
              name="nome_exibicao"
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo de Visualização *
            </label>
            <select
              name="tipo_visualizacao"
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Selecione um tipo</option>
              <option value="card">Card</option>
              <option value="lista">Lista</option>
              <option value="grafico">Gráfico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fonte de Dados *
            </label>
            <select
              name="fonte_dados"
              required
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Selecione uma fonte</option>
              <option value="indicador">Indicador</option>
              <option value="categoria">Categoria</option>
              <option value="registro_de_vendas">Registro de Vendas</option>
              <option value="cliente">Cliente</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWidgetModal;