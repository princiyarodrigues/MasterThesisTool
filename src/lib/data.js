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
              id: '1',
              title: 'Code Review Process',
              description: 'Guidelines for conducting effective code reviews',
              status: 'done',
              priority: 'high',
              tags: ['process', 'quality']
            },
            {
              id: '2',
              title: 'Git Workflow',
              description: 'Standard git branching and commit practices',
              status: 'in-progress',
              priority: 'medium',
              tags: ['git', 'process']
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
              id: '3',
              title: 'System Overview',
              description: 'High-level architecture documentation',
              status: 'done',
              priority: 'high',
              tags: ['documentation', 'overview']
            }
          ]
        }
      ]
    },
    {
      id: 'hr',
      name: 'Human Resources',
      description: 'HR policies and procedures',
      categories: [
        {
          id: 'policies',
          name: 'Company Policies',
          description: 'Official company policies and guidelines',
          tags: ['policy', 'compliance'],
          items: [
            {
              id: '4',
              title: 'Employee Handbook',
              description: 'Complete employee guidelines and policies',
              status: 'done',
              priority: 'high',
              tags: ['policy', 'guidelines']
            }
          ]
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Marketing resources and campaigns',
      categories: [
        {
          id: 'brand',
          name: 'Brand Guidelines',
          description: 'Brand identity and usage guidelines',
          tags: ['brand', 'design'],
          items: [
            {
              id: '5',
              title: 'Logo Usage',
              description: 'Guidelines for logo usage and placement',
              status: 'done',
              priority: 'medium',
              tags: ['brand', 'design']
            }
          ]
        }
      ]
    }
  ];