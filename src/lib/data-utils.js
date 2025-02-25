/**
 * Fetches all goals from the API
 * @returns {Promise<Array>} Array of goal objects
 */
export async function fetchGoals() {
    try {
      const response = await fetch('/api/goals');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch goals: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }
  
  /**
   * Fetches all capabilities from the API
   * @returns {Promise<Array>} Array of capability objects
   */
  export async function fetchCapabilities() {
    try {
      const response = await fetch('/api/capabilities');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch capabilities: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      throw error;
    }
  }
  
  /**
   * Fetches capabilities related to a specific goal
   * @param {string} goalId - The ID of the goal
   * @returns {Promise<Array>} Array of capability objects
   */
  export async function fetchCapabilitiesByGoal(goalId) {
    try {
      const response = await fetch(`/api/capabilities/by-goal/${goalId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch capabilities for goal ${goalId}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching capabilities for goal ${goalId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetches capabilities by category
   * @param {string} category - The category to filter capabilities by ('Factory Planning', 'Production Planning', 'Technical')
   * @returns {Promise<Array>} Array of capability objects matching the category
   */
  export async function fetchCapabilitiesByCategory(category) {
    try {
      const response = await fetch(`/api/capabilities/by-category/${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch capabilities for category ${category}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching capabilities for category ${category}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetches capabilities grouped by parent capability
   * This is useful for the business capabilities view
   * @param {string} category - Optional category to filter by ('Factory Planning', 'Production Planning')
   * @returns {Promise<Array>} Array of parent capabilities with their children
   */
  export async function fetchCapabilityHierarchy(category) {
    try {
      // First fetch all capabilities, optionally filtered by category
      let capabilities;
      if (category) {
        capabilities = await fetchCapabilitiesByCategory(category);
      } else {
        capabilities = await fetchCapabilities();
      }
      
      // Then fetch the composition relationships
      const response = await fetch('/api/compositions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch compositions: ${response.status}`);
      }
      
      const compositions = await response.json();
      
      // Group children by their parent capabilities
      const hierarchy = [];
      const capabilitiesMap = {};
      
      // Create a map of capabilities by ID for easy lookup
      capabilities.forEach(capability => {
        capabilitiesMap[capability.id] = { ...capability, children: [] };
      });
      
      // Populate children arrays based on compositions
      compositions.forEach(composition => {
        const parentId = composition.source;
        const childId = composition.target;
        
        if (capabilitiesMap[parentId] && capabilitiesMap[childId]) {
          capabilitiesMap[parentId].children.push(capabilitiesMap[childId]);
        }
      });
      
      // Filter out only parent capabilities (those that don't appear as targets in compositions)
      const parentIds = new Set(compositions.map(comp => comp.source));
      const childIds = new Set(compositions.map(comp => comp.target));
      
      parentIds.forEach(id => {
        if (!childIds.has(id) && capabilitiesMap[id]) {
          hierarchy.push(capabilitiesMap[id]);
        }
      });
      
      return hierarchy;
    } catch (error) {
      console.error('Error fetching capability hierarchy:', error);
      throw error;
    }
  }
  
  /**
   * Fetches factory planning capabilities
   * @returns {Promise<Array>} Array of factory planning capability objects
   */
  export async function fetchFactoryPlanningCapabilities() {
    return fetchCapabilitiesByCategory('Factory Planning');
  }
  
  /**
   * Fetches production planning capabilities
   * @returns {Promise<Array>} Array of production planning capability objects
   */
  export async function fetchProductionPlanningCapabilities() {
    return fetchCapabilitiesByCategory('Production Planning');
  }
  
  /**
   * Fetches technical capabilities
   * @returns {Promise<Array>} Array of technical capability objects
   */
  export async function fetchTechnicalCapabilities() {
    return fetchCapabilitiesByCategory('Technical');
  }