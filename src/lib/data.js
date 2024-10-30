export const departments = [
  {
    id: 'engineering',
    name: 'Production Department',
    description: 'Technical documentation and processes',
    categories: [
      {
        id: 'development',
        name: 'Architecture : Factory Strategic Goals',
        description: 'Current analysis and strategic targets of the factory',
        items: [
          {
            id: 'code-review',
            title: 'Code Review Process',
            description: 'Guidelines for conducting effective code reviews',
            status: 'done',
            priority: 'high',
            lastUpdated: '2024-10-15',
            content: {
              statement: 'All code changes must go through peer review before deployment',
              rationale: 'Ensures code quality and knowledge sharing across the team',
              implications: [
                'Improved code quality',
                'Knowledge sharing',
                'Reduced technical debt'
              ]
            }
          },
          {
            id: 'git-workflow',
            title: 'Git Workflow',
            description: 'Standard git branching and commit practices',
            status: 'in-progress',
            priority: 'medium',
            lastUpdated: '2024-10-20',
            content: {
              statement: 'Follow trunk-based development with feature branches',
              rationale: 'Enables continuous integration and faster delivery',
              implications: [
                'Shorter-lived branches',
                'Frequent integration',
                'Reduced merge conflicts'
              ]
            }
          }
        ]
      },
      {
        id: 'architecture',
        name: 'Business Capabilities',
        description: 'Helps in monitor current and targetted business related decisions of the factory',
        tags: ['technical', 'design'],
        items: [
          {
            id: 'system-overview',
            title: 'System Overview',
            description: 'High-level architecture documentation',
            status: 'done',
            priority: 'high',
            tags: ['documentation', 'overview'],
            lastUpdated: '2024-10-25',
            content: {
              statement: 'Microservices-based architecture with event-driven communication',
              rationale: 'Enables scalability and independent service deployment',
              implications: [
                'Service independence',
                'Improved scalability',
                'Complex distributed systems'
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'IT',
    name: 'Information Technology',
    description: 'IT Infrastructure and Policies',
    categories: [
      {
        id: 'vendors',
        name: 'IT Vendors',
        description: 'Current Analysis of the IT Strategy',
        tags: ['policy', 'compliance'],
        items: [
          {
            id: 'vendor-strategy',
            title: 'Vendor Strategy BP_020',
            description: 'Strategic IT vendor selection guidelines',
            status: 'active',
            priority: 'high',
            tags: ['IT', 'Vendor', 'Strategy'],
            lastUpdated: '2024-10-30',
            content: {
              statement: 'Consider applications from strategic IT partners first',
              rationale: 'Leverages existing partnerships for better support and pricing',
              implications: [
                'Standardized vendor selection',
                'Optimized costs',
                'Enhanced support'
              ]
            }
          }
        ]
      },
      {
        id: 'tech',
        name: 'Technical Capabilities',
        description: 'Helps in monitor current and targetted technical related decisions of the factory',
        tags: ['policy', 'compliance'],
        items: [
          {
            id: 'vendor-strategy',
            title: 'Vendor Strategy BP_020',
            description: 'Helps in monitor current and targetted technical related decisions of the factory',
            status: 'active',
            priority: 'high',
            tags: ['IT', 'Vendor', 'Strategy'],
            lastUpdated: '2024-10-30',
            content: {
              statement: 'Consider applications from strategic IT partners first',
              rationale: 'Leverages existing partnerships for better support and pricing',
              implications: [
                'Standardized vendor selection',
                'Optimized costs',
                'Enhanced support'
              ]
            }
          }
        ]
      }
    ]
  }
  
];