
import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Droplets, 
  Leaf, 
  User, 
  MessageCircle, 
  X, 
  ArrowRight,
  Loader2,
  Camera,
  Heart
} from 'lucide-react';
import { getSkinAdvice, generateRecipeVisual } from './services/geminiService';

const RECIPES = [
  { id: 1, name: "Máscara de Mel e Aveia", ingredients: "1 colher de mel, 2 colheres de aveia", method: "Misture bem até formar pasta. Aplique no rosto limpo por 15 minutos. Enxágue com água morna e seque suavemente.", category: "Máscara", benefit: "Hidratação" },
  { id: 2, name: "Esfoliante de Café", ingredients: "2 colheres de borra de café, 1 colher de óleo de coco", method: "Misture e massageie o rosto com movimentos circulares por 2-3 minutos. Enxágue com água morna.", category: "Esfoliante", benefit: "Renovação" },
  { id: 3, name: "Máscara de Iogurte e Limão", ingredients: "2 colheres de iogurte natural, 2-3 gotas de limão", method: "Misture e aplique no rosto limpo por 10 minutos. Enxágue com água fria. Evite sol direto.", category: "Máscara", benefit: "Luminosidade" },
  { id: 4, name: "Máscara de Babosa (Aloe Vera)", ingredients: "2 colheres de gel de babosa", method: "Aplique no rosto limpo por 20 minutos. Enxágue com água fria.", category: "Máscara", benefit: "Calmante" },
  { id: 5, name: "Água de Rosas (Tônico)", ingredients: "Água de rosas pura", method: "Borrife ou aplique com algodão no rosto limpo. Não enxágue.", category: "Tônico", benefit: "Equilíbrio" },
  { id: 6, name: "Máscara de Pepino", ingredients: "Meio pepino ralado, 1 colher de iogurte", method: "Misture e aplique no rosto 15 minutos. Enxágue com água fria.", category: "Máscara", benefit: "Refrescante" },
  { id: 7, name: "Máscara de Argila Verde", ingredients: "2 colheres de argila verde, água mineral", method: "Misture até formar pasta. Aplique no rosto limpo 15 minutos e enxágue.", category: "Máscara", benefit: "Oleosidade" },
  { id: 8, name: "Máscara de Clara de Ovo", ingredients: "1 clara de ovo", method: "Bata e aplique no rosto 10 minutos. Enxágue com água fria.", category: "Máscara", benefit: "Firmeza" },
  { id: 9, name: "Máscara de Aveia e Leite", ingredients: "2 colheres de aveia, leite suficiente", method: "Misture, aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Suavidade" },
  { id: 10, name: "Máscara de Morango", ingredients: "3 morangos maduros, 1 colher de mel", method: "Amasse os morangos, misture com mel. Aplique 10 minutos e enxágue.", category: "Máscara", benefit: "Antioxidante" },
  { id: 11, name: "Máscara de Cenoura", ingredients: "1 cenoura cozida, 2 colheres de iogurte", method: "Amasse a cenoura, misture com iogurte. Aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Nutrição" },
  { id: 12, name: "Máscara de Abacate", ingredients: "Meio abacate maduro, 1 colher de mel", method: "Amasse e misture com mel. Aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Nutrição Profunda" },
  { id: 13, name: "Máscara de Aveia e Mel", ingredients: "2 colheres de aveia, 1 colher de mel", method: "Misture, aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Esfoliação Suave" },
  { id: 14, name: "Máscara de Banana", ingredients: "1 banana madura", method: "Amasse e aplique no rosto 15 minutos. Enxágue.", category: "Máscara", benefit: "Potássio" },
  { id: 15, name: "Máscara de Chá Verde", ingredients: "2 colheres de chá verde frio", method: "Use como compressa no rosto 10 minutos. Não enxágue.", category: "Compressa", benefit: "Desintoxicação" },
  { id: 16, name: "Máscara de Iogurte e Mel", ingredients: "2 colheres de iogurte, 1 colher de mel", method: "Misture, aplique 10 minutos e enxágue.", category: "Máscara", benefit: "Hidratação" },
  { id: 17, name: "Máscara de Pepino e Aveia", ingredients: "Meio pepino ralado, 1 colher de aveia", method: "Misture, aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Purificação" },
  { id: 18, name: "Máscara de Maçã", ingredients: "1 maçã, 1 colher de mel", method: "Amasse a maçã, misture com mel. Aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Vigor" },
  { id: 19, name: "Máscara de Iogurte e Aveia", ingredients: "2 colheres de iogurte, 1 colher de aveia", method: "Misture, aplique 15 minutos e enxágue.", category: "Máscara", benefit: "Equilíbrio pH" },
  { id: 20, name: "Máscara de Mel e Limão", ingredients: "1 colher de mel, algumas gotas de limão", method: "Misture, aplique 10 minutos e enxágue. Evite sol direto após aplicar.", category: "Máscara", benefit: "Manchas" },
];

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<typeof RECIPES[0] | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  
  const [isConsulting, setIsConsulting] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [skinType, setSkinType] = useState('normal');
  const [concern, setConcern] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.benefit.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleRecipeClick = (recipe: typeof RECIPES[0]) => {
    setSelectedRecipe(recipe);
    setGeneratedImage(null);
  };

  const handleGenerateImage = async () => {
    if (!selectedRecipe) return;
    setIsGeneratingImg(true);
    const img = await generateRecipeVisual(selectedRecipe.name, selectedRecipe.ingredients);
    setGeneratedImage(img);
    setIsGeneratingImg(false);
  };

  const handleGetAdvice = async () => {
    if (!concern) return;
    setLoadingAdvice(true);
    const res = await getSkinAdvice(skinType, concern);
    setAdvice(res);
    setLoadingAdvice(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <Leaf className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Pele Limpa</h1>
          </div>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por benefício (ex: manchas)..." 
              className="w-full bg-stone-100 border-none rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setIsConsulting(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline">Consultor IA</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl md:text-6xl font-black text-stone-800 mb-6 leading-tight">
          Natureza em sua <span className="text-emerald-600 italic">pele</span>.
        </h2>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Descubra o poder dos ingredientes naturais. 20 receitas artesanais criadas para restaurar, nutrir e iluminar o seu rosto diariamente.
        </p>
      </section>

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe)}
              className="group bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                  {recipe.benefit}
                </span>
                <Heart size={16} className="text-stone-300 hover:text-red-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-emerald-600 transition-colors">{recipe.name}</h3>
              <p className="text-stone-400 text-sm line-clamp-2">{recipe.ingredients}</p>
              
              <div className="mt-6 flex items-center text-emerald-600 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                VER RECEITA <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="md:w-1/2 bg-stone-50 relative min-h-[300px] flex items-center justify-center">
              {generatedImage ? (
                <img src={generatedImage} alt={selectedRecipe.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center p-12 text-center">
                  <div className={`p-4 rounded-full mb-4 ${isGeneratingImg ? 'bg-emerald-50' : 'bg-stone-100'}`}>
                    {isGeneratingImg ? <Loader2 size={32} className="text-emerald-500 animate-spin" /> : <Camera size={32} className="text-stone-300" />}
                  </div>
                  <h4 className="font-bold text-stone-700 mb-2">Visualização IA</h4>
                  <p className="text-stone-400 text-xs mb-6">Gere uma imagem artística desta receita em um ambiente de spa.</p>
                  <button 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImg}
                    className="bg-stone-800 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-stone-700 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingImg ? 'Gerando...' : 'Gerar Imagem'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8">
                <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">{selectedRecipe.category}</span>
                <h2 className="text-3xl font-black text-stone-800 mt-2 mb-4">{selectedRecipe.name}</h2>
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <Droplets size={16} /> <span>Foco: {selectedRecipe.benefit}</span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Ingredientes
                  </h4>
                  <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    {selectedRecipe.ingredients}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Modo de Preparo
                  </h4>
                  <p className="text-stone-600 leading-relaxed italic">
                    {selectedRecipe.method}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Consultation Panel */}
      {isConsulting && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[60] flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-emerald-600 text-white">
            <div className="flex items-center gap-3">
              <Sparkles size={24} />
              <h2 className="text-xl font-bold">Consultor IA</h2>
            </div>
            <button onClick={() => setIsConsulting(false)} className="hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
            {!advice ? (
              <>
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-sm leading-relaxed">
                  Olá! Sou o seu assistente de beleza. Me diga seu tipo de pele e o que gostaria de melhorar, e eu indicarei as melhores receitas naturais para você.
                </div>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">Tipo de Pele</label>
                    <select 
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="oleosa">Oleosa</option>
                      <option value="seca">Seca</option>
                      <option value="mista">Mista</option>
                      <option value="normal">Normal</option>
                      <option value="sensível">Sensível</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase mb-2 block">Sua Preocupação</label>
                    <textarea 
                      placeholder="Ex: acne, manchas de sol, olheiras..."
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                      value={concern}
                      onChange={(e) => setConcern(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    onClick={handleGetAdvice}
                    disabled={loadingAdvice || !concern}
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingAdvice ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
                    Obter Recomendação
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {advice}
                </div>
                <button 
                  onClick={() => setAdvice(null)}
                  className="w-full py-3 border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all"
                >
                  Nova Consulta
                </button>
              </div>
            )}
          </div>
          
          <footer className="p-8 text-center text-[10px] text-stone-400 border-t border-stone-100">
            Lembre-se: consulte sempre um dermatologista. Esta IA fornece apenas sugestões de cuidados naturais.
          </footer>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-stone-200 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center">
              <Leaf className="text-white" size={14} />
            </div>
            <h1 className="text-lg font-bold text-stone-800 tracking-tight">Pele Limpa</h1>
          </div>
          <p className="text-stone-400 text-xs">Desenvolvido com carinho por Bidjho Amisse & Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
