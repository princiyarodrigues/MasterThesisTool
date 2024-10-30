export const departments = [
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Technical documentation and processes',
    categories: [
      {
        id: 'development',
        name: 'Development Guidelines',
        description: 'Best practices and coding standards',
        tags: ['technical', 'coding'],
        items: [
          {
            id: 'code-review',
            title: 'Code Review Process',
            description: 'Guidelines for conducting effective code reviews',
            status: 'done',
            priority: 'high',
            tags: ['process', 'quality'],
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
            tags: ['git', 'process'],
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
        name: 'Architecture Documentation',
        description: 'System design and architecture guidelines',
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
        description: 'Official company policies and guidelines',
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
      }
    ]
  }
];