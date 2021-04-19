import { FileService } from '../../src/services/FileService';
import { AuthenticatedAdapter } from '../../src/AuthenticatedAdapter';
import { AxiosMockAdapter } from '../MockAdapter';
import MockAdapter from 'axios-mock-adapter/types';
import { File } from '../../src/types';
describe('Run tests for FileService', () => {
    const mock = new AxiosMockAdapter('http://localhost');

    const mockAuth = (mock: MockAdapter) => {
        mock.onPost('/app/session/token',
            { grant_type: 'session', expires_in: 7200 })
            .reply(200, {
                expires_in: 5000, mage_id: "MAGEID", ust: "TOKEN"
            });
    };
    const authAdapter = new AuthenticatedAdapter(mock, { appSecret: 'pass', appId: 'id' });
    const subject = new FileService(authAdapter);


    test('Test getFile with success', async () => {
        mockAuth(mock.mockAdapter);
        const sampleFile: File = {
            file_upload_id: "String",
            filename: "String",
            content_type: "String",
            size: 41231,
            malware_status: "String",
            file_hash: "String",
            submission_ids: ["1234", "456"],
            is_profile_image: true,
            url: "String"
        };
        mock.mockAdapter.onGet(
            '/files/uploads/someId',
            undefined,
            expect.objectContaining({
                Authorization: expect.stringMatching("Bearer TOKEN"),
            }))
            .reply(200, sampleFile);
        const response = await subject.getFile('someId');
        expect(response).toBeDefined();
        expect(response).toMatchObject<File>(sampleFile);

    });

    test('Test getFile with error', async () => {
        mockAuth(mock.mockAdapter);
        try {
            mock.mockAdapter.onGet(
                '/files/uploads/someId',
                undefined,
                expect.objectContaining({
                    Authorization: expect.stringMatching("Bearer TOKEN"),
                }))
                .reply(
                    400,
                    {
                        "code": 1208,
                        "message": "Insufficient information for Technical Submission"
                    }
                );

            await subject.getFile('someId');
        } catch (e) {
            expect(e.toString()).toMatch("Error: Request failed with status code 400");
        }

    });
});