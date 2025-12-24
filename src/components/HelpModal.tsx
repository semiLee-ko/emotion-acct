import { Drawer, Stack, Text, Button, Group, Box } from '@mantine/core';
import { useState } from 'react';

const slides = [
    {
        title: '내감정소비에 오신 것을 환영해요!',
        description: '이 앱은 여러분의 감정소비를 기록하고 분석해주는 특별한 공간이에요.',
        emoji: '👋'
    },
    {
        title: '감정소비 기록하기',
        description: '오늘의 감정과 금액을 기록해보세요.',
        emoji: '💰'
    },
    {
        title: '차트로 보는 내 감정소비',
        description: '도넛 차트를 통해 이번 달 내 감정이 어땠는지 한눈에 확인할 수 있어요.',
        emoji: '📊'
    },
    {
        title: '온도계 모드',
        description: '내 감정의 비율을 온도계로 확인할 수 있어요.',
        emoji: '🌡️'
    },
    {
        title: '이미지로 저장하기',
        description: '통계를 이미지로 저장할 수 있어요.',
        emoji: '📸'
    }
];

interface HelpModalProps {
    opened: boolean;
    onClose: () => void;
}

export function HelpModal({ opened, onClose }: HelpModalProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onClose();
            setCurrentSlide(0);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleClose = () => {
        onClose();
        setCurrentSlide(0);
    };

    return (
        <Drawer
            opened={opened}
            onClose={handleClose}
            position="bottom"
            size="100%"
            withCloseButton={true}
            title=""
            styles={{
                content: {
                    background: 'linear-gradient(180deg, #f8f9fa 0%, #e7f5ff 100%)'
                },
                header: {
                    background: 'transparent',
                    borderBottom: 'none'
                },
                body: {
                    padding: 0,
                    height: 'calc(100% - 60px)' // Subtract header height approx
                }
            }}
        >
            <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Content Area - Flex Grow to push buttons down */}
                <Stack
                    gap="xl"
                    align="center"
                    py="xl"
                    px="lg"
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {/* Emoji */}
                    <Box
                        style={{
                            fontSize: '5rem',
                            background: 'white',
                            borderRadius: '50%',
                            width: '140px',
                            height: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(51, 154, 240, 0.15)'
                        }}
                    >
                        {slides[currentSlide].emoji}
                    </Box>

                    {/* Content */}
                    <Stack gap="sm" align="center" maw={400}>
                        <Text size="xl" fw={700} ta="center" c="dark.8">
                            {slides[currentSlide].title}
                        </Text>
                        <Text size="md" c="dimmed" ta="center" style={{ lineHeight: 1.6 }}>
                            {slides[currentSlide].description}
                        </Text>
                    </Stack>

                    {/* Progress dots */}
                    <Group gap="xs" mt="md">
                        {slides.map((_, index) => (
                            <Box
                                key={index}
                                style={{
                                    width: index === currentSlide ? 24 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: index === currentSlide ? '#339af0' : '#dee2e6',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </Group>

                    {currentSlide === 0 && (
                        <Text size="xs" c="dimmed" mt="auto" pt="xl">
                            Copyright © CODA Creative. All rights reserved.
                        </Text>
                    )}
                </Stack>

                {/* Bottom Navigation - Part of Flex Flow */}
                <Box
                    style={{
                        padding: '16px 20px',
                        background: 'transparent',
                        width: '100%'
                    }}
                >
                    <Group gap="sm" justify="space-between" w="100%">
                        {currentSlide > 0 && (
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={handlePrev}
                                size="md"
                                style={{ flex: 1 }}
                            >
                                이전
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            size="md"
                            color="blue"
                            style={{ flex: currentSlide === 0 ? 1 : 2 }}
                        >
                            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
                        </Button>
                    </Group>
                </Box>
            </Box>
        </Drawer>
    );
}
