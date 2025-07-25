import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, Save, Package, Image as ImageIcon } from 'lucide-react';
import { useDeliveryProducts } from '../../hooks/useDeliveryProducts';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ComplementOption {
  name: string;
  price: number;
  description: string;
}

interface ComplementGroup {
  name: string;
  required: boolean;
  min_items: number;
  max_items: number;
  options: ComplementOption[];
}

interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description: string;
  image_url?: string;
  is_active: boolean;
  is_weighable: boolean;
  price_per_gram?: number;
  has_complements: boolean;
  complement_groups?: ComplementGroup[];
  sizes?: any[];
}

const DEFAULT_COMPLEMENT_GROUPS: ComplementGroup[] = [
  {
    name: "TIPO DE AÇAÍ (ESCOLHA 1 ITEM)",
    required: true,
    min_items: 1,
    max_items: 1,
    options: [
      { name: "AÇAÍ PREMIUM TRADICIONAL", price: 0, description: "Açaí tradicional premium" },
      { name: "AÇAÍ PREMIUM (0% AÇÚCAR - FIT)", price: 0, description: "Açaí sem açúcar, ideal para dieta" },
      { name: "AÇAÍ PREMIUM COM MORANGO", price: 0, description: "Açaí premium com sabor morango" }
    ]
  },
  {
    name: "COMO DESEJA A QUANTIDADE DE AÇAÍ?",
    required: true,
    min_items: 1,
    max_items: 1,
    options: [
      { name: "MAIS AÇAÍ", price: 0, description: "Quantidade extra de açaí" },
      { name: "NÃO QUERO AÇAÍ", price: 0, description: "Sem açaí" },
      { name: "MENOS AÇAÍ", price: 0, description: "Quantidade reduzida de açaí" },
      { name: "QUANTIDADE NORMAL", price: 0, description: "Quantidade padrão de açaí" }
    ]
  },
  {
    name: "CREMES * OPCIONAL (ATÉ 2 ITEM)",
    required: false,
    min_items: 0,
    max_items: 2,
    options: [
      { name: "CREME DE CUPUAÇU", price: 0, description: "Creme cremoso de cupuaçu" },
      { name: "CREME DE MORANGO", price: 0, description: "Creme doce de morango" },
      { name: "CREME DE NINHO", price: 0, description: "Creme de leite ninho" },
      { name: "CREME DE NUTELA", price: 0, description: "Creme de nutella" },
      { name: "CREME DE MARACUJÁ", price: 0, description: "Creme azedinho de maracujá" },
      { name: "CREME DE PAÇOCA", price: 0, description: "Creme de paçoca" },
      { name: "CREME DE OVOMALTINE", price: 0, description: "Creme de ovomaltine" },
      { name: "CREME DE PISTACHE", price: 0, description: "Creme de pistache" }
    ]
  },
  {
    name: "3 ADICIONAIS * OPCIONAL (ATÉ 3 ITENS)",
    required: false,
    min_items: 0,
    max_items: 3,
    options: [
      { name: "CASTANHA EM BANDA", price: 0, description: "Castanha em fatias" },
      { name: "CEREJA", price: 0, description: "Cereja doce" },
      { name: "CHOCOBALL MINE", price: 0, description: "Chocoball pequeno" },
      { name: "CHOCOBALL POWER", price: 0, description: "Chocoball grande" },
      { name: "CREME DE COOKIES BRANCO", price: 0, description: "Creme de cookies branco" },
      { name: "CHOCOLATE COM AVELÃ (NUTELA)", price: 0, description: "Chocolate com avelã" },
      { name: "COBERTURA DE CHOCOLATE", price: 0, description: "Cobertura de chocolate" },
      { name: "COBERTURA DE MORANGO", price: 0, description: "Cobertura de morango" },
      { name: "COBERTURA FINE DENTADURA", price: 0, description: "Cobertura fine dentadura" },
      { name: "COBERTURA FINE BANANINHA", price: 0, description: "Cobertura fine bananinha" },
      { name: "COBERTURA FINE BEIJINHO", price: 0, description: "Cobertura fine beijinho" },
      { name: "GANACHE MEIO AMARGO", price: 0, description: "Ganache meio amargo" },
      { name: "GOTAS DE CHOCOLATE PRETO", price: 0, description: "Gotas de chocolate preto" },
      { name: "GRANULADO DE CHOCOLATE", price: 0, description: "Granulado de chocolate" },
      { name: "GRANOLA", price: 0, description: "Granola crocante" },
      { name: "JUJUBA", price: 0, description: "Jujuba colorida" },
      { name: "KIWI", price: 0, description: "Kiwi fatiado" },
      { name: "LEITE CONDENSADO", price: 0, description: "Leite condensado" },
      { name: "LEITE EM PÓ", price: 0, description: "Leite em pó" },
      { name: "MARSHMALLOWS", price: 0, description: "Marshmallows macios" },
      { name: "MMS", price: 0, description: "Confetes coloridos" },
      { name: "MORANGO", price: 0, description: "Morango fresco" },
      { name: "PAÇOCA", price: 0, description: "Paçoca triturada" },
      { name: "RECHEIO LEITINHO", price: 0, description: "Recheio de leitinho" },
      { name: "SUCRILHOS", price: 0, description: "Sucrilhos crocantes" },
      { name: "UVA", price: 0, description: "Uva fresca" },
      { name: "UVA PASSAS", price: 0, description: "Uva passas" },
      { name: "FLOCOS DE TAPIOCA CARAMELIZADO", price: 0, description: "Flocos de tapioca caramelizado" },
      { name: "CANUDOS", price: 0, description: "Canudos crocantes" },
      { name: "OVOMALTINE", price: 0, description: "Ovomaltine em pó" },
      { name: "FARINHA LÁCTEA", price: 0, description: "Farinha láctea" },
      { name: "ABACAXI AO VINHO", price: 0, description: "Abacaxi ao vinho" },
      { name: "AMENDOIM COLORIDO", price: 0, description: "Amendoim colorido" },
      { name: "FINE BEIJINHO", price: 0, description: "Fine beijinho" },
      { name: "FINE AMORA", price: 0, description: "Fine amora" },
      { name: "FINE DENTADURA", price: 0, description: "Fine dentadura" },
      { name: "NESTON EM FLOCOS", price: 0, description: "Neston em flocos" },
      { name: "RECHEIO FERRERO ROCHÊ", price: 0, description: "Recheio ferrero rochê" },
      { name: "AVEIA EM FLOCOS", price: 0, description: "Aveia em flocos" },
      { name: "GANACHE CHOCOLATE AO LEITE", price: 0, description: "Ganache chocolate ao leite" },
      { name: "CHOCOBOLL BOLA BRANCA", price: 0, description: "Chocoboll bola branca" },
      { name: "MORANGO EM CALDAS", price: 0, description: "Morango em caldas" },
      { name: "DOCE DE LEITE", price: 0, description: "Doce de leite" },
      { name: "CHOCOWAFER BRANCO", price: 0, description: "Chocowafer branco" },
      { name: "CREME DE COOKIES PRETO", price: 0, description: "Creme de cookies preto" },
      { name: "PASTA DE AMENDOIM", price: 0, description: "Pasta de amendoim" },
      { name: "RECHEIO DE LEITINHO", price: 0, description: "Recheio de leitinho" },
      { name: "BEIJINHO", price: 0, description: "Beijinho" },
      { name: "BRIGADEIRO", price: 0, description: "Brigadeiro" },
      { name: "PORÇÕES DE BROWNIE", price: 0, description: "Porções de brownie" },
      { name: "RASPAS DE CHOCOLATE", price: 0, description: "Raspas de chocolate" },
      { name: "RECHEIO DE FERREIRO ROCHÊ", price: 0, description: "Recheio de ferreiro rochê" }
    ]
  },
  {
    name: "10 ADICIONAIS * OPCIONAL (ATÉ 10 ITENS)",
    required: false,
    min_items: 0,
    max_items: 10,
    options: [
      { name: "AMENDOIN", price: 2, description: "Amendoim torrado" },
      { name: "CASTANHA EM BANDA", price: 3, description: "Castanha em fatias" },
      { name: "CEREJA", price: 2, description: "Cereja doce" },
      { name: "CHOCOBALL MINE", price: 2, description: "Chocoball pequeno" },
      { name: "CHOCOBALL POWER", price: 2, description: "Chocoball grande" },
      { name: "CREME DE COOKIES", price: 3, description: "Creme de cookies" },
      { name: "CHOCOLATE COM AVELÃ (NUTELA)", price: 3, description: "Chocolate com avelã" },
      { name: "COBERTURA DE CHOCOLATE", price: 2, description: "Cobertura de chocolate" },
      { name: "COBERTURA DE MORANGO", price: 2, description: "Cobertura de morango" },
      { name: "GANACHE MEIO AMARGO", price: 2, description: "Ganache meio amargo" },
      { name: "GRANOLA", price: 2, description: "Granola crocante" },
      { name: "GOTAS DE CHOCOLATE", price: 3, description: "Gotas de chocolate" },
      { name: "GRANULADO DE CHOCOLATE", price: 2, description: "Granulado de chocolate" },
      { name: "JUJUBA", price: 2, description: "Jujuba colorida" },
      { name: "KIWI", price: 3, description: "Kiwi fatiado" },
      { name: "LEITE CONDENSADO", price: 2, description: "Leite condensado" },
      { name: "LEITE EM PÓ", price: 3, description: "Leite em pó" },
      { name: "MARSHMALLOWS", price: 2, description: "Marshmallows macios" },
      { name: "MMS", price: 2, description: "Confetes coloridos" },
      { name: "MORANGO", price: 3, description: "Morango fresco" },
      { name: "PAÇOCA", price: 2, description: "Paçoca triturada" },
      { name: "RECHEIO DE NINHO", price: 2, description: "Recheio de ninho" },
      { name: "UVA", price: 2, description: "Uva fresca" },
      { name: "UVA PASSAS", price: 2, description: "Uva passas" },
      { name: "COBERTURA FINE DENTADURA", price: 2, description: "Cobertura fine dentadura" },
      { name: "COBERTURA FINE BEIJINHO", price: 2, description: "Cobertura fine beijinho" },
      { name: "COBERTURA FINE BANANINHA", price: 2, description: "Cobertura fine bananinha" }
    ]
  },
  {
    name: "VOCÊ PREFERE OS OPCIONAIS SEPARADOS OU JUNTO COM O AÇAÍ?",
    required: true,
    min_items: 1,
    max_items: 1,
    options: [
      { name: "SIM, QUERO TUDO JUNTO", price: 0, description: "Misturar tudo com o açaí" },
      { name: "NÃO, QUERO SEPARADOS", price: 0, description: "Servir os complementos separadamente" }
    ]
  },
  {
    name: "CONSUMA MENOS DESCARTÁVEIS.",
    required: true,
    min_items: 1,
    max_items: 1,
    options: [
      { name: "SIM, VOU QUERER A COLHER", price: 0, description: "Incluir colher descartável" },
      { name: "NÃO QUERO COLHER, VOU AJUDAR AO MEIO AMBIENTE", price: 0, description: "Sem colher, ajudando o meio ambiente" }
    ]
  }
];

