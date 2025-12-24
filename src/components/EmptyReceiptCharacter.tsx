import { Stack, Text, Center } from '@mantine/core';

// Empty state character - Cute receipt character
export function EmptyReceiptCharacter({ size = 120 }: { size?: number }) {
    return (
        <Center style={{ minHeight: '40vh' }}>
            <Stack gap="md" align="center">
                <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Receipt Body */}
                    <g>
                        {/* Main receipt shape with sawtooth edges */}
                        <path
                            d="M30 20 L35 15 L40 20 L45 15 L50 20 L55 15 L60 20 L65 15 L70 20 L75 15 L80 20 L85 15 L90 20 L90 100 L85 105 L80 100 L75 105 L70 100 L65 105 L60 100 L55 105 L50 100 L45 105 L40 100 L35 105 L30 100 Z"
                            fill="#FFFAF0"
                            stroke="#E8DCC8"
                            strokeWidth="2"
                        />

                        {/* Receipt lines */}
                        <line x1="40" y1="30" x2="80" y2="30" stroke="#D4C5B0" strokeWidth="1.5" />
                        <line x1="40" y1="40" x2="70" y2="40" stroke="#D4C5B0" strokeWidth="1.5" />
                        <line x1="40" y1="50" x2="80" y2="50" stroke="#D4C5B0" strokeWidth="1.5" />

                        {/* Dashed line in middle */}
                        <line x1="35" y1="60" x2="85" y2="60" stroke="#D4C5B0" strokeWidth="2" strokeDasharray="4 3" />

                        {/* Face on receipt */}
                        {/* Eyes - cute closed happy eyes */}
                        <path
                            d="M 48 70 Q 50 73 52 70"
                            stroke="#FF6B35"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M 68 70 Q 70 73 72 70"
                            stroke="#FF6B35"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Smile */}
                        <path
                            d="M 50 80 Q 60 88 70 80"
                            stroke="#FF6B35"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Blush marks */}
                        <circle cx="42" cy="78" r="3" fill="#FFB8B8" opacity="0.6" />
                        <circle cx="78" cy="78" r="3" fill="#FFB8B8" opacity="0.6" />
                    </g>

                    {/* Floating emotion symbols around the receipt */}
                    <g opacity="0.7">
                        {/* Heart */}
                        <path
                            d="M 20 35 C 20 32 22 30 24 30 C 25 30 26 31 27 32 C 28 31 29 30 30 30 C 32 30 34 32 34 35 C 34 38 27 43 27 43 C 27 43 20 38 20 35 Z"
                            fill="#ff922b"
                        />

                        {/* Star */}
                        <path
                            d="M 95 45 L 96.5 48.5 L 100 50 L 96.5 51.5 L 95 55 L 93.5 51.5 L 90 50 L 93.5 48.5 Z"
                            fill="#fab005"
                        />

                        {/* Sparkle */}
                        <path
                            d="M 25 85 L 26 87.5 L 28.5 88.5 L 26 89.5 L 25 92 L 24 89.5 L 21.5 88.5 L 24 87.5 Z"
                            fill="#20c997"
                        />
                    </g>
                </svg>

                <Stack gap="xs" align="center">
                    <Text size="md" fw={600} c="gray.7">
                        아직 등록된 영수증이 없어요
                    </Text>
                    <Text size="sm" c="gray.5">
                        오늘 사용한 감정비용을 추가해보세요
                    </Text>
                </Stack>
            </Stack>
        </Center>
    );
}
