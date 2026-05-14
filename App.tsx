import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Crown,
  Gauge,
  Home,
  LineChart,
  LogIn,
  Settings,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Wallet,
} from 'lucide-react';

type Screen = 'splash' | 'login' | 'cadastro' | 'home' | 'relatorios' | 'ia' | 'perfil' | 'config';

type Transaction = { id: number; title: string; amount: number; type: 'income' | 'expense'; category: string; date: string };

type Goal = { id: number; name: string; current: number; total: number };

const incomeCategories = ['Salário', 'Negócio', 'Freelance', 'M-Pesa', 'E-mola', 'Bónus', 'Outros'];
const expenseCategories = ['Transporte chapa', 'Combustível', 'Energia', 'Água', 'Renda', 'Internet', 'Mercado', 'Escola', 'Xima/comida', 'Airtel', 'Vodacom', 'Movitel', 'Dívidas', 'Saúde', 'Entretenimento'];

const seedTransactions: Transaction[] = [
  { id: 1, title: 'Salário Abril', amount: 42000, type: 'income', category: 'Salário', date: '2026-05-02' },
  { id: 2, title: 'Mercado semanal', amount: 3900, type: 'expense', category: 'Mercado', date: '2026-05-05' },
  { id: 3, title: 'Freelance design', amount: 6500, type: 'income', category: 'Freelance', date: '2026-05-09' },
  { id: 4, title: 'Transporte chapa', amount: 1200, type: 'expense', category: 'Transporte chapa', date: '2026-05-10' },
];

const seedGoals: Goal[] = [
  { id: 1, name: 'Comprar terreno', current: 120000, total: 450000 },
  { id: 2, name: 'Comprar motorizada', current: 46000, total: 95000 },
  { id: 3, name: 'Construir casa', current: 275000, total: 1200000 },
];

