export interface ChannelListProps {
    clientId: string;
    width: number;
    height: number;
    onSelectChannel?: (channelId: string) => void;
}
