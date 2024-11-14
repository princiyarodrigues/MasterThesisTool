'use client';
import React from 'react';
import { useState } from 'react';
import {
    BookOpen,
    Shield,
    Cloud,
    Server,
    Database,
    Users,
    Code,
    Globe,
    Settings,
    Target,
    Lightbulb,
    Zap,
    LineChart,
    CheckCircle,
    Network,
    DollarSign
} from 'lucide-react';
import { ITPrincipleModal } from './ITPrincipalModal';

const iconMap = {
    Target: Target,
    Cloud: Cloud,
    Shield: Shield,
    Settings: Settings,
    LineChart: LineChart,
    Zap: Zap,
    DollarSign: DollarSign,
    Globe: Globe,
    CheckCircle: CheckCircle,
    Database: Database,
    BookOpen: BookOpen,
    Server: Server,
    Users: Users,
    Code: Code,
    Network: Network,
    Lightbulb: Lightbulb
};

const principlesData = [
    {
        id: 'BP_020',
        title: 'Preferred IT Vendor Strategy',
        description: 'Strategic partnerships with key vendors',
        icon: 'Target',
        category: 'Strategy',
        statement: 'Consider applications from Rocket Chips strategic IT partners first: Microsoft and SAP',
        rationale: 'Rocket Chips has long relationships to its IT partners (vendors and services) which are based on corporate contracts to ensure best license prices, interoperability and integration, maintenance and premium support (e.g., 24x7).',
        implications: [
            'Organizations may not be able to select the best fit-for-purpose application from an ISV when our partners offer similar capabilities.',
            'Maintenance and support contracts are already in place through corporate contracts.',
            'International availability can be ensured.'
        ]
    },
    {
        id: 'BP_021',
        title: 'Cloud-First Approach',
        description: 'Cloud adoption strategy',
        icon: 'Cloud',
        category: 'Infrastructure',
        statement: 'Prioritize cloud-based solutions over on-premise alternatives when evaluating new IT services and infrastructure.',
        rationale: 'Cloud solutions provide greater scalability, flexibility, and potentially lower total cost of ownership while ensuring faster deployment of new capabilities.',
        implications: [
            'Requires robust internet connectivity and bandwidth',
            'Need for comprehensive cloud security measures',
            'Staff training for cloud technologies',
            'Regular monitoring of cloud service costs'
        ]
    },
    {
        id: 'BP_022',
        title: 'Data Security Standards',
        description: 'Security requirements for vendors',
        icon: 'Shield',
        category: 'Security',
        statement: 'All IT vendors must comply with our data security standards and undergo regular security assessments.',
        rationale: 'Ensuring consistent security standards across all vendor solutions protects company data and maintains compliance with regulations.',
        implications: [
            'Regular vendor security audits required',
            'Additional cost for security compliance',
            'Potential limitation of vendor options',
            'Need for continuous security monitoring'
        ]
    },
    {
        id: 'BP_023',
        title: 'Integration Requirements',
        description: 'System integration guidelines',
        icon: 'Settings',
        category: 'Architecture',
        statement: 'New IT solutions must integrate with existing enterprise systems and follow established API standards.',
        rationale: 'Standardized integration ensures system compatibility, reduces complexity, and enables efficient data flow across the organization.',
        implications: [
            'May limit choice of solutions based on integration capabilities',
            'Need for comprehensive API documentation',
            'Integration testing requirements',
            'Potential additional development costs'
        ]
    },
    {
        id: 'BP_024',
        title: 'Vendor Performance Monitoring',
        description: 'KPI tracking framework',
        icon: 'LineChart',
        category: 'Operations',
        statement: 'Regular monitoring and assessment of vendor performance against defined service level agreements.',
        rationale: 'Continuous monitoring ensures vendors meet contracted service levels and provides basis for improvement or vendor changes.',
        implications: [
            'Need for defined KPIs and monitoring tools',
            'Regular performance review meetings',
            'Resource allocation for monitoring',
            'Process for addressing performance issues'
        ]
    },
    {
        id: 'BP_025',
        title: 'Digital Transformation Focus',
        description: 'Innovation requirements',
        icon: 'Zap',
        category: 'Innovation',
        statement: 'Preference for vendors who demonstrate strong digital transformation capabilities and innovation roadmap.',
        rationale: 'Vendors with strong innovation focus help keep the organization competitive and technologically advanced.',
        implications: [
            'Higher investment in innovative solutions',
            'Need for regular technology assessments',
            'Change management requirements',
            'Staff training for new technologies'
        ]
    },
    {
        id: 'BP_026',
        title: 'Cost Optimization',
        description: 'Financial efficiency guidelines',
        icon: 'DollarSign',
        category: 'Finance',
        statement: 'Implementation of cost-optimization strategies while maintaining service quality standards.',
        rationale: 'Balancing cost efficiency with service quality ensures sustainable IT operations and value for investment.',
        implications: [
            'Regular cost-benefit analysis required',
            'Need for clear ROI metrics',
            'Vendor price benchmarking',
            'Regular review of licensing models'
        ]
    },
    {
        id: 'BP_027',
        title: 'Global Service Capability',
        description: 'International support requirements',
        icon: 'Globe',
        category: 'Service',
        statement: 'Vendors must demonstrate capability to provide consistent service quality across all operational regions.',
        rationale: 'Global service capability ensures uniform support and service levels across all organizational locations.',
        implications: [
            'Higher vendor qualification requirements',
            'Need for global service level agreements',
            'Multiple time zone support coverage',
            'Cultural and language considerations'
        ]
    },
    {
        id: 'BP_028',
        title: 'Compliance Standards',
        description: 'Regulatory compliance requirements',
        icon: 'CheckCircle',
        category: 'Compliance',
        statement: 'Vendors must maintain compliance with industry regulations and provide regular compliance reporting.',
        rationale: 'Ensuring vendor compliance protects the organization from regulatory risks and maintains industry standards.',
        implications: [
            'Regular compliance audits required',
            'Documentation of compliance measures',
            'Additional compliance monitoring costs',
            'Potential limitation of vendor options'
        ]
    },
    {
        id: 'BP_029',
        title: 'Data Management',
        description: 'Data handling protocols',
        icon: 'Database',
        category: 'Data',
        statement: 'Strict adherence to data protection and privacy regulations in all vendor operations.',
        rationale: 'Proper data management ensures regulatory compliance and protects sensitive information.',
        implications: [
            'Regular data protection audits',
            'Staff training on data handling',
            'Data classification requirements',
            'Incident response procedures'
        ]
    }
];

export default function ITPrinciples() {
    const [selectedPrinciple, setSelectedPrinciple] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Principles</h1>
                    <p className="text-gray-600">Strategic guidelines for IT vendor management and technology decisions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principlesData.map((principle) => {
                        const Icon = iconMap[principle.icon]; // Get the actual icon component
                        return (
                            <div
                                key={principle.id}
                                onClick={() => setSelectedPrinciple(principle)}
                                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 p-6 cursor-pointer"
                            >
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        {Icon && <Icon className="h-6 w-6 text-green-600" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {principle.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {principle.description}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {principle.category}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <ITPrincipleModal
                    isOpen={!!selectedPrinciple}
                    onClose={() => setSelectedPrinciple(null)}
                    principle={selectedPrinciple}
                />
            </div>
        </div>
    );
}