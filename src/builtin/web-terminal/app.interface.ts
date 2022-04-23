import { ChannelRequestOptions } from '@modules/request/request.interface';

export type MakeHandshakeRequestOptions = ChannelRequestOptions;

export interface MakeHandshakeChannelResponseData {
    id: string;
}

export interface ConnectRequestOptions extends ChannelRequestOptions {
    terminalId: string;
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
