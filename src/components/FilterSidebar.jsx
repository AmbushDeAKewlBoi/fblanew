import { useState } from 'react';
import { RESOURCE_TYPES, VISIBILITY_LEVELS } from '../data/mockResources';

export default function FilterSidebar({ filters, setFilters, tagOptions = [] }) {
  const [tagSearch, setTagSearch] = useState('');

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearAll = () => {
    setFilters({ types: [], visibility: [], tags: [], sort: 'recent' });
  };

  const filteredTags = tagOptions.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <aside className="w-72 shrink-0 space-y-6">
      {/* Sort */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:text-warm-400">
          Sort By
        </h4>
        <div className="flex flex-wrap gap-2">
          {['recent', 'popular', 'downloads'].map(sort => (
            <button
              key={sort}
              onClick={() => setFilters(prev => ({ ...prev, sort }))}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filters.sort === sort
                  ? 'bg-navy-800 text-white dark:bg-navy-600'
                  : 'bg-warm-100 text-warm-600 hover:bg-warm-200 dark:bg-warm-800 dark:text-warm-400 dark:hover:bg-warm-700'
              }`}
            >
              {sort === 'recent' ? 'Most Recent' : sort === 'popular' ? 'Most Popular' : 'Most Downloads'}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Type */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:text-warm-400">
          Resource Type
        </h4>
        <div className="space-y-2">
          {RESOURCE_TYPES.map(type => (
            <label
              key={type.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-warm-700 hover:bg-warm-50 dark:text-warm-300 dark:hover:bg-warm-800"
            >
              <input
                type="checkbox"
                checked={(filters.types || []).includes(type.value)}
                onChange={() => toggleFilter('types', type.value)}
                className="h-4 w-4 rounded border-warm-300 text-navy-600 focus:ring-navy-500"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:text-warm-400">
          Visibility
        </h4>
        <div className="space-y-2">
          {VISIBILITY_LEVELS.map(vis => (
            <label
              key={vis.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-warm-700 hover:bg-warm-50 dark:text-warm-300 dark:hover:bg-warm-800"
            >
              <input
                type="checkbox"
                checked={(filters.visibility || []).includes(vis.value)}
                onChange={() => toggleFilter('visibility', vis.value)}
                className="h-4 w-4 rounded border-warm-300 text-navy-600 focus:ring-navy-500"
              />
              <span>{vis.icon} {vis.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tagOptions.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-warm-500 dark:text-warm-400">
            Tags
          </h4>
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="mb-3 w-full rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm dark:border-warm-700 dark:bg-warm-800 dark:text-warm-200"
          />
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
            {filteredTags.slice(0, 20).map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilter('tags', tag)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  (filters.tags || []).includes(tag)
                    ? 'bg-navy-800 text-white dark:bg-navy-600'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200 dark:bg-warm-800 dark:text-warm-400 dark:hover:bg-warm-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear */}
      <button
        onClick={clearAll}
        className="w-full rounded-lg border border-warm-200 px-4 py-2 text-sm font-medium text-warm-500 hover:bg-warm-100 dark:border-warm-700 dark:text-warm-400 dark:hover:bg-warm-800 transition-colors"
      >
        Clear All Filters
      </button>
    </aside>
  );
}
