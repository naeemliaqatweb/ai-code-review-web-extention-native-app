/**
 * A robust storage utility that provides a unified interface for Chrome Storage
 * and falls back to localStorage in standard browser environments (development).
 */
export const storage = {
  /**
   * Get data from storage
   * @param {string} key 
   * @returns {Promise<any>}
   */
  async get(key) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(key);
      return result;
    }
    
    // Fallback to localStorage
    const value = localStorage.getItem(key);
    try {
      return { [key]: value ? JSON.parse(value) : undefined };
    } catch (e) {
      return { [key]: value };
    }
  },

  /**
   * Set data in storage
   * @param {Object} data - Key-value pairs to store
   * @returns {Promise<void>}
   */
  async set(data) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return chrome.storage.local.set(data);
    }

    // Fallback to localStorage
    Object.keys(data).forEach(key => {
      const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
      localStorage.setItem(key, value);
    });
  },

  /**
   * Remove data from storage
   * @param {string|string[]} keys 
   * @returns {Promise<void>}
   */
  async remove(keys) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return chrome.storage.local.remove(keys);
    }

    // Fallback to localStorage
    const keysArray = Array.isArray(keys) ? keys : [keys];
    keysArray.forEach(key => localStorage.removeItem(key));
  }
};
