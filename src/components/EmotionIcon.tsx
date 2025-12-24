import React from 'react';


interface EmotionIconProps {
    type: 'CONGRATULATIONS' | 'STRESS' | 'LOVE' | 'EMERGENCY' | 'COMFORT' | 'GROWTH';
    size?: number;
    color?: string;
}

export const EmotionIcon: React.FC<EmotionIconProps> = ({ type, size = 32 }) => {
    const iconPath = {
        'CONGRATULATIONS': '/images/celebrate.png',
        'LOVE': '/images/flowers.png',
        'GROWTH': '/images/improvement.png',
        'STRESS': '/images/fight.png',
        'EMERGENCY': '/images/cure.png',
        'COMFORT': '/images/condolence.png'
    }[type];

    if (!iconPath) return null;

    return (
        <img
            src={iconPath}
            alt={type}
            width={size}
            height={size}
            style={{
                objectFit: 'contain'
            }}
        />
    );
};
