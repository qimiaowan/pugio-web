import { ChannelRequestOptions } from '@modules/request/request.interface';
import { ButtonProps } from '@mui/material/Button';

export interface HeaderControlItem {
    button?: {
        icon: string;
        props?: ButtonProps;
        title?: string;
    };
    divider?: boolean;
}

export type MakeHandshakeRequestOptions = ChannelRequestOptions;

export interface MakeHandshakeChannelResponseData {
    id: string;
}

export interface ConnectRequestOptions extends ChannelRequestOptions {
    terminalId: string;
    dieTimeout?: number;
    args?: string[];
    rows?: number;
    cols?: number;
    cwd?: string;
    env?: Record<string, string>;
}

export interface ConnectResponseData {
    accepted: boolean;
    content: string[] | null;
    error: string | null;
}

export interface SendDataRequestOptions extends ChannelRequestOptions {
    terminalId: string;
    sequence: number;
    terminalData: string;
}

export interface SendDataResponseData {
    accepted: boolean;
    error: string | null;
}

export interface CloseConnectionRequestOptions extends ChannelRequestOptions {
    terminalId: string;
}

export type CloseConnectionResponseData = SendDataResponseData;

export interface ResizeRequestOptions extends ChannelRequestOptions {
    terminalId: string;
    cols?: number;
    rows?: number;
}

export type ResizeResponseData = SendDataResponseData;

export interface SendConsumeConfirmRequestOptions extends ChannelRequestOptions {
    terminalId: string;
    sequence: number;
}

export type SendConsumeConfirmResponseData = SendDataResponseData;

export interface APIKey {
    id: string;
    keyId: string;
    scopes: string;
}

export interface EnsureSingleScopedKeyRequestOptions {
    scopeId: string;
}

export type EnsureSingleScopedKeyResponseData = APIKey;
