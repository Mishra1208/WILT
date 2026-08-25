import React, { useState } from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/seedData';

export const NewConceptModal = () => {
  const { isNewConceptModalOpen, setIsNewConceptModalOpen, createConcept } = useApp();
  const { user } = useAuth();

  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('Banking');
  const [customCategory, setCustomCategory] = useState('');
  const [plainExplanation, setPlainExplanation] = useState('');
  const [definition, setDefinition] = useState('');
  const [formula, setFormula] = useState('');

  if (!isNewConceptModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!term.trim() || !definition.trim()) return;

    const finalCategory = category === 'Other' 
      ? (customCategory.trim() || 'Other') 
      : category;

    createConcept({
      term,
      category: finalCategory,
      plainExplanation,
      definition,
      formula,
      contributor: user?.username || 'peer'
    });

    setTerm('');
    setCustomCategory('');
    setPlainExplanation('');
    setDefinition('');
    setFormula('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Add Concept to Glossary
              </h2>
              <p className="text-xs text-slate-500">
                Contribute a peer-explained finance or tech definition
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewConceptModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-semibold"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {category === 'Other' && (
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Custom topic..."
                  className="w-full px-2.5 py-1 text-xs rounded-xl bg-white border-2 border-primary-500 text-slate-900 font-bold focus:outline-none animate-fadeIn"
                />
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Concept / Term
              </label>
              <input
                type="text"
                required
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Reverse Repo Rate"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>Plain English Explanation (Analogies welcome)</span>
            </label>
            <textarea
              rows={2}
              value={plainExplanation}
              onChange={(e) => setPlainExplanation(e.target.value)}
              placeholder="Simple analogy or 1-sentence real-world explanation..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Academic Definition
            </label>
            <textarea
              required
              rows={3}
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Precise textbook or financial definition..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Formula or Model (Optional)
            </label>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. Net PPE = Gross PPE - Accumulated Depreciation"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-primary-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewConceptModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-btn transition-all transform active:scale-95"
            >
              Add to Glossary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
