import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({
  search = '',
  onSearchChange,
  onSearchSubmit,
  sort = '-createdAt',
  onSortChange
}) => {
  return (
    <div className="filter-row">
      {/* Dynamic Search form */}
      <form onSubmit={onSearchSubmit} className="search-form-wrap">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search products or categories..."
          value={search}
          onChange={onSearchChange}
          className="search-input-field"
        />
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '6px' }}
        >
          Find
        </button>
      </form>

      {/* Dynamic Sort Selection */}
      <div className="sort-row">
        <div className="sort-label-group">
          <SlidersHorizontal size={16} style={{ color: 'var(--color-text-muted)' }} />
          <span className="sort-label-text">Sort By:</span>
        </div>
        <select
          value={sort}
          onChange={onSortChange}
          className="sort-select-dropdown"
        >
          <option value="-createdAt">Newest Arrival</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