const ProductsPanel: React.FC = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useDeliveryProducts();
  const { uploadImage, uploading } = useImageUpload();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'acai',
    price: 0,
    description: '',
    is_active: true,
    is_weighable: false,
    has_complements: false,
    complement_groups: []
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'acai',
      price: 0,
      description: '',
      is_active: true,
      is_weighable: false,
      has_complements: false,
      complement_groups: []
    });
    setEditingProduct(null);
  };

  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (product: any) => {
    const productData: ProductFormData = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.original_price,
      description: product.description,
      image_url: product.image_url,
      is_active: product.is_active,
      is_weighable: product.is_weighable,
      price_per_gram: product.price_per_gram,
      has_complements: product.has_complements,
      complement_groups: Array.isArray(product.complement_groups) ? product.complement_groups : []
    };
    
    setFormData(productData);
    setEditingProduct(productData);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id!, formData);
      } else {
        await createProduct(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file, 'products');
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  const applyDefaultComplementGroups = () => {
    setFormData(prev => ({
      ...prev,
      has_complements: true,
      complement_groups: [...DEFAULT_COMPLEMENT_GROUPS]
    }));
  };

  const addComplementGroup = () => {
    const newGroup: ComplementGroup = {
      name: "Novo Grupo",
      required: false,
      min_items: 0,
      max_items: 1,
      options: []
    };
    
    setFormData(prev => ({
      ...prev,
      complement_groups: [...(prev.complement_groups || []), newGroup]
    }));
  };

  const updateComplementGroup = (groupIndex: number, updates: Partial<ComplementGroup>) => {
    setFormData(prev => ({
      ...prev,
      complement_groups: prev.complement_groups?.map((group, index) =>
        index === groupIndex ? { ...group, ...updates } : group
      ) || []
    }));
  };

  const removeComplementGroup = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      complement_groups: prev.complement_groups?.filter((_, index) => index !== groupIndex) || []
    }));
  };

  const addComplementOption = (groupIndex: number) => {
    const newOption: ComplementOption = {
      name: "",
      price: 0,
      description: ""
    };
    
    setFormData(prev => ({
      ...prev,
      complement_groups: prev.complement_groups?.map((group, index) =>
        index === groupIndex 
          ? { ...group, options: [...group.options, newOption] }
          : group
      ) || []
    }));
  };

  const updateComplementOption = (groupIndex: number, optionIndex: number, updates: Partial<ComplementOption>) => {
    setFormData(prev => ({
      ...prev,
      complement_groups: prev.complement_groups?.map((group, gIndex) =>
        gIndex === groupIndex
          ? {
              ...group,
              options: group.options.map((option, oIndex) =>
                oIndex === optionIndex ? { ...option, ...updates } : option
              )
            }
          : group
      ) || []
    }));
  };

  const removeComplementOption = (groupIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      complement_groups: Array.isArray(prev.complement_groups) ? prev.complement_groups.map((group, gIndex) =>
        gIndex === groupIndex
          ? { ...group, options: group.options.filter((_, oIndex) => oIndex !== optionIndex) }
          : group
      ) : []
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.is_active ? 'Ativo' : 'Inativo'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coluna Esquerda - Informações Básicas */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Informações Básicas
                      </h4>
                      
                      {/* Upload de Imagem */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Imagem do Produto
                        </label>
                        <div className="text-xs text-gray-500 mb-2">
                          💡 Dica: Clique em "Alterar Imagem" para fazer upload de uma nova imagem<br/>
                          🔄 A imagem será salva automaticamente no banco de dados<br/>
                          📱 Imagens ficam sincronizadas em todos os dispositivos
                        </div>
                        <div className="flex items-center gap-4">
                          {formData.image_url ? (
                            <img
                              src={formData.image_url}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Enviando...' : 'Alterar Imagem'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                              className="hidden"
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Produto *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria *
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="acai">Açaí</option>
                            <option value="combo">Combo</option>
                            <option value="milkshake">Milkshake</option>
                            <option value="vitamina">Vitamina</option>
                            <option value="sorvetes">Sorvetes</option>
                            <option value="bebidas">Bebidas</option>
                            <option value="complementos">Complementos</option>
                            <option value="sobremesas">Sobremesas</option>
                            <option value="outros">Outros</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preço (R$) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preço Original (R$)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.original_price || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || undefined }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Para produtos em promoção (preço riscado)"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.is_weighable}
                              onChange={(e) => setFormData(prev => ({ ...prev, is_weighable: e.target.checked }))}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Produto pesável (vendido por peso)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna Direita - Tamanhos */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-4">Tamanhos do Produto</h4>
                      <p className="text-gray-500 text-sm mb-4">Nenhum tamanho configurado</p>
                      <button
                        type="button"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Tamanho
                      </button>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                {/* Grupos de Complementos */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Grupos de Complementos</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={applyDefaultComplementGroups}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Aplicar Grupos Padrão
                      </button>
                      <button
                        type="button"
                        onClick={addComplementGroup}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Grupo
                      </button>
                    </div>
                  </div>

                  {formData.complement_groups && formData.complement_groups.length > 0 ? (
                    <div className="space-y-6">
                      {formData.complement_groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Nome do Grupo
                                </label>
                                <input
                                  type="text"
                                  value={group.name}
                                  onChange={(e) => updateComplementGroup(groupIndex, { name: e.target.value })}
                                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mín. Itens
                                  </label>
                                  <input
                                    type="number"
                                    value={group.min_items}
                                    onChange={(e) => updateComplementGroup(groupIndex, { min_items: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Máx. Itens
                                  </label>
                                  <input
                                    type="number"
                                    value={group.max_items}
                                    onChange={(e) => updateComplementGroup(groupIndex, { max_items: parseInt(e.target.value) || 1 })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={group.required}
                                    onChange={(e) => updateComplementGroup(groupIndex, { required: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    Obrigatório
                                  </span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeComplementGroup(groupIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Complementos */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-sm">
                                Complementos ({group.options.length})
                              </h5>
                              <button
                                type="button"
                                onClick={() => addComplementOption(groupIndex)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Adicionar Complemento
                              </button>
                            </div>

                            {group.options.length > 0 && (
                              <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700 bg-gray-100 p-2 rounded">
                                <div>Nome</div>
                                <div>Preço (R$)</div>
                                <div className="col-span-2">Descrição</div>
                                <div>Ações</div>
                              </div>
                            )}

                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {group.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="grid grid-cols-5 gap-2 items-center bg-white p-2 rounded border">
                                  <input
                                    type="text"
                                    value={option.name}
                                    onChange={(e) => updateComplementOption(groupIndex, optionIndex, { name: e.target.value })}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Nome"
                                  />
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={option.price}
                                    onChange={(e) => updateComplementOption(groupIndex, optionIndex, { price: parseFloat(e.target.value) || 0 })}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                                  />
                                  <input
                                    type="text"
                                    value={option.description}
                                    onChange={(e) => updateComplementOption(groupIndex, optionIndex, { description: e.target.value })}
                                    className="col-span-2 border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Descrição"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeComplementOption(groupIndex, optionIndex)}
                                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum grupo de complementos configurado</p>
                      <p className="text-sm">Clique em "Aplicar Grupos Padrão" para começar</p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPanel;