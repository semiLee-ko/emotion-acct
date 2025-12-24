import { Modal, Text, Group, Button } from '@mantine/core';

interface AlertModalProps {
    opened: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}

export function AlertModal({ opened, onClose, title = "알림", message }: AlertModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="md" c="dark.9">{title}</Text>} // using dark.9 for consistency
            centered
            size="sm"
            radius={16}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 4,
            }}
        >
            <Text size="sm" mb="lg" c="dark.7" style={{ whiteSpace: 'pre-wrap' }}>
                {message}
            </Text>

            <Group justify="flex-end">
                <Button
                    onClick={onClose}
                    radius="md"
                    color="blue"
                    fullWidth
                >
                    확인
                </Button>
            </Group>
        </Modal>
    );
}
