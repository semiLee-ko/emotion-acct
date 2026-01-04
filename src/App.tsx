
import { useState, useEffect, useRef } from 'react';
import { Container, Button, Text, Group, Affix, Transition, Loader, Title, Modal, Stack } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { IconPlus, IconDownload, IconArrowUp, IconPlayerPlay } from '@tabler/icons-react';
import { ReceiptItem } from '@/components/ReceiptItem';
import { AddReceiptModal } from '@/components/AddReceiptModal';
import { StatsView } from '@/components/StatsView';
import { EmptyReceiptCharacter } from '@/components/EmptyReceiptCharacter';
import { Receipt, EmotionType } from '@/lib/types';
import { loginWithToss } from '@/lib/toss-sdk';
import { signIn, subscribeToReceipts, addReceipt, deleteReceipt, updateReceipt } from '@/lib/firebase';
import { AnimatePresence } from 'framer-motion';
import { showRewardedAd, prepareRewardedAd, prepareInterstitialAd } from '@/lib/ads';
import dayjs from 'dayjs';

export default function App() {
    const [user, setUser] = useState<any>(null);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [scroll, scrollTo] = useWindowScroll();

    const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
    const [editStep, setEditStep] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Daily Limit State
    const [dailyLimit, setDailyLimit] = useState(1);

    // Load/Save Daily Limit
    useEffect(() => {
        const todayStr = dayjs().format('YYYY-MM-DD');
        const key = `emotion_limit_${todayStr}`;
        const savedLimit = localStorage.getItem(key);

        if (savedLimit) {
            setDailyLimit(parseInt(savedLimit, 10));
        } else {
            setDailyLimit(1); // Default reset
        }
    }, []);

    const updateDailyLimit = (newLimit: number) => {
        setDailyLimit(newLimit);
        const todayStr = dayjs().format('YYYY-MM-DD');
        localStorage.setItem(`emotion_limit_${todayStr}`, newLimit.toString());
    };


    // Initial Load
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        let isMounted = true;

        async function init() {
            // Loading fallback timeout (if login hangs)
            const fallbackTimeout = setTimeout(() => {
                if (isMounted && isLoading) {
                    //console.warn('[Init] Fallback timeout reached. Forcing loading false.');
                    setIsLoading(false);
                }
            }, 5000);

            try {
                ////console.log('[Init] Starting initialization...');

                // 1. Toss Login (Mock or Real)
                await loginWithToss();
                console.log('[Init] Toss Login successful');

                // 2. Firebase Auth
                const firebaseUser = await signIn();
                if (!isMounted) return;
                setUser(firebaseUser);
                //console.log('[Init] Firebase Auth successful');

                // 3. Subscribe Data
                unsubscribe = subscribeToReceipts(firebaseUser.uid, (data) => {
                    if (isMounted) {
                        setReceipts(data);
                        setIsLoading(false);
                        //console.log('[Init] Data subscribed and first results received');
                    }
                });

            } catch (e) {
                //console.error('[Init] Initialization failed:', e);
                if (isMounted) setIsLoading(false);
            } finally {
                clearTimeout(fallbackTimeout);
            }
        }

        init();

        return () => {
            isMounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, []);

    // Initialize Rewarded Ads
    useEffect(() => {
        prepareRewardedAd();
        prepareInterstitialAd();
    }, []);

    // Filter receipts by month
    const filteredReceipts = receipts.filter(receipt => {
        const rDate = new Date(receipt.date);
        return rDate.getMonth() === selectedDate.getMonth() &&
            rDate.getFullYear() === selectedDate.getFullYear();
    });

    // Get available months
    const availableMonths = Array.from(new Set(receipts.map(r => {
        const d = new Date(r.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }))).sort();

    // Update Total
    useEffect(() => {
        const total = filteredReceipts.reduce((acc, cur) => acc + cur.amount, 0);
        setTotalAmount(total);
    }, [filteredReceipts]);

    const handleAddOrUpdateReceipt = async (values: { amount: number; emotion: EmotionType; note: string; date: Date }) => {
        if (!user) return;

        if (editingReceipt) {
            await updateReceipt(user.uid, editingReceipt.id, values);
            // Reset edit state is handled in handleModalClose, which is called by modal's onClose
        } else {
            await addReceipt(user.uid, values);
        }
    };

    const handleEditRequest = (receipt: Receipt, step: number) => {
        setEditingReceipt(receipt);
        setEditStep(step);
        open();
    };

    const handleModalClose = () => {
        close();
        // Small timeout to ensure modal exit animation plays before state reset if needed, 
        // but typically reset on close is fine. 
        // Actually AddReceiptModal calls resetModal then onClose.
        setTimeout(() => {
            setEditingReceipt(null);
            setEditStep(0);
        }, 200); // Wait for exit animation
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        await deleteReceipt(user.uid, id);
    };

    // Logic for Add Button
    // Count receipts created today (registration date), not consumption date
    const todayReceiptsCount = receipts.filter(r => r.createdAt && dayjs(r.createdAt).isSame(dayjs(), 'day')).length;
    const isLimitReached = todayReceiptsCount >= dailyLimit;

    const handleAddClick = async () => {
        if (isLimitReached) {
            if (dailyLimit === 1) {
                // Show Ad to unlock
                const result = await showRewardedAd();
                if (result.rewarded) {
                    updateDailyLimit(3);
                    // Optionally open modal immediately? Or let user click again? 
                    // Let's open immediately for better UX
                    open();
                } else {
                    alert('광고 시청을 완료해야 추가 등록이 가능합니다.');
                }
            } else {
                // Limit 3 reached
                return; // Disabled
            }
        } else {
            open();
        }
    };

    // Auto-redirect if current month becomes empty after deletion
    useEffect(() => {
        if (isLoading || receipts.length === 0 || filteredReceipts.length > 0) return;

        // Find available months from all receipts
        const months = Array.from(new Set(receipts.map(r => {
            const d = new Date(r.date);
            return dayjs(d).format('YYYY-MM');
        }))).sort();

        if (months.length > 0) {
            const currentMonthVal = selectedDate.getFullYear() * 12 + selectedDate.getMonth();
            let closestMonth = months[0];
            let minDistance = Infinity;

            months.forEach(mStr => {
                const [y, m] = mStr.split('-').map(Number);
                const monthVal = y * 12 + (m - 1);
                const distance = Math.abs(currentMonthVal - monthVal);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestMonth = mStr;
                }
            });

            const [y, m] = closestMonth.split('-').map(Number);
            const newDate = new Date(y, m - 1, 1);

            // Double check to avoid redundant updates
            if (dayjs(newDate).format('YYYY-MM') !== dayjs(selectedDate).format('YYYY-MM')) {
                //console.log(`[Navigation] Redirecting to ${closestMonth} as current month is empty.`);
                setSelectedDate(newDate);
            }
        }
    }, [receipts, filteredReceipts, isLoading, selectedDate]);


    return (
        <div className="min-h-screen bg-gray-50 min-h-screen-ios">
            {/* Inner Content Container with max-width */}
            <main className="max-w-md mx-auto relative shadow-xl overflow-hidden bg-gray-50 min-h-screen pb-24">

                {/* Content */}
                <Container px="md" py="md">
                    {isLoading ? (
                        <Group justify="center" align="center" style={{ height: '50vh' }}>
                            <Loader color="gray" type="dots" />
                        </Group>
                    ) : (
                        <>
                            <StatsView
                                receipts={filteredReceipts}
                                allReceipts={receipts}
                                selectedDate={selectedDate}
                                availableMonths={availableMonths}
                                onDateChange={setSelectedDate}
                            />

                            <Stack gap="md" id="receipt-feed" style={{ fontFamily: 'inherit' }}>
                                {filteredReceipts.length > 0 ? (
                                    <>
                                        <AnimatePresence mode='popLayout'>
                                            {filteredReceipts.slice(0, visibleCount).map((receipt) => (
                                                <ReceiptItem
                                                    key={receipt.id}
                                                    receipt={receipt}
                                                    onDelete={handleDelete}
                                                    onEdit={(step) => handleEditRequest(receipt, step)}
                                                />
                                            ))}
                                        </AnimatePresence>

                                        {visibleCount < filteredReceipts.length && (
                                            <Button
                                                variant="subtle"
                                                color="gray"
                                                fullWidth
                                                onClick={() => setVisibleCount(prev => prev + 10)}
                                                mt="md"
                                            >
                                                더보기 ({Math.min(visibleCount, filteredReceipts.length)}/{filteredReceipts.length})
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <EmptyReceiptCharacter />
                                )}
                            </Stack>
                        </>
                    )}
                </Container>

                <Affix position={{ bottom: 20, left: 20 }} zIndex={90}>
                    <Transition transition="slide-up" mounted={scroll.y > 100}>
                        {(transitionStyles) => (
                            <Button
                                radius="xl"
                                size="md"
                                color="gray"
                                variant="light"
                                className="shadow-md hover:scale-105 transition-transform"
                                style={{
                                    ...transitionStyles,
                                    opacity: 0.8
                                }}
                                onClick={() => scrollTo({ y: 0 })}
                            >
                                <IconArrowUp size={20} />
                            </Button>
                        )}
                    </Transition>
                </Affix>

                {/* Floating Action Button - Inside max-w container */}
                <Affix position={{ bottom: 20, right: 20 }} zIndex={100}>
                    <Transition transition="slide-up" mounted={!isLoading}>
                        {(transitionStyles) => {
                            // Determine Button State
                            let buttonText = `등록 ${todayReceiptsCount}/${dailyLimit}`;
                            let buttonColor = "blue";
                            let buttonIcon = <IconPlus size={20} />;
                            let disabled = false;

                            if (isLimitReached) {
                                if (dailyLimit === 1) {
                                    buttonText = "광고보고 2회 더 등록";
                                    buttonColor = "orange"; // Attention color
                                    buttonIcon = <IconPlayerPlay size={20} />;
                                } else {
                                    buttonText = "오늘의 기록 완료";
                                    buttonColor = "gray";
                                    disabled = true;
                                }
                            }

                            return (
                                <Button
                                    leftSection={buttonIcon}
                                    radius="xl"
                                    size="lg"
                                    className="shadow-lg hover:scale-105 active:scale-95 transition-transform"
                                    color={buttonColor}
                                    style={transitionStyles}
                                    onClick={handleAddClick}
                                    disabled={disabled}
                                >
                                    {buttonText}
                                </Button>
                            );
                        }}
                    </Transition>
                </Affix>

                <AddReceiptModal
                    opened={opened}
                    onClose={handleModalClose}
                    onSubmit={handleAddOrUpdateReceipt}
                    initialValues={editingReceipt ? {
                        amount: editingReceipt.amount,
                        emotion: editingReceipt.emotion,
                        note: editingReceipt.note,
                        date: editingReceipt.date
                    } : undefined}
                    initialStep={editStep}
                    isEditMode={!!editingReceipt}
                />
            </main>
        </div>
    );
}
