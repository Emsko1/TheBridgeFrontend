import React from 'react'
import { Lightbulb, CheckSquare, Users, Wallet } from 'lucide-react'

export default function WhyChooseUs() {
    const features = [
        {
            icon: <Lightbulb size={32} color="#00D09C" />,
            title: "No hidden surprises",
            description: "We provide you with a detailed inspection report based on 200+ parameters, so you are sure that the car's condition meets your expectations"
        },
        {
            icon: <CheckSquare size={32} color="#00D09C" />,
            title: "100% Safe transaction",
            description: "We check and verify all the documents of the car, so you don't face any challenges after the purchase"
        },
        {
            icon: <Users size={32} color="#00D09C" />,
            title: "Support at every stage",
            description: "Our professional Managers will be there for you to answer questions, verify the information and negotiate the price"
        },
        {
            icon: <Wallet size={32} color="#00D09C" />,
            title: "Flexible purchase",
            description: "We offer car loans so that this huge purchase doesn't stretch you financially"
        }
    ]

    return (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>Why choose us?</h2>

            <div className="grid grid-cols-4" style={{ textAlign: 'left' }}>
                {features.map((feature, index) => (
                    <div key={index} style={{ padding: '20px' }}>
                        <div style={{
                            background: '#F0FDF9',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            {feature.icon}
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{feature.title}</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
