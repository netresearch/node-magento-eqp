import MockAdapter from "axios-mock-adapter";
import { AxiosAdapter } from "../src/Adapters";

export class AxiosMockAdapter extends AxiosAdapter {
    public mockAdapter: MockAdapter
    constructor(baseURL: string) {
        super(baseURL);
        this.mockAdapter = new MockAdapter(this.client, { onNoMatch: 'throwException' });
    }
}