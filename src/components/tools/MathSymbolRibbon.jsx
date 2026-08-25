import React, { useState } from 'react';
import { Sigma, Sparkles, BookOpen, Layers, X, Copy, Check } from 'lucide-react';

export const MathSymbolRibbon = ({ onInsertSymbol, onInsertFormula, onClose }) => {
  const [activeTab, setActiveTab] = useState('math');
  const [copiedSymbol, setCopiedSymbol] = useState(null);

  const mathSymbols = [
    { label: 'Fraction', symbol: 'a/b', insert: '\\frac{a}{b}', desc: 'Fraction' },
    { label: 'Square Root', symbol: '√x', insert: '\\sqrt{x}', desc: 'Square Root' },
    { label: 'Power / Super', symbol: 'x²', insert: 'x^{2}', desc: 'Superscript' },
    { label: 'Subscript / Period', symbol: 'x_t', insert: 'x_{t}', desc: 'Subscript' },
    { label: 'Summation', symbol: '∑', insert: '\\sum', desc: 'Summation' },
    { label: 'Product', symbol: '∏', insert: '\\prod', desc: 'Product' },
    { label: 'Integral', symbol: '∫', insert: '\\int', desc: 'Integral' },
    { label: 'Delta / Change', symbol: 'Δ', insert: '\\Delta', desc: 'Change / Difference' },
    { label: 'Mean / Average', symbol: 'x̄', insert: '\\bar{x}', desc: 'Sample Mean' },
    { label: 'Plus / Minus', symbol: '±', insert: '±', desc: 'Plus-minus' },
    { label: 'Multiply', symbol: '×', insert: '×', desc: 'Multiplication' },
    { label: 'Divide', symbol: '÷', insert: '÷', desc: 'Division' },
    { label: 'Dot Product', symbol: '·', insert: '·', desc: 'Dot' },
    { label: 'Approximately', symbol: '≈', insert: '≈', desc: 'Approximately' },
    { label: 'Not Equal', symbol: '≠', insert: '≠', desc: 'Not equal' },
    { label: 'Less or Equal', symbol: '≤', insert: '≤', desc: 'Less than or equal' },
    { label: 'Greater or Equal', symbol: '≥', insert: '≥', desc: 'Greater than or equal' },
    { label: 'Infinity', symbol: '∞', insert: '∞', desc: 'Infinity' },
    { label: 'Percent', symbol: '%', insert: '%', desc: 'Percentage' },
    { label: 'Degree', symbol: '°', insert: '°', desc: 'Degree' },
    { label: 'Partial Diff', symbol: '∂', insert: '∂', desc: 'Partial derivative' },
    { label: 'Dollar', symbol: '$', insert: '$', desc: 'Currency USD' },
    { label: 'Euro', symbol: '€', insert: '€', desc: 'Currency EUR' },
    { label: 'Pound', symbol: '£', insert: '£', desc: 'Currency GBP' },
    { label: 'Implies', symbol: '→', insert: '→', desc: 'Arrow / Implies' },
  ];

  const greekLetters = [
    { name: 'Alpha', symbol: 'α', latex: '\\alpha', meaning: 'Excess risk-adjusted return' },
    { name: 'Beta', symbol: 'β', latex: '\\beta', meaning: 'Market systematic risk / CAPM' },
    { name: 'Gamma', symbol: 'γ', latex: '\\gamma', meaning: 'Rate of change of delta' },
    { name: 'Delta', symbol: 'δ / Δ', latex: '\\Delta', meaning: 'Price sensitivity / change' },
    { name: 'Epsilon', symbol: 'ε', latex: '\\epsilon', meaning: 'Error term / residual' },
    { name: 'Theta', symbol: 'θ', latex: '\\theta', meaning: 'Time decay of options' },
    { name: 'Lambda', symbol: 'λ', latex: '\\lambda', meaning: 'Lagrange multiplier' },
    { name: 'Mu', symbol: 'μ', latex: '\\mu', meaning: 'Mean expected portfolio return' },
    { name: 'Pi', symbol: 'π', latex: '\\pi', meaning: '3.14159' },
    { name: 'Rho', symbol: 'ρ', latex: '\\rho', meaning: 'Correlation coefficient' },
    { name: 'Sigma', symbol: 'σ / Σ', latex: '\\sigma', meaning: 'Volatility / Standard Deviation' },
    { name: 'Tau', symbol: 'τ', latex: '\\tau', meaning: 'Time horizon' },
    { name: 'Phi', symbol: 'φ', latex: '\\phi', meaning: 'Cumulative normal distribution' },
    { name: 'Omega', symbol: 'ω / Ω', latex: '\\Omega', meaning: 'Omega ratio / Sample space' },
  ];

  const financeTemplates = [
    {
      title: 'Net Fixed Assets (PPE)',
      category: 'Accounting',
      formula: 'Net Fixed Assets = Gross PPE - Accumulated Depreciation - Impairment',
      preview: 'Net PPE = Gross PPE - Acc. Dep.'
    },
    {
      title: 'CapEx (Capital Expenditures)',
      category: 'Accounting',
      formula: 'CapEx = Ending PPE - Beginning PPE + Depreciation Expense',
      preview: 'CapEx = ΔPPE + Depreciation'
    },
    {
      title: 'EBITDA',
      category: 'Corporate Finance',
      formula: 'EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization',
      preview: 'Operating Profit before non-cash & capital structure'
    },
    {
      title: 'Free Cash Flow (FCF)',
      category: 'Corporate Finance',
      formula: 'Free Cash Flow = EBITDA - CapEx - ΔWorking Capital - Cash Taxes',
      preview: 'FCF = EBITDA - CapEx - ΔNWC - Taxes'
    },
    {
      title: 'CAPM Expected Return',
      category: 'Investment',
      formula: 'E(R_i) = R_f + β_i * (E(R_m) - R_f)',
      preview: 'Expected Return = Risk-Free + Beta * Market Premium'
    },
    {
      title: 'Net Working Capital',
      category: 'Corporate Finance',
      formula: 'Net Working Capital = Current Assets - Current Liabilities',
      preview: 'NWC = Current Assets - Current Liabilities'
    },
    {
      title: 'Sharpe Ratio',
      category: 'Investment',
      formula: 'Sharpe Ratio = (R_portfolio - R_riskfree) / σ_portfolio',
      preview: 'Risk-adjusted excess return per unit volatility'
    },
    {
      title: 'Weighted Average Cost of Capital (WACC)',
      category: 'Corporate Finance',
      formula: 'WACC = (E/V)*Re + (D/V)*Rd*(1 - Tc)',
      preview: 'Blended cost of equity & after-tax debt'
    },
    {
      title: 'Compound Annual Growth Rate (CAGR)',
      category: 'Finance',
      formula: 'CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1',
      preview: 'CAGR = (EV / BV)^(1/n) - 1'
    },
    {
      title: 'Present Value (TVM)',
      category: 'Finance',
      formula: 'PV = FV / (1 + r)^n',
      preview: 'Discounted future cash flow'
    },
  ];

  const algoTemplates = [
    {
      title: 'BFS Graph Traversal',
      category: 'DSA / Algo',
      formula: 'Time Complexity: O(V + E) | Space Complexity: O(V) | Data Structure: Queue (FIFO)',
      preview: 'Level-by-level shortest path'
    },
    {
      title: 'DFS Graph Traversal',
      category: 'DSA / Algo',
      formula: 'Time Complexity: O(V + E) | Space Complexity: O(V) | Data Structure: Stack / Recursion',
      preview: 'Depth-first maze exploration'
    },
    {
      title: 'Binary Search',
      category: 'DSA / Algo',
      formula: 'Time: O(log N) | Space: O(1) | Condition: Array must be sorted',
      preview: 'Halving search space'
    }
  ];

  const handleSymbolClick = (sym) => {
    onInsertSymbol(sym.insert || sym.symbol || sym.latex);
    setCopiedSymbol(sym.symbol || sym.name);
    setTimeout(() => setCopiedSymbol(null), 1200);
  };

  const handleTemplateClick = (tmpl) => {
    onInsertFormula(`\n\`\`\`\n${tmpl.title}:\n${tmpl.formula}\n\`\`\`\n`);
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-fadeIn select-none mb-4">
      {/* Top Ribbon Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
            ∑
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Formula & Symbol Palette (MS Word / Equation Style)
            </h4>
            <p className="text-[10px] text-slate-300">
              Click any symbol or formula to insert it directly into your notes
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Ribbon Navigation Tabs */}
      <div className="flex items-center gap-1 p-2 bg-slate-100/90 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('math')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'math'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          🔢 Math & Operators
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('greek')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'greek'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          🏛️ Greek Letters (α, β, σ, μ)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('finance')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'finance'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          💼 Financial Equations
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('algo')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'algo'
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
          }`}
        >
          💻 CS & Algo Blueprints
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-4 max-h-60 overflow-y-auto">
        {/* 1. Basic Math & Operators Grid */}
        {activeTab === 'math' && (
          <div className="space-y-3">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {mathSymbols.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSymbolClick(sym)}
                  title={`${sym.label} (${sym.desc})`}
                  className="h-10 rounded-xl bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 flex flex-col items-center justify-center p-1 transition-all group active:scale-95 shadow-xs"
                >
                  <span className="text-sm font-bold text-slate-900 group-hover:text-primary-700 font-mono">
                    {sym.symbol}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate max-w-[50px]">
                    {sym.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 font-mono text-center">
              💡 Tip: Click any symbol above to insert it at your cursor position.
            </p>
          </div>
        )}

        {/* 2. Greek Letters Grid */}
        {activeTab === 'greek' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {greekLetters.map((greek, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSymbolClick(greek)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 text-left transition-all group active:scale-95 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900 group-hover:text-primary-700 font-mono">
                    {greek.symbol}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {greek.name}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  {greek.meaning}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* 3. Finance Models */}
        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {financeTemplates.map((tmpl, idx) => (
              <div
                key={idx}
                onClick={() => handleTemplateClick(tmpl)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-primary-700">
                    {tmpl.title}
                  </h5>
                  <span className="text-[10px] px-2 py-0.2 rounded-md bg-white border border-slate-200 text-slate-500 font-semibold">
                    {tmpl.category}
                  </span>
                </div>
                <code className="text-xs font-mono text-primary-700 bg-white p-1.5 rounded-lg border border-slate-200/80 block truncate">
                  {tmpl.formula}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* 4. Algo Templates */}
        {activeTab === 'algo' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {algoTemplates.map((tmpl, idx) => (
              <div
                key={idx}
                onClick={() => handleTemplateClick(tmpl)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 transition-all cursor-pointer group"
              >
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-primary-700 border border-slate-200 font-semibold">
                  {tmpl.category}
                </span>
                <h5 className="text-xs font-bold text-slate-900 group-hover:text-primary-700 mt-2">
                  {tmpl.title}
                </h5>
                <code className="text-[11px] font-mono text-slate-700 block mt-1">
                  {tmpl.formula}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Feedback */}
      {copiedSymbol && (
        <div className="px-4 py-1.5 bg-emerald-50 border-t border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Inserted "{copiedSymbol}" into your note!</span>
        </div>
      )}
    </div>
  );
};
