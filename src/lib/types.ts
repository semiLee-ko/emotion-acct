export type EmotionType = 'CONGRATULATIONS' | 'LOVE' | 'GROWTH' | 'STRESS' | 'EMERGENCY' | 'COMFORT';

export interface Receipt {
    id: string;
    amount: number;
    emotion: EmotionType;
    note: string;
    date: Date; // Firestore Timestamp converted to Date
    createdAt: Date;
}

export const EMOTION_CONFIG: Record<EmotionType, { label: string; emoji: string; color: string }> = {
    CONGRATULATIONS: { label: '축하비용', emoji: '🎉', color: '#3b89ff' },
    LOVE: { label: '심쿵비용', emoji: '🥰', color: '#3b89ff' },
    GROWTH: { label: '갓생비용', emoji: '✨', color: '#3b89ff' },
    STRESS: { label: ' 홧김비용', emoji: '🤯', color: '#fab005' },
    EMERGENCY: { label: '응급비용', emoji: '🚑', color: '#fab005' },
    COMFORT: { label: '위로비용', emoji: '🧘', color: '#fab005' }
};