const mzn = (v: number) => `${v.toLocaleString('pt-MZ')} MZN`;

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [transactions, setTransactions] = useState(seedTransactions);
  const [goals] = useState(seedGoals);
  const [plan, setPlan] = useState<'free' | 'premium'>('free');
  const [offlineMode, setOfflineMode] = useState(true);

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const addDemo = (type: 'income' | 'expense') => {
    const category = type === 'income' ? incomeCategories[3] : expenseCategories[0];
    const amount = type === 'income' ? 1500 : 700;
    setTransactions((prev) => [{ id: Date.now(), title: type === 'income' ? 'Entrada rápida' : 'Saída rápida', amount, type, category, date: '2026-05-14' }, ...prev]);
  };

  if (screen === 'splash') {
    return <div className="min-h-screen bg-[#0b0f0e] text-white flex flex-col items-center justify-center gap-4">
      <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-700 grid place-items-center shadow-2xl"><Wallet /></div>
      <h1 className="text-4xl font-black">Peso Smart MZ</h1>
      <p className="text-emerald-100/80">Controle financeiro inteligente para Moçambique</p>
      <button className="mt-4 px-5 py-3 rounded-2xl bg-white text-black font-semibold" onClick={() => setScreen('login')}>Entrar</button>
    </div>;
  }

  const Nav = () => <nav className="fixed bottom-0 inset-x-0 bg-black/90 border-t border-emerald-900 p-3 flex justify-around text-xs">
    {[
      ['home', Home], ['relatorios', LineChart], ['ia', Brain], ['perfil', Crown], ['config', Settings]
    ].map(([key, Icon]) => <button key={key} onClick={() => setScreen(key as Screen)} className={`flex flex-col items-center gap-1 ${screen === key ? 'text-emerald-400' : 'text-gray-400'}`}><Icon size={16} />{key}</button>)}
  </nav>;

  return <div className="min-h-screen bg-[#f6f8f7] text-[#121212] pb-24">
    {screen === 'login' && <section className="p-6 max-w-md mx-auto pt-20">
      <h2 className="text-3xl font-bold mb-2">Login</h2><p className="text-gray-500 mb-8">Acesse seu cofre financeiro.</p>
      <button onClick={() => setScreen('home')} className="w-full mb-3 rounded-2xl bg-black text-white py-3 flex items-center justify-center gap-2"><LogIn size={18}/>Entrar</button>
      <button onClick={() => setScreen('cadastro')} className="w-full rounded-2xl border py-3 flex items-center justify-center gap-2"><UserPlus size={18}/>Criar conta</button>
    </section>}

    {screen === 'cadastro' && <section className="p-6 max-w-md mx-auto pt-20"><h2 className="text-3xl font-bold">Cadastro</h2><p className="text-gray-500 mb-6">Novo utilizador do Peso Smart MZ.</p><button onClick={() => setScreen('home')} className="rounded-2xl bg-emerald-600 text-white px-5 py-3">Concluir</button></section>}

    {screen === 'home' && <section className="p-5 space-y-4">
      <header className="rounded-3xl bg-gradient-to-br from-black to-[#1a2925] text-white p-5">
        <p className="text-sm text-emerald-300">Saldo atual</p><h2 className="text-3xl font-black">{mzn(summary.balance)}</h2>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm"><div className="bg-white/10 p-3 rounded-2xl"><TrendingUp size={15}/> Receitas: {mzn(summary.income)}</div><div className="bg-white/10 p-3 rounded-2xl"><TrendingDown size={15}/> Despesas: {mzn(summary.expense)}</div></div>
      </header>
      <div className="grid grid-cols-2 gap-3"><button onClick={() => addDemo('income')} className="bg-emerald-600 text-white p-3 rounded-2xl">+ Receita</button><button onClick={() => addDemo('expense')} className="bg-black text-white p-3 rounded-2xl">+ Despesa</button></div>
      <article className="bg-white rounded-3xl p-4 shadow-sm"><h3 className="font-semibold flex items-center gap-2"><BarChart3 size={16}/>Gráficos & Alertas</h3><p className="text-sm text-gray-600 mt-2">Você gastou 18% acima da média em Transporte chapa.</p><div className="h-3 rounded-full bg-gray-100 mt-3"><div className="h-3 rounded-full bg-emerald-500" style={{width:'62%'}}/></div></article>
      <article className="bg-white rounded-3xl p-4"><h3 className="font-semibold flex items-center gap-2"><Target size={16}/>Metas financeiras</h3>{goals.map(g=>{const pct=Math.round((g.current/g.total)*100);return <div key={g.id} className="mt-3"><div className="flex justify-between text-sm"><span>{g.name}</span><span>{pct}%</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-black rounded-full" style={{width:`${pct}%`}}/></div><p className="text-xs text-gray-500">{mzn(g.current)} de {mzn(g.total)}</p></div>;})}</article>
    </section>}

    {screen === 'relatorios' && <section className="p-5"><h2 className="text-2xl font-bold flex items-center gap-2"><LineChart/>Relatórios</h2><p className="text-gray-500">Resumo automático mensal, exportação PDF e visão por operadora (Airtel/Vodacom/Movitel) no Premium.</p></section>}
    {screen === 'ia' && <section className="p-5 space-y-3"><h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles/>IA Financeira</h2><div className="bg-white rounded-3xl p-4"><p className="font-semibold">Análise inteligente</p><p className="text-sm text-gray-600">Se reduzir Mercado em 8% e Airtel em 10%, você poupa ~{mzn(2100)}/mês.</p></div><div className="bg-black text-white rounded-3xl p-4"><p className="font-semibold">Motivação</p><p>Continue firme! Faltam 52% para sua motorizada 🏍️</p></div></section>}
    {screen === 'perfil' && <section className="p-5"><h2 className="text-2xl font-bold flex items-center gap-2"><Award/>Gamificação</h2><div className="bg-white rounded-3xl p-4 mt-3"><p>Nível atual: <b>7</b> <Gauge className="inline" size={14}/></p><p className="text-sm text-gray-600">Conquistas: Guardião do Orçamento, Ninja do M-Pesa.</p></div></section>}
    {screen === 'config' && <section className="p-5 space-y-3"><h2 className="text-2xl font-bold">Configurações</h2><div className="bg-white rounded-2xl p-4 flex justify-between"><span>Modo offline</span><button onClick={()=>setOfflineMode(!offlineMode)}>{offlineMode?'Ativo':'Inativo'}</button></div><div className="bg-white rounded-2xl p-4 flex justify-between"><span>Plano</span><button onClick={()=>setPlan(plan==='free'?'premium':'free')} className="font-semibold">{plan==='free'?'Grátis (50 transações)':'Premium'}</button></div><p className="text-sm text-gray-500 flex gap-2"><AlertTriangle size={15}/>Sincroniza automaticamente ao reconectar.</p></section>}
    <Nav />
  </div>;
};

export default App;
