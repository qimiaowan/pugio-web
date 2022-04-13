export interface ClientsDropdownProps {
    open?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onClientChange?: (clientId: string) => void;
}
