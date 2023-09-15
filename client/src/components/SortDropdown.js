import React, { useState } from 'react';

const SortDropdown = ({ selectedSort, setSelectedSort }) => {
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
  };

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort">Sort by:</label>
      <select id="sort" value={selectedSort} onChange={handleSortChange}>
        <option value="time">Time</option>
        <option value="rank">Rank</option>
      </select>
    </div>
  );
};

export default SortDropdown;
