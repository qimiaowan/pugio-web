import { RequestService } from '@modules/request/request.service';
import { Injectable } from 'khamsa';
import {
    MakeHandshakeRequestOptions,
    MakeHandshakeChannelResponseData,
    ConnectRequestOptions,
    ConnectResponseData,
    SendDataRequestOptions,
    SendDataResponseData,
    CloseConnectionRequestOptions,
    CloseConnectionResponseData,
    ResizeRequestOptions,
    ResizeResponseData,
    SendConsumeConfirmRequestOptions,
    SendConsumeConfirmResponseData,
    EnsureSingleScopedKeyRequestOptions,
    EnsureSingleScopedKeyResponseData,
} from '@builtin:web-terminal/app.interface';
import {
    Response,
    ChannelResponseData,
} from '@modules/request/request.interface';

@Injectable()
export class AppService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async makeHandshake(
        options: MakeHandshakeRequestOptions,
    ): Promise<Response<ChannelResponseData<MakeHandshakeChannelResponseData>>> {
        const {
            clientId,
        } = options;

        return this.requestService.getInstance()
            .request({
                url: `/client/${clientId}/channel_request`,
                method: 'post',
                data: {
                    scope: 'pugio.web-terminal',
                    data: {
                        type: 'handshake',
                    },
                },
            });
    }

    public async connect(
        options: ConnectRequestOptions,
    ): Promise<Response<ChannelResponseData<ConnectResponseData>>> {
        const {
            terminalId,
            clientId,
        } = options;

        return this.requestService.getInstance()
            .request({
                url: `/client/${clientId}/channel_request`,
                method: 'post',
                data: {
                    scope: 'pugio.web-terminal',
                    data: {
                        type: 'connect',
                        id: terminalId,
                    },
                },
            });
    }

    public async sendData(
        options: SendDataRequestOptions,
    ): Promise<Response<ChannelResponseData<SendDataResponseData>>> {
        const {
            clientId,
            terminalData,
            terminalId,
            sequence,
        } = options;

        return this.requestService.getInstance()
            .request({
                url: `/client/${clientId}/channel_request`,
                method: 'post',
                data: {
                    scope: 'pugio.web-terminal',
                    data: {
                        type: 'data',
                        id: terminalId,
                        sequence,
                        data: window.btoa(terminalData),
                    },
                },
            });
    }

    public async sendConsumeConfirm(
        options: SendConsumeConfirmRequestOptions,
    ): Promise<Response<ChannelResponseData<SendConsumeConfirmResponseData>>> {
        const {
            clientId,
            terminalId,
            sequence,
        } = options;

        return this.requestService.getInstance()
            .request({
                url: `/client/${clientId}/channel_request`,
                method: 'post',
                data: {
                    scope: 'pugio.web-terminal',
                    data: {
                        type: 'consumeConfirm',
                        id: terminalId,
                        sequence,
                    },
                },
            });
    }

    public async closeConnection(
        options: CloseConnectionRequestOptions,
    ): Promise<Response<ChannelResponseData<CloseConnectionResponseData>>> {
        const {
            clientId,
            terminalId,
        } = options;

        return this.requestService.getInstance()
            .request({
                url: `/client/${clientId}/channel_request`,
                method: 'post',
                data: {
                    scope: 'pugio.web-terminal',
                    data: {
                        type: 'close',
                        id: terminalId,
                    },
                },
            });
    }

    public async resize(
        options: ResizeRequestOptions,
    ): Promise<Response<ChannelResponseData<ResizeResponseData>>> {
        const {
            clientId,
            terminalId,
            rows,
            cols,
        } = options;

        return this.requestService.getInstance()
            .request({
                url: `/client/${clientId}/channel_request`,
                method: 'post',
                data: {
                    scope: 'pugio.web-terminal',
                    data: {
                        type: 'resize',
                        id: terminalId,
                        rows,
                        cols,
                    },
                },
            });
    }

    public async ensureSingleScopedKey(
        options: EnsureSingleScopedKeyRequestOptions,
    ): Promise<Response<EnsureSingleScopedKeyResponseData>> {
        const { scopeId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'post',
                url: `/keys/ensure/${scopeId}`,
            });
    }
}
