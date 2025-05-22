import { useState, useEffect } from 'preact/hooks';
import { getCategories } from './model';
import type { Category, Item, Upgrade } from './model';
import './app.css';

// Helper function to format time in minutes to a more readable format
const formatUpgradeTime = (minutes: number): string => {
  if (minutes === 0) {
    return 'Instant';
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  // Convert to days and hours for any time >= 24 hours
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 
      ? `${days} day${days > 1 ? 's' : ''} ${remainingHours} hr` 
      : `${days} day${days > 1 ? 's' : ''}`;
  }
  
  // For times between 1 hour and 24 hours
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 
    ? `${hours} hr ${remainingMinutes} min` 
    : `${hours} hr`;
};

export function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const allCategories = getCategories();
    setCategories(allCategories);
    // Set the first category as active by default
    if (allCategories.length > 0) {
      setActiveCategory(allCategories[0].name);
      // Set the first item as selected by default if available
      if (allCategories[0].items.length > 0) {
        setSelectedItem(allCategories[0].items[0].name);
      }
    }
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    // Reset selected item and set to first item in the new category if available
    const category = categories.find(cat => cat.name === categoryName);
    if (category && category.items.length > 0) {
      setSelectedItem(category.items[0].name);
    } else {
      setSelectedItem(null);
    }
  };

  const handleItemClick = (itemName: string) => {
    setSelectedItem(itemName);
  };

  const currentCategory = categories.find(cat => cat.name === activeCategory);
  const currentItem = currentCategory?.items.find(item => item.name === selectedItem);

  return (
    <div className="container">
      <div className="header">
        <h1>Clash of Clans Upgrade Times</h1>
        <div className="header-links">
          <a href="https://github.com/redcxca/clash-of-clans-upgrade-times" target="_blank">GitHub</a>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <button 
            key={category.name}
            className={`tab-button ${category.name === activeCategory ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Split View Layout */}
      {currentCategory && (
        <div className="split-layout">
          {/* Items List */}
          <div className="items-list">
            <h2>{currentCategory.name} Items</h2>
            <ul>
              {currentCategory.items.map(item => (
                <li 
                  key={item.name} 
                  className={selectedItem === item.name ? 'active' : ''}
                  onClick={() => handleItemClick(item.name)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Upgrade Levels Table */}
          {currentItem && (
            <div className="upgrade-details">
              <h2>{currentItem.name} Upgrades</h2>
              <table>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Cost</th>
                    <th>Currency</th>
                    <th>Upgrade Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItem.upgrades.map((upgrade) => (
                    <tr key={`${currentItem.name}-${upgrade.level}`}>
                      <td>{upgrade.level}</td>
                      <td>{upgrade.cost.toLocaleString()}</td>
                      <td>{upgrade.currency}</td>
                      <td>{formatUpgradeTime(upgrade.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
